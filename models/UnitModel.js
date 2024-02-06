const {mongoose} = require("mongoose");

const UnitSchema  = new mongoose.Schema({
    title:{
        type:String,
        required: true,
        unique: true
    },
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
const Unit = mongoose.model('Unit', UnitSchema)

module.exports = {Unit};