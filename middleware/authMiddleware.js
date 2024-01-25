const jwt = require('jsonwebtoken');
const user = require('../models/User');
require('dotenv').config();
const requiredAuth =(req,res,next)=>{
     const token = req.cookies.jwt
     if(token){
        jwt.verify(token,process.env.MYSECRET,(err,decodedToken)=>{
                if(err){
                    res.redirect('/login');
                }else{
                    console.log(decodedToken);
                    next();
                }
        })
     }else{
        res.redirect('/login');
     }
}

const checkUser = (req,res,next)=>{
    const token = req.cookies.jwt
    if(token){
       jwt.verify(token,process.env.MYSECRET,async (err,decodedToken)=>{
               if(err){
                res.locals.xyz = null;
                next();
               }else{
                let Response = await user.findById(decodedToken.id);
                res.locals.xyz = Response;
                next();
               }
       })
    }else{
        res.locals.xyz = null;
        next();
    }
}

module.exports = {requiredAuth,checkUser};