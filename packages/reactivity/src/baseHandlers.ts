import { isObject } from '@vue/shared'
import { reactive } from './reactive'
import { track, trigger } from './effect'

export const enum ReactiveFlags  {
  IS_REACTIVE = '_v_isReactive'
}

export const multableHandlers = {
  get(target, key, receiver) {
    if (key === ReactiveFlags.IS_REACTIVE) {
      return true
    }
    track(target, 'get', key)
    // 代理对象上取值
    // 可以监控到用户取值了
    let res = Reflect.get(target, key, receiver)
    if (isObject(res)) {
      return reactive(res) // 深度代理 性能代理 取值就可以代理
    }
    return res
  },
  set(target, key, value, receiver) {
    let oldValue = target[key]
    let result = Reflect.set(target, key, value, receiver)

    if (oldValue !== value) {
      // 要更新
      trigger(target, 'set', key, value, oldValue)
    }
    // 代理对象上设置值
    // 可以监控到用户设置值了
    return result
  }
}

