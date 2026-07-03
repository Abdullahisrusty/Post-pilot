import { fal } from '@fal-ai/client';
import fetch from 'node-fetch';
import ffmpeg from 'fluent-ffmpeg';
import ffmpegInstaller from '@ffmpeg-installer/ffmpeg';
import fs from 'fs-extra';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { MsEdgeTTS, OUTPUT_FORMAT } from 'msedge-tts';
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

    // 1. The AI Director (Groq)
    const Groq = (await import('groq-sdk')).default;
    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
    
    const directorPrompt = `You are an expert AI Video Ad Director. The user will give you a prompt for an ad.
Your job is to write a highly engaging, punchy voiceover script (around 15 to 20 seconds spoken, approximately 30 to 50 words) and a beautiful cinematic image prompt to match it. Do NOT make the script too short. Make it sound like a real, exciting TikTok/Reel ad.
Return valid JSON exactly in this format:
{
  "script": "Are you tired of forgetting important tasks? Stop juggling a dozen apps. Meet your new WhatsApp AI assistant. Just text it a reminder, and it handles the rest. Try it today and supercharge your productivity!",
  "visual": "A sleek modern smartphone floating in a neon green glowing aura, displaying a futuristic AI interface..."
}`;
    
    const directorResponse = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: directorPrompt },
        { role: 'user', content: prompt }
      ],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.7,
      response_format: { type: 'json_object' }
    });
    
    let aiResponse = { script: prompt, visual: prompt };
    try {
      aiResponse = JSON.parse(directorResponse.choices[0]?.message?.content);
      console.log("AI Director:", aiResponse);
    } catch (e) {
      console.error("Failed to parse AI Director JSON");
    }

    if (type === 'image' || type === 'video') {
      // 2. Generate Image using Pollinations.ai
      const safePrompt = encodeURIComponent(aiResponse.visual);
      const seed = Math.floor(Math.random() * 100000);
      result.imageUrl = `https://image.pollinations.ai/prompt/${safePrompt}?width=1280&height=720&nologo=true&seed=${seed}`;
    }
    
    if (type === 'voice' || type === 'video') {
      // 3. Generate Voice using highly realistic Microsoft Edge TTS (100% Free)
      const textToSpeak = voiceText || aiResponse.script;
      
      const tts = new MsEdgeTTS();
      await tts.setMetadata('en-US-AriaNeural', OUTPUT_FORMAT.AUDIO_24KHZ_48KBITRATE_MONO_MP3);
      await tts.toFile(tempDir, textToSpeak);
      // toFile automatically saves it as audio.mp3 inside tempDir
      const audioPath = path.join(tempDir, 'audio.mp3');
      
      result.audioUrl = `/api/media/${mediaId}/audio.mp3`;
      
      if (type === 'video') {
        // 4. Combine Image and Audio into a Video with Cinematic Motion
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
            .complexFilter([
              "zoompan=z='min(zoom+0.0015,1.5)':d=700:x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)'"
            ])
            .outputOptions([
              '-c:v libx264',
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
