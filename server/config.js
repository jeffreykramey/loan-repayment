const {Method} = require('method-node');
const {PrismaClient} = require('@prisma/client');
const throttledQueue = require('throttled-queue');

require('dotenv').config();

const method = new Method({
    apiKey: process.env.METHOD_API_KEY,
    env: process.env.ENV,
});

const prisma = new PrismaClient();

// Throttle requests to 590 per minute
const throttle = throttledQueue(590, 60000);

module.exports = {method, prisma, throttle}