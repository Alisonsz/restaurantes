import { createStore } from 'vuex';
import createPersistedState from 'vuex-persistedstate';
import axios from 'axios';

const store = createStore({
  state: {
    token: null,
    tokenTimestamp: null,
    navbarData: null,
    sidebarData: null,
  },
  mutations: {
    setToken(state, { token, timestamp }) {
      state.token = token;
      state.tokenTimestamp = timestamp;
    },
    clearToken(state) {
      state.token = null;
      state.tokenTimestamp = null;
    },
    setNavbarAndSidebarData(state, data) {
      state.navbarData = {
        notifications: 4, // Se for fixo
        open: data.is_open,
        time: data.is_open
          ? `${data.opening_time.split(':')[0]}h às ${data.closing_time.split(':')[0]}h`
          : `${data.opening_time.split(':')[0]}h`,
        preparation: data.is_open ? `${data.status === 1 ? 'Ajustado' : data.status === 2 ? 'Pausado' : 'Padrão'} (${data.total_preparation_time} min)` : '',
        preparationStatus: data.status === 1 ? 'adjusted' : data.status === 2 ? 'paused' : 'default'
      };
      state.sidebarData = {
        logo: data.logo_url,
        company: data.restaurant_name,
        address: data.address,
      };
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
      const tokenExpiry = 24 * 60 * 60 * 1000; // 24 horas

      if (tokenAge > tokenExpiry) {
        dispatch('removeToken');
      }
    },
    async fetchNavbarAndSidebarData({ commit, state }) {
      try {
        const response = await axios.get('https://api.prattuapp.com.br/api/restaurants/1/navbar-data', {
          headers: {
            Authorization: `Bearer ${state.token}`
          }
        });
        commit('setNavbarAndSidebarData', response.data);
      } catch (error) {
        console.error('Erro ao buscar navbar e sidebar data:', error);
      }
    },
    async preloadData({ dispatch }) {
      await dispatch('fetchNavbarAndSidebarData');
    }
  },
  plugins: [
    createPersistedState({
      storage: window.localStorage,
      reducer: (state) => ({
        token: state.token,
        tokenTimestamp: state.tokenTimestamp,
        navbarData: state.navbarData,
        sidebarData: state.sidebarData,
      }),
    }),
  ],
});

export default store;
