const {SubCategory} = require("../models/SubCategoryModel");
const {pitLib} = require("../helpers/pitLib");
const fs = require("fs");
const {Media} = require("../models/MediaModel");
exports.SubCategoryController = {
    create :async (request, reply) => {
        uploadedFileName='upload/image/sub-category/'+pitLib.util.uniquid()+'_'+request.body.image.name
        let category = await SubCategory.create(request.body).catch(err => {
            return reply.send(pitLib.sendResponse(false,null,err ))
        })
        fs.writeFile('public/'+uploadedFileName,request.body.image.file,err => {
            return !!(err)
        });
        media=Media.create({
            path:uploadedFileName,
            reference_code:'sub_category_image',
            reference_id:category._id
        })
        return reply.send(pitLib.sendResponse((category&&media)))
    },
    dtlist :async (request, reply) => {
        recordsTotal = await SubCategory.find().countDocuments()
        searchable={title:new RegExp(request.query['search[value]'], 'i')}
        recordsFiltered=await SubCategory.find(searchable).countDocuments()
        data=await SubCategory.find(searchable)
            .skip(request.query.start)
            .limit(request.query.length)
            .sort({updated_at:-1})
        reply.send(pitLib.sendDtResponse(Number(request.query.draw),recordsFiltered,recordsTotal,data))
    },
    list :async (request, reply) => {
        total=parseInt(await SubCategory.countDocuments())
        // filtered=await SubCategory.find(request.body).skip((request.query.page-1)*request.query.pagination).limit(request.query.pagination)
        // request.body._id=new mongoose.Types.ObjectId(request.body._id)
        filtered=await SubCategory.aggregate([
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
            },
            {
                $lookup:{
                    from: 'categories', localField: 'category_id', foreignField: '_id', as: 'category'
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
        let category = await SubCategory.findByIdAndUpdate(request.params._id,request.body).catch(err => {
            return reply.send(pitLib.sendResponse(false,null,err ))
        })
        let media=true
        if (request.body.image.file){
            media=false
            media=await Media.findOne({reference_id:request.params._id}).lean()
            fs.unlink('public/'+media.path, (err) => {
                ;
            });
            media=await Media.findOneAndUpdate({reference_id:request.params._id},{
                path:'upload/image/sub-category/'+request.body.image.name,
            }).lean()
            fs.writeFile('public/upload/image/sub-category/'+request.body.image.name,request.body.image.file,err => {

            });
        }
        return reply.send(pitLib.sendResponse((category&&media)))
    },
};