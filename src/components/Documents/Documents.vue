<template>
	<div>
		<plain-header title="Documents" />
		<card-container>
			<!-- Class cards -->
			<documents-card
				v-for="(list, name) in docs"
				:key="name"
				:class-name="name"
				:documents="list"
			/>
			<!-- Request card -->
			<form-card :name="formName" title="Request">
				<form-card-element
				style="margin-bottom:-5px"
					>Didn't find the book you were looking for? Request it
					below!</form-card-element
				>
				<form-card-element >
					<label>Class</label>
					<input
						type="text"
						name="class-name"
						placeholder="Underwater Basket Weaving Accelerated"
						required
					/>
				</form-card-element>
				<form-card-element>
					<label>Title</label>
					<input
						type="text"
						name="document-name"
						placeholder="Pine Needle Basketry: From Forest Floor to Finished Project"
						required
					/>
				</form-card-element>
				<form-card-element>
					<label>Author(s)</label>
					<input
						type="text"
						name="document-author"
						placeholder="Judy Mallow"
						required
					/>
				</form-card-element>
				<form-card-element>
					<label>Edition</label>
					<input
						type="text"
						name="document-edition"
						placeholder="1st"
					/>
				</form-card-element>
				<form-card-element>
					<label>Contact</label>
					<p style="font-size:14px; margin-top:-3px; margin-left: -5px; color:grey">
						You can optionally provide your email if you wish to be
						notified when your book has been added.
					</p>
					<input
						type="email"
						name="contact-address"
						placeholder="your@email.com"
					/>
				</form-card-element>
				<form-card-element submit>
					<rounded-button text="Submit" />
				</form-card-element>
			</form-card>
			<br>
		</card-container>
	</div>
</template>

<script>
import { mapState } from "vuex";
import CardContainer from "common/CardContainer.vue";
import DocumentsCard from "common/cards/DocumentsCard.vue";
import PlainHeader from "common/PlainHeader.vue";
import FormCard from "common/cards/FormCard.vue";
import FormCardElement from "common/cards/FormCardElement.vue";
import RoundedButton from "common/RoundedButton.vue";

