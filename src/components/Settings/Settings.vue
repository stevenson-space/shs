<template>
	<div class="settings">
		<div class="hamburger-menu" @click="showSidenav = true">
			<font-awesome-icon :icon="icons.faBars" />
		</div>

		<div
			class="sidenav-background"
			:class="{ show: showSidenav }"
			@click="showSidenav = false"
		/>
		<div class="sidenav" :class="{ show: showSidenav }">
			<div class="close-arrow" @click="showSidenav = false">
				<font-awesome-icon :icon="icons.faArrowLeft" />
			</div>

			<div class="title">
				<font-awesome-icon :icon="icons.faCog" /> Settings
			</div>

			<a
				v-for="(item, index) in sidenavItems"
				:key="item.text"
				class="link"
				:href="item.link"
				:class="{ selected: index == selectedLinkIndex }"
				@click="showSidenav = false"
			>
				<font-awesome-icon
					:icon="item.icon"
					class="icon"
					v-bind="item.iconProps || {}"
					fixed-width
				/>
				<span class="text">{{ item.text }}</span>
			</a>
		</div>

		<div class="main">
			<home-link class="home-link" />

			<general id="general" />
			<schedules id="schedules" />
			<transfer id="transfer" />
			<contact id="contact" />
			<privacy id="privacy" />

			<div
				class="extra-space"
				:style="{ height: `${extraSpaceHeight}px` }"
			/>
		</div>
	</div>
</template>

<script>
import FontAwesomeIcon from "@fortawesome/vue-fontawesome";
import {
	faCog,
	faBars,
	faArrowLeft,
	faListAlt,
	faExchangeAlt,
	faUserCog,
	faLock,
	faAd,
	faAddressCard
} from "@fortawesome/free-solid-svg-icons";

import HomeLink from "common/HomeLink.vue";
import General from "./General.vue";
import Schedules from "./Schedules.vue";
import Transfer from "./Transfer.vue";
import Privacy from "./Privacy.vue";
import Contact from "./Contact.vue";

const sidenavItems = [
	{ text: "General", link: "#general", icon: faUserCog },
	{ text: "Schedules", link: "#schedules", icon: faListAlt },
	{
		text: "Transfer",
		link: "#transfer",
		icon: faExchangeAlt,
		iconProps: { rotation: 90 }
	},
	{
		text: "Contact",
		link: "#contact",
		icon: faAddressCard
	},
	{
		text: "Privacy Policy",
		link: "#privacy",
		icon: faLock
	}
];

export default {
	components: {
		FontAwesomeIcon,
		HomeLink,
		General,
		Schedules,
		Transfer,
		Privacy,
		Contact
	},
	data() {
		return {
			icons: {
				faCog,
				faBars,
				faArrowLeft
			},
			sidenavItems,
			showSidenav: false,
			selectedLinkIndex: 0,
			scrollListener: null,
			extraSpaceHeight: window.innerHeight // ensure that the last section is scrollable to the top (will be adjusted in mounted())
		};
	},
	created() {
		this.scrollListener = () => {
			const scrollY = window.scrollY + 100; // +100 effectively moves the threshold to 100px below the top
			sidenavItems.forEach((sidenavItem, index) => {
				const element = document.querySelector(sidenavItem.link);
				if (scrollY > element.offsetTop) {
					// don't need to check if less than bottom of section, because next pass through for loop will overwrite selectedLinkIndex
					this.selectedLinkIndex = index;
				}
			});
		};

		window.addEventListener("scroll", this.scrollListener);
	},
	mounted() {
		const lastSection = document.querySelector(
			sidenavItems[sidenavItems.length - 1].link
		);
		let lastSectionHeight = lastSection.getBoundingClientRect().height;
		lastSectionHeight += parseInt(
			window.getComputedStyle(lastSection).getPropertyValue("margin-top")
		);
		lastSectionHeight += parseInt(
			window
				.getComputedStyle(lastSection)
				.getPropertyValue("margin-bottom")
		);
		this.extraSpaceHeight = window.innerHeight - lastSectionHeight;
	},
	destroyed() {
		window.removeEventListener("scroll", this.scrollListener);
	}
};
</script>

<style lang="sass" scoped>
@import 'src/styles/style.sass'

.settings
  --sidenav-width: 325px
  +tablet
    --sidenav-width: 250px
  +mobile
    --sidenav-width: 275px

  .hamburger-menu
    cursor: pointer
    font-size: 1.5em
    padding: 10px
    position: absolute
    left: 10px
    color: var(--color)
    display: none
    +mobile
      display: block

  .sidenav-background
    background-color: rgb(0, 0, 0)
    position: fixed
    top: 0
    left: 0
    width: 100vw
    height: 100vh
    opacity: 0
    z-index: -1
    &.show
      opacity: .65
      z-index: 19

  .sidenav
    width: var(--sidenav-width)
    height: 100vh
    position: fixed
    background-color: var(--background)
    border-right: #ddd solid thin
    transition: transform .2s
    z-index: 20
    +mobile
      transform: translateX(calc(-1 * var(--sidenav-width) - 5px))
      &.show
        transform: translateX(0)

    .close-arrow
      color: var(--color)
      font-size: 1.5em
      padding: 10px 15px
      cursor: pointer
      display: none
      +mobile
        display: inline-block

    .title
      color: var(--color)
      text-align: center
      font-size: 2.25em
      font-weight: bold
      letter-spacing: 1px
      margin-bottom: 10px
      padding: 30px 0
      border-bottom: #ddd solid thin
      +mobile
        padding-top: 5px

    .link
      text-decoration: none
      color: var(--secondary)
      padding: 15px
      padding-left: 70px
      display: block
      +tablet
        padding-left: 35px
      +mobile
        padding-left: 50px
      &.selected
        background-color: rgba(0, 0, 0, .075)

      .icon
        font-size: 1.3em

      .text
        font-size: 1.2em
        margin-left: 25px

  .main
    margin-left: var(--sidenav-width)
    padding-top: 100px
    +mobile
      margin-left: 0

    .home-link
      position: absolute
      right: 20px
      top: 10px
      +mobile
        right: 10px
</style>
