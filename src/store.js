import { createStore } from 'vuex';
import createPersistedState from 'vuex-persistedstate';
import axios from 'axios';

const store = createStore({
  state: {
    token: null,
    tokenTimestamp: null,
    navbarData: null,
    sidebarData: null,
    restaurantId: null,
    menus: [], // Para armazenar os menus
    items: {}, // Para armazenar os itens dos menus
    crossSellItems: [], // Para armazenar os itens de cross-sell
    categories: [], // Para armazenar as categorias gerais
    formCategories: [], // Para armazenar as categorias para o formulário
    formComplements: [], // Para armazenar os complementos para o formulário
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
        notifications: 4,
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
    },
    setRestaurantId(state, restaurantId) {
      state.restaurantId = restaurantId;
    },
    setMenusAndItems(state, { menus, items, crossSellItems }) {
      state.menus = menus;
      state.items = items;
      state.crossSellItems = crossSellItems;
    },
    setCategories(state, categories) {
      state.categories = categories;
    },
    setFormCategories(state, formCategories) {
      state.formCategories = formCategories;
    },
    setFormComplements(state, formComplements) {
      state.formComplements = formComplements;
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
    async fetchRestaurantId({ commit, state }) {
      try {
        const response = await axios.get('https://api.prattuapp.com.br/api/users/me', {
          headers: {
            Authorization: `Bearer ${state.token}`
          }
        });
        commit('setRestaurantId', response.data.restaurant_id);
      } catch (error) {
        console.error('Erro ao obter o restaurant_id:', error);
      }
    },
    async fetchMenusAndItems({ commit, state }) {
      try {
        const response = await axios.get(`https://api.prattuapp.com.br/api/menu-data?restaurant_id=${state.restaurantId}`, {
          headers: {
            Authorization: `Bearer ${state.token}`
          }
        });
        commit('setMenusAndItems', {
          menus: response.data.menus,
          items: response.data.items,
          crossSellItems: Object.values(response.data.crossSellItems),
        });
        commit('setCategories', response.data.categories); // Armazena as categorias gerais no state
      } catch (error) {
        console.error('Erro ao buscar menus e itens:', error);
      }
    },
    async fetchFormCategoriesAndComplements({ commit, state }) {
      try {
        // Requisição para buscar categorias para o formulário
        const responseCategories = await axios.get(
          `https://api.prattuapp.com.br/api/category-products?restaurant_id=${state.restaurantId}`,
          { headers: { Authorization: `Bearer ${state.token}` } }
        );
        commit('setFormCategories', responseCategories.data.data); // Armazenando os dados de categorias do formulário

        // Requisição para buscar complementos para o formulário
        const responseComplements = await axios.get(
          `https://api.prattuapp.com.br/api/components?restaurant_id=${state.restaurantId}`,
          { headers: { Authorization: `Bearer ${state.token}` } }
        );
        commit('setFormComplements', responseComplements.data.data); // Armazenando os dados de complementos do formulário
      } catch (error) {
        console.error('Erro ao buscar categorias e complementos para o formulário:', error);
      }
    },
    async preloadData({ dispatch }) {
      await dispatch('fetchNavbarAndSidebarData');
      await dispatch('fetchRestaurantId');
      await dispatch('fetchMenusAndItems');
      await dispatch('fetchFormCategoriesAndComplements'); // Carregar categorias e complementos para o formulário
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
        restaurantId: state.restaurantId,
        menus: state.menus,
        items: state.items,
        crossSellItems: state.crossSellItems,
        categories: state.categories, // Persiste as categorias gerais
        formCategories: state.formCategories, // Persiste as categorias do formulário
        formComplements: state.formComplements, // Persiste os complementos do formulário
      }),
    }),
  ],
});

export default store;
