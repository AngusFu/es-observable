import Observable from '../../lib/observable';
import '../../lib/observable/fromPromise';

describe('Observable.fromPromise', () => {
  it('throws TypeError if first argument is not a promise', () => {
    expect(() => Observable.fromPromise()).toThrow();
    expect(() => Observable.fromPromise({})).toThrow();
    expect(() => Observable.fromPromise({then: true})).toThrow();
  });

  it('invoke `.error` when promise rejects', () => {
    const promise = Promise.reject(1111);
    let err = null;
    Observable.fromPromise(promise).subscribe({
      next() {},
      error: (e) => {
        err = e;
      },
      complete() {
        expect(err).toBeInstanceOf(TypeError);
        expect(subscription.closed).toBe(true);
        done();
      }
    });
  });

  it('emits resolved value and then subscription is closed', (done) => {
    const promise = Promise.resolve(1111);
    const subscription = Observable.fromPromise(promise).subscribe((val) => {
      expect(val).toBe(1111);
      setTimeout(() => {
        expect(subscription.closed).toBe(true);
        done();
      });
    });
  });
});
