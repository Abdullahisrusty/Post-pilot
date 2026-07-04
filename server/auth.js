import express from 'express';
import dotenv from 'dotenv';
import { TwitterApi } from 'twitter-api-v2';
import { saveToken } from './db.js';

dotenv.config();

const router = express.Router();

// Simple in-memory session store for OAuth state & PKCE codeVerifier
const oauthSessions = new Map();

/**
 * Helper to check if developer has configured API keys for a platform
 */
const hasApiKeys = (platform) => {
  const envPrefix = platform.toUpperCase();
  return !!process.env[`${envPrefix}_CLIENT_ID`] && !!process.env[`${envPrefix}_CLIENT_SECRET`];
};

router.get('/:platform/login', (req, res) => {
  const { platform } = req.params;
  const { userId } = req.query;
  
  if (!userId) {
    return res.status(400).send('Missing userId');
  }

  const protocol = req.headers['x-forwarded-proto'] || req.protocol;
  const host = req.get('host');
  const baseUrl = process.env.BACKEND_URL || `${protocol}://${host}`;
  const frontendUrl = process.env.FRONTEND_URL || (host.includes('localhost') ? 'http://localhost:5173' : baseUrl);
  
  if (!hasApiKeys(platform)) {
    console.log(`[OAuth Simulation] Keys missing for ${platform}. Triggering mock redirect.`);
    return res.redirect(`${frontendUrl}/app/integrations?oauth_success=true&platform=${platform}&simulated=true`);
  }

  const clientId = process.env[`${platform.toUpperCase()}_CLIENT_ID`];
  const clientSecret = process.env[`${platform.toUpperCase()}_CLIENT_SECRET`];
  const redirectUri = `${baseUrl}/api/auth/${platform}/callback`;
  
  if (platform.toLowerCase() === 'twitter') {
    const client = new TwitterApi({ clientId, clientSecret });
    const { url, codeVerifier, state } = client.generateOAuth2AuthLink(redirectUri, { scope: ['tweet.read', 'tweet.write', 'users.read', 'offline.access'] });
    
    // Store session info (expires in 10 mins)
    oauthSessions.set(state, { codeVerifier, userId, platform, redirectUri });
    setTimeout(() => oauthSessions.delete(state), 10 * 60 * 1000);
    
    return res.redirect(url);
  }
  
  // Fallback for other platforms (simplified)
  let authUrl = '';
  switch (platform.toLowerCase()) {
    case 'linkedin':
      authUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&state=state&scope=r_liteprofile%20w_member_social`;
      break;
    default:
      return res.status(400).json({ error: 'Unsupported platform' });
  }

  res.redirect(authUrl);
});

router.get('/:platform/callback', async (req, res) => {
  const { platform } = req.params;
  const { code, state, error } = req.query;
  const protocol = req.headers['x-forwarded-proto'] || req.protocol;
  const host = req.get('host');
  const redirectBase = process.env.FRONTEND_URL || (host.includes('localhost') ? 'http://localhost:5173' : `${protocol}://${host}`);

  if (error) {
    console.error(`OAuth error from ${platform}:`, error);
    return res.redirect(`${redirectBase}/app/integrations?oauth_success=false&platform=${platform}&error=${error}`);
  }

  if (!code) {
    return res.status(400).send('Authorization code missing');
  }

  if (platform.toLowerCase() === 'twitter') {
    const session = oauthSessions.get(state);
    if (!session) {
      console.error('Session expired or invalid state for Twitter OAuth');
      return res.redirect(`${redirectBase}/app/integrations?oauth_success=false&platform=${platform}&error=session_expired`);
    }

    try {
      const clientId = process.env.TWITTER_CLIENT_ID;
      const clientSecret = process.env.TWITTER_CLIENT_SECRET;
      
      // Instantiate a client to exchange the code
      const client = new TwitterApi({ clientId, clientSecret });
      
      const { accessToken, refreshToken, expiresIn } = await client.loginWithOAuth2({
        code,
        codeVerifier: session.codeVerifier,
        redirectUri: session.redirectUri,
      });

      // Save tokens to DB
      await saveToken(session.userId, 'twitter', { accessToken, refreshToken, expiresIn, updated_at: Date.now() });
      
      console.log(`Successfully authenticated Twitter for user ${session.userId}`);
      oauthSessions.delete(state);
      
      return res.redirect(`${redirectBase}/app/integrations?oauth_success=true&platform=${platform}`);
    } catch (err) {
      console.error('Error exchanging Twitter token:', err);
      return res.redirect(`${redirectBase}/app/integrations?oauth_success=false&platform=${platform}`);
    }
  }

  // Fallback for other platforms
  res.redirect(`${redirectBase}/app/integrations?oauth_success=true&platform=${platform}&simulated=true`);
});

export default router;
