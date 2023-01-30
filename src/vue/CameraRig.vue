<template>
  <a-entity
    id="camera-rig"
    arc-gamepad-controls
    arc-keyboard-controls
    :gaze-controls="start ? 'navMesh: #model-nav_mesh' : false"
    movement-controls="
      controls: arc-keyboard, arc-gamepad, gaze;
      fly: false;
      speed: 30;
    "
    position="-120 0 0"
    rotation="0 -90 0"
  >
    <a-entity
      id="player-body"
      player-body="navMeshElement: #model-nav_mesh;"
      @do-jump="$stats['jump_count']++"
    >
      <a-entity
        id="main-camera"
        camera
        look-controls="
          magicWindowTrackingEnabled: false;
          pointerLockEnabled: true;
        "
        position="0 1.7 0"
        user-height="1.6"
      >
        <a-entity
          ref="cursor"
          arc-cursor
          position="0 0 -0.5"
        />

        <a-video
          animation__activate="property: opacity; from: 0; to: 1; startEvents: activate; dur: 200; delay: 100;"
          animation__activate_visibility="property: visible; from: false; to: true; startEvents: activate; dur: 0;"
          animation__deactivate="property: opacity; from: 1; to: 0; startEvents: deactivate; dur: 200;"
          animation__deactivate_visibility="property: visible; from: true; to: false; startEvents: deactivate; dur: 0; delay: 200;"
          arc-hand-camera="angle: -35;"
          height=".3"
          opacity="0"
          position="0 -0.2 -0.5"
          rotation="0 0 0"
          transparent="true"
          visible="true"
          width=".533"
        />
      </a-entity>
    </a-entity>
  </a-entity>
</template>

<script>
  import 'arc-aframe-movement'
  import 'arc-aframe-hand-camera'
  import 'arc-aframe-cursor'
  import '../aframe/movement-controls.js'
  import '../aframe/gaze-controls-component.js'
  import '../aframe/player-body-component.js'

  export default {
    name: 'CameraRig',

    props: {
      start: {
        type: Boolean,
        default: false
      }
    },

    async mounted () {
      await this.$nextTick()
      this.$emit('loaded')
    }
  }
</script>
