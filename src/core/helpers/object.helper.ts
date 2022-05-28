export function isEmpty(x) {
  return typeof x === 'object' && Object.keys(x).length === 0;
}
