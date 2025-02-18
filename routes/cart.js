const router = require("express").Router();
const User = require("../models/user");
const {authenticateToken} = require("./userAuth")

//add to cart
router.put("/add-to-cart",authenticateToken, async (req, res) => {
    try{
    const {bookid,id} = req.headers;
    const userData = await User.findById(id);
    const isBookcart = userData.cart.includes(bookid);
    if(isBookcart) {
        return res.status(200).json({message: "Book already in cart"});
    }
    await User.findByIdAndUpdate(id,{
        $push: {cart: bookid},
    })
    return res.json({
        status: "success",
        message: "Book added to cart",
    });
} catch(error){
    return res.status(500).json({message: "Server Error"});
}
})

//remove from cart
router.put("/remove-from-cart",authenticateToken,async(req, res)=>{
    try{
    const {bookid,id}= req.headers;
    const userData = await User.findById(id);
    const isBookcart = userData.cart.includes(bookid);
    if(isBookcart) {
        await User.findByIdAndUpdate(id,{
            $pull: {cart: bookid},
        })
        return res.json({
            status: "success",
            message: "Book removed from cart",
        });
    }
} catch (error){
    return res.status(500).json({message: "Server Error"});
}

})

//get cart items

router.get("/get-cart-items", authenticateToken, async (req, res) => {
    try{
        const {id} = req.headers;
        const userData = await User.findById(id).populate("cart");
        const cart = userData.cart.reverse();
        return res.json({
            status: "success",
            data: cart,
        });
    } catch(error){
        return res.status(500).json({message: "Server Error"});
    }
})  



module.exports = router;