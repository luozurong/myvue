export function patchAttr(el, key, nextValue) {
  if (nextValue) {
    el.addEventListerner(key, nextValue)
  } else {
    el.removeAttribute(key)
  }
}