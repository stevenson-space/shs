<template>
  <div>
    <theme-change-modal
      :newTheme="theme.name == 'light' ? themes[1] : themes[0]"
      :showModal="showModal"
      v-on:yes="choice('yes')"
      v-on:no="choice('no')"
      v-on:close="showModal = false"
    />
    <div class="theme-row">
      <theme-circle
        v-for="themeItem in themes"
        v-bind:key="themeItem.name"
        @click.native="changeTheme(themeItem)"
        :theme="themeItem"
        :isCurrentTheme="themeItem==theme && theme.suggestedColor == color"
      />
    </div>
  </div>
</template>

<script>
import themeCircle from "./ThemeCircle.vue";
import themes from "../../data/themes.json";
import { mapState } from "vuex";
import ThemeChangeModal from "../common/ThemeChangeModal.vue";

export default {
  components: { themeCircle, ThemeChangeModal },
  computed: {
    ...mapState(["theme"]),
    ...mapState(["color"]),
  },
  data() {
    return {
      showModal: false,
      themes: themes,
      selectedTheme: themes[0],
    };
  },
  methods: {
    choice(choice) {
      this.showModal = false;
      var data = {};
      data.theme = this.selectedTheme;
      data.choice = choice;
      this.$store.commit("setTheme", data);
    },
    changeTheme(theme) {
      if (theme != this.theme || theme.suggestedColor != this.color) {
        this.selectedTheme = theme;
        if (this.color != this.theme["suggestedColor"]) { //if the color you set differs from the suggested color ("color conflict")
          this.showModal = true;
        } else {
          this.choice("yes");
        }
      } else {
        console.log("same theme");
      }
    },
  },
};
</script>

<style lang="sass" scoped>
@import 'src/styles/style.sass'

.theme-row
    margin-left: 80px
    margin-bottom: 20px
    display: flex
</style>