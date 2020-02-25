const envMapModelSystem = {

  schema: {
    path: {
      default: '/envmap/'
    },
    intensity: {
      default: 1
    },
    fileTypes: {
      default: 'png'
    }
  },

  init () {
    this.loaded = false

    this.envMapLoaded = this.envMapLoaded.bind(this)
  },

  update () {
    const files  = ['px', 'nx', 'py', 'ny', 'pz', 'nz'].map(name => name + '.' + this.data.fileTypes)
    const loader = new THREE.CubeTextureLoader()
    loader.setPath(this.data.path)

    this.envMap          = loader.load(files, this.envMapLoaded)
    this.envMapIntensity = this.data.intensity
  },

  envMapLoaded () {
    this.loaded = true
    this.el.emit('envmap-loaded')
  }
}

AFRAME.registerSystem('envmap-model', envMapModelSystem)
