const Joi = require("joi");
const {pitLib} = require("../helpers/pitLib");
const {Role} = require("../models/RoleModel");
const {Product} = require("../models/ProductModel");
const {Category} = require("../models/CategoryModel");
const {Unit} = require("../models/UnitModel");
const {isValidObjectId} = require("mongoose");
const mongoose = require("mongoose");
exports.UnitMiddleware = {
    create :async (request, reply) => {
        jSchema=Joi.object({
            title:Joi.string().required(),
        })
        validation=jSchema.validate(request.body)
        if (validation.error){
            reply.send(pitLib.sendResponse(null,validation.error.message))
        }
        request.body.created_by=request.headers.user_data._id
    },
    list :async (request, reply) => {
        let s=Joi.object({
            _id:Joi.string().optional().custom(pitLib.joi.oid),
        })
        v=s.validateAsync(request.body).catch(e=>{
            return reply.send(pitLib.sendResponse(0,e.message))
        })

        if (request.body._id){
            r=await Unit.findOne({_id:request.body._id})
            if (!r){
                reply.send(pitLib.sendResponse(null,'Incorrect Id'))
            }
            request.body._id=pitLib.oid(request.body._id)
        }
    },
    edit :async (request, reply) => {
        if (request.params._id===undefined||!isValidObjectId(request.params._id)){
            return reply.send(pitLib.sendResponse(null,'Invalid Id'))
        }
        r=await Unit.findOne({_id:request.params._id})
        if (!r){
            return reply.send(pitLib.sendResponse(null,'Incorrect Id'))
        }
        request.params._id=new mongoose.Types.ObjectId(request.params._id)
    },
};