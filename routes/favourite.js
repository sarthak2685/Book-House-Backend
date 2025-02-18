const router = require("express").Router();
const User = require("../models/user");
const {authenticateToken} = require("./userAuth");

//add book to favorites
router.put("/add-book-to-favorites",authenticateToken,async(req,res)=>{
    try{
        const {bookid,id} = req.headers;
        const userData = await User.findById(id);
        const isBookfavourite = userData.favourites.includes(bookid);
        if(isBookfavourite){
            return res.status(200).json({message: "Book already in favorites"});
        }
        await User.findByIdAndUpdate(id,{$push:{favourites:bookid}});
        res.status(200).json({message: "Book added to favorites"});
    }
    catch(error){
        res.status(500).json({message: "Server Error"});
    }
})

//remove book from favorites
router.put("/remove-book",authenticateToken,async (req,res) => {
    try{
        const {bookid,id} = req.headers;
        const userData = await User.findById(id);
        const isBookfavourite = userData.favourites.includes(bookid);
        if(isBookfavourite){
           await User.findByIdAndUpdate(id,{$pull:{favourites:bookid}});
        }
        return res.status(200).json({message:"book removed from favorites"});
    } catch(error){
        res.status(500).json({message: "Server Error"});
    }
})
//get favourites books os a aprticular user
router.get("/get-favoutite-books",authenticateToken,async(req,res)=>{
    try{
        const {id} = req.headers;
        const userData = await User.findById(id).populate("favourites");
        const favouriteBooks = userData.favourites;
        return res.json({
            status: "success",
            data: favouriteBooks,
        })
        
    } catch(error){
        res.status(500).json({message: "Server Error"});
    }
})

module.exports = router;