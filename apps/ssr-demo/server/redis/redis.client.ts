import { createClient } from 'redis';

let client: ReturnType<typeof createClient>;

export async function getRedisClient() {
  if (!client) {
    client = createClient({
      url: `redis://${process.env['REDIS_HOST'] || '127.0.0.1'}:${process.env['REDIS_PORT'] || 6379}`,
    });

    client.on('ready', () => console.log('🟢 Redis is ready'));
    client.on('error', (err) => console.error('🔴 Redis error:', err));
    client.on('end', () => console.log('🔌 Redis connection closed'));

    await client.connect();
    console.log('✅ Redis connected');
  }
  return client;
}
