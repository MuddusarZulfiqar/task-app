const express = require('express');
const router = new express.Router()
const Task = require('../models/tasks');
const checkUser = require('../middlewares/checkLogin')
// * Tasks Related Routes

router.post('/tasks',checkUser,async(req,res,next)=>{
    const task = new Task(req.body);
    try {
        await task.save();
        console.log(req.user._id)
        res.json(task)
    } catch (error) {
        res.status(404).json(error);
    }
});

router.get('/tasks',async(req,res,next)=>{
    try {
    
    console.log(req.user);
      const tasks =  await Task.find();
       res.json(tasks);
    } catch (error) {
        res.json(error).status(500);
    }
});

router.get('/tasks/:id',async(req,res)=>{
    const {id} = req.params;
    try {
        const task = await Task.findById(id);
        if(!task){
            return res.status(404).send()
        }
        res.send(task);
    } catch (error) {
        res.status(404).send(err)
    }
})

router.patch('/tasks/:id',(async(req,res)=>{
    const userField =  Object.keys(req.body);
    const changeField = ['description','completed'];
    const validField = userField.every((field)=>changeField.includes(field));
    if(!validField){
        return res.status(500).send({error:'Invalid Parameter :('})
    }
    try {
        const task = await Task.findById(req.params.id);
        console.log(task)
        userField.forEach((update)=>task[update] = req.body[update])
        await task.save();

        if(!task){
            return res.status(404).send({error:'No data found'})
        }
        res.send(task)
    } catch (error) {
        res.status(500).send(error)
    }
}))

router.delete('/tasks/:id',async(req,res)=>{
    try {
        const {id} = req.params;
          const task = await Task.findByIdAndDelete(id);
          if(!task){
           return res.status(404).send({error:"Task not found"})
          }
          res.send(task)
       } catch (error) {
           res.status(500).send(error)
       }
})

module.exports = router;