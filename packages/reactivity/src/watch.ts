import { isFunction, isObject } from "@vue/shared";
import { CleanPlugin } from "webpack";
import { ReactiveEffect } from "./effect";
import { isReactive } from "./reactive";


function traversal (value, set = new Set()) { // 如果对象中有循环饮用问题
  // 第一步递归有终结条件, 不是对象就不在递归
  if (isObject(value)) return value

  if (set.has(value)) {
    return value
  }

  set.add(value)

  for ( let key in  value) {
    traversal(value[key], set)
  }
  return value
}

// source是用户传入的对象
// cb是用户对应的回调
export function watch(source, cb) {
  let getter;

  if (isReactive(source)) {
    // 对用户传入的数据进行循环(递归循环， 只要循环就会访问对象上的每一个属性，访问属性就会收集effect)
    getter = () => traversal(source)
  } else if (isFunction(source)) {
    getter = source
  } else {
    return
  }
  let oldValue;
  let cleanup;
  const onCleanup = (fn) => {
    cleanup = fn
  }

  const job = () => {
    if (cleanup) cleanup() //下一次watch开始触发

    const newValue = effect.run()
    cb(newValue, oldValue, onCleanup)
    oldValue = newValue
  }

  // 在effect 中访问属性就会依赖收集
  const effect = new ReactiveEffect(getter, job) // 监控自己的构造函数，变化后重新执行job

  oldValue = effect.run()

}

// watch = effect 内部回保存老值和新值调用方法