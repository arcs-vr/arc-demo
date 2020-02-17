<template functional
          v-once
>
    <a-assets @loaded="listeners['loaded']">

        <a-asset-item id="model"
                      src="/models/environment/arcs-demo-slim.gltf"
        />

        <a-asset-item id="floor"
                      src="/models/environment/arcs-demo-floors.gltf"
        />

    </a-assets>
</template>

<script>
  export default {
    name: 'aframe-assets',
  }
</script>
