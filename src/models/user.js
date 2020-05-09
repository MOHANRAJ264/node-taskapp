const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Task = require('./task')
const userschema= new mongoose.Schema({
    name:{
        type: String,
        required:true,
        trim:true
    },
    email:{
        type:String,
        unique:true,
        required:true,
        trim:true,
        lowercase:true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error('email is invalid')
            }
        }
    },password:{
        type:String,
        required:true,
        trim:true,
        minlength:7,
        validate(value){
            if(value.toLocaleLowerCase().includes('password')){
                throw new Error('password cannot contains password')
            }
        }

    },

    age:{
        type: Number,
        default:0,
        validate (value){
            if (value<0){
                throw new Error('age must be a positive number')
            }
        }
    },avatar:{
        type:Buffer
    },
    tokens:[{
        token:{
        type:String,
        required: true
        }
    }]
},{
    timestamps:true
})

userschema.virtual('tasks',{
    ref:'Task',
    localField:'_id',
    foreignField:'owner'
})

userschema.methods.toJSON = function(){   // to hide password and token
    const user = this
    const userobject = user.toObject()  // instead of creating function and call it it all toJson is applied to all calls
    delete userobject.password
    delete userobject.tokens
    delete userobject.avatar
    return userobject

}
userschema.methods.generatetoken = async function(){
    const user = this
    const token = jwt.sign({_id: user._id.toString()},process.env.jwt_secret)
    user.tokens=user.tokens.concat({token})
    await user.save()
    return token
}


userschema.statics.findByCredentials = async(email,password)=>{
    const user = await User.findOne({email:email})
    if(!user){
        throw new Error('unable to log in')
    }
    const isMatch = await bcrypt.compare(password,user.password)
    if(!isMatch){
        throw new Error('unable to log in')
    }
    return user
}


//hash passwors
userschema.pre('save', async function(next){  //dont use arrow function  . we cant bind(thisi) data in =>{}
    const user=this
    if(user.isModified('password')){
        user.password = await bcrypt.hash(user.password,8)
    }

    next()                                      // to get out of pre
})

//delete user task when user removed
userschema.pre('remove',async function(next){
    const user = this 
     await Task.deleteMany({owner:user._id})
    next()
})

const User = mongoose.model('User',userschema)


module.exports=User