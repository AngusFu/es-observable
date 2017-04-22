import {
  isFunction,
  isObject,
  setPrototypeProperties
} from './util';

export default class Subscription {
  constructor(observer) {
    // see zen-observable
    if (Object(observer) !== observer) {
      throw new TypeError('`observer` is not an object');
    }

    this.__observer = observer;
    this.__cleanup = void 0;
  }
}

Object.defineProperty(Subscription.prototype, 'closed', {
  get() {
    return subscriptionClosed(this);
  },
  enumerable: false,
  configurable: true
});

setPrototypeProperties(Subscription.prototype, {
  constructor: Object,
  unsubscribe() {
    if (!subscriptionClosed(this)) {
      this.__observer = void 0;
      cleanupSubscription(this);
    }
  }
});

function assertSubscription(subscription) {
  const isSubscription = subscription instanceof Subscription;

  if (!isSubscription) {
    throw new TypeError('`subscription` is not instance of Subscription');
  }
}

export function cleanupSubscription(subscription) {
  assertSubscription(subscription);
  const cleanup = subscription.__cleanup;
  if (cleanup === void 0) {
    return void 0;
  }

  if (!isFunction(cleanup)) {
    throw new TypeError('slot `cleanup` is not callable');
  }

  subscription.__cleanup = void 0;
  cleanup.call(void 0);
}

export function subscriptionClosed(subscription) {
  assertSubscription(subscription);
  return subscription.__observer === void 0;
}
