const express = require('express');
const path = require('path');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const login = require('./routes/login');
const socketio = require('socket.io')

const app = express();
const port = process.env.PORT;

const server = app.listen(port, ()=>{
    console.log('run')
})

const io = socketio.listen(server)

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

io.on('connection',function (socket){

})
