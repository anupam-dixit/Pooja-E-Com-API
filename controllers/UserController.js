const {pitLib} = require("../helpers/pitLib");
const {User} = require("../models/UserModel");
const {genSalt, hash} = require("bcrypt");
const {Token} = require("../models/TokenModel");
exports.UserController = {
    login :async (request, reply) => {
        let u = await User.findOne({phone: request.body.phone}).select('+password').lean().exec();
        let isCorrect = await pitLib.util.checkHash(request.body.password, u.password)
        if (isCorrect){
            u.token= request.server.jwt.sign(u)
            let token = await Token.create({user:u._id,token:u.token})
        }
        return pitLib.sendResponse(isCorrect,(isCorrect)?null:'Incorrect credentials',(isCorrect)?u:null)
    },
    create :async (request, reply) => {
       let u=await User.create(request.body)
        reply.send(pitLib.sendResponse(1,'ok','how'))
    }
};