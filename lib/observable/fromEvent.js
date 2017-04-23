import defineStatic from '../defineStaticMethod';
import Observable from '../observable';
import './from';
import {
  isPromise
} from '../util';

defineStatic(Observable, 'fromEvent', fromEvent);

function fromEvent(selector, event, option) {
    let C = typeof this === 'function' ? this : Observable;

    // document.querySelector(selector);
    if (!isPromise(promise)) {
      throw new TypeError(promise + ' is not a promise object');
    }

    const subscriber = (observer) => {
    };

    return new C(subscriber);
}
