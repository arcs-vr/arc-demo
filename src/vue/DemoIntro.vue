<template>
  <div class="ArcDemoIntro">
    <ArcContentSection>
      <ArcText tag="h1">
        ARCS Demo
      </ArcText>
      <ArcText>
        This virtual reality experience is part of a bachelor thesis that explores multi-device
        interactivity.
      </ArcText>
      <ArcText>
        You will have the opportunity to connect a second smartphone, computer, or tablet as a remote controller.
      </ArcText>
      <ArcText>
        A second device is not mandatory/required. Your participation is highly valuable with or without a remote
        control.
      </ArcText>
      <ArcText>
        The VR experience consists of a simple parkour run, where you have to find codes that open doors.
        <br>
      </ArcText>
      <ArcText>No data will be submitted!</ArcText>
      <router-link
        class="button"
        :to="{name: 'parcour'}"
      >
        Start the VR parcour
      </router-link>
      <hr>
      <router-link
        class="link"
        :to="{name: 'remote-selector'}"
      >
        Or open the remote control page (for the second device).
      </router-link>
    </ArcContentSection>
  </div>
</template>

<script>
  import ArcText from 'arc-vue-remotes/src/components/ArcText.vue'
  import ArcContentSection from 'arc-vue-remotes/src/components/ArcContentSection.vue'

  export default {
    name: 'DemoIntro',

    components: {
      ArcText,
      ArcContentSection
    },

    data () {
      return {
        isTouch: null
      }
    },

    mounted () {
      this.isTouch = window.matchMedia('(pointer: coarse)').matches
    }
  }
</script>

<style
  lang="scss"
  scoped
>
  @import "~arc-cd/src/variables";

  .ArcDemoIntro {
    align-items: center;
    background-color: $theme-dark;
    color: $theme-light;
    display: flex;
    height: 100%;
    justify-content: center;
    padding: 1rem;

    hr {
      background-color: $theme-light;
      height: 1px;
      margin: 1rem;
      width: 256px;
    }

    .button {
      background-color: $theme-primary;
      border: 0;
      color: $theme-light;
      cursor: pointer;
      font-size: 2rem;
      font-style: $font-paragraph-style;
      padding: 1rem;
      text-decoration: none;
    }
  }
</style>
