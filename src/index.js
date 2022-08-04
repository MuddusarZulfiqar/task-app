const express = require('express');
require('./db/mongoose');
const userRouter = require('./routes/userRoutes')
const taskRouter = require('./routes/taskRouter')
const app = express();
// app.use(bodyParser)

const PORT = process.env.PORT || 3000;

// app.use((req,res,next)=>{
//     console.log(req.method,req.path);
//     // if(req.method){
//     //     res.status(503).send('Maintenance Error check back soon')
//     // }
//     // else{
//     //     next();
//     // }
    
// });
app.use(express.json());
app.use(userRouter)
app.use(taskRouter)

app.listen(PORT,()=>{
    console.log(`The server start: http://localhost:${PORT}`)
})

const jwt = require('jsonwebtoken');

const functionData = async = ()=>{
//    const token = jwt.sign({
//     _id:'abc123'
//    },'thisismynewcourse',{
//     expiresIn:'7 days'
//    });

// //    console.log(token);

//    const data = jwt.verify(token,'thisismynewcourse');
//    console.log(data)
}

functionData()