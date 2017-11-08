import {
  isFunction
} from '../util'
import define from '../define'
import getSpecies from '../getSpecies'
import Observable from '../observable'

define(Observable.prototype, 'filter', filter)

function filter (fn) {
  if (!isFunction(fn)) {
    throw new TypeError(fn + ` is not a function`)
  }

  const C = getSpecies(this)

  return new C((observer) => {
    return this.subscribe({
      next (value) {
        if (observer.closed) {
          return
        }

        try {
          if (!fn(value)) {
            return
          }
        } catch (e) {
          return observer.error(e)
        }

        return observer.next(value)
      },

      error (e) {
        return observer.error(e)
      },

      complete (e) {
        return observer.complete(e)
      }
    })
  })
}
