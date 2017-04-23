const proptoToString = Object.prototype.toString;
export const hasOwn = Object.prototype.hasOwnProperty;
export const toString = (arg) => proptoToString.call(arg);

export const supportSymbol = typeof Symbol === 'function';
export const getSymbol = (symbol) => {
  return supportSymbol ? Symbol[symbol] : `@@${symbol}`;
};

if (supportSymbol && !Symbol.observable) {
  Symbol.observable = Symbol('observable');
}
export const observableSymbol = getSymbol('observable');
export const speciesSymbol = getSymbol('species');
export const iteratorSymbol = getSymbol('iterator');

export function getMethod(obj, key) {
  const keyIsStringOrSymbol = /Symbol|String/.test(toString(key));
  if (!keyIsStringOrSymbol) {
    throw new Error('only string/symbol value can be used as property key');
  }

  const func = Object(obj)[key];

  if (isExisty(func)) {
    return func;
  }
}

export function isFunction(f) {
  return toString(f) === '[object Function]';
}

export function isObject(o) {
  return toString(o) === '[object Object]';
}

export function isArray(o) {
  return toString(o) === '[object Array]';
}

export function isExisty(o) {
  return o !== null && o !== void 0;
}

export function isPromise(o) {
  return toString(o) === '[object Promise]'
    || isObject(o) && isFunction(o.then);
}

export function isIterable(o) {
  return isFunction(getMethod(o, iteratorSymbol));
}

export function hasOwnProperty(obj, prop) {
  return hasOwn.call(obj, prop);
}

export function setPrototypeProperties(obj, props) {
  Object.keys(props).forEach((key) => {
    Object.defineProperty(obj, key, {
      value: props[key],
      enumerable: false,
      configurable: true,
      writable: true
    });
  });
}

export function setPrototypeProperty(obj, key, val) {
  Object.defineProperty(obj, key, {
    value: val,
    enumerable: false,
    configurable: true,
    writable: true
  });
}
