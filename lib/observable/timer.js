import defineStatic from '../defineStaticMethod';
import Observable from '../observable';

defineStatic(Observable, 'timer', timer);

function timer(delay, interval) {
  let C = typeof this === 'function' ? this : Observable;

  if (typeof delay !== 'number') {
    throw new TypeError(delay + ' is not a number');
  }

  return new C((observer) => {
    let i = 0;
    let timer = null;

    const runNext = function() {
      clearTimeout(timer);
      timer = setTimeout(() => {
        if (observer.closed) {
          clearTimeout(timer);
        } else {
          observer.next(i++);
          runNext();
        }
      }, interval);
    };

    setTimeout(() => {
      observer.next(i++);
      if (typeof interval !== 'number' || interval < 0) {
        observer.complete();
      } else {
        timer = runNext();
      }
    }, delay > 0 ? delay : 0);
  });
}
