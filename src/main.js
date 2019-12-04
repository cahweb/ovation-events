import Vue from 'vue';
import App from './components/App';
import store from './store';

Vue.config.productionTip = false;

new Vue({
  store,
  render: h => h(App),
  created() {
    this.$store.dispatch('events/getShortcodeAtts');
    this.$store.dispatch('events/listEvents');
  },
}).$mount('#vueApp');
