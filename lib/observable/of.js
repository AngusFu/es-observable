import defineStatic from '../defineStaticMethod';
import Observable from '../observable';

defineStatic(Observable, 'of', of);

function of(...args) {
    let C = typeof this === 'function' ? this : Observable;
    return new C((observer) => {
      for (let i = 0; i < args.length; i++) {
        if (observer.closed) {
          break;
        }
        observer.next(args[i]);
      }

      observer.complete();
    });
};
