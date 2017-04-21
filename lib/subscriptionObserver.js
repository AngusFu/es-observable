import {
  isExisty,
  isObject,
  isFunction,
  getMethod,
  setPrototypeProperties
} from './util';

import {
  subscriptionClosed,
  cleanupSubscription
} from './subscription';

export default class SubscriptionObserver {
  constructor(subscription) {
    if (!isObject(subscription)) {
      throw new TypeError('`subscription` is not an object');
    }
    this.__subscription = subscription;
  }
}

Object.defineProperty(SubscriptionObserver.prototype, 'closed', {
  get() {
    assertSubscriptionObserver(this);
    return subscriptionClosed(this.__subscription);
  },
  enumerable: false,
  configurable: true
});

setPrototypeProperties(SubscriptionObserver.prototype, {
  constructor: Object,

  next(value) {
    assertSubscriptionObserver(this);
    const subscription = this.__subscription;
    if (subscriptionClosed(subscription)) {
      return;
    }
  
    const observer = getObserver(subscription);
    const next = getMethod(observer, 'next');

    if (isExisty(next)) {
      next.call(observer, value);
    }
  },

  error(err) {
    assertSubscriptionObserver(this);
    const subscription = this.__subscription;
    if (subscriptionClosed(subscription)) {
      return;
    }
  
    const observer = getObserver(subscription);
    const error = getMethod(observer, 'error');
    subscription.__observer = void 0;

    try {
      if (isExisty(error)) {
        error.call(observer, err);
      } else {
        throw err;
      }
    } catch (e) {
      try {
        cleanupSubscription(subscription)
      } finally {
        throw e
      }
    }

    cleanupSubscription(subscription);
    return err;
  },

  complete(value) {
    assertSubscriptionObserver(this);
    const subscription = this.__subscription;
    if (subscriptionClosed(subscription)) {
      return;
    }

    const observer = getObserver(subscription);
    const complete = getMethod(observer, 'complete');
    subscription.__observer = void 0;

    try {
      if (isExisty(complete)) {
        complete.call(observer, value);
      }
    } catch (e) {
      try {
        cleanupSubscription(subscription)
      } finally {
        throw e
      }
    }

    cleanupSubscription(subscription);
    return value;
  }
});

function assertSubscriptionObserver(observer) {
    if (!isObject(observer)) {
      throw new TypeError('`this` is not an object');
    }
    const hasSlot = '__subscription' in observer;
    if (!hasSlot) {
      throw new TypeError('`this` is not instance of subscription');
    }
}

function getObserver(subscription) {
  if (subscriptionClosed(subscription)) {
    return void 0;
  }

  const observer = subscription.__observer;

  if (!isObject(observer)) {
    throw new TypeError('`observer` is not an object');
  }

  return observer;
}


