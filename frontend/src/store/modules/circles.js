import CircleAPI from '@/api/circles'

const state = {
  currentCircle: null,
  members: [],
  loading: false,
  error: null,
  allCircles: [],
  students: []
}

const mutations = {
  SET_CIRCLE(state, circle) {
    state.currentCircle = circle
  },
  SET_MEMBERS(state, members) {
    state.members = members
  },
  ADD_MEMBER(state, member) {
    state.members.push(member)
  },
  SET_LOADING(state, isLoading) {
    state.loading = isLoading
  },
  SET_ERROR(state, error) {
    state.error = error
  },
  SET_ALL_CIRCLES(state, circles) {
    state.allCircles = circles
  },
  SET_STUDENTS(state, students) {
    state.students = students
  }
}

const actions = {
  // 获取我的圈子
  async fetchMyCircle({ commit }) {
    commit('SET_LOADING', true)
    try {
      const circle = await CircleAPI.getMyCircle()
      commit('SET_CIRCLE', circle)
      
      // 获取成员列表
      const members = await CircleAPI.getMembers(circle.id)
      commit('SET_MEMBERS', members)
      
      commit('SET_ERROR', null)
    } catch (error) {
      commit('SET_ERROR', error.message)
    } finally {
      commit('SET_LOADING', false)
    }
  },

  // 添加成员
  async addMember({ commit }, { circleId, userId }) {
    commit('SET_LOADING', true)
    try {
      await CircleAPI.addMember(circleId, userId)
      const members = await CircleAPI.getMembers(circleId)
      commit('SET_MEMBERS', members)
      commit('SET_ERROR', null)
    } catch (error) {
      commit('SET_ERROR', error.message)
      throw error
    } finally {
      commit('SET_LOADING', false)
    }
  },

  // 获取所有圈子
  async fetchAllCircles({ commit }) {
    commit('SET_LOADING', true)
    try {
      const circles = await CircleAPI.getAll()
      commit('SET_ALL_CIRCLES', circles)
      commit('SET_ERROR', null)
    } catch (error) {
      commit('SET_ERROR', error.message)
    } finally {
      commit('SET_LOADING', false)
    }
  },

  // 通过 mentorId 获取学生列表
  async fetchStudentsByMentorId({ commit, rootState }) {
    commit('SET_LOADING', true)
    try {
      const mentorId = rootState.auth.user.id
      const students = await require('@/api/users').default.getStudents(mentorId)
      commit('SET_STUDENTS', students)
      commit('SET_ERROR', null)
    } catch (error) {
      commit('SET_ERROR', error.message)
    } finally {
      commit('SET_LOADING', false)
    }
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters: {
    studentsCount: (state) => state.students.length
  }
}