/**
 * The file that organizes all the store elements. I've formatted the
 * events information as a separat module, so that's all we need to
 * load
 * 
 * @author Mike W. Leavitt
 * @since 1.0.0
 */

import Vue from 'vue';
import Vuex from 'vuex';
import {events} from './modules/events';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    events
  }
});
