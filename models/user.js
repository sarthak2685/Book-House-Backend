const mongoose = require('mongoose');


const user = new mongoose.Schema({
    username:{
        type:String,
        required: true,
        unique: true,
        
    },
    email:{
        type:String,
        required: true,
        unique: true,
    },
    password:{
        type:String,
        required: true,
    },
    address:{
        type:String,
        required: true,
    },
    avatar:{
        type:String,
        default:"https://imgs.search.brave.com/xnqr25vEcryM0vfEZzlPT_WwrGob8LeHYAV3SXTM6qs/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5nZWVrc2Zvcmdl/ZWtzLm9yZy93cC1j/b250ZW50L3VwbG9h/ZHMvMjAyMTAyMDkw/MDQ0MTMvQVZBVEFS/Mi5wbmc",
    },
    role:{
        type:String,
        default:"user",
        enum:["user", "admin"],
    },
    favourites:[{
        type: mongoose.Types.ObjectId,
        ref: "books"
    }],
    cart:[{
        type: mongoose.Types.ObjectId,
        ref: "books"
    }],
    orders:[{
        type: mongoose.Types.ObjectId,
        ref: "order"
    }],
},

{timestamps:true})

module.exports = mongoose.model('user', user);