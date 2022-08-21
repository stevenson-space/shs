<template>
  <settings-section title="Contact">
    <br />
    Feel free to address any questions, comments, or concerns by
    <a href="/getHelp">visiting our contact form</a>. You may also write a issue if it's code-related <b><a href="https://github.com/stevenson-space/shs/issues" target='_blank'>here</a></b>.
  </settings-section>
</template>

<script>
import SettingsSection from './SettingsSection.vue';

export default {
  components: { SettingsSection },
  data() {
    return {};
  },
};
</script>

<style lang="sass" scoped>
a
    text-decoration: none
    font-weight: bold
    color: var(--color)
</style>
