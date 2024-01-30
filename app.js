'use strict'

const path = require('node:path')
const AutoLoad = require('@fastify/autoload')
const {db} = require("./helpers/db");
const {pitLib} = require("./helpers/pitLib");

// Pass --options via CLI arguments in command to enable these options.
const options = {}
async function onFile(part) {
  console.log("================================")
  const buff = await part.toBuffer()
  part.value = {file:Buffer.from(buff, 'binary'),name:part['filename']} // set `part.value` to specify the request body value
}
module.exports = async function (fastify, opts) {
  await fastify.register(require('@fastify/cors'), {
    origin: '*',
    methods: ['GET', 'PUT', 'POST', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  })

  // fastify.addHook("onRequest", async (request, reply) => {
  //   try {
  //     await request.jwtVerify()
  //   } catch (err) {
  //     reply.send(err)
  //   }
  // })

  // Place here your custom code!
  // Do not touch the following lines

  // This loads all plugins defined in plugins
  // those should be support plugins that are reused
  // through your application
  fastify.register(AutoLoad, {
    dir: path.join(__dirname, 'plugins'),
    options: Object.assign({}, opts)
  })
  // This loads all plugins defined in routes
  // define your routes in one of these
  console.log(db)
  fastify.register(require('@fastify/jwt'), {secret: 'supersecret'})
  fastify.register(require('@fastify/multipart'), { attachFieldsToBody: 'keyValues',limits: { fileSize: 52428800 },preservePath: true,onFile })
  fastify.register(AutoLoad, {
    dir: path.join(__dirname, 'routes'),
    options: Object.assign({}, opts)
  })
  fastify.register(require('@fastify/static'), {
    root: path.join(__dirname, '/public')
  })

  fastify.setErrorHandler(function (error, request, reply) {
    reply.send(pitLib.sendResponse(0,error.toString(),null))
  })
  fastify.addHook('preHandler', (request, reply, done) => {
    // Modify the request body as needed
    request.body=(request.body===undefined)?{}:request.body
    done();
  });
  fastify.decorate("authenticate", async function(request, reply) {
    try {
      await request.jwtVerify()
    } catch (err) {
      reply.send(err)
    }
  })
}

module.exports.options = options
