const express = require('express');
const app = express();
const cors = require("cors");
// setting up body-parser middleware
require('dotenv').config();
app.use(cors());

const port = process.env.PORT || 3000;
require("./connection/conn");
const user = require("./routes/user");
const Book = require("./routes/book");
const Favorite = require("./routes/favourite");
const Cart = require("./routes/cart");
const Order = require("./routes/order");

app.use(express.json());
//using routes
app.use("/api/v1", user);
app.use("/api/v1", Book);
app.use("/api/v1", Favorite);
app.use("/api/v1", Cart);
app.use("/api/v1", Order);


app.get("/",(req, res)=>{
    res.send('Hello From Backend side');
})

//creating port
app.listen(port, ()=>{
    console.log(`Server listening on ${port}`);
})