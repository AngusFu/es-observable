import Observable from '../../lib/observable';
import '../../lib/observable/from';
import '../../lib/operator/map';

describe('operator `map`', () => {
  it('throws an error when first argument is not a function', () => {
    const o = Observable.from([1, 2, 3]);
    expect(() => o.map(null)).toThrow();
    expect(() => o.map(() => 2)).not.toThrow();
  });

  it('works as expected', (done) => {
    const o = Observable.from([1, 2, 3]).map((val) => val * 2);
    const arr = [];
    o.subscribe({
      next(val) {
        arr.push(val);
      },
      error() {},
      complete() {
        expect(arr).toEqual([2, 4, 6]);
        done();
      }
    });
  });
});
