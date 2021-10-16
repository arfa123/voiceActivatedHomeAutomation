var sqlite3 = require('sqlite3').verbose()
var md5 = require('md5')

const DBSOURCE = "db.sqlite";

const db = new sqlite3.Database(DBSOURCE, (err) => {
	if (err) {
		// Cannot open database
		console.error(err.message)
		throw err
	} else {
		console.log('Connected to the SQlite database.')
		db.run(`CREATE TABLE IF NOT EXISTS users (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			role text,
			email text UNIQUE,
			name text,
			password text)`,
			(err) => {
				if (err) {
					// Table already created
				} else {
					// Table just created, creating some rows
					const obj = {
						name: "admin",
						email: "admin@abc.com",
						role: "admin",
						password: md5("admin123")
					};
					var insert = `INSERT OR REPLACE INTO users (role, email, name, password) VALUES (?,?,?,?)`;
					db.run(insert, [obj.role, obj.email, obj.name, obj.password], (err) => {if (err) {console.log(err)}});
				}
			}
		);

		db.run(`CREATE TABLE IF NOT EXISTS categories (
			category_name text PRIMARY KEY UNIQUE)`,
			(err) => {
				if (err) {
					console.log(err);
					// Table already created
				}
			}
		);

		db.run(`CREATE TABLE IF NOT EXISTS rooms (
			room_name text PRIMARY KEY UNIQUE)`,
			(err) => {
				if (err) {
					console.log(err);
					// Table already created
				}
			}
		);

		db.get("PRAGMA foreign_keys = ON", (err) => {
			if (err) {
				console.log(err);
			}
		});

		db.run(`CREATE TABLE IF NOT EXISTS appliances (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			status BOOLEAN NOT NULL CHECK (status IN (0, 1)),
			pin_number INTEGER UNIQUE,
			room text,
			category text,
			number INTEGER,
			UNIQUE(room, category, number)
			FOREIGN KEY (category) REFERENCES categories (category_name)
					ON UPDATE RESTRICT
       				ON DELETE RESTRICT,
			FOREIGN KEY (room) REFERENCES rooms (room_name)
					ON UPDATE RESTRICT
       				ON DELETE RESTRICT)`,
			(err) => {
				if (err) {
					console.log(err);
					// Table already created
				}
			}
		);
	}
})

module.exports = db;