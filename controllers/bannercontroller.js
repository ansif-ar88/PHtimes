const usermodel = require("../modals/usermodal")
const bannermodel = require("../modals/bannermodel")


//======================== LOAD BANNER MANAGEMENT ===============

const loadBannerManagement = async(req,res) => {
    try {
        const adminData = await usermodel.find({is_admin : 1})
        const banners = await bannermodel.find()
        res.render("bannerManagement",{admin:adminData,banners})
    } catch (error) {
        console.log(error.message);
    }
}
//================ ADD BANNER ====================
const addBanner = async (req,res) =>{
    try {
        const image = [];
        if (req.files && req.files.length > 0) {
        for(i = 0; i < req.files.length; i++){
            image[i] = req.files[i].filename;
        }
    }
    const banner = new bannermodel({
        image:image,
        heading:req.body.heading
    })
    const bannerData = await banner.save()
    if(bannerData){
        res.redirect("/admin/banner")
    }else{
        res.redirect("/admin/banner")
    }
    } catch (error) {
        console.log(error.message);
    }
}
module.exports = {
    loadBannerManagement,
    addBanner
}