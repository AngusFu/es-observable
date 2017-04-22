import defineStatic from '../defineStaticMethod';
import Observable from '../observable';
import './from';
import {
  isPromise,
  isIterable
} from '../util';

defineStatic(Observable, 'concat', concat);

const isObservable = Observable.isObservable;
export const transform = (o) => {
  const type = isObservable(o) ? 1 : (
    isPromise(o) ? 2 : (isIterable(o) ? 3 : -1)
  );

  if (type === -1) {
    throw new TypeError(`You provided '${o}' ` +
      'where a stream was expected. ' +
      'You can provide an Observable, Promise, Array, or Iterable.'
    );
  }

  if (type === 1) {
    return o;
  }

  // promise
  if (type === 2) {
    return new Observable((observer) => {
      o.then((v) => {
        observer.next(v);
        observer.complete();
      }).catch((e) => observer.error(e));
    });
  }

  if (type === 3) {
    return Observable.from(o);
  }
};
Observable.transform = transform;
function concat(observable1, observable2, observable3) {
    let C = typeof this === 'function' ? this : Observable;
    observable1 = transform(observable1);
    observable2 = transform(observable2);

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
