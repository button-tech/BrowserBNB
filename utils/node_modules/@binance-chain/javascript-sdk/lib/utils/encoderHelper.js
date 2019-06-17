"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isAbstractCodec = exports.size = exports.default = void 0;

var _is_js = _interopRequireDefault(require("is_js"));

// typeToTyp3
//amino type convert
var _default = function _default(type) {
  if (_is_js.default.boolean(type)) {
    return 0;
  }

  if (_is_js.default.number(type)) {
    if (_is_js.default.integer(type)) {
      return 0;
    } else {
      return 1;
    }
  }

  if (_is_js.default.string(type) || _is_js.default.array(type) || _is_js.default.object(type)) {
    return 2;
  }
};

exports.default = _default;

var size = function size(items, iter, acc) {
  if (acc === undefined) acc = 0;

  for (var i = 0; i < items.length; ++i) {
    acc += iter(items[i], i, acc);
  }

  return acc;
};

exports.size = size;

var isAbstractCodec = function isAbstractCodec(codec) {
  return codec && typeof codec.encode === "function" && typeof codec.decode === "function" && typeof codec.encodingLength === "function";
};

exports.isAbstractCodec = isAbstractCodec;