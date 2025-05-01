import { Request, Response, NextFunction } from 'express';
import { redisClient } from '../redis/redis.client';

export async function checkCache(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await redisClient.get('newsData');
    if (data) {
      console.log('✅ Served from Redis cache');
      res.send(JSON.parse(data));
    } else {
      next();
    }
  } catch (err) {
    console.error('Redis middleware error:', err);
    res.status(500).send('Redis error');
  }
}
