<template v-once>
    <a-entity id="arcs-app">
        <a-entity @model-loaded="debounceLoaded"
                  gltf-model="#model"
                  id="model"
                  position="0 0 0"
                  scale="1 1 1"
        />

        <a-entity floor-model
                  gltf-model="#floor"
                  id="floor"
                  position="0 0 0"
                  scale="1 1 1"
        />

        <a-entity light="type: ambient; color: #BBB; intensity: .2"/>
        <a-entity light="type: point; color: #FFF; intensity: 0.6"
                  position="0 5 0"
        />
    </a-entity>
</template>

<script>

    import '../aframe/floor-model-component.js'

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
