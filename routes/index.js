const express = require("express");
const router = express.Router();
const connect = require("../config/database").connection;

router
  .get('/', (req, res) => {
    console.log('connection')

  })
  .get("/block-coding", function (req, res) {
    res.render("../views/blookly");
  })
  //앱 시작했을때
  .get("/online", (req, res) => {
    let a = "discoding=";
    for (let i = 0; i < 50; i++) {
      let math = Math.floor((Math.random() + 1) * 65);
      if (math >= 65 && math <= 90) {
        a = String.fromCharCode(math) + a;
      }
    }
    connect.query("SELECT * FROM user", (err, rows, fields) => {
      for (let i = 0; i < rows.length; i++) {
        if (rows[i].uuid == a) {
          for (let i = 0; i < 50; i++) {
            let math = Math.floor((Math.random() + 1) * 65);
            if (math >= 65 && math <= 90) {
              a = String.fromCharCode(math) + a;
            }
          }
        } else {
          res.send(JSON.stringify({
            uuid: a,
          }))
        }
      }
    })

  })
module.exports = router;
