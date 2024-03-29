var mongoose = require('mongoose')

const PermissionSchema  = new mongoose.Schema({
    title: {
        type:String,
        required:true
    },
    code: {
        type:String,
        uppercase:true,
        required:true,
        unique:true
    },
    description: {
        type:String,
        uppercase:true,
    },
},{
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
})
const Permission = mongoose.model('Permission', PermissionSchema)

module.exports = {Permission};