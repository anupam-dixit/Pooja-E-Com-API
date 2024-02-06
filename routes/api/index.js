'use strict'
const {UserController} = require("../../controllers/UserController");
const {UserMiddleware} = require("../../middlewares/UserMiddleware");
const {AccessMiddleware} = require("../../middlewares/AccessMiddleware");
const {AccessController} = require("../../controllers/AccessController");
const {UtilsMiddleware} = require("../../middlewares/UtilsMiddleware");
const {SubCategoryMiddleware} = require("../../middlewares/SubCategoryMiddleware");
const {CategoryController} = require("../../controllers/CategoryController");
const {CategoryMiddleware} = require("../../middlewares/CategoryMiddleware");
const {SubCategoryController} = require("../../controllers/SubCategoryController");
const {ProductMiddleware} = require("../../middlewares/ProductMiddleware");
const {ProductController} = require("../../controllers/ProductController");
const {UnitMiddleware} = require("../../middlewares/UnitMiddleware");
const {UnitController} = require("../../controllers/UnitController");
const {CartMiddleware} = require("../../middlewares/CartMiddleware");
const {CartController} = require("../../controllers/CartController");

module.exports = async function (fastify, opts) {
  fastify.get('/uploads', function (req, reply) {
    reply.sendFile('myHtml.html') // serving path.join(__dirname, 'public', 'myHtml.html') directly
  })

  fastify.post('/user/login',{preHandler:UserMiddleware.login}, UserController.login)
  fastify.post('/user/create',{preHandler:[UserMiddleware.create]}, UserController.create)

  fastify.post('/role/create',{preHandler:AccessMiddleware.createRole}, AccessController.createRole)
  fastify.post('/role/list',{preHandler:[AccessMiddleware.listRole,UtilsMiddleware.pagination]}, AccessController.listRole)
  fastify.post('/role/edit/:_id',{preHandler:[AccessMiddleware.editRole]}, AccessController.editRole)
  fastify.get('/role/dtlist',{preHandler:AccessMiddleware.dtlistRole}, AccessController.dtlistRole)

  fastify.post('/category/create',{preHandler:[fastify.authenticate,CategoryMiddleware.create]}, CategoryController.create)
  fastify.post('/category/list',{preHandler:[CategoryMiddleware.list,UtilsMiddleware.pagination]}, CategoryController.list)
  fastify.post('/category/edit/:_id',{preHandler:[CategoryMiddleware.edit]}, CategoryController.edit)
  fastify.get('/category/dtlist', CategoryController.dtlist)

  fastify.post('/sub-category/create',{preHandler:SubCategoryMiddleware.create}, SubCategoryController.create)
  fastify.post('/sub-category/list',{preHandler:[SubCategoryMiddleware.list,UtilsMiddleware.pagination]}, SubCategoryController.list)
  fastify.post('/sub-category/edit/:_id',{preHandler:[SubCategoryMiddleware.edit]}, SubCategoryController.edit)
  fastify.get('/sub-category/dtlist', SubCategoryController.dtlist)

  fastify.post('/product/create',{preHandler:[fastify.authenticate,ProductMiddleware.create]}, ProductController.create)
  fastify.post('/product/edit/:_id',{preHandler:[fastify.authenticate,ProductMiddleware.edit]}, ProductController.edit)
  fastify.post('/product/list',{preHandler:[ProductMiddleware.list,UtilsMiddleware.pagination]}, ProductController.list)
  fastify.get('/product/dtlist', ProductController.dtlist)

  fastify.post('/unit/create',{preHandler:[fastify.authenticate,UnitMiddleware.create]}, UnitController.create)
  fastify.post('/unit/list',{preHandler:[UnitMiddleware.list,UtilsMiddleware.pagination]}, UnitController.list)
  fastify.post('/unit/edit/:_id',{preHandler:[fastify.authenticate,UnitMiddleware.edit]}, UnitController.edit)
  fastify.get('/unit/dtlist', UnitController.dtlist)

  fastify.post('/cart/create',{preHandler:[fastify.authenticate,CartMiddleware.create]}, CartController.create)
}
