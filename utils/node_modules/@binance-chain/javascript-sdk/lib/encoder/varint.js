"use strict";

var BN = require("bn.js");

var VarInt = function VarInt(signed) {
  /**
   * https://github.com/golang/go/blob/master/src/encoding/binary/varint.go#L60
   * @param {*} bytes 
   */
  function decode(bytes) {
    var x = 0;
    var s = 0;

    for (var i = 0, len = bytes.length; i < len; i++) {
      var b = bytes[i];

      if (b < 0x80) {
        if (i > 9 || i === 9 && b > 1) {
          return 0;
        }

        return x | b << s;
      }

      x |= (b & 0x7f) << s;
      s += 7;
    }

    return 0;
  }

  function encode(n) {
    var buffer = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : Buffer.alloc(encodingLength(n));
    var offset = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;

    if (n < 0) {
      throw Error("varint value is out of bounds");
    } // n = safeParseInt(n)


    n = n.toString();
    var bn = new BN(n, 10); // amino signed varint is multiplied by 2

    if (signed) {
      bn = bn.muln(2);
    }

    var i = 0;

    while (bn.gten(0x80)) {
      buffer[offset + i] = bn.andln(0xff) | 0x80;
      bn = bn.shrn(7);
      i++;
    }

    buffer[offset + i] = bn.andln(0xff);
    encode.bytes = i + 1;
    return buffer;
  }

  function encodingLength(n) {
    if (signed) n *= 2;

    if (n < 0) {
      throw Error("varint value is out of bounds");
    }

    var bits = Math.log2(n + 1);
    return Math.ceil(bits / 7) || 1;
  }

  return {
    encode: encode,
    decode: decode,
    encodingLength: encodingLength
  };
};

module.exports = VarInt(true);
module.exports.UVarInt = VarInt(false);
module.exports.VarInt = module.exports;