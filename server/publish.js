import express from 'express';
import { TwitterApi } from 'twitter-api-v2';
import { getTokens, savePost } from './db.js';

const router = express.Router();

router.post('/', async (req, res) => {
  const { userId, content, platforms } = req.body;

  if (!userId || !content || !platforms || platforms.length === 0) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const results = [];
  const tokens = await getTokens(userId);

  for (const platform of platforms) {
    if (platform.toLowerCase() === 'twitter' || platform.toLowerCase() === 'x') {
      try {
        if (!tokens || !tokens.twitter || !tokens.twitter.accessToken) {
          throw new Error('No Twitter access token found for user. Please connect your account first.');
        }

        const client = new TwitterApi(tokens.twitter.accessToken);
        
        // Post the tweet
        const tweetResponse = await client.v2.tweet(content);
        
        // Save the post in our local DB for the History tab
        await savePost({
          userId,
          platform: 'X',
          preview: content.substring(0, 50) + '...',
          fullContent: content,
          likes: 0,
          comments: 0,
          shares: 0,
          externalId: tweetResponse.data.id
        });

        results.push({ platform, status: 'success', data: tweetResponse.data });
      } catch (err) {
        console.error(`Error publishing to ${platform}:`, err);
        results.push({ platform, status: 'error', error: err.message });
      }
    } else {
      // For other platforms that aren't integrated yet, simulate success
      await savePost({
        userId,
        platform,
        preview: content.substring(0, 50) + '...',
        fullContent: content,
        likes: 0,
        comments: 0,
        shares: 0
      });
      results.push({ platform, status: 'simulated_success' });
    }
  }

  res.json({ success: true, results });
});

export default router;
