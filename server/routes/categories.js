var express = require('express');
var router = express.Router();
var db = require('../database');
var { verifyToken } = require('../middlewares/auth');

router.get('/', verifyToken, function (req, res, next) {
	var sql = "SELECT * FROM categories"
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
	var errors = [];
	if (!req.body.category_name) {
		errors.push("No category name specified");
	}
	if (errors.length) {
		res.status(400).json({ "error": errors.join(", ") });
		return;
	}
	var data = {
		category_name: req.body.category_name
	};

	var insert = 'INSERT INTO categories (category_name) VALUES (?)';
	db.run(insert, [data.category_name], (err) => {
		if (err) {
			res.status(500).json({ "error": err.message });
			return;
		}
		var sql = "SELECT * FROM categories";
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

router.delete('/:category_name', verifyToken, (req, res, next) => {
	var errors = []
	if (!req.params.category_name) {
		errors.push("No category name specified");
	}
	if (errors.length) {
		res.status(400).json({ "error": errors.join(", ") });
		return;
	}

	var sql = `DELETE FROM categories WHERE category_name = ?`;

	db.run(sql, [req.params.category_name], (err) => {
		if (err) {
			res.status(500).json({ "error": err.message });
			return;
		}
		var sql = "SELECT * FROM categories";
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