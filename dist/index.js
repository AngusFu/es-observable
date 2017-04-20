(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.minObservable = factory());
}(this, (function () { 'use strict';

var hasSymbol = typeof Symbol === 'function';
var toString = function (arg) { return Object.prototype.toString.call(arg); };

if (hasSymbol && !Symbol.observable) {
  Symbol.observable = Symbol("observable");
}

var observableSymbol = hasSymbol ? Symbol.observable : '@@observable';





function isFunction(f) {
  return toString(f) === '[object Function]';
}

var Subscription = function Subscription(observer, subscriber) {
  var this$1 = this;

  if (!observer) {
    throw 'invali oberserver';
  }

  this.observer = observer;
  this._closed = false;
    
  subscriber({
    next: function (val) {
      if (!this$1._closed && isFunction(observer.next)) {
        observer.next && observer.next(val);
      }
    },
    error: function (err) {
      if (!this$1._closed && isFunction(observer.error)) {
        observer.error && observer.error(err);
      }
    },
    complete: function () {
      if (!this$1._closed && isFunction(observer.complete)) {
        observer.complete && observer.complete();
      }
    }
  });
};

var prototypeAccessors = { closed: {} };

Subscription.prototype.unsubscribe = function unsubscribe () {
  this._closed = true;
  this.observer = null;
};

prototypeAccessors.closed.get = function () {
  return this._closed;
};

Object.defineProperties( Subscription.prototype, prototypeAccessors );

var Observable = function Observable(subscriber) {
  if (!isFunction(subscriber)) {
    throw 'subscriber is not a function';
  }
    
  this.subscriber = subscriber;
};

Observable.prototype[observableSymbol] = function () {
  return this;
};

Observable.prototype.subscribe = function subscribe (observer) {
    var args = [], len = arguments.length - 1;
    while ( len-- > 0 ) args[ len ] = arguments[ len + 1 ];

  if (isFunction(observer)) {
    observer = {
      next: observer,
      error: args[0],
      complete: args[1]
    };
  }

  return new Subscription(observer, this.subscriber);
};

function listen(element, eventName) {
    return new Observable(function (observer) {
        // Create an event handler which sends data to the sink
        var handler = function (event) { return observer.next(event); };

        // Attach the event handler
        element.addEventListener(eventName, handler, true);

        // Return a cleanup function which will cancel the event stream
        return function () {
            // Detach the event handler from the element
            element.removeEventListener(eventName, handler, true);
        };
    });
}

var s = listen(document, 'click');
window.s = s.subscribe(function (e) { return console.log(e); });

return Observable;

})));
//# sourceMappingURL=index.js.map
