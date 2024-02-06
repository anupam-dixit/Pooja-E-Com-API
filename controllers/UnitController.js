const {Unit} = require("../models/UnitModel");
const {pitLib} = require("../helpers/pitLib");
const {Media} = require("../models/MediaModel");
const fs = require("fs");
exports.UnitController = {
    create :async (request, reply) => {
        let r=await Unit.create(request.body)
        return reply.send(pitLib.sendResponse(!!(r),null,r));
    },
    dtlist :async (request, reply) => {
        recordsTotal = await Unit.find().countDocuments()
        searchable={title:new RegExp(request.query['search[value]'], 'i')}
        recordsFiltered=await Unit.find(searchable).countDocuments()
        data=await Unit.find(searchable)
            .skip(request.query.start)
            .limit(request.query.length)
            .sort({updated_at:-1})
        reply.send(pitLib.sendDtResponse(Number(request.query.draw),recordsFiltered,recordsTotal,data))
    },
    list :async (request, reply) => {
        total=parseInt(await Unit.countDocuments())
        filtered=await Unit.aggregate([
            {
                $match: request.body,
            },
            {
                $skip: Number(request.query.page-1)*request.query.pagination,
            },
            {
                $limit: Number(request.query.pagination),
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
        let unit = await Unit.findByIdAndUpdate(request.params._id,request.body).catch(err => {
            return reply.send(pitLib.sendResponse(false,null,err ))
        })
        return reply.send(pitLib.sendResponse(!!(unit),null,unit))
    },
};