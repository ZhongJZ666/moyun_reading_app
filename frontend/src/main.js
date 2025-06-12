import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import '@/assets/css/global.css' // 全局自定义样式

const app = createApp(App)

// 注册Element Plus图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

// 全局配置
app.config.globalProperties.$api = {
  books: {
    getAll: () => store.dispatch('books/fetchBooks')
  }
}

// 错误处理
app.config.errorHandler = (err, vm, info) => {
  console.error('[Global Error]', err, info)
  if (process.env.NODE_ENV === 'development') {
    vm.$message.error(`发生错误: ${err.message}`)
  }
}

app
  .use(store)
  .use(router)
  .use(ElementPlus, { 
    size: 'medium',
    zIndex: 3000
  })
  .mount('#app')

// 开发环境调试
if (process.env.NODE_ENV === 'development') {
  window.__APP__ = app
}