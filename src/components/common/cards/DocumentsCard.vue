<template>
	<card>
		<div class="container">
			<div class="classname">{{ className }}</div>

			<a v-for="doc in documents" :href="doc.link">
				{{ doc.title }}
			</a>

			<div class="chips">
				<div class="chip">Today</div>
				<div class="space" />
				<div class="chip">3:30 – 5:00</div>
				<div class="space" />
				<div class="chip">Link Lab</div>
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

  .text
    line-height: 40px
    font-size: 1.1em
    margin-bottom: 5px

  .chips
    display: flex
    justify-content: space-evenly
    margin: 0 10px
    margin-bottom: 10px

    .space
      flex-grow: 1

    .chip
      border: 1px var(--color) solid
      color: var(--color)
      border-radius: 100px
      padding: 2px 5px
      font-weight: bold
      flex-grow: 3

  .extra-text
    font-size: .8em
    margin-bottom: 10px
</style>
