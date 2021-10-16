var express = require('express');
var md5 = require("md5");
var router = express.Router();
var db = require('../database');
var { verifyToken } = require('../middlewares/auth');

router.get('/', verifyToken, function(req, res, next) {
	var sql = "SELECT * FROM users"
	var params = []
	db.all(sql, params, (err, rows) => {
		if (err) {
			res.status(400).json({ "error": err.message });
			return;
		}
		res.json({
			"message": "success",
			"data": rows
		})
	});
});

router.post('/', verifyToken, function (req, res, next) {
	var errors = []
	var roles = ["admin", "user"];
	if (!req.body.password) {
		errors.push("No password specified");
	}
	if (!req.body.email) {
		errors.push("No email specified");
	}
	if (!req.body.name) {
		errors.push("No name specified");
	}
	if (!req.body.role) {
		errors.push("No role specified");
	}
	if (!roles.includes(req.body.role)) {
		errors.push("Invalid role specified");
	}
	if (errors.length) {
		res.status(400).json({ "error": errors.join(", ") });
		return;
	}
	var data = {
		email: req.body.email,
		password: md5(req.body.password),
		role: req.body.role,
		name: req.body.name
	}

	var insert = 'INSERT INTO users (role, email, password, name) VALUES (?,?,?,?)';
	db.run(insert, [data.role, data.email, data.password, data.name], (err) => {
		if (err) {
			res.status(500).json({ "error": err.message });
			return;
		}
		var sql = "SELECT * FROM users";
		db.all(sql, [], (err, rows) => {
			if (err) {
				res.status(400).json({ "error": err.message });
				return;
			}
			res.json({
				"message": "success",
				"data": rows
			});
		});
	});
});

module.exports = router;
