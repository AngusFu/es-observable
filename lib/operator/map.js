import {
  isFunction
} from '../util';
import define from '../define';
import getSpecies from '../getSpecies';
import Observable from '../observable';

define(Observable.prototype, 'map', map);

function map(fn) {
  if (!isFunction(fn)) {
    throw new TypeError(fn + ` is not a function`);
  }

  const C = getSpecies(this);

  return new C((observer) => {
    return this.subscribe({
      next(value) {
        if (observer.closed) {
          return;
        }

        try {
          value = fn(value);
        } catch (e) {
          return observer.error(e);
        }

        return observer.next(value);
      },

      error(e) {
        return observer.error(e);
      },

      complete(e) {
        return observer.complete(e);
      }
    });
  });
}
