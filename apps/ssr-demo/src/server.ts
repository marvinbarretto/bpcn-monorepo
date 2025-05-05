console.log('🔧 Starting custom SSR server setup...');

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

// Load environment variables
dotenv.config();

const app = express();
app.set('trust proxy', 1);

// === Paths ===
const distFolder = join(process.cwd(), 'dist/apps/ssr-demo/browser');
const indexHtml = existsSync(join(distFolder, 'index.original.html'))
  ? join(distFolder, 'index.original.html')
  : join(distFolder, 'index.html');

console.log('📁 DIST Folder:', distFolder);
console.log('📄 Index HTML path:', indexHtml);
console.log('📦 Bootstrap module:', bootstrap);

if (!existsSync(indexHtml)) {
  console.error('❌ index.html not found at:', indexHtml);
}

if (!existsSync(distFolder)) {
  console.error('❌ DIST folder not found at:', distFolder);
}

if (!bootstrap) {
  console.error('❌ Bootstrap module not found');
}

// === SSR Engine ===
const engine = new CommonEngine();

// === Middlewares ===
console.log('🔧 Setting up middlewares...');
app.use(compression());
app.use(cors());
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: 'Too many requests, try again later.',
  })
);

// === Static assets ===
console.log('🔧 Setting up static assets middleware...');
app.get(
  '*.*',
  express.static(distFolder, {
    maxAge: '1y',
  })
);

// === Custom Redis route (example) ===
console.log('🔧 Setting up custom Redis route...');
app.get('/api/test-redis', async (req: Request, res: Response) => {
  const redis = await getRedisClient();
  await redis.set('hello', 'world');
  const value = await redis.get('hello');
  res.json({ message: 'Redis is working', value });
});

// === SSR render ===
console.log('🔧 Setting up SSR render middleware...');
app.get('*', (req, res, next) => {
  console.log('🌍 Incoming request:', req.method, req.originalUrl);
  console.log('🧠 Rendering URL:', `${req.protocol}://${req.headers.host}${req.originalUrl}`);

  const { protocol, headers, originalUrl, baseUrl } = req;

  const environment = {
    strapiUrl: process.env['STRAPI_URL'] || 'http://localhost:1337',
    strapiToken: process.env['STRAPI_TOKEN'] || '',
    meiliSearchUrl: process.env['MEILISEARCH_URL'] || 'http://localhost:7700',
    meiliSearchKey: process.env['MEILISEARCH_KEY'] || '',
  };

  console.log('🌍 SSR Request URL:', `${protocol}://${headers.host}${originalUrl}`);
  console.log('🌱 Injecting ENV:', environment);

  engine
    .render({
      bootstrap,
      documentFilePath: indexHtml,
      url: `${protocol}://${headers.host}${originalUrl}`,
      publicPath: distFolder,
      providers: [
        { provide: APP_BASE_HREF, useValue: baseUrl },
        { provide: 'INITIAL_ENV', useValue: environment },
        { provide: 'INITIAL_AUTH_STATE', useValue: { user: null, token: null } },
      ],
    })
    .then(html => res.send(html))
    .catch(err => {
      console.error('❌ SSR render failed:', err);
      res.status(500).send('SSR render error');
    });
});

// === Run ===
console.log('🔧 Setting up server run function...');
async function run(): Promise<void> {
  const port = process.env['PORT'] || 4000;
  const redis = await getRedisClient();

  app.listen(port, () => {
    console.log(`✅ SSR server listening at http://localhost:${port}`);
  });
}

run();
