import Vue from 'vue';
import VueSweetalert2 from 'vue-sweetalert2';
import VueFriendlyIframe from 'vue-friendly-iframe';
import VueIframe from 'vue-iframes';
import App from './App.vue';
import router from './router';
import store from './store';
import './assets/tailwind.css';
import 'sweetalert2/dist/sweetalert2.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

const options = {
  confirmButtonColor: '#14329B',
  cancelButtonColor: '#ff7674',
};

Vue.use(VueSweetalert2, options);

Vue.use(VueFriendlyIframe);

Vue.use(VueIframe);

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');