export default {
	components: {
		CardContainer,
		DocumentsCard,
		PlainHeader,
		FormCard,
		FormCardElement,
		RoundedButton,
	},
	data() {
		return {
			docs: {
				"Spanish 1": [
					{
						title: "Textbook",
						link:
							"https://drive.google.com/uc?export=download&id=0B5BsvXoCCrj2elFIbHBLRHV6MGs",
					},
					{
						title: "Core Workbook 1-5",
						link:
							"https://drive.google.com/uc?export=download&id=0B5BsvXoCCrj2Nk1MWFdnWTNXWTA",
					},
					{
						title: "Core Workbook 6-10",
						link:
							"https://drive.google.com/uc?export=download&id=0B5BsvXoCCrj2TEx2OXNrRzJja2s",
					},
				],
				"Spanish 2-3x": [
					{
						title: "Textbook",
						link:
							"https://drive.google.com/uc?export=download&id=0B5BsvXoCCrj2QjZRTFpiNS0xWXc",
					},
					{
						title: "Guided Practice",
						link:
							"https://drive.google.com/uc?export=download&id=0B5BsvXoCCrj2SUQzTUJCaGt6cW8",
					},
					{
						title: "Core Workbook 1-5",
						link:
							"https://drive.google.com/uc?export=download&id=0B5BsvXoCCrj2U1Nrc2JVLVR6OFE",
					},
					{
						title: "Core Workbook 6-10",
						link:
							"https://drive.google.com/uc?export=download&id=0B5BsvXoCCrj2NlA1MVlYUEhLY2c",
					},
				],
				"Spanish 3-4x": [
					{
						title: "Core Workbook 1-5",
						link:
							"https://drive.google.com/uc?export=download&id=0B5BsvXoCCrj2Zk4tQlBqajZvRnM",
					},
					{
						title: "Core Workbook 6-10",
						link:
							"https://drive.google.com/uc?export=download&id=0B5BsvXoCCrj2dlVIRGs3TGYyVWs",
					},
				],
				"Freshman English Accelerated": [
					{
						title: "A Tale of Two Cities",
						link:
							"https://drive.google.com/uc?export=download&id=0B5BsvXoCCrj2Qzdib0pUTVlycTg",
					},
					{
						title: "Lord of the Flies",
						link:
							"https://drive.google.com/uc?export=download&id=0B5BsvXoCCrj2ODFuOTRRR0ZhQlE",
					},
					{
						title: "Of Mice and Men",
						link:
							"https://drive.google.com/uc?export=download&id=0B5BsvXoCCrj2cURIQ1oya0haN1k",
					},
					{
						title: "The Alchemist",
						link:
							"https://drive.google.com/uc?export=download&id=0B5BsvXoCCrj2MnUtSktROUQ0amc",
					},
					{
						title: "The Color of Water",
						link:
							"https://drive.google.com/uc?export=download&id=0B5BsvXoCCrj2TUlUblltT0VsQms",
					},
					{
						title: "The Tempest",
						link:
							"https://drive.google.com/uc?export=download&id=0B5BsvXoCCrj2dWM0U2lMTWJqeFU",
					},
					{
						title: "To Kill a Mockingbird",
						link:
							"https://drive.google.com/uc?export=download&id=0B5BsvXoCCrj2ZzNtRlhmVDl0c00",
					},
					{
						title: "The House on Mango Street",
						link:
							"https://mega.nz/#!9YlnhJBA!WZYibrhIlh7LsQ2TOQWoToEL3GDmfzSIKkA_nIHj-20",
					},
				],
				"Sophomore Accelerated English": [
					{
						title: "The Bean Trees",
						link:
							"https://drive.google.com/uc?export=download&id=0B5BsvXoCCrj2M0FwbERsOERnWTg",
					},
					{
						title: "The Catcher in the Rye",
						link:
							"https://drive.google.com/uc?export=download&id=0B5BsvXoCCrj2LVhRaV9TOUlTa2M",
					},
					{
						title: "Fahrenheit 451",
						link:
							"https://drive.google.com/uc?export=download&id=0B5BsvXoCCrj2TG80VnM0UjhCb1k",
					},
					{
						title: "Macbeth",
						link:
							"https://drive.google.com/uc?export=download&id=0B5BsvXoCCrj2TFpndGZpMEtEa1U",
					},
					{
						title: "Jane Eyre",
						link:
							"https://drive.google.com/uc?export=download&id=0B5BsvXoCCrj2MVlnd1JQTTNwajQ",
					},
				],
				"AP Junior English": [
					{
						title: "The Picture of Dorian Gray",
						link:
							"https://drive.google.com/uc?export=download&id=0B5BsvXoCCrj2YnlMYUloeDh3N0k",
					},
					{
						title: "They Say I Say",
						link:
							"https://drive.google.com/uc?export=download&id=0B5BsvXoCCrj2N294eW5uM1RibFE",
					},
					{
						title: "On Writing Well",
						link:
							"https://drive.google.com/uc?export=download&id=0B5BsvXoCCrj2ajJFanh6RU15M1k",
					},
					{
						title: "Othello",
						link:
							"https://drive.google.com/uc?export=download&id=0B5BsvXoCCrj2Y3N5VjNpZGsxUFU",
					},
					{
						title: "The Great Gatsby",
						link:
							"https://drive.google.com/uc?export=download&id=0B5BsvXoCCrj2dWZrcmkzQlRnNXM",
					},
					{
						title: "Status Anxiety",
						link:
							"https://drive.google.com/uc?export=download&id=0B5BsvXoCCrj2YkgyRzRBQnpVVWM",
					},
				],
				"AP Themes": [
					{
						title: "Life of Pi",
						link:
							"https://drive.google.com/uc?export=download&id=0B5BsvXoCCrj2ejA1RVRHS200bzA",
					},
					{
						title: "Balzac and the Little Chinese Seamstress",
						link:
							"https://drive.google.com/uc?export=download&id=0B5BsvXoCCrj2Z1pxejVXVVhxaWc",
					},
					{
						title: "The Stranger",
						link:
							"https://mega.nz/#!RB9jVYRR!d2_thGqn6ZuhjCr1_Xcq0_v_sNve7gbhAnXOmMxnjKs",
					},
				],
				"Geometry Honors": [
					{
						title: "Textbook",
						link:
							"https://drive.google.com/uc?export=download&id=0B5BsvXoCCrj2N29iUHZWZXc2MUE",
					},
				],
				"Precalculus Honors": [
					{
						title: "Textbook",
						link:
							"https://drive.google.com/uc?export=download&id=0B5BsvXoCCrj2aEJhdHhyZkk0eEE",
					},
				],
				"AP Calculus AB": [
					{
						title: "Textbook",
						link:
							"https://mega.nz/#!kNFE2Kpa!Q55iKU7lDkwRWIjwXmbTfBdIap9ajeA7-Gg7bmrF4VM",
					},
				],
				"AP Calculus BC": [
					{
						title: "Textbook",
						link:
							"https://drive.google.com/uc?export=download&id=0B5BsvXoCCrj2djdFZmZPbVFKcGM",
					},
				],
				"AP Statistics": [
					{
						title: "Textbook",
						link:
							"https://drive.google.com/uc?export=download&id=0B5BsvXoCCrj2U25YMUNtZFFOUkU",
					},
				],
				"Calculus III": [
					{
						title: "Textbook",
						link:
							"https://mega.nz/#!pBFSHKIK!sjHXYpUlR03mbEXRTOjn_kMKjn5Skaupv3QXmpPHK6E",
					},
				],
				"Linear Algebra": [
					{
						title: "Textbook",
						link:
							"https://mega.nz/#!4FVwzIhS!fYLoya-XEe7ej7e-iFMUKJMYc8sheJv4OlhT01rJ9P0",
					},
				],
				"AP Computer Science": [
					{
						title: "Textbook",
						link:
							"https://drive.google.com/uc?export=download&id=0B5BsvXoCCrj2QzExelNFZ1Y1N0k",
					},
				],
				"AP Physics 1": [
					{
						title: "Textbook",
						link:
							"https://mega.nz/#!8UdQBQKJ!mImb8Fsk09V9YGeRRaqx9FePTgP58jWeOnE27IbQCjk",
					},
				],
				"AP Physics 2": [
					{
						title: "Textbook",
						link:
							"https://drive.google.com/uc?export=download&id=0B5BsvXoCCrj2am5rTGlKaFVoT1E",
					},
				],
				"AP Physics C": [
					{
						title: "University Physics with Modern Physics",
						link:
							"https://mega.nz/file/YQsFBQDZ#RBbv8lY3W5zmRWml4izso4Ht3hvIs0DFP7d69HVgpqw",
					},
				],
				"AP Chemistry": [
					{
						title: "Textbook",
						link:
							"https://drive.google.com/uc?export=download&id=0B5BsvXoCCrj2bTByMklUcDYyM1E",
					},
				],
				"AP Biology": [
					{
						title: "Textbook",
						link:
							"https://drive.google.com/uc?export=download&id=0B5BsvXoCCrj2N2JJbS1PTnpucUk",
					},
				],
				"AP Macroeconomics": [
					{
						title: "Textbook",
						link:
							"https://drive.google.com/uc?export=download&id=0B5BsvXoCCrj2RFJ3Z0pNQXFtU2s",
					},
				],
				"AP European History": [
					{
						title: "McKay Textbook",
						link:
							"https://drive.google.com/uc?export=download&id=0B5BsvXoCCrj2bUdwVUtOU1h1Y1U",
					},
				],
				"APUSH, AP American Studies": [
					{
						title: "Textbook - APUSH/AMSTUD",
						link:
							"https://drive.google.com/uc?export=download&id=0B5BsvXoCCrj2a0ZZYWVpUjd4QmM",
					},
					{
						title: "Textbook - AMSTUD (Conversations)",
						link:
							"https://drive.google.com/uc?export=download&id=0B5BsvXoCCrj2YmJCR0dWRDQ4LXc",
					},
					{
						title: "It's complicated",
						link:
							"https://drive.google.com/uc?export=download&id=0B5BsvXoCCrj2cHBPWlFDbWh1WEk",
					},
				],
				"AP Psychology": [
					{
						title: "Textbook",
						link:
							"https://drive.google.com/uc?export=download&id=0B5BsvXoCCrj2X2RrT3NFMEN1OHc",
					},
				],
			},
			formName: "document-request",
		};
	},
	methods: {},
};
</script>

<style lang="sass" scoped></style>
