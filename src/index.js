require('dotenv').config();

const fs = require('fs');
const path = require('path');
const MQTT = require('mqtt');
const debug = require('debug')('keyboard2mqtt');
const { KeyboardLines } = require('node-hid-stream');

const mqttOptions = {};
if (process.env.K2MQTT_MQTT_CA_PATH) {
  mqttOptions.ca = fs.readFileSync(path.resolve(__dirname, process.env.K2MQTT_MQTT_CA_PATH));
}

const mqtt = MQTT.connect(process.env.K2MQTT_MQTT_URI, mqttOptions);

mqtt.on('connect', () => debug('mqtt connected'));
mqtt.on('error', (err) => debug('mqtt failed: %O', err));

const scanner = new KeyboardLines({
  vendorId: parseInt(process.env.K2MQTT_VID),
  productId: parseInt(process.env.K2MQTT_PID),
});

scanner.on('data', payload => {
  mqtt.publish(process.env.K2MQTT_MQTT_TOPIC_PREFIX, payload)
  debug('scan: %s', payload);
});

const onExit = () => {
  scanner.close();
  mqtt.end();
  debug('bye');
};

process.on('exit', onExit);
// process.on('SIGINT', onExit);
