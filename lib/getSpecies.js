import {
  speciesSymbol
} from './util'
import Observable from './observable'

export default function getSpecies (obj) {
  let ctor = obj.constructor
  return ctor ? ctor[speciesSymbol] : Observable
}
