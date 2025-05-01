import { Router } from 'express';
import axios from 'axios';
import { redisClient } from '../redis/redis.client'
import { checkCache } from '../middleware/check-cache.middleware';

const router = Router();

const NEWS_CACHE_TTL = Number(process.env['NEWS_CACHE_TTL_DAYS'] || 28) * 86400;
const rssUrl = `https://news.google.com/rss/search?q=prostate+cancer&hl=en-GB&gl=GB&ceid=GB:en`;

router.get('/api/news', checkCache, async (req, res) => {
  try {
    console.log('🔄 Fetching fresh RSS feed');
    const response = await axios.get(rssUrl);

    await redisClient.setEx('newsData', NEWS_CACHE_TTL, JSON.stringify(response.data));
    console.log('✅ Cached new data in Redis');

    res.send(response.data);
  } catch (error) {
    console.error('❌ Error fetching news:', error);
    res.status(500).send('Error fetching news');
  }
});

export default router;
