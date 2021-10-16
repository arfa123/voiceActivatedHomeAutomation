var express = require('express');
var router = express.Router();
var db = require('../database');
var { wordsToNumbers } = require('words-to-numbers');
var { verifyToken } = require('../middlewares/auth');
var MQTTClient = require('../config/mqttConnection');

router.post('/', verifyToken, function (req, res, next) {
	var errors = []
	if (!req.body.command) {
		errors.push("No voice command specified");
	}
	if (errors.length) {
		res.status(400).json({ "error": errors.join(", ") });
		return;
	}
	let command = req.body.command.toLowerCase();
	command = ` ${command} `; // add space at begining and end of string

	if (command.indexOf(" on ") === -1 && command.indexOf(" off ") === -1) {
		res.status(400).json({ "error": "Invalid command" });
		return;
	}

	if (command.indexOf(" on ") === -1 || command.indexOf(" off ") === -1) {

		var sqlForRooms = "SELECT * FROM rooms";
		let rooms = [];

		db.all(sqlForRooms, [], (err, roomsList) => {
			if (err) {
				res.status(400).json({ "error": err.message });
				return;
			}
			rooms = roomsList;
			let applianceRoomName;

			const roomFinded = rooms.some((room) => {
				if (command.includes(` ${room.room_name} `)) {
					applianceRoomName = room.room_name;
					return true;
				}
				return false;
			});

			if (!roomFinded) {
				res.status(400).json({ "error": "Specified room does not exist" });
				return;
			}

			command = wordsToNumbers(command);

			var sqlForCategories = "SELECT * FROM categories";
			let categories = [];

			db.all(sqlForCategories, [], (err, rows) => {
				if (err) {
					res.status(400).json({ "error": err.message });
					return;
				}
				categories = rows;
				let applianceCategory;

				const categoryFinded = categories.some((category) => {
					if (command.includes(` ${category.category_name} `)) {
						applianceCategory = category.category_name;
						return true;
					}
					return false;
				});

				if (!categoryFinded) {
					res.status(400).json({ "error": "Specified appliance does not exist" });
					return;
				}

				var digitRegex = /\d+/;

				if (!digitRegex.test(command)) {
					res.status(400).json({ "error": "Not provided the appliance number" });
					return;
				}

				var applianceNumber = command.match(digitRegex)[0];
				var statusToSet = command.includes(" on ") ? 1 : 0;

				var sqlForAppliance = `SELECT * FROM appliances WHERE category = ? AND number = ? AND room = ? LIMIT 1`;
				
				db.all(sqlForAppliance, [applianceCategory, applianceNumber, applianceRoomName], (err, appliances) => {
					if (err) {
						res.status(500).json({ "error": err.message });
						return;
					}

					if (appliances && Array.isArray(appliances) && appliances.length > 0 && appliances[0] && appliances[0].id) {

						const message = {
							pin_number: appliances[0].pin_number,
							status: statusToSet,
							room_name: applianceRoomName
						};

						MQTTClient.publish(`home/${applianceRoomName}`, JSON.stringify(message), console.log);
	
						res.json({
							"message": "success"
						});
					} else {
						res.status(400).json({ "error": "Specified appliance number does not exist" });
						return;
					}
				});

			});
		});

	} else {
		res.status(400).json({ "error": "Invalid command" });
		return;
	}
});

module.exports = router;