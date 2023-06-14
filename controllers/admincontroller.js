
const bcrypt = require("bcrypt");
const session = require("express-session");
const usermodal = require("../modals/usermodal");


const loadLogin = async (req, res) => {
  try {
    res.render("login");
  } catch (error) {
    console.log(error.message);
  }
};

const verifyLogin = async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;
//THIS IS AN EDITED AREA
    const userData = await usermodal.findOne({ email: email });
    // console.log(userData);
    if (userData) {
      const passwordMatch = await bcrypt.compare(password, userData.password);

      if (passwordMatch) {
        if (userData.is_admin === 0) {
          res.render("login", {
            message: "Not an Admin",
          });
        } else {
          req.session.Auser_id = userData._id;
          res.redirect("/admin/dashBoard");
        }
      } else {
        res.render("login", { message: "Email or password is incorrect" });
      }
    } else {
      res.render("login", {
         message: "Please provide your email and password",
         });
    }
  } catch (error) {
    console.log(error.message);
  }
};

const  loadDashboard = async (req, res) => {
  try {
    
    //THIS IS AN EDITED AREA
    const adminData = await usermodal.findById({ _id: req.session.Auser_id });
    res.render("dashBoard"
    , { admin: adminData }
    );
  } catch (error) {
    console.log(error.message);
  }
};


const adminLogout = async (req,res)=>{
  try{
      req.session.destroy();
      res.redirect('/admin')
  }catch(error){
      console.log(error.message);
  }
}
const userList = async (req,res) => {
  try {
    const userData = await usermodal.find({is_admin:0});
    const adminData = await usermodal.findById({ _id: req.session.Auser_id });

    res.render("userList"
    ,{users: userData,admin:adminData}
    );
  } catch (error) {
    console.log(error.message);
  }
}

const block = async (req,res)=> {
    try {
      const userData = await usermodal.findByIdAndUpdate(req.query.id,{$set:{is_blocked:true}})
      req.session.user = null
      res.redirect("/admin/userList")
    } catch (error) {
      console.log(error.message);
    }
}
const unblock = async (req,res)=> {
    try {
      const userData = await usermodal.findByIdAndUpdate(req.query.id,{$set:{is_blocked:false}})
      
      res.redirect("/admin/userList")
    } catch (error) {
      console.log(error.message);
    }
}


module.exports = {
  loadLogin,
  verifyLogin,
  loadDashboard,
  adminLogout,
  userList,
  block,
  unblock
  
};
