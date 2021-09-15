const express = require("express");
const router = express.Router();
const connect = require("../config/database").connection;

router
  .get('/', (req, res) => {
    console.log('connection');
    res.send(JSON.stringify({ msg: 'OK' }))
  })
  // .get('/member/:data1/:data2/:data3', (req, res) => {
  //   res.send({ msg: 'OK' })
  //   console.log(req.params.data1)
  //   console.log(req.params.data2)
  //   console.log(req.params.data3)
  // })

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
  .get("/block-coding", function (req, res) {
    res.render("../views/blookly");
  })
module.exports = router;

