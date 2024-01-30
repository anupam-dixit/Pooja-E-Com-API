const {writeFile} = require("fs");
const {pitLib} = require("../helpers/pitLib");
const {Role} = require("../models/RoleModel");

exports.AccessController = {
    createRole :async (request, reply) => {
        // writeFile('spdf.png', request.body.hen.file, err => {
        //     if (err) {
        //         return err
        //     }
        //     // file written successfully
        // });
        let r=await Role.create(request.body)
        return reply.send(pitLib.sendResponse(r,null,null))
    },
    dtlistRole :async (request, reply) => {
        recordsTotal = await Role.find().countDocuments()
        searchable={title:new RegExp(request.query['search[value]'], 'i')}
        recordsFiltered=await Role.find(searchable).countDocuments()
        data=await Role.find(searchable)
            .skip(request.query.start)
            .limit(request.query.length)
            .sort({updated_at:-1})
        reply.send(pitLib.sendDtResponse(Number(request.query.draw),recordsFiltered,recordsTotal,data))
    },
    listRole :async (request, reply) => {
        total=parseInt(await Role.countDocuments())
        filtered=await Role.find(request.body).skip((request.query.page-1)*request.query.pagination).limit(request.query.pagination).lean().exec()
        r={
            total:total,
            pagination:eval(request.query.pagination),
            page:eval(request.query.page),
            filtered:filtered.length,
            data:filtered
        }
        return reply.send(pitLib.sendResponse(true,null,r))
    },
    editRole :async (req, rep) => {
        r=await Role.updateOne({_id:req.params._id}, req.body)
        return rep.send(pitLib.sendResponse(r,null,r))
    },
};