<template v-once>
  <a-assets id="assets">
    <a-asset-item
      id="gltf-rooms"
      src="/models/numbers/rooms.gltf"
      @loaded="assetLoaded"
    />

    <a-asset-item
      id="gltf-numpad"
      src="/models/numbers/numpad.gltf"
      @loaded="assetLoaded"
    />

    <a-asset-item
      id="gltf-arc_sign_floor"
      src="/models/arc-sign-floor/arc-sign-floor.gltf"
      @loaded="assetLoaded"
    />

    <a-asset-item
      id="gltf-arc_sign_wall"
      src="/models/arc-sign-wall/arc-sign-wall.gltf"
      @loaded="assetLoaded"
    />

    <a-asset-item
      id="gltf-nav_mesh"
      src="/models/numbers/nav_mesh.gltf"
      @loaded="assetLoaded"
    />

    <a-asset-item
      id="gltf-numbers_mesh"
      src="/models/numbers/numbers_mesh.gltf"
      @loaded="assetLoaded"
    />

    <img
      id="poster-gaze_navigation"
      alt="poster"
      crossorigin="anonymous"
      src="../../assets/posters/gaze_navigation.png"
      @load="assetLoaded"
    >

    <img
      id="poster-connect_arcs"
      alt="poster"
      crossorigin="anonymous"
      src="../../assets/posters/connect_arcs.png"
      @load="assetLoaded"
    >

    <img
      id="poster-secondary_to_jump"
      alt="poster"
      crossorigin="anonymous"
      src="../../assets/posters/secondary_to_jump.png"
      @load="assetLoaded"
    >

    <img
      id="poster-fill_out_form"
      alt="poster"
      crossorigin="anonymous"
      src="../../assets/posters/fill_out_form.png"
      @load="assetLoaded"
    >

    <img
      id="poster-find_the_code"
      alt="poster"
      crossorigin="anonymous"
      src="../../assets/posters/find_the_code.png"
      @load="assetLoaded"
    >

    <img
      id="poster-thank_you"
      alt="poster"
      crossorigin="anonymous"
      src="../../assets/posters/thank_you.png"
      @load="assetLoaded"
    >

    <img
      id="icon-touch"
      alt="poster"
      crossorigin="anonymous"
      src="../../assets/icons/baseline_touch_app_black_18dp.png"
      @load="assetLoaded"
    >

    <img
      id="icon-cancel"
      alt="poster"
      crossorigin="anonymous"
      src="../../assets/icons/baseline_cancel_black_18dp.png"
      @load="assetLoaded"
    >

    <img
      id="icon-swap"
      alt="poster"
      crossorigin="anonymous"
      src="../../assets/icons/baseline_swap_horizontal_circle_black_18dp.png"
      @load="assetLoaded"
    >

    <img
      id="icon-walk"
      alt="poster"
      crossorigin="anonymous"
      src="../../assets/icons/baseline_directions_run_black_18dp.png"
      @load="assetLoaded"
    >

    <img
      id="icon-jump"
      alt="poster"
      crossorigin="anonymous"
      src="../../assets/icons/baseline_upgrade_black_18dp.png"
      @load="assetLoaded"
    >
  </a-assets>
</template>

<script>

  export default {
    name: 'AppAssets',

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
