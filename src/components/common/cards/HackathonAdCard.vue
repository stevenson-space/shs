<template>
  <card>
    <div class="hackathon">
      <external-link
        class="external-link"
        link="https://medium.com/hackathons-anonymous/wtf-is-a-hackathon-92668579601"
        image="https://cdn-images-1.medium.com/max/1000/0*8BccXKKNkSwhqcxC.png"
        text="Sounds scary, right? Don’t worry, it’s not that type of hacking."
        site="medium.com"
        analytics="what">
        What is a <span class="hackathon-text">hackathon</span>?
      </external-link>

      <external-link
        class="external-link"
        link="https://medium.com/@BoilerMake/why-you-should-go-to-a-hackathon-2d4ede475c9"
        image="https://miro.medium.com/fit/c/240/240/1*Mhvgk5EPyHJBxg-5BIB20Q.png"
        site="medium.com"
        analytics="why">
        Why should I go to one?
      </external-link>

      <div class="divider"/>

      <div class="title">Nearby Hackathons</div>

      <external-link
        class="external-link"
        link="https://www.codeday.org/chicago"
        image="https://pbs.twimg.com/profile_images/740778965409923076/8T3AuS8U_400x400.jpg"
        site="codeday.org"
        analytics="codeday">
        CodeDay Chicago
      </external-link>

      <div class="promo-code">Use promo code: <span class="color">AESHS</span></div>
    </div>
  </card>
</template>

<script>
import Card from 'common/Card.vue';
import ExternalLink from 'common/ExternalLink.vue';

export default {
  components: { Card, ExternalLink },
};
</script>

<style lang="sass" scoped>

.hackathon
  display: flex
  flex-direction: column
  align-items: center
  padding: 3px 7px

  .external-link
    margin: 5px 0
    width: 100%

  .hackathon-text
    color: var(--color)
    font-size: 1.25em
  
  .divider
    height: 1px
    width: 100%
    margin: 10px 0
    background-color: #bbb
  
  .title
    color: var(--color)
    font-weight: bold
    font-size: .85em

  .promo-code
    font-size: .8em

  .color
    color: var(--color)
    font-weight: bold
    font-size: 1.1em

</style>
