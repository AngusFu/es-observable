import Observable from '../../lib/observable';
import '../../lib/observable/create';
import '../../lib/observable/from';
import '../../lib/operator/map';
import '../../lib/operator/switch';

describe('operator `switch`', () => {
  it('can pass on error', (done) => {
    const o = Observable.from([1, 2, 3])
      .map((val) => Observable.create(function(observer) {
        observer.error(val);
        let timer = setTimeout(() => {
          observer.next(val);
        }, 20);
        return () => {
          clearTimeout(timer);
        };
      }))
      .switch();

    o.subscribe({
      error(val) {
        expect(val).toBe(1);
        done();
      }
    });
  });

  it('works as expected', (done) => {
    const o = Observable.from([1, 2, 3])
      .map((val) => Observable.create(function(observer) {
        let timer = setTimeout(() => {
          observer.next(val);
        }, 20);
        return () => {
          clearTimeout(timer);
        };
      }))
      .switch();

    o.subscribe({
      next(val) {
        expect(val).toBe(3);
        done();
      }
    });
  });
});
