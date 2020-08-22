"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useHomePageCheck = useHomePageCheck;

var _useFirstPageCheck = require("./useFirstPageCheck");

/**
 * @deprecated use useFirstPageCheck
 * @ignore
 */
function useHomePageCheck() {
  return (0, _useFirstPageCheck.useFirstPageCheck)();
}