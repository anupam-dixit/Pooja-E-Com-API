const Joi = require("joi");
const {pitLib} = require("../helpers/pitLib");
const {Role} = require("../models/RoleModel");
const {Category} = require("../models/CategoryModel");
const {isValidObjectId} = require("mongoose");
const mongoose = require("mongoose");
exports.CategoryMiddleware = {
    create :async (request, reply) => {
        jSchema=Joi.object({
            title:Joi.string().required(),
            image:Joi.required()
        })
        validation=jSchema.validate(request.body)
        if (!validation.error){
            request.body.slug=pitLib.util.trimToCode(request.body.title,'-').toLowerCase()
            r=await Category.findOne({slug: request.body.title})
            if (r){
                validation.error={message:'Already in Database'}
            }
        }
        if (validation.error){
            reply.send(pitLib.sendResponse(null,validation.error.message))
        }
    },
    list :async (request, reply) => {
        if (request.body&&request.body._id!==undefined){
            if (!isValidObjectId(request.body._id)){
                reply.send(pitLib.sendResponse(null,'Invalid Id'))
            }
            r=await Category.findOne({_id:request.body._id})
            if (!r){
                reply.send(pitLib.sendResponse(null,'Incorrect Id'))
            }
            request.body._id=new mongoose.Types.ObjectId(request.body._id)
        }
    },
    edit :async (request, reply) => {
        if (request.params._id===undefined||!isValidObjectId(request.params._id)){
            reply.send(pitLib.sendResponse(null,'Invalid Id'))
        }
        r=await Category.findOne({_id:request.params._id})
        if (!r){
            reply.send(pitLib.sendResponse(null,'Incorrect Id'))
        }
        request.body.slug=pitLib.util.trimToCode(request.body.title,'-').toLowerCase()
        r=await Category.find({slug: request.body.slug}).countDocuments()
        if (r>1){
            validation.error={message:'Already in Database'}
        }
        request.params._id=new mongoose.Types.ObjectId(request.params._id)
    },
};