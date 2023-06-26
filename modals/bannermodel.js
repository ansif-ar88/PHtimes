const mongoose = require ('mongoose');

const bannerSchema = new mongoose.Schema({
    heading:{
        type :String,
        required:true
    },
    image:{
        type:Array,
        required:true
    }
})
module.exports = mongoose.model ('banner',bannerSchema);