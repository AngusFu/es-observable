import {
  isFunction
} from '../util'
import define from '../define'
import getSpecies from '../getSpecies'
import Observable from '../observable'

define(Observable.prototype, 'reduce', reduce)

function reduce (fn, acc) {
  if (!isFunction(fn)) {
    throw new TypeError(fn + ` is not a function`)
  }

  const C = getSpecies(this)
  let hasFirst = acc !== void 0

  return new C((observer) => {
    return this.subscribe({
      next (value) {
        if (observer.closed) {
          return
        }

        if (hasFirst) {
          try {
            acc = fn(acc, value)
          } catch (e) {
            return observer.error(e)
          }
        } else {
          acc = value
          hasFirst = true
        }
      },

      error (e) {
        return observer.error(e)
      },

      complete (e) {
        if (!hasFirst) {
          observer.error(new TypeError('Cannot reduce an empty sequence'))
        } else {
          observer.next(acc)
          observer.complete(e)
        }
      }
    })
  })
}
