import Observable from '../../lib/observable';
import '../../lib/observable/interval';

jest.useFakeTimers();

describe('Observable.interval', () => {
  beforeEach(() => jest.clearAllTimers());

  it('is defined and accepts 1 arguments', () => {
    expect(Observable.interval).toBeInstanceOf(Function);
    expect(Observable.interval.length).toBe(1);
  });

  it('throws type error if first argument is not a number', () => {
    expect(() => Observable.interval()).toThrow();
    expect(() => Observable.interval(null)).toThrow();
    expect(() => Observable.interval('string')).toThrow();
    expect(() => Observable.interval(true)).toThrow();
    expect(() => Observable.interval({})).toThrow();
    expect(() => Observable.interval(() => {})).toThrow();
  });

  it('subscription is closed', () => {
    const subscription = Observable.interval(50).subscribe(() => {});
    jest.runTimersToTime(300);
    expect(subscription.closed).toBe(false);
  });

  it('works as expected', () => {
    const callback = jest.fn();

    const subscription = Observable.interval(100).subscribe((e) => {
      callback();
      setTimeout(() => {
        subscription.unsubscribe();
      }, 450);
    });

    expect(callback).not.toBeCalled();
    jest.runTimersToTime(600);
    expect(callback).toBeCalled();
    expect(callback.mock.calls.length).toBe(5);
  });
});
