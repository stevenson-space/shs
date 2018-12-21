export default {
  pageLoaded({ commit }, route) {
    commit('setMode', route);
    commit('setUrlDate', route);
    commit('setStartTime');
    commit('setCurrentTime');
  },
  countdownDone({ commit }) {
    commit('setCurrentTime');
  }
}