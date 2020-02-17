import 'core-js/features/set'
import 'core-js/features/map'
import 'core-js/features/promise'
import 'core-js/features/object/keys'
import 'core-js/features/object/entries'
import 'core-js/features/object/assign'
import 'regenerator-runtime/runtime'

import Vue      from 'vue'
import {router} from './router.js'

Vue.config.productionTip   = false
Vue.config.ignoredElements = [
  'a-text',
  'a-scene',
  'a-entity',
  'a-sky',
  'a-assets',
  'a-asset-item',
  'a-camera',
  'a-cursor',
  'a-gltf-model'
]

const vm = new Vue({
  // language=Vue
  template: '<router-view :key="$route.fullPath"/>',
  router: router
})

vm.$mount(document.getElementById('app'))

