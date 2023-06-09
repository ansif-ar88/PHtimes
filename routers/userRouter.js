const express = require("express")
const userRoute = express()
// const session = require("express-session") ;
// const nocache = require ("nocache")
// const config = require("../config/config")

// userRoute.use(
//     session({
//         secret:config.sessionSecret,
//         saveUninitialized:true,
//         resave:false,
//         cookie:{
//             maxAge:500000,
//         },
//     })
// );
// userRoute.use(nocache())
const Auth = require("../middleware/userAuth")

// userRoute.use(express.json())
// userRoute.use(express.urlencoded({ extended: true}))

//view engine
userRoute.set("view engine","ejs");
userRoute.set("views","./views/userViews")

const userController = require("../controllers/usercontroller")
const cartController = require ('../controllers/cartcontroller.js')
const addressController = require('../controllers/addresscontroller')
const orderController =  require ('../controllers/ordercontroller')



userRoute.get("/signup",Auth.isLogout, userController.loadRegister);
userRoute.post("/signup", userController.insertUser);
userRoute.get("/otp", userController.loadVerification);
userRoute.post("/otp", userController.verifyEmail);

userRoute.get("/",userController.loadHome)

userRoute.get("/login",Auth.isLogout, userController.loadLogin);

userRoute.post("/login", userController.verifyLogin);


userRoute.get("/home",userController.loadHome)
userRoute.get("/logout",Auth.isLogin, userController.userLogout);

userRoute.get("/shop", userController.loadShop)
userRoute.get("/showProduct/:id", userController.loadShowproduct)

userRoute.get("/profile",Auth.isLogin,userController.loadProfile)
userRoute.get("/orders",Auth.isLogin,userController.loadOrder)


userRoute.post('/addtocart',Auth.isLogin,cartController.addToCart);
userRoute.post('/changeQuantity',Auth.isLogin,cartController.changeProductCount);
// userRoute.post('/deletecart',Auth.isLogin,cartController.deletecart);
userRoute.get('/cart',Auth.isLogin,cartController.loadCart);
userRoute.get('/cartEmpty',Auth.isLogin,cartController.loadEmptyCart);


userRoute.get('/address',Auth.isLogin,addressController.showAddress)
userRoute.get('/addAddress',Auth.isLogin,addressController.loadAddAddress)
userRoute.get('/editAddress/:id',Auth.isLogin,addressController.loadEditAddress)
userRoute.post('/addAddress',Auth.isLogin,addressController.addAddress)
userRoute.post('/editAddress/:id',Auth.isLogin,addressController.editAddress)
userRoute.post('/deleteAddress',Auth.isLogin,addressController.deleteAddress)




userRoute.get('/checkout',Auth.isLogin,orderController.loadChekout)
// userRoute.get('/checkout',Auth.isLogin,orderController.loadEmptyCheckout)


module.exports = userRoute