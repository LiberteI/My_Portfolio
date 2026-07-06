import * as THREE from "three"
import beamVertexShader from "./beam.vert.glsl?raw"
import beamFragmentShader from "./beam.frag.glsl?raw"

const createBeamMaterial = ({ beamColor, beamOrigin, beamAxis, beamLength, beamOpacity = 0.28 }) => {
    return new THREE.ShaderMaterial({
        uniforms: {
            beamColor: { value: new THREE.Color(beamColor) },
            beamOrigin: { value: beamOrigin.clone() },
            beamAxis: { value: beamAxis.clone() },
            beamLength: { value: beamLength },
            beamOpacity: { value: beamOpacity }
        },
        vertexShader: beamVertexShader,
        fragmentShader: beamFragmentShader,
        transparent: true,
        side: THREE.DoubleSide,
        depthWrite: false,
        blending: THREE.AdditiveBlending
    })
}

export default createBeamMaterial
