import * as THREE from "three"

export const clamp01 = (value) => {
    return THREE.MathUtils.clamp(value, 0, 1)
}
