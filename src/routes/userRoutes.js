const express = require('express');
const router = new express.Router()
const User = require('../models/user')
// const bcrypt = require('bcryptjs');
const isLogin = require('../middlewares/checkLogin')
// ! Users Related Routes

router.post('/users', async (req,res,next)=>{
    const user = new User(req.body);

    try {
        await user.save()
        const token = await user.generateAuthToken();
        // res.header('auth-token',token);
        res.status(201).send({user,token})
    } catch (error) {
        res.status(400).send(error);
    }
})

router.post('/users/login',async (req,res)=>{
    try {
        const user = await User.findByCredentials(req.body.email,req.body.password);
        const token = await user.generateAuthToken();
        // console.log(req.user)
        res.send({user,token});
    } catch (error) {
        res.status(400).send(error)
    }
})

router.post('/users/logout',isLogin,async (req,res)=>{
    try {
        req.user.tokens = req.user.tokens.filter((token)=>{
            return token.token != req.token
        });
        await req.user.save();
        res.send('Successfully logout');
    } catch (error) {
        res.status(500).send()
    }
})

router.get('/users',async(req,res,next)=>{

    try{
       const users = await User.find();
       res.send(users).status(200);
    }catch(err){
        res.status(500).json(err)
    }
});

router.get('/users/:id',async(req,res,next)=>{
    const {id} = req.params;
    // console.log(id)

    try {
        const user = await User.findById(id);
        if(!user){
            return res.status(404).send()
        }
        res.send(user)
    } catch (error) {
        res.status(500).send(error)
    }
});

router.patch('/users/:id', async (req,res)=>{
    const update = Object.keys(req.body);
    const allUpdates = ['name','email','password','age'];
    const isValid = update.every((update)=>allUpdates.includes(update))
    if(!isValid){
        return res.status(400).send({error:"Invalid Parameter :("});
    }
    try {
        const updatedUser = await User.findById(req.params.id)

        update.forEach((update)=>updatedUser[update] = req.body[update])
        
        await updatedUser.save();

        if(!updatedUser){
            return res.status(404).send()
        }
        res.send(updatedUser);
    } catch (error) {
        res.status(500).send(error)
    }
})

router.delete('/users/:id',async (req,res)=>{
    try {
     const {id} = req.params;
       const user =  await User.findByIdAndDelete(id);
       if(!user){
        return res.status(404).send({error:"User not found"})
       }
       res.send(user)
    } catch (error) {
        res.status(500).send(error)
    }
})



module.exports = router