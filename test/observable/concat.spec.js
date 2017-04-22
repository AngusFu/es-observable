import Observable from '../../lib/observable';
import '../../lib/observable/from';
import {
  transform
} from '../../lib/observable/concat';

describe('Observable.concat', () => {
  it('throws TypeError if any argument is not stream/promise/iterable', () => {
    expect(() => Observable.concat()).toThrow();
    expect(() => Observable.concat(Observable.from([]), null)).toThrow();
  });

  it('internal transform function works', (done) => {
    const observable = Observable.from([0]);
    const promise = Promise.resolve(1);
    const iterable = new Set([2]);

    const observable$ = transform(observable);
    const promise$ = transform(promise);
    const iterable$ = transform(iterable);

    expect(observable$).toBe(observable);
    expect(Observable.isObservable(promise$)).toBe(true);
    expect(Observable.isObservable(iterable$)).toBe(true);

    const arr = [];
    const $1 = Observable.concat(observable, promise);
    const $2 = Observable.concat($1, iterable);

    const subscription = $2.subscribe({
      next(v) {
        arr.push(v);
      },
      complete() {
        expect(subscription.closed).toBe(true);
        expect(arr).toEqual([0, 1, 2]);
        done();
      }
    });
  });
});
