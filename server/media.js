import { fal } from '@fal-ai/client';
import fetch from 'node-fetch';
import ffmpeg from 'fluent-ffmpeg';
import ffmpegInstaller from '@ffmpeg-installer/ffmpeg';
import fs from 'fs-extra';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import * as googleTTS from 'google-tts-api';
import { fileURLToPath } from 'url';
import os from 'os';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

ffmpeg.setFfmpegPath(ffmpegInstaller.path);

export async function generateMediaHandler(req, res) {
  try {
    const { prompt, type, voiceText } = req.body;
    
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required.' });
    }
    
    const mediaId = uuidv4();
    const tempDir = path.join(os.tmpdir(), 'postpilot-media', mediaId);
    await fs.ensureDir(tempDir);
    
    let result = { type, id: mediaId };

    if (type === 'image' || type === 'video') {
      // 1. Enhance the prompt using Groq so Pollinations generates a much better image
      const Groq = (await import('groq-sdk')).default;
      const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
      
      const promptEnhancer = await groq.chat.completions.create({
        messages: [
          { role: 'system', content: 'You are an expert AI image prompt engineer. The user will give you a rough idea for an ad. Your job is to convert it into a highly detailed, cinematic, photorealistic image prompt. Do NOT include text instructions (like "make an ad"). Just describe the visual scene beautifully in 2-3 sentences. For example: "A sleek modern smartphone floating in a neon green glowing aura, displaying a futuristic AI interface..."' },
          { role: 'user', content: prompt }
        ],
        model: 'llama-3.3-70b-versatile',
        temperature: 0.7,
      });
      
      const enhancedPrompt = promptEnhancer.choices[0]?.message?.content || prompt;
      console.log("Enhanced Image Prompt:", enhancedPrompt);

      // 2. Generate Image using Pollinations.ai
      const safePrompt = encodeURIComponent(enhancedPrompt);
      const seed = Math.floor(Math.random() * 100000);
      result.imageUrl = `https://image.pollinations.ai/prompt/${safePrompt}?width=1280&height=720&nologo=true&seed=${seed}`;
    }
    
    if (type === 'voice' || type === 'video') {
      // 2. Generate Voice using Google TTS (100% Free)
      const textToSpeak = voiceText || prompt;
      
      const audioUrl = googleTTS.getAudioUrl(textToSpeak, {
        lang: 'en',
        slow: false,
        host: 'https://translate.google.com',
      });
      
      const elRes = await fetch(audioUrl);
      
      if (!elRes.ok) {
        throw new Error('Failed to download audio from Google TTS');
      }
      
      const audioBuffer = await elRes.buffer();
      const audioPath = path.join(tempDir, 'audio.mp3');
      await fs.writeFile(audioPath, audioBuffer);
      result.audioUrl = `/api/media/${mediaId}/audio.mp3`;
      
      if (type === 'video') {
        // 3. Combine Image and Audio into a Video
        const imageRes = await fetch(result.imageUrl);
        const imageBuffer = await imageRes.buffer();
        const imagePath = path.join(tempDir, 'image.jpg');
        await fs.writeFile(imagePath, imageBuffer);
        
        const videoPath = path.join(tempDir, 'video.mp4');
        
        await new Promise((resolve, reject) => {
          ffmpeg()
            .input(imagePath)
            .loop(1)
            .input(audioPath)
            .outputOptions([
              '-c:v libx264',
              '-tune stillimage',
              '-c:a aac',
              '-b:a 192k',
              '-pix_fmt yuv420p',
              '-shortest' // ends the video when the shortest input (audio) ends
            ])
            .save(videoPath)
            .on('end', resolve)
            .on('error', reject);
        });
        
        result.videoUrl = `/api/media/${mediaId}/video.mp4`;
      }
    }
    
    res.json(result);
  } catch (error) {
    console.error('Error generating media:', error);
    res.status(500).json({ error: 'Failed to generate media.', details: error.message, stack: String(error.stack) });
  }
}

export function serveMediaHandler(req, res) {
  const { id, file } = req.params;
  const filePath = path.join(os.tmpdir(), 'postpilot-media', id, file);
  if (fs.existsSync(filePath)) {
    res.sendFile(filePath);
  } else {
    res.status(404).send('Media not found');
  }
}
