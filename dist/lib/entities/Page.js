"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Page = void 0;

var _const = require("../const");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var Page = /*#__PURE__*/function () {
  function Page() {
    var panelId = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : _const.PANEL_MAIN;
    var viewId = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : _const.VIEW_MAIN;

    _classCallCheck(this, Page);

    _defineProperty(this, "panelId", void 0);

    _defineProperty(this, "viewId", void 0);

    _defineProperty(this, "isInfinityPanel", false);

    this.panelId = panelId;
    this.viewId = viewId;
  }

  _createClass(Page, [{
    key: "clone",
    value: function clone() {
      var p = new Page(this.panelId, this.viewId);
      p.isInfinityPanel = this.isInfinityPanel;
      return p;
    }
  }, {
    key: "makeInfinity",
    value: function makeInfinity() {
      this.isInfinityPanel = true;
      return this;
    }
  }]);

  return Page;
}();

exports.Page = Page;