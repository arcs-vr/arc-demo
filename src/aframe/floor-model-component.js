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
    setTimeout(() => {
      this.el.sceneEl.emit('floor-loaded', this.el.object3D)
    }, 300)
  }
}

AFRAME.registerComponent('floor-model', FloorModelComponent)
