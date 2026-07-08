import { execFile } from "node:child_process"
import { promises as fs } from "node:fs"
import os from "node:os"
import path from "node:path"
import { promisify } from "node:util"

const execFileAsync = promisify(execFile)

const TARGET_MAX_SIZE = 512
const projectRoot = path.resolve(import.meta.dirname, "..")
const museumDir = path.join(projectRoot, "src/assets/Museum")
const outputDir = path.join(museumDir, "prebaked-tex")

const textureJobs = [
    {
        name: "wall",
        source: path.join(museumDir, "wall-texture.jpg"),
        params: {
            normalStrength: 2.1,
            roughnessMin: 0.58,
            roughnessMax: 0.96,
            aoStrength: 0.7
        }
    },
    {
        name: "floor",
        source: path.join(museumDir, "floor-texture.jpg"),
        params: {
            normalStrength: 1.7,
            roughnessMin: 0.28,
            roughnessMax: 0.8,
            aoStrength: 0.5
        }
    }
]

const clamp01 = (value) => Math.max(0, Math.min(1, value))

const runSips = async (args) => {
    await execFileAsync("sips", args, { cwd: projectRoot })
}

const parseBmp = (buffer) => {
    if (buffer.toString("ascii", 0, 2) !== "BM") {
        throw new Error("Unsupported BMP signature")
    }

    const pixelDataOffset = buffer.readUInt32LE(10)
    const dibHeaderSize = buffer.readUInt32LE(14)
    const width = buffer.readInt32LE(18)
    const rawHeight = buffer.readInt32LE(22)
    const planes = buffer.readUInt16LE(26)
    const bitsPerPixel = buffer.readUInt16LE(28)
    const compression = buffer.readUInt32LE(30)

    if (dibHeaderSize < 40) {
        throw new Error("Unsupported BMP header size")
    }

    if (planes !== 1 || compression !== 0) {
        throw new Error("Unsupported BMP encoding")
    }

    if (bitsPerPixel !== 24 && bitsPerPixel !== 32) {
        throw new Error(`Unsupported BMP bit depth: ${bitsPerPixel}`)
    }

    const height = Math.abs(rawHeight)
    const isTopDown = rawHeight < 0
    const bytesPerPixel = bitsPerPixel / 8
    const rowStride = Math.floor((bitsPerPixel * width + 31) / 32) * 4
    const pixels = new Uint8Array(width * height * 4)

    for (let y = 0; y < height; y += 1) {
        const sourceY = isTopDown ? y : height - 1 - y
        const rowOffset = pixelDataOffset + sourceY * rowStride

        for (let x = 0; x < width; x += 1) {
            const sourceOffset = rowOffset + x * bytesPerPixel
            const targetOffset = (y * width + x) * 4
            pixels[targetOffset] = buffer[sourceOffset + 2]
            pixels[targetOffset + 1] = buffer[sourceOffset + 1]
            pixels[targetOffset + 2] = buffer[sourceOffset]
            pixels[targetOffset + 3] = bytesPerPixel === 4 ? buffer[sourceOffset + 3] : 255
        }
    }

    return { width, height, pixels }
}

const encodeBmp = ({ width, height, rgbPixels }) => {
    const rowStride = Math.ceil((width * 3) / 4) * 4
    const pixelArraySize = rowStride * height
    const fileSize = 54 + pixelArraySize
    const buffer = Buffer.alloc(fileSize)

    buffer.write("BM", 0, "ascii")
    buffer.writeUInt32LE(fileSize, 2)
    buffer.writeUInt32LE(54, 10)
    buffer.writeUInt32LE(40, 14)
    buffer.writeInt32LE(width, 18)
    buffer.writeInt32LE(-height, 22)
    buffer.writeUInt16LE(1, 26)
    buffer.writeUInt16LE(24, 28)
    buffer.writeUInt32LE(0, 30)
    buffer.writeUInt32LE(pixelArraySize, 34)
    buffer.writeInt32LE(2835, 38)
    buffer.writeInt32LE(2835, 42)

    for (let y = 0; y < height; y += 1) {
        const rowOffset = 54 + y * rowStride

        for (let x = 0; x < width; x += 1) {
            const sourceOffset = (y * width + x) * 3
            const targetOffset = rowOffset + x * 3
            buffer[targetOffset] = rgbPixels[sourceOffset + 2]
            buffer[targetOffset + 1] = rgbPixels[sourceOffset + 1]
            buffer[targetOffset + 2] = rgbPixels[sourceOffset]
        }
    }

    return buffer
}

