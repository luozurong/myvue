
export let activeEffect = undefined // 导出的是一个饮用

function clearupEffect (effect) {
  // 双向关联，都要清空
  // effect.deps = [] // 不能这么写
  const { deps } = effect // deep里面装的是name对应的effect
  for( let i = 0; i < deps.length; i++) {
    deps[i].delete(effect) //  解除effect，重新收集依赖
  }

  effect.deps.length = 0
}

export class ReactiveEffect {
  // 表示在市里上增加了active属性
  public parent = null
  public deps = []
  public active = true // 这个effect默认是激活状态
  constructor(public fn) {
    // this.active = true
    
  }
  run() { //执行effect
    if (!this.active) {
      // 这里表示如果是非激活的情况，只需要执行函数，不需要执行依赖收集
      return this.fn()
    }

    // 这里依赖收集了 核心就是将当前的effect 和稍后渲染的熟悉关联在一起
    try {
      this.parent = activeEffect
      activeEffect = this

      // 执行用户函数之前将之前收集的依赖内容清空 ativeEffect.deps = [(set), [set]]
      clearupEffect(this)

      return this.fn() // 稍后调用取值操作的时候，就可以获取到这个全局的activeEffect

    } finally {
      activeEffect = this.parent
      // this.parent = null
    }
    
  }

  stop () {
    if (this.active) {
      this.active = false
      clearupEffect(this) // 停止effect收集
    }
  }
}

export function effect (fn) {
  // 这里fn可以根据状态变化重新执行， effect可以嵌套执行

  const _effect = new ReactiveEffect(fn) // 创建响应式effect
  
  _effect.run() // 默认执行一次

  const runner = _effect.run.bind(_effect) // 绑定this执行

  runner.effect = _effect // 将effect挂在到runner函数上

  return runner
}

// 一个effect对应多个属性，一个属性对应多个effect 结论多对多
const targetMap = new WeakMap()
export function track(target, type, key) {
  // debugger
  // 单向记录， 属性记录了effect， 
  // 反向记录 记录哪些属性收集过，这样做的好处是为了清理
  // 对象 某个属性 对应多个effect 
  // WeakMap {对象： Map{name: new Set() 》effect}}
  // 只有effect里面才收集 直接state.name 不收集
  if (!activeEffect) return

  let depsMap = targetMap.get(target)
  if (!depsMap) {
    targetMap.set(target, (depsMap = new Map()))
  }
  let dep = depsMap.get(key)
  if (!dep) {
    depsMap.set(key, (dep = new Set()))
  }

  let shouldTrack = !dep.has(activeEffect)
  if (shouldTrack) {
    dep.add(activeEffect)
    // 存放属性对应的set name: new Set() 
    activeEffect.deps.push(dep) // 让effect记录dep 稍后清理的时候会用到
  }

}

export function trigger(target, type, key, value, oldValue) {
  const depsMap = targetMap.get(target)
  if (!depsMap) return // 触发的值不在模版中使用

  let effects = depsMap.get(key) // 找到属性对应的effect

  // 执行之前， 先拷贝一份， 不要关联引用
  if (effects) {
    effects = new Set(effects)
    effects.forEach(effect => {
      // 我们在执行effect的时候又要执行自己，那我们需要屏蔽掉，无需无限调用
      if (effect !== activeEffect) {
        effect.run()
      }
    });
  }
}

// 反向收集

// effect(() => {
//   flag ? this.name : this.age
// })

// 执行过程类是树型结构

// effect(() => { // parent = null activeEffect  = e1
//   state.name // name  e1
//   effect(() => { // parent = e1  activeEffect  = e2
//     state.age   //age e2
//   })
//   state.addr // addr e1才能达到效果

//   effect(() => { // parent = e1  activeEffect  = e3
//     state.age   //age e3
//   })
// })

// 1.创建一个响应式对象 new Proxy
// 2.effect默认数据变化能更新，先将正在执行的effect作为全局变量，渲染取值
// 3.在get方法中进行依赖收集
// 4.weakmap 对象: map(属性： set(effect))
// 5.用户数据发生数据变化，会通过对象属性来查找相对应的effect集合，找到effect后调用run()方法全部执行