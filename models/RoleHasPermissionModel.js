var mongoose = require('mongoose')

const RoleSchema  = new mongoose.Schema({
    role:{
        required:true,
        type:mongoose.Schema.Types.ObjectId,
        ref:'Role'
    },
    permission:[{
        required:true,
        type:mongoose.Schema.Types.ObjectId,
        ref:'Permission'
    }],
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
const RoleHasPermissions = mongoose.model('RoleHasPermissions', RoleSchema)

module.exports = {RoleHasPermissions};