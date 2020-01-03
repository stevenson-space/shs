<template>
	<div>
		<plain-header title="Documents" />
		<card-container>
			<documents-card class-name="AP Chemistry" :documents="docs" />
		</card-container>
		<form name="form-name" method="post" data-netlify="true">
			<input name="ask-question" value="ask-question" />

			<button>Submit</button>
		</form>
	</div>
</template>

<script>
import { mapState } from "vuex";
import CardContainer from "common/CardContainer.vue";
import DocumentsCard from "common/cards/DocumentsCard.vue";
import PlainHeader from "common/PlainHeader.vue";

export default {
	components: {
		CardContainer,
		DocumentsCard,
		PlainHeader
	},
	data() {
		return {
			docs: [{ title: "book", link: "http://google.com" }]
		};
	},
	methods: {}
};
</script>

<style lang="sass" scoped></style>
