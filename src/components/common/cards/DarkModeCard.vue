<template>
  <timed-card startTime="May 20, 2021" endTime="August 11, 2021">
    <div class="row">
      <div class="message">Introducing <b>Dark Mode</b></div>
      <rounded-button
        class="button"
        text="Try It"
        :circular="false"
        @click="toggleColor()"
      />
      <theme-change-modal :newTheme="theme.name == 'light' ? themes[1] : themes[0]" :showModal="showModal"
      v-on:yes="choice('yes')"
      v-on:no="choice('no')"
      v-on:close="showModal = false" />
    </div>
  </timed-card>
</template>

<script>
import themes from "../../../data/themes.json";
import TimedCard from "./TimedCard.vue";
import { mapState } from "vuex";
import RoundedButton from "common/RoundedButton.vue";
import ThemeChangeModal from "../ThemeChangeModal.vue";
export default {
  components: { TimedCard, RoundedButton, ThemeChangeModal },
  computed: {
    ...mapState(["theme"]),
    ...mapState(["color"])
  },
  data() {
    return {
      showModal: false,
      themes: themes,
    };
  },
  methods: {
    choice(choice){
      this.showModal = false;
      var data = {};
      data.theme = this.theme.name == 'light' ? themes[1] : themes[0]
      data.choice = choice
      this.$store.commit('setTheme', data)
    },
    toggleColor() {
     if(this.color != this.theme['suggestedColor']){ //if the color you set differs from the suggested color ("color conflict")
      this.showModal = true
     }else{
       this.choice('yes')
     }
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
