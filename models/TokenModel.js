const {mongoose} = require("mongoose");
const {boolean} = require("joi");

const TokenSchema  = new mongoose.Schema({
    user :{
        required:true,
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    token:{
        type:String,
        required: true,
    },
    active:{
        type:Boolean,
        default:true,
    },
},{
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
})
const Token = mongoose.model('Token', TokenSchema)

module.exports = {Token};