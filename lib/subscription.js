import {
  isFunction
} from './util';

export default class Subscription {
  constructor(observer, subscriber) {
    if (!observer) {
      throw 'invali oberserver';
    }

    this.observer = observer;
    this._closed = false;
    
    subscriber({
      next: val => {
        if (!this._closed && isFunction(observer.next)) {
          observer.next && observer.next(val);
        }
      },
      error: err => {
        if (!this._closed && isFunction(observer.error)) {
          observer.error && observer.error(err);
        }
      },
      complete: () => {
        if (!this._closed && isFunction(observer.complete)) {
          observer.complete && observer.complete();
        }
      }
    });
  }

  unsubscribe() {
    this._closed = true;
    this.observer = null;
  }

  get closed() {
    return this._closed;
  }
}
