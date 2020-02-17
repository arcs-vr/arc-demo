import { ArcEvents } from 'arc-events'

/**
 * A-Frame component, that simulates gamepad movement input for camera rigs
 * @type {object}
 */
const GamepadMovement = {
  schema: {
    acceleration: {default: 200},
    fly: {default: false}
  },

  /**
   * Bind functions to the component and add event listeners
   */
  init () {
    /**
     * Main camera object used to calculate the movement direction vector
     * @type {Camera|Group|Object3D}
     */
    this.camera = this.el.sceneEl.camera
    this.rotationAxis   = new THREE.Vector3(0, 1, 0)
    this.movementVector = new THREE.Vector3(0, 0, 0)

    this.force   = 0
    this.radians = 0

    this.bindFunctions()
    this.addEventListeners()
  },

  /**
   * Bind functions to the component
   */
  bindFunctions () {
    this.enterVR        = this.enterVR.bind(this)
    this.arcsConnected  = this.arcsConnected.bind(this)
    this.onJoystickMove = this.onJoystickMove.bind(this)

    this.tick = AFRAME.utils.throttleTick(this.tick, 34, this)
  },

  /**
   * Add event listeners
   */
  addEventListeners () {
    this.el.sceneEl.addEventListener('enter-vr', this.enterVR)
    this.el.sceneEl.addEventListener('arc-remote-connected', this.arcsConnected)
    window.addEventListener('stickmove', this.onJoystickMove)
  },

  /**
   * Activate remote event listeners
   */
  arcsConnected () {
    this.el.sceneEl.emit('arc-remote-add-listener', {
      events: [ArcEvents.STICKMOVE]
    })
  },

  /**
   * Set the camera
   */
  enterVR () {
    this.camera = this.el.sceneEl.camera
  },

  /**
   * Extract movement data from incoming events
   * @param {CustomEvent} event
   */
  onJoystickMove (event) {
    this.radians = event.detail ? event.detail.radians : 0
    this.force   = event.detail ? event.detail.force : 0
  },

  /**
   * Calculate the new position
   *
   * @param {Number} time: global scene uptime
   * @param delta: time since last frame
   */
  tick (time, delta) {
    if (this.force <= 0) {
      return
    }

    this.setMovementVector(delta / 1000)
    this.el.object3D.position.add(this.movementVector)
  },

  /**
   * Creates the movement vector calculation function.
   *
   * @param {Number} delta: Time delta since last tick
   */
  setMovementVector (delta) {
    this.camera.getWorldDirection(this.movementVector)

    this.movementVector.multiplyScalar(-1)

    this.movementVector.applyAxisAngle(this.rotationAxis, this.radians)
    this.movementVector.multiplyScalar(this.force * (this.data.acceleration / 100) * delta)

    this.movementVector.y = this.data.fly ? this.movementVector.y : 0
  }
}

AFRAME.registerComponent('gamepad-movement', GamepadMovement)
