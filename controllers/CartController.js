const {Cart} = require("../models/CartModel");
const {Product} = require("../models/ProductModel");
const {pitLib} = require("../helpers/pitLib");
exports.CartController = {
    create :async (request, reply) => {
        inDb=await Cart.findOne({
            product_id:request.body.product_id,
            created_by:request.headers.user_data._id,
        })
        let product = await Product.findById(request.body.product_id).lean()
        unitPrice=pitLib.product.pricer(product)
        let cart
        if (!inDb){
            // New entry
            cart = await Cart.create({
                product_id:request.body.product_id,
                quantity:Number(request.body.quantity),
                unit:{
                    mrp:product.mrp,
                    price:unitPrice
                },
                mrp:Number(product.mrp)*Number(request.body.quantity),
                price:Number(request.body.quantity)*unitPrice,
                created_by:request.headers.user_data._id,
            })
        }
        else {
            cart = await Cart.findByIdAndUpdate(inDb._id,{
                quantity:Number(request.body.quantity),
                unit:{
                    mrp:product.mrp,
                    price:unitPrice
                },
                mrp:Number(product.mrp)*Number(request.body.quantity),
                price:Number(request.body.quantity)*unitPrice,
            })
        }
        return reply.send(pitLib.sendResponse(!!(cart),null,cart))
    }
};