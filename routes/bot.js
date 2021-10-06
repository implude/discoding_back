const express = require("express");
const router = express.Router();
const connect = require("../config/database").connection;
const config = require("../routes/config");
const crypto = require("crypto");
const { NodeVM } = require('vm2');
const fs = require("fs");

const vm = new NodeVM({
  require: {
    timeout: 5000,
    external: true
  }
});
const vm2 = new NodeVM({
  require: {
    external: true
  }
});


router
  //봇 테스트 파트
  .get("/test", (req, res) => {
    let code = req.body.bot_code;
    vm.run(`${code}`, "vm.js");
    res.send("OK")
  })
  //봇 정보 불러오기
  .get('/bot_info', (req, res) => {
    let name = req.body.bot_name
    connect.query("SELECT * FROM created_bot", (err, rows, fields) => {
      for (let i = 0; i < rows.length; i++) {
        if (rows[i].bot_name == name) {
          res.send(JSON.stringify({
            bot_name: rows[0].bot_name,
            des: rows[0].des,
            bot_id: rows[0].bot_id,
            token: rows[0].token,
            bot_img: rows[0].bot_img
          }))
        }
      }
    })
  })
  //봇 만들기
  .get('/create_bot', (req, res) => {
    let name = req.body.bot_name
    let code = req.body.bot_code

    let info = [req.body.uuid, req.body.bot_name, req.body.des, req.body.token, req.body.bot_code]
    connect.query("SELECT * FROM created_bot", (err, rows, fields))
    for (let i = 0; i < rows.length; i++) {
      if (rows[i].bot_name == name) {
        res.send({ msg: '봇 이름이 중복됩니다.' })
      } else {
        connect.query('INSERT INTO created_bot(uuid, bot_name, des, token, js_code) VALUES (?, ?, ?, ?, ?)', info, (err, rows, fields) => {
          if (err) { res.send(JSON.stringify({ msg: 'error' })) };
          fs.writeFile(`./public/bot-codes/${name}`, code, (err) => {
            if (err === null) {
              console.log('success');
            } else {
              console.log('fail');
            }
          })
        });
      }
    }
  })

  //봇 호스팅하기
  .get('/hosting_bot', (req, res) => {
    let name = req.body.bot_name
    fs.readFile(`${name}`, 'utf-8', (err, data) => {
      vm2.run(`${data}`, "vm.js");
    })
  })
  .get('/hosting_bot_stop', (req, res) => {
    let name = req.body.bot_name
    fs.readFile(`${name}`, 'utf-8', (err, data) => {
      vm2.run(`${data}` + 'setTimeout(() => { exit() }, 1000)', "vm.js")
    })
  })
module.exports = router;
