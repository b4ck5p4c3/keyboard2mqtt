#!/usr/bin/env node

const { KeyboardLines } = require('../../');
const HID = require('node-hid');

const HONEYWELL = 1504;
const VOYAGER_1450G = 4608;

// console.log(HID.devices());
// process.exit(0);

const scanner = new KeyboardLines({
  vendorId: HONEYWELL,
  productId: VOYAGER_1450G,
});

function closeScanner() {
  scanner.close();
}

// Close scanner when script is exiting is stopped.
process.on('exit', closeScanner);

// Close scanner on ctrl+c event
process.on('SIGINT', closeScanner);

scanner.pipe(process.stdout);

scanner.on('error', (error) => {
  console.log('scanner error', error); // easily consumed data format!
});

process.on('uncaughtException', (error) => {
  console.log(`Uncaught Exception:${error}`);
  console.log(`stack:${error.stack}`);
  console.log(`stack:${(new Error(error)).stack}`);
});
