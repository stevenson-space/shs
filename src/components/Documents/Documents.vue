<template>
	<div>
		<plain-header title="Documents" />
		books go here
		<card-container class="container"></card-container>
	</div>
</template>

<script>
import { mapState } from "vuex";
import CardContainer from "common/CardContainer.vue";
import PlainHeader from "common/PlainHeader.vue";

export default {
	components: {
		CardContainer,
		PlainHeader
	},
	data() {
		return {};
	}
};
</script>

<style lang="sass" scoped></style>
