import { isObject } from "@vue/shared";
import { multableHandlers, ReactiveFlags } from './baseHandlers'
import { activeEffect } from "./effect";

// 1.将数据转换为响应式数据,只能做对象的代理
const reactiveMap = new WeakMap() // 弱饮用 key只能是对象


// 实现同一个对象多次代理 返回同一个代理
// 代理对象呗再次代理，可以直接返回
export function reactive(target) {
  if (!isObject(target)) {
    return
  }
  // 判断是否代理过
  if (target[ReactiveFlags.IS_REACTIVE]) {
    return target
  }

  // 并没有重新定义属性，只是代理，在取值的时候会调用get,赋值的时候调用set

  let exisitingProxy = reactiveMap.get(target)
  if (exisitingProxy) {
    return exisitingProxy
  }

  // 第一次普通对象代理，我们会通过new proxy代理一次
  // 下一次你传递的是proxy 我们可以看一下有没有代理过，如果访问这个proxy 有get方法的时候说明就是访问过了

  const proxy = new Proxy(target, multableHandlers)

  reactiveMap.set(target, proxy)

  return proxy
}

// proxy操作
// let target = {
//   name: 'lzr',
//   get alias () {
//     return this.name
//   }
// }
// const proxy = new Proxy(target, {
//   get(target, key, receiver) {
//     // 代理对象上取值
//     // return target[key]
//     Reflect.get(target, key, receiver)
//   },
//   set(target, key, value, receiver) {
//     // 代理对象上设置值
//     // target[key] = value
//     return Reflect.set(target, key, value, receiver)
//   }
// })
// 去alia取值时，也去了name,当时没有监控到name
// proxy.alias
// 在页面使用alias，页面是否要变化