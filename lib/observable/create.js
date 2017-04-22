import defineStatic from '../defineStaticMethod';
import Observable from '../observable';
import {
  isFunction
} from '../util';

defineStatic(Observable, 'create', create);

function create(subscriber) {
    let C = typeof this === 'function' ? this : Observable;
    if (!isFunction(subscriber)) {
      throw new TypeError('`subscriber` is not a function');
    }
    return new C(subscriber);
};
