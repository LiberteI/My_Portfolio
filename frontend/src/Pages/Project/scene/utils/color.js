import * as THREE from "three"

export const getRgbaColor = (hexColor, alpha) => {
    const color = new THREE.Color(hexColor)
    const red = Math.round(color.r * 255)
    const green = Math.round(color.g * 255)
    const blue = Math.round(color.b * 255)

    return `rgba(${red}, ${green}, ${blue}, ${alpha})`
}
