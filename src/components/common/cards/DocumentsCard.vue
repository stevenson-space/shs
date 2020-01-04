<template>
  <card>
    <div class="container">
      <div class="classname">{{ className }}</div>

      <div class="books">
        <a v-for="doc in documents" :href="doc.link">{{ doc.title }}</a>
      </div>
    </div>
  </card>
</template>

<script>
import Card from "common/Card.vue";

export default {
  components: { Card },
  props: {
    className: { type: String, required: true },
    documents: { type: Array[Object], required: true }
  }
};
</script>

<style lang="sass" scoped>

.container
  text-align: center

  .classname
    background-color: var(--color)
    color: white
    font-size: 1.1em
    font-weight: bold
    line-height: 45px

  .books
    display: flex
    flex-flow: column nowrap
    justify-content: center
    align-items: center

    a
      margin-top: 5px
      margin-bottom: 5px

      width: 90%

      text-decoration: none
      color: var(--color)

      //word-wrap: normal
  
</style>
