<template>
  <div v-if="loginFailed">
    <plain-header title="Login failed" />Unfortunately, we were unable to authorize your account. The login
    prompt may have been closed prematurely, or the account used to log in
    was not a valid
    <i>students.d125.org</i> account.
    <br />Please go back and try again. If the problem persists, contact blahblah.
  </div>
</template>

<script>
import { mapMutations, mapState } from "vuex";
import PlainHeader from "common/PlainHeader.vue";
import CardContainer from "common/CardContainer.vue";

export default {
  components: { PlainHeader, CardContainer },
  data() {
    return {
      to: this.$route.query.to, // target destination
      from: this.$route.query.from, // previous page
      loginFailed: false, // login failed (false by default)
      googleClientID:
        "541927545357-ui3ujp7i0rh7ni44109ca0r9fvg4tpeo.apps.googleusercontent.com",
      hostedDomain: "students.d125.org"
    };
  },
  computed: mapState({ isAuthenticated: state => state.isAuthenticated }),
  methods: {
    ...mapMutations(["setAuthenticated"])
  },
  mounted() {
    // outer reference to this Vue component, needed to register callbacks with the google API
    const self = this;
    gapi.load("auth2", function() {
      // initialize google auth2 interface
      let auth2 = gapi.auth2.init({
        client_id: self.googleClientID,
        fetch_basic_profile: true, // include email (the thing we need to check)
        ux_mode: "redirect", // redirect to a google screening page
        hosted_domain: self.hostedDomain // UI hint for which emails to use
      });
      // upon initialization of the auth2 interface
      auth2.then(
        auth2 => {
          // if we're not signed in, then prompt the user to sign in
          // this will redirect away from this page, losing all state
          if (!auth2.isSignedIn.get()) {
            auth2
              .signIn({
                // google will give us the state back in the authorization response,
                // so we pass over the user's target
                // note that this parameter is actually hidden from the google documentation
                state: self.to
              })
              .then(
                response => {}, // we will never get a response, since the authentication is redirected
                error => {
                  // if something gets messed up, just set login failed to true
                  self.loginFailed = true;
                }
              );
          }
          // if the user is already signed in or redirected back to this page after a successful
          // google sign in, we need to verify the user and then redirect to the target page
          else {
            let user = auth2.currentUser.get();
            // check that user exists, is signed in, and has the correct domain
            if (
              user &&
              user.isSignedIn() &&
              user.getHostedDomain() == self.hostedDomain
            ) {
              // set authentication to true
              self.setAuthenticated(true);
              // fetch the authentication response, containing the state we passed it
              let authResponse = auth2.currentUser.get().getAuthResponse(true);
              // if the user was already signed in, we can just use the query parameter given to us via
              // the router redirect. if the user had to be redirected to google to sign in,
              // this will be undefined, and we will use the state variable given back to us by google
              self.$router.replace({
                name: self.to || authResponse.state
              });
            }
            // otherwise, if the user's credentials did not check out,
            // set authentication to false and show the login failed page
            else {
              self.setAuthenticated(false);
              self.loginFailed = true;
            }
          }
        },
        // uh this should never happen
        err => {
          self.loginFailed = true;
        }
      );
    });
  }
};
</script>

<style lang="sass" scoped></style>
