const express = require('express')
const router = express.Router();
const mysql = require('mysql');

const connection = mysql.createConnection({
    host: '127.0.0.1',
    port: '3306',
    user: 'root',
    password: '98o0lerswdxi8ukl',
    database: 'test'
})

connection.connect();
module.exports = { connection };