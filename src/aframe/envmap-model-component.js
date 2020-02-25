const envMapModelComponent = {

  init () {
    this.bindFunctions()
    this.addEventListeners()
  },

  bindFunctions () {
    this.object3dset       = this.object3dset.bind(this)
    this.setEnvMap         = this.setEnvMap.bind(this)
    this.setCubeMapToChild = this.setCubeMapToChild.bind(this)
  },

  addEventListeners () {
    this.el.addEventListener('model-loaded', this.object3dset)
  },

  object3dset () {
    if (this.system.loaded) {
      this.setEnvMap()
      return
    }

    this.el.sceneEl.addEventListener('envmap-loaded', this.setEnvMap)
  },

  setEnvMap () {
    this.el.object3D.traverseVisible(this.setCubeMapToChild)
  },

  setCubeMapToChild (child) {
    if (child.isMesh && child.material) {
      child.material.envMap          = this.system.envMap
      child.material.envMapIntensity = this.system.envMapIntensity
    }
  }
}

AFRAME.registerComponent('envmap-model', envMapModelComponent)
