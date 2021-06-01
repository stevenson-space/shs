<template>
  <div class="schedule-column-period" :class="{ closed: closed, open: !closed }">
    <font-awesome-icon :icon="icons.faTimes" class="delete" @click="deletePopup" />

    <div class="title" @click="editNamePopup">
      <div ref="title-text" class="text">{{ name }}</div>
      <font-awesome-icon :icon="icons.faPencilAlt" class="icon" />
    </div>
    <div class="times">
      <div class="time" @click="$emit('pick-time', 'start')">
        {{ convertMilitaryTime(start) }}
        <span class="suffix">{{ getSuffix(start) }}</span>
      </div>
      <span class="dash">–</span>
      <div class="time" @click="$emit('pick-time', 'end')">
        {{ convertMilitaryTime(end) }}
        <span class="suffix">{{ getSuffix(end) }}</span>
      </div>
    </div>

    <confirm-popup :show="editingName" @cancel="editingName = false" @ok="editName">
      <div class="edit-popup">
        <div
          ref="edit-name"
          contenteditable="true"
          class="edit-name"
          @keypress.enter.prevent="editName"
        >
          {{ name }}
        </div>
        <checkbox v-model="editOthers">Also update other periods with the same name</checkbox>
      </div>
    </confirm-popup>

    <confirm-popup :show="showDeletePopup" @cancel="showDeletePopup = false" @ok="deletePeriod">
      <div class="delete-popup">
        <div class="text">Are you sure you want to delete "{{ name }}"?</div>
        <checkbox v-model="deleteOthers">Also delete periods with the same name in other schedule types</checkbox>
      </div>
    </confirm-popup>
  </div>
</template>

<script>
import FontAwesomeIcon from '@fortawesome/vue-fontawesome';
import { faPencilAlt, faTimes } from '@fortawesome/free-solid-svg-icons';
import Bell from 'src/js/bell';
import ConfirmPopup from 'common/ConfirmPopup.vue';
import Checkbox from 'common/Checkbox.vue';

export default {
  components: {
    FontAwesomeIcon,
    ConfirmPopup,
    Checkbox,
  },
  props: {
    name: { type: String, required: true },
    start: { type: String, required: true },
    end: { type: String, required: true },
    closed: { type: Boolean, default: false },
  },
  data() {
    return {
      editingName: false,
      editOthers: true,
      showDeletePopup: false,
      deleteOthers: false,
      icons: {
        faPencilAlt,
        faTimes,
      },
    };
  },
  methods: {
    convertMilitaryTime: Bell.convertMilitaryTime,
    getSuffix: Bell.getSuffix,
    editNamePopup() {
      this.editingName = true;
      this.editOthers = true;

      this.$nextTick(() => {
        window.getSelection().selectAllChildren(this.$refs['edit-name']);
      });
    },
    editName() {
      const newName = this.$refs['edit-name'].innerText;
      this.$emit('update-name', { name: newName, updateOthers: this.editOthers });
      this.editingName = false;
    },
    deletePopup() {
      this.showDeletePopup = true;
      this.deleteOthers = false;
    },
    deletePeriod() {
      this.$emit('delete-period', this.deleteOthers);
    },
  },
};
</script>

<style lang="sass" scoped>
@import 'src/styles/style.sass'

.schedule-column-period
  background-color: var(--background)
  border-radius: 15px
  padding: 15px
  position: relative
  &.open
    +shadow

  .delete
    position: absolute
    color: #666
    font-size: 1.3em
    z-index: 1
    cursor: pointer
    padding: 10px
    left: 5px
    top: 5px

  .title
    font-size: 1.4em
    margin-bottom: 15px
    display: flex
    justify-content: center
    align-items: center
    cursor: pointer
    position: relative

    .icon
      font-size: .7em
      margin-left: 10px
      color: #bbb
      position: absolute
      right: 5px

  .times
    display: flex
    justify-content: center
    font-size: 1.75em

    .time
      border: #999 thin solid
      border-radius: 10px
      padding: 0 5px
      cursor: pointer

      .suffix
        font-size: .6em

    .dash
      margin: 0 10px

  .edit-popup
    padding: 20px 35px

    .edit-name
      font-size: 1.4em
      border: #bbb 1px solid
      border-radius: 7px
      padding: 3px 5px
      text-align: center

  .delete-popup
    padding: 20px 35px
    max-width: 300px

    .text
      font-size: 1.2em
      text-align: center
      font-weight: bold

</style>
