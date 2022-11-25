const COMPONENT_SUFFIX = '-controls'

/**
 * Movement controls adapted from supermedium/aframe-extras
 * @type {Object}
 */
const MovementControls = {

  /**
   * Depends on the rotation component
   */
  dependencies: ['rotation'],

  schema: {

    /**
     * Gather movement data and apply it to the element
     */
    enabled: {
      type: 'boolean',
      default: true
    },

    /**
     * Ccontrols to enable
     */
    controls: {
      type: 'array',
      default: ['gamepad', 'trackpad', 'keyboard', 'touch']
    },

    /**
     * Movement speed
     */
    speed: {
      type: 'number',
      default: 0.3,
      min: 0
    },

    /**
     * Allow "flying" (movement along the Y axis)
     */
    fly: {
      type: 'boolean',
      default: false
    },

    /**
     * Selector for the camera element
     */
    camera: {
      default: '[movement-controls] [camera]',
      type: 'selector'
    },

    /**
     * Selector for the element with the player-body component
     */
    playerBody: {
      type: 'selector',
      default: '[movement-controls] [player-body]'
    }
  },

  /**
   * Initialize the component
   */
  init () {
    /**
     * Player body component responsible for allowing or restricting movement
     * @type {?PlayerBodyComponent}
     */
    this.playerBody = null

    /**
     * Reference to the current movement method
     * @type {?Object}
     */
    this.velocityCtrl = null

    /**
     * Velocity of this element
     * @type {Vector3}
     */
    this.velocity = new THREE.Vector3(0, 0, 0)

    /**
     * New position calculated and checked against the player-body component
     * @type {Vector3}
     */
    this.newPosition = new THREE.Vector3(0, 0, 0, 0)

    /**
     * Direction in which the player is headed
     * @type {Quaternion}
     */
    this.heading = new THREE.Quaternion(0, 0, 0, 0)
  },

  /**
   * In case the player-body component loads later
   */
  update () {
    this.playerBody = this.data.playerBody.components['player-body']
  },

  /**
   * Animate this element according to the heading and velocity, if permitted by the player-body component.
   * @param {number} time Scene uptime in seconds
   * @param {number} deltaTime Milliseconds since last frame
   */
  tick (time, deltaTime) {
    if (!deltaTime) {
      return
    }

    if (!this.data.enabled) {
      return
    }

    this.updateVelocityCtrl()

    if (!this.velocityCtrl) {
      return
    }

    // Update velocity. If FPS is too low (below 20 fps or 50ms per frame), reset.
    if (deltaTime > 50) {
      this.velocity.set(0, 0, 0)
      return
    }

    this.updateVelocity(deltaTime)

    if (this.velocity.length() === 0) {
      return
    }

    this.newPosition.copy(this.el.object3D.position)
    this.newPosition.x += this.velocity.x * deltaTime / 1000
    this.newPosition.y += this.velocity.y * deltaTime / 1000
    this.newPosition.z += this.velocity.z * deltaTime / 1000

    if (this.playerBody.allowMovementTo(this.newPosition.clone())) {
      this.el.object3D.position.copy(this.newPosition)
    }
  },

  /**
   * Check for enable movement controls
   */
  updateVelocityCtrl () {
    if (!this.data.enabled) {
      this.velocityCtrl = null
      return
    }

    for (const control of this.data.controls) {
      const controlComponent = this.el.components[control + COMPONENT_SUFFIX]
      if (controlComponent && controlComponent.isVelocityActive()) {
        this.velocityCtrl = controlComponent
        return
      }
    }

    this.velocityCtrl = null
  },

  /**
   * Get the velocity changes from the active component
   *
   * @param {number} deltaTime Milliseconds since last frame
   */
  updateVelocity (deltaTime) {
    if (!this.velocityCtrl || !this.velocityCtrl.getVelocityDelta) {
      return
    }

    if (this.data.enabled === false) {
      return
    }

    const velocityDelta = this.velocityCtrl.getVelocityDelta(deltaTime)

    if (velocityDelta) {
      // Rotate to heading
      this.heading.copy(this.data.camera.object3D.quaternion)
      this.heading.premultiply(this.el.object3D.quaternion)
      velocityDelta.applyQuaternion(this.heading)

      this.velocity.copy(velocityDelta)
      this.velocity.multiplyScalar(this.data.speed * 16.66667)

      if (!this.data.fly) {
        this.velocity.y = 0
      }
    }
  }
}

AFRAME.registerComponent('movement-controls', MovementControls)
