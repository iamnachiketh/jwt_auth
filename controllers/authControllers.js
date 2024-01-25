const user = require('../models/User');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const createToken = (id)=>{
    return jwt.sign({id},process.env.MYSECRET,{expiresIn:24*60*60})
}

function handleErrors(err) {
    const Error = { email: '', password: '' };
    const loginError = {message:''};
    //console.log(err.message);
     
    if(err.message==='incorrect Email/password'){
        loginError.message = loginError.message + err.message;
        return loginError;
    }

    if(err.code===11000){
       Error.email = Error.email + 'The email already exists';
       return Error;
    }
    //console.log(err);
    if (err.message.includes('Users validation failed')) {
        Object.values(err.errors).forEach((error) => {
            if (error.properties.message.includes('please enter the valid email')) {
                Error.email = Error.email + error.properties.message;
            }
            if (error.properties.message.includes('Minimum length of password must be 6 characters') || error.properties.message.includes('please enter the password')) {
                Error.password = Error.password + error.properties.message;
            }
        });
    }
    return Error;
}

module.exports.signup_get = (req, res) => {
    res.render('signup');
}

module.exports.login_get = (req, res) => {
    res.render('login');
}

module.exports.signup_post = async (req, res) => {
    const { email, password } = req.body;
     try {
        await user.create({email,password})
            .then((Response) => { 
                const token = createToken(Response._id);
                res.cookie('jwt',token,{httpOnly:true,maxAge:24*60*60*1000});
                res.status(201).json({ message: 'The user has been created with this id '+Response._id })
            });
} catch (err) {
    const Error = handleErrors(err);
    res.status(400).json({Error});
} 

}

module.exports.login_post = async (req, res) => {
    const {email,password} = req.body;

    try{
        const success = await user.login(email,password);
        const token = createToken(success._id);
        res.cookie('jwt',token,{httpOnly:true,maxAge:24*60*60*1000});
        res.status(200).json({message:'The user has an id '+success._id});
    }catch(err){
        const Error = handleErrors(err);
        res.status(400).json({ERROR:Error});
    }
}

module.exports.logout_get = async(req,res)=>{
         res.cookie('jwt','',{maxAge:1});
         res.redirect('/login');
}