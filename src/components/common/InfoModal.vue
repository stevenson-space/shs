<template>
  <div class="">
    <font-awesome-icon
      @click="openModal()"
      :icon="icons.faQuestionCircle"
      fixed-width
    />

    <div
      @click="closeModal()"
      class="modal"
      :style="{ display: showModal ? 'block' : 'none' }"
    >
      <div class="modal-content">
        <h2>Schedule Information</h2>
                <div class="divider"></div>

        <p>
          "Remote Hybrid" means the schedule of hybrid learning but
          <b>only</b> online. This schedule is applicable for the weeks of Jan.
          5 and Jan. 11
        </p>
        <div class="divider"></div>
        <p>
          "Hybrid" means simultaneous on campus and online learning based on the
          3 color schedule. This schedule is planned to begin Jan. 19
        </p>
      </div>
    </div>
  </div>
</template>



<style lang="sass">
.divider
  width: 100%
  height: 1px
  background: #E5E7E9

.modal
  position: fixed
  z-index: 100
  left: 0
  top: 0
  width: 100%
  height: 100%
  overflow: auto
  background-color: rgba(0, 0, 0, 0.5)

.modal-content

  border-radius: 20px
  background-color: #fefefe
  margin: 100px auto
  padding: 1px 20px 5px 20px
  width: 80%
  max-width: 500px

.close
  margin-top: 5px
  color: #aaa
  float: right
  font-size: 28px
  font-weight: bold
</style>


<script>
import FontAwesomeIcon from "@fortawesome/vue-fontawesome";
import { faQuestionCircle } from "@fortawesome/free-solid-svg-icons";

export default {
  components: { FontAwesomeIcon },
  data() {
    return {
      showModal: false,
      icons: {
        faQuestionCircle,
      },
    };
  },
  methods: {
    openModal() {
      this.showModal = true;
    },
    closeModal() {
      this.showModal = false;
    },
  },
};
</script>
