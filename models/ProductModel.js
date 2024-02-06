const {mongoose} = require("mongoose");

const ProductSchema  = new mongoose.Schema({
    title:{
        type:String,
        required: true,
    },
    category:{
        required:true,
        type:mongoose.Schema.Types.ObjectId,
        ref:'Category'
    },
    unit:{
        required:true,
        type:mongoose.Schema.Types.ObjectId,
        ref:'Unit'
    },
    mrp:{
        required:true,
        type:Number
    },
    price:{
        required:true,
        type:Number
    },
    discount:{
        type:{
            type:String,
            default:'f',
            enum:['f','p']
        },
        amount:{
            type:Number,
            default:0
        }
    },
    status:{
        type:Boolean,
        default:true
    },
    stock:{
        type:Number,
        default:0,
    },
    search_keywords:{
        type:String,
    },
    description:{
        type:String,
    },
    slug:{
        type:String,
        required: true,
        unique: true
    },
    created_by:{
        required:true,
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    }
},{
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
})
const Product = mongoose.model('Product', ProductSchema)

module.exports = {Product};