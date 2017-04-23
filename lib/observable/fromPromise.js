import defineStatic from '../defineStaticMethod';
import Observable from '../observable';
import './from';
import {
  isPromise
} from '../util';

defineStatic(Observable, 'fromPromise', fromPromise);

function fromPromise(promise) {
  let C = typeof this === 'function' ? this : Observable;

  if (!isPromise(promise)) {
    throw new TypeError(promise + ' is not a promise object');
  }

  const subscriber = (observer) => {
    // don't use `.catch`
    // in case we get an object without
    // such method
    promise.then((v) => {
      observer.next(v);
      observer.complete();
    }, (e) => {
      observer.error(e);
    });
  };

  return new C(subscriber);
}
