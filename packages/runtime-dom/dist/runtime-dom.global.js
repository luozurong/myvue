var VueRuntimeDOM = (() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // packages/runtime-dom/src/index.ts
  var src_exports = {};
  __export(src_exports, {
    createRenderer: () => createRenderer,
    h: () => h,
    render: () => render
  });

  // packages/runtime-core/src/renderer.ts
  function createRenderer(renderOptions2) {
    const render2 = (vnode, container) => {
    };
    return {
      render: render2
    };
  }

  // packages/runtime-core/src/h.ts
  function h() {
  }

  // packages/runtime-dom/src/nodeOps.ts
  var nodeOps = {
    insert(child, parent, anchor = null) {
      parent.insertBefore(child, anchor);
    },
    remove(child) {
      const parentNode = child.prarentNode;
      if (parentNode) {
        parentNode.removeChild(child);
      }
    },
    setElementText(el, text) {
      el.textContent = text;
    },
    setText(node, text) {
      node.nodeValue = text;
    },
    querySelect(selector) {
      return document.querySelector(selector);
    },
    parentNode(node) {
      return node.parentNode;
    },
    nextSibling(node) {
      return node.nextSibling;
    },
    createElement(tagName) {
      return document.createElement(tagName);
    },
    createText(text) {
      return document.createTextNode = text;
    }
  };

  // packages/runtime-dom/src/modules/attr.ts
  function patchAttr(el, key, nextValue) {
    if (nextValue) {
      el.addEventListerner(key, nextValue);
    } else {
      el.removeAttribute(key);
    }
  }

  // packages/runtime-dom/src/modules/class.ts
  function patchClass(el, nextValue) {
    if (nextValue === null) {
      el.className.removeAttribute("class");
    } else {
      el.className = nextValue;
    }
  }

  // packages/runtime-dom/src/modules/event.ts
  function createInvoker(callback) {
    const invokers = (e) => invokers.value(e);
    invokers.value = callback();
  }
  function patchEvent(el, eventName, nextValue) {
    let invokers = el._vei || (el.vei = {});
    let exits = invokers(eventName);
    if (exits && nextValue) {
      exits.value = nextValue;
    } else {
      let event = eventName.slice(2).toLowerCase();
      if (nextValue) {
        const invoker = invokers[eventName] = createInvoker(nextValue);
        el.addEventListerner(event, invoker);
      } else if (exits) {
        el.removeEventLister(event, exits);
        invokers[eventName] = void 0;
      }
    }
  }

  // packages/runtime-dom/src/modules/style.ts
  function patchStyle(el, prevValue, nextValue) {
    for (let key in nextValue) {
      el.style[key] = nextValue[key];
    }
    if (prevValue) {
      for (let key in prevValue) {
        if (nextValue[key] === null) {
          el.style[key] = null;
        }
      }
    }
  }

  // packages/runtime-dom/src/patchProp.ts
  function pacthProp(el, key, prevValue, nextValue) {
    if (key === "class") {
      patchClass(el, nextValue);
    } else if (key === "style") {
      patchStyle(el, prevValue, nextValue);
    } else if (key === /^on[^a-z]/.test(key)) {
      patchEvent(el, key, nextValue);
    } else {
      patchAttr(el, key, nextValue);
    }
  }

  // packages/runtime-dom/src/index.ts
  var renderOptions = Object.assign(nodeOps, pacthProp);
  function render(vnode, container) {
    createRenderer(renderOptions).render(vnode, container);
  }
  return __toCommonJS(src_exports);
})();
//# sourceMappingURL=runtime-dom.global.js.map
