const express = require("express");
const router = express.Router();
const connect = require("../config/database").connection;
const config = require("../routes/config");
const crypto = require("crypto");

router
  //유저 토큰이 존재 X
  .get("/new", (req, res) => {
    let hashed_uuid = crypto.createHmac(config.crypto_key1, config.crypto_key2).update(req.body.uuid).digest("base64");
    connect.query("INSERT INTO user(uid, remain_time) VALUES (?, ?)", [hashed_uuid, 0], (err, rows, fields) => {
      if (err) { res.send(JSON.stringify({ msg: "error" })) }
    }
    )
  })
  //유저 토큰이 존재 O
  .get("/login", (req, res) => {
    connect.query("SELECT * FROM user", (err, rows, fields) => {
      if (err) { res.send(JSON.stringify({ msg: "error" })) }
      else {
        let hashed_uuid = crypto.createHmac(config.crypto_key1, config.crypto_key2).update(req.body.uuid).digest("base64");
        for (let i = 0; i < rows.length; i++) {
          if (rows[i].uuid == hashed_uuid) {
            get_bot_apply(hashed_uid)
          }
        }
      }
    })
  })
  .get("/get-time", (req, res) => {
    connect.query("INSERT INTO user(remaiin_time) VALUES (?)", [req.body.uuid, req.body.remain_time], (err, rows, fields) => {
      if (err) { res.send(JSON.stringify({ msg: "error" })) }
    }
    );
  });

function get_bot_apply(uuid) {
  connect.query("SELECT * FROM created_bot", (err, rows, fields) => {
    let bot_name = []
    let des = []
    let img = []
    if (err) { res.send({ msg: 'error' }) }
    else {
      for (let i = 0; i < rows.length; i++) {
        if (rows[i].uuid == uuid) {
          bot_name.push(rows[i].bot_name)
          des.push(rows[i].des)
          img.push(rows[i].bot_img)
        }
      }
      res.send(JSON.stringify({
        bot_name: bot_name,
        des: des,
        img: img
      }))
    }
  })
}

module.exports = router;
