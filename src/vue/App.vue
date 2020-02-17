<template v-once>
    <a-entity id="arcs-app">

        <a-entity @model-loaded="modelLoaded"
                  gltf-model="#gltf-rooms"
                  id="model-rooms"
        />

        <a-entity @model-loaded="modelLoaded"
                  arc-sign="poster: #poster-gaze_navigation"
                  gltf-model="#gltf-arc_sign_floor"
                  position="-116 0 -2"
                  rotation="0 -70 0"
                  scale=".8 .8 .8"
                  v-if="!remoteConnected"
        />

        <a-entity @model-loaded="modelLoaded"
                  arc-sign="poster: #poster-connect_arcs"
                  gltf-model="#gltf-arc_sign_floor"
                  position="-116 0 2"
                  rotation="0 -120 0"
                  scale=".8 .8 .8"
                  v-if="!remoteConnected"
        />

        <a-entity @model-loaded="modelLoaded"
                  arc-sign="poster: #poster-thank_you"
                  gltf-model="#gltf-arc_sign_floor"
                  position="216 0 -2"
                  rotation="0 -70 0"
                  scale=".8 .8 .8"
        />

        <a-entity @model-loaded="modelLoaded"
                  arc-sign="poster: #poster-fill_out_form"
                  gltf-model="#gltf-arc_sign_floor"
                  position="216 0 2"
                  rotation="0 -120 0"
                  scale=".8 .8 .8"
        />

        <a-entity @model-loaded="modelLoaded"
                  gltf-model="#gltf-nav_mesh"
                  id="model-nav_mesh"
                  intersection-events="
                    cursor: [arc-cursor];
                    near: -.4;
                    far: 3.5;
                  "
                  visible="false"
        />

        <a-entity @correct-code="$stats['first_door_at'] = (new Date()).getTime()"
                  @model-loaded="modelLoaded"
                  @numpad-clear="$stats['numpad_clear_count']++"
                  @numpad-number="$stats['numpad_number_count']++"
                  @wrong-code="$stats['wrong_codes_count']++"
                  gltf-model="#gltf-numpad"
                  id="model-numpad-0"
                  intersection-events="
                    cursor: [arc-cursor];
                    near: -.4;
                    far: 1.5;
                  "
                  numpad="
                    code: 303909;
                    navMesh: #model-nav_mesh;
                    navMeshSegment: nav_mesh_door_0;
                  "
                  position="-102 0 0"
        />

        <a-entity @model-loaded="modelLoaded"
                  arc-sign="poster: #poster-find_the_code"
                  arc-sign-connect
                  gltf-model="#gltf-arc_sign_wall"
                  position="-103 0 8"
                  rotation="0 -90 0"
        />

        <a-entity @correct-code="$stats['second_door_at'] = (new Date()).getTime()"
                  @model-loaded="modelLoaded"
                  @numpad-clear="$stats['numpad_clear_count']++"
                  @numpad-number="$stats['numpad_number_count']++"
                  @wrong-code="$stats['wrong_codes_count']++"
                  gltf-model="#gltf-numpad"
                  id="model-numpad-1"
                  intersection-events="
                    cursor: [arc-cursor];
                    near: -.4;
                    far: 1.5;
                  "
                  numpad="
                    code: 271828;
                    navMesh: #model-nav_mesh;
                    navMeshSegment: nav_mesh_door_1;
                  "
        />

        <a-entity @model-loaded="modelLoaded"
                  arc-sign="poster: #poster-secondary_to_jump"
                  arc-sign-connect
                  gltf-model="#gltf-arc_sign_floor"
                  position="8 0 0"
                  rotation="0 -90 0"
                  scale=".8 .8 .8"
                  v-if="remoteConnected"
        />

        <a-entity @correct-code="$stats['third_door_at'] = (new Date()).getTime()"
                  @model-loaded="modelLoaded"
                  @numpad-clear="$stats['numpad_clear_count']++"
                  @numpad-number="$stats['numpad_number_count']++"
                  @wrong-code="$stats['wrong_codes_count']++"
                  gltf-model="#gltf-numpad"
                  id="model-numpad-2"
                  intersection-events="
                    cursor: [arc-cursor];
                    near: -.4;
                    far: 1.5;
                  "
                  numpad="
                    code: 314159;
                    navMesh: #model-nav_mesh;
                    navMeshSegment: nav_mesh_door_2;
                  "
                  position="102 0 0"
        />

        <a-entity @correct-code="onCompleted"
                  @model-loaded="modelLoaded"
                  @numpad-clear="$stats['numpad_clear_count']++"
                  @numpad-number="$stats['numpad_number_count']++"
                  @wrong-code="$stats['wrong_codes_count']++"
                  gltf-model="#gltf-numpad"
                  id="model-numpad-3"
                  intersection-events="
                    cursor: [arc-cursor];
                    near: -.4;
                    far: 1.5;
                  "
                  numpad="
                    code: 161803;
                    navMesh: #model-nav_mesh;
                    navMeshSegment: nav_mesh_door_3;
                  "
                  position="204 0 0"
        />

        <a-entity @model-loaded="modelLoaded"
                  @number-clear="$stats['numbers_clear_count']++"
                  @number-select="$stats['numbers_select_count']++"
                  @number-swap="$stats['numbers_swap_count']++"
                  gltf-model="#gltf-numbers_mesh"
                  id="model-numbers_mesh"
                  intersection-events="
                    cursor: [arc-cursor];
                    near: -.4;
                    far: 12;
                  "
                  numbers-mesh
        />

        <transition appear
                    name="fade"
        >
            <div class="modal"
                 v-if="completed"
            >
                <p>Please fill out the anonymous form and submit your data.</p>
                <router-link :to="{name: 'questions'}"
                             class="button"
                >
                    Open the questionnaire
                </router-link>
            </div>
        </transition>

        <a-entity light="
                    type: ambient;
                    color: #FFF;
                    intensity: 1.2;
                  "
        />

    </a-entity>
