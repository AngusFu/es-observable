import defineStatic from '../defineStaticMethod';
import Observable from '../observable';
import './from';
import './fromPromise';

import {
  isPromise,
  isIterable
} from '../util';

defineStatic(Observable, 'concat', concat);

const isObservable = Observable.isObservable;
const transform = (o, Observable) => {
  if (isObservable(o)) {
    return o;
  }

  if (isPromise(o)) {
    return Observable.fromPromise(o);
  }

  if (isIterable(o)) {
    return Observable.from(o);
  }

  throw new TypeError(`You provided '${o}' ` +
    'where a stream was expected. ' +
    'You can provide an Observable, Promise, Array, or Iterable.'
  );
};

function concat(observable1, observable2) {
    let C = typeof this === 'function' ? this : Observable;

    observable1 = transform(observable1, C);
    observable2 = transform(observable2, C);

    const subscriber = (observer) => {
      const next = (val) => observer.next(val);
      const error = (err) => observer.error(err);

      observable1.subscribe({
        next,
        error,
        complete() {
          observable2.subscribe(observer);
        }
      });
    };

    return new C(subscriber);
}
