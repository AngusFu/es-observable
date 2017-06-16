import {
  speciesSymbol,
  observableSymbol,
  setPrototypeProperties,
  hasOwnProperty,
  getMethod,
  isFunction,
  isObject,
  isExisty
} from './util';

import Subscription, {
  subscriptionClosed,
  cleanupSubscription
} from './Subscription';

import SubscriptionObserver from './SubscriptionObserver';

export default class Observable {
  constructor(subscriber) {
    if (!this instanceof Observable) {
      throw new TypeError(
        'Observable is not intended to be called as a function'
      );
    }

    if (!isFunction(subscriber)) {
      throw new TypeError('`subscriber` is not a function');
    }

    this.__subscriber = subscriber;
  }
}

Observable.isObservable = function(o) {
  return o instanceof Observable;
};

Object.defineProperty(Observable.prototype, observableSymbol, {
  value: function() {
    return this;
  },
  configurable: true,
  writable: true
});

Object.defineProperty(Observable, speciesSymbol, {
  get() {
    return this;
  },
  configurable: true
});

setPrototypeProperties(Observable.prototype, {
  constructor: Observable,

  subscribe(observer, ...args) {
    if (!isObject(this)) {
      throw new TypeError(
        'calling subscribe method illegally: `this` is not an object'
      );
    }

    if (!hasOwnProperty(this, '__subscriber')) {
      throw new TypeError(
        'calling subscribe method illegally: internal slot not found'
      );
    }

    if (isFunction(observer)) {
      observer = {
        next: observer,
        error: args[0],
        complete: args[1]
      };
    }

    const subscription = new Subscription(observer);
    const start = getMethod(observer, 'start');

    if (isFunction(start)) {
      start.call(observer, subscription);

      if (subscriptionClosed(subscription)) {
        return subscription;
      }
    }

    const subscriptionObserver = new SubscriptionObserver(subscription);
    const subscriber = this.__subscriber;

    try {
      const cleanup = executeSubscriber(subscriber, subscriptionObserver);
      subscription.__cleanup = cleanup;
    } catch (e) {
      subscriptionObserver.error(e);
    }

    if (subscriptionClosed(subscription)) {
      cleanupSubscription(subscription);
    }

    return subscription;
  }
});

function executeSubscriber(subscriber, observer) {
  if (!isFunction(subscriber)) {
    throw new TypeError('subscriber is not a function');
  }
  if (!isObject(observer)) {
    throw new TypeError('observer is not an object');
  }

  let cleanup = subscriber.call(void 0, observer);

  if (!isExisty(cleanup)) {
    return void 0;
  } else if (isFunction(cleanup)) {
    return cleanup;
  }

  let unsubscribe = getMethod(cleanup, 'unsubscribe');
  if (isExisty(unsubscribe)) {
    return () => unsubscribe.call(cleanup);
  }
  throw new TypeError(cleanup + ' is not a function');
}
