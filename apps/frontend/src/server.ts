import 'zone.js/node';

import { APP_BASE_HREF } from '@angular/common';
import { CommonEngine } from '@angular/ssr/node';
import express, { Request, Response } from 'express';
import compression from 'compression';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import { join } from 'node:path';
import { existsSync } from 'node:fs';
import bootstrap from './main.server';
import dotenv from 'dotenv';
import { getRedisClient } from '../server/redis/redis.client';
import newsRoute from '../server/routes/news.route';
import { USER_THEME_TOKEN } from './libs/tokens/user-theme.token';
import cookieParser from 'cookie-parser';

// === Load environment variables ===
dotenv.config();

const isDev = process.env['NODE_ENV'] !== 'production';
function log(...args: unknown[]) {
  if (isDev) console.log('[SSR]', ...args);
}
function logError(...args: unknown[]) {
  console.error('[SSR:ERROR]', ...args);
}

const app = express();
app.set('trust proxy', 1);

// === Paths ===
const distFolder = join(process.cwd(), 'dist/apps/frontend/browser');
const indexHtml = existsSync(join(distFolder, 'index.original.html'))
  ? join(distFolder, 'index.original.html')
  : join(distFolder, 'index.html');

if (!existsSync(indexHtml)) logError('index.html not found at:', indexHtml);
if (!existsSync(distFolder)) logError('DIST folder not found at:', distFolder);
if (!bootstrap) logError('Bootstrap module not found');

// === SSR Engine ===
const engine = new CommonEngine();

// === Middlewares ===
app.use(compression());
app.use(cors());
app.use(cookieParser());
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: 'Too many requests, try again later.',
  })
);

// === Test Redis Route ===
app.get('/api/test-redis', async (req: Request, res: Response) => {
  try {
    const redis = await getRedisClient();
    await redis.set('hello', 'world');
    const value = await redis.get('hello');
    res.json({ message: 'Redis is working', value });
  } catch (err) {
    logError('Redis test route failed:', err);
    res.status(500).json({ error: 'Redis failure' });
  }
});

// === Custom Routes ===
app.use(newsRoute);

// === Static assets ===
app.get(
  '*.*',
  express.static(distFolder, {
    maxAge: '1y',
  })
);

// === SSR Render Middleware ===
app.get('*', (req, res) => {
  const { protocol, headers, originalUrl, baseUrl } = req;
  const fullUrl = `${protocol}://${headers.host}${originalUrl}`;
  log(`[${req.method}] ${originalUrl}`);

  const theme = req.cookies['userTheme'] ?? 'Default';

  const environment = {
    strapiUrl: process.env['STRAPI_URL'] || 'http://localhost:1337',
    strapiToken: process.env['STRAPI_TOKEN'] || '',
    meiliSearchUrl: process.env['MEILISEARCH_URL'] || 'http://localhost:7700',
    meiliSearchKey: process.env['MEILISEARCH_KEY'] || '',
  };

  engine
    .render({
      bootstrap,
      documentFilePath: indexHtml,
      url: fullUrl,
      publicPath: distFolder,
      providers: [
        { provide: APP_BASE_HREF, useValue: baseUrl },
        { provide: 'INITIAL_ENV', useValue: environment },
        {
          provide: 'INITIAL_AUTH_STATE',
          useValue: { user: null, token: null },
        },
        { provide: USER_THEME_TOKEN, useValue: theme },
      ],
    })
    .then((html) => res.send(html))
    .catch((err) => {
      logError('SSR render failed:', err);
      res.status(500).send('SSR render error');
    });
});

// === Run the Server ===
async function run(): Promise<void> {
  const port = process.env['PORT'] || 4000;

  try {
    await getRedisClient(); // test Redis on startup
  } catch (err) {
    logError('Failed to connect to Redis on startup:', err);
  }

  app.listen(port, () => {
    log(`Server listening at http://localhost:${port}`);
  });
}

run();
