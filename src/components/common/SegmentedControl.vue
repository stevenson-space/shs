<template>
  <!-- <div class="controls" style="display: flex; flex-direction: column; align-items: center"> -->
    
<!-- <form>
    <div class="segmentedControl">
      <input id="regular"  class="segmentedControl__connector" type="radio"  name="courseLevel" checked/>
      <label for="regular" class="segmentedControl__jack">Regular</label>
      <input id="accelerated" class="segmentedControl__connector" type="radio" name="courseLevel"/>
      <label for="accelerated" class="segmentedControl__jack">Accelerated</label>
      <input id="honors" class="segmentedControl__connector" type="radio" name="courseLevel" />
      <label for="honors" class="segmentedControl__jack">Honors/AP</label>
    </div>
 </form> -->


<div class="">

    <form>
    <div class="segmentedControl">
      <input id="regular"  type="radio"  name="courseLevel" checked/>
      <label for="regular" >Regular</label>
      <input id="accelerated" type="radio" name="courseLevel"/>
      <label for="accelerated" >Accelerated</label>
      <input id="honors" type="radio" name="courseLevel" />
      <label for="honors">Honors/AP</label>
    </div>
 </form>

</div>



  <!-- </div> -->
</template>


 <script>

export default {
  props: {
    identifier : { required: true,type: Number,},
  },
   computed: {
    courseLevels: function () {
      return ["Course" + this.identifier, "Course" + this.identifier,"Course" + this.identifier]
    },
     courseIds: function () {
      return ["id" + this.identifier ? "One":"Two", "id" + this.identifier,"id" + this.identifier]
    }


  }


};





</script>

<style lang="sass" scoped>
@import 'src/styles/style.sass'

[contenteditable="true"]:focus
  outline: 0px solid transparent

.segmentedControl
  margin-top: 10px
  border: 1px solid #e0e0e0
  height: 35px
  border-radius: 35px
  display: inline-flex
  position: relative

.segmentedControl__jack
  height: 35px
  border: none
  background: transparent
  border-radius: 35px
  padding: 0 15px 0 15px
  color: #707070
  transition: 0.15s
  position: relative
  z-index: 1
  font-size: 13px
  line-height: 13px
  display: flex
  align-items: center
  justify-content: center
  cursor: pointer

  &::before
    background-color: var(--color)
    content: ''
    position: absolute
    width: 100%
    height: 35px
    top: 0
    left: 0
    border-radius: 35px
    pointer-events: none
    transition: 0.15s
    opacity: 0
    transform: scale(0, 0)
    z-index: -1
    box-shadow: 0 5px 20px -4px rgba(0, 0, 0, 0.5)

.segmentedControl__connector:checked + .segmentedControl__jack
  color: #f5f5f5

  &::before
    opacity: 1
    animation: activeGrow linear 0.15s forwards

.segmentedControl__jack .fa
  margin-right: 10px

.segmentedControl__connector
  display: none

@keyframes activeGrow
  0%
    transform: scale(.8)

  75%
    transform: scale(1.1)

  100%
    transform: scale(1)

</style>

 



// <style lang="sass" scoped>
// @import 'src/styles/style.sass'
// .segmentedControl

//     margin-top: 10px
//     border: 1px solid #e0e0e0
//     height: 35px
//     border-radius: 35px
//     display: inline-flex
//     position: relative

// .segmentedControl__jack
//     height: 35px
//     border: none
//     background: transparent
//     border-radius: 35px
//     padding: 0 15px 0 15px
//     color: #707070
//     transition: 0.15s
//     position: relative
//     z-index: 1
//     font-size: 13px
//     line-height: 13px
//     display: flex
//     align-items: center
//     justify-content: center
//     cursor: pointer

// &::before
    // background-color: var(--color)
    // content: ''
    // position: absolute
    // width: 100%
    // height: 35px
    // top: 0
    // left: 0
    // border-radius: 35px
    // pointer-events: none
    // transition: 0.15s
    // opacity: 0
    // transform: scale(0, 0)
    // z-index: -1
    // box-shadow: 0 5px 20px -4px rgba(0, 0, 0, 0.5)

// .segmentedControl__connector:checked + .segmentedControl__jack
//     color: #f5f5f5

// &::before
//     opacity: 1
//     animation: activeGrow linear 0.15s forwards

// .segmentedControl__jack .fa
//     margin-right: 10px

// .segmentedControl__connector
//     display: none

// @keyframes activeGrow
//     0%
//         transform: scale(.8)

//     75%
//         transform: scale(1.1)

//     100%
//         transform: scale(1)
// </style>