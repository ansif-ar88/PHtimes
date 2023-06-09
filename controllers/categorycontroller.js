const product = require ("../modals/productmodel")
const category = require("../modals/categorymodel")
const usermodal = require('../modals/usermodal')
const uc = require('upper-case')
let mes
const toastr = require('toastr')

//========== LIST CATEGORY ==========

const categoryList =  async (req,res) =>{
    try {
        const catData = await category.find({});
        const adminData = await usermodal.findById({ _id: req.session.Auser_id });

        res.render('categoryList',{category:catData,mes,admin : adminData})    
    } catch (error) {
        console.log(error.message);
    }
}

//======== ADD CATEGORY=================

const insertCategory = async (req,res) =>{
    try {
        if(req.session.Auser_id){
            const catName = uc.upperCase(req.body.categoryName);
            const Category = new category({categoryName : catName});
            if(catName.trim().length === 0){
                res.redirect('/admin/categoryList');
                mes = "invalid typing"
            }else{
                const categoryDatas = await category.findOne({categoryName:catName});
                if(categoryDatas){
                    mes ='This category is already exist'
                    res.redirect('/admin/categoryList');
                }else{
                    const categoryData = await Category.save()
                    if(categoryData){ 
                        res.redirect('/admin/categoryList')
                    }else{
                        res.redirect('/admin/dashBoard');
                    }
                }
            }
        }else{
            res.redirect('/admin')
        }
    } catch (error) {
        console.log(error.message);
    }
}


  
//================== UPDATE AND SAVE==========

const saveCategory = async(req,res) =>{
    try {
        
        const name = req.body.categoryName;
        const catData = await category.findOneAndUpdate({_id:req.query.id}  ,{$set:{categoryName:name}});
        if(catData){
            res.redirect('categoryList')
        }
    } catch (error) {
        console.log(error.message);
    }
}
//==================  EDIT CATEGORY ====================
const  editCategory= async (req,res)=>{
    try {
        const id = req.query.id;
       const catDATA = await category.findById({_id:id});
       const adminData = await usermodal.findById({ _id: req.session.Auser_id });

       res.render('editCategory',{Category:catDATA, admin : adminData})
    } catch (error) {
        console.log(error.message);
    }
}


const unlistCategory = async (req, res) => {
    try {
        const categoryData = await category.findByIdAndUpdate(req.query.id,{$set:{is_deleted : true}})
        res.redirect("/admin/categoryList")
    } catch (error) {
        console.log(error.message);
    }
     
  };
const listCategory = async (req, res) => {
    try {
        const categoryData = await category.findByIdAndUpdate(req.query.id,{$set:{is_deleted : false}})
        res.redirect("/admin/categoryList")
    } catch (error) {
        console.log(error.message);
    }
     
  };




module.exports = {
    categoryList,
    insertCategory,
    saveCategory,
    editCategory,
    listCategory,
    unlistCategory,
    
}