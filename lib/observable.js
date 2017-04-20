import {
  observableSymbol,
  isFunction
} from './util';
import Subscription from './subscription';

export default class Observable {
  constructor(subscriber) {
    if (!isFunction(subscriber)) {
      throw 'subscriber is not a function';
    }
    
    this.subscriber = subscriber;
  }

  [observableSymbol]() {
    return this;
  }

  subscribe(observer, ...args) {
    if (isFunction(observer)) {
      observer = {
        next: observer,
        error: args[0],
        complete: args[1]
      };
    }

    return new Subscription(observer, this.subscriber);
  }
}

function listen(element, eventName) {
    return new Observable(observer => {
        // Create an event handler which sends data to the sink
        let handler = event => observer.next(event);

        // Attach the event handler
        element.addEventListener(eventName, handler, true);

        // Return a cleanup function which will cancel the event stream
        return () => {
            // Detach the event handler from the element
            element.removeEventListener(eventName, handler, true);
        };
    });
}

const s = listen(document, 'click');
window.s = s.subscribe((e) => console.log(e));
