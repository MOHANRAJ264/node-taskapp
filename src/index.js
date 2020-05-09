//npm i bcryptjs              to hash password
//npm i jsonwebtoken
// sendgrid is used for email uname:tmohanraj264  pw:tmohanraj264
//in atlas both   main pass word appu kuttiusername and password: taskapp
          
const express = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const multer= require('multer')
require('./db/mongoose')
const User = require('./models/user')
const Task = require('./models/task')
const userrouter= require ('./routers/users')   // routers are used to split a big file into small files
const taskrouter =require('./routers/tasks')
const app = express()
const port = process.env.PORT

// app.use((req,res,next)=>{                      // disable get method  & its a middleware 
//     if(req.method === 'GET'){
//         res.send('get is disabled')
//     }
//     else{
//         next()
//     }

// })

// app.use((req,res,next)=>{                         // enable for maintanance mode
//         res.status(503).send('under maintanance')
// })

app.use(express.json())
app.use(userrouter)
app.use(taskrouter)        // we should use this to use router files

app.listen(port, () => {
    console.log('server started' + port)
})


