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
module.exports = router;
