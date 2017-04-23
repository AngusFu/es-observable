import Observable from '../../observable';
import '../from';
import '../fromPromise';

import {
  isPromise,
  isIterable,
  isArray
} from '../../util';

const isObservable = (o) => o instanceof Observable;

export default function(o, Observable) {
  if (isObservable(o)) {
    return o;
  }

  if (isPromise(o)) {
    return Observable.fromPromise(o);
  }

  if (isArray(o) || isIterable(o)) {
    return Observable.from(o);
  }

  throw new TypeError(`You provided '${o}' ` +
    'where a stream was expected. ' +
    'You can provide an Observable, Promise, Array, or Iterable.'
  );
}
