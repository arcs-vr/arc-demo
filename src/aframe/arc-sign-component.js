/**
 * A-Frame component, that sets an image resource as texture to any child mesh with a material named 'poster'
 * @type {Object}
 */
const ArcSignComponent = {

  schema: {

    /**
     * Selector to the <img/> asset item containing the poster
     */
    poster: {
      type: 'selector',
      required: true
    }
  },

  /**
   * Initialize component
   */
  init () {
    /**
     * Current poster texture
     * @type {?Texture}
     */
    this.texture = null

    /**
     * Loader required for textures
     * @type {TextureLoader}
     */
    this.loader = new THREE.TextureLoader()

    this.bindFunctions()
    this.addEventListeners()
  },

  /**
   * Bind functions to the component
   */
  bindFunctions () {
    this.setPoster = this.setPoster.bind(this)
    this.setPosterToChild = this.setPosterToChild.bind(this)
  },

  /**
   * Set the new poster
   */
  update () {
    this.setPoster()
  },

  /**
   * Add event listeners
   */
  addEventListeners () {
    this.el.addEventListener('model-loaded', this.setPoster)
  },

  /**
   * Remove the event listener
   */
  remove () {
    this.el.removeEventListener('model-loaded', this.setPoster)
  },

  /**
   * Load the texture (from cache) and traverse children with a callback
   */
  setPoster () {
    if (this.texture !== null) {
      this.texture.dispose()
    }

    this.texture = this.loader.load(this.data.poster.src)

    this.texture.wrapS = THREE.RepeatWrapping
    this.texture.wrapT = THREE.RepeatWrapping
    this.texture.flipY = false

    this.el.object3D.traverse(this.setPosterToChild)
  },

  /**
   * Set the poster image as texture to
   * @param {Mesh} child
   */
  setPosterToChild (child) {
    if (!(child instanceof THREE.Mesh)) {
      return
    }

    if (child.material && child.material.name === 'poster') {
      child.material.map = this.texture
      child.material.needsUpdate = true
    }
  }
}

AFRAME.registerComponent('arc-sign', ArcSignComponent)
