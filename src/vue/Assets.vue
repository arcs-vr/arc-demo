<template v-once>
  <a-assets id="assets">
    <a-asset-item
      @loaded="assetLoaded"
      id="gltf-rooms"
      src="../../assets/models/numbers/rooms.gltf"
    />

    <a-asset-item
      @loaded="assetLoaded"
      id="gltf-numpad"
      src="../../assets/models/numbers/numpad.gltf"
    />

    <a-asset-item
      @loaded="assetLoaded"
      id="gltf-arc_sign_floor"
      src="../../assets/models/arc-sign-floor/arc-sign-floor.gltf"
    />

    <a-asset-item
      @loaded="assetLoaded"
      id="gltf-arc_sign_wall"
      src="../../assets/models/arc-sign-wall/arc-sign-wall.gltf"
    />

    <a-asset-item
      @loaded="assetLoaded"
      id="gltf-nav_mesh"
      src="../../assets/models/numbers/nav_mesh.gltf"
    />

    <a-asset-item
      @loaded="assetLoaded"
      id="gltf-numbers_mesh"
      src="../../assets/models/numbers/numbers_mesh.gltf"
    />

    <img
      @load="assetLoaded"
      alt="poster"
      id="poster-gaze_navigation"
      src="../../assets/posters/gaze_navigation.png"
      crossorigin="anonymous"
    >

    <img
      @load="assetLoaded"
      alt="poster"
      id="poster-connect_arcs"
      src="../../assets/posters/connect_arcs.png"
      crossorigin="anonymous"
    >

    <img
      @load="assetLoaded"
      alt="poster"
      id="poster-secondary_to_jump"
      src="../../assets/posters/secondary_to_jump.png"
      crossorigin="anonymous"
    >

    <img
      @load="assetLoaded"
      alt="poster"
      id="poster-fill_out_form"
      src="../../assets/posters/fill_out_form.png"
      crossorigin="anonymous"
    >

    <img
      @load="assetLoaded"
      alt="poster"
      id="poster-find_the_code"
      src="../../assets/posters/find_the_code.png"
      crossorigin="anonymous"
    >

    <img
      @load="assetLoaded"
      alt="poster"
      id="poster-thank_you"
      src="../../assets/posters/thank_you.png"
      crossorigin="anonymous"
    >

    <img
      @load="assetLoaded"
      alt="poster"
      id="icon-touch"
      src="../../assets/icons/baseline_touch_app_black_18dp.png"
      crossorigin="anonymous"
    >

    <img
      @load="assetLoaded"
      alt="poster"
      id="icon-cancel"
      src="../../assets/icons/baseline_cancel_black_18dp.png"
      crossorigin="anonymous"
    >

    <img
      @load="assetLoaded"
      alt="poster"
      id="icon-swap"
      src="../../assets/icons/baseline_swap_horizontal_circle_black_18dp.png"
      crossorigin="anonymous"
    >

    <img
      @load="assetLoaded"
      alt="poster"
      id="icon-walk"
      src="../../assets/icons/baseline_directions_run_black_18dp.png"
      crossorigin="anonymous"
    >

    <img
      @load="assetLoaded"
      alt="poster"
      id="icon-jump"
      src="../../assets/icons/baseline_upgrade_black_18dp.png"
      crossorigin="anonymous"
    >
  </a-assets>
</template>

<script>

  export default {
    name: 'Assets',

    data () {
      return {
        assetsLoaded: 0,
        assetCount: 0
      }
    },

    async mounted () {
      await this.$nextTick()

      this.assetCount = this.$el.childElementCount
      if (this.assetCount === 0) {
        this.$emit('assets-loaded')
      }

      this.watchAssets()
    },

    methods: {
      assetLoaded () {
        this.assetsLoaded++

        if (this.assetsLoaded === this.assetCount) {
          this.$emit('assets-loaded')
        }
      },

      watchAssets () {
        const manager = this.$el.fileLoader.manager

        manager.onProgress = this.onAssetProgress
        manager.onError = this.onAssetError
      },

      onAssetProgress (url, itemsLoaded, itemsTotal) {
        this.$emit('loading-status', itemsLoaded, itemsTotal)
      },

      onAssetError (url) {
        console.error('There was an error loading ' + url)
      }
    }
  }
</script>
