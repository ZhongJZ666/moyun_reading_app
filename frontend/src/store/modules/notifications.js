import { http } from '@/api/http'

export default {
  namespaced: true,
  state: {
    notifications: [],
    unreadCount: 0,
    loading: false
  },
  mutations: {
    SET_NOTIFICATIONS(state, notifications) {
      state.notifications = notifications
    },
    ADD_NOTIFICATION(state, notification) {
      state.notifications.unshift(notification)
      state.unreadCount++
    },
    MARK_AS_READ(state, notificationId) {
      const notification = state.notifications.find(n => n.id === notificationId)
      if (notification && !notification.read) {
        notification.read = true
        state.unreadCount--
      }
    },
    MARK_ALL_AS_READ(state) {
      state.notifications.forEach(n => n.read = true)
      state.unreadCount = 0
    },
    DELETE_NOTIFICATION(state, notificationId) {
      const index = state.notifications.findIndex(n => n.id === notificationId)
      if (index !== -1) {
        const notification = state.notifications[index]
        if (!notification.read) {
          state.unreadCount--
        }
        state.notifications.splice(index, 1)
      }
    },
    SET_UNREAD_COUNT(state, count) {
      state.unreadCount = count
    },
    SET_LOADING(state, loading) {
      state.loading = loading
    }
  },
  actions: {
    async fetchNotifications({ commit }, { page = 1, size = 20, type } = {}) {
      commit('SET_LOADING', true)
      try {
        const response = await http.get('/api/notifications', {
          params: { page, size, type }
        })
        commit('SET_NOTIFICATIONS', response.data.items)
        return response.data
      } finally {
        commit('SET_LOADING', false)
      }
    },
    async markAsRead({ commit }, notificationId) {
      await http.put(`/api/notifications/${notificationId}/read`)
      commit('MARK_AS_READ', notificationId)
    },
    async markAllAsRead({ commit }) {
      await http.put('/api/notifications/read-all')
      commit('MARK_ALL_AS_READ')
    },
    async deleteNotification({ commit }, notificationId) {
      await http.delete(`/api/notifications/${notificationId}`)
      commit('DELETE_NOTIFICATION', notificationId)
    },
    async clearAll({ commit }) {
      await http.delete('/api/notifications')
      commit('SET_NOTIFICATIONS', [])
      commit('SET_UNREAD_COUNT', 0)
    },
    async fetchUnreadCount({ commit }) {
      const response = await http.get('/api/notifications/unread/count')
      commit('SET_UNREAD_COUNT', response.data.count)
    }
  }
} 