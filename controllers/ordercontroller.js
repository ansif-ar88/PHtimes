const session = require("express-session")
const usermodel = require('../modals/usermodal')
const addressmodel = require ('../modals/addressmodel')
const cartmodel = require('../modals/cartmodel')
const ordermodel = require('../modals/ordermodel')
const { now } = require("mongoose")
const productmodel = require("../modals/productmodel")


//================== LOLAD CHECKOUT =====================

const loadChekout = async(req,res)=>{
    try {
      const session = req.session.user_id
      const userData = await usermodel.findOne ({_id:req.session.user_id});
      const addressData = await addressmodel.findOne({userId:req.session.user_id});
      const total = await cartmodel.aggregate([
        { $match: { userId: req.session.user_id } },
        { $unwind: "$products" },
        {
          $group: {
            _id: null,
            total: { $sum: { $multiply: ["$products.productPrice", "$products.count"] } },
          },
        },
      ]);
  
      if(req.session.user_id){
        if(addressData){
            if(addressData.addresses.length>0){
              const address = addressData.addresses
              const Total = total.length > 0 ? total[0].total : 0; 
              const totalAmount = Total+80;
              res.render('checkOut',{session,Total,address:address,totalAmount,userData:userData})
            }
            else{
                const Total = total.length > 0 ? total[0].total : 0; 
                const totalAmount = Total+80;
              res.render('emptyCheckout',{session,Total,totalAmount,userData:userData,message:"Add your delivery address"});
            }
          }else{
            const Total = total.length > 0 ? total[0].total : 0; 
            const totalAmount = Total+80;
            res.render('emptyCheckout',{session,Total,totalAmount,userData:userData,message:"Add your delivery address"});
          }
        }else{
          res.redirect('/')
        }
    } catch (error) {
      console.log(error.message);
    }
  }


//================== LOLAD EMPTY CHECKOUT =====================

// const loadEmptyCheckout = async (req,res) =>{
//     try {
//         if(req.session.user_id){
//             const session = req.session.user_id
//             const id = req.session.user_id
//             const userdata = await usermodal.findById({_id: req.session.user_id})
//             res.render("emptyCheckout", { userData: userdata,session });
//           }else{
//             const session = null
//             res.redirect("/home",{message:"please login"})
//           }
//     } catch (error) {
//         console.log(error.message);
//     }
// }


// ============ PLACE ORDER =================

const placeOrder = async (req,res) => {
  try {
    const id = req.session.user_id
    const userName = await usermodel.findOne({_id:id})
    const address = req.body.address
    const paymentMethod = req.body.payment
    const cartData =  await cartmodel.findOne({userId:id})
    const products = cartData.products

    const Total = parseInt(req.body.amount)
   

    const status = paymentMethod === "COD" ? "placed" : "pending";
    const order = new ordermodel({
      deliveryAddress:address,
      userId: id,
      userName:userName.name,
      paymentMethod: paymentMethod,
      products: products,
      totalAmount:Total,
      // Amount:totalPrice,
      date:new Date(),
      status:status,

    })
   
    const orderData = await order.save()
    if (orderData) {
      for(let i= 0;i<products.length;i++){
        const pro =products[i].productId;
        const count = products[i].count;
        await productmodel.findByIdAndUpdate({_id:pro},{$inc:{StockQuantity: -count}});

      }
        await cartmodel.deleteOne({userId:id})   //there is a chance
        res.json({codSuccess : true})
    
    } else {
      res.redirect("/checkout")
    }
  } catch (error) {
    console.log(error.message);
  }
}

// ==================== LOAD ORDERS IN USER SIDE ================== 

const loadOrderUser = async(req,res) => {
  try {
    if(req.session.user_id){
      const session = req.session.user_id
      const id = req.session.user_id
      const userdata = await usermodel.findById({_id: id})
      const orders = await ordermodel.find({userId:id}).populate("products.productId")
      
      res.render("orders", { userData: userdata,session,orders:orders });
    }else{
      const session = null
      res.redirect("/home",{message:"please login"})
    }
  } catch (error) {
    console.log(error.message);
  }
}
  module.exports = {
    loadChekout,
    placeOrder,
    loadOrderUser
    // loadEmptyCheckout

    
  }