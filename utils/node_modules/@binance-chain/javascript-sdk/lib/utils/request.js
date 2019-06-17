"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _axios = _interopRequireDefault(require("axios"));

/**
 * @alias utils.HttpRequest
 */
var HttpRequest =
/*#__PURE__*/
function () {
  function HttpRequest(baseURL) {
    (0, _classCallCheck2.default)(this, HttpRequest);
    this.httpClient = _axios.default.create({
      baseURL: baseURL
    });
  }

  (0, _createClass2.default)(HttpRequest, [{
    key: "get",
    value: function get(path, params, opts) {
      return this.request("get", path, params, opts);
    }
  }, {
    key: "post",
    value: function post(path, body, opts) {
      return this.request("post", path, body, opts);
    }
  }, {
    key: "request",
    value: function request(method, path, params, opts) {
      var options = (0, _objectSpread2.default)({
        method: method,
        url: path
      }, opts);

      if (params) {
        if (method === "get") {
          options.params = params;
        } else {
          options.data = params;
        }
      }

      return this.httpClient.request(options).then(function (response) {
        return {
          result: response.data,
          status: response.status
        };
      }).catch(function (err) {
        // TODO: what if it's not json?
        console.error("error in HttpRequest#request", err, err.statusCode);
        var error = err;

        try {
          var msgObj = err.response && err.response.data;
          error = new Error(msgObj.message);
          error.code = msgObj.code;
        } catch (err) {
          throw error;
        }

        throw error;
      });
    }
  }]);
  return HttpRequest;
}();

var _default = HttpRequest;
exports.default = _default;