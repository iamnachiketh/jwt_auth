const mongoose = require('mongoose');
const {isEmail} = require('validator');
const bcrypt = require('bcrypt');
const userSchema = new mongoose.Schema({
    email:{
        type:String,
        required:[true,'please enter the email'],
        unique:true,
        lowercase:true,
        validate:[isEmail,'please enter the valid email']
    },
    password:{
          type:String,
          minlength:[6,'Minimum length of password must be 6 characters'],
          required:[true,'please enter the password']
    }
});

userSchema.pre('save',async function(next){
   let saltRound = 10;
   let salt = await bcrypt.genSalt(saltRound);
   this.password = await bcrypt.hash(this.password,salt);
    next();
})

userSchema.statics.login = async function(email,password){
      const User = await this.findOne({email});
      if(User){
        if(await bcrypt.compare(password,User.password)){
            return User;
        }else{
           throw Error('incorrect Email/password');
        }
      }
      throw Error('incorrect Email/password');
}

const user = mongoose.model('Users',userSchema);

module.exports = user;