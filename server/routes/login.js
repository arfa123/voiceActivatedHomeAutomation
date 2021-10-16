var express = require('express');
var md5 = require("md5");
var jwt = require("jsonwebtoken");
var router = express.Router();
var db = require('../database');

/* GET users listing. */
router.post('/', function(req, res, next) {
	console.log("$$$ login api: ", req.body);
	var errors = []
	if (!req.body.password) {
		errors.push("No password specified");
	}
	if (!req.body.email) {
		errors.push("No email specified");
	}
	if (errors.length) {
		res.status(400).json({ "error": errors.join(", ") });
		return;
	}
	var data = {
		email: req.body.email,
		password: md5(req.body.password)
	}
	var sql = 'SELECT * FROM users where email = ?';
	var params = [data.email];
	db.get(sql, params, function (err, row) {
		if (err) {
			res.status(400).json({ "error": err.message })
			return;
		}
		if (row && row.email && row.password) {
			if (row.password === data.password) {
				const user = Object.assign({}, row);
				delete user.password;
	
				const token = jwt.sign(
					{ user_id: user.id, email: user.email },
					process.env.JWT_SECRET_KEY,
					{
						expiresIn: "2h",
					}
				);
				// save user token
				user.token = token;
				res.json({
					"message": "success",
					"data": user
				});
			} else {
				res.status(401).json({ "error": "Invalid password" });
				return;
			}
		} else {
			res.status(400).json({ "error": "User not found" });
			return;
		}
	});
});

module.exports = router;