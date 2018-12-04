export default {
  pageLoaded({ commit }, route) {
    commit('setMode', route);
    commit('setInitialDate', route);
    commit('setStartTime');
    commit('setCurrentTime');
  },
  countdownDone({ commit }) {
    commit('setCurrentTime');
  }
}