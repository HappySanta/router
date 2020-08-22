"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useFirstPageCheck = useFirstPageCheck;

var _useRouter = require("./useRouter");

function useFirstPageCheck() {
  var withUpdate = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
  var location = (0, _useRouter.useLocation)(withUpdate);
  return location.isFirstPage();
}