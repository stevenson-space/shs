<template>
  <div>
    <plain-header title="Documents" />
    <card-container>
      <!-- Class cards -->
      <documents-card
        v-for="(list, name, index) in documents"
        :key="name"
        :class-name="name"
        :documents="list"
        class="document-card"
        :style="{ 'animation-delay': index*.01 + 's'}"
      />
      <!-- Request card -->
      <form-card :name="formName" title="Request">
        <form-card-element style="margin-bottom:-5px">
          Didn't find the book you were looking for? Request it below!
        </form-card-element>
        <form-card-element>
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
import CardContainer from '@/components/CardContainer.vue';
import DocumentsCard from '@/components/cards/DocumentsCard.vue';
import PlainHeader from '@/components/PlainHeader.vue';
import FormCard from '@/components/cards/FormCard.vue';
import FormCardElement from '@/components/cards/FormCardElement.vue';
import RoundedButton from '@/components/RoundedButton.vue';
import documents from '@/data/documents.json';

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
      documents,
      formName: 'document-request',
    };
  },
  methods: {},
};
</script>

<style lang="sass" scoped>
@import '@/styles/style.sass'

.document-card
  +animate-fade-up
  </style>
