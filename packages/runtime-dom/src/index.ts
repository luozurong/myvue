
import { createRenderer } from '@vue/runtime-core'
import { nodeOps } from './nodeOps'
import { pacthProp } from './patchProp'


const renderOptions = Object.assign(nodeOps, pacthProp) // domApi 属性api

export function render (vnode, container) {
  // 在创建渲染器的时候, 传入选项
  createRenderer(renderOptions).render(vnode, container)
}

export * from '@vue/runtime-core'

