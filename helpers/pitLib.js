const {genSalt, hash, compare} = require("bcrypt");
const fastifyJwt = require("@fastify/jwt");
const {Media} = require("../models/MediaModel");
const fs = require('node:fs/promises');
exports. pitLib = {
    sendResponse:function (status=null,message=null,data=null) {
        if (!status){
            status =false;
            if (!message){
                message ='Unable to perform this action'
            }
        } else {
            status =true;
            if (!message){
                message ='Action performed successfully'
            }
        }
        return {status:status,message:message,data:data}
    },
    sendDtResponse:function (draw,recordsFiltered,recordsTotal,data) {
        return {draw:eval(draw),recordsFiltered:eval(recordsFiltered),recordsTotal:eval(recordsTotal),data:data}
    },
    util:{
        trimToCode:function(string,replacer){
            if (!replacer){
                replacer = '_'
            }
            return string.replaceAll(/[&\/\\#, +()$~%.'":*?<>{}]/g,replacer)
        },
        makeHash:async function (string) {
            const salt = await genSalt(10);
            return await hash(string, salt)
        },
        checkHash:async function (string,hash) {
            return await compare(string, hash)
        },
        uniquid:function () {
            const timestamp = new Date().getTime();
            const randomString = Math.random().toString(36).substring(2, 10); // You can adjust the substring length as needed
            return `${timestamp}_${randomString}`;
        }
    },
};