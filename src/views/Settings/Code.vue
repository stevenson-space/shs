<template>
  <settings-section title="Code Contribution">
    <br />
    stevenson.space is open sourced! You can contribute on
   <b><a href="https://github.com/stevenson-space/shs/" target='_blank'>Github</a>.</b> It's also accessible from <b><a href="/code" target='_blank'>stevenson.space/code</a></b>.
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
    color: var(--color)
</style>
