import Observable from '../../lib/observable'
import '../../lib/observable/from'
import '../../lib/observable/merge'

describe('Observable.merge', () => {
  it('throws TypeError if any argument is not' +
    'Observable/Promise/Iterable', () => {
    expect(() => Observable.merge()).toThrow()
    expect(() => Observable.merge(Observable.from([]), null)).toThrow()
  })

  it('throws error if any Observable errors', (done) => {
    const o1 = new Observable((o) => {
      o.next(0)
      o.error()
    })
    const o2 = Observable.from([1])

    const arr = []
    Observable.merge(o1, o2).subscribe({
      next (v) {
        arr.push(v)
      },
      error (e) {
        expect(arr).toEqual([0])
        done()
      }
    })
  })

  it('will not complete if no Observable completes', (done) => {
    const o1 = new Observable((o) => o.next(1))
    const o2 = new Observable((o) => o.next(2))

    const arr = []
    const s = Observable.merge(o1, o2).subscribe({
      next (v) {
        arr.push(v)
      }
    })
    setTimeout(() => {
      expect(arr).toEqual([1, 2])
      expect(s.closed).toEqual(false)
      done()
    }, 50)
  })

  it('will not complete if only one Observables completed', (done) => {
    const o1 = new Observable((o) => o.complete())
    const o2 = new Observable((o) => o.next(2))

    const arr = []
    const s = Observable.merge(o1, o2).subscribe({
      next (v) {
        arr.push(v)
      }
    })
    setTimeout(() => {
      expect(arr).toEqual([2])
      expect(s.closed).toEqual(false)
      done()
    }, 50)
  })

  it('completes when two Observables are completed', (done) => {
    const o1 = Observable.from([0])
    const o2 = Observable.from([1])

    const arr = []
    Observable.merge(o1, o2).subscribe({
      next (v) {
        arr.push(v)
      },
      complete () {
        expect(arr).toEqual([0, 1])
        done()
      }
    })
  })
})
