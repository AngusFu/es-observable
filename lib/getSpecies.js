import {
  speciesSymbol
} from './util';
import Observable from './observable';

export default function getSpecies(obj) {
  let ctor = obj.constructor;

  if (ctor !== void 0) {
    ctor = ctor[speciesSymbol];

    if (ctor === null) {
      ctor = void 0;
    }
  }

  return ctor !== void 0 ? ctor : Observable;
}
