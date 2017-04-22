import defineStatic from '../defineStaticMethod';
import Observable from '../observable';
import {
  iteratorSymbol
} from '../util';

import './from';

defineStatic(Observable, 'range', range);

function range(start, length = 0) {
  let C = typeof this === 'function' ? this : Observable;

  let index = 0;
  let iterator = {
      next: function() {
        const done = index >= length;
        index += 1;
        return {
          value: done ? void 0 : start++,
          done
        };
      },
      [Symbol.iterator]: function() {
        return this;
      }
  };

  return C.from(iterator);
};
