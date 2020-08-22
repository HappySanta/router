"use strict";

var _react = _interopRequireDefault(require("react"));

var _ = require("..");

var _react2 = require("@testing-library/react");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

afterEach(_react2.cleanup);

function Main() {
  var router = (0, _.useLocation)();
  var first = (0, _.useFirstPageCheck)(true);
  return /*#__PURE__*/_react["default"].createElement("span", null, "Hello world: " + router.getPanelId() + " " + (first ? "first_page" : ""));
}

test('use router with hook', function () {
  var list = {
    "/": new _.Page('panel_main'),
    "/user": new _.Page('panel_user')
  };
  var router = new _.Router(list);
  router.start();
  var component = (0, _react2.render)( /*#__PURE__*/_react["default"].createElement(_.RouterContext.Provider, {
    value: router
  }, /*#__PURE__*/_react["default"].createElement(Main, null)));
  expect(component.queryByText(/panel_main/i)).toBeTruthy();
  expect(component.queryByText(/first_page/i)).toBeTruthy();
  (0, _react2.act)(function () {
    router.pushPage("/user");
  });
  expect(component.queryByText(/panel_user/i)).toBeTruthy();
  expect(component.queryByText(/first_page/i)).toBeFalsy();
});