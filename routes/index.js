const express = require("express");
const router = express.Router();
const connect = require("../config/database").connection;
const config = require("../routes/config");
const crypto = require("crypto");

router
  //처음 connection되었을 때 
  .get('/', (req, res) => {
    console.log('connection');
    res.send("OK")
  })

  .get('/online', (req, res) => {
    let a = 0;
    for (let i = 0; i < 20; i++) {
      let math = Math.floor((Math.random() + 1) * 65);
      if (math >= 65 && math <= 90) {
        a = String.fromCharCode(math) + a;
      }
    }
    res.send(JSON.stringify({ uuid: a }));
  })


  //유저 토큰이 존재 X
  .post("/new", (req, res) => {

    let hashed_uuid = crypto.createHmac(config.crypto_key1, config.crypto_key2).update(req.body.UUID).digest("base64");
    let info = [hashed_uuid, 0, 0]
    console.log('new', info[0])
    connect.query("INSERT INTO user (uuid, remain_time,primary_key) VALUES(?,?,?)", info, (err, rows, fields) => {
      if (err) { res.send(JSON.stringify({ msg: "error" })) }
      else {
        res.send(JSON.stringify({ msg: 'good' }))
      }
    }
    )
  })
  //유저 토큰이 존재 O
  .post("/login", (req, res) => {
    let bot_name = ""
    let des = ""
    let img = ""
    let hashed_uuid = crypto.createHmac(config.crypto_key1, config.crypto_key2).update(req.body.UUID).digest("base64");
    console.log('login', hashed_uuid)
    connect.query("SELECT * FROM created_bot where uuid=?", [hashed_uuid], (err, rows, fields) => {
      if (err) { console.log(err); res.send(JSON.stringify({ msg: "error" })) }
      else {
        for (let i = 0; i < rows.length; i++) {
          bot_name = bot_name + ' ' + rows[i].bot_name
          des = des + '/' + rows[i].des
          img = img + '/' + rows[i].bot_img
        }
        res.send(JSON.stringify({
          bot_name: bot_name,
          des: des,
          img: img
        }))
      }
    })
  })

  //봇 시간 증가파트
  .get("/get-time", (req, res) => {
    let remain_time
    let hashed_uuid = crypto.createHmac(config.crypto_key1, config.crypto_key2).update(req.body.uuid).digest("base64");
    connect.query(`SELECT * FROM user WHERE uuid=?`, [hashed_uuid], (err, rows, fields) => {
      remain_time = rows[0].remain_time
      connect.query("UPDATE user SET remain_time = ? WHERE uuid = ?", [req.body.get_time + remain_time, hashed_uuid], (err, rows, fields) => {
        if (err) { res.send(JSON.stringify({ msg: "error" })) }
      }
      );
    })
  })
  .get("/block-coding", function (req, res) {
    res.render("../views/blookly", { bot_token: 'OTAwMzY1Mzg0MTkwOTM1MDYw.YXAQmw.-npNxzhkFInAUBflJ4CEZa10cGc' });
  })

module.exports = router;