</template>

<script>
  import 'aframe-intersection-events'
  import '../aframe/arc-sign-component.js'
  import '../aframe/numpad-component.js'
  import '../aframe/numbers-mesh-component.js'

  import { v4 as uuidv4 } from 'uuid'

  export default {
    name: 'App',

    props: {
      remoteConnected: {
        type: Boolean,
        default: false
      }
    },

    data () {
      return {
        modelCount: 0,
        modelsLoaded: 0,
        completed: false,
        isTouch: false
      }
    },

    async mounted () {
      await this.$nextTick()

      this.isTouch    = window.matchMedia('(pointer: coarse)').matches
      this.modelCount = this.$el.querySelectorAll('[gltf-model]').length
      if (this.modelCount === 0) {
        this.$emit('app-loaded')
      }
    },

    methods: {
      modelLoaded () {
        this.modelsLoaded++

        if (this.modelsLoaded === this.modelCount) {
          this.$emit('app-loaded')
        }
      },

      onCompleted () {
        this.$stats['completed_at'] = (new Date()).getTime()

        if (!this.isTouch) {
          return
        }

        this.submitData()
        const scene = document.querySelector('a-scene')
        scene.addEventListener('exit-vr', this.complete)
        setTimeout(this.complete, 10000)
      },

      complete () {
        this.completed = true
      },

      async submitData () {
        this.checkDeviceId()

        await fetch('https://arc-stats.barthy.koeln/api/v1/walkthrough-statistics', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          referrerPolicy: 'no-referrer',
          body: JSON.stringify(this.$stats)
        })
      },

      checkDeviceId () {
        if (null !== this.$stats['device_id']) {
          return
        }

        const stored = localStorage.getItem('arc-name')
        if (stored) {
          this.$stats['device_id'] = stored
          return
        }

        const id = uuidv4()
        localStorage.setItem('arc-name', id)
        this.$stats['device_id'] = id
      }
    },
  }
</script>

<style lang="scss"
       scoped
>
    @import '~arc-cd/src/variables';
    @import '~arc-cd/src/typography';

    .modal {
        align-items: center;
        background-color: $theme-dark;
        color: $theme-light;
        display: flex;
        flex-direction: column;
        height: 100%;
        justify-content: center;
        position: fixed;
        text-align: center;
        width: 100%;
        z-index: 1000;

        .button {
            background-color: $theme-secondary;
            color: $theme-dark;
            padding: 1rem;
            text-decoration: none;
        }
    }
</style>
