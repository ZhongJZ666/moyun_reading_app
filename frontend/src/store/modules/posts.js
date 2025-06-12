import PostAPI from '@/api/posts'

const state = {
  posts: [],
  currentPost: null,
  loading: false,
  error: null
}

const mutations = {
  SET_POSTS(state, posts) {
    state.posts = posts
  },
  SET_CURRENT_POST(state, post) {
    state.currentPost = post
  },
  ADD_POST(state, post) {
    state.posts.unshift(post)
  },
  SET_LOADING(state, isLoading) {
    state.loading = isLoading
  },
  SET_ERROR(state, error) {
    state.error = error
  }
}

const actions = {
  // 获取圈子帖子
  async fetchCirclePosts({ commit }, circleId) {
    commit('SET_LOADING', true)
    try {
      const posts = await PostAPI.getByCircle(circleId)
      commit('SET_POSTS', posts)
      commit('SET_ERROR', null)
    } catch (error) {
      commit('SET_ERROR', error.message)
    } finally {
      commit('SET_LOADING', false)
    }
  },

  // 创建帖子
  async createPost({ commit }, postData) {
    commit('SET_LOADING', true)
    try {
      const newPost = await PostAPI.create(postData)
      commit('ADD_POST', newPost)
      commit('SET_ERROR', null)
      return newPost
    } catch (error) {
      commit('SET_ERROR', error.message)
      throw error
    } finally {
      commit('SET_LOADING', false)
    }
  },

  // 获取帖子详情
  async fetchPostDetail({ commit }, postId) {
    commit('SET_LOADING', true)
    try {
      const post = await PostAPI.getDetail(postId)
      commit('SET_CURRENT_POST', post)
      commit('SET_ERROR', null)
    } catch (error) {
      commit('SET_ERROR', error.message)
    } finally {
      commit('SET_LOADING', false)
    }
  },

  // 获取某本书的相关帖子
  async fetchRelatedPosts({ commit }, bookId) {
    commit('SET_LOADING', true)
    try {
      const posts = await PostAPI.getByBook(bookId)
      commit('SET_POSTS', posts)
      commit('SET_ERROR', null)
    } catch (error) {
      commit('SET_ERROR', error.message)
      commit('SET_POSTS', []) // 发生错误时清空帖子列表
    } finally {
      commit('SET_LOADING', false)
    }
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}