import { isFunction } from "@vue/shared"
import { ReactiveEffect, trackEffects, triggerEffects } from "./effect";

class ComputedRefIml {
  public effect;
  public _dirty = true; // 默认取值的时候进行计算
  public __v_isReadonly = true;
  public __v_isRef = true;
  public _value;
  public dep = new Set()

  constructor(getter, public setter) {
    // 将用户的getter放到effect中，这里面的firstname和laster就会呗收集起来
    this.effect = new ReactiveEffect(getter, () => {
      // 稍后的依赖属性变化就会这行此调度函数
      if (!this._dirty) {
        this._dirty = true
      }

      // 实现一个触发更新
      triggerEffects(this.dep)
    })
  }

  // 类中的属性访问器 底层是Object.definePropertt
  get value () {
    // 做依赖收集
    trackEffects(this.dep)

    if (this._dirty){ //说明这个值是脏的
      this._dirty = false
      this._value = this.effect.run()
    } 
    return this._value
  }

  set value (newValue) {
    this.setter(newValue)
  }

}


export const computed = (getterOrOptions) => {
  let onlyGetter = isFunction(getterOrOptions)

  let getter;
  let setter;

  if (onlyGetter) {
    getter = getterOrOptions
    setter = () => {
      console.warn('no setter')
    }
  } else {
    getter = getterOrOptions.get
    setter = getterOrOptions.set
  }

  return new ComputedRefIml(getter, setter)
}