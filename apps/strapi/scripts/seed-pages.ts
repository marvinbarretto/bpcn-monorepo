import fetch from 'node-fetch';
import * as path from 'path';
import * as dotenv from 'dotenv';

// Load token from apps/strapi/.env
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const API_URL = process.env.STRAPI_URL || 'http://localhost:1337';
const TOKEN = process.env.STRAPI_SEEDER_TOKEN;

async function seedPages() {
  if (!TOKEN) {
    console.error('❌ STRAPI_SEEDER_TOKEN is missing from environment variables.');
    process.exit(1);
  }

  console.log('🌱 Seeding pages...');

  const pages = [
    {
      title: 'About the Guild',
      slug: 'about',
      content: [], // Empty blocks
      description: 'Learn more about our history and mission.',
      primaryNavigation: true,
      seo: [],
      hero: null
    }
  ];

  for (const page of pages) {
    try {
      const res = await fetch(`${API_URL}/api/pages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${TOKEN}`
        },
        body: JSON.stringify({ data: page })
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(JSON.stringify(json.error, null, 2));
      }

      console.log(`✅ Created page: ${page.title}`);
    } catch (error) {
      console.error(`❌ Failed to create page: ${page.title}`, error);
    }
  }

  console.log('🎉 Done seeding pages.');
}

seedPages();
