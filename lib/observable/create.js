import define from '../define'
import Observable from '../observable'
import {
  isFunction
} from '../util'

define(Observable, 'create', create)

function create (subscriber) {
  let C = typeof this === 'function' ? this : Observable
  if (!isFunction(subscriber)) {
    throw new TypeError('`subscriber` is not a function')
  }
  return new C(subscriber)
}
