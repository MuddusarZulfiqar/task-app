const mongoose = require('mongoose');

const databaseName = 'task-manager-api';
const connectionUrl = 'mongodb://127.0.0.1:27017/'+databaseName;

mongoose.connect(connectionUrl,{
    useNewUrlParser:true,
});
