const {mongoose} = require("mongoose");

const MediaSchema  = new mongoose.Schema({
    path:{
        type:String,
        required: true,
    },
    reference_code:{
        type:String,
        required: true,
        uppercase:true,
    },
    reference_id:{
        required:true,
        type:mongoose.Schema.Types.ObjectId,
    },
    is_local:{
        type:Boolean,
        default:true
    },
    additional:{
        type:String,
        default:null
    },
    created_by:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
},{
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
})
const Media = mongoose.model('Media', MediaSchema)

module.exports = {Media};