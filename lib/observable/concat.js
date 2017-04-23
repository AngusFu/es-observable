import defineStatic from '../defineStaticMethod';
import Observable from '../observable';
import transform from './util/transform';

defineStatic(Observable, 'concat', concat);

function concat(observable1, observable2) {
  let C = typeof this === 'function' ? this : Observable;

  observable1 = transform(observable1, C);
  observable2 = transform(observable2, C);

  const subscriber = (observer) => {
    const next = (val) => observer.next(val);
    const error = (err) => observer.error(err);

    observable1.subscribe({
      next,
      error,
      complete() {
        observable2.subscribe(observer);
      }
    });
  };

  return new C(subscriber);
}
