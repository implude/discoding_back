const express = require('express');
const router = express.Router();
const mysql = require('mysql');
const db = require('../config/database.js');

router
.post('/register', (req, res)=>{
    let params = [req.body.id, req.body.password]
    let sql ="INSERT INTO user(uid, password) VALUES (?,?);"
     db.connection.query(sql,params, (err, results)=>{
      if(err) throw err;
      console.log('갑니다')
    })
})

module.exports = router;
