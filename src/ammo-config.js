import Ammo     from 'ammo.js/builds/ammo.wasm.js'
import AmmoWasm from 'ammo.js/builds/ammo.wasm.wasm'

window.Ammo = Ammo.bind(undefined, {
  locateFile (path) {
    if (path.endsWith('.wasm')) {
      return AmmoWasm
    }
    return path
  }
})
