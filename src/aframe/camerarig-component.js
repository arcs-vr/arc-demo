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

    this.bindFunctions()
    this.addEventListeners()

    this.monkeyPatchWASDControls()
  },

  /**
   * Bind functions to the component
   */
  bindFunctions () {
    this.enterVR       = this.enterVR.bind(this)
    this.arcsConnected = this.arcsConnected.bind(this)
  },

  /**
   * Add event listeners
   */
  addEventListeners () {
    this.el.sceneEl.addEventListener('enter-vr', this.enterVR)
    this.el.sceneEl.addEventListener('arc-remote-connected', this.arcsConnected)
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
   * Creates the movement vector calculation function.
   *
   * @return {function(): Vector3}
   */
  getMovementVector: (function () {
    const directionVector    = new THREE.Vector3(0, 0, 0)
    const rotationQuaternion = new THREE.Quaternion(0, 0, 0, 0)

    /**
     * Overrides the wasd-controls component's methods in VR mode.
     * The standard component does not use wasd-controls in VR mode and therefore does not correctly
     * calculate the movement direction vector.
     *
     * @param {Number} delta: Time delta since last tick
     *
     * @return {Vector3}
     */
    return function getMovementVector (delta) {
      this.camera.getWorldQuaternion(rotationQuaternion)
      directionVector.copy(this.wasdControls.velocity)
      directionVector.multiplyScalar(delta)
      directionVector.applyQuaternion(rotationQuaternion)
      directionVector.y = this.data.fly ? directionVector.y : 0

      return directionVector
    }
  })(),

  /**
   * Monkey patch the movement direction vector calculation in VR Mode.
   * May be obsolete in future versions.
   */
  monkeyPatchWASDControls () {
    const WASDControls = AFRAME.components['wasd-controls'].Component

    WASDControls.prototype.getMovementVector = this.getMovementVector.bind(this)
  },
}

AFRAME.registerComponent('camera-rig', CameraRig)
