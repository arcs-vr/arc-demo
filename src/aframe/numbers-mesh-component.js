import { IntersectionEvents } from 'aframe-intersection-events/src/IntersectionEvents.js'
import { ArcCursorActions } from 'arc-aframe-cursor/src/arc-cursor-actions.js'

const NumbersMesh = {

  schema: {
    iconTouch: {
      type: 'selector',
      default: '#icon-touch'
    },
    iconCancel: {
      type: 'selector',
      default: '#icon-cancel'
    },
    iconSwap: {
      type: 'selector',
      default: '#icon-swap'
    }
  },

  init () {
    this.numbers = []
    this.spots = []
    this.indices = {}

    this.selected = null
    this.hovered = null
    this.animation = null

    const loader = new THREE.TextureLoader()

    this.iconTouch = loader.load(this.data.iconTouch.src)
    this.iconCancel = loader.load(this.data.iconCancel.src)
    this.iconSwap = loader.load(this.data.iconSwap.src)

    this.bindFunctions()
    this.addEventListeners()
  },

  bindFunctions () {
    this.findAndShuffleNumbers = this.findAndShuffleNumbers.bind(this)
    this.objectIntersected = this.objectIntersected.bind(this)
    this.primaryClick = this.primaryClick.bind(this)
  },

  addEventListeners () {
    this.el.addEventListener('model-loaded', this.findAndShuffleNumbers)
    this.el.addEventListener(IntersectionEvents.OBJECT_CHANGE, this.objectIntersected)
    this.el.sceneEl.addEventListener('arc-cursor-primary-click', this.primaryClick)
  },

  findAndShuffleNumbers () {
    this.findNumbers()
    this.shuffleNumbers()
  },

  findNumbers () {
    for (let i = 1; i <= 6; i++) {
      this.numbers.push(this.el.object3D.getObjectByName(`number_mesh_0${i}`))
      this.spots.push(this.numbers[i - 1].position.clone())
    }
  },

  shuffleNumbers () {
    for (let i = 5; i > 0; i--) {
      const j = Math.floor(Math.random() * i)
      const temp = this.numbers[i]
      this.numbers[i] = this.numbers[j]
      this.numbers[j] = temp
    }

    for (let i = 0; i < 6; i++) {
      this.indices[this.numbers[i].name] = i
      this.numbers[i].position.z = this.spots[i].z
    }
  },

  objectIntersected (event) {
    const newTarget = event.detail.to
    const oldTarget = this.hovered
    this.hovered = newTarget

    if (newTarget === null) {
      if (oldTarget !== null) {
        this.el.sceneEl.emit(
          'arc-cursor-deactivate',
          {
            actions: [
              ArcCursorActions.PRIMARY
            ]
          }
        )
      }

      return
    }

    if (newTarget === this.selected) {
      this.el.sceneEl.emit(
        'arc-cursor-activate',
        {
          actions: [
            {
              name: ArcCursorActions.PRIMARY,
              title: 'Cancel',
              icon: this.iconCancel,
              click: true,
              delay: 1000
            }
          ]
        }
      )

      return
    }

    if (this.selected === null) {
      this.el.sceneEl.emit(
        'arc-cursor-activate',
        {
          actions: [
            {
              name: ArcCursorActions.PRIMARY,
              title: 'Select',
              icon: this.iconTouch,
              click: true,
              delay: 1000
            }
          ]
        }
      )

      return
    }

    this.el.sceneEl.emit(
      'arc-cursor-activate',
      {
        actions: [
          {
            name: ArcCursorActions.PRIMARY,
            title: 'Swap',
            icon: this.iconSwap,
            click: true,
            delay: 1000
          }
        ]
      }
    )
  },

  primaryClick () {
    if (this.hovered === null) {
      return
    }

    if (this.hovered === this.selected) {
      this.el.emit('number-clear')
      this.setSelected(null)
      return
    }

    if (this.selected !== null) {
      this.el.emit('number-swap')
      this.swap(this.hovered, this.selected)
      return
    }

    this.el.emit('number-select')
    this.setSelected(this.hovered)
  },

  setSelected (value) {
    if (this.selected !== null) {
      if (this.animation) {
        this.cancelAnimation()
      }
    }

    this.selected = value

    if (this.selected !== null) {
      if (this.hovered !== null) {
        this.el.sceneEl.emit(
          'arc-cursor-deactivate',
          {
            actions: [ArcCursorActions.PRIMARY]
          }
        )

        this.el.sceneEl.emit(
          'arc-cursor-activate',
          {
            actions: [
              {
                name: ArcCursorActions.PRIMARY,
                title: 'Cancel',
                icon: this.iconCancel,
                click: true,
                delay: 1000
              }
            ]
          }
        )
      }

      this.animateSelected()
    }
  },

  getNumber (name) {
    return this.numbers[this.indices[name]]
  },

  animateSelected () {
    this.animation = AFRAME.ANIME({
      targets: this.getNumber(this.selected).position,
      y: [0, 0.5],
      duration: 400,
      easing: 'easeOutCubic',
      direction: 'alternate',
      autoplay: false,
      loop: true,
      completed: () => {
        this.animation = null
      }
    })
  },

  cancelAnimation () {
    this.animation.pause()
    this.animation = AFRAME.ANIME({
      targets: this.getNumber(this.selected).position,
      y: 0,
      duration: 400,
      easing: 'easeOutCubic',
      completed: () => {
        this.animation = null
      }
    })
  },

  swap (a, b) {
    const numberA = this.getNumber(a)
    const numberB = this.getNumber(b)
    const z = numberA.position.z

    numberA.position.z = numberB.position.z
    numberB.position.z = z

    this.setSelected(null)
  },

  tick (time) {
    if (this.animation) {
      this.animation.tick(time)
    }
  }
}

AFRAME.registerComponent('numbers-mesh', NumbersMesh)
