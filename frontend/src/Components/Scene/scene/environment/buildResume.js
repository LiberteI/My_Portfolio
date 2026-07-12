import * as THREE from "three"
import resumeTextureUrl from "../../../../assets/resume.png"
import { getDisplayPositions, getTableConfig } from "../sceneConfig"

const RESUME_IMAGE_SIZE = {
    width: 595,
    height: 780
}

export const buildResume = (
    scene,
    {
        width = 1.36,
        depth = null,
        deskPadTopOffset = 0.052,
        xOffset = -0.4,
        yOffset = 0.001,
        zOffset = 0,
        rotationX = 0,
        rotationY = 0,
        rotationZ = Math.PI * 0.5,
        resumeLift = 0.002
    } = {}
) => {
    const { tablePosition } = getDisplayPositions()
    const tableConfig = getTableConfig()
    const textureLoader = new THREE.TextureLoader()
    const resumeTexture = textureLoader.load(resumeTextureUrl)
    resumeTexture.colorSpace = THREE.SRGBColorSpace

    const tableTopSurfaceY = tablePosition.y + tableConfig.height + tableConfig.topThickness * 0.5
    const paperAspect = RESUME_IMAGE_SIZE.width / RESUME_IMAGE_SIZE.height
    const paperWidth = width
    const paperDepth = depth ?? paperWidth / paperAspect
    const padTopSurfaceY = tableTopSurfaceY + deskPadTopOffset
    const sharedCenterX = tablePosition.x + xOffset
    const sharedCenterZ = tablePosition.z + zOffset

    const resumePlaneGeometry = new THREE.PlaneGeometry(paperWidth, paperDepth)
    const resumeMaterial = new THREE.MeshBasicMaterial({
        map: resumeTexture,
        transparent: true
    })
    const resumeMesh = new THREE.Mesh(resumePlaneGeometry, resumeMaterial)
    resumeMesh.rotation.set(rotationX - Math.PI * 0.5, rotationY, rotationZ)
    resumeMesh.position.set(
        sharedCenterX,
        padTopSurfaceY + yOffset + resumeLift,
        sharedCenterZ
    )
    scene.add(resumeMesh)

    return {
        resume: resumeMesh,
        dispose() {
            scene.remove(resumeMesh)
            resumePlaneGeometry.dispose()
            resumeMaterial.dispose()
            resumeTexture.dispose()
        }
    }
}
