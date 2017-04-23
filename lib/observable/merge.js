import defineStatic from '../defineStaticMethod';
import Observable from '../observable';
import transform from './util/transform';

defineStatic(Observable, 'merge', merge);

function merge(observable1, observable2) {
  let C = typeof this === 'function' ? this : Observable;

  observable1 = transform(observable1, C);
  observable2 = transform(observable2, C);

  const subscriber = (observer) => {
    // See RxJS doc:
    // The output Observable only completes
    // once all input Observables have completed.
    // Any error delivered by an input Observable
    // will be immediately emitted on the output Observable.
    const status = [0, 0];
    observable1.subscribe(
      (val) => observer.next(val),
      (err) => observer.error(err),
      () => {
        status[0] = 1;
        if (status[0] && status[1]) {
          observer.complete();
        }
      }
    );

    observable2.subscribe(
      (val) => observer.next(val),
      (err) => observer.error(err),
      (val) => {
        status[1] = 1;
        if (status[0] && status[1]) {
          observer.complete();
        }
      }
    );
  };

  return new C(subscriber);
}
