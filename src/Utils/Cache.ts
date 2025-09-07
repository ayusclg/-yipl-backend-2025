import Redis from "ioredis";

export const redis = new Redis({
  host: "redis",
  port: 6379,
});
redis.on("connect", () => {
  console.log("Redis Successfully Connected");
});
redis.on("error", () => {
  console.log("Error In Redis");
});

export const setCacheOrGet = async <T>(
  key: string,
  fetchFnc: () => Promise<T>,
  ttl = 300
): Promise<T> => {
  const cacheData = await redis.get(key);
  if (cacheData != null) {
    return JSON.parse(cacheData) as T;
  } else {
    const freshData = await fetchFnc();
    redis.set(key, JSON.stringify(freshData), "EX", ttl);
    return freshData;
  }
};
