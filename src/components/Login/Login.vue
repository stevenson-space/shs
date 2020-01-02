<template>
	<div v-if="loginFailed">
		<plain-header title="Login failed" />
		Unfortunately, we were unable to authorize your account. Some possible
		causes may include:

		<ul>
			<li>The login prompt was closed.</li>
			<li>
				The account used to login was not a valid
				<i>students.d125.org</i> account.
			</li>
		</ul>

		Please go back and try again. If the problem persists, contact blahblah.
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
			loginFailed: false // login failed (false by default)
		};
	},
	computed: mapState({ isAuthenticated: state => state.isAuthenticated }),
	methods: {
		// check if a user is a) authenticated and b) part of the students.d125.org domain
		checkUser(user) {
			// user should not be null, be signed in, and have a hosted domain on students.d125.org
			if (
				user &&
				user.isSignedIn() &&
				user.getHostedDomain() == "illinois.edu"
			)
				// set authentication to true
				this.setAuthenticated(true);
			// set authentication to false
			else this.setAuthenticated(false);
		},
		...mapMutations(["setAuthenticated"])
	},
	mounted() {
		// outer reference to this Vue component, needed to register callbacks with the google API
		const self = this;
		gapi.load("auth2", function() {
			// initialize google auth2 interface
			let auth2 = gapi.auth2.init({
				client_id:
					"541927545357-ui3ujp7i0rh7ni44109ca0r9fvg4tpeo.apps.googleusercontent.com",
				fetch_basic_profile: true, // include email (the thing we need to check)
				ux_mode: "popup", // redirect to a google screening page
				hosted_domain: "illinois.edu" // UI hint for which emails to use
				//redirect_uri: "http://localhost:8080/" + self.to
			});

			// register a listener for when we get a new user (ie signed in)
			auth2.currentUser.listen(user => self.checkUser(user));

			// if we're not signed in, then prompt the user
			if (!auth2.isSignedIn.get()) {
				auth2.signIn().then(
					response => {}, // ignore the response, since the listener will handle it
					error => {
						// on error, just set loginFailed to true
						self.loginFailed = true;
					}
				);
			}
		});
	},
	watch: {
		isAuthenticated(authenticated) {
			// when we become authenticated, we can redirect to the target page
			if (authenticated) this.$router.replace({ name: this.to });
		}
	}
};
</script>

<style lang="sass" scoped></style>
