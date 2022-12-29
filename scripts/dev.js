const args = require('minimist')(process.argv.slice(2)) // node scripts/dev.js reactivity -f global
const { build } = require('esbuild')
const path = require('path')
//console.log(args)  // { _: [ 'reactivity' ], f: 'global' }
// minimist解析命令行参数

const target = args._[0] || 'reactivity'
const format = args.f || 'global'

// 开发环境只打包某一个
const pkg = require(path.join(__dirname,  `../packages/${target}/package.json`))

// iife立即执行函数(function(){})()
// cjs node中的模块 module.exports
// esm 浏览器中的 esmodule模块 import
const outputFormat = format.startsWith('global') ? 'iife' : format === 'cjs' ? 'cjs' : 'esm'

const outfile = path.join(__dirname, `../packages/${target}/dist/${target}.${format}.js`)

console.log(outputFormat, outfile, '结果输出')

// 天生支持ts
build({
  entryPoints: [path.join(__dirname, `../packages/${target}/src/index.ts`)],
  outfile,
  bundle: true, // 把所有的包全部打包到一起
  sourcemap: true, 
  format: outputFormat, // 输出的格式
  globalName: pkg.buildOptions?.name, // 全局的名字
  platform: format === 'cjs' ? 'node' : 'browser',
  watch: {  // 监控文件变化
    onRebuild(error) {
      if (error) console.log('rebult~~~~~')
    }
  }
}).then(() => {
  console.log('watching ~~~~~~')
}).catch(err => {
  console.log('err0r =====', err)
})