var express = require('express');
var router = express.Router();
var db = require('../database');
var { verifyToken } = require('../middlewares/auth');

router.get('/', verifyToken, function (req, res, next) {
	var sql = "SELECT * FROM rooms"
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
	if (!req.body.room_name) {
		errors.push("No room name specified");
	}
	if (errors.length) {
		res.status(400).json({ "error": errors.join(", ") });
		return;
	}
	var data = {
		room_name: req.body.room_name
	};

	var insert = 'INSERT INTO rooms (room_name) VALUES (?)';
	db.run(insert, [data.room_name], (err) => {
		if (err) {
			res.status(500).json({ "error": err.message });
			return;
		}
		var sql = "SELECT * FROM rooms";
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

router.delete('/:room_name', verifyToken, (req, res, next) => {
	var errors = []
	if (!req.params.room_name) {
		errors.push("No room name specified");
	}
	if (errors.length) {
		res.status(400).json({ "error": errors.join(", ") });
		return;
	}

	var sql = `DELETE FROM rooms WHERE room_name = ?`;

	db.run(sql, [req.params.room_name], (err) => {
		if (err) {
			res.status(500).json({ "error": err.message });
			return;
		}
		var sql = "SELECT * FROM rooms";
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