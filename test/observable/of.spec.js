import Observable from '../../lib/observable'
import '../../lib/observable/of'

describe('Observable.of', () => {
  it('subscription is closed', () => {
    const subscription = Observable.of(1, 2, 3, 4).subscribe(() => {})
    expect(subscription.closed).toBe(true)
  })

  it('works as expected', () => {
    const callback = jest.fn()
    const callback2 = jest.fn()

    Observable.of(1, 2, 3, 4).subscribe(callback)
    Observable.of().subscribe(callback2)

    expect(callback).toBeCalled()
    expect(callback.mock.calls.length).toBe(4)
    expect(callback2).not.toBeCalled()
  })
})
