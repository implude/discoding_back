const express = require('express');
const router = express.Router();
const mysql = require('mysql');
const db = require('../config/database.js');

// module.exports = (data) => {
//     let data = []
//     db.connection.query('SELECT * FROM user where uid=?', get_info[0], (err, results) => {
//         if (err) throw err;
//         console.log(results)
//     })
// }
module.exports = router;
