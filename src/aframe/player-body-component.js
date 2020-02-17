/**
 * A-Frame component that mimics gravity in order to allow jumping
 *
 * @type {object}
 */
const PlayerBodyComponent = {

  schema: {

    /**
     * Selector for the navigation mash to intersect
     */
    navMeshElement: {
      type: 'selector',
      default: '#nav-mesh'
    },

    /**
     * Keep a minimun distance to the floor
     */
    minDistanceToFloor: {
      type: 'number',
      default: .1
    },

    /**
     * Tolerance used for calculations. Might require higher tolerances for bigger height position ranges due to
     * float/double precision loss.
     */
    tolerance: {
      type: 'number',
      default: .01
    }
  },

  /**
   * Bind functions to the component and add event listeners
   */
  init () {
    /**
     * A raycaster instance with default values.
     * @type {THREE.Raycaster}
     */
    this.raycaster = new THREE.Raycaster()
    this.raycaster.near         = 0
    this.raycaster.far          = 24
    this.raycaster.firstHitOnly = true

    /**
     * The camera position
     * @type {THREE.Vector3}
     */
    this.bodyPosition = this.el.object3D.position
    this.bodyPosition.y = this.data.minDistanceToFloor

    /**
     * World position of the player's body
     * @type {Vector3}
     */
    this.bodyWorldPosition = new THREE.Vector3(0, 0, 0)

    /**
     * Straight down
     * @type {Vector3}
     */
    this.down = this.el.object3D.up.multiplyScalar(-1)

    /**
     * Target world y position
     * @type {number}
     * @public
     */
    this.targetHeight = 0

    /**
     * Jumping state
     * @type {boolean}
     */
    this.isJumping = false

    /**
     * Velocity on the Y axis (induced by gravity)
     * @type {number}
     */
    this.velocity = 0

    /**
     * Storage for intersections
     * @type {Array}
     */
    this.intersections = []

    /**
     * Navigation mesh used as floor
     * @type {?Mesh}
     */
    this.navMesh = null

    this.bindFunctions()
    this.addEventListeners()
  },

  /**
   * Bind functions to the component
   */
  bindFunctions () {
    this.tick              = this.tick.bind(this)
    this.jump              = this.jump.bind(this)
    this.navMeshLoaded     = this.navMeshLoaded.bind(this)
    this.computeBoundsTree = this.computeBoundsTree.bind(this)
  },

  /**
   * Add event listeners
   */
  addEventListeners () {
    this.data.navMeshElement.addEventListener('model-loaded', this.navMeshLoaded)
  },

  /**
   * Remove event listeners
   */
  remove () {
    this.data.navMeshElement.removeEventListener('model-loaded', this.navMeshLoaded)
  },

  /**
   * Add dynamic behavior event listeners
   */
  play () {
    this.el.sceneEl.addEventListener('jump', this.jump)
    this.el.sceneEl.addEventListener('arc-cursor-secondary-click', this.jump)
  },

  /**
   * Remove dynamic behavior event listeners
   */
  pause () {
    this.el.sceneEl.removeEventListener('jump', this.jump)
    this.el.sceneEl.removeEventListener('arc-cursor-secondary-click', this.jump)
  },

  /**
   * Set the navigatioon mesh and compute its bunds tree for faster BVH raycasting
   */
  navMeshLoaded () {
    this.navMesh = this.data.navMeshElement.object3D
    this.navMesh.traverse(this.computeBoundsTree)
  },

  /**
   * Call the computeBoundsTree function on all mesh geometry for faster BVH raycasting
   * @param {Mesh} child
   */
  computeBoundsTree (child) {
    if (!(child instanceof THREE.Mesh)) {
      return
    }

    if (child.geometry.computeBoundsTree) {
      child.geometry.computeBoundsTree()
    }
  },

  /**
   * Set the isJumping flag if permitted (i.e. if the player touches the floor)
   */
  jump () {
    if (this.isJumping === false && this.bodyPosition.y - this.targetHeight < this.data.tolerance) {
      this.el.emit('do-jump')
      this.isJumping = true
    }
  },

  /**
   * Animate the player position using gravity
   *
   * @param {number} time: Total uptime of the scene
   * @param {number} delta: Milliseconds since last frame
   */
  tick (time, delta) {
    if (this.navMesh === null) {
      return
    }

    this.updateTargetHeight()
    this.updatePlayerPosition(delta)
  },

  /**
   * Check for intersections from the camera straight down to the navigation mesh.
   * Update the target height accordingly.
   */
  updateTargetHeight () {
    this.el.object3D.getWorldPosition(this.bodyWorldPosition)
    this.raycaster.set(this.bodyWorldPosition, this.down)

    this.intersections.length = 0
    this.raycaster.intersectObject(this.navMesh, true, this.intersections)

    if (this.intersections.length === 0) {
      return
    }

    this.targetHeight = this.intersections[0].point.y + this.data.minDistanceToFloor
  },

  /**
   * Use a simple gravity simulation to animate the player's position
   * @param {number} delta: Milliseconds since last frame
   */
  updatePlayerPosition (delta) {
    const deltaSeconds = delta / 1000

    if (Math.abs(this.bodyPosition.y - this.targetHeight) <= this.data.tolerance) {
      this.velocity  = this.isJumping ? 5 : 0
      this.isJumping = false
    }

    // new_velocity = velocity + acceleration * time
    this.velocity += (-9.81 * deltaSeconds)

    // new_position = velocity * time (but not lower than the floor)
    this.bodyPosition.y = Math.max(this.targetHeight, this.bodyPosition.y + (this.velocity * deltaSeconds))
  },

  /**
   * Allow or restrict movement to a specific world position
   * @param position
   * @return {boolean}
   * @public
   */
  allowMovementTo (position) {
    position.y = this.bodyPosition.y

    this.raycaster.set(position, this.down)

    this.intersections.length = 0
    this.raycaster.intersectObject(this.navMesh, true, this.intersections)

    if (this.intersections.length === 0) {
      return false
    }

    if (this.intersections[0].object.material.name !== 'nav_mesh_walkable') {
      return false
    }

    return this.intersections[0].distance >= this.data.minDistanceToFloor - this.data.tolerance
  },
}

AFRAME.registerComponent('player-body', PlayerBodyComponent)
