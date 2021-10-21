const express = require("express");
const router = express.Router();
const connect = require("../config/database").connection;
const config = require("../routes/config");
const crypto = require("crypto");
const { NodeVM } = require('vm2');
const fs = require("fs");

const vm = new NodeVM({
  require: {
    external: true
  }
});

router
  //봇 정보 불러오기
  // .post('/bot_info', (req, res) => {
  //   let info = [req.body.uuid]
  //   console.log(info[0])
  //   connect.query("SELECT * FROM created_bot WHERE uuid = ?", info, (err, rows, fields) => {
  //     console.log(rows)
  //     if (err) { console.log(err); res.send(JSON.stringify({ msg: err })) }
  //     else {
  //       for (let i = 0; i < rows.length; i++) {
  //         res.send(JSON.stringify({
  //           bot_name: rows[0].bot_name,
  //           des: rows[0].des,
  //           bot_id: rows[0].bot_id,
  //           bot_img: rows[0].bot_img
  //         }))
  //       }
  //     }
  //   })
  // })
  //봇 만들기
  .post('/create_bot', (req, res) => {
    let info = [crypto.createHmac(config.crypto_key1, config.crypto_key2).update(req.body.userid).digest("base64"), req.body.botName, req.body.description, req.body.img_url, 0]
    console.log('created_bot', info[0])
    connect.query('INSERT INTO created_bot(uuid, bot_name, des, bot_img, num) VALUES (?, ?, ?, ?, ?)', info, (err, rows, fields) => {
      if (err) { console.log(err); res.send(JSON.stringify({ msg: 'error' })) }
      else {
        res.send(JSON.stringify({ msg: 'OK' }))
      }
    })
  })
  .post('/edit_bot', (req, res) => {

  })
  .post('/hosting_page', (req, res) => {
    let hashed_uuid = crypto.createHmac(config.crypto_key1, config.crypto_key2).update(req.body.userid).digest("base64");
    connect.query("SELECT * FROM user WHERE uuid = ?", [hashed_uuid], (err, rows, fields) => {
      res.send(JSON.stringify({
        remaintime: rows[0].remain_time
      }))
    })
  })
  //봇 호스팅하기 
  .get('/hosting_bot', (req, res) => {
    let name = req.body.bot_name
    let code = req.body.js_code
    fs.writeFile(`./public/bot-codes/${name}`, code, (err) => {
      if (err === null) {
        console.log('success');
      } else {
        console.log('fail');
      }
    })
    fs.readFile(`${name}`, 'utf-8', (err, data) => {
      vm.run(`${data}`, "vm.js");
    })
  })
module.exports = router;
