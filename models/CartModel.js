const {mongoose} = require("mongoose");

const CartSchema  = new mongoose.Schema({
    product_id:{
        required:true,
        type:mongoose.Schema.Types.ObjectId,
        ref:'Product'
    },
    quantity:{
        type:Number,
        required:true,
    },
    mrp:{
        type:Number,
        required:true,
    },
    price:{
        type:Number,
        required:true,
    },
    unit:{
        mrp:{
            type:Number,
            required:true,
        },
        price:{
            type:Number,
            required:true,
        },
    },
    created_by:{
        required:true,
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
},{
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
})
const Cart = mongoose.model('Cart', CartSchema)

module.exports = {Cart};