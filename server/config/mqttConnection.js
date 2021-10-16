var mqtt = require('mqtt');
var db = require('../database');

var MQTTClient = mqtt.connect('mqtt://localhost:1883', {
	clientId: 'HomeAutomationServer'
});

MQTTClient.on('connect', function () {
	console.log("successfully connected to MQTT server");
	MQTTClient.subscribe('home/appliances', function (err) {
		if (!err) {
			MQTTClient.publish('presence', 'Hello mqtt')
		}
	});
})

MQTTClient.on('reconnect', () => {
	console.log("Reconnected to MQTT server");
});

MQTTClient.on('close', () => {
	console.log("Connection close from MQTT server");
});

MQTTClient.on('disconnect', () => {
	console.log("Disconnected from MQTT server");
});

MQTTClient.on('offline', () => {
	console.log("MQTT Client goes offline");
});

MQTTClient.on('error', (error) => {
	console.log("Unable to connect to MQTT server: ", error);
});

MQTTClient.on('end', () => {
	console.log("MQTT Client end");
});

MQTTClient.on('packetsend', (packet) => {
	console.log("MQTT Client packetsend: ", packet);
});

MQTTClient.on('packetreceive', (packet) => {
	console.log("MQTT Client packetreceive: ", packet);
});

MQTTClient.on('message', function (topic, message) {
	// message is Buffer
	
	const data = JSON.parse(message.toString());
	console.log("MQTT message received: ", topic, message.toString(), data);

	if (data && data.room_name && data.pin_number !== undefined && data.status !== undefined) {
		const {
			pin_number,
			room_name,
			status
		} = data;
	
		var sql = `UPDATE appliances SET status = ? WHERE pin_number = ? AND room = ?`;
	
		db.run(sql, [status, pin_number, room_name], (err) => {
			if (err) {
				console.error(err);
				return;
			}
		});
	}

});

module.exports = MQTTClient;