const session = require("express-session")
const usermodal = require('../modals/usermodal')
const addressmodel = require ('../modals/addressmodel')
const cartmodel = require('../modals/cartmodel')
const ordermodel = require('../modals/ordermodel')
const { now } = require("mongoose")


//================== LOLAD CHECKOUT =====================

const loadChekout = async(req,res)=>{
    try {
      const session = req.session.user_id
      const userData = await usermodal.findOne ({_id:req.session.user_id});
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
    const userName = usermodal.findOne({_id:id})
    const address = req.body.address
    const paymentMethod = req.body.payment
    const cartData = cartmodel.findOne({userId:id})
    const products = cartData.products

    const Total = req.body.amount
    const totalPrice = parseInt(req.body.total)

    const status = paymentMethod === "COD" ? "placed" : "pending";
    const order = new ordermodel({
      deliveryAddress:address,
      userId: id,
      paymentMethod: paymentMethod,
      products: products,
      totalAmount:Total,
      Amount:totalPrice,
      date:new Date(),
      status:status,

    })
    const orderData = await order.save()
  } catch (error) {
    console.log(error.message);
  }
}
  module.exports = {
    loadChekout,
    placeOrder,
    // loadEmptyCheckout

    
  }