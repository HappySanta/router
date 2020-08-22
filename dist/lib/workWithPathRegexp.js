"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.generatePath = generatePath;
exports.matchPath = matchPath;

var ptr = _interopRequireWildcard(require("path-to-regexp"));

var qs = _interopRequireWildcard(require("querystring"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _toArray(arr) { return _arrayWithHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableRest(); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var cache = new Map();
var cacheLimit = 10000;
var cacheCount = 0;

function parsePath(pageId) {
  var cached = cache.get(pageId);
  if (cached) return cached;
  var tokens = ptr.parse(pageId);
  var generator = ptr.tokensToFunction(tokens);

  if (cacheCount < cacheLimit) {
    cache.set(pageId, [generator, tokens]);
    cacheCount++;
  }

  return [generator, tokens];
}

var convertCache = new Map();

function convertPath(path, options) {
  var cacheKey = "".concat((options === null || options === void 0 ? void 0 : options.end) ? "1" : "0").concat(options === null || options === void 0 ? void 0 : options.strict).concat(options === null || options === void 0 ? void 0 : options.sensitive).concat(path);
  var pathCache = convertCache.get(cacheKey);
  if (pathCache) return pathCache;
  var keys = [];
  var regexp = (0, ptr.pathToRegexp)(path, keys);
  var result = {
    regexp: regexp,
    keys: keys
  };

  if (cacheCount < cacheLimit) {
    convertCache.set(cacheKey, result);
    cacheCount++;
  }

  return result;
}
/**
 * Создание пути из шаблона
 * @param pageId /user/:id
 * @param params {id:5,name:Ivan}
 * @return {string} /user/5?name=Ivan
 * @ignore
 */


function generatePath(pageId, params) {
  if (!params) {
    params = {};
  }

  params = _objectSpread({}, params);

  var _parsePath = parsePath(pageId),
      _parsePath2 = _slicedToArray(_parsePath, 2),
      generatePath = _parsePath2[0],
      tokens = _parsePath2[1];

  var path = generatePath(params);

  var restParams = _objectSpread({}, params);

  tokens.forEach(function (t) {
    if (_typeof(t) === "object") {
      delete restParams[t.name.toString()];
    }
  });
  var result = path + "?" + qs.stringify(restParams);
  return result.replace(/\?$/gm, "");
}
/**
 * @ignore
 */


/**
 * Проверка что строка удовлетворяет шаблону
 * @param location /user/5
 * @param pageId /user/:id([0-9]+)
 * @ignore
 */
function matchPath(location, pageId) {
  var _convertPath = convertPath(pageId, {
    end: false,
    strict: false,
    sensitive: false
  }),
      regexp = _convertPath.regexp,
      keys = _convertPath.keys;

  var match = regexp.exec(location);
  if (!match) return null;

  var _match = _toArray(match),
      url = _match[0],
      values = _match.slice(1);

  var isExact = location === url;
  return {
    path: pageId,
    // the path used to match
    url: pageId === "/" && url === "" ? "/" : url,
    // the matched portion of the URL
    isExact: isExact,
    // whether or not we matched exactly
    params: keys.reduce(function (memo, key, index) {
      if (_typeof(key) === "object") {
        memo[key.name] = values[index];
      }

      return memo;
    }, {})
  };
}