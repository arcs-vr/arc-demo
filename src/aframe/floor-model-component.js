const FloorModelComponent = {

  /**
   * Bind functions to the component and add event listeners
   */
  init () {
    this.bindFunctions()
    this.addEventListeners()
  },

  /**
   * Bind functions to the component
   */
  bindFunctions () {
    this.modelLoaded = this.modelLoaded.bind(this)
  },

  /**
   * Add event listeners
   */
  addEventListeners () {
    this.el.addEventListener('model-loaded', this.modelLoaded)
  },

  modelLoaded () {
    this.el.sceneEl.emit('floor-loaded', this.el.object3D)

    const material       = this.el.object3D.children[0].children[0].material
    material.transparent = true
    material.opacity     = 0
    material.needsUpdate = true
  }
}

AFRAME.registerComponent('floor-model', FloorModelComponent)
