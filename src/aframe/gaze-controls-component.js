import { MovementSchema } from 'arc-aframe-movement/src/MovementSchema.js'
import { IntersectionEvents } from 'aframe-intersection-events/src/IntersectionEvents.js'
import { ArcCursorActions } from 'arc-aframe-cursor/src/arc-cursor-actions.js'

const THREE_QUARTER_PI = Math.PI * 0.75

/**
 * A-Frame component, that simulates gamepad movement input for camera rigs
 * @type {object}
 */
export const GazeControls = {

  schema: {

    /**
     * Merge the arc-movement components schema
     */
    ...MovementSchema,

    /**
     * Selector for the navigation mesh to intersect with
     */
    navMesh: {
      type: 'selector'
    },

    /**
     * Selector for the element with the player-body component
     */
    playerBodyElement: {
      type: 'selector',
      default: '[movement-controls] [player-body]'
    },

    /**
     * Selector to the <img/> asset that hold the walk icon
     */
    iconWalk: {
      type: 'selector',
      default: '#icon-walk'
    },

    /**
     * Selector to the <img/> asset that hold the jump icon
     */
    iconJump: {
      type: 'selector',
      default: '#icon-jump'
    }
  },

  /**
   * Initialize component
   */
  init () {
    /**
     * Movement direction
     * @type {Vector3}
     */
    this.velocity = new THREE.Vector3(0, 0, 0)

    /**
     * Normalized movement force
     * @type {Number}
     */
    this.force = 0

    /**
     * Enabled by default
     * @type {Boolean}
     */
    this.enabled = true

    /**
     * World position of the camera
     * @type {Vector3}
     */
    this.cameraPositon = new THREE.Vector3(0, 0, 0)

    /**
     * Axis around which to rotate (Y = Up)
     * @type {Vector3}
     */
    this.rotationAxis = new THREE.Vector3(0, 1, 0)

    /**
     * Angle in radians to rotate around the rotation axis
     * @type {number}
     */
    this.directionAngle = 0

    /**
     * Player Body component use to detect jump possibilities
     * @type {PlayerBodyComponent}
     */
    this.playerBody = this.data.playerBodyElement.components['player-body']

    const loader = new THREE.TextureLoader()

    /**
     * Texture holding the walk icon
     * @type {Texture}
     */
    this.iconWalk = loader.load(this.data.iconWalk.src)

    /**
     * Texture holding the jump icon
     * @type {Texture}
     */
    this.iconJump = loader.load(this.data.iconJump.src)

    this.bindFunctions()
  },

  /**
   * Bind functions to the component
   */
  bindFunctions () {
    this.jump = this.jump.bind(this)
    this.onKeyPress = this.onKeyPress.bind(this)
    this.applyForce = this.applyForce.bind(this)
    this.arcsRemoteConnected = this.arcsRemoteConnected.bind(this)
    this.arcsRemoteDisconnected = this.arcsRemoteDisconnected.bind(this)
    this.onIntersectionStatusChange = this.onIntersectionStatusChange.bind(this)
    this.onIntersectionPositionChange = this.onIntersectionPositionChange.bind(this)
  },

  /**
   * Add Event Listeners
   */
  play () {
    this.el.sceneEl.addEventListener('arc-remote-connected', this.arcsRemoteConnected)
    this.el.sceneEl.addEventListener('arc-remote-disconnected', this.arcsRemoteDisconnected)
    window.addEventListener('keypress', this.onKeyPress)

    if (this.enabled) {
      this.data.navMesh.addEventListener(IntersectionEvents.STATUS_CHANGE, this.onIntersectionStatusChange)
      this.data.navMesh.addEventListener(IntersectionEvents.POSITION_CHANGE, this.onIntersectionPositionChange)
    }
  },

  /**
   * Remove Event Listeners
   */
  pause () {
    this.el.sceneEl.removeEventListener('arc-remote-connected', this.arcsRemoteConnected)
    this.el.sceneEl.removeEventListener('arc-remote-disconnected', this.arcsRemoteDisconnected)
    window.removeEventListener('keypress', this.onKeyPress)

    if (this.enabled) {
      this.data.navMesh.removeEventListener(IntersectionEvents.STATUS_CHANGE, this.onIntersectionStatusChange)
      this.data.navMesh.removeEventListener(IntersectionEvents.POSITION_CHANGE, this.onIntersectionPositionChange)
    }

    this.deactivateActions()
  },

  /**
   * Activate the jump action with a delay of 1 second
   */
  activateJumpAction () {
    this.el.sceneEl.emit(
      'arc-cursor-activate',
      {
        actions: [
          {
            name: ArcCursorActions.SECONDARY,
            title: 'Jump',
            icon: this.iconJump,
            delay: 1000,
            callback: this.jump
          }
        ]
      }
    )
  },

  /**
   * Activate the walk action with a delay of 300 milliseconds
   */
  activateWalkAction () {
    this.el.sceneEl.emit(
      'arc-cursor-activate',
      {
        actions: [
          {
            name: ArcCursorActions.PRIMARY,
            title: 'Walk',
            icon: this.iconWalk,
            delay: 300,
            callback: this.applyForce
          }
        ]
      }
    )
  },

  /**
   * Deactivate one or both actions
   */
  deactivateActions (actions = [ArcCursorActions.PRIMARY, ArcCursorActions.SECONDARY]) {
    this.el.sceneEl.emit(
      'arc-cursor-deactivate',
      {
        actions: actions
      }
    )
  },

  /**
   * Deactivate this component as soon as a keyboard is detected
   * @param {KeyboardEvent} event
   */
  onKeyPress (event) {
    if (['keya', 'keyw', 'keys', 'keyd'].includes(event.code.toLowerCase())) {
      this.deactivateActions()
      this.pause()
      this.enabled = false
    }
  },

  /**
   * Detect changes in the intersection with the navigation mesh. Enable or disable the actions accordingly.
   * @param {CustomEvent} event
   */
  onIntersectionStatusChange (event) {
    if (event.detail.to) {
      this.activateWalkAction()

      return
    }

    this.deactivateActions()
    this.resetForce()
  },

  /**
   * Move forward and emit the jump event. Reset the force if the player was not moving before the jump.
   */
  jump () {
    this.force = 1

    this.el.emit('jump')

    if (this.isWalking === false) {
      setTimeout(this.resetForce, 300)
    }

    this.willJump = false
  },

  /**
   * Start walking
   */
  applyForce () {
    this.isWalking = true
    this.force = 1
  },

  /**
   * Stop walking
   */
  resetForce () {
    this.isWalking = false
    this.force = 0
  },

  /**
   * Determine whether the intersected position requires a jump. If so, statr the timer.
   * @param {CustomEvent} event
   */
  onIntersectionPositionChange (event) {
    this.targetPosition = event.detail

    if (this.playerBody.navMesh === null) {
      return
    }

    if ((this.targetPosition.y - this.playerBody.targetHeight) > 0.1) {
      if (this.willJump) {
        return
      }

      this.willJump = true
      this.activateJumpAction()
      return
    }

    if (this.willJump) {
      this.deactivateActions([ArcCursorActions.SECONDARY])
      this.willJump = false
    }
  },

  /**
   * Activate remote event listeners and add joystick event listeners
   */
  arcsRemoteConnected () {
    this.pause()
    this.enabled = false
  },

  /**
   * Remove joystick event listeners
   */
  arcsRemoteDisconnected () {
    this.play()
    this.enabled = true
  },

  /**
   * Do not get velocity delta if this component is disabled or the force is zero.
   * @return {boolean}
   */
  isVelocityActive () {
    return this.enabled && this.force !== 0
  },

  /**
   * Get the velocity delta handled in the movement controls component
   * @param {Number} delta Milliseconds sind last frame
   * @return {Vector3}
   * @public
   */
  getVelocityDelta (delta) {
    if (!this.enabled) {
      this.velocity.set(0, 0, 0)
      return this.velocity
    }

    const scalarFactor = delta * 0.001 * this.force

    this.el.sceneEl.camera.getWorldPosition(this.cameraPositon)

    this.cameraPositon.y = 0
    this.targetPosition.y = 0

    this.velocity.set(1, 0, 1)

    this.directionAngle = this.cameraPositon.angleTo(this.targetPosition) + THREE_QUARTER_PI
    this.velocity.applyAxisAngle(this.rotationAxis, this.directionAngle)
    this.velocity.normalize()

    this.velocity.multiplyScalar(scalarFactor)

    return this.velocity.clone()
  }
}

AFRAME.registerComponent('gaze-controls', GazeControls)
