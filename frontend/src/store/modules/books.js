import BookAPI from '@/api/books'

const state = {
  books: [],
  currentBook: null,
  loading: false,
  error: null
}

const mutations = {
  SET_BOOKS(state, books) {
    state.books = Array.isArray(books) ? books : []
  },
  SET_CURRENT_BOOK(state, book) {
    state.currentBook = book
  },
  SET_LOADING(state, isLoading) {
    state.loading = isLoading
  },
  SET_ERROR(state, error) {
    state.error = error
  },
  ADD_BOOK(state, book) {
    state.books.unshift(book)
  }
}

const actions = {
  // 获取所有书籍
  async fetchBooks({ commit }, params = {}) {
    commit('SET_LOADING', true)
    try {
      const response = await BookAPI.getAll(params)
      // 确保返回的数据是数组
      const books = Array.isArray(response) ? response : 
                   Array.isArray(response.items) ? response.items : []
      commit('SET_BOOKS', books)
      commit('SET_ERROR', null)
    } catch (error) {
      commit('SET_ERROR', error.message)
      commit('SET_BOOKS', []) // 发生错误时清空书籍列表
      throw error
    } finally {
      commit('SET_LOADING', false)
    }
  },

  // 获取书籍详情
  async fetchBookDetail({ commit }, bookId) {
    commit('SET_LOADING', true)
    try {
      const book = await BookAPI.getDetail(bookId)
      commit('SET_CURRENT_BOOK', book)
      commit('SET_ERROR', null)
    } catch (error) {
      commit('SET_ERROR', error.message)
      commit('SET_CURRENT_BOOK', null) // 发生错误时清空当前书籍
      throw error
    } finally {
      commit('SET_LOADING', false)
    }
  },

  // 推荐新书
  async recommendBook({ commit }, bookData) {
    commit('SET_LOADING', true)
    try {
      const newBook = await BookAPI.recommendBook(bookData)
      commit('ADD_BOOK', newBook)
      commit('SET_ERROR', null)
      return newBook
    } catch (error) {
      commit('SET_ERROR', error.message)
      throw error
    } finally {
      commit('SET_LOADING', false)
    }
  }
}

const getters = {
  recommendedBooks: (state, getters, rootState) => 
    state.books.filter(book => book?.recommender_id === rootState.auth.user?.id)
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}