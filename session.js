const session = require('express-session');
const RedisStore = require('connect-redis')(session);
const redisClient = require('./redis');
require('dotenv').config();

const sessionStore = new RedisStore({
    client: redisClient,
    unset: "destroy"
});

const settings = {
    store: sessionStore, // or session.MemoryStore
    secret: process.env.SESSION_SECRET,
    cookie: { "path": '/', "httpOnly": true, "secure": false,  "maxAge": null }
};

module.exports.settings = settings