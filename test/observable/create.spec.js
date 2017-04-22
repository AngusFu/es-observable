import Observable from '../../lib/observable';
import '../../lib/observable/create';

describe('Observable.create', () => {
  it('throws TypeError if first argument is not a function', () => {
    expect(() => Observable.create()).toThrow();
    expect(() => Observable.create(null)).toThrow();
    expect(() => Observable.create({})).toThrow();
  });

  it('is another way to construct an observable', () => {
    const callback = jest.fn();
    const stream = Observable.create((observer) => {
      observer.next(1);
      observer.next(2);
    });
    const subscription = stream.subscribe(callback);

    expect(stream).toBeInstanceOf(Observable);
    expect(subscription.unsubscribe).toBeInstanceOf(Function);
    expect(callback).toBeCalled();
    expect(callback.mock.calls.length).toBe(2);
  });
});
