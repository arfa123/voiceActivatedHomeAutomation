#include <ESP8266WiFi.h>
#include <PubSubClient.h>
#include <ArduinoJson.h>

const char* ssid = "Jazz-LTE-B6A9";
const char* password = "abcd1234";
const char* mqtt_server = "192.168.1.100";
int mqtt_server_port = 1883;

int pins_status[9] = {0};
int pin_names[9] = {D0, D1, D2, D3, D4, D5, D6, D7, D8};

WiFiClient espClient;
PubSubClient client(espClient);

void setup_wifi(){
	delay(10);
	// We start by connecting to a WiFi network
	Serial.println();
	Serial.print("Connecting to ");
	Serial.println(ssid);

	WiFi.begin(ssid, password);

	while (WiFi.status() != WL_CONNECTED) {
		delay(500);
		Serial.print(".");
	}
	Serial.println("");
	Serial.println("WiFi connected");
	Serial.println("IP address: ");
	Serial.println(WiFi.localIP());
}

void callback(char* topic, byte* payload, unsigned int length) {
	Serial.print("Message arrived [");
	Serial.print(topic);
	Serial.print("] ");
	for (int i = 0; i < length; i++) {
		Serial.print((char)payload[i]);
	}
	Serial.println();

	StaticJsonDocument<1024> doc;
	// Deserialize the JSON document
	DeserializationError error = deserializeJson(doc, payload, length);

	// Test if parsing succeeds.
	if (error) {
		Serial.print(F("deserializeJson() failed: "));
		Serial.println(error.f_str());
		return;
	}

	// Fetch values.
	int pin_number = doc["pin_number"];
	int pin_status = doc["status"];

	digitalWrite(pin_names[pin_number], pin_status);
	pins_status[pin_number] = pin_status;

	char buffer[256];
	size_t n = serializeJson(doc, buffer);
	client.publish("home/appliances", buffer, n);
}

void reconnect() {
	// Loop until we're reconnected
	while (!client.connected()) {
		Serial.print("Attempting MQTT connection...");
		// Create a random client ID
		String clientId = "ESP8266Client-";
		clientId += String(random(0xffff), HEX);
		// Attempt to connect
		if (client.connect(clientId.c_str())) {
			Serial.println("connected");
			// Once connected, publish an announcement...
			client.publish("presence", "message from ESP8266");
			client.subscribe("home/bedroom");
		} else {
			Serial.print("failed, rc=");
			Serial.print(client.state());
			Serial.println(" try again in 5 seconds");
			// Wait 5 seconds before retrying
			delay(5000);
		}
	}
}

void setup() {
	for (int i = 0; i < 9; i++) {
		Serial.println(pin_names[i]);
		pinMode(pin_names[i], OUTPUT);
		digitalWrite(pin_names[i], LOW);
	}
	Serial.begin(115200);
	setup_wifi();
	client.setServer(mqtt_server, mqtt_server_port);
	client.setCallback(callback);
}

void loop() {
	if (!client.connected()) {
		reconnect();
	}
	client.loop();
}
