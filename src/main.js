import 'arc-cd/src/_reset.scss'
import 'arc-cd/src/_fonts.scss'
import 'arc-cd/src/_typography.scss'

import Vue from 'vue'
import { ArcVueOptionsPlugin } from 'arc-vue-options-plugin'
import { router } from './router.js'
import { config } from './arc-config.js'

import RouterWrapper from './vue/RouterWrapper.vue'

Vue.use(ArcVueOptionsPlugin, config)

Vue.config.productionTip = false
Vue.config.ignoredElements = [/^a-/]

Vue.prototype.$stats = {
  device_id: null,
  started_at: null,
  first_door_at: null,
  second_door_at: null,
  third_door_at: null,
  completed_at: null,
  remote_connection_type: 'none',
  connected_at: null,
  interactions_count: 0,
  wrong_codes_count: 0,
  numpad_clear_count: 0,
  numpad_number_count: 0,
  numbers_select_count: 0,
  numbers_clear_count: 0,
  numbers_swap_count: 0,
  jump_count: 0
}

const vm = new Vue({
  router: router,
  render (createElement) {
    return createElement(RouterWrapper)
  }
})

vm.$mount(document.getElementById('app'))
