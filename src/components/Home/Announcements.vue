<template>
	<div>
		<div v-for="announcement in announcements" class="announcements">
			<div
				class="announcement"
				:class="{ 'full-screen': fullScreenMode }"
				v-if="!(!announcement.showInFullScreen && fullScreenMode)"
			>
				<div class="container">
					<div class="center" v-html="announcement.text"></div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import Dropdown from "common/Dropdown.vue";

export default {
	components: { Dropdown },
	data() {
		return {
			announcements: [
				{
					text:
						"<b>The login bug when attemping to access textbooks in Safari has been fixed.</b>",
					showInFullScreen: true
				},
				{
					text:
						"Textbooks are now accessible on the documents page by signing in with your <b>students.d125.org</b> email.",
					showInFullScreen: false
				},
				{
					text:
						"Your account details are only used for authentication. No private information, including passwords, will be stored.",
					showInFullScreen: false
				}
			]
		};
	},
	props: {
		fullScreenMode: { type: Boolean, default: false }
	}
};
</script>

<style lang="sass" scoped>
@import 'src/styles/style.sass'

.announcements:nth-child(odd)
	background-color: #f2f2f2
	color: #333
.announcements:nth-child(even)
	background-color: white
	color: #333

.announcement
  padding: 5px
  width: calc(100% - 10px) // subtract 2 * 5px (padding)

  letter-spacing: 1px

  &.full-screen
    font-size: 2.75vh

  .container
    display: flex
    align-items: center
    max-width: $content-width
    margin: auto

  .schedule-select
    &.hidden
      visibility: hidden
    +mobile-small
      display: none

  .center
    flex-grow: 1
    font-size: .9em
</style>
