const express = require('express')
const Task = require('../models/task')
const router = new express.Router()
const auth = require('../middleware/auth')


router.post('/tasks', auth,async (req, res) => {
    //const task = new Task(req.body)
    const task = new Task({
        ...req.body,
        owner : req.user._id
    })
    try{
        await task.save()
        res.status(201).send(task)
    }catch(e){
        res.status(400).send()
    }
    // const task = new Task(req.body)
    // task.save().then(() => {
    //     res.status(201)
    //     res.send(task)
    // }).catch((e) => {
    //     res.status(400)
    //     res.send(e)
    // })
})
//get/tasks?completed:true
//pagination   --limit,skip  //populate not working for me ref screenshot in mobile
router.get('/tasks',auth, async(req, res) => {
    try{
        const task = await Task.find({owner:req.user.id })  
        res.send(task)//or below line both same
        // await req.user.populate('tasks').execPopulate()
        // res.send(req.user.tasks)
    }catch(e){
        res.status(500).send()
    }
    // Task.find({}).then((tasks) => {
    //     res.send(tasks)
    // }).catch((e) => {
    //     res.status(500).send()
    // })
})
router.get('/tasks/:id',auth, async(req, res) => {
    const _id = req.params.id
    try{
        const task = await Task.findOne({_id,owner:req.user._id})
        if(!task){
            return res.status(404).send()
        }
        res.send(task)
    }catch(e){
        res.status(500).send()
    }
    // Task.findById(_id).then((tasks) => {
    //     if (!tasks) {
    //         return res.status(404).send()
    //     }
    //     res.send(tasks)
    // }).catch((e) => {
    //     res.status(400).send()
    // })
})

router.patch('/tasks/:id',auth, async (req,res)=>{
    const updates=Object.keys(req.body)
    const allowedupdates=['description','completed']
    const isvalidoperation=updates.every((update)=>{
       return allowedupdates.includes(update)
    })     
    if(!isvalidoperation){
        return res.status(400).send('invalid update')
    }
    try{
        const task = await Task.findOne({_id:req.params.id,owner:req.user._id})
        updates.forEach((update)=>task[update] =  req.body[update])
        await task.save()
        if(!task){
            return res.status(404).send()
        }
        res.send(task)
    }catch(e){
        res.status(400).send(e)
    }
})

router.delete('/tasks/:id',auth,async(req,res)=>{
    try{
        const task= await Task.findOneAndDelete({_id:req.params.id,owner:req.user._id})
        if(!task){
            return res.status(404).send()
        }
        res.send(task)
    }catch(e){
        res.status(500).send()
    }
})



module.exports=router