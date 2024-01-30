const {pitLib} = require("../helpers/pitLib");
const Joi = require("joi");
const {Role} = require("../models/RoleModel");
const {isValidObjectId} = require("mongoose");
const {db} = require("../helpers/db");
const mongoose = require("mongoose");
exports.AccessMiddleware = {
    listRole :async (request, reply) => {
        if (request.body&&request.body._id!==undefined){
            if (!isValidObjectId(request.body._id)){
                reply.send(pitLib.sendResponse(null,'Invalid Id'))
            }
            r=await Role.findOne({_id:request.body._id})
            if (!r){
                reply.send(pitLib.sendResponse(null,'Incorrect Id'))
            }
        }

    },
    createRole :async (request, reply) => {
        jSchema=Joi.object({
            title:Joi.string().required(),
        }).unknown(true)
        validation=await jSchema.validate(request.body)
        if (!validation.error){
            request.body.code=pitLib.util.trimToCode(request.body.title)
            r=await Role.find({code:request.body.code}).countDocuments()
            if (r>0){
                validation.error={message:'Already in Database'}
            }
        }
        if (validation.error){
            reply.send(pitLib.sendResponse(null,validation.error.message))
        }
    },
    editRole :async (request, reply) => {
        if (!mongoose.isValidObjectId(request.params._id)){
            reply.send(pitLib.sendResponse(null,'Invalid ID'))
        }
        r=await Role.findById(request.params._id).countDocuments()
        if (!r){
            reply.send(pitLib.sendResponse(null,'Incorrect ID'))
        }

        if (request.body.title){
            request.body.code=pitLib.util.trimToCode(request.body.title)
        }
        r=await Role.find({code:request.body.code}).countDocuments()
        if (r>0){
            reply.send(pitLib.sendResponse(null,'Already in database'))
        }
    },
};