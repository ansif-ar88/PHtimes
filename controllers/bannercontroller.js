const usermodel = require("../modals/usermodal")
const bannermodel = require("../modals/bannermodel")
const fs=require('fs')
const path = require("path")

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

const addBanner = async (req, res) =>{
  try {
    const heading = req.body.heading
    let image ='';
    if(req.file){
      image = req.file.filename
    }
    const Banner = new bannermodel({
      heading:heading,
      image:image
    })
    Banner.save()
    res.redirect("/admin/banner")
  } catch (error) {
    console.log(error.message);
  }
}

//================ EDIT BANNER ====================

const editBanner = async (req, res) =>{

  try {
   
    const id = req.body.id
    const heading = req.body.heading
    let image = req.body.img

    if(req.file){
      image = req.file.filename
      console.log(image,"aaaaaaaaaaaaaaaaaaaaa");
    }
    await bannermodel.findOneAndUpdate({_id:id},{
      $set:{
        heading:heading,
        image:image
      }
    })
    res.redirect("/admin/banner")
  } catch (error) {
    console.log(error.message);
  }
}

module.exports = {
    loadBannerManagement,
    addBanner,
    editBanner,
}