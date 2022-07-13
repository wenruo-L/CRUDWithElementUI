// require.context(dir,deep,matching)
// 参数：1. 目录  2. 是否加载子目录  3. 加载的正则匹配
// const importFun = require.context('./utils', false, /\.vue$/)

// export default {
//     install(app) {
//         console.log('importFun.keys()', importFun.keys());
//         importFun.keys().forEach(key => {
//             // 导入组件
//             const component = importFun(key).default
//             // 注册组件
//             app.component(component.name, component)
//         })
//     }
// }

import pInput from '@/utils/CURD/p-components/p-input'

export default {
    install(vue) {
        vue.component('p-input', pInput)
    }
}