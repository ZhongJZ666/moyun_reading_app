import AuthAPI from '@/api/auth';
import { setAuthData, clearAuthData } from '@/api/utils';

const state = {
  user: null,
  token: localStorage.getItem('token') || null,
  status: {
    loggedIn: !!localStorage.getItem('token')
  }
};

const getters = {
  isAuthenticated: state => state.status.loggedIn,
  currentUser: state => state.user,
  userRole: state => state.user?.role,
  isMentor: state => state.user?.role === 'mentor'
};

const actions = {
  async login({ commit }, { username, password }) {
    try {
      const user = await AuthAPI.login(username, password);
      commit('loginSuccess', user);
      return Promise.resolve(user);
    } catch (error) {
      commit('loginFailure');
      return Promise.reject(error);
    }
  },

  async logout({ commit }) {
    try {
      await AuthAPI.logout();
    } finally {
      commit('logout');
      clearAuthData();
    }
  },

  async register({ commit }, userData) {
    try {
      const response = await AuthAPI.register(userData);
      commit('registerSuccess');
      return Promise.resolve(response);
    } catch (error) {
      commit('registerFailure');
      return Promise.reject(error);
    }
  },

  async checkAuth({ commit }) {
    try {
      const user = await AuthAPI.getCurrentUser();
      commit('loginSuccess', user);
      return Promise.resolve(user);
    } catch (error) {
      commit('loginFailure');
      clearAuthData();
      return Promise.reject(error);
    }
  }
};

const mutations = {
  loginSuccess(state, user) {
    state.status.loggedIn = true;
    state.user = user;
  },
  loginFailure(state) {
    state.status.loggedIn = false;
    state.user = null;
    state.token = null;
  },
  logout(state) {
    state.status.loggedIn = false;
    state.user = null;
    state.token = null;
  },
  registerSuccess(state) {
    state.status.loggedIn = false;
  },
  registerFailure(state) {
    state.status.loggedIn = false;
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};