import fetch from 'node-fetch';
import * as path from 'path';
import * as dotenv from 'dotenv';

// Load token from apps/strapi/.env
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const API_URL = process.env.STRAPI_URL || 'http://localhost:1337';
const TOKEN = process.env.STRAPI_SEEDER_TOKEN;

async function seedEvents() {
  if (!TOKEN) {
    console.error('❌ STRAPI_SEEDER_TOKEN is missing from environment variables.');
    process.exit(1);
  }

  console.log('🌱 Seeding events...');

  const events = [
    {
      title: 'Guild Summer Meetup',
      date: new Date().toISOString(),
      location: 'London Guildhall',
      eventStatus: 'Approved',
      slug: 'guild-summer-meetup',
      content: [], // Empty block content
      seo: null,
      hero: null
    }
  ];

  for (const event of events) {
    try {
      const res = await fetch(`${API_URL}/api/events`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${TOKEN}`
        },
        body: JSON.stringify({ data: event })
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(JSON.stringify(json.error, null, 2));
      }

      console.log(`✅ Created event: ${event.title}`);
    } catch (error) {
      console.error(`❌ Failed to create event: ${event.title}`, error);
    }
  }

  console.log('🎉 Done seeding events.');
}

seedEvents();
