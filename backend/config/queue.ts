import Queue from 'bull';

const redisConfig = {
  host: process.env.REDIS_HOST || 'localhost',
  port: Number(process.env.REDIS_PORT) || 6379,
  tls: process.env.NODE_ENV === 'production' ? {} : undefined
};

export const orderQueue = new Queue('order-processing', {
  redis: redisConfig
});


export const emailQueue = new Queue('email-notifications', {
  redis: redisConfig,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 1000
    }
  }
});

export const reportQueue = new Queue('report-generation', {
  redis: redisConfig,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 2000
    },
    removeOnComplete: 100,
    removeOnFail: 200
  }
});