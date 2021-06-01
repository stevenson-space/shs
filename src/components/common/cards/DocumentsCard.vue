<template>
  <card>
    <div class="classname">{{ className }}</div>
    <div class="books">
      <a v-for="doc in documents" :href="doc.link">{{ doc.title }}</a>
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

.classname
  text-align: center
  background-color: var(--color)
  color: var(--background)
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
    text-align: center

    text-decoration: none
    color: var(--color)

</style>
