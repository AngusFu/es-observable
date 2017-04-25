import Observable from '../../lib/observable';
import '../../lib/observable/from';
import '../../lib/operator/concat';

describe('Observable.concat', () => {
  it('throws TypeError if any argument is not' +
    'Observable/Promise/Iterable', () => {
    const stream$ = Observable.from([]);
    expect(() => stream$.concat()).toThrow();
    expect(() => stream$.concat(null)).toThrow();
  });

  it('works as expected', (done) => {
    const observable = Observable.from([0]);
    const promise = Promise.resolve(1);
    const iterable = new Set([2]);

    const arr = [];
    const $1 = observable.concat(promise);
    const $2 = $1.concat(iterable);

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
