import { APP_BASE_HREF } from '@angular/common';
import { CommonEngine } from '@angular/ssr/node';
import express from 'express';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';
import bootstrap from './src/main.server';
import compression from 'compression';
import * as dotenv from 'dotenv';
import axios from 'axios';
import cors from 'cors';
import { createClient } from 'redis';
import rateLimit from 'express-rate-limit';
import { Request, Response, NextFunction } from 'express';

// Load environment variables
dotenv.config();

// Create Redis client
const redisClient = createClient({
  url: `redis://${process.env['REDIS_HOST'] || '127.0.0.1'}:${process.env['REDIS_PORT'] || 6379}`,
});

// Connect to Redis
const connectRedis = async () => {
  try {
    await redisClient.connect();
    console.log('Redis client connected');
  } catch (err) {
    console.error('Error connecting to Redis:', err);
    setTimeout(connectRedis, 5000);
  }
};

// Redis event listeners
redisClient.on('ready', () => console.log('Redis is ready'));
redisClient.on('error', (err) => console.error('Redis error:', err));
redisClient.on('end', () => console.log('Redis connection closed'));

// Cache TTL (28 days by default)
const NEWS_CACHE_TTL = process.env['NEWS_CACHE_TTL_DAYS']
  ? parseInt(process.env['NEWS_CACHE_TTL_DAYS']) * 24 * 60 * 60
  : 2419200;

// RSS feed URL
const rssUrl = `https://news.google.com/rss/search?q=prostate+cancer&hl=en-GB&gl=GB&ceid=GB:en`;

const app = express();
app.set('trust proxy', 1); 

const distFolder = join(process.cwd(), 'dist', 'frontend');
const browserDistFolder = join(distFolder, 'browser');
const serverDistFolder = join(distFolder, 'server');
const indexHtml = join(browserDistFolder, 'index.html');

console.log('Server dist folder:', serverDistFolder);
console.log('Browser dist folder:', browserDistFolder);

const commonEngine = new CommonEngine();

// Set up view engine
app.set('view engine', 'html');
app.set('views', browserDistFolder);

// Enable Gzip compression
app.use(compression());

// Enable CORS
app.use(cors());

// Rate Limiting middleware
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per window
  message: 'Too many requests, try again later!',
});
app.use(limiter);

// Middleware to check Redis cache for news data
const checkCache = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await redisClient.get('newsData');
    if (data) {
      console.log('Serving from Redis cache');
      res.send(JSON.parse(data));
    } else {
      next(); // No cache, proceed to fetch data
    }
  } catch (err) {
    console.error('Redis error:', err);
    res.status(500).send('Redis error');
  }
  return; // Explicit return statement
};

// Route to get news with caching
app.get('/api/news', checkCache, async (req, res) => {
  try {
    console.log('Fetching fresh data from API');
    const response = await axios.get(rssUrl);

    // Cache the response in Redis
    await redisClient.setEx('newsData', NEWS_CACHE_TTL, JSON.stringify(response.data));
    console.log('Data successfully cached in Redis');

    res.send(response.data);
  } catch (error) {
    console.error('Error fetching news from API:', error);
    res.status(500).send('Error fetching news');
  }
});

// Serve static files from /browser
app.get('**', express.static(browserDistFolder, {
  maxAge: '1y',
  index: 'index.html',
}));


const defaultAuthState = {
  user: null,
  token: null,
};

// All regular routes use the Angular Universal engine for SSR
app.get('**', (req, res, next) => {
  const { protocol, originalUrl, baseUrl, headers } = req;

  const environment = {
    strapiUrl: process.env['STRAPI_URL'] || 'http://localhost:1337',
    strapiToken: process.env['STRAPI_TOKEN'] || '',
    meiliSearchUrl: process.env['MEILISEARCH_URL'] || 'http://localhost:7700',
    meiliSearchKey: process.env['MEILISEARCH_KEY'] || ''
  }

  console.log('Environment', environment);

  commonEngine
    .render({
      bootstrap,
      documentFilePath: indexHtml,
      url: `${protocol}://${headers.host}${originalUrl}`,
      publicPath: browserDistFolder,
      providers: [
        { provide: APP_BASE_HREF, useValue: baseUrl },
        { provide: 'INITIAL_ENV', useValue: environment },
        { provide: 'INITIAL_AUTH_STATE', useValue: defaultAuthState },
      ],
    })
    .then((html) => res.send(html))
    .catch((err) => {
      console.error('SSR rendering error:', err);
      res.status(500).send('Internal Server Error');
    });
});

// Function to start the server
async function run() {
  const port = process.env['PORT'] || 4000;

  // Ensure Redis is connected before starting the server
  await connectRedis();

  app.listen(port, () => {
    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

console.log('Environment Variables:', {
  strapiUrl: process.env['STRAPI_URL'],
  strapiToken: process.env['STRAPI_TOKEN'],
});

run();
