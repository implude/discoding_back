const express = require("express");
const router = express.Router();
const connect = require("../config/database").connection;
const config = require("../routes/config");
const crypto = require("crypto");

router
  //앱 시작했을때
  .get("/online", (req, res) => {
    let a = "discoding=";
    for (let i = 0; i < 50; i++) {
      let math = Math.floor((Math.random() + 1) * 65);
      if (math >= 65 && math <= 90) {
        a = String.fromCharCode(math) + a;
      }
    }
    res.send(
      JSON.stringify({
        uuid: a,
      })
    );
  })
  //유저 토큰이 존재 X
  .get("/new", (req, res) => {
    let hashed_uid = crypto
      .createHmac(config.crypto_key1, config.crypto_key2)
      .update(req.body.uuid)
      .digest("base64");
    connect.query(
      "INSERT INTO user(uid, remain_time) VALUES (?, ?)",
      [hashed_uid, 0],
      (err, rows, fields) => {
        if (err) {
          res.send({ msg: "error" });
        }
      }
    );
  })
  //유저 토큰이 존재 O
  .get("/login", (req, res) => {
    connect.query("SELECT * FROM user", (err, rows, fields) => {
      if (err) {
        res.send({ msg: "error" });
      }
      let hashed_uid = crypto
        .createHmac(config.crypto_key1, config.crypto_key2)
        .update(req.body.uuid)
        .digest("base64");
      for (let i = 0; i < rows.length; i++) {
        if (rows[i].uid == hashed_uid) {
          res.send({ msg: "OK" });
        }
      }
    });
  })
  .get("/get-time", (req, res) => {
    connect.query(
      "INSERT INTO user(remaiin_time) VALUES (?)",
      [req.body.uuid, req.body.remain_time],
      (err, rows, fields) => {
        if (err) {
          res.send({ msg: "error" });
        }
      }
    );
  });

module.exports = router;
