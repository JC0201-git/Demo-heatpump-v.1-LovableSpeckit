import { R as React, T as reactExports, K as jsxRuntimeExports } from "./server-CzeLhqbS.js";
import { L as Link } from "./router-sZOWJ7Yg.js";
import { f as clsx, b as AppShell, u as useAppState, g as cn, W as WifiOff, e as STATUS_LABEL, d as STATUS_COLOR, i as fmtRelative } from "./app-shell-BIbYDl8S.js";
import { c as createLucideIcon, A as Activity } from "./activity-F8GmJbQr.js";
import { Z as Zap, T as Thermometer, G as Gauge } from "./zap-BEUtTxBE.js";
import { f as filterProps, c as Layer, s as max, r as isNumber, b as Curve, A as Animate, m as interpolateNumber, q as isNil, p as isNan, n as isEqual, l as hasClipDot, L as LabelList, u as uniqueId, o as isFunction, G as Global, k as getValueByDataKey, j as getCateCoordinateOfLine, D as Dot, i as generateCategoricalChart, X as XAxis, Y as YAxis, h as formatAxisMap, e as ResponsiveContainer, C as CartesianGrid, T as Tooltip, B as Bar } from "./generateCategoricalChart-5mld-MbB.js";
import { B as BarChart } from "./BarChart-C81iLmsw.js";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
const __iconNode$a = [["path", { d: "m6 9 6 6 6-6", key: "qrunsl" }]];
const ChevronDown = createLucideIcon("chevron-down", __iconNode$a);
const __iconNode$9 = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["circle", { cx: "12", cy: "12", r: "1", key: "41hilf" }]
];
const CircleDot = createLucideIcon("circle-dot", __iconNode$9);
const __iconNode$8 = [
  ["path", { d: "M15 6a9 9 0 0 0-9 9V3", key: "1cii5b" }],
  ["circle", { cx: "18", cy: "6", r: "3", key: "1h7g24" }],
  ["circle", { cx: "6", cy: "18", r: "3", key: "fqmcym" }]
];
const GitBranch = createLucideIcon("git-branch", __iconNode$8);
const __iconNode$7 = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["path", { d: "M12 16v-4", key: "1dtifu" }],
  ["path", { d: "M12 8h.01", key: "e9boi3" }]
];
const Info = createLucideIcon("info", __iconNode$7);
const __iconNode$6 = [
  [
    "path",
    {
      d: "M14.106 5.553a2 2 0 0 0 1.788 0l3.659-1.83A1 1 0 0 1 21 4.619v12.764a1 1 0 0 1-.553.894l-4.553 2.277a2 2 0 0 1-1.788 0l-4.212-2.106a2 2 0 0 0-1.788 0l-3.659 1.83A1 1 0 0 1 3 19.381V6.618a1 1 0 0 1 .553-.894l4.553-2.277a2 2 0 0 1 1.788 0z",
      key: "169xi5"
    }
  ],
  ["path", { d: "M15 5.764v15", key: "1pn4in" }],
  ["path", { d: "M9 3.236v15", key: "1uimfh" }]
];
const Map = createLucideIcon("map", __iconNode$6);
const __iconNode$5 = [
  ["path", { d: "M15 3h6v6", key: "1q9fwt" }],
  ["path", { d: "m21 3-7 7", key: "1l2asr" }],
  ["path", { d: "m3 21 7-7", key: "tjx5ai" }],
  ["path", { d: "M9 21H3v-6", key: "wtvkvv" }]
];
const Maximize2 = createLucideIcon("maximize-2", __iconNode$5);
const __iconNode$4 = [
  ["path", { d: "M12 16h.01", key: "1drbdi" }],
  ["path", { d: "M12 8v4", key: "1got3b" }],
  [
    "path",
    {
      d: "M15.312 2a2 2 0 0 1 1.414.586l4.688 4.688A2 2 0 0 1 22 8.688v6.624a2 2 0 0 1-.586 1.414l-4.688 4.688a2 2 0 0 1-1.414.586H8.688a2 2 0 0 1-1.414-.586l-4.688-4.688A2 2 0 0 1 2 15.312V8.688a2 2 0 0 1 .586-1.414l4.688-4.688A2 2 0 0 1 8.688 2z",
      key: "1fd625"
    }
  ]
];
const OctagonAlert = createLucideIcon("octagon-alert", __iconNode$4);
const __iconNode$3 = [
  ["path", { d: "m21 21-4.34-4.34", key: "14j7rj" }],
  ["circle", { cx: "11", cy: "11", r: "8", key: "4ej97u" }]
];
const Search = createLucideIcon("search", __iconNode$3);
const __iconNode$2 = [
  ["line", { x1: "10", x2: "14", y1: "2", y2: "2", key: "14vaq8" }],
  ["line", { x1: "12", x2: "15", y1: "14", y2: "11", key: "17fdiu" }],
  ["circle", { cx: "12", cy: "14", r: "8", key: "1e1u0o" }]
];
const Timer = createLucideIcon("timer", __iconNode$2);
const __iconNode$1 = [
  ["path", { d: "M16 7h6v6", key: "box55l" }],
  ["path", { d: "m22 7-8.5 8.5-5-5L2 17", key: "1t1m79" }]
];
const TrendingUp = createLucideIcon("trending-up", __iconNode$1);
const __iconNode = [
  [
    "path",
    {
      d: "M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.106-3.105c.32-.322.863-.22.983.218a6 6 0 0 1-8.259 7.057l-7.91 7.91a1 1 0 0 1-2.999-3l7.91-7.91a6 6 0 0 1 7.057-8.259c.438.12.54.662.219.984z",
      key: "1ngwbx"
    }
  ]
];
const Wrench = createLucideIcon("wrench", __iconNode);
var _excluded = ["layout", "type", "stroke", "connectNulls", "isRange", "ref"], _excluded2 = ["key"];
var _Area;
function _typeof(o) {
  "@babel/helpers - typeof";
  return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(o2) {
    return typeof o2;
  } : function(o2) {
    return o2 && "function" == typeof Symbol && o2.constructor === Symbol && o2 !== Symbol.prototype ? "symbol" : typeof o2;
  }, _typeof(o);
}
function _objectWithoutProperties(source, excluded) {
  if (source == null) return {};
  var target = _objectWithoutPropertiesLoose(source, excluded);
  var key, i;
  if (Object.getOwnPropertySymbols) {
    var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
    for (i = 0; i < sourceSymbolKeys.length; i++) {
      key = sourceSymbolKeys[i];
      if (excluded.indexOf(key) >= 0) continue;
      if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
      target[key] = source[key];
    }
  }
  return target;
}
function _objectWithoutPropertiesLoose(source, excluded) {
  if (source == null) return {};
  var target = {};
  for (var key in source) {
    if (Object.prototype.hasOwnProperty.call(source, key)) {
      if (excluded.indexOf(key) >= 0) continue;
      target[key] = source[key];
    }
  }
  return target;
}
function _extends() {
  _extends = Object.assign ? Object.assign.bind() : function(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];
      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }
    return target;
  };
  return _extends.apply(this, arguments);
}
function ownKeys(e, r) {
  var t = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var o = Object.getOwnPropertySymbols(e);
    r && (o = o.filter(function(r2) {
      return Object.getOwnPropertyDescriptor(e, r2).enumerable;
    })), t.push.apply(t, o);
  }
  return t;
}
function _objectSpread(e) {
  for (var r = 1; r < arguments.length; r++) {
    var t = null != arguments[r] ? arguments[r] : {};
    r % 2 ? ownKeys(Object(t), true).forEach(function(r2) {
      _defineProperty(e, r2, t[r2]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function(r2) {
      Object.defineProperty(e, r2, Object.getOwnPropertyDescriptor(t, r2));
    });
  }
  return e;
}
function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}
function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor);
  }
}
function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  Object.defineProperty(Constructor, "prototype", { writable: false });
  return Constructor;
}
function _callSuper(t, o, e) {
  return o = _getPrototypeOf(o), _possibleConstructorReturn(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], _getPrototypeOf(t).constructor) : o.apply(t, e));
}
function _possibleConstructorReturn(self, call) {
  if (call && (_typeof(call) === "object" || typeof call === "function")) {
    return call;
  } else if (call !== void 0) {
    throw new TypeError("Derived constructors may only return object or undefined");
  }
  return _assertThisInitialized(self);
}
function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }
  return self;
}
function _isNativeReflectConstruct() {
  try {
    var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {
    }));
  } catch (t2) {
  }
  return (_isNativeReflectConstruct = function _isNativeReflectConstruct2() {
    return !!t;
  })();
}
function _getPrototypeOf(o) {
  _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf2(o2) {
    return o2.__proto__ || Object.getPrototypeOf(o2);
  };
  return _getPrototypeOf(o);
}
function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function");
  }
  subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } });
  Object.defineProperty(subClass, "prototype", { writable: false });
  if (superClass) _setPrototypeOf(subClass, superClass);
}
function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf2(o2, p2) {
    o2.__proto__ = p2;
    return o2;
  };
  return _setPrototypeOf(o, p);
}
function _defineProperty(obj, key, value) {
  key = _toPropertyKey(key);
  if (key in obj) {
    Object.defineProperty(obj, key, { value, enumerable: true, configurable: true, writable: true });
  } else {
    obj[key] = value;
  }
  return obj;
}
function _toPropertyKey(t) {
  var i = _toPrimitive(t, "string");
  return "symbol" == _typeof(i) ? i : i + "";
}
function _toPrimitive(t, r) {
  if ("object" != _typeof(t) || !t) return t;
  var e = t[Symbol.toPrimitive];
  if (void 0 !== e) {
    var i = e.call(t, r);
    if ("object" != _typeof(i)) return i;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return String(t);
}
var Area = /* @__PURE__ */ (function(_PureComponent) {
  function Area2() {
    var _this;
    _classCallCheck(this, Area2);
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    _this = _callSuper(this, Area2, [].concat(args));
    _defineProperty(_this, "state", {
      isAnimationFinished: true
    });
    _defineProperty(_this, "id", uniqueId("recharts-area-"));
    _defineProperty(_this, "handleAnimationEnd", function() {
      var onAnimationEnd = _this.props.onAnimationEnd;
      _this.setState({
        isAnimationFinished: true
      });
      if (isFunction(onAnimationEnd)) {
        onAnimationEnd();
      }
    });
    _defineProperty(_this, "handleAnimationStart", function() {
      var onAnimationStart = _this.props.onAnimationStart;
      _this.setState({
        isAnimationFinished: false
      });
      if (isFunction(onAnimationStart)) {
        onAnimationStart();
      }
    });
    return _this;
  }
  _inherits(Area2, _PureComponent);
  return _createClass(Area2, [{
    key: "renderDots",
    value: function renderDots(needClip, clipDot, clipPathId) {
      var isAnimationActive = this.props.isAnimationActive;
      var isAnimationFinished = this.state.isAnimationFinished;
      if (isAnimationActive && !isAnimationFinished) {
        return null;
      }
      var _this$props = this.props, dot = _this$props.dot, points = _this$props.points, dataKey = _this$props.dataKey;
      var areaProps = filterProps(this.props, false);
      var customDotProps = filterProps(dot, true);
      var dots = points.map(function(entry, i) {
        var dotProps = _objectSpread(_objectSpread(_objectSpread({
          key: "dot-".concat(i),
          r: 3
        }, areaProps), customDotProps), {}, {
          index: i,
          cx: entry.x,
          cy: entry.y,
          dataKey,
          value: entry.value,
          payload: entry.payload,
          points
        });
        return Area2.renderDotItem(dot, dotProps);
      });
      var dotsProps = {
        clipPath: needClip ? "url(#clipPath-".concat(clipDot ? "" : "dots-").concat(clipPathId, ")") : null
      };
      return /* @__PURE__ */ React.createElement(Layer, _extends({
        className: "recharts-area-dots"
      }, dotsProps), dots);
    }
  }, {
    key: "renderHorizontalRect",
    value: function renderHorizontalRect(alpha) {
      var _this$props2 = this.props, baseLine = _this$props2.baseLine, points = _this$props2.points, strokeWidth = _this$props2.strokeWidth;
      var startX = points[0].x;
      var endX = points[points.length - 1].x;
      var width = alpha * Math.abs(startX - endX);
      var maxY = max(points.map(function(entry) {
        return entry.y || 0;
      }));
      if (isNumber(baseLine) && typeof baseLine === "number") {
        maxY = Math.max(baseLine, maxY);
      } else if (baseLine && Array.isArray(baseLine) && baseLine.length) {
        maxY = Math.max(max(baseLine.map(function(entry) {
          return entry.y || 0;
        })), maxY);
      }
      if (isNumber(maxY)) {
        return /* @__PURE__ */ React.createElement("rect", {
          x: startX < endX ? startX : startX - width,
          y: 0,
          width,
          height: Math.floor(maxY + (strokeWidth ? parseInt("".concat(strokeWidth), 10) : 1))
        });
      }
      return null;
    }
  }, {
    key: "renderVerticalRect",
    value: function renderVerticalRect(alpha) {
      var _this$props3 = this.props, baseLine = _this$props3.baseLine, points = _this$props3.points, strokeWidth = _this$props3.strokeWidth;
      var startY = points[0].y;
      var endY = points[points.length - 1].y;
      var height = alpha * Math.abs(startY - endY);
      var maxX = max(points.map(function(entry) {
        return entry.x || 0;
      }));
      if (isNumber(baseLine) && typeof baseLine === "number") {
        maxX = Math.max(baseLine, maxX);
      } else if (baseLine && Array.isArray(baseLine) && baseLine.length) {
        maxX = Math.max(max(baseLine.map(function(entry) {
          return entry.x || 0;
        })), maxX);
      }
      if (isNumber(maxX)) {
        return /* @__PURE__ */ React.createElement("rect", {
          x: 0,
          y: startY < endY ? startY : startY - height,
          width: maxX + (strokeWidth ? parseInt("".concat(strokeWidth), 10) : 1),
          height: Math.floor(height)
        });
      }
      return null;
    }
  }, {
    key: "renderClipRect",
    value: function renderClipRect(alpha) {
      var layout = this.props.layout;
      if (layout === "vertical") {
        return this.renderVerticalRect(alpha);
      }
      return this.renderHorizontalRect(alpha);
    }
  }, {
    key: "renderAreaStatically",
    value: function renderAreaStatically(points, baseLine, needClip, clipPathId) {
      var _this$props4 = this.props, layout = _this$props4.layout, type = _this$props4.type, stroke = _this$props4.stroke, connectNulls = _this$props4.connectNulls, isRange = _this$props4.isRange;
      _this$props4.ref;
      var others = _objectWithoutProperties(_this$props4, _excluded);
      return /* @__PURE__ */ React.createElement(Layer, {
        clipPath: needClip ? "url(#clipPath-".concat(clipPathId, ")") : null
      }, /* @__PURE__ */ React.createElement(Curve, _extends({}, filterProps(others, true), {
        points,
        connectNulls,
        type,
        baseLine,
        layout,
        stroke: "none",
        className: "recharts-area-area"
      })), stroke !== "none" && /* @__PURE__ */ React.createElement(Curve, _extends({}, filterProps(this.props, false), {
        className: "recharts-area-curve",
        layout,
        type,
        connectNulls,
        fill: "none",
        points
      })), stroke !== "none" && isRange && /* @__PURE__ */ React.createElement(Curve, _extends({}, filterProps(this.props, false), {
        className: "recharts-area-curve",
        layout,
        type,
        connectNulls,
        fill: "none",
        points: baseLine
      })));
    }
  }, {
    key: "renderAreaWithAnimation",
    value: function renderAreaWithAnimation(needClip, clipPathId) {
      var _this2 = this;
      var _this$props5 = this.props, points = _this$props5.points, baseLine = _this$props5.baseLine, isAnimationActive = _this$props5.isAnimationActive, animationBegin = _this$props5.animationBegin, animationDuration = _this$props5.animationDuration, animationEasing = _this$props5.animationEasing, animationId = _this$props5.animationId;
      var _this$state = this.state, prevPoints = _this$state.prevPoints, prevBaseLine = _this$state.prevBaseLine;
      return /* @__PURE__ */ React.createElement(Animate, {
        begin: animationBegin,
        duration: animationDuration,
        isActive: isAnimationActive,
        easing: animationEasing,
        from: {
          t: 0
        },
        to: {
          t: 1
        },
        key: "area-".concat(animationId),
        onAnimationEnd: this.handleAnimationEnd,
        onAnimationStart: this.handleAnimationStart
      }, function(_ref) {
        var t = _ref.t;
        if (prevPoints) {
          var prevPointsDiffFactor = prevPoints.length / points.length;
          var stepPoints = points.map(function(entry, index) {
            var prevPointIndex = Math.floor(index * prevPointsDiffFactor);
            if (prevPoints[prevPointIndex]) {
              var prev = prevPoints[prevPointIndex];
              var interpolatorX = interpolateNumber(prev.x, entry.x);
              var interpolatorY = interpolateNumber(prev.y, entry.y);
              return _objectSpread(_objectSpread({}, entry), {}, {
                x: interpolatorX(t),
                y: interpolatorY(t)
              });
            }
            return entry;
          });
          var stepBaseLine;
          if (isNumber(baseLine) && typeof baseLine === "number") {
            var interpolator = interpolateNumber(prevBaseLine, baseLine);
            stepBaseLine = interpolator(t);
          } else if (isNil(baseLine) || isNan(baseLine)) {
            var _interpolator = interpolateNumber(prevBaseLine, 0);
            stepBaseLine = _interpolator(t);
          } else {
            stepBaseLine = baseLine.map(function(entry, index) {
              var prevPointIndex = Math.floor(index * prevPointsDiffFactor);
              if (prevBaseLine[prevPointIndex]) {
                var prev = prevBaseLine[prevPointIndex];
                var interpolatorX = interpolateNumber(prev.x, entry.x);
                var interpolatorY = interpolateNumber(prev.y, entry.y);
                return _objectSpread(_objectSpread({}, entry), {}, {
                  x: interpolatorX(t),
                  y: interpolatorY(t)
                });
              }
              return entry;
            });
          }
          return _this2.renderAreaStatically(stepPoints, stepBaseLine, needClip, clipPathId);
        }
        return /* @__PURE__ */ React.createElement(Layer, null, /* @__PURE__ */ React.createElement("defs", null, /* @__PURE__ */ React.createElement("clipPath", {
          id: "animationClipPath-".concat(clipPathId)
        }, _this2.renderClipRect(t))), /* @__PURE__ */ React.createElement(Layer, {
          clipPath: "url(#animationClipPath-".concat(clipPathId, ")")
        }, _this2.renderAreaStatically(points, baseLine, needClip, clipPathId)));
      });
    }
  }, {
    key: "renderArea",
    value: function renderArea(needClip, clipPathId) {
      var _this$props6 = this.props, points = _this$props6.points, baseLine = _this$props6.baseLine, isAnimationActive = _this$props6.isAnimationActive;
      var _this$state2 = this.state, prevPoints = _this$state2.prevPoints, prevBaseLine = _this$state2.prevBaseLine, totalLength = _this$state2.totalLength;
      if (isAnimationActive && points && points.length && (!prevPoints && totalLength > 0 || !isEqual(prevPoints, points) || !isEqual(prevBaseLine, baseLine))) {
        return this.renderAreaWithAnimation(needClip, clipPathId);
      }
      return this.renderAreaStatically(points, baseLine, needClip, clipPathId);
    }
  }, {
    key: "render",
    value: function render() {
      var _filterProps;
      var _this$props7 = this.props, hide = _this$props7.hide, dot = _this$props7.dot, points = _this$props7.points, className = _this$props7.className, top = _this$props7.top, left = _this$props7.left, xAxis = _this$props7.xAxis, yAxis = _this$props7.yAxis, width = _this$props7.width, height = _this$props7.height, isAnimationActive = _this$props7.isAnimationActive, id = _this$props7.id;
      if (hide || !points || !points.length) {
        return null;
      }
      var isAnimationFinished = this.state.isAnimationFinished;
      var hasSinglePoint = points.length === 1;
      var layerClass = clsx("recharts-area", className);
      var needClipX = xAxis && xAxis.allowDataOverflow;
      var needClipY = yAxis && yAxis.allowDataOverflow;
      var needClip = needClipX || needClipY;
      var clipPathId = isNil(id) ? this.id : id;
      var _ref2 = (_filterProps = filterProps(dot, false)) !== null && _filterProps !== void 0 ? _filterProps : {
        r: 3,
        strokeWidth: 2
      }, _ref2$r = _ref2.r, r = _ref2$r === void 0 ? 3 : _ref2$r, _ref2$strokeWidth = _ref2.strokeWidth, strokeWidth = _ref2$strokeWidth === void 0 ? 2 : _ref2$strokeWidth;
      var _ref3 = hasClipDot(dot) ? dot : {}, _ref3$clipDot = _ref3.clipDot, clipDot = _ref3$clipDot === void 0 ? true : _ref3$clipDot;
      var dotSize = r * 2 + strokeWidth;
      return /* @__PURE__ */ React.createElement(Layer, {
        className: layerClass
      }, needClipX || needClipY ? /* @__PURE__ */ React.createElement("defs", null, /* @__PURE__ */ React.createElement("clipPath", {
        id: "clipPath-".concat(clipPathId)
      }, /* @__PURE__ */ React.createElement("rect", {
        x: needClipX ? left : left - width / 2,
        y: needClipY ? top : top - height / 2,
        width: needClipX ? width : width * 2,
        height: needClipY ? height : height * 2
      })), !clipDot && /* @__PURE__ */ React.createElement("clipPath", {
        id: "clipPath-dots-".concat(clipPathId)
      }, /* @__PURE__ */ React.createElement("rect", {
        x: left - dotSize / 2,
        y: top - dotSize / 2,
        width: width + dotSize,
        height: height + dotSize
      }))) : null, !hasSinglePoint ? this.renderArea(needClip, clipPathId) : null, (dot || hasSinglePoint) && this.renderDots(needClip, clipDot, clipPathId), (!isAnimationActive || isAnimationFinished) && LabelList.renderCallByParent(this.props, points));
    }
  }], [{
    key: "getDerivedStateFromProps",
    value: function getDerivedStateFromProps(nextProps, prevState) {
      if (nextProps.animationId !== prevState.prevAnimationId) {
        return {
          prevAnimationId: nextProps.animationId,
          curPoints: nextProps.points,
          curBaseLine: nextProps.baseLine,
          prevPoints: prevState.curPoints,
          prevBaseLine: prevState.curBaseLine
        };
      }
      if (nextProps.points !== prevState.curPoints || nextProps.baseLine !== prevState.curBaseLine) {
        return {
          curPoints: nextProps.points,
          curBaseLine: nextProps.baseLine
        };
      }
      return null;
    }
  }]);
})(reactExports.PureComponent);
_Area = Area;
_defineProperty(Area, "displayName", "Area");
_defineProperty(Area, "defaultProps", {
  stroke: "#3182bd",
  fill: "#3182bd",
  fillOpacity: 0.6,
  xAxisId: 0,
  yAxisId: 0,
  legendType: "line",
  connectNulls: false,
  // points of area
  points: [],
  dot: false,
  activeDot: true,
  hide: false,
  isAnimationActive: !Global.isSsr,
  animationBegin: 0,
  animationDuration: 1500,
  animationEasing: "ease"
});
_defineProperty(Area, "getBaseValue", function(props, item, xAxis, yAxis) {
  var layout = props.layout, chartBaseValue = props.baseValue;
  var itemBaseValue = item.props.baseValue;
  var baseValue = itemBaseValue !== null && itemBaseValue !== void 0 ? itemBaseValue : chartBaseValue;
  if (isNumber(baseValue) && typeof baseValue === "number") {
    return baseValue;
  }
  var numericAxis = layout === "horizontal" ? yAxis : xAxis;
  var domain = numericAxis.scale.domain();
  if (numericAxis.type === "number") {
    var domainMax = Math.max(domain[0], domain[1]);
    var domainMin = Math.min(domain[0], domain[1]);
    if (baseValue === "dataMin") {
      return domainMin;
    }
    if (baseValue === "dataMax") {
      return domainMax;
    }
    return domainMax < 0 ? domainMax : Math.max(Math.min(domain[0], domain[1]), 0);
  }
  if (baseValue === "dataMin") {
    return domain[0];
  }
  if (baseValue === "dataMax") {
    return domain[1];
  }
  return domain[0];
});
_defineProperty(Area, "getComposedData", function(_ref4) {
  var props = _ref4.props, item = _ref4.item, xAxis = _ref4.xAxis, yAxis = _ref4.yAxis, xAxisTicks = _ref4.xAxisTicks, yAxisTicks = _ref4.yAxisTicks, bandSize = _ref4.bandSize, dataKey = _ref4.dataKey, stackedData = _ref4.stackedData, dataStartIndex = _ref4.dataStartIndex, displayedData = _ref4.displayedData, offset = _ref4.offset;
  var layout = props.layout;
  var hasStack = stackedData && stackedData.length;
  var baseValue = _Area.getBaseValue(props, item, xAxis, yAxis);
  var isHorizontalLayout = layout === "horizontal";
  var isRange = false;
  var points = displayedData.map(function(entry, index) {
    var value;
    if (hasStack) {
      value = stackedData[dataStartIndex + index];
    } else {
      value = getValueByDataKey(entry, dataKey);
      if (!Array.isArray(value)) {
        value = [baseValue, value];
      } else {
        isRange = true;
      }
    }
    var isBreakPoint = value[1] == null || hasStack && getValueByDataKey(entry, dataKey) == null;
    if (isHorizontalLayout) {
      return {
        x: getCateCoordinateOfLine({
          axis: xAxis,
          ticks: xAxisTicks,
          bandSize,
          entry,
          index
        }),
        y: isBreakPoint ? null : yAxis.scale(value[1]),
        value,
        payload: entry
      };
    }
    return {
      x: isBreakPoint ? null : xAxis.scale(value[1]),
      y: getCateCoordinateOfLine({
        axis: yAxis,
        ticks: yAxisTicks,
        bandSize,
        entry,
        index
      }),
      value,
      payload: entry
    };
  });
  var baseLine;
  if (hasStack || isRange) {
    baseLine = points.map(function(entry) {
      var x = Array.isArray(entry.value) ? entry.value[0] : null;
      if (isHorizontalLayout) {
        return {
          x: entry.x,
          y: x != null && entry.y != null ? yAxis.scale(x) : null
        };
      }
      return {
        x: x != null ? xAxis.scale(x) : null,
        y: entry.y
      };
    });
  } else {
    baseLine = isHorizontalLayout ? yAxis.scale(baseValue) : xAxis.scale(baseValue);
  }
  return _objectSpread({
    points,
    baseLine,
    layout,
    isRange
  }, offset);
});
_defineProperty(Area, "renderDotItem", function(option, props) {
  var dotItem;
  if (/* @__PURE__ */ React.isValidElement(option)) {
    dotItem = /* @__PURE__ */ React.cloneElement(option, props);
  } else if (isFunction(option)) {
    dotItem = option(props);
  } else {
    var className = clsx("recharts-area-dot", typeof option !== "boolean" ? option.className : "");
    var key = props.key, rest = _objectWithoutProperties(props, _excluded2);
    dotItem = /* @__PURE__ */ React.createElement(Dot, _extends({}, rest, {
      key,
      className
    }));
  }
  return dotItem;
});
var AreaChart = generateCategoricalChart({
  chartName: "AreaChart",
  GraphicalChild: Area,
  axisComponents: [{
    axisType: "xAxis",
    AxisComp: XAxis
  }, {
    axisType: "yAxis",
    AxisComp: YAxis
  }],
  formatAxisMap
});
const FILTERS = ["all", "normal", "abnormal", "offline", "maintenance"];
const FILTER_LABEL = {
  all: "全部",
  ...STATUS_LABEL
};
const TIMELINE = Array.from({
  length: 12
}, (_, i) => {
  const h = 8 + Math.floor(i * 5 / 60);
  const m = i * 5 % 60;
  return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
});
const WORKFLOW = Array.from({
  length: 32
}, (_, i) => {
  const base = 140 + Math.sin(i / 3) * 25 + i % 5 * 4;
  return {
    t: (1 + i * 0.05).toFixed(2),
    v: Math.round(base),
    bar: Math.round(20 + i * 7 % 40)
  };
});
function Overview() {
  const {
    devices
  } = useAppState();
  const [filter, setFilter] = reactExports.useState("all");
  const [q, setQ] = reactExports.useState("");
  const [view, setView] = reactExports.useState("iso");
  const [selectedId, setSelectedId] = reactExports.useState(null);
  const stats = reactExports.useMemo(() => {
    const s = {
      normal: 0,
      abnormal: 0,
      offline: 0,
      maintenance: 0
    };
    devices.forEach((d) => s[d.status]++);
    return s;
  }, [devices]);
  const filtered = reactExports.useMemo(() => {
    const kw = q.trim().toLowerCase();
    return devices.filter((d) => {
      if (filter !== "all" && d.status !== filter) return false;
      if (kw) {
        const hit = d.code.toLowerCase().includes(kw) || d.clientName.toLowerCase().includes(kw) || d.location.toLowerCase().includes(kw);
        if (!hit) return false;
      }
      return true;
    });
  }, [devices, filter, q]);
  const tiles = filtered.slice(0, 28);
  const selected = devices.find((d) => d.id === selectedId) ?? tiles[Math.floor(tiles.length / 2)] ?? devices[0];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-4 sm:px-6 py-4 space-y-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 bg-card/60 border border-border rounded-lg p-2 sm:p-3 backdrop-blur", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 px-3 h-10 rounded-md bg-background border border-border min-w-[150px]", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CircleDot, { className: "w-4 h-4 text-primary" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-[10px] text-muted-foreground leading-tight", children: [
          "Zone",
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-foreground font-semibold leading-tight", children: "全廠區 — Z1" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "w-4 h-4 text-muted-foreground ml-auto" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-end h-10 min-w-[680px] relative", children: [
        TIMELINE.map((t, i) => {
          const active = i >= 4 && i <= 8;
          const dotColor = i % 5 === 0 ? "#ef4444" : i % 3 === 0 ? "#f97316" : "#22c55e";
          return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: cn("flex-1 h-full relative flex flex-col items-center justify-end pb-1 border-r border-border/40", active && "bg-primary/15"), children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute top-1 w-1.5 h-1.5 rounded-full", style: {
              backgroundColor: dotColor
            } }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: cn("text-[11px] tabular-nums", active ? "text-primary font-semibold" : "text-muted-foreground"), children: t })
          ] }, t);
        }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-y-0 left-[33.3%] w-[41.6%] border border-primary/60 rounded pointer-events-none" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "hidden md:inline-flex items-center justify-center w-10 h-10 rounded-md bg-primary text-primary-foreground hover:opacity-90", children: /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { className: "w-4 h-4" }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 lg:grid-cols-4 gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(StatPill, { label: "正常運轉", value: stats.normal, color: "#22c55e", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Activity, { className: "w-4 h-4" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(StatPill, { label: "異常告警", value: stats.abnormal, color: "#ef4444", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(OctagonAlert, { className: "w-4 h-4" }), pulse: true }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(StatPill, { label: "待維修", value: stats.maintenance, color: "#f97316", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Wrench, { className: "w-4 h-4" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(StatPill, { label: "離線", value: stats.offline, color: "#6b7280", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(WifiOff, { className: "w-4 h-4" }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 xl:grid-cols-4 gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "xl:col-span-3 relative rounded-xl border border-border bg-[radial-gradient(ellipse_at_center,#13302a_0%,#0a1814_70%)] overflow-hidden", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute top-3 left-3 right-3 z-20 flex flex-wrap items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex-1 min-w-[180px] max-w-xs", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "w-3.5 h-3.5 text-muted-foreground absolute left-2.5 top-2.5" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: q, onChange: (e) => setQ(e.target.value), placeholder: "搜尋設備編號／客戶／地點", className: "h-8 w-full pl-7 pr-2 text-xs rounded-md bg-background/80 border border-border focus-ring text-foreground placeholder:text-muted-foreground" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex bg-background/80 border border-border rounded-md p-0.5", children: FILTERS.map((f) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setFilter(f), className: cn("px-2.5 h-7 rounded text-xs transition-colors focus-ring", filter === f ? "bg-primary text-primary-foreground font-semibold" : "text-muted-foreground hover:text-foreground"), children: FILTER_LABEL[f] }, f)) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "ml-auto flex bg-background/80 border border-border rounded-md p-0.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setView("top"), className: cn("px-2.5 h-7 rounded text-xs", view === "top" ? "bg-primary text-primary-foreground font-semibold" : "text-muted-foreground hover:text-foreground"), children: "Top View" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setView("iso"), className: cn("px-2.5 h-7 rounded text-xs", view === "iso" ? "bg-primary text-primary-foreground font-semibold" : "text-muted-foreground hover:text-foreground"), children: "3D View" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 opacity-30", style: {
          backgroundImage: "linear-gradient(rgba(163,230,53,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(163,230,53,0.08) 1px, transparent 1px)",
          backgroundSize: "44px 44px"
        } }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative pt-16 pb-10 px-4 min-h-[520px] flex items-center justify-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: cn("grid gap-3 sm:gap-4", view === "iso" && "[transform:rotateX(54deg)_rotateZ(-45deg)] [transform-style:preserve-3d]"), style: {
            gridTemplateColumns: "repeat(7, minmax(64px,86px))"
          }, children: tiles.map((d) => /* @__PURE__ */ jsxRuntimeExports.jsx(DeviceTile, { d, selected: selected?.id === d.id, iso: view === "iso", onClick: () => setSelectedId(d.id) }, d.id)) }),
          selectedId && selected && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute z-10 w-[260px] bg-card/95 border border-border rounded-lg shadow-2xl backdrop-blur pointer-events-auto", style: {
            right: "32px",
            bottom: "36px"
          }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 px-3 h-9 border-b border-border bg-primary/10 rounded-t-lg", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-2 h-2 rounded-full", style: {
                backgroundColor: STATUS_COLOR[selected.status]
              } }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs font-semibold text-foreground truncate", children: [
                selected.code,
                " · ",
                selected.clientName
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/device/$id", params: {
                id: selected.id
              }, className: "ml-auto text-[10px] text-primary hover:underline", children: "詳情 →" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-3 py-2 grid grid-cols-2 gap-y-1.5 text-[12px]", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(TooltipRow, { label: "出水溫", value: `${selected.outletTemp.toFixed(1)} °C` }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TooltipRow, { label: "回水溫", value: `${selected.inletTemp.toFixed(1)} °C` }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TooltipRow, { label: "功率", value: `${selected.powerKW.toFixed(1)} kW` }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TooltipRow, { label: "COP", value: selected.cop.toFixed(2) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TooltipRow, { label: "今日能耗", value: `${selected.todayKWh.toFixed(0)} kWh` }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TooltipRow, { label: "壓縮機", value: selected.compressorOn ? "ON" : "OFF", color: selected.compressorOn ? "#22c55e" : "#6b7280" })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute bottom-3 left-3 right-3 flex flex-wrap items-center justify-between gap-2 text-[11px] text-muted-foreground", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-3", children: ["normal", "abnormal", "maintenance", "offline"].map((s) => /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-2 h-2 rounded-full", style: {
              backgroundColor: STATUS_COLOR[s]
            } }),
            STATUS_LABEL[s]
          ] }, s)) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
            "顯示 ",
            tiles.length,
            " / ",
            filtered.length,
            " 台"
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(SidePanel, { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Gauge, { className: "w-4 h-4 text-primary-foreground" }), title: "即時資料總覽", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(DataRow, { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Timer, { className: "w-3.5 h-3.5" }), label: "累計運轉小時", value: `${(selected?.totalRunHours ?? 0).toLocaleString()} h` }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(DataRow, { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "w-3.5 h-3.5" }), label: "今日累計用電", value: `${(selected?.todayKWh ?? 0).toFixed(1)} kWh` }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(DataRow, { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Activity, { className: "w-3.5 h-3.5" }), label: "目前 COP", value: (selected?.cop ?? 0).toFixed(2) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(DataRow, { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Thermometer, { className: "w-3.5 h-3.5" }), label: "出水 / 回水", value: `${selected?.outletTemp.toFixed(1) ?? "--"} / ${selected?.inletTemp.toFixed(1) ?? "--"} °C` })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(SidePanel, { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Map, { className: "w-4 h-4 text-primary-foreground" }), title: "廠區地圖", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative h-[140px] rounded-md overflow-hidden bg-[#0a1814] border border-border", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 opacity-50", style: {
            backgroundImage: "linear-gradient(rgba(163,230,53,0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(163,230,53,0.12) 1px, transparent 1px)",
            backgroundSize: "20px 20px"
          } }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute left-[18%] top-[22%] w-10 h-7 bg-primary/40 border border-primary rounded-sm" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute left-[36%] top-[44%] w-16 h-10 bg-primary/70 border border-primary rounded-sm shadow-[0_0_20px_rgba(163,230,53,0.6)]" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute right-[18%] top-[30%] w-8 h-6 bg-[#f97316]/40 border border-[#f97316] rounded-sm" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute right-[22%] bottom-[18%] w-9 h-7 bg-[#ef4444]/40 border border-[#ef4444] rounded-sm animate-pulse" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute left-2 bottom-1 text-[10px] text-muted-foreground", children: "Line 1–4" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(SidePanel, { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(GitBranch, { className: "w-4 h-4 text-primary-foreground" }), title: "系統拓撲", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 text-[11px]", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TopologyNode, { label: "主控", tone: "primary" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(DashLine, {}),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TopologyNode, { label: "閘道 A", tone: "ok" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(DashLine, {}),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(TopologyNode, { label: "HP-2001", tone: "ok", small: true }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TopologyNode, { label: "HP-2002", tone: "warn", small: true }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TopologyNode, { label: "HP-2003", tone: "error", small: true })
          ] })
        ] }) })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 xl:grid-cols-3 gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(SidePanel, { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Gauge, { className: "w-4 h-4 text-primary-foreground" }), title: "運轉指標", right: /* @__PURE__ */ jsxRuntimeExports.jsx(Maximize2, { className: "w-3.5 h-3.5 text-muted-foreground" }), children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-3 gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(KpiTile, { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "w-4 h-4" }), label: "今日總能耗", value: "12,430", unit: "kWh" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(KpiTile, { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Activity, { className: "w-4 h-4" }), label: "平均 COP", value: "3.42", unit: "" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(KpiTile, { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { className: "w-4 h-4" }), label: "運轉效率", value: "87", unit: "%" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(KpiTile, { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Timer, { className: "w-4 h-4" }), label: "今日停機", value: "32", unit: "min" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(KpiTile, { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(OctagonAlert, { className: "w-4 h-4" }), label: "今日告警", value: "2", unit: "次" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(KpiTile, { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Thermometer, { className: "w-4 h-4" }), label: "平均出水", value: "55.4", unit: "°C" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(SidePanel, { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { className: "w-4 h-4 text-primary-foreground" }), title: "運轉趨勢曲線", right: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-1 text-[10px]", children: ["6h", "12h", "1d", "7d", "1m"].map((t, i) => /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: cn("px-1.5 py-0.5 rounded", i === 2 ? "bg-primary text-primary-foreground font-semibold" : "text-muted-foreground border border-border"), children: t }, t)) }), children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-[180px]", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ResponsiveContainer, { width: "100%", height: "100%", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(AreaChart, { data: WORKFLOW, margin: {
          top: 4,
          right: 6,
          left: -22,
          bottom: 0
        }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("defs", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("linearGradient", { id: "cv", x1: "0", y1: "0", x2: "0", y2: "1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "0%", stopColor: "#a3e635", stopOpacity: 0.55 }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "100%", stopColor: "#a3e635", stopOpacity: 0 })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CartesianGrid, { stroke: "rgba(255,255,255,0.05)", vertical: false }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(XAxis, { dataKey: "t", tick: {
            fill: "#6b7280",
            fontSize: 10
          }, axisLine: false, tickLine: false }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(YAxis, { tick: {
            fill: "#6b7280",
            fontSize: 10
          }, axisLine: false, tickLine: false }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Tooltip, { contentStyle: {
            background: "#13302a",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 6,
            fontSize: 11
          }, labelStyle: {
            color: "#a3e635"
          } }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Area, { type: "monotone", dataKey: "v", stroke: "#a3e635", strokeWidth: 2, fill: "url(#cv)" })
        ] }) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-[42px] -mt-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ResponsiveContainer, { width: "100%", height: "100%", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(BarChart, { data: WORKFLOW, margin: {
          top: 0,
          right: 6,
          left: -22,
          bottom: 0
        }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(XAxis, { dataKey: "t", hide: true }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(YAxis, { hide: true }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Bar, { dataKey: "bar", fill: "#f97316", radius: [2, 2, 0, 0] })
        ] }) }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(SidePanel, { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Info, { className: "w-4 h-4 text-primary-foreground" }), title: "設備清單", right: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[10px] text-muted-foreground", children: [
        filtered.length,
        " 台"
      ] }), children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-h-[260px] overflow-y-auto -mr-1 pr-1 space-y-1.5", children: [
        filtered.slice(0, 30).map((d) => /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setSelectedId(d.id), className: cn("w-full flex items-center gap-2 px-2 h-9 rounded-md text-left text-[12px] transition-colors focus-ring", selected?.id === d.id ? "bg-primary/15 border border-primary/40" : "border border-transparent hover:bg-accent/40"), children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-2 h-2 rounded-full flex-shrink-0", style: {
            backgroundColor: STATUS_COLOR[d.status]
          } }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-foreground truncate flex-1", children: d.code }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground truncate hidden sm:inline max-w-[80px]", children: d.clientName }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "tabular-nums text-muted-foreground", suppressHydrationWarning: true, children: fmtRelative(d.lastHeartbeatAt) })
        ] }, d.id)),
        filtered.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-center py-6 text-xs text-muted-foreground", children: "暫無符合條件的設備" })
      ] }) })
    ] })
  ] });
}
function StatPill({
  label,
  value,
  color,
  icon,
  pulse
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative bg-card border border-border rounded-lg p-3 flex items-center gap-3 overflow-hidden", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 rounded-md flex items-center justify-center", style: {
      backgroundColor: `${color}22`,
      color
    }, children: icon }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[11px] text-muted-foreground", children: label }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-2xl font-bold text-foreground tabular-nums leading-tight", children: [
        value,
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground font-normal ml-1", children: "台" })
      ] })
    ] }),
    pulse && value > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute top-2 right-2 w-2 h-2 rounded-full animate-pulse", style: {
      backgroundColor: color
    } }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute right-0 bottom-0 w-20 h-10 opacity-40", children: /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { viewBox: "0 0 80 40", className: "w-full h-full", children: /* @__PURE__ */ jsxRuntimeExports.jsx("polyline", { fill: "none", stroke: color, strokeWidth: "1.5", points: "0,30 10,24 20,28 30,18 40,22 50,12 60,18 70,8 80,14" }) }) })
  ] });
}
function DeviceTile({
  d,
  selected,
  iso,
  onClick
}) {
  const color = STATUS_COLOR[d.status];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick, className: cn("relative h-16 sm:h-20 rounded-md transition-all duration-200 focus-ring", "border text-left", selected ? "scale-[1.08] z-10" : "hover:scale-[1.04]"), style: {
    background: `linear-gradient(135deg, ${color}26, ${color}0d)`,
    borderColor: selected ? color : `${color}55`,
    boxShadow: selected ? `0 0 0 2px ${color}, 0 0 24px ${color}80` : `inset 0 0 12px ${color}33`
  }, title: `${d.code} · ${STATUS_LABEL[d.status]}`, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: cn("absolute top-1 right-1 w-1.5 h-1.5 rounded-full", d.status === "abnormal" && "animate-pulse"), style: {
      backgroundColor: color,
      boxShadow: `0 0 6px ${color}`
    } }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: cn("absolute inset-0 flex flex-col items-center justify-center px-1", iso && "[transform:rotateZ(45deg)_rotateX(-54deg)]"), children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] font-semibold text-foreground tabular-nums truncate max-w-full", children: d.code.replace("HP-", "") }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[9px] text-muted-foreground tabular-nums", children: d.status === "offline" ? "--" : `${d.powerKW.toFixed(1)}kW` })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "absolute -bottom-2 left-1 text-[8px] text-muted-foreground hidden sm:block", children: [
      "L",
      parseInt(d.id.replace(/\D/g, ""), 10) % 4 + 1
    ] })
  ] });
}
function TooltipRow({
  label,
  value,
  color
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "tabular-nums text-right font-medium", style: {
      color: color ?? "var(--foreground)"
    }, children: value })
  ] });
}
function SidePanel({
  icon,
  title,
  right,
  children
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border border-border rounded-lg overflow-hidden", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 px-3 h-10 border-b border-border", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-6 h-6 rounded bg-primary flex items-center justify-center", children: icon }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-semibold text-foreground", children: title }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "ml-auto", children: right ?? /* @__PURE__ */ jsxRuntimeExports.jsx(Info, { className: "w-3.5 h-3.5 text-muted-foreground" }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-3", children })
  ] });
}
function DataRow({
  icon,
  label,
  value
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 py-1.5 border-b border-border/40 last:border-b-0", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-6 h-6 rounded bg-background flex items-center justify-center text-primary", children: icon }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[11px] text-muted-foreground leading-tight", children: label }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-semibold text-foreground tabular-nums leading-tight", children: value })
    ] })
  ] });
}
function KpiTile({
  icon,
  label,
  value,
  unit
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-background/60 border border-border rounded-md p-2.5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-1.5 text-primary", children: icon }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1 text-[10px] text-muted-foreground leading-tight", children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-baseline gap-1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-lg font-bold text-foreground tabular-nums", children: value }),
      unit && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-muted-foreground", children: unit })
    ] })
  ] });
}
function TopologyNode({
  label,
  tone,
  small
}) {
  const map = {
    primary: {
      bg: "#a3e635",
      fg: "#0d1f1a"
    },
    ok: {
      bg: "#22c55e22",
      fg: "#22c55e",
      border: "#22c55e55"
    },
    warn: {
      bg: "#f9731622",
      fg: "#f97316",
      border: "#f9731655"
    },
    error: {
      bg: "#ef444422",
      fg: "#ef4444",
      border: "#ef444455"
    }
  };
  const c = map[tone];
  return /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: cn("inline-flex items-center justify-center rounded font-semibold whitespace-nowrap", small ? "h-6 px-1.5 text-[10px]" : "h-8 px-2 text-[11px]"), style: {
    background: c.bg,
    color: c.fg,
    border: c.border ? `1px solid ${c.border}` : void 0
  }, children: label });
}
function DashLine() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "inline-block w-4 h-px", style: {
    borderTop: "1px dashed rgba(163,230,53,0.5)"
  } });
}
const SplitComponent = () => /* @__PURE__ */ jsxRuntimeExports.jsx(AppShell, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Overview, {}) });
export {
  SplitComponent as component
};
