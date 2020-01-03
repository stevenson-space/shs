<template>
  <div>
    <plain-header title="Documents" />
    <card-container>
      <!-- Class cards -->
      <documents-card class-name="AP Chemistry" :documents="docs" />
      <!-- Request card -->
      <form-card :name="formName" title="Request">
        <form-card-element>Didn't find the book you were looking for? Request it below!</form-card-element>
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
          <input type="text" name="document-author" placeholder="Judy Mallow" required />
        </form-card-element>
        <form-card-element>
          <label>Edition</label>
          <input type="text" name="document-edition" placeholder="1st" />
        </form-card-element>
        <form-card-element>
          <label>Contact</label>
          <p>You can optionally provide your email if you wish to be notified when your book has been added.</p>
          <input type="email" name="contact-address" placeholder="youremail@students.d125.org" />
        </form-card-element>
        <form-card-element submit>
          <rounded-button text="Submit" />
        </form-card-element>
      </form-card>
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
    RoundedButton
  },
  data() {
    return {
      docs: [{ title: "book", link: "http://google.com" }],
      formName: "document-request"
    };
  },
  methods: {}
};
</script>

<style lang="sass" scoped></style>
