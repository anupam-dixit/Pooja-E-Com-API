const {pitLib} = require("../helpers/pitLib");
const Joi = require("joi");
const {Product} = require("../models/ProductModel");
const mongoose = require("mongoose");
const {isValidObjectId} = require("mongoose");
const {Category} = require("../models/CategoryModel");
const {User} = require("../models/UserModel");
exports.ProductMiddleware = {
    create :async (request, reply) => {
        if (request.body.discount){
            request.body.discount = JSON.parse(request.body.discount)
        }
        jSchema=Joi.object({
            title:Joi.string().required(),
            category:Joi.string().required().custom(pitLib.joi.oid),
            unit:Joi.string().required().custom(pitLib.joi.oid),
            mrp:Joi.number().required().min(0),
            price:Joi.number().min(0).optional(),
            discount: Joi.object({
                type: Joi.string().required().valid('f', 'p'),
                amount: Joi.number().required()
            }),
            default: Joi.boolean().optional(),
            stock: Joi.number().required().min(0),
            description : Joi.string().optional(),
            status: Joi.boolean().optional(),
            search_keywords: Joi.string().optional(),
            images: Joi.array().required(),
            youtube: Joi.string().optional(),
        })
        validation=jSchema.validate(request.body)
        if (validation.error){
            return reply.send(pitLib.sendResponse(null,validation.error.message))
        }
        if (!request.body.price){
            request.body.price=12
        }
        request.body.created_by=request.headers.user_data._id
        request.body.slug=pitLib.util.trimToCode(request.body.title,'-')
        if (await Product.find({slug:request.body.slug}).countDocuments()>0){
            return reply.send(pitLib.sendResponse(0,'Matching name already exists'))
        }
    },
    edit :async (request, reply) => {
        if (request.params._id===undefined||!isValidObjectId(request.params._id)){
            return reply.send(pitLib.sendResponse(null,'Invalid Id'))
        }
        r=await Product.findOne({_id:request.params._id})
        if (!r){
            return reply.send(pitLib.sendResponse(null,'Incorrect Id'))
        }
        request.params._id=new mongoose.Types.ObjectId(request.params._id)
        if (request.body.discount){
            request.body.discount = JSON.parse(request.body.discount)
        }
        jSchema=Joi.object({
            title:Joi.string().required(),
            category:Joi.string().required().custom(pitLib.joi.oid),
            unit:Joi.string().required().custom(pitLib.joi.oid),
            mrp:Joi.number().required().min(0),
            price:Joi.number().min(0).optional(),
            discount: Joi.object({
                type: Joi.string().required().valid('f', 'p'),
                amount: Joi.number().required()
            }),
            default: Joi.boolean().optional(),
            stock: Joi.number().required().min(0),
            description : Joi.string().optional(),
            status: Joi.boolean().optional(),
            search_keywords: Joi.string().optional(),
            youtube: Joi.string().optional(),
        })
        validation=jSchema.validate(request.body)
        if (validation.error){
            return reply.send(pitLib.sendResponse(null,validation.error.message))
        }
        if (!request.body.price){
            request.body.price=12
        }
        request.body.slug=pitLib.util.trimToCode(request.body.title,'-')
        if (await Product.find({slug:request.body.slug}).countDocuments()>1){
            return reply.send(pitLib.sendResponse(0,'Matching name already exists'))
        }
    },
    list :async (request, reply) => {
        let s=Joi.object({
            _id:Joi.string().optional().custom(pitLib.joi.oid),
            category:Joi.string().optional().custom(pitLib.joi.oid),
        })
        v=s.validateAsync(request.body).catch(e=>{
            return reply.send(pitLib.sendResponse(0,e.message))
        })

        if (request.body._id){
            r=await Product.findOne({_id:request.body._id})
            if (!r){
                return reply.send(pitLib.sendResponse(null,'Incorrect Id'))
            }
            request.body._id=pitLib.oid(request.body._id)
        }
        if (request.body.category){
            r=await Category.findOne({_id:request.body.category})
            if (!r){
                return reply.send(pitLib.sendResponse(null,'Incorrect category id'))
            }
            request.body.category=pitLib.oid(request.body.category)
        }
    },
};