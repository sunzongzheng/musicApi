"use strict";

var _express = _interopRequireDefault(require("express"));

var _app = _interopRequireDefault(require("./app"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

const app = (0, _express.default)();
app.get('/',
/*#__PURE__*/
function () {
  var _ref = _asyncToGenerator(function* (req, res) {
    const method = req.query.method;
    const vendor = req.query.vendor;

    if (!method) {
      res.status(400).send({
        error: '参数错误'
      });
      return;
    }

    const data = yield vendor ? _app.default[vendor][method](req.query.params) : _app.default[method](req.query.params);

    if (data.status) {
      res.send(data.data);
    } else {
      res.status(400).send({
        error: data.msg,
        log: data.log
      });
    }
  });

  return function (_x, _x2) {
    return _ref.apply(this, arguments);
  };
}());
app.listen(process.env.PORT || 3000);