const {mongoose} = require("mongoose");

const CategorySchema  = new mongoose.Schema({
    title:{
        type:String,
        required: true,
        unique: true
    },
},{
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
})

const Category = mongoose.model('Category', CategorySchema)

module.exports = {Category};