const User = require("../modals/usermodal");
const bcrypt = require("bcrypt");
const productmodel = require("../modals/productmodel");
const categorymodel = require("../modals/categorymodel");
const usermodal = require("../modals/usermodal");
const session = require("express-session")
const nodemailer = require("nodemailer")
const cartmodel = require('../modals/cartmodel')

const securePassword = async (password) => {
  try {
    const passwordHash = await bcrypt.hash(password, 10);
    return passwordHash;
  } catch (error) {
    console.log(error.message);
  }
};

//================= LOAD REGISTER ===============
const loadRegister = async (req, res) => {
  try {
    res.render("signup");
  } catch (error) {
    console.log(error.message);
  }
};
//================= LOAD LOGIN ===============
const loadLogin = async (req, res) => {
  try {
    res.render("login");
  } catch (error) {
    console.log(error.message);
  }
};

//================= INSERT USER ===============
const insertUser = async (req, res) => {
  try {
    const spassword = await securePassword(req.body.password);

    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) {
      res.render("signup", {
        message: "email already exists",
      });
    }
    if (!req.body.name || req.body.name.trim().length === 0) {
      res.render("signup", {
        message: "please enter valid name",
      });
    }

    const user = new User({
      name: req.body.name,
      email: req.body.email,
      mobile: req.body.mobile,
      password: spassword,
      is_admin: 0,
    });
    email=user.email
    const name = req.body.name
    const userData = await user.save();
    if (userData) {
      randomnumber = Math.floor(Math.random() * 9000) + 1000;
      otp = randomnumber;
      sendVerifyMail(name,req.body.email,randomnumber)
      res.redirect("/otp");
    } else {
      res.render("signup", { message: "Registration Failed" });
    }
  } catch (error) {
    console.log(error.message);
  }
};

const sendVerifyMail = async (name, email, otp) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.verificationEmail,
        pass: process.env.passotp
      }
    });

    const mailOptions = {
      from: process.env.verificationEmail,
      to: email,
      subject: 'Verification Email',
      html: `<p>Hi ${name}, please click <a href="http://localhost:1002/otp">here</a> to verify and enter your verification email. This is your OTP: ${otp}</p>`
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email has been sent:', info.response);
    console.log(otp);
  } catch (error) {
    console.log(error);
  }
};


//================= LOAD OTP ===============
const loadVerification = async(req,res) => {
  try {
    res.render("otp")
  } catch (error) {
    console.log(error.message);
  }
}






const verifyEmail = async (req,res)=>{
  const otp2= req.body.otp;
  try { 
      if(otp2==otp){
          const UserData = await User.findOneAndUpdate({email:email},{$set:{is_verified:1}});
          if(UserData){
            res.redirect("/login");
          }
          else{
              console.log('something went wrong');
          }
      }
      else{
          res.render('otp',{message:"Please Check the OTP again!"})
      }
  } catch (error) {
      console.log(error.message);
  }
}

//================= VERIFY LOGIN ===============
const verifyLogin = async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;

    const userData = await User.findOne({ email: email });

    if (userData) {
      const passwordMatch = await bcrypt.compare(password, userData.password);

      if (passwordMatch) {
        if (userData.is_admin === 0) {
          if (userData.is_blocked == true) {
            res.render("login", { message: "YOU ARE BLOCKED BY ADMIN" });
          } else {
            req.session.user_id = userData._id;

            res.redirect("/home");
          }
        } else {
          res.render("login", { message: "Email or password is incorrect" });
        }
      } else {
        res.render("login", { message: "Email or password is incorrect" });
      }
    } else {
      res.render("login", {
        message: "Please provide your correct Email and password ",
      });
    }
  } catch (error) {
    console.log(error.message);
  }
};

//================= LOAD HOME PAGE ===============
const loadHome = async (req, res) => {
  try {
    if(req.session.user_id){
      const session = req.session.user_id
      const productdata = await productmodel.find()
      const id = req.session.user_id
      const userData = await usermodal.findById({_id: req.session.user_id})
      res.render("home",{productData:productdata,userData:userData,session})
    }else{
      const session = null
      const productdata = await productmodel.find()
      res.render("home",{productData:productdata,session})
    }
  } catch (error) {
    console.log(error.message);
  }

}


// =================== LOGOUT  ======================

const userLogout = async (req, res) => {
  try {
    req.session.destroy();
    res.redirect("/");
  } catch (error) {
    console.log(error.message);
  }
};

//================= LOAD SHOP PAGE ===============
const loadShop = async (req, res) => {
  try {
    // const productdata = await productmodel.find({ status: true }).populate("category")
    const productdata = await productmodel.find({Status:true});

    if (req.session.user_id) {
      const session = req.session.user_id
      const catData = await categorymodel.find();
      const id = req.session.user_id
      const userdata = await usermodal.findById({_id: req.session.user_id})
      
      res.render("shop", {
        userData: userdata,
        productData: productdata,
        category: catData,session
      });
    } else {
      const session = null
      const catData = await categorymodel.find();
      res.render("shop", { productData: productdata, category: catData,session });
    }
  } catch (error) {
    console.log(error.message);
  }
};

//================= LOAD SINGLE PRODUCT ===============



const loadShowproduct = async (req, res) => {
  try {
    if (req.session.user_id) {
     const session = req.session.user_id
     const id = req.params.id

      const data = await productmodel.findOne({ _id: id });
      const userData = await usermodal.findById({_id: req.session.user_id})

      const cartData = await cartmodel.findOne({ userId: session });
      const productExist = cartData.products.some(
        (product) => product.productId == id);
      res.render("showProduct", {
         productExist,
        productData: data,userData:userData,session });
    } else {
           const session = null
           const id = req.params.id
      const data = await productmodel.findOne({ _id: id });
      res.render("showProduct", { productData: data ,session});
    }
  } catch (error) {
    console.log(error.message);
  }
};


// ====================== LAOAD PROFILE =============

const loadProfile = async (req, res) => {
  try {
    if(req.session.user_id){
      const session = req.session.user_id
      const id = req.session.user_id
      const userdata = await usermodal.findById({_id: req.session.user_id})
      res.render("account", { userData: userdata,session });
    }else{
      const session = null
      res.redirect("/home",{message:"please login"})
    }
    
    
  } catch (error) {
    console.log(error.message);
  }
};

// ==================== LOAD ORDERS ================== it should be in order controller

const loadOrder = async(req,res) => {
  try {
    if(req.session.user_id){
      const session = req.session.user_id
      const id = req.session.user_id
      const userdata = await usermodal.findById({_id: req.session.user_id})
      res.render("orders", { userData: userdata,session });
    }else{
      const session = null
      res.redirect("/home",{message:"please login"})
    }
  } catch (error) {
    console.log(error.message);
  }
}


module.exports = {
  loadHome,
  insertUser,
  loadRegister,
  verifyLogin,
  loadLogin,
  userLogout,
  loadShop,
  loadShowproduct,
  loadProfile,
  loadVerification,
  sendVerifyMail,
  verifyEmail,
  loadOrder,

};

