//Main starting point of the app
const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const app = express();
const router = require('./router');
const mongoose = require('mongoose');

// Db Setup
mongoose.connect('mongodb://localhost:auth/auth', {useNewUrlParser:true}).then(
    function(res){
        console.log('MongoDB connected. ', res);

    }
).catch(function(err){
    console.log('An Error Occured: ', err);
});

// App Setup - morgan for logging bodyParser for parsing requests
app.use(morgan('combined'));
app.use(bodyParser.json({ type: '*/*' }));
router(app);

// Server Setup
const port = process.env.PORT || 3090;
const server = http.createServer(app);
server.listen(port);
console.log('Server listening port on: ', port);