import { IntersectionEvents } from 'aframe-intersection-events/src/IntersectionEvents.js'
import { ArcCursorActions } from 'arc-aframe-cursor/src/arc-cursor-actions.js'

const NumPad = {

  schema: {
    code: {
      type: 'string'
    },
    navMesh: {
      type: 'selector',
      default: '#nav-mesh'
    },
    navMeshSegment: {
      type: 'string'
    },
    iconTouch: {
      type: 'selector',
      default: '#icon-touch'
    }
  },

  init () {
    this.intersections = this.el.components['intersection-events']

    this.code = ''

    this.walkableMaterial = null
    this.doorNavMesh = null
    this.bigDoor = null
    this.smallDoor = null
    this.bigDoorTargetZ = null
    this.smallDoorTargetZ = null

    this.digits = []

    this.iconTouch = new THREE.TextureLoader().load(this.data.iconTouch.src)

    this.bindFunctions()
    this.addEventListeners()
  },

  bindFunctions () {
    this.primaryClick = this.primaryClick.bind(this)
    this.objectIntersected = this.objectIntersected.bind(this)
    this.findNavMeshSegment = this.findNavMeshSegment.bind(this)
    this.findDoorsAndDigits = this.findDoorsAndDigits.bind(this)
  },

  addEventListeners () {
    this.el.addEventListener(IntersectionEvents.OBJECT_CHANGE, this.objectIntersected)
    this.el.sceneEl.addEventListener('arc-cursor-primary-click', this.primaryClick)
    this.data.navMesh.addEventListener('model-loaded', this.findNavMeshSegment)
    this.el.addEventListener('model-loaded', this.findDoorsAndDigits)
  },

  findNavMeshSegment () {
    this.walkableMaterial = this.data.navMesh.object3D.getObjectByName('nav_mesh').material
    this.doorNavMesh = this.data.navMesh.object3D.getObjectByName(this.data.navMeshSegment)
  },

  findDoorsAndDigits () {
    this.bigDoor = this.el.object3D.getObjectByName('numpad_door_big')
    this.smallDoor = this.el.object3D.getObjectByName('numpad_door_small')

    for (let i = 0; i < 6; i++) {
      this.digits.push(this.el.object3D.getObjectByName(`numpad_display_${i}`))
      this.digits[i].material = this.digits[i].material.clone()
      this.digits[i].material.map = this.digits[i].material.map.clone()
      this.digits[i].material.map.wrapS = THREE.RepeatWrapping
      this.digits[i].material.map.wrapT = THREE.RepeatWrapping

      this.digits[i].material.needsUpdate = true
      this.digits[i].material.map.needsUpdate = true
    }

    this.digits = this.digits.reverse()
  },

  tick (time, delta) {
    if (this.bigDoorTargetZ === null || this.smallDoorTargetZ === null) {
      return
    }

    if (this.bigDoor.position.z >= this.bigDoorTargetZ) {
      this.bigDoor.position.z -= delta * 0.001
    }

    if (this.bigDoor.position.z < this.bigDoorTargetZ + 4.7 && this.smallDoor.position.z >= this.smallDoorTargetZ) {
      this.smallDoor.position.z -= delta * 0.001
    }
  },

  objectIntersected (event) {
    const buttonFrom = event.detail.from !== null ? this.getMatchedButton(event.detail.from) : null
    const buttonTo = event.detail.to !== null ? this.getMatchedButton(event.detail.to) : null

    if (buttonFrom !== null && buttonTo === null) {
      this.el.sceneEl.emit(
        'arc-cursor-deactivate',
        {
          actions: [
            ArcCursorActions.PRIMARY
          ]
        }
      )

      return
    }

    if (buttonTo !== null) {
      this.el.sceneEl.emit(
        'arc-cursor-activate',
        {
          actions: [
            {
              name: ArcCursorActions.PRIMARY,
              title: 'Press button',
              icon: this.iconTouch,
              click: true,
              delay: 1000
            }
          ]
        }
      )
    }
  },

  primaryClick () {
    const objectName = this.intersections.intersectedObjectName

    if (!objectName) {
      return
    }

    const button = this.getMatchedButton(objectName)
    if (button !== null) {
      if (button === 'enter') {
        this.testCode()
        return
      }

      if (button === 'clear') {
        this.el.emit('numpad-clear')
        this.resetCode()
        return
      }

      this.appendToCode(button)
    }
  },

  getMatchedButton (objectName) {
    const matches = objectName.match(/^numpad_button_(enter|clear|[0-9])$/)

    if (matches === null) {
      return matches
    }

    return matches[1]
  },

  testCode () {
    if (this.code === this.data.code) {
      this.el.emit('correct-code')
      this.doorNavMesh.material = this.walkableMaterial

      this.bigDoorTargetZ = this.bigDoor.position.z - 9.4
      this.smallDoorTargetZ = this.smallDoor.position.z - 4.7
      return
    }

    this.el.emit('wrong-code')
  },

  resetCode () {
    this.code = ''
    this.updateDigits()
  },

  appendToCode (number) {
    if (this.code.length === 6) {
      return
    }

    this.el.emit('numpad-number')
    this.code += number
    this.updateDigits()
  },

  updateDigits () {
    for (let i = 0; i < this.code.length; i++) {
      const number = Number(this.code[i])
      const x = number % 4
      const y = 3 - Math.floor(number / 4)
      this.digits[i].material.map.offset.set(x * 0.25, y * 0.25) // map is divided in quarters
    }

    for (let i = this.code.length; i < 6; i++) {
      this.digits[i].material.map.offset.set(0, 0)
    }
  }
}

AFRAME.registerComponent('numpad', NumPad)
