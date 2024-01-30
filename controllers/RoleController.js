const {pitLib} = require("../helpers/pitLib");
exports.UserController = {
    create :async (request, reply) => {
        reply.send(pitLib.sendResponse(1,null,request.body))
    }
};