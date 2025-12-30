/**
  * vue-class-component v8.0.0
  * (c) 2015-present Evan You
  * @license MIT
  */
import { ref, proxyRefs } from 'vue';

function _defineProperty(e, r, t) {
  return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, {
    value: t,
    enumerable: true,
    configurable: true,
    writable: true
  }) : e[r] = t, e;
}
function ownKeys(e, r) {
  var t = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var o = Object.getOwnPropertySymbols(e);
    r && (o = o.filter(function (r) {
      return Object.getOwnPropertyDescriptor(e, r).enumerable;
    })), t.push.apply(t, o);
  }
  return t;
}
function _objectSpread2(e) {
  for (var r = 1; r < arguments.length; r++) {
    var t = null != arguments[r] ? arguments[r] : {};
    r % 2 ? ownKeys(Object(t), true).forEach(function (r) {
      _defineProperty(e, r, t[r]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) {
      Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r));
    });
  }
  return e;
}
function _toPrimitive(t, r) {
  if ("object" != typeof t || !t) return t;
  var e = t[Symbol.toPrimitive];
  if (void 0 !== e) {
    var i = e.call(t, r);
    if ("object" != typeof i) return i;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return ("string" === r ? String : Number)(t);
}
function _toPropertyKey(t) {
  var i = _toPrimitive(t, "string");
  return "symbol" == typeof i ? i : i + "";
}

function defineGetter(obj, key, getter) {
  Object.defineProperty(obj, key, {
    get: getter,
    enumerable: false,
    configurable: true
  });
}
function defineProxy(proxy, key, target) {
  Object.defineProperty(proxy, key, {
    get: () => target[key].value,
    set: value => {
      target[key].value = value;
    },
    enumerable: true,
    configurable: true
  });
}
function getSuper(Ctor) {
  var superProto = Object.getPrototypeOf(Ctor.prototype);
  if (!superProto) {
    return undefined;
  }
  return superProto.constructor;
}
function getOwn(value, key) {
  return value.hasOwnProperty(key) ? value[key] : undefined;
}
class VueImpl {
  static get __vccOpts() {
    // Early return if `this` is base class as it does not have any options
    if (this === Vue) {
      return {};
    }
    var Ctor = this;
    var cache = getOwn(Ctor, '__c');
    if (cache) {
      return cache;
    }
    // If the options are provided via decorator use it as a base
    var options = _objectSpread2({}, getOwn(Ctor, '__o'));
    Ctor.__c = options;
    // Handle super class options
    var Super = getSuper(Ctor);
    if (Super) {
      options.extends = Super.__vccOpts;
    }
    // Inject base options as a mixin
    var base = getOwn(Ctor, '__b');
    if (base) {
      options.mixins = options.mixins || [];
      options.mixins.unshift(base);
    }
    options.methods = _objectSpread2({}, options.methods);
    options.computed = _objectSpread2({}, options.computed);
    var proto = Ctor.prototype;
    Object.getOwnPropertyNames(proto).forEach(key => {
      if (key === 'constructor') {
        return;
      }
      // hooks
      if (Ctor.__h.indexOf(key) > -1) {
        options[key] = proto[key];
        return;
      }
      var descriptor = Object.getOwnPropertyDescriptor(proto, key);
      // methods
      if (typeof descriptor.value === 'function') {
        options.methods[key] = descriptor.value;
        return;
      }
      // computed properties
      if (descriptor.get || descriptor.set) {
        options.computed[key] = {
          get: descriptor.get,
          set: descriptor.set
        };
        return;
      }
    });
    options.setup = function (props, ctx) {
      var data = new Ctor(props, ctx);
      var dataKeys = Object.keys(data);
      var plainData = {};
      var promise = null;
      // Initialize reactive data and convert constructor `this` to a proxy
      dataKeys.forEach(key => {
        // Skip if the value is undefined not to make it reactive.
        // If the value has `__s`, it's a value from `setup` helper, proceed it later.
        if (data[key] === undefined || data[key] && data[key].__s) {
          return;
        }
        plainData[key] = ref(data[key]);
        defineProxy(data, key, plainData);
      });
      // Invoke composition functions
      dataKeys.forEach(key => {
        if (data[key] && data[key].__s) {
          var setupState = data[key].__s();
          if (setupState instanceof Promise) {
            if (!promise) {
              promise = Promise.resolve(plainData);
            }
            promise = promise.then(() => {
              return setupState.then(value => {
                plainData[key] = proxyRefs(value);
                return plainData;
              });
            });
          } else {
            plainData[key] = proxyRefs(setupState);
          }
        }
      });
      return promise !== null && promise !== void 0 ? promise : plainData;
    };
    var decorators = getOwn(Ctor, '__d');
    if (decorators) {
      decorators.forEach(fn => fn(options));
    }
    // from Vue Loader
    var injections = ['render', 'ssrRender', '__file', '__cssModules', '__scopeId', '__hmrId'];
    injections.forEach(key => {
      if (Ctor[key]) {
        options[key] = Ctor[key];
      }
    });
    return options;
  }
  static registerHooks(keys) {
    this.__h.push(...keys);
  }
  static with(Props) {
    var propsMeta = new Props();
    var props = {};
    Object.keys(propsMeta).forEach(key => {
      var meta = propsMeta[key];
      props[key] = meta !== null && meta !== void 0 ? meta : null;
    });
    class PropsMixin extends this {}
    PropsMixin.__b = {
      props
    };
    return PropsMixin;
  }
  constructor(props, ctx) {
    defineGetter(this, '$props', () => props);
    defineGetter(this, '$attrs', () => ctx.attrs);
    defineGetter(this, '$slots', () => ctx.slots);
    defineGetter(this, '$emit', () => ctx.emit);
    Object.keys(props).forEach(key => {
      Object.defineProperty(this, key, {
        enumerable: false,
        configurable: true,
        writable: true,
        value: props[key]
      });
    });
  }
}
VueImpl.__h = ['data', 'beforeCreate', 'created', 'beforeMount', 'mounted', 'beforeUnmount', 'unmounted', 'beforeUpdate', 'updated', 'activated', 'deactivated', 'render', 'errorCaptured', 'serverPrefetch'];
var Vue = VueImpl;

function Options(options) {
  return Component => {
    Component.__o = options;
    return Component;
  };
}
function createDecorator(factory) {
  return (target, key, index) => {
    var Ctor = typeof target === 'function' ? target : target.constructor;
    if (!Ctor.__d) {
      Ctor.__d = [];
    }
    if (typeof index !== 'number') {
      index = undefined;
    }
    Ctor.__d.push(options => factory(options, key, index));
  };
}
function mixins() {
  for (var _len = arguments.length, Ctors = new Array(_len), _key = 0; _key < _len; _key++) {
    Ctors[_key] = arguments[_key];
  }
  var _a;
  return _a = class MixedVue extends Vue {
    constructor() {
      for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        args[_key2] = arguments[_key2];
      }
      super(...args);
      Ctors.forEach(Ctor => {
        var data = new Ctor(...args);
        Object.keys(data).forEach(key => {
          this[key] = data[key];
        });
      });
    }
  }, _a.__b = {
    mixins: Ctors.map(Ctor => Ctor.__vccOpts)
  }, _a;
}
function setup(setupFn) {
  // Hack to delay the invocation of setup function.
  // Will be called after dealing with class properties.
  return {
    __s: setupFn
  };
}

// Actual implementation
function prop(options) {
  return options;
}

export { Options, Vue, createDecorator, mixins, prop, setup };
