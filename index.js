const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
require('dotenv').config();
const authRoutes = require('./Routes/authRoutes');
const {requiredAuth, checkUser} = require('./middleware/authMiddleware');
app.set("view engine","ejs");

app.use(express.static("public"));
app.use(express.json());
app.use(cookieParser());

try{
     mongoose.connect(process.env.MONGO);
}catch(e){
   console.log(e);
}

app.get('*',checkUser);

app.get('/',(req,res)=>{
    res.render('home');
});

app.get('/smoothies',requiredAuth,(req,res)=>res.render('smoothies'));

app.use(authRoutes);

mongoose.connection.on("connected",()=>console.log('connected'));
mongoose.connection.on("disconnected",()=>console.log('disconnected'));


app.listen(process.env.PORT,()=>console.log(`http://localhost:${process.env.PORT}`));
