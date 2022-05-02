import Vue from 'vue';
import VueSweetalert2 from 'vue-sweetalert2';
import VueFriendlyIframe from 'vue-friendly-iframe';
import VueApexCharts from 'vue-apexcharts';
import VueIframe from 'vue-iframes';
import VuePdfApp from 'vue-pdf-app';
import App from './App.vue';
import router from './router';
import store from './store';
import 'vue-pdf-app/dist/icons/main.css';
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

Vue.component('vue-pdf-app', VuePdfApp);

Vue.use(VueApexCharts);

Vue.component('apexchart', VueApexCharts);

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
