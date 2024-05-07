import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export const router = new Router({
  mode: 'hash',
  hash: false,
  routes: [

    {
      path: '/',
      component: () => import(/* webpackChunkName: "intro" */ './vue/DemoIntro'),
      name: 'index'
    },

    {
      path: '/parcour',
      component: () => import(/* webpackChunkName: "aframe-app" */ './vue/ArcsWrapper.vue'),
      name: 'parcour'
    },

    {
      path: '/remote',
      component: () => import(/* webpackChunkName: "remote-selector" */ 'arc-vue-remotes/src/components/ArcRemoteSelector.vue'),
      name: 'remote-selector',
      props: {
        routeDesktop: 'remote-desktop',
        routeSmartphone: 'remote-smartphone'
      }
    },

    {
      path: '/remote/desktop',
      component: () => import(/* webpackChunkName: "arc-desktop" */ 'arc-vue-remotes/src/components/ArcDesktop.vue'),
      name: 'remote-desktop'
    },

    {
      path: '/remote/smartphone',
      component: () => import(/* webpackChunkName: "arc-smartphone" */ 'arc-vue-remotes/src/components/ArcSmartphone.vue'),
      name: 'remote-smartphone'
    }
  ]
})
