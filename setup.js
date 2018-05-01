'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var _require = require('jsdom'),
    JSDOM = _require.JSDOM;

var jsdom = new JSDOM('<!doctype html><html><body></body></html>');
var window = jsdom.window;


function copyProps(src, target) {
  var props = Object.getOwnPropertyNames(src).filter(function (prop) {
    return typeof target[prop] === 'undefined';
  }).reduce(function (result, prop) {
    return _extends({}, result, _defineProperty({}, prop, Object.getOwnPropertyDescriptor(src, prop)));
  }, {});
  Object.defineProperties(target, props);

  console.log('sdf');
}

global.window = window;
global.document = window.document;
global.navigator = {
  userAgent: 'node.js'
};
copyProps(window, global);
