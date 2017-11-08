import define from '../define'
import getSpecies from '../getSpecies'
import Observable from '../observable'

define(Observable.prototype, 'switch', switchFn)

function switchFn () {
  const C = getSpecies(this)
  let currSubscription = null

  // TODO
  // how to pass on error and complete？
  return new C((observer) => {
    this.subscribe({
      next (stream) {
        currSubscription && currSubscription.unsubscribe()
        currSubscription = stream.subscribe({
          next (val) {
            observer.next(val)
          },
          error (err) {
            observer.error(err)
            observer.complete(err)
          }
        })

        return () => {
          currSubscription && currSubscription.unsubscribe()
        }
      }
    })
  })
}
