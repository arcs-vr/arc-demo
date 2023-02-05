<template>
  <a-scene
    id="scene"
    ref="scene"
    :arc-system="arcSystemOptions"
    cubemap-environment="background: false;"
    debug
    light="defaultLightsEnabled: false"
    loading-screen="enabled: false"
    renderer="
       antialias: true;
       colorManagement: true;
       alpha: false;
       physicallyCorrectLights: true;
    "
    shadow="enabled: false"
    @arc-cursor-primary-click="$stats['interactions_count']++"
    @arc-remote-connected="remoteConnected = true"
    @arc-remote-disconnected="remoteConnected = false"
    @loaded.stop.self.once="sceneLoaded = true"
    @renderstart="renderStarted = true"
  >
    <app-assets
      @assets-loaded="assetsLoaded = true"
      @loading-status="setLoadingStatus"
    />

    <app
      v-if="assetsLoaded"
      :remote-connected="remoteConnected"
      @app-loaded="appLoaded = true"
    />

    <camera-rig :start="start"/>

    <arc-connect-button @arc-connect="showModal = true"/>

    <transition
      appear
      mode="out-in"
      name="fade"
    >
      <keep-alive>
        <arc-connect-modal
          v-if="showModal"
          :visible="showModal"
          @arc-remote-name="connectModal"
          @close="showModal = false"
        />
      </keep-alive>
    </transition>

    <a-entity
      light="
        type: directional;
        color: #FFF;
        intensity: 0;
      "
    />

    <splash-screen
      :items-loaded="itemsLoaded"
      :items-total="itemsTotal"
      :loaded="assetsLoaded"
      :show="showSplash"
      @start="start = true"
    />
  </a-scene>
</template>

<script>
  import 'aframe/dist/aframe-v1.3.0.js'

  import '../aframe/cubemap-environment-system.js'
  import '../bvh-raycasting.js'

  import 'arc-aframe-system'

  import ArcConnectButton from 'arc-vue-remotes/src/components/ArcConnectButton.vue'
  import ArcConnectModal from 'arc-vue-remotes/src/components/ArcConnectModal.vue'

  import AppAssets from './AppAssets.vue'
  import App from './App.vue'
  import CameraRig from './CameraRig.vue'
  import SplashScreen from './SplashScreen.vue'

  export default {
    name: 'ArcsWrapper',

    components: {
      SplashScreen,
      CameraRig,
      ArcConnectButton,
      ArcConnectModal,
      AppAssets,
      App
    },

    data () {
      return {
        showModal: false,
        appLoaded: false,
        assetsLoaded: false,
        sceneLoaded: false,
        renderStarted: false,
        remoteConnected: false,
        start: false,
        loadingUrl: '',
        itemsLoaded: 0,
        itemsTotal: 0
      }
    },

    computed: {

      /**
       * Whether to show the loading/splash screen
       * @return {boolean}
       */
      showSplash () {
        return !(
          this.sceneLoaded &&
          this.assetsLoaded &&
          this.appLoaded &&
          this.start &&
          this.renderStarted
        )
      },

      arcSystemOptions () {
        return `
                host: ${this.$arcOptions.host};
                port: ${this.$arcOptions.port};
                protocol: ${this.$arcOptions.protocol};
                app: ${this.$arcOptions.app};
                path: ${this.$arcOptions.path}
              `
      }
    },

    methods: {

      connectModal (deviceName) {
        this.$stats.connected_at = (new Date()).getTime()
        this.$stats.remote_connection_type = 'modal'
        this.connect(deviceName)
        this.$refs.scene.focus()
        this.$refs.scene.requestPointerLock()
      },

      /**
       * Start the connection to the MQTT Server
       */
      connect (deviceName) {
        localStorage.setItem('arc-name', deviceName)
        this.$stats.device_id = deviceName

        this.$refs.scene.emit('arcs-connect', {
          deviceName: deviceName
        })

        this.showModal = false
      },

      setLoadingStatus (itemsLoaded, itemsTotal) {
        this.itemsLoaded = itemsLoaded
        this.itemsTotal = itemsTotal
      }
    }
  }
</script>

<style lang="scss">
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity .4s ease;
  }

  .fade-enter,
  .fade-leave-to {
    opacity: 0;
  }

  .a-enter-ar-button {
    display: none;
  }
</style>
