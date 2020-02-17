const PlayerBodyComponent = {

  /**
   * Bind functions to the component and add event listeners
   */
  init () {
    this.bindFunctions()
    this.addEventListeners()

    /**
     *
     * @type {?Object3D}
     */
    this.floor = null

    /**
     * A raycaster instance with default values.
     * TODO configure via schema
     * @type {THREE.Raycaster}
     */
    this.raycaster = new THREE.Raycaster()
    this.raycaster.near         = 0
    this.raycaster.far          = 20
    this.raycaster.firstHitOnly = true

    /**
     * Main camera object used to calculate the movement direction vector
     * @type {Camera|Group|Object3D}
     */
    this.camera = this.el.sceneEl.camera

    /**
     * The cursor position on screen (it may move, you never know …)
     * @type {Vector3}
     */
    this.cameraPosition = new THREE.Vector3()

    /**
     * Straight down
     * @type {Vector3}
     */
    this.direction = this.camera.up.multiplyScalar(-1)
  },

  /**
   * Bind functions to the component
   */
  bindFunctions () {
    this.floorLoaded = this.floorLoaded.bind(this)
    this.enterVR     = this.enterVR.bind(this)
    this.tick        = AFRAME.utils.throttleTick(this.tick, 68, this)
  },

  /**
   * Add event listeners
   */
  addEventListeners () {
    this.el.sceneEl.addEventListener('floor-loaded', this.floorLoaded)
    this.el.sceneEl.addEventListener('enter-vr', this.enterVR)
  },

  /**
   * Set the camera
   */
  enterVR () {
    this.camera = this.el.sceneEl.camera
  },

  /**
   *
   * @param {CustomEvent} event
   */
  floorLoaded (event) {
    this.floor = event.detail

    this.floor.traverse(this.computeBoundsTree)
  },

  /**
   * Compute the BVH bound tree
   * @param child
   */
  computeBoundsTree (child) {
    if ('isMesh' in child && child.isMesh) {
      child.geometry.computeBoundsTree(this.bvhOptions)
    }
  },

  tick () {
    if (!this.floor) {
      return
    }

    this.camera.updateMatrixWorld()
    this.camera.getWorldPosition(this.cameraPosition)

    this.raycaster.set(this.cameraPosition, this.direction)

    const intersections = this.raycaster.intersectObject(this.floor, true)

    if (intersections.length > 0) {
      const {distance, point} = intersections[0]

      if (distance !== 1.65) {
        this.el.object3D.position.y += 1.65 - distance
      }
    }
  }
}

AFRAME.registerComponent('player-body', PlayerBodyComponent)
