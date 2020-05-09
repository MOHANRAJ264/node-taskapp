// for complex validation ues nom i validator
const mongoose = require('mongoose')
mongoose.connect(process.env.MONGODATABSE,{useNewUrlParser:true,useCreateIndex:true})

// const me = new User({
//     name:'    mohan    ',
//     email:'dfghAadsAS@example.com',
//     password:'  phonw12345677'
// })

// me.save().then(()=>{
//      console.log(me)   
// }).catch((error)=>{
//     console.log('error', error)
// })
// const t1 = new tasks({
//     description:'   sports    ',
//     completed:true
// })
// t1.save().then(()=>{
//     console.log(t1)
// }).catch((error)=>{
//     console.log(error)
// })
