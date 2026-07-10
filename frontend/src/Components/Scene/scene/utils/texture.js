import * as THREE from "three"

export const configureRepeatingTexture = (texture, repeatX, repeatY, colorSpace = null) => {
    texture.wrapS = THREE.RepeatWrapping
    texture.wrapT = THREE.RepeatWrapping
    texture.repeat.set(repeatX, repeatY)

    if (colorSpace) {
        texture.colorSpace = colorSpace
    }
}

export const inheritTextureTransform = (texture, sourceTexture) => {
    texture.wrapS = sourceTexture.wrapS
    texture.wrapT = sourceTexture.wrapT
    texture.repeat.copy(sourceTexture.repeat)
    texture.offset.copy(sourceTexture.offset)
    texture.center.copy(sourceTexture.center)
    texture.rotation = sourceTexture.rotation
}

export const createCanvasTexture = (canvas, sourceTexture) => {
    const texture = new THREE.CanvasTexture(canvas)
    inheritTextureTransform(texture, sourceTexture)
    return texture
}
