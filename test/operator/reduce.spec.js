import Observable from '../../lib/observable';
import '../../lib/observable/from';
import '../../lib/operator/reduce';

describe('operator `filter`', () => {
  it('throws an error when first argument is not a function', () => {
    const o = Observable.from([1, 2, 3]);
    expect(() => o.reduce(null)).toThrow();
    expect(() => o.reduce(() => 2)).not.toThrow();
  });

  it('throw type error when stream is empty', (done) => {
    const o = Observable.from([]).reduce((acc, val) => val);
    o.subscribe({
      error(e) {
        expect(e).toBeInstanceOf(TypeError);
        done();
      }
    });
  });

  it('passes on the error', (done) => {
    const o = new Observable((o) => {
      o.error(123);
    });

    o.subscribe({
      error(e) {
        expect(e).toBe(123);
        done();
      }
    });
  });

  it('works as expected without a seed', (done) => {
    const o = Observable.from([1, 2, 3]).reduce((acc, val) => {
      acc += val;
      return acc;
    });

    o.subscribe({
      next(val) {
        expect(val).toEqual(6);
        done();
      }
    });
  });

  it('works as expected when a seed provided', (done) => {
    const arr = [];
    const o = Observable.from([1, 2, 3]).reduce((acc, val) => {
      acc.push(val);
      return acc;
    }, arr);

    o.subscribe({
      complete() {
        expect(arr).toEqual([1, 2, 3]);
        done();
      }
    });
  });

  it('works as expected when some error throwed', (done) => {
    const arr = [];
    const fn = jest.fn();
    const o = Observable.from([1, 2, 3]).reduce((acc, val) => {
      if (val % 2 === 0) {
        throw new Error('unexpected');
      }

      acc.push(val);
      return acc;
    }, arr);

    o.subscribe({
      error(e) {
        fn();
        expect(fn.mock.calls.length).toBe(1);
        expect(e).toBeInstanceOf(Error);
        done();
      }
    });
  });
});
