"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useRouter = useRouter;
exports.useParams = useParams;
exports.useLocation = useLocation;

var _react = require("react");

var _ = require("../..");

var useForceUpdate = function useForceUpdate() {
  return (0, _react.useState)(0)[1];
};

function useRouter() {
  var withUpdate = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
  var router = (0, _react.useContext)(_.RouterContext);
  if (!router) throw new Error("Use useRoute without context");
  var forceUpdate = useForceUpdate();
  (0, _react.useEffect)(function () {
    var fn = function fn() {
      if (withUpdate) {
        forceUpdate(Date.now());
      }
    };

    router.on("update", fn);
    return function () {
      router.off("update", fn);
    };
  }, []);
  return router;
}

function useParams() {
  var router = useRouter(false);
  var params = (0, _react.useRef)(router.getCurrentLocation().getParams());
  return params.current;
}

function useLocation() {
  var withUpdate = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
  var router = useRouter(withUpdate);
  var cachedLocation = (0, _react.useRef)(router.getCurrentLocation());

  if (withUpdate) {
    return router.getCurrentLocation();
  }

  return cachedLocation.current;
}