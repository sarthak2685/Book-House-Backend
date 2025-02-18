const router = require("express").Router();
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const {authenticateToken} = require("./userAuth");
// Define the routes
router.post("/sign-up", async (req, res) => {
    try {
        const {username,email,password,address} = req.body;
        
        // check username lenght is more than 3
        if(username.length<4)
        {
            return res.status(400).json({ message: "Username should be more than 3 characters" });
        }
        // check username already exists
        const existingUsername = await User.findOne({ username: username});
        if(existingUsername)
            {
                return res.status(400).json({ message: "Username already exists" });
            } 
         // check email already exists
         const existingEmail = await User.findOne({ email: email});
        if(existingEmail){
            return res.status(400).json({ message: "Email already exists"});

        } 
        // check password lenght is more than 6
        if(password.length < 5){
            return res.status(400).json({ message: "Password should be more than 5 characters" });
        } 
        const hashpassword = await bcrypt.hash(password,10);
        // create a new user
        const newUser = new User({
            username: username,
            email: email,
            password: hashpassword,
            address: address,
        })
        await newUser.save();
        res.status(200).json({ message: "signup successfully!" });
    } catch (err) {
        res.status(500).json({ message: "Internal Server Error"});
    }
})

//login API
router.post("/sign-in", async (req, res) => {
    try {
        const {username, password} = req.body;
        const existingUser=await User.findOne({ username});
        if(!existingUser){
            return res.status(400).json({ message: "User not found" });
        }
        await bcrypt.compare(password, existingUser.password,(err, data) => {
            if(data){
                const autClaims = [{name:existingUser.username}, {role:existingUser.role}];
                const token = jwt.sign({ autClaims}, "bookStore123",{
                    expiresIn: "30d",
                })

                res.status(200).json({
                 id: existingUser._id, 
                 role: existingUser.role, 
                 token: token,});
            }
            else{
                res.status(400).json({ message: "Invalid password" });
            }
        })

    } catch (err) {
        res.status(500).json({ message: "Internal Server Error"});
    }
})

//get user-information
router.get("/get-user-information",authenticateToken,async (req,res) => {
    try {
        const {id} = req.headers;
        const data = await User.findById(id).select('-password');
        return res.status(200).json(data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
})
// upadte adress
router.put("/update-address",authenticateToken,async (req,res) => {
    try {
        const {id} = req.headers;
        const {address} = req.body;
        await User.findByIdAndUpdate(id, {address: address});
        return res.status(200).json({ message: "Address updated successfully!" });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
});

module.exports = router;
