const MQTTBroker = require('aedes')();

MQTTBroker.on('subscribe', function (subscriptions, client) {
	console.log('MQTT client \x1b[32m' + (client ? client.id : client) +
		'\x1b[0m subscribed to topics: ' + subscriptions.map(s => s.topic).join('\n'), 'from broker', MQTTBroker.id)
});
MQTTBroker.on('unsubscribe', function (subscriptions, client) {
	console.log('MQTT client \x1b[32m' + (client ? client.id : client) +
		'\x1b[0m unsubscribed to topics: ' + subscriptions.join('\n'), 'from broker', MQTTBroker.id)
});
MQTTBroker.on('client', function (client) {
	console.log('Client Connected: \x1b[33m' + (client ? client.id : client) + '\x1b[0m', 'to broker', MQTTBroker.id)
});
MQTTBroker.on('clientDisconnect', function (client) {
	console.log('Client Disconnected: \x1b[31m' + (client ? client.id : client) + '\x1b[0m', 'to broker', MQTTBroker.id)
});
MQTTBroker.on('publish', async function (packet, client) {
	console.log('Client \x1b[31m' + (client ? client.id : 'BROKER_' + MQTTBroker.id) + '\x1b[0m has published', packet.payload.toString(), 'on', packet.topic, 'to broker', MQTTBroker.id)
});

module.exports = MQTTBroker;