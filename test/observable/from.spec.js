import Observable from '../../lib/observable';
import '../../lib/observable/from';

describe('Observable.from', () => {
  it('throws TypeError if first argument is not existy', () => {
    expect(() => Observable.from()).toThrow();
    expect(() => Observable.from(null)).toThrow();
  });

  it('throws TypeError if first argument is Primitive Objects', () => {
    /* eslint-disable no-new-wrappers */
    expect(() => Observable.from(new Number(2))).toThrow();
    /* eslint-enable no-new-wrappers */
  });

  it('returns first argument if it\'s an observable', () => {
    const observable = new Observable((e) => {});
    expect(Observable.from(observable)).toBe(observable);
  });

  it('receives iterables and emits their elemenets at once', () => {
    const callback = jest.fn();
    const callback2 = jest.fn();

    Observable.from([1, 2, 3, 4]).subscribe(callback);
    Observable.from(new Set([1, 2, 3, 4])).subscribe(callback2);

    expect(callback).toBeCalled();
    expect(callback.mock.calls.length).toBe(4);
    expect(callback2).toBeCalled();
    expect(callback2.mock.calls.length).toBe(4);
  });

  it('subscription is closed', () => {
    const subscription = Observable.from([1, 2, 3, 4]).subscribe(() => {});
    expect(subscription.closed).toBe(true);
  });
});
