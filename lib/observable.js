import {
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
} from './subscription';
import SubscriptionObserver from './subscriptionObserver';

export default class Observable {
  constructor(subscriber) {
    if (!this instanceof Observable) {
      throw new TypeError('Observable is not intended to be called as a function');
    }

    if (!isFunction(subscriber)) {
      throw new TypeError('The argument `subscriber` must be a function');
    }
    
    this.__subscriber = subscriber;
  }
}

setPrototypeProperties(Observable.prototype, {
  constructor: Observable,

  [observableSymbol]() {
    return this;
  },

  subscribe(observer, ...args) {
    if (!isObject(this)) {
      throw new TypeError('calling subscribe method illegally: `this` is not an object');
    }

    if (!hasOwnProperty(this, '__subscriber')) {
      throw new TypeError('calling subscribe method illegally: internal slot not found');
    }

    if (isFunction(observer)) {
      observer = {
        next: observer,
        error: args[0],
        complete: args[1]
      };
    } else if (!isObject(observer)) {
      observer = {};
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
    const result = ExecuteSubscriber(subscriber, subscriptionObserver);
    observer.__cleanup = result;

    if (subscription.closed) {
      cleanupSubscription(subscription);
    }

    return subscription;
  }
});

function ExecuteSubscriber(subscriber, observer) {
  if (!isFunction(subscriber)) {
    throw 'subscriber is not a function';
  }
  if (!isObject(observer)) {
    throw 'observer is not an object';
  }

  const result = subscriber.call(void 0, observer);
  
  if (!isExisty(result)) {
    return void 0;
  } else if (isFunction(result)) {
    return result;
  }

  let unsubscribe = getMethod(result, 'unsubscribe');

  if (!isExisty(unsubscribe)) {
    throw new TypeError('`unsubscribe` is undefined');
  }

  const cleanup = getCleanUpFunction();
  cleanup.__cleanup = result;
  return cleanup;
}

function getCleanUpFunction() {
  return function fn() {
    const slot = fn.__subscription;

    if (!isObject(fn.__subscription)) {
      throw 'calling `cleanupSubscription` illegally';
    }

    if (isFunction(slot.unsubscribe)) {
      slot.unsubscribe();
    }
  };
}