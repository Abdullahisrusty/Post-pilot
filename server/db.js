import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const TOKENS_FILE = path.join(__dirname, 'data', 'tokens.json');
const POSTS_FILE = path.join(__dirname, 'data', 'posts.json');

export async function getTokens(userId) {
  try {
    const data = await fs.readFile(TOKENS_FILE, 'utf8');
    const tokens = JSON.parse(data);
    return tokens[userId] || null;
  } catch (err) {
    return null;
  }
}

export async function saveToken(userId, platform, tokenData) {
  try {
    const data = await fs.readFile(TOKENS_FILE, 'utf8');
    const tokens = JSON.parse(data);
    if (!tokens[userId]) tokens[userId] = {};
    tokens[userId][platform] = tokenData;
    await fs.writeFile(TOKENS_FILE, JSON.stringify(tokens, null, 2));
  } catch (err) {
    console.error('Error saving token:', err);
  }
}

export async function savePost(post) {
  try {
    const data = await fs.readFile(POSTS_FILE, 'utf8');
    const posts = JSON.parse(data);
    posts.unshift({
      id: Date.now().toString(),
      ...post,
      publishedAt: new Date().toISOString()
    });
    await fs.writeFile(POSTS_FILE, JSON.stringify(posts, null, 2));
  } catch (err) {
    console.error('Error saving post:', err);
  }
}

export async function getPosts(userId) {
  try {
    const data = await fs.readFile(POSTS_FILE, 'utf8');
    const posts = JSON.parse(data);
    // Simple filter by userId if we have it, else return all for MVP
    return posts.filter(p => !userId || p.userId === userId);
  } catch (err) {
    return [];
  }
}
