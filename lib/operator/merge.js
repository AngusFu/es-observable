import define from '../define';
import getSpecies from '../getSpecies';
import Observable from '../observable';
import '../observable/merge';

define(Observable.prototype, 'merge', merge);

function merge(stream) {
  const C = getSpecies(this);
  return C.merge(this, stream);
}
