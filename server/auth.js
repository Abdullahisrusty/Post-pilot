import express from 'express';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

/**
 * Helper to check if developer has configured API keys for a platform
 */
const hasApiKeys = (platform) => {
  const envPrefix = platform.toUpperCase();
  return !!process.env[`${envPrefix}_CLIENT_ID`] && !!process.env[`${envPrefix}_CLIENT_SECRET`];
};

/**
 * Route 1: Initiates the OAuth flow
 * User clicks "Connect" on frontend, frontend redirects here.
 */
router.get('/:platform/login', (req, res) => {
  const { platform } = req.params;
  
  if (!hasApiKeys(platform)) {
    // ---------------------------------------------------------
    // SIMULATION MODE
    // If keys are missing, simulate an OAuth handshake instead of breaking.
    // ---------------------------------------------------------
    console.log(`[OAuth Simulation] Keys missing for ${platform}. Triggering mock redirect.`);
    
    // Simulate the time it takes to redirect to twitter.com and back
    return res.redirect(`${FRONTEND_URL}/app/integrations?oauth_success=true&platform=${platform}&simulated=true`);
  }

  // ---------------------------------------------------------
  // REAL OAUTH MODE
  // Construct the real authorization URL based on the platform
  // ---------------------------------------------------------
  const protocol = req.headers['x-forwarded-proto'] || req.protocol;
  const host = req.get('host');
  const baseUrl = process.env.BACKEND_URL || `${protocol}://${host}`;
  const clientId = process.env[`${platform.toUpperCase()}_CLIENT_ID`];
  const redirectUri = encodeURIComponent(`${baseUrl}/api/auth/${platform}/callback`);
  
  let authUrl = '';
  
  switch (platform.toLowerCase()) {
    case 'twitter':
      authUrl = `https://twitter.com/i/oauth2/authorize?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&scope=tweet.read%20tweet.write%20users.read&state=state&code_challenge=challenge&code_challenge_method=plain`;
      break;
    case 'linkedin':
      authUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&state=state&scope=r_liteprofile%20w_member_social`;
      break;
    case 'reddit':
      authUrl = `https://www.reddit.com/api/v1/authorize?client_id=${clientId}&response_type=code&state=state&redirect_uri=${redirectUri}&duration=permanent&scope=identity%20submit`;
      break;
    case 'instagram':
      authUrl = `https://api.instagram.com/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=user_profile,user_media&response_type=code`;
      break;
    case 'facebook':
      authUrl = `https://www.facebook.com/v17.0/dialog/oauth?client_id=${clientId}&redirect_uri=${redirectUri}&state=state`;
      break;
    default:
      return res.status(400).json({ error: 'Unsupported platform' });
  }

  // Redirect the user to the actual platform's login page
  res.redirect(authUrl);
});

/**
 * Route 2: OAuth Callback
 * The platform redirects the user back here with an authorization code.
 */
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

  try {
    // ---------------------------------------------------------
    // Here is where you will exchange the `code` for an `access_token`
    // using fetch() or axios to the platform's token endpoint.
    // e.g. const token = await exchangeCodeForToken(platform, code);
    // ---------------------------------------------------------
    
    console.log(`Received OAuth code from ${platform}: ${code.substring(0, 10)}...`);
    
    // For now, redirect back to frontend with success
    res.redirect(`${redirectBase}/app/integrations?oauth_success=true&platform=${platform}`);
  } catch (err) {
    console.error('Error exchanging token:', err);
    res.redirect(`${redirectBase}/app/integrations?oauth_success=false&platform=${platform}`);
  }
});

export default router;
