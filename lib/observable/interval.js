import defineStatic from '../defineStaticMethod';
import Observable from '../observable';

defineStatic(Observable, 'interval', interval);

function interval(interval) {
    let C = typeof this === 'function' ? this : Observable;

    if (typeof interval !== 'number') {
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

      runNext();
    });
}
