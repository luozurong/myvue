export const nodeOps = {
  // 增加 删 改 查
  insert (child, parent, anchor = null) {
    parent.insertBefore(child, anchor) // insertBefore 可以等价appendchild
  },
  remove (child) { // 删除节点
    const parentNode = child.prarentNode
    if (parentNode) {
      parentNode.removeChild(child)
    }
  },
  // 文本节点， 元素中的内容
  setElementText (el, text) {
    el.textContent = text
  },
  setText (node, text) { // document.createTextNode
    node.nodeValue = text
  },
  querySelect (selector) {
    return document.querySelector(selector)
  },
  parentNode (node) {
    return node.parentNode
  },
  nextSibling (node) {
    return node.nextSibling
  },
  createElement (tagName) {
    return document.createElement(tagName)
  },
  createText (text) {
    return document.createTextNode = text
  }
}