import { patchAttr } from './modules/attr'
import { patchClass } from './modules/class'
import { patchEvent } from './modules/event'
import { patchStyle } from './modules/style'
// null, 值
// 值， 值
// 值， null
// dom属性操作api
export function pacthProp(el, key, prevValue, nextValue) {
  // 类名 e.className
  if (key === 'class') {

    patchClass(el, nextValue)

  } else if (key === 'style') { // 样式 el.style
    // el style {color: red} : {color: blue} 样式做比对
    patchStyle(el, prevValue, nextValue)

  } else if (key === /^on[^a-z]/.test(key)) { // events addEventListerner

    patchEvent(el, key, nextValue)

  } else {  // 普通属性 el.attribulte

    patchAttr(el, key, nextValue)

  }
}