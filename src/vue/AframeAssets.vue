<template functional
          v-once
>
    <a-assets @loaded="listeners['loaded']">

        <a-asset-item id="model"
                      src="/models/scifi_buildings.gltf"
        />

        <a-asset-item id="floor"
                      src="/models/scifi_ground.gltf"
        />

    </a-assets>
</template>

<script>
  export default {
    name: 'aframe-assets',
  }
</script>
