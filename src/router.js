import Vue        from 'vue'
import Router     from 'vue-router'
import { config } from './arc-config.js'

Vue.use(Router)

const ArcsWrapper       = () => import(/* webpackChunkName: "aframe-app" */ './vue/ArcsWrapper.vue')
const ArcRemoteSelector = () => import(/* webpackChunkName: "remote-selector" */ 'arc-remotes/src/components/ArcRemoteSelector.vue')
const ArcDesktop        = () => import(/* webpackChunkName: "arc-desktop" */ 'arc-remotes/src/components/ArcDesktop.vue')
const ArcSmartphone     = () => import(/* webpackChunkName: "arc-smartphone" */ 'arc-remotes/src/components/ArcSmartphone.vue')

export const router = new Router({
  mode: 'history',
  hash: false,
  routes: [
    {
      path: '/',
      component: ArcsWrapper,
      props: Object.assign(
        {},
        config,
        {
          routeRemote: 'remote-selector',
        }
      ),
      name: 'index',
    },
    {
      path: '/remote',
      component: ArcRemoteSelector,
      props: {
        routeDesktop: 'remote-desktop',
        routeSmartphone: 'remote-smartphone',
      },
      name: 'remote-selector'
    },
    {
      path: '/remote/desktop',
      component: ArcDesktop,
      props: config,
      name: 'remote-desktop',
    },
    {
      path: '/remote/smartphone',
      component: ArcSmartphone,
      props: config,
      name: 'remote-smartphone',
    },
  ],
})
