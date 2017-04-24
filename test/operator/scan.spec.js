import Observable from '../../lib/observable';
import '../../lib/observable/from';
import '../../lib/operator/scan';

describe('operator `filter`', () => {
  it('throws an error when first argument is not a function', () => {
    const o = Observable.from([1, 2, 3]);
    expect(() => o.scan(null)).toThrow();
    expect(() => o.scan(() => 2)).not.toThrow();
  });

  it('throw type error when stream is empty', (done) => {
    const o = Observable.from([]).scan((acc, val) => val);
    o.subscribe({
      error(e) {
        expect(e).toBeInstanceOf(TypeError);
        done();
      }
    });
  });

  it('passes on the error', (done) => {
    const arr = [];
    const err = new Error('err');
    const o = Observable.from([1, 2, 3, 4]).scan((acc, val) => {
      if (acc > 5) {
        throw err;
      }
      return acc + val;
    });

    o.subscribe({
      next(val) {
        arr.push(val);
      },
      error(e) {
        expect(arr).toEqual([1, 3, 6]);
        expect(e).toBe(err);
        done();
      }
    });
  });

  it('works as expected without a seed', (done) => {
    const arr = [];
    const o = Observable.from([1, 2, 3]).scan((acc, val) => {
      acc += val;
      return acc;
    });

    o.subscribe({
      next(val) {
        arr.push(val);
      },
      complete() {
        expect(arr).toEqual([1, 3, 6]);
        done();
      }
    });
  });

  it('works as expected when a seed provided', (done) => {
    const arr = [];
    const o = Observable.from([1, 2, 3]).scan((acc, val) => acc + val, 10);
    o.subscribe({
      next(val) {
        arr.push(val);
      },
      complete() {
        expect(arr).toEqual([11, 13, 16]);
        done();
      }
    });
  });

  it('works as expected when some error throwed', (done) => {
    const arr = [];
    const fn = jest.fn();
    const o = Observable.from([1, 2, 3]).scan((acc, val) => {
      if (val % 2 === 0) {
        throw new Error('unexpected');
      }
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
