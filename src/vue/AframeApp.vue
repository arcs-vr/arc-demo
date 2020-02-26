<template v-once>
    <a-entity id="arcs-app">
        <a-entity @model-loaded="debounceLoaded"
                  envmap-model
                  gltf-model="#model"
                  id="model"
                  position="0 0 0"
                  scale="10 10 10"
        />

        <a-entity envmap-model
                  floor-model
                  gltf-model="#floor"
                  id="floor"
                  position="0 0 0"
                  scale="10 10 10"
        />

        <a-entity light="type: ambient; color: #BBB; intensity: .2"/>
        <a-entity light="type: point; color: #FFF; intensity: 1;"
                  position="-400 35 150"
        />
    </a-entity>
</template>

<script>
  import '../aframe/floor-model-component.js'
  import '../aframe/envmap-model-component.js'

  export default {
    name: 'aframe-app',

    methods: {
      debounceLoaded () {
        setTimeout(this.emitLoaded, 4000)
      },

      emitLoaded () {
        this.$emit('loaded')
      }
    }
  }
</script>
