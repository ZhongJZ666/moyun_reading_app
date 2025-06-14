import { createRouter, createWebHistory } from 'vue-router'
import store from '@/store'
import { clearAuthData } from '@/api/utils'

// 路由懒加载
const loadView = (view) => () => import(`@/views/${view}.vue`)

// 路由配置
const routes = [
  {
    path: '/',
    name: 'Home',
    component: loadView('home/Home'),
    meta: { requiresAuth: true }
  },
  {
    path: '/login',
    name: 'Login',
    component: loadView('auth/Login'),
    meta: { guestOnly: true }
  },
  {
    path: '/register',
    name: 'Register',
    component: loadView('auth/Register'),
    meta: { guestOnly: true }
  },
  // 导师路由
  {
    path: '/mentor',
    name: 'MentorDashboard',
    component: loadView('mentor/MentorDashboard'),
    meta: { requiresAuth: true, roles: ['mentor'] }
  },
  // 学生路由
  {
    path: '/student',
    name: 'StudentDashboard',
    component: loadView('student/StudentDashboard'),
    meta: { requiresAuth: true, roles: ['student'] }
  },
  // 管理员路由
  {
    path: '/admin',
    name: 'AdminDashboard',
    component: loadView('admin/AdminDashboard'),
    meta: { requiresAuth: true, roles: ['admin'] }
  },
  // 书籍相关路由
  {
    path: '/books',
    name: 'BookList',
    component: loadView('books/BookList'),
    meta: { requiresAuth: true }
  },
  {
    path: '/books/:id',
    name: 'BookDetail',
    component: loadView('books/BookDetail'),
    meta: { requiresAuth: true }
  },
  {
    path: '/books/content/:id',
    name: 'BookContent',
    component: loadView('books/BookContent'),
    meta: { requiresAuth: true }
  },
  {
    path: '/recommend',
    name: 'RecommendBook',
    component: loadView('books/Recommend'),
    meta: { requiresAuth: true, roles: ['mentor', 'admin'] }
  },
  {
    path: '/my-books',
    name: 'MyBooks',
    component: () => import('@/views/books/MyBooks.vue'),
    meta: { requiresAuth: true }
  },
  // 圈子相关路由
  {
    path: '/my-circle',
    name: 'MyCircle',
    component: loadView('circles/MyCircle'),
    meta: { requiresAuth: true }
  },
  // 帖子相关路由
  {
    path: '/posts/create',
    name: 'CreatePost',
    component: loadView('posts/CreatePost'),
    meta: { requiresAuth: true }
  },
  {
    path: '/posts/:id',
    name: 'PostDetail',
    component: loadView('posts/PostDetail'),
    meta: { requiresAuth: true }
  },
  // 通知相关路由
  {
    path: '/notifications',
    name: 'Notifications',
    component: () => import('@/components/notification/NotificationList.vue'),
    meta: { requiresAuth: true }
  },
  // 消息相关路由
  {
    path: '/messages',
    name: 'Messages',
    component: () => import('@/views/message/MessageList.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/messages/:id',
    name: 'MessageChat',
    component: () => import('@/views/message/MessageChat.vue'),
    meta: { requiresAuth: true }
  },
  // 个人资料
  {
    path: '/profile',
    name: 'MyProfile',
    component: loadView('profile/MyProfile'),
    meta: { requiresAuth: true }
  },
  // 404处理
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: loadView('errors/NotFound')
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    return savedPosition || { x: 0, y: 0 }
  }
})

// 全局前置守卫
router.beforeEach(async (to, from, next) => {
  // 检查认证状态
  const isAuthenticated = store.getters['auth/isAuthenticated']
  const currentUser = store.state.auth.user
  const token = localStorage.getItem('token')

  // 需要登录但未登录
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!token) {
      next({ name: 'Login', query: { redirect: to.fullPath } })
      return
    }

    // 如果有token但未获取用户信息，尝试获取
    if (!isAuthenticated) {
      try {
        await store.dispatch('auth/checkAuth')
      } catch (error) {
        clearAuthData()
        next({ name: 'Login', query: { redirect: to.fullPath } })
        return
      }
    }
  }

  // 仅游客访问但已登录
  if (to.matched.some(record => record.meta.guestOnly) && isAuthenticated) {
    next({ name: 'Home' })
    return
  }

  // 角色权限检查
  if (to.matched.some(record => record.meta.roles)) {
    const hasRole = to.meta.roles.includes(currentUser?.role)
    if (!hasRole) {
      next({ name: 'Home' })
      return
    }
  }

  next()
})

// 全局后置钩子
router.afterEach((to) => {
  // 页面标题
  document.title = to.meta.title 
    ? `${to.meta.title} | 墨韵读书会` 
    : '墨韵读书会'
})

export default router