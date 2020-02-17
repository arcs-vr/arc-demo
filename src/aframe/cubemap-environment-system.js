import px from '../../assets/envmap/px.png'
import nx from '../../assets/envmap/nx.png'
import py from '../../assets/envmap/py.png'
import ny from '../../assets/envmap/ny.png'
import pz from '../../assets/envmap/pz.png'
import nz from '../../assets/envmap/nz.png'

/**
 * A-Frame component the loads a cubemap as lighting and/or background texture.
 *
 * @type {object}
 */
const CubemapEnvironmentSystem = {

  schema: {

    /**
     * Also set as visible background. If false, the envMap will only be use as lighting source.
     */
    background: {
      type: 'boolean',
      default: true
    }
  },

  /**
   * Bind listeners to this component
   */
  init () {
    /**
     * @type {CubeTextureLoader}
     */
    this.loader = new THREE.CubeTextureLoader()

    this.bindFunctions()
  },

  /**
   * Bind functions to the component
   */
  bindFunctions () {
    this.envMapLoaded = this.envMapLoaded.bind(this)
  },

  /**
   * Load the tiles
   */
  update () {
    this.cubemap = this.loader.load([px, nx, py, ny, pz, nz], this.envMapLoaded)
  },

  /**
   * Apply the loaded texture
   */
  envMapLoaded () {
    this.el.emit('cubemap-loaded')

    if (this.data.background) {
      this.el.object3D.background = this.cubemap
    }

    this.el.object3D.environment = this.cubemap
  }
}

AFRAME.registerSystem('cubemap-environment', CubemapEnvironmentSystem)
