'use strict';

const hid = require('node-hid');
const Stream = require('stream').Stream;
const _ = require('underscore');

const isUndefined = _.isUndefined;

class Hidstream extends Stream {
  constructor(opts) {
    super();

    const options = opts || {};

    verify(options);

    this.options = options;
    this.path = options.path;
    this.vendorId = options.vendorId;
    this.productId = options.productId;
    this.device = newHidDevice(options);

    this.device.on('data', data => this.emit('data', data));
    this.device.on('error', error => this.emit('error', error));
    this.device.on('end', end => this.emit('end', end));
  }

  close() {
    this.device.close();
    this.emit('close');
  }
}

function verify(options) {
  if (_.every([options.path,  options.vendorId, options.productId], isUndefined)) {
    throw new Error('no HID path or vendorId/productId specified');
  }

  if (isUndefined(options.path)) {
    if (isUndefined(options.productId)) {
      throw new Error('no HID productId specified');
    }

    if (isUndefined(options.vendorId)) {
      throw new Error('no HID vendorId specified');
    }
  }
}

function newHidDevice(options) {
  if (options.path) {
    return new hid.HID(options.path);
  }

  return new hid.HID(options.vendorId, options.productId);
}

module.exports = Hidstream;
