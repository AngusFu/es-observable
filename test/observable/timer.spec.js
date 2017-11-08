import Observable from '../../lib/observable'
import '../../lib/observable/timer'

jest.useFakeTimers()

describe('Observable.timer', () => {
  beforeEach(() => jest.clearAllTimers())

  it('is defined and accepts 2 arguments', () => {
    expect(Observable.timer).toBeInstanceOf(Function)
    expect(Observable.timer.length).toBe(2)
  })

  it('throws type error if first argument is not a number', () => {
    expect(() => Observable.timer()).toThrow()
    expect(() => Observable.timer(null)).toThrow()
    expect(() => Observable.timer('string')).toThrow()
    expect(() => Observable.timer(true)).toThrow()
    expect(() => Observable.timer({})).toThrow()
    expect(() => Observable.timer(() => {})).toThrow()
  })

  it('emits once if second argument invalid', () => {
    const callback = jest.fn()
    const subscription = Observable.timer(1000, {}).subscribe(callback)

    expect(callback).not.toBeCalled()
    jest.runAllTimers()
    expect(callback).toBeCalled()
    expect(callback.mock.calls.length).toBe(1)
    expect(subscription.closed).toBe(true)
  })

  it('works as expected when second argument provided', () => {
    const callback = jest.fn()

    const subscription = Observable.timer(50, 100).subscribe((e) => {
      callback()
      setTimeout(() => {
        subscription.unsubscribe()
      }, 150)
    })

    expect(callback).not.toBeCalled()
    jest.runTimersToTime(400)
    expect(callback).toBeCalled()
    expect(callback.mock.calls.length).toBe(2)
  })
})
