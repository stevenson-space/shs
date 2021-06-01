<template>
  <timed-card startTime="May 20, 2021" endTime="August 11, 2021">
    <div class="row">
    <div class="message">Introducing <b>Dark Mode</b></div>
    <rounded-button
      class="button"
      text="Try It"
      :circular="false"
      @click="toggleColor()"/>
    </div>
  </timed-card>
</template>

<script>
import TimedCard from "./TimedCard.vue";
import { mapState } from "vuex";
import themes from "../../../data/themes.json";
import RoundedButton from "common/RoundedButton.vue";

export default {
  components: { TimedCard, RoundedButton },
  computed: {
    ...mapState(["theme"]),
  },
  methods: {
    toggleColor() {
      this.$store.commit(
        "setTheme",
        this.theme.name == "light" ? themes[1] : themes[0]
      );
    },
  },
};
</script>

<style lang="sass" scoped>
.row
  display: flex
  justify-content: center
  align-items: center
  
.message
  margin-top: 8px
  font-size: .9em
  text-align: center
  padding-bottom: 10px
.button
  margin-left: 8px
  width: 40px
  height: 10px
</style>
