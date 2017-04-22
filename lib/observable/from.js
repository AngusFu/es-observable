import defineStatic from '../defineStaticMethod';
import {
  supportSymbol,
  observableSymbol,
  getMethod,
  isExisty,
  isFunction,
  isArray
} from '../util';
import Observable from '../observable';

defineStatic(Observable, 'from', from);

function from(x) {
    let C = typeof this === 'function' ? this : Observable;
    let observableMethod = getMethod(x, observableSymbol);
    let subscriber = null;

    if (!isExisty(x)) {
      throw new TypeError(x + ' is not an object');
    }

    if (isExisty(observableMethod)) {
      let observable = observableMethod.call(x);

      if (Object(observable) !== observable) {
        throw new TypeError(x + 'is not observable');
      }

      let ctor = getMethod(observable, 'constructor');

      if (ctor === C) {
        return observable;
      }

      subscriber = (observer) => observable.subscribe(observer);
    } else {
      if (isArray(x)) {
        subscriber = (observer) => {
          for (let i = 0; i < x.length; i++) {
            if (observer.closed) {
              break;
            }
            observer.next(x[i]);
          }

          observer.complete();
        };
      } else if (supportSymbol) {
        let iteratorMethod = getMethod(x, Symbol.iterator);

        if (!isFunction(iteratorMethod)) {
          throw new TypeError(x + 'is not an iterator');
        }

        let iterator = iteratorMethod.call(x);

        subscriber = (observer) => {
          let done = false;

          while (!done) {
            if (observer.closed) {
              break;
            }

            let result = iterator.next();
            done = result.done;

            if (!done) {
              observer.next(result.value);
            }
          }

          observer.complete();
        };
      } else {
        throw new TypeError(x + 'is not iterable');
      }
    }

    return new C(subscriber);
};
