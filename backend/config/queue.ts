import Queue from 'bull';

const redisConfig = {
  host: process.env.REDIS_HOST || 'localhost',
  port: Number(process.env.REDIS_PORT) || 6379
};

export const orderQueue = new Queue('order-processing', {
  redis: redisConfig
});

export const emailQueue = new Queue('email-notifications', {
  redis: redisConfig 
});

export const reportQueue = new Queue('report-generation', {
  redis: redisConfig
});