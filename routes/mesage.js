var express = require('express');
var router = express.Router();
const modelsMesage = require('../models/mesage')
/* GET home page. */
router.get('/allMesage', async function(req, res, next) {
    const data = await modelsMesage.find();
    res.json(data)
})
module.exports = router;
