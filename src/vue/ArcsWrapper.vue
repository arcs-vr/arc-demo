<template>
    <a-scene :arc-system="`
                host: ${host};
                port: ${port};
                protocol: ${protocol};
                app: ${app};
              `"
             @loaded.self="sceneLoaded = true"
             light="defaultLightsEnabled: false"
             loading-screen="enabled: false;"
             ref="scene"
             renderer="
                antialias: true;
                colorManagement: true;
                alpha: false;
             "
    >
        <transition mode="out-in"
                    name="fade"
        >
            <div class="splash"
                 v-if="showSplash"
            >
                <h1>ARCS Demo</h1>
                <arc-logo></arc-logo>
                <p>Loading…</p>
            </div>
        </transition>

        <aframe-assets @loaded="assetsLoaded = true"/>

        <aframe-app @loaded="appLoaded = true"
                    v-if="assetsLoaded"
        />

        <aframe-camera-rig/>

        <arc-connect-button @arc-connect="showModal = true"></arc-connect-button>
        <transition appear
                    mode="out-in"
                    name="fade"
        >
            <arc-connect-modal :remote-url="remoteUrl"
                               @arc-connect="connect"
                               @close="showModal = false"
                               v-if="showModal"
            ></arc-connect-modal>
        </transition>
    </a-scene>
</template>

<script>
  import 'aframe/dist/aframe-v1.0.4.js'
  import { acceleratedRaycast, computeBoundsTree, disposeBoundsTree } from 'three-mesh-bvh'
  import 'arc-aframe-system'

  import ArcLogo          from 'arc-ci/template/ArcLogo.vue'
  import ArcConnectButton from 'arc-remotes/src/components/ArcConnectButton.vue'
  import ArcConnectModal  from 'arc-remotes/src/components/ArcConnectModal.vue'
  import AframeAssets     from './AframeAssets.vue'

  import AframeApp        from './AframeApp.vue'
  import AframeCameraRig  from './AframeCameraRig.vue'

  THREE.BufferGeometry.prototype.computeBoundsTree = computeBoundsTree
  THREE.BufferGeometry.prototype.disposeBoundsTree = disposeBoundsTree
  THREE.Mesh.prototype.raycast                     = acceleratedRaycast

  export default {
    name: 'arc-wrapper',

    components: {
      AframeCameraRig,
      ArcLogo,
      ArcConnectButton,
      ArcConnectModal,
      AframeAssets,
      AframeApp
    },

    props: {
      app: {
        type: String,
        required: true
      },
      host: {
        type: String,
        default: 'localhost'
      },
      port: {
        type: Number,
        default: 3030
      },
      protocol: {
        type: String,
        default: 'http'
      },
      routeRemote: {
        type: String,
        required: true
      },
    },

    data () {
      return {
        showModal: false,
        appLoaded: false,
        assetsLoaded: false,
        sceneLoaded: false
      }
    },

    methods: {

      /**
       * Start the connection to the MQTT Server
       */
      connect (deviceName) {
        this.$refs.scene.emit('arcs-connect', {
          deviceName: deviceName
        })

        this.showModal = false
      }
    },

    computed: {

      /**
       * Get the remote URL from the current host
       * @return {string}
       */
      remoteUrl () {
        const path = this.$router.resolve({name: this.routeRemote}).href
        return `${window.location.protocol}//${window.location.host}${path}`
      },

      /**
       * Whether to show the loading/splash screen
       * @return {boolean}
       */
      showSplash () {
        return !this.sceneLoaded && !this.assetsLoaded && !this.appLoaded
      }
    }
  }
</script>

<style lang="scss"
       scoped
>
    @import '~arc-ci/src/variables';

    .splash {
        align-items: center;
        backface-visibility: hidden;
        background-color: $theme-dark;
        color: $theme-light;
        display: flex;
        flex-direction: column;
        height: 100%;
        justify-content: center;
        left: 0;
        perspective: 1000px;
        position: fixed;
        top: 0;
        transform: translateZ(0);
        width: 100%;
        z-index: 10000;
    }
</style>

<style lang="scss">
    * {
        box-sizing: border-box;
    }

    body,
    html {
        margin: 0;
        padding: 0;
    }

    .fade-enter-active,
    .fade-leave-active {
        transition: opacity .4s ease;
    }

    .fade-enter,
    .fade-leave-to {
        opacity: 0;
    }

    .logo {
        max-height: 60%;
        max-width: 500px;
        padding: 5vh;
        width: 80vmin;
    }
</style>
