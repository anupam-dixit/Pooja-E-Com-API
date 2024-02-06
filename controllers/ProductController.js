const {Product} = require("../models/ProductModel");
const {pitLib} = require("../helpers/pitLib");
const fs = require("fs");
const {Media} = require("../models/MediaModel");
exports.ProductController = {
    create :async (request, reply) => {
        let p= await Product.create(request.body)
        for (let i = 0; i < request.body.images.length; i++) {
            uploadedFileName='upload/image/product/'+pitLib.util.uniquid()+'_'+request.body.images[i].name
            fs.writeFile('public/'+uploadedFileName,request.body.images[i].file,err => {
                return !!(err)
            });
            media=Media.create({
                path:uploadedFileName,
                reference_code:'product_image',
                reference_id:p._id
            })
        }
        return reply.send(pitLib.sendResponse(!!(p),null,p))
    },
    edit :async (request, reply) => {
        let p= await Product.findByIdAndUpdate(request.params._id,request.body)
        if (request.body.images){
            for (let i = 0; i < request.body.images.length; i++) {
                uploadedFileName='upload/image/product/'+pitLib.util.uniquid()+'_'+request.body.images[i].name
                fs.writeFile('public/'+uploadedFileName,request.body.images[i].file,err => {
                    return !!(err)
                });
                media=Media.create({
                    path:uploadedFileName,
                    reference_code:'product_image',
                    reference_id:p._id
                })
            }
        }
        return reply.send(pitLib.sendResponse(!!(p),null,p))
    },
    dtlist :async (request, reply) => {
        recordsTotal = await Product.find().countDocuments()
        searchable={title:new RegExp(request.query['search[value]'], 'i')}
        recordsFiltered=await Product.find(searchable).countDocuments()
        data=await Product.find(searchable).populate('category')
            .skip(request.query.start)
            .limit(request.query.length)
            .sort({updated_at:-1})
        reply.send(pitLib.sendDtResponse(Number(request.query.draw),recordsFiltered,recordsTotal,data))
    },
    list :async (request, reply) => {
        total=parseInt(await Product.countDocuments())
        filtered=await Product.aggregate([
            {
                $match: request.body,
            },
            {
                $skip: Number(request.query.page-1)*request.query.pagination,
            },
            {
                $limit: Number(request.query.pagination),
            },
            {
                $lookup:{
                    from: 'categories', localField: 'category', foreignField: '_id', as: 'category'
                }
            },
            {
                $lookup:{
                    from: 'units', localField: 'unit', foreignField: '_id', as: 'unit'
                }
            },
            {
                $lookup:{
                    from: 'users', localField: 'created_by', foreignField: '_id', as: 'created_by'
                }
            },
            {
                $lookup:{
                    from: 'media', localField: '_id', foreignField: 'reference_id', as: 'media'
                }
            }
        ])
        r={
            total:total,
            pagination:eval(request.query.pagination),
            page:eval(request.query.page),
            filtered:filtered.length,
            data:filtered
        }
        return reply.send(pitLib.sendResponse(true,null,r))
    },
};