var express = require('express');
const path = require('path');
var router = express.Router();

router.get('/', function(req, res, next) {
	res.sendFile(path.join(__dirname, '../adminPanel/build/index.html'));
});

router.get('/:params', function(req, res, next) {
	res.redirect('/admin');
});

module.exports = router;
