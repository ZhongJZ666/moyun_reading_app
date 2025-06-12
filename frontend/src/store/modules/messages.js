import { http } from '@/api/http'

export default {
  namespaced: true,
  state: {
    messages: [],
    unreadCount: 0,
    loading: false,
    currentChat: null
  },
  mutations: {
    SET_MESSAGES(state, messages) {
      state.messages = messages
    },
    ADD_MESSAGE(state, message) {
      state.messages.push(message)
      if (message.senderId !== state.currentUser?.id) {
        state.unreadCount++
      }
    },
    MARK_AS_READ(state, messageId) {
      const message = state.messages.find(m => m.id === messageId)
      if (message && !message.read) {
        message.read = true
        state.unreadCount--
      }
    },
    MARK_ALL_AS_READ(state) {
      state.messages.forEach(m => m.read = true)
      state.unreadCount = 0
    },
    DELETE_MESSAGE(state, messageId) {
      const index = state.messages.findIndex(m => m.id === messageId)
      if (index !== -1) {
        const message = state.messages[index]
        if (!message.read) {
          state.unreadCount--
        }
        state.messages.splice(index, 1)
      }
    },
    SET_UNREAD_COUNT(state, count) {
      state.unreadCount = count
    },
    SET_LOADING(state, loading) {
      state.loading = loading
    },
    SET_CURRENT_CHAT(state, chat) {
      state.currentChat = chat
    }
  },
  actions: {
    async fetchMessages({ commit }, { page = 1, size = 20, type } = {}) {
      commit('SET_LOADING', true)
      try {
        const response = await http.get('/api/messages', {
          params: { page, size, type }
        })
        commit('SET_MESSAGES', response.data.items)
        return response.data
      } finally {
        commit('SET_LOADING', false)
      }
    },
    async fetchChatMessages({ commit }, { userId, page = 1, size = 20 } = {}) {
      commit('SET_LOADING', true)
      try {
        const response = await http.get(`/api/messages/chat/${userId}`, {
          params: { page, size }
        })
        commit('SET_MESSAGES', response.data.items)
        return response.data
      } finally {
        commit('SET_LOADING', false)
      }
    },
    async sendMessage({ commit }, { receiverId, content }) {
      const response = await http.post('/api/messages', {
        receiverId,
        content
      })
      commit('ADD_MESSAGE', response.data)
      return response.data
    },
    async markAsRead({ commit }, messageId) {
      await http.put(`/api/messages/${messageId}/read`)
      commit('MARK_AS_READ', messageId)
    },
    async markAllAsRead({ commit }) {
      await http.put('/api/messages/read-all')
      commit('MARK_ALL_AS_READ')
    },
    async deleteMessage({ commit }, messageId) {
      await http.delete(`/api/messages/${messageId}`)
      commit('DELETE_MESSAGE', messageId)
    },
    async clearAll({ commit }) {
      await http.delete('/api/messages')
      commit('SET_MESSAGES', [])
      commit('SET_UNREAD_COUNT', 0)
    },
    async fetchUnreadCount({ commit }) {
      const response = await http.get('/api/messages/unread/count')
      commit('SET_UNREAD_COUNT', response.data.count)
    }
  }
} 