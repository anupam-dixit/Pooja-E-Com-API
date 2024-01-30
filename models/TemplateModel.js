const {mongoose} = require("mongoose");

const TemplateSchema  = new mongoose.Schema({
    name:{
        type:String,
        required: true,
    },
},{
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
})
const Template = mongoose.model('Template', TemplateSchema)

module.exports = {Template};