import define from '../define'
import Observable from '../observable'
import './from'
import {
  isExisty,
  iteratorSymbol
} from '../util'

define(Observable, 'range', range)

function range (start, length = 0) {
  let C = typeof this === 'function' ? this : Observable

  let index = 0
  let iterator = !isExisty(start) ? [] : {
    next: function () {
      const done = index >= length
      index += 1
      return {
        value: done ? void 0 : start++,
        done
      }
    },
    [iteratorSymbol]: function () {
      return this
    }
  }

  return C.from(iterator)
}
