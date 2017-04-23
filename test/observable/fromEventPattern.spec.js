import Observable from '../../lib/observable';
import '../../lib/observable/fromEventPattern';
import {
  EventEmitter
} from 'events';
describe('Observable.fromEventPattern', () => {
  it('throws TypeError if first argument is not a function', () => {
    expect(() => Observable.fromEventPattern()).toThrow();
    expect(() => Observable.fromEventPattern({})).toThrow();
    expect(() => Observable.fromEventPattern({then: true})).toThrow();
  });

  it('throws TypeError if second argument is existy '
    + 'but is not a function', () => {
    expect(() => {
      Observable.fromEventPattern(
        () => {},
        'existy but not a function'
      );
    }).toThrow();
  });

  it('throws TypeError if third argument is existy '
    + 'but is not a function', () => {
    expect(() => {
      Observable.fromEventPattern(
        () => {},
        () => {},
        'existy but not a function'
      );
    }).toThrow();
  });

  it('works as expected 1 param provided', (done) => {
    const emiter = new EventEmitter();
    const stream = Observable.fromEventPattern(
      (h) => emiter.on('notify', h)
    );
    const subscription = stream.subscribe((val) => {
      expect(val).toBe(1000);
      expect(subscription.closed).toBe(false);
      done();
    });
    emiter.emit('notify', 1000);
  });

  it('works as expected 2 param provided', (done) => {
    const emiter = new EventEmitter();
    const stream = Observable.fromEventPattern(
      (h) => emiter.on('notify', h),
      (h) => emiter.removeListener('notify', h)
    );
    const subscription = stream.subscribe((val) => {
      expect(val).toBe(1000);
      expect(subscription.closed).toBe(false);
      subscription.unsubscribe();
      setTimeout(() => {
        expect(subscription.closed).toBe(true);
        done();
      }, 0);
    });
    emiter.emit('notify', 1000);
  });

  it('works as expected 3 param provided', (done) => {
    const emiter = new EventEmitter();
    const stream = Observable.fromEventPattern(
      (h) => emiter.on('notify', h),
      (h) => emiter.removeListener('notify', h),
      (val) => val * 2
    );
    const subscription = stream.subscribe((val) => {
      expect(val).toBe(2000);
      expect(subscription.closed).toBe(false);
      subscription.unsubscribe();
      setTimeout(() => {
        expect(subscription.closed).toBe(true);
        done();
      }, 0);
    });
    emiter.emit('notify', 1000);
  });
});
