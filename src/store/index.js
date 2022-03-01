import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    newUsers: 0,
    mouseEvents: 0,
    mouseLabel: 'Movimientos',
    selectedEvents: '0',
    porcentageEvents: '0',
    userInfo: {},
    plans: {},
  },
  mutations: {
    setClientInfo(state, newValue) {
      state.userInfo = newValue.data;
      const encode = JSON.stringify(newValue.data);
      if (newValue.remember) {
        localStorage.setItem('etrackUser', btoa(encode));
      } else {
        sessionStorage.setItem('etrackUser', btoa(encode));
      }
    },
    setSelectedEvents(state, newValue) {
      state.selectedEvents = newValue.events;
      state.porcentageEvents = newValue.porcentage;
    },
    getClient(state, newValue) {
      axios
        .get(`http://localhost:3000/users/${newValue}`)
        .then((response) => {
          const { data } = response;
          state.userInfo = data;
        })
        .catch((error) => {
          // handle error
          console.log(error);
        })
        .then(() => {
          // always executed
        });
    },
    updateClient(state, newValue) {
      const existLocalStorage = !!localStorage.getItem('etrackUser');
      const existSessionStorage = !!sessionStorage.getItem('etrackUser');
      axios
        .patch(`http://localhost:3000/users/${newValue.id}`, newValue.data)
        .then(() => {
          const user = {
            ...state.userInfo,
            ...newValue.data,
          };
          state.userInfo = user;
          const storageData = JSON.stringify(user);
          localStorage.removeItem('etrackUser');
          sessionStorage.removeItem('etrackUser');
          if (existLocalStorage) {
            localStorage.setItem('etrackUser', btoa(storageData));
          }
          if (existSessionStorage) {
            sessionStorage.setItem('etrackUser', btoa(storageData));
          }
        })
        .catch((error) => {
          // handle error
          console.log(error);
        })
        .then(() => {
          // always executed
        });
    },
    closeSession(state) {
      const decodeLocalStorage = !!localStorage.getItem('etrackUser');
      if (decodeLocalStorage) {
        localStorage.removeItem('etrackUser');
      } else {
        sessionStorage.removeItem('etrackUser');
      }
      state.userInfo = {};
    },
    getUser(state) {
      const decodeLocalStorage = !!localStorage.getItem('etrackUser');
      if (decodeLocalStorage) {
        const decode = localStorage.getItem('etrackUser');
        const decodedUser = atob(decode);
        const user = JSON.parse(decodedUser);
        state.userInfo = user;
      } else {
        const decode = sessionStorage.getItem('etrackUser');
        const decodedUser = atob(decode);
        const user = JSON.parse(decodedUser);
        state.userInfo = user;
      }
    },
    getPlans(state, newValue) {
      axios
        .get(`http://localhost:3000/plans/${newValue}`)
        .then((response) => {
          const { data } = response;
          state.plans = data;
        })
        .catch((error) => {
          // handle error
          console.log(error);
        })
        .then(() => {
          // always executed
        });
    },
  },
  actions: {
    setClientInfo({ commit }, newValue) {
      commit('setClientInfo', newValue);
    },
    setSelectedEvents({ commit }, newValue) {
      commit('setSelectedEvents', newValue);
    },
    getUser({ commit }) {
      commit('getUser');
    },
    closeSession({ commit }) {
      commit('closeSession');
    },
    getClient({ commit }, newValue) {
      commit('getClient', newValue);
    },
    updateClient({ commit }, newValue) {
      commit('updateClient', newValue);
    },
    getPlans({ commit }, newValue) {
      commit('getPlans', newValue);
    },
  },
  modules: {
  },
});
