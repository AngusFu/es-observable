import define from '../define'
import getSpecies from '../getSpecies'
import Observable from '../observable'
import '../observable/from'

define(Observable.prototype, 'takeUtil', takeUtil)

function takeUtil (observable) {
  const C = getSpecies(this)
  const observable1 = this
  const observable2 = Observable.from(observable)
  const subscriber = (observer) => {
    observable2.subscribe({
      next (value) {
        observer.complete()
      },
      error (e) {
        observer.error(e)
      }
    })

    observable1.subscribe({
      next (value) {
        observer.next(value)
      },
      error (e) {
        observer.error(e)
      },
      complete (e) {
        observer.complete(e)
      }
    })
  }
  return new C(subscriber)
}
