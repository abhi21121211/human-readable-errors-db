const Redis = require("ioredis");
const redis = new Redis(process.env.REDIS_URI);

// Get cached data
exports.getCachedError = async (key) => {
  const cached = await redis.get(key);
  return cached ? JSON.parse(cached) : null;
};

// Set cached data with an expiration time (TTL in seconds)
exports.setCachedError = async (key, data, ttl = 3600) => {
  await redis.set(key, JSON.stringify(data), "EX", ttl);
};
