"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.validateOffsetLimit = exports.validateTradingPair = exports.validateSymbol = exports.checkCoins = exports.checkNumber = void 0;
var MAX_INT64 = Math.pow(2, 63);
/**
 * validate the input number.
 * @param {Number} value
 */

var checkNumber = function checkNumber(value) {
  var name = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "input number";

  if (value <= 0) {
    throw new Error("".concat(name, " should be a positive number"));
  }

  if (MAX_INT64 <= value) {
    throw new Error("".concat(name, " should be less than 2^63"));
  }
};
/**
 * basic validation of coins
 * @param {Array} coins 
 */


exports.checkNumber = checkNumber;

var checkCoins = function checkCoins(coins) {
  coins = coins || [];
  coins.forEach(function (coin) {
    checkNumber(coin.amount);

    if (!coin.denom) {
      throw new Error("invalid denmon");
    }
  });
};

exports.checkCoins = checkCoins;

var validateSymbol = function validateSymbol(symbol) {
  if (!symbol) {
    throw new Error("suffixed token symbol cannot be empty");
  }

  var splitSymbols = symbol.split("-"); //check length with .B suffix

  if (!/^[a-zA-z\d/.]{3,10}$/.test(splitSymbols[0])) {
    throw new Error("symbol length is limited to 3~10");
  }
};

exports.validateSymbol = validateSymbol;

var validateTradingPair = function validateTradingPair(pair) {
  var symbols = pair.split("_");

  if (symbols.length !== 2) {
    throw new Error("the pair should in format \"symbol1_symbol2\"");
  }

  validateSymbol(symbols[0]);
  validateSymbol(symbols[1]);
};

exports.validateTradingPair = validateTradingPair;

var validateOffsetLimit = function validateOffsetLimit(offset, limit) {
  if (offset < 0) {
    throw new Error("offset can't be less than 0");
  }

  if (limit < 0) {
    throw new Error("limit can't be less than 0");
  }
};

exports.validateOffsetLimit = validateOffsetLimit;