export default function(target, key, method) {
  Object.defineProperty(target, key, {
    value: method,
    writable: true,
    configurable: true
  });
}
