const redis  = require('redis');

const redisClient = redis.createClient({
    host : 'localhost',   //To be changed in production
    port : 6379
});

module.exports = redisClient;