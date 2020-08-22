"use strict";

var _Page = require("./Page");

var _Route = require("./Route");

test('from location', function () {
  var list = {
    "/": new _Page.Page()
  };
  var location = "";
  expect(!!_Route.Route.fromLocation(list, location)).toBe(true);
  expect(!!_Route.Route.fromLocation(list, location, true)).toBe(true);
});