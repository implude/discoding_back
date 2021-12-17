const express = require("express");
const router = express.Router();
const connect = require("../config/database").connection;
const config = require("../routes/config");
const crypto = require("crypto");
const { NodeVM } = require('vm2');
const fs = require("fs");

const vm = new NodeVM({
  timeout: 5000,
  require: {
    external: true
  }
});

router
  //봇 만들기
  .post('/create_bot', (req, res) => {
    console.log(req.body)
    connect.query("SELECT * FROM created_bot where bot_name = ?", [req.body.botName], (err, rows, fields) => {
      if (rows.length >= 1) { res.send(JSON.stringify({ msg: "봇 이름이 중복됩니다. 다른 이름으로 설정해주세요." })) }
      else {
        let info = [crypto.createHmac(config.crypto_key1, config.crypto_key2).update(req.body.userid).digest("base64"), req.body.botName, req.body.description, req.body.img_url, req.body.token, 0]
        console.log('created_bot', info[0])
        connect.query('INSERT INTO created_bot(uuid, bot_name, des, bot_img,token, num) VALUES (?, ?, ?, ?, ?, ?)', info, (err, rows, fields) => {
          if (err) { console.log(err); res.send(JSON.stringify({ msg: 'error' })) }
          else {
            res.send(JSON.stringify({ msg: 'OK' }))
          }
        })
      }
    })
  })

  .post('/edit_bot', (req, res) => {
    console.log(req.body)
    let sql = "UPDATE created_bot SET bot_name = ?, des = ? WHERE bot_name = ?"
    connect.query(sql, [req.body.chname, req.body.des, req.body.name], (err, rows, fields) => {
      if (err) { console.log(err) }
      else res.send(JSON.stringify({
        msg: "good"
      }))
    })
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
  .post('/hosting_bot', (req, res) => {
    console.log(req.body.code)
    let name = req.body.bot_name
    let code = req.body.code
    // fs.writeFile(`./public/bot-codes/${name}`, code, (err) => {
    //   if (err === null) {
    //     console.log('success');
    //   } else {
    //     console.log('fail');
    //   }
    // })
    // fs.readFile(`${name}`, 'utf-8', (err, data) => {
    //   vm.run(`${data}`, "vm.js");
    // })
    vm.run(`${code}`, "vm.js");
  })
  //test는 5초
  .post('/test_bot', (req, res) => {
    console.log(req.body.code)
    try {
      vm.run(`${req.body.code}
      setTimeout(() => {
        console.log('good');
        process.exit(1)
      }, 5000);`, 'vm.js');
    } catch (err) {
      console.error('Failed to execute script.', err);
    }
  })
  .post('/delete_bot', (req, res) => {
    console.log(req.body.name)
    let sql = "DELETE FROM created_bot WHERE bot_name = ?"
    connect.query(sql, [req.body.name], (err, rows, fields) => {
      if (err) { res.send(JSON.stringify({ msg: "error" })); console.log(err) }
      else { res.send(JSON.stringify({ msg: "good" })) }
    })
  })
  .post('/bot-save', (req, res) => {
    console.log(req.body)
    let sql = "SELECT * FROM created_bot WHERE bot_name = ?"
    connect.query(sql, [req.body.name], (err, rows, fields) => {
      res.send(JSON.stringify({
        token: rows[0].token
      }))
    })
    fs.writeFile(`./public/bot-codes/${req.body.name}.xml`, req.body.code, (err) => {
      if (err === null) {
        console.log('success');
      } else {
        console.log('fail');
      }
    })
  })
  .post('/bot-load', (req, res) => {
    console.log(req.body.name)
    let sql = "SELECT * FROM created_bot WHERE bot_name = ?"
    connect.query(sql, [req.body.name], (err, rows, fields) => {
      fs.readFile(`./public/bot-codes/${req.body.name}.xml`, 'utf-8', (err, data) => {
        res.send(JSON.stringify({
          data: data,
          token: rows[0].token
        }))
      })
    })
  })
  .post('/get_bot_token', (req, res) => {
    let sql = "SELECT * FROM created_bot WHERE bot_name = ?"
    connect.query(sql, [req.body.name], (err, rows, fields) => {
      console.log(err)
      res.send(JSON.stringify({
        token: rows[0].token
      }))
    })
  })
module.exports = router;

