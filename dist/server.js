"use strict";

var _expressApp = _interopRequireDefault(require("./express-app"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_expressApp.default.listen(process.env.PORT || 3000);