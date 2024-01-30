const {mongoose} = require("mongoose");

const SubCategorySchema  = new mongoose.Schema({
    title:{
        type:String,
        required: true,
        unique: true
    },
    category_id:{
        required:true,
        type:mongoose.Schema.Types.ObjectId,
        ref:'Category'
    },
},{
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
})

const SubCategory = mongoose.model('SubCategory', SubCategorySchema)

module.exports = {SubCategory};