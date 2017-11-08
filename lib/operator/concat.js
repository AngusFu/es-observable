import define from '../define'
import getSpecies from '../getSpecies'
import Observable from '../observable'
import '../observable/concat'

define(Observable.prototype, 'concat', concat)

function concat (stream) {
  const C = getSpecies(this)
  return C.concat(this, stream)
}
