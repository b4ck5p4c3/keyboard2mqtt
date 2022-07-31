#!/usr/bin/env node

const { KeyboardCharacters } = require('../../');

const HONEYWELL = 3118;
const VOYAGER_1450G = 3233;

const scanner = new KeyboardCharacters({
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
