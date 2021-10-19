var express = require('express');
var router = express.Router();
var db = require('../database');
var { verifyToken } = require('../middlewares/auth');

router.get('/', verifyToken, (req, res, next) => {
	var sql = "SELECT * FROM appliances";
	var params = []

	if (req.query && req.query.room_name) {
		sql = `${sql} WHERE room = ?`;
		params.push(req.query.room_name);
	}

	db.all(sql, params, (err, rows) => {
		if (err) {
			res.status(500).json({ "error": err.message });
			return;
		}
		res.json({
			"message": "success",
			"data": rows
		})
	});
});

router.post('/', verifyToken, (req, res, next) => {
	var errors = [];
	if (req.body.pin_number === undefined) {
		errors.push("No appliance pin number specified");
	}
	if (!req.body.room) {
		errors.push("No room name specified");
	}
	if (!req.body.category) {
		errors.push("No appliance category specified");
	}
	if (req.body.number === undefined) {
		errors.push("No appliance number specified");
	}
	if (errors.length) {
		res.status(400).json({ "error": errors.join(", ") });
		return;
	}
	var data = {
		room: req.body.room,
		category: req.body.category,
		number: req.body.number,
		pin_number: req.body.pin_number,
		status: req.body.status | 0,
	};

	var insert = 'INSERT INTO appliances (status, pin_number, room, category, number) VALUES (?,?,?,?,?)';
	db.run(insert, [data.status, data.pin_number, data.room, data.category, data.number], (err) => {
		try {
			if (err) {
				res.status(400).json({ "error": err.message });
				return;
			}
			var sql = "SELECT * FROM appliances";
			db.all(sql, [], (err, rows) => {
				if (err) {
					console.log("$$$ appliances error: ", err);
					res.status(400).json({ "error": err.message });
					return;
				}
				res.json({
					"message": "success",
					"data": rows
				});
			});
		} catch (err) {
			res.status(400).json({ "error": err });
			return;
		}
	});
});

router.patch('/:id', verifyToken, (req, res, next) => {
	var errors = []
	if (!req.params.id) {
		errors.push("No appliance id specified");
	}
	if (errors.length) {
		res.status(400).json({ "error": errors.join(", ") });
		return;
	}
	var data = {};

	if (req.body.status) data.status = req.body.status;
	if (req.body.room) data.room = req.body.room;
	if (req.body.pin_number) data.pin_number = req.body.pin_number;
	if (req.body.category) data.category = req.body.category;
	if (req.body.number) data.number = req.body.number;

	let columns = Object.keys(data).join(" = ?, ");
	if (!columns) {
		errors.push("Please send valid data to update");
		res.status(400).json({ "error": errors.join(", ") });
		return;
	}
	
	columns = columns + " = ?";

	const values = Object.values(data);
	values.push(req.params.id);

	var sql = `UPDATE appliances SET ${columns} WHERE id = ?`;

	db.run(sql, values, (err) => {
		if (err) {
			res.status(500).json({ "error": err.message });
			return;
		}
		var sql = "SELECT * FROM appliances";
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

router.delete('/:id', verifyToken, (req, res, next) => {
	var errors = []
	if (!req.params.id) {
		errors.push("No appliance id specified");
	}
	if (errors.length) {
		res.status(400).json({ "error": errors.join(", ") });
		return;
	}

	var sql = `DELETE FROM appliances WHERE id = ?`;

	db.run(sql, [req.params.id], (err) => {
		if (err) {
			res.status(500).json({ "error": err.message });
			return;
		}
		var sql = "SELECT * FROM appliances";
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
