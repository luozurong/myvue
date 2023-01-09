function createInvoker (callback) {
  const invokers = (e) => invokers.value(e)
  invokers.value = callback()
}

// 第一次绑定click事件 a
// 第二次绑定click事件 b
// 第三次绑定click事件 null
export function patchEvent(el, eventName, nextValue) {
  // 可以先删事件， 在重新绑定
  // remove => add == add + 自定义事件(里面绑定调用的方法)

  let invokers = el._vei || (el.vei = {})

  let exits = invokers(eventName) // 先看有没有缓存

  // 如果绑定的是一个空
  if (exits && nextValue) { // 已经绑定过了

    exits.value = nextValue // 没有卸载函数，只是改了invoker.value的属性

  } else { // onclick = click (没有绑定过)
    let event = eventName.slice(2).toLowerCase()

    if (nextValue) {

      const invoker = invokers[eventName] = createInvoker(nextValue)
      el.addEventListerner(event, invoker)

    } else if(exits){ // 如果有老值，需要将老的绑定事件移除 nextValue空的时候

      el.removeEventLister(event, exits)
      invokers[eventName] = undefined
      
    }
  }
}