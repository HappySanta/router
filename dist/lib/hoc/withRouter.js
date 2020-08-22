"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.withSantaRouter = withSantaRouter;
exports.withRouter = withRouter;
exports.withParams = withParams;

var _react = _interopRequireDefault(require("react"));

var _ = require("../..");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

/**
 * @deprecated use withRouter
 * @ignore
 */
function withSantaRouter(Component) {
  return withRouter(Component);
}
/**
 * HOC для добавления свойств
 *
 * location:{@link Location}
 * router:{@link Router}
 *
 * в переданный компонент
 *
 * ```typescript
 * export default withRouter(App);
 * ```
 * @param Component
 * @param withUpdate true - обновлять изменении при изменении location false - не обновлять
 */


function withRouter(Component) {
  var withUpdate = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

  function WithRouter(props) {
    var router = (0, _.useRouter)(withUpdate);
    return /*#__PURE__*/_react["default"].createElement(Component, _extends({}, props, {
      router: router,
      location: router.getCurrentLocation(),
      routeState: router.getCurrentStateOrDef(),
      route: router.getCurrentRouteOrDef()
    }));
  }

  return WithRouter;
}
/**
 * HOC для добавления
 * params:{@link PageParams}
 * в компонент
 *
 * параметры не обновляются при переходах по страницам
 *
 * @param Component
 */


function withParams(Component) {
  function WithParams(props) {
    var params = (0, _.useParams)();
    return /*#__PURE__*/_react["default"].createElement(Component, _extends({}, props, {
      params: params
    }));
  }

  return WithParams;
}