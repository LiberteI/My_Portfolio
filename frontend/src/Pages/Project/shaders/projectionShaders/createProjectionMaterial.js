import * as THREE from "three"
import projectionVertexShader from "./projection.vert.glsl?raw"
import projectionFragmentShader from "./projection.frag.glsl?raw"

const createProjectionMaterial = ({
    projectionTexture,
    projectionStrength = 1.35,
    exposure = 1.1,
    blackPoint = 0.12,
    whitePoint = 0.88,
    edgeSoftness = 0.08,
    opacityMultiplier = 0.82
}) => {
    return new THREE.ShaderMaterial({
        uniforms: {
            projectionTexture: { value: projectionTexture },
            projectionStrength: { value: projectionStrength },
            exposure: { value: exposure },
            blackPoint: { value: blackPoint },
            whitePoint: { value: whitePoint },
            edgeSoftness: { value: edgeSoftness },
            opacityMultiplier: { value: opacityMultiplier }
        },
        vertexShader: projectionVertexShader,
        fragmentShader: projectionFragmentShader,
        transparent: true,
        depthWrite: false,
        side: THREE.DoubleSide,
        blending: THREE.AdditiveBlending
    })
}

export default createProjectionMaterial
