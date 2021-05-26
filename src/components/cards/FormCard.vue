<template>
  <card class="form-card">
    <div class="container">
      <div class="title">{{ title }}</div>
      <!-- manually handle submitting, so we can emit an 'submit' event -->
      <form :name="name" method="POST" :data-netlify="netlify">
        <!-- mandatory hidden element with the form name -->
        <input type="hidden" name="form-name" :value="name" />
        <slot />
      </form>
    </div>
  </card>
</template>

<script>
import Card from '@/components/Card.vue';

export default {
  components: { Card },
  props: {
    name: { type: String, required: true },
    title: { type: String, required: false },
    netlify: { type: Boolean, default: true },
  },
  methods: {
    onSubmit(event) {
      event.preventDefault();
    },
  },
};
</script>

<style lang="sass" scoped>

.form-card
  // span the full width of the grid
  grid-column: 1/-1

.container
  text-align: center
  width: 100%

  .title
    background-color: var(--color)
    color: white
    font-size: 1.1em
    font-weight: bold
    line-height: 45px

  form
    display: flex
    flex-flow: column nowrap
    justify-content: center
    align-items: center
    width: 100%

</style>
