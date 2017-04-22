import Observable from '../../lib/observable';
import '../../lib/observable/range';

describe('Observable.range', () => {
  it('closed at once if zero arguments provided', () => {
    const callback = jest.fn();
    const subscription = Observable.range().subscribe(callback);
    expect(callback).not.toBeCalled();
    expect(subscription.closed).toBe(true);
  });

  it('won\'t emit anything if second arguments not provided', () => {
    const callback = jest.fn();
    const subscription = Observable.range(5).subscribe(callback);
    expect(callback).not.toBeCalled();
    expect(subscription.closed).toBe(true);
  });

  it('emits a series of number from 2 to 10', () => {
    const callback = jest.fn();
    const subscription = Observable.range(2, 9).subscribe(callback);
    expect(callback).toBeCalled();
    expect(callback.mock.calls.length).toBe(9);
    expect(subscription.closed).toBe(true);
  });
});
