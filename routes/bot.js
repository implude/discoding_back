const express = require("express");
const router = express.Router();
const connect = require("../config/database").connection;
const config = require("../routes/config");
const crypto = require("crypto");
const { NodeVM } = require("vm2");

const vm = new NodeVM({
  require: {
    external: true,
  },
})

router
  .get("/test", (req, res) => {
    let code = req.body.botcode;
    vm.run(`${code}`, "vm.js").then(() => {
      if (err) res.send({ msg: "error" });
    })
  })
  .get('/bot', (req, res) => {
    let name = req.body.bot_name
    connect.query("SELECT * FROM created_bot", (err, rows, fields) => {
      for (let i = 0; i < rows.length; i++) {
        if (rows[i].bot_name == name) {
        }
      }
      res.send(JSON.stringify({
        bot_name: rows[0].bot_name,
        des: rows[0].des,
        bot_id: rows[0].bot_id,
        token: rows[0].token,
        bot_img: rows[0].bot_img
      }))
    })
  })
  .get('/createbot', (req, res) => {
    let info = [req.body.uuid, req.body.bot_name, req.body.des, req.body.token, req.body.js_code]
    connect.query("SELECT * FROM created_bot", (err, rows, fields))
    connect.query('INSERT INTO created_bot(uuid, bot_name, dex, token, js_code) VALUES (?, ?, ?, ?, ?)', info, (err, rows, fields) => {
      if (err) { res.send({ msg: 'error' }) };
    });
  })
  .get('/hosting', (req, res) => {
  })

module.exports = router;
