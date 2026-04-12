import Redis from "ioredis";

const REDIS_URI = process.env.REDIS_URI;

if (!REDIS_URI) {
  console.warn("REDIS_URI not found in environment variables. Caching will be disabled.");
}

let redis: Redis | null = null;

if (REDIS_URI) {
  const globalRedis = (global as any).__redis;
  if (globalRedis) {
    redis = globalRedis;
  } else {
    redis = new Redis(REDIS_URI, {
      maxRetriesPerRequest: 3,
      retryStrategy(times) {
        return Math.min(times * 200, 2000);
      },
    });
    (global as any).__redis = redis;
  }
}

export async function getCache<T>(key: string): Promise<T | null> {
  if (!redis) return null;
  try {
    const data = await redis.get(key);
    return data ? (JSON.parse(data) as T) : null;
  } catch (error) {
    console.error(`Redis get error for key ${key}:`, error);
    return null;
  }
}

export async function setCache(key: string, data: any, expirationInSeconds: number = 3600) {
  if (!redis) return;
  try {
    await redis.set(key, JSON.stringify(data), "EX", expirationInSeconds);
  } catch (error) {
    console.error(`Redis set error for key ${key}:`, error);
  }
}

export async function invalidateCache(key: string) {
  if (!redis) return;
  try {
    await redis.del(key);
  } catch (error) {
    console.error(`Redis del error for key ${key}:`, error);
  }
}

export default redis;
