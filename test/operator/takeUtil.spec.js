import Observable from '../../lib/observable';
import '../../lib/observable/interval';
import '../../lib/operator/takeUtil';

jest.useFakeTimers();

describe('operator `takeUtil`', () => {
  it('works as expected', () => {
    const arr = [];
    const callback = jest.fn();
    const subscription = Observable
      .interval(10)
      .takeUtil(Observable.interval(59))
      .subscribe((val) => {
        arr.push(val);
        console.log(subscription);
        callback();
      });

    expect(callback).not.toBeCalled();
    jest.runTimersToTime(100);
    expect(callback).toBeCalled();
    expect(callback.mock.calls.length).toBe(5);
  });
});
