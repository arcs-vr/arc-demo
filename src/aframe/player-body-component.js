const PlayerBodyComponent = {

  /**
   * @readonly
   */
  schema: {
    playerHeight: {
      type: 'int',
      default: 1.65
    }
  },

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
     * @type {THREE.Raycaster}
     */
    this.raycaster = new THREE.Raycaster()
    this.raycaster.near         = 0
    this.raycaster.far          = 200
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

    /**
     * Target height of the player's head
     * @type {number}
     */
    this.distanceToTargetHeight = 0

    this.targetHeight = this.data.playerHeight
  },

  /**
   * Bind functions to the component
   */
  bindFunctions () {
    this.floorLoaded = this.floorLoaded.bind(this)
    this.enterVR     = this.enterVR.bind(this)
    this.tick        = this.tick.bind(this)
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

  tick (time, delta) {
    if (this.floor === null) {
      return
    }

    this.updateTargetHeight()

    if (this.distanceToTargetHeight !== 0) {
      this.updatePlayerPosition(delta)
    }
  },

  updateTargetHeight () {
    this.camera.updateMatrixWorld()
    this.camera.getWorldPosition(this.cameraPosition)

    this.raycaster.set(this.cameraPosition, this.direction)

    const intersections = this.raycaster.intersectObject(this.floor, true)
    if (intersections.length > 0) {
      this.distanceToTargetHeight = intersections[0].distance
      this.targetHeight           = intersections[0].point.y + this.data.playerHeight
    }
  },

  updatePlayerPosition (delta) {
    const computedPosition = this.el.object3D.position.y + (this.data.playerHeight - this.distanceToTargetHeight)
    this.el.object3D.position.y = this.clamp(this.targetHeight, this.targetHeight + this.data.playerHeight, computedPosition)
  },

  clamp (min, max, value) {
    return value < min ? min : (value > max ? max : value)
  }
}

AFRAME.registerComponent('player-body', PlayerBodyComponent)
