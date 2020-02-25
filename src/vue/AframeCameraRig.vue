<template>
    <a-entity camera-rig
              gamepad-movement
              id="camera-rig"
              position="-8 25 5"
              rotation="0 0 0"
              wasd-controls="
                fly: false;
              "
              player-body
    >
        <a-entity camera
                  id="main-camera"
                  look-controls="
                    hmdEnabled: false;
                    pointerLockEnabled: true;
                  "
                  position="0 1.65 0"
                  rotation="0 10 0"
                  user-height="1.65"
        >
            <a-text :value="this.leftClickAction"
                    align="right"
                    animation__activate="property: opacity; from: 0; to: 1; startEvents: activate; dur: 200; delay: 100;"
                    animation__deactivate="property: opacity; from: 1; to: 0; startEvents: deactivate; dur: 200; delay: 100;"
                    color="#ef8f9d"
                    height="0.00001"
                    opacity="0"
                    position="-0.02 0 -0.5"
                    ref="leftClickAction"
                    transparent="true"
                    width="0.5"
            />
            <a-entity @arc-cursor-actions="setActionNames"
                      animation__activate_inner="property: geometry.radiusInner; from: 0.0001; to: 0.0125; startEvents: activate; dur: 200; delay: 100;"
                      animation__activate_outer="property: geometry.radiusOuter; from: 0.01; to: 0.015; startEvents: activate; dur: 200; delay: 100;"
                      animation__deactivate_inner="property: geometry.radiusInner; from: 0.0125; to: 0.0001; startEvents: deactivate; dur: 200; delay: 100;"
                      animation__deactivate_outer="property: geometry.radiusOuter; from: 0.015; to: 0.01; startEvents: deactivate; dur: 200; delay: 100;"
                      arc-cursor
                      geometry="primitive: ring; radiusInner: 0.0001; radiusOuter: 0.01"
                      id="cursor"
                      material="color: #333; shader: flat; side: front; transparent: true; opacity: .75"
                      position="0 0 -0.5"
                      ref="cursor"
            />
            <a-text :value="this.rightClickAction"
                    align="left"
                    animation__activate="property: opacity; from: 0; to: 1; startEvents: activate; dur: 200; delay: 100;"
                    animation__deactivate="property: opacity; from: 1; to: 0; startEvents: deactivate; dur: 200; delay: 100;"
                    color="#95e4f9"
                    height="0.00001"
                    opacity="0"
                    position="0.02 0 -0.5"
                    ref="rightClickAction"
                    transparent="true"
                    width="0.5"
            />
        </a-entity>
    </a-entity>
</template>

<script>
  import '../aframe/camerarig-component'
  import '../aframe/player-body-component'
  import '../aframe/gamepad-component'
  import 'arc-cursor'

  import { ArcCursorActions } from 'arc-cursor/src/arc-cursor-actions.js'

  export default {
    name: 'aframe-camera-rig',

    data () {
      return {
        leftClickAction: null,
        rightClickAction: null
      }
    },

    methods: {
      setActionNames (event) {
        const prevLeft  = this.leftClickAction
        const prevRight = this.rightClickAction
        const wasActive = prevLeft !== null || prevRight !== null

        this.leftClickAction  = event.detail[ArcCursorActions.LEFT_CLICK]
        this.rightClickAction = event.detail[ArcCursorActions.RIGHT_CLICK]

        let activate = this.leftClickAction !== null || this.rightClickAction !== null

        if (prevLeft !== this.leftClickAction) {
          const eventName = this.leftClickAction !== null ? 'activate' : 'deactivate'
          this.$refs.leftClickAction.dispatchEvent(new CustomEvent(eventName))
        }

        if (prevRight !== this.rightClickAction) {
          const eventName = this.rightClickAction !== null ? 'activate' : 'deactivate'
          this.$refs.rightClickAction.dispatchEvent(new CustomEvent(eventName))
        }

        if (wasActive && !activate) {
          this.$refs.cursor.dispatchEvent(new CustomEvent('deactivate'))
          return
        }

        if (!wasActive && activate) {
          this.$refs.cursor.dispatchEvent(new CustomEvent('activate'))
        }
      }
    }
  }
</script>
