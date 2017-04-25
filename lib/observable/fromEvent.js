import define from '../define';
import Observable from '../observable';
import './fromEventPattern';
import {
  isExisty,
  isFunction,
  toString,
  toArray
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

  const s = toString(target);

  // window or body
  if (s === '[object Window]' || target.nodeType === 1) {
    return C.fromEventPattern(
      (h) => target.addEventListener(type, h, option),
      (h) => target.removeEventListener(type, h, option),
      selector
    );
  }

  if (s === '[object String]') {
    target = toArray(document.querySelectorAll(target));
  } else if (s === '[object NodeList]' || s === '[object HTMLCollection]') {
    target = toArray(s);
  } else {
    throw new TypeError(target + ' is invalid.');
  }

  // TODO: performance
  const subscriber = (observer) => {
    const subscriptions = target.map((el) => {
      return C.fromEventPattern(
        (h) => el.addEventListener(type, h, option),
        (h) => el.removeEventListener(type, h, option),
        selector
      ).subscribe((e) => {
        observer.next(e);
      });
    });

    return () => {
      subscriptions.map((s) => s.unsubscribe());
    };
  };

  return new C(subscriber);
}
