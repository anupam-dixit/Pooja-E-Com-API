const {Schema,mongoose} = require("mongoose");

const UserSchema  = new mongoose.Schema({
    name:{
        type:String,
        required: true,
    },
    phone:{
        type:String,
        required: true,
        unique: true,
        length:10,
    },
    address:{
        type:Object,
    },
    role: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'Role',
        default:'65ac052324b31f18bc10153c'
    },
    password: {
        type:String,
        required:true,
    },
    verified:{
        phone:{
            type:Boolean,
            default:false
        },
    }
},{
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
})
const User = mongoose.model('User', UserSchema)

module.exports = {User};