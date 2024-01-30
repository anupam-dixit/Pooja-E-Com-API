const Joi = require("joi");
const {pitLib} = require("../helpers/pitLib");
const {SubCategory} = require("../models/SubCategoryModel");
const {isValidObjectId} = require("mongoose");
const mongoose = require("mongoose");
const {Category} = require("../models/CategoryModel");
exports.SubCategoryMiddleware = {
    create :async (request, reply) => {
        jSchema=Joi.object({
            title:Joi.string().required(),
            category_id:Joi.string().required(),
            image:Joi.required()
        })
        validation=jSchema.validate(request.body)
        if (!validation.error){
            r=await SubCategory.findOne({title:request.body.title})
            if (r){
                validation.error={message:'Already in Database'}
            }
            r=await Category.findById(request.body.category_id)
            if (!r){
                validation.error={message:'Invalid category id'}
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
            r=await SubCategory.findOne({_id:request.body._id})
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
        r=await SubCategory.findOne({_id:request.params._id})
        if (!r){
            reply.send(pitLib.sendResponse(null,'Incorrect Id'))
        }
        request.params._id=new mongoose.Types.ObjectId(request.params._id)
    },
};