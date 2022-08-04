const jwt = require('jsonwebtoken');
const User = require('../models/user')
const checkUser=(req,res,next)=>{
    if(!req.header('Authorization')) return res.status(401).send('Access Denied');
    const token = req.header('Authorization').replace('Bearer ','');
    if(!token) return res.status(401).send('Access Denied');
    try {
        const decoded = jwt.verify(token,'thisismyfirsttoken');
        const user = User.findOne({_id:decoded._id,'tokens.token':token});
        if(!user){
            throw new Error();
        }
        req.token = token;
        req.user = user
        next()
    } catch (error) {
        res.status(400).send('Invalid Token')
    }
}

module.exports = checkUser;