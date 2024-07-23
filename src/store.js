import { createStore } from 'vuex';
import createPersistedState from 'vuex-persistedstate';

const store = createStore({
  state: {
    token: null,
    tokenTimestamp: null,
  },
  mutations: {
    setToken(state, { token, timestamp }) {
      state.token = token;
      state.tokenTimestamp = timestamp;
    },
    clearToken(state) {
      state.token = null;
      state.tokenTimestamp = null;
    }
  },
  actions: {
    saveToken({ commit }, token) {
      const timestamp = new Date().getTime();
      commit('setToken', { token, timestamp });
    },
    removeToken({ commit }) {
      commit('clearToken');
    },
    checkTokenValidity({ state, dispatch }) {
      const currentTimestamp = new Date().getTime();
      const tokenAge = currentTimestamp - state.tokenTimestamp;
      const tokenExpiry = 24 * 60 * 60 * 1000; 

      if (tokenAge > tokenExpiry) {
        dispatch('removeToken');
      }
    }
  },
  plugins: [
    createPersistedState({
      storage: window.localStorage,
      reducer: (state) => ({
        token: state.token,
        tokenTimestamp: state.tokenTimestamp,
      }),
    }),
  ],
});

export default store;
