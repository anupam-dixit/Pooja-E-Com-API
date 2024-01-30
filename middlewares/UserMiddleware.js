const {pitLib} = require("../helpers/pitLib");
const Joi = require("joi");
const {Role} = require("../models/RoleModel");
const {User} = require("../models/UserModel");
exports.UserMiddleware = {
    create :async (request, reply) => {
        jSchema=Joi.object({
            name:Joi.string().required(),
            phone:Joi.string().required().length(10),
            password:Joi.string().required()
        })
        validation=jSchema.validate(request.body)
        if (validation.error){
            reply.send(pitLib.sendResponse(null,validation.error.message))
        } else {
            request.body.password=await pitLib.util.makeHash(request.body.password)
        }
    },
    login :async (request, reply) => {
        jSchema=Joi.object({
            phone:Joi.string().required().length(10),
            password:Joi.string().required()
        })
        validation=jSchema.validate(request.body)
        if (!validation.error){
            r=await User.find({phone:request.body.phone}).countDocuments()
            if (r===0){
                validation.error={message:'Please create account'}
            }
        }
        if (validation.error){
            reply.send(pitLib.sendResponse(null,validation.error.message,validation.error))
        }
        return true
    }
};