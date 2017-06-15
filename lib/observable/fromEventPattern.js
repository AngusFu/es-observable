import define from '../define';
import Observable from '../observable';
import './from';
import {
  isFunction,
  isExisty
} from '../util';

define(Observable, 'fromEventPattern', fromEventPattern);

const checkFunction = (f) => {
  if (!isFunction(f)) {
    throw new TypeError(f + ' is not a function.');
  }
};

/**
 * @param {Function} addHandler     required, add handler
 * @param {Function} removeHandler  optional, remove handler
 * @param {Function} selector       optional, project event object
 * @return {Observable}
 */
function fromEventPattern(addHandler, removeHandler, selector) {
  let C = typeof this === 'function' ? this : Observable;

  checkFunction(addHandler);

  if (isExisty(removeHandler)) {
    checkFunction(removeHandler);
  }

  if (isExisty(selector)) {
    checkFunction(selector);
  }

  const subscriber = (observer) => {
    const handler = function(e) {
      if (selector) {
        e = selector(e);
      }
      observer.next(e);
    };
    addHandler(handler);
    return () => {
      removeHandler(handler);
    };
  };

  return new C(subscriber);
}
