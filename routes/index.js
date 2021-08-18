const express = require('express');
const router = express.Router();

router
.get('/', function(req, res) { 
    // res.render("../views/blookly") 
    console.log('good')
})


module.exports = router;
