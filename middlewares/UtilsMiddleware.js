const fastify = require("fastify");
require('dotenv').config();
exports.UtilsMiddleware = {
    pagination :async (request, reply) => {
        request.query.pagination=request.query.pagination??process.env.PAGE_SIZE
        request.query.page=request.query.page??'1'
    },
};