import {
  isFunction,
  setPrototypeProperties
} from './util'

export default class Subscription {
  constructor (observer) {
    // see zen-observable
    if (Object(observer) !== observer) {
      throw new TypeError('`observer` is not an object')
    }

    this.__observer = observer
    this.__cleanup = undefined
  }
}

Object.defineProperty(Subscription.prototype, 'closed', {
  get () {
    return subscriptionClosed(this)
  },
  enumerable: false,
  configurable: true
})

setPrototypeProperties(Subscription.prototype, {
  constructor: Object,
  unsubscribe () {
    if (!subscriptionClosed(this)) {
      this.__observer = undefined
      cleanupSubscription(this)
    }
  }
})

function assertSubscription (subscription) {
  const isSubscription = subscription instanceof Subscription

  if (!isSubscription) {
    throw new TypeError('`subscription` is not instance of Subscription')
  }
}

export function cleanupSubscription (subscription) {
  assertSubscription(subscription)
  const cleanup = subscription.__cleanup
  if (cleanup === undefined) {
    return undefined
  }

  if (!isFunction(cleanup)) {
    throw new TypeError('slot `cleanup` is not callable')
  }

  subscription.__cleanup = undefined
  cleanup()
}

export function subscriptionClosed (subscription) {
  assertSubscription(subscription)
  return subscription.__observer === undefined
}
