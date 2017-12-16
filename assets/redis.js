//connect to redis
const redis = require('redis').createClient();

//check radis connection status
redis.on('connect',function(){
    console.log('Connect to Redis...')
})
redis.on('error',function(err){
    console.log(err);
});

module.exports = redis;