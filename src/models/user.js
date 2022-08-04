const validator = require('validator');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true
    },
    age:{
        type:Number,
        default:0,
        validate(value){
            if(value < 0){
                throw new Error('Age must be a +ve number')
            }
        }
    },
    email:{
        type:String,
        required:[true,'Please Enter a email'],
        trim:true,
        lowercase:true, 
        unique:true,
        sparse:true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error('Email is invalid :(')
            }
        }
    },
    password:{
        type:String,
        required:true,
        minLength: [6, 'Must be at least 6, got {VALUE}'],
        validate(value){
            if(value.toLowerCase().includes('password')){
                throw new Error('Password is so easy\nPlease Try again ');
            }
        }
    },
    created_at:{
        type:Date,
        default:new Date(),
        required:true
    },
    tokens:[{
        token:{
            type:String,
            required:true
        }
    }]
})

// * Generate the token before login !

userSchema.methods.generateAuthToken = async function(){
    const user = this;
    const token = jwt.sign({_id:user._id},'thisismyfirsttoken');
   
    user.tokens = user.tokens.concat({token});
    console.log(user.tokens);
    await user.save();

    return token;
}

// * Login Condition

userSchema.statics.findByCredentials = async function(email,password){
    const user = await User.findOne({email});
    if(!user){
        throw new Error('Unable to login');
    }

    const isMatch = await bcrypt.compare(password,user.password);
    if(!isMatch){
        throw new Error('Unable to login');
    }

    return user;
}



// * Hash Password

userSchema.pre('save',async function(next){
    const user = this;

    if(user.isModified('password')){
        user.password  = await bcrypt.hash(user.password,8)
    }

    next()
});

const User = mongoose.model('User',userSchema);

module.exports = User