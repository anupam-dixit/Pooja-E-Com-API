const Joi = require("joi");
const {pitLib} = require("../helpers/pitLib");
exports.CartMiddleware = {
    create :async (request, reply) => {
        jSchema=Joi.object({
            product_id:Joi.string().required().custom(pitLib.joi.oid),
            quantity:Joi.number().required().min(1),
        })
        validation=jSchema.validate(request.body)
        if (validation.error){
            reply.send(pitLib.sendResponse(null,validation.error.message))
        }
    }
};