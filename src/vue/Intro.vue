<template>
  <div class="intro">
    <h1>ARCS Demo</h1>
    <p>This virtual reality experience is part of a bachelor thesis that explores multi-device
       interactivity.</p>
    <p>You will have the opportunity to connect a second smartphone or tablet as a remote controller.</p>
    <p>A second device is not mandatory/required. Your participation is highly valuable with or without a remote
       control.</p>
    <p>
      The VR experience consists of a simple parkour run, where you have to find codes that open doors.
      <br>
    </p>
    <p>No data will be submitted!</p>
    <router-link
      :to="{name: 'parcour'}"
      class="button"
    >
      Start the VR parcour
    </router-link>
    <hr>
    <router-link
      :to="{name: 'remote-selector'}"
      class="link"
    >
      Or open the remote control page (for the second device).
    </router-link>
  </div>
</template>

<script>
  export default {
    name: 'Intro',
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
  @import '~arc-cd/src/variables';
  @import '~arc-cd/src/fonts';
  @import '~arc-cd/src/typography';

  * {
    box-sizing: border-box;
  }

  body,
  html {
    margin: 0;
    padding: 0;
  }

  .intro {
    align-items: center;
    background-color: $theme-dark;
    color: $theme-light;
    display: flex;
    flex-direction: column;
    font-family: $font-paragraph;
    height: 100%;
    justify-content: center;
    left: 0;
    overflow: scroll;
    padding: 1rem;
    position: fixed;
    text-align: center;
    top: 0;
    width: 100%;
    z-index: 1000;

    hr {
      margin: 1rem 0;
      width: 256px;
    }

    h1 {
      font-family: $font-heading;
    }

    .button {
      background-color: $theme-primary;
      border: 0;
      color: $theme-light;
      cursor: pointer;
      font-size: 2rem;
      font-style: $font-paragraph-style;
      margin-bottom: 1rem;
      margin-top: 1rem;
      padding: 1rem;
      text-decoration: none;
    }

    .link {
      margin-top: 1rem;
    }
  }
</style>
