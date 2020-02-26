import { ArcEvents } from 'arc-events'

/**
 * A-Frame component, that monkeypatches wasd-controls for camera rigs
 * @type {object}
 */
const CameraRig = {

  dependencies: [
    'wasd-controls'
  ],

  /**
   * Bind functions to the component and add event listeners
   */
  init () {
    /**
     * Main camera object used to calculate the movement direction vector
     * @type {Camera|Group|Object3D}
     */
    this.camera = this.el.sceneEl.camera

    /**
     * Reference to the standard keyboard WASD controls
     * @type {wasd-controls}
     */
    this.wasdControls = this.el.components['wasd-controls']

    /**
     * Movement Vector
     * @type {Vector3}
     */
    this.directionVector = new THREE.Vector3(0, 0, 0)

    /**
     * Player/Camera Rotation
     * @type {Quaternion}
     */
    this.rotationQuaternion = new THREE.Quaternion(0, 0, 0, 0)

    /**
     * Sprint multiplication factor
     * @type {number}
     */
    this.sprintFactor = 1

    this.bindFunctions()
    this.addEventListeners()

    this.monkeyPatchWASDControls()
  },

  /**
   * Bind functions to the component
   */
  bindFunctions () {
    this.enterVR           = this.enterVR.bind(this)
    this.arcsConnected     = this.arcsConnected.bind(this)
    this.getMovementVector = this.getMovementVector.bind(this)
    this.toggleSprint      = this.toggleSprint.bind(this)
  },

  /**
   * Add event listeners
   */
  addEventListeners () {
    this.el.sceneEl.addEventListener('enter-vr', this.enterVR)
    this.el.sceneEl.addEventListener('arc-remote-connected', this.arcsConnected)

    window.addEventListener('keydown', this.toggleSprint)
    window.addEventListener('keyup', this.toggleSprint)
  },

  arcsConnected () {
    this.el.sceneEl.emit('arc-remote-add-listener', {
      events: [ArcEvents.KEYDOWN]
    })
  },

  /**
   * Set the camera
   */
  enterVR () {
    this.camera = this.el.sceneEl.camera
  },

  /**
   * Overrides the wasd-controls component's methods in VR mode.
   * The standard component does not use wasd-controls in VR mode and therefore does not correctly
   * calculate the movement direction vector.

   * @param {Number} delta: Time delta since last tick
   * @return {Vector3}
   */
  getMovementVector (delta) {
    this.camera.getWorldQuaternion(this.rotationQuaternion)
    this.directionVector.copy(this.wasdControls.velocity)
    this.directionVector.multiplyScalar(delta * 20 * this.sprintFactor)
    this.directionVector.applyQuaternion(this.rotationQuaternion)
    this.directionVector.y = 0

    return this.directionVector
  },

  /**
   * Monkey patch the movement direction vector calculation in VR Mode.
   * May be obsolete in future versions.
   */
  monkeyPatchWASDControls () {
    const WASDControls = AFRAME.components['wasd-controls'].Component

    WASDControls.prototype.getMovementVector = this.getMovementVector
  },

  /**
   *
   * @param {KeyboardEvent} event
   */
  toggleSprint (event) {
    if (event.key === 'Shift') {
      this.sprintFactor = event.type === 'keydown' ? 2 : 1
    }
  }
}

AFRAME.registerComponent('camera-rig', CameraRig)
