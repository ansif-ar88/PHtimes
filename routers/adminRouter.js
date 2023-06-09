const express = require("express");
const adminRoute = express();

const multer = require ('multer');
const upload =require ('../config/multer.js')


//view engine
adminRoute.set("view engine", "ejs");
adminRoute.set("views", "./views/adminViews");

const Auth = require("../middleware/adminAuth")
const adminController = require("../controllers/admincontroller");
const productController = require("../controllers/productcontroller")
const categoryController = require('../controllers/categorycontroller')



adminRoute.get("/",Auth.isLogout,adminController.loadLogin);
adminRoute.post("/",adminController.verifyLogin)
adminRoute.get("/dashBoard",Auth.isLogin,adminController.loadDashboard)

adminRoute.get('/logout',Auth.isLogin,adminController.adminLogout)
adminRoute.get('/userList',Auth.isLogin,adminController.userList)
adminRoute.get('/block-user',Auth.isLogin,adminController.block);
adminRoute.get('/unblock-user',Auth.isLogin,adminController.unblock); 

adminRoute.get('/productList',Auth.isLogin,productController.productList)

adminRoute.get('/categoryList',Auth.isLogin,categoryController.categoryList)
adminRoute.get('/unlistcategory',Auth.isLogin,categoryController.unlistCategory)
adminRoute.get('/listcategory',Auth.isLogin,categoryController.listCategory)

adminRoute.get('/addproduct',Auth.isLogin,productController.AddProducts);
adminRoute.get('/editProduct/:id',Auth.isLogin,productController.editProduct);
adminRoute.get('/deleteimg/:imgid/:prodid',Auth.isLogin,productController.deleteimage)

adminRoute.post('/addproduct',upload.upload.array('image',10),productController.insertProduct);
adminRoute.post('/editProduct/:id',upload.upload.array('image',10),productController.editUpdateProduct)

adminRoute.post("/editproducts/updateimage/:id",upload.upload.array('image'),productController.updateimage)

adminRoute.get('/deleteProduct',Auth.isLogin,productController.deleteProduct);




adminRoute.post('/insertCategory', categoryController.insertCategory);

adminRoute.get('/editCategory', Auth.isLogin, categoryController.editCategory);
adminRoute.post('/editCategory', Auth.isLogin, categoryController.saveCategory);






adminRoute.get("*",function(req,res) {
    res.redirect("/admin")
})

module.exports = adminRoute;
