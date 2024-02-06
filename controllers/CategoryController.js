const {pitLib} = require("../helpers/pitLib");
const fs = require("fs");
const {Media} = require("../models/MediaModel");
const {Category} = require("../models/CategoryModel");
exports.CategoryController = {
    create :async (request, reply) => {
        uploadedFileName='upload/image/category/'+pitLib.util.uniquid()+'_'+request.body.image.name
        let category = await Category.create(request.body).catch(err => {
            return reply.send(pitLib.sendResponse(false,null,err ))
        })
        fs.writeFile('public/'+uploadedFileName,request.body.image.file,err => {
            return !!(err)
        });
        media=Media.create({
            path:uploadedFileName,
            reference_code:'category_image',
            reference_id:category._id
        })
        return reply.send(pitLib.sendResponse((category&&media)))
    },
    dtlist :async (request, reply) => {
        recordsTotal = await Category.find().countDocuments()
        searchable={title:new RegExp(request.query['search[value]'], 'i')}
        recordsFiltered=await Category.find(searchable).countDocuments()
        data=await Category.find(searchable)
            .skip(request.query.start)
            .limit(request.query.length)
            .sort({updated_at:-1})
        reply.send(pitLib.sendDtResponse(Number(request.query.draw),recordsFiltered,recordsTotal,data))
    },
    list :async (request, reply) => {
        total=parseInt(await Category.countDocuments())
        filtered=await Category.aggregate([
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
    edit :async (request, reply) => {
        let category = await Category.findByIdAndUpdate(request.params._id,request.body).catch(err => {
            return reply.send(pitLib.sendResponse(false,null,err ))
        })
        let media=true
        if (request.body.image.file){
            media=false
            uploadedFileName='upload/image/category/'+pitLib.util.uniquid()+'_'+request.body.image.name
            media=await Media.findOne({reference_id:request.params._id}).lean()
            fs.unlink('public/'+media.path, (err) => {
                ;
            });
            media=await Media.findOneAndUpdate({reference_id:request.params._id},{
                path:uploadedFileName,
            }).lean()
            fs.writeFile('public/'+uploadedFileName,request.body.image.file,err => {

            });
        }
        return reply.send(pitLib.sendResponse((category&&media)))
    },
};