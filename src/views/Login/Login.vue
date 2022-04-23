<template>
  <div v-if="loginFailed">
    <plain-header title="Login failed" />Unfortunately, we were unable to
    authorize your account. The login prompt may have been closed
    prematurely, or the account used to log in was not a valid
    <i>students.d125.org</i> account.
    <br />Please go back and try again. If
    the problem persists, contact blahblah.
  </div>
</template>

<script>
import useAuthenticationStore from '@/stores/authentication';
import { mapActions, mapState } from 'pinia';
import PlainHeader from '@/components/PlainHeader.vue';
import CardContainer from '@/components/CardContainer.vue';
import ClientOAuth2 from 'client-oauth2';
import queryString from 'query-string';

export default {
  components: { PlainHeader, CardContainer },
  data() {
    return {
      to: this.$route.query.to, // target destination
      from: this.$route.query.from, // previous page
      loginFailed: false, // login failed (false by default)
      // google client ID
      clientID:
        '176463123594-o7fa9nss5jp84rcabsiso7131717ujm7.apps.googleusercontent.com',
      hostedDomain: 'students.d125.org', // hint domain,
      authEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
      userEndpoint: 'https://www.googleapis.com/oauth2/v2/userinfo',
    };
  },
  computed: {
    // mapState({ isAuthenticated: (state) => state.isAuthenticated }),
    ...mapState(useAuthenticationStore, ['authenticated']),
  },
  methods: {
    ...mapActions(useAuthenticationStore, ['setAuthenticated']),
  },
  async mounted() {
    // this page is loaded when a) the user is trying to login,
    // or b) google as redirected us back and the hash contains our state and access token
    const hash = queryString.parse(window.location.hash);
    // we got redireced by google, use the auth token to grab the user's email and verify
    if (hash.state && hash.access_token) {
      // fetch the user endpoint, verify the email, and redirect if it checks out
      const response = await fetch(`${this.userEndpoint}?oauth_token=${hash.access_token}`);
      if (response.status === 200) {
        const user = await response.json();
        // check their info
        if (
          user.id
          && user.email
          && user.hd
          && user.hd === this.hostedDomain
        ) {
          this.setAuthenticated(true); // set auth to true
          this.$router.replace({
            name: hash.state, // redirect to the destination indicated by state
          });
        }
      } else {
        this.loginFailed = true;
        this.setAuthenticated(false);
      }
    } else {
      const googleAuth = new ClientOAuth2({
        clientId: this.clientID, // google client ID for oauth
        clientSecret: process.env.VUE_APP_GOOGLE_OAUTH_CLIENT_SECRET,
        authorizationUri: this.authEndpoint, // google endpoint
        redirectUri: window.location.origin + this.$route.path, // redirect to current URL
        scopes: ['email'], // really only need email access
        state: this.to, // get our current destination back via the state parameter
      });
      // go to auth URI, first have to manually add the ?hd parameter though
      const authURI = googleAuth.token.getUri({
        query: { hd: this.hostedDomain },
      });
      window.location.href = authURI;
    }
  },
};
</script>

<style lang="sass" scoped></style>
