import { defineStore } from 'pinia';

interface State {
  authenticated: boolean,
}

export default defineStore('authentication', {
  state: (): State => ({
    authenticated: false,
  }),
  actions: {
    setAuthenticated(value: boolean): void {
      this.authenticated = value;
      // explicitly do not use local storage for handling authentication
      // google will automatically perform token refreshes/sign ins
      // localStorage.isAuthenticated = authenticated;
    },
  },
});
