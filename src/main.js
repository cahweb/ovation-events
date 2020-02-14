/**
 * The main Vue file. Responsible for creating the Vue instance and
 * mounting it to the appropriate <div>
 * 
 * @author Mike W. Leavitt
 * @version 1.0.0
 */

import Vue from 'vue';
import App from './components/App';
import store from './store';

//FontAwesome stuff
import {FontAwesomeIcon} from '@fortawesome/vue-fontawesome';

Vue.component('fa-icon', FontAwesomeIcon);

Vue.config.productionTip = false;

new Vue({
  store,
  render: h => h(App),
  created() {
    this.$store.dispatch('events/getFormatData');
  },
  mounted() {
    //this.$store.dispatch('events/listEvents');
  }
}).$mount('#vueApp');