const createResponseMaps = ({ width, height, pixels, params }) => {
    const { normalStrength, roughnessMin, roughnessMax, aoStrength } = params
    const luminance = new Float32Array(width * height)
    const roughnessPixels = new Uint8Array(width * height * 3)
    const aoPixels = new Uint8Array(width * height * 3)
    const normalPixels = new Uint8Array(width * height * 3)

    for (let index = 0; index < luminance.length; index += 1) {
        const colorOffset = index * 4
        const red = pixels[colorOffset] / 255
        const green = pixels[colorOffset + 1] / 255
        const blue = pixels[colorOffset + 2] / 255
        luminance[index] = 0.2126 * red + 0.7152 * green + 0.0722 * blue
    }

    const getLuminance = (x, y) => {
        const clampedX = Math.max(0, Math.min(width - 1, x))
        const clampedY = Math.max(0, Math.min(height - 1, y))
        return luminance[clampedY * width + clampedX]
    }

    for (let y = 0; y < height; y += 1) {
        for (let x = 0; x < width; x += 1) {
            const current = getLuminance(x, y)
            const left = getLuminance(x - 1, y)
            const right = getLuminance(x + 1, y)
            const up = getLuminance(x, y - 1)
            const down = getLuminance(x, y + 1)
            const neighborhoodAverage = (left + right + up + down) * 0.25
            const localContrast = Math.abs(current - neighborhoodAverage)
            const roughnessValue = clamp01(
                roughnessMin
                + (1 - current) * (roughnessMax - roughnessMin) * 0.65
                + localContrast * 0.9
            )
            const cavity = clamp01(
                (neighborhoodAverage - current) * aoStrength * 1.6
                + (1 - current) * aoStrength * 0.3
            )
            const aoValue = 1 - cavity
            const dx = (right - left) * normalStrength
            const dy = (down - up) * normalStrength
            const normalLength = Math.hypot(-dx, -dy, 1) || 1
            const normalX = -dx / normalLength
            const normalY = -dy / normalLength
            const normalZ = 1 / normalLength
            const pixelOffset = (y * width + x) * 3
            const roughnessChannel = Math.round(roughnessValue * 255)
            const aoChannel = Math.round(aoValue * 255)

            roughnessPixels[pixelOffset] = roughnessChannel
            roughnessPixels[pixelOffset + 1] = roughnessChannel
            roughnessPixels[pixelOffset + 2] = roughnessChannel

            aoPixels[pixelOffset] = aoChannel
            aoPixels[pixelOffset + 1] = aoChannel
            aoPixels[pixelOffset + 2] = aoChannel

            normalPixels[pixelOffset] = Math.round((normalX * 0.5 + 0.5) * 255)
            normalPixels[pixelOffset + 1] = Math.round((normalY * 0.5 + 0.5) * 255)
            normalPixels[pixelOffset + 2] = Math.round((normalZ * 0.5 + 0.5) * 255)
        }
    }

    return { roughnessPixels, aoPixels, normalPixels }
}

const bakeTextureJob = async (job, tempDir) => {
    const sourceBmpPath = path.join(tempDir, `${job.name}-source.bmp`)
    await runSips([
        "-Z",
        String(TARGET_MAX_SIZE),
        "-s",
        "format",
        "bmp",
        job.source,
        "--out",
        sourceBmpPath
    ])

    const bmpBuffer = await fs.readFile(sourceBmpPath)
    const { width, height, pixels } = parseBmp(bmpBuffer)
    const { roughnessPixels, aoPixels, normalPixels } = createResponseMaps({
        width,
        height,
        pixels,
        params: job.params
    })

    const outputSpecs = [
        { suffix: "roughness", pixels: roughnessPixels },
        { suffix: "ao", pixels: aoPixels },
        { suffix: "normal", pixels: normalPixels }
    ]

    for (const outputSpec of outputSpecs) {
        const bmpPath = path.join(tempDir, `${job.name}-${outputSpec.suffix}.bmp`)
        const pngPath = path.join(outputDir, `${job.name}-${outputSpec.suffix}.png`)
        const bmpOutput = encodeBmp({ width, height, rgbPixels: outputSpec.pixels })

        await fs.writeFile(bmpPath, bmpOutput)
        await runSips([
            "-s",
            "format",
            "png",
            bmpPath,
            "--out",
            pngPath
        ])
    }

    return {
        source: path.relative(projectRoot, job.source),
        width,
        height,
        params: job.params,
        outputs: {
            roughness: path.relative(projectRoot, path.join(outputDir, `${job.name}-roughness.png`)),
            ao: path.relative(projectRoot, path.join(outputDir, `${job.name}-ao.png`)),
            normal: path.relative(projectRoot, path.join(outputDir, `${job.name}-normal.png`))
        }
    }
}

const main = async () => {
    const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "museum-prebake-"))
    const manifest = {
        generatedAt: new Date().toISOString(),
        targetMaxSize: TARGET_MAX_SIZE,
        jobs: {}
    }

    try {
        await fs.mkdir(outputDir, { recursive: true })

        for (const job of textureJobs) {
            manifest.jobs[job.name] = await bakeTextureJob(job, tempDir)
        }

        await fs.writeFile(
            path.join(outputDir, "manifest.json"),
            `${JSON.stringify(manifest, null, 2)}\n`
        )

        console.log(`Prebaked material maps written to ${path.relative(projectRoot, outputDir)}`)
    } finally {
        await fs.rm(tempDir, { recursive: true, force: true })
    }
}

main().catch((error) => {
    console.error(error)
    process.exitCode = 1
})
