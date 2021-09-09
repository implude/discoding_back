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
  .get('/createbot', (req, res) => {
    let info = [req.body.uuid, req.body.bot_name, req.body.des, req.body.token, req.body.js_code]
    connect.query('INSERT INTO created_bot(uuid, bot_name, dex, token, js_code) VALUES (?, ?, ?, ?, ?)', info, (err, rows, fields) => {
      if (err) { res.send({ msg: 'error' }) };
    });
  })

module.exports = router;
