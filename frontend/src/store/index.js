import { createStore } from 'vuex'
import createPersistedState from 'vuex-persistedstate'
import auth from './modules/auth'
import books from './modules/books'
import circles from './modules/circles'
import posts from './modules/posts'
import notifications from './modules/notifications'
import messages from './modules/messages'

export default createStore({
  modules: {
    auth,
    books,
    circles,
    posts,
    notifications,
    messages
  },
  plugins: [
    // 持久化auth状态到localStorage
    createPersistedState({
      paths: ['auth.token', 'auth.user'],
      key: 'moyun-reading'
    })
  ],
  strict: process.env.NODE_ENV !== 'production'
})