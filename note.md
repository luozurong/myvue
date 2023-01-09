## vue为了解偶， 将逻辑拆分成两个模块
- 运行时： 核心，不依赖平台的browser test 小程序 app canvas 靠的就是虚拟dom
- 针对不同平台的运行时 vue就针对不同浏览器的平台
- 渲染器