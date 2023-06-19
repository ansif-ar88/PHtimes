const couponmodel = require("../modals/couponmodel")

//============= LOAD COUPON PAGE ===========

const loadCoupon = async (req,res) => {
try {
    const adminData = req.session.Auser_id
    res.render("coupon",{admin:adminData})
} catch (error) {
    console.log(error.message);
}
}


module.exports = {
    loadCoupon,

}