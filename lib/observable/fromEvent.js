import define from '../define';
import Observable from '../observable';
import './fromEventPattern';
import {
  isExisty,
  isFunction,
  toString
} from '../util';

define(Observable, 'fromEvent', fromEvent);

function fromEvent(target, type, selector, option) {
  let C = typeof this === 'function' ? this : Observable;

  if (!isExisty(target)) {
    throw new TypeError(target + ' should not be null or undefined');
  }

  if (target.addListener) {
    return C.fromEventPattern(
      (h) => target.addListener(type, h, option),
      (h) => target.removeListener(type, h, option),
      selector
    );
  }

  if (isFunction(target.on) && isFunction(target.off)) {
    // jquery ...
    return C.fromEventPattern(
      (h) => target.on(type, h, option),
      (h) => target.off(type, h, option),
      selector
    );
  }

  if (typeof selector === 'string') {
    selector = document.querySelectorAll(selector);
  }

  // Not NodeList or HTMLCollection
  const s = toString(selector);
  if (s === '[object NodeList]' || s === '[object HTMLCollection]') {
    // TODO
  } else if (s === '[object Window]' || selector.nodeType === 1) {
    // TODO
  }

  const subscriber = (observer) => {
    // TODO
  };

  return new C(subscriber);
}
