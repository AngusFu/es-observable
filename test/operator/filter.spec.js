import Observable from '../../lib/observable';
import '../../lib/observable/from';
import '../../lib/operator/filter';

describe('operator `filter`', () => {
  it('throws an error when first argument is not a function', () => {
    const o = Observable.from([1, 2, 3]);
    expect(() => o.filter(null)).toThrow();
    expect(() => o.filter(() => 2)).not.toThrow();
  });

  it('passes error on', (done) => {
    const o = Observable.from([1, 2, 3]).filter((val) => {
      throw new TypeError('err');
    });
    const fn = jest.fn();
    o.subscribe({
      next() {
        fn();
      },
      error(e) {
        expect(fn.mock.calls.length).toBe(0);
        expect(e).toBeInstanceOf(TypeError);
        done();
      }
    });
  });

  it('works as expected', (done) => {
    const o = Observable.from([1, 2, 3]).filter((val) => val % 2 === 0);
    const arr = [];
    o.subscribe({
      next(val) {
        arr.push(val);
      },
      error() {},
      complete() {
        expect(arr).toEqual([2]);
        done();
      }
    });
  });

  it('works as expected', (done) => {
    const o = Observable.from([1, 2, 3, null, 0]).filter((val) => !!val);
    const arr = [];
    o.subscribe({
      next(val) {
        arr.push(val);
      },
      error() {},
      complete() {
        expect(arr).toEqual([1, 2, 3]);
        done();
      }
    });
  });
});
