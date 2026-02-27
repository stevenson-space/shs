import { defineStore } from 'pinia';
import { ref } from 'vue';

export default defineStore('authentication', () => {
  const authenticated = ref(false);

  function setAuthenticated(value: boolean): void {
    authenticated.value = value;
    // explicitly do not use local storage for handling authentication
    // google will automatically perform token refreshes/sign ins
    // localStorage.isAuthenticated = authenticated;
  }

  return { authenticated, setAuthenticated };
});
