<template>
  <div>
    <plain-header title="Install" />
    <div class="install-container">
      <div class="install-card">
        <div class="install-content">
          <p class="intro">
            Stevenson Space can be installed as an app on your device for offline functionality.
          </p>

          <section>
            <h2>iPhone or iPad (Safari)</h2>
            <ol>
              <li>Open <strong>stevenson.space</strong> in Safari.</li>
              <li>Tap the <strong>Share</strong> button
                (<font-awesome-icon :icon="icons.faArrowUpFromBracket" />)
                at the bottom or top of the screen.</li>
              <li>Scroll down and tap <strong>Add to Home Screen</strong>.</li>
              <li>Confirm the name (<em>SHS Space</em>) and tap <strong>Add</strong>.</li>
              <li>Ensure <strong>Open as Web App</strong> is selected.</li>
            </ol>
            <p class="note">
              Some iOS browsers, are unable to install web apps. If you don't have
              the option or dont see the "Open as Web App" option, install SHS Space from Safari.
            </p>
          </section>

          <section>
            <h2>Other browsers</h2>
            <p>The above instructions work with most browsers. If you can't get it to work, check the instructions for your browser.</p>
            <ul class="link-list">
              <li>
                <a
                  href="https://support.google.com/chrome/answer/9658361"
                  target="_blank"
                  rel="noreferrer"
                >
                  Google Chrome (Android & desktop)
                  <font-awesome-icon :icon="icons.faArrowUpRightFromSquare" />
                </a>
              </li>
              <li>
                <a
                  href="https://support.mozilla.org/en-US/kb/add-web-page-shortcuts-your-home-screen"
                  target="_blank"
                  rel="noreferrer"
                >
                  Firefox for Android
                  <font-awesome-icon :icon="icons.faArrowUpRightFromSquare" />
                </a>
              </li>
              <li>
                <a
                  href="https://help.opera.com/en/touch/add-to-home-screen/"
                  target="_blank"
                  rel="noreferrer"
                >
                  Opera
                  <font-awesome-icon :icon="icons.faArrowUpRightFromSquare" />
                </a>
              </li>
              <li>
                <a
                  href="https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Guides/Installing#add_to_home_screen"
                  target="_blank"
                  rel="noreferrer"
                >
                  General
                  <font-awesome-icon :icon="icons.faArrowUpRightFromSquare" />
                </a>
              </li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  faArrowUpFromBracket,
  faArrowUpRightFromSquare,
} from '@fortawesome/free-solid-svg-icons';
import PlainHeader from '@/components/PlainHeader.vue';

const icons = {
  faArrowUpFromBracket,
  faArrowUpRightFromSquare,
};
</script>

<style lang="sass" scoped>
@import '@/styles/style.sass'

.install-container
  display: flex
  justify-content: center
  width: 100%
  padding: 16px
  box-sizing: border-box

.install-card
  width: 100%
  max-width: 860px
  background-color: var(--secondaryBackground)
  border-radius: 15px
  +shadow-light

.install-content
  padding: 24px 28px
  color: var(--primary)
  line-height: 1.55

  .intro
    font-size: 1.05em
    margin: 0 0 20px

  section
    margin-top: 22px
    &:first-of-type
      margin-top: 8px

  h2
    font-size: 1.3em
    margin: 0 0 10px
    color: var(--accent)

  ol, ul
    margin: 0 0 10px
    padding-left: 22px
    li
      margin: 4px 0

  .note
    font-size: .9em
    color: var(--tertiary)
    margin-top: 10px

  .link-list
    list-style: none
    padding-left: 0
    li
      margin: 6px 0
    a
      color: var(--accent)
      text-decoration: none
      display: inline-flex
      align-items: center
      gap: 6px
      &:hover
        text-decoration: underline
</style>
