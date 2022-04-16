import { createStore } from 'vuex';
import mutations from './mutations';
import actions from './actions';
import state from './state';
import getters from './getters';

export default createStore({
  state,
  getters,
  mutations,
  actions,
});
