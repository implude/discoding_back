const express = require('express');
const path = require('path');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const login = require('./routes/login');
const PORT = process.env.PORT

const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use('/', require('./routes/index'))
// app.use('/account', require('./routes/account'));

app.listen(PORT,()=>{
  console.log('Listening at port number 3000') //포트는 원하시는 번호로..
})