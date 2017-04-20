const hasSymbol = typeof Symbol === 'function';
const toString = arg => Object.prototype.toString.call(arg);

if (hasSymbol && !Symbol.observable) {
  Symbol.observable = Symbol("observable");
}

export const observableSymbol = hasSymbol ? Symbol.observable : '@@observable';

export function isObserver(o) {
  return o && isFunction(o.next);
}

export function isObservable(o) {
  return o && isFunction(o[observableSymbol]);
}

export function isFunction(f) {
  return toString(f) === '[object Function]';
}
