const mongoose = require('mongoose');

const taskSchema = mongoose.Schema({
    description:{
        type:String,
        required:true,
        trim:true
    },
    completed:{
        type:Boolean,
        required:true,
        default:false
    }
})
const Task = mongoose.model('Task',taskSchema);

module.exports = Task;