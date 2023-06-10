const mongoose = require ('mongoose');
// const { type } = require('os');

 const productSchema = new mongoose.Schema({

    productName : {
        type :String,
        required :true,
    },
  
    price : {
       type : Number,
       required:true
    },
    image:{
        type : Array,
        required: true
    },
    brand:{
        type : String,
        required: true
    },
    idealfor : {  //gender
        type : String,
        required:true,
    },
    category : {     // type
        type : String,
        required:true,
    },
    StockQuantity:{
        type :Number,
        required:true,
    },
    Status:{
        type :Boolean,
        default:true
    },
    description : {
        type :String,
        required:true,
    }
 })

 module.exports = mongoose.model ('product',productSchema);





 