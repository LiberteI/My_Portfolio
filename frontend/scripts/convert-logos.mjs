import fs from "node:fs/promises"
import path from "node:path"
import sharp from "sharp"
import { fileURLToPath } from "node:url"

const scriptFilePath = fileURLToPath(import.meta.url)
const scriptDirectory = path.dirname(scriptFilePath)
const frontendRoot = path.resolve(scriptDirectory, "..")

const config = {
  inputDir: path.resolve(frontendRoot, "public/images/company-icons"),
  outputDir: path.resolve(frontendRoot, "public/images/company-icons/vintage"),
  canvasSize: 256,
  padding: 22,
  inkColor: "#4A3A2A",
  inkOpacity: 0.82,
  contrast: 1.35,
  thresholdEnabled: false,
  threshold: 150,
  distressEnabled: true,
  distressStrength: 0.04,
  blurSigma: 0.3,
  svgDensity: 768,
  allowWebpInput: true
}

const SUPPORTED_EXTENSIONS = new Set([".png", ".svg", ".webp"])

const clamp = (value, min, max) => Math.min(max, Math.max(min, value))

const parseHexColor = (hex) => {
  const normalizedHex = hex.replace("#", "")

  if (!/^[0-9a-f]{6}$/i.test(normalizedHex)) {
    throw new Error(`Invalid ink color: ${hex}`)
  }

  return {
    r: Number.parseInt(normalizedHex.slice(0, 2), 16),
    g: Number.parseInt(normalizedHex.slice(2, 4), 16),
    b: Number.parseInt(normalizedHex.slice(4, 6), 16)
  }
}

const createSeedFromName = (name) => {
  let hash = 2166136261

  for (let index = 0; index < name.length; index += 1) {
    hash ^= name.charCodeAt(index)
    hash = Math.imul(hash, 16777619)
  }

  return hash >>> 0
}

const createSeededRandom = (seed) => {
  let state = seed || 1

  return () => {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0
    return state / 0x100000000
  }
}

const createDeterministicDistress = (filename, width, height) => {
  const seed = createSeedFromName(filename)
  const random = createSeededRandom(seed)
  const coarseWidth = Math.max(8, Math.ceil(width / 10))
  const coarseHeight = Math.max(8, Math.ceil(height / 10))
  const coarseNoise = new Float32Array(coarseWidth * coarseHeight)

  for (let index = 0; index < coarseNoise.length; index += 1) {
    coarseNoise[index] = random()
  }

  return (x, y) => {
    const gridX = clamp(Math.floor((x / width) * coarseWidth), 0, coarseWidth - 1)
    const gridY = clamp(Math.floor((y / height) * coarseHeight), 0, coarseHeight - 1)
    const localX = clamp((x / width) * coarseWidth - gridX, 0, 1)
    const localY = clamp((y / height) * coarseHeight - gridY, 0, 1)
    const nextX = Math.min(gridX + 1, coarseWidth - 1)
    const nextY = Math.min(gridY + 1, coarseHeight - 1)

    const topLeft = coarseNoise[gridY * coarseWidth + gridX]
    const topRight = coarseNoise[gridY * coarseWidth + nextX]
    const bottomLeft = coarseNoise[nextY * coarseWidth + gridX]
    const bottomRight = coarseNoise[nextY * coarseWidth + nextX]
    const top = topLeft * (1 - localX) + topRight * localX
    const bottom = bottomLeft * (1 - localX) + bottomRight * localX

    return top * (1 - localY) + bottom * localY
  }
}

const collectSourceFiles = async (directoryPath) => {
  const entries = await fs.readdir(directoryPath, { withFileTypes: true })

  return entries
    .filter((entry) => entry.isFile())
    .map((entry) => ({
      name: entry.name,
      extension: path.extname(entry.name).toLowerCase(),
      fullPath: path.join(directoryPath, entry.name)
    }))
}

const buildRasterizedPipeline = (filePath, extension) => {
  if (extension === ".svg") {
    return sharp(filePath, { density: config.svgDensity })
  }

  return sharp(filePath)
}

const buildInkMask = async (inputBuffer, filename) => {
  const { data, info } = await sharp(inputBuffer)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true })

  const grayscale = new Float32Array(info.width * info.height)
  let minLuminance = 255
  let maxLuminance = 0

  for (let index = 0; index < data.length; index += 4) {
    const pixelIndex = index / 4
    const r = data[index]
    const g = data[index + 1]
    const b = data[index + 2]
    const alpha = data[index + 3]

    if (alpha === 0) {
      grayscale[pixelIndex] = 255
      continue
    }

    // Perceived luminance avoids treating blue/orange logos as if each channel mattered equally.
    const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b
    grayscale[pixelIndex] = luminance
    minLuminance = Math.min(minLuminance, luminance)
    maxLuminance = Math.max(maxLuminance, luminance)
  }

  const grayscaleRange = Math.max(1, maxLuminance - minLuminance)
  const distressAt = createDeterministicDistress(filename, info.width, info.height)
  const mask = Buffer.alloc(info.width * info.height)

  for (let index = 0; index < data.length; index += 4) {
    const pixelIndex = index / 4
    const alpha = data[index + 3] / 255

    if (alpha <= 0) {
      mask[pixelIndex] = 0
      continue
    }

    const normalizedGray = (grayscale[pixelIndex] - minLuminance) / grayscaleRange
    const contrastedGray = clamp((normalizedGray - 0.5) * config.contrast + 0.5, 0, 1)

    // Opaque white details must survive, so alpha is the primary occupancy signal.
    // Luminance only modulates coverage slightly to keep anti-aliased edges readable.
    let coverage = alpha * clamp(0.82 + (1 - contrastedGray) * 0.18, 0, 1)

    if (config.thresholdEnabled) {
      const threshold = config.threshold / 255
      coverage = alpha * (contrastedGray <= threshold ? 1 : 0)
    }

    // Transparent negative space is preserved because pixels with zero source alpha stay zero here.
    if (config.distressEnabled && config.distressStrength > 0) {
      const distressNoise = distressAt(pixelIndex % info.width, Math.floor(pixelIndex / info.width))
      const fadedAmount = Math.max(0, distressNoise - 0.7) / 0.3
      coverage *= 1 - fadedAmount * config.distressStrength
    }

    mask[pixelIndex] = Math.round(clamp(coverage, 0, 1) * 255)
  }

  return { mask, width: info.width, height: info.height }
}

const convertLogo = async (file) => {
  const parsedName = path.parse(file.name)
  const outputPath = path.join(config.outputDir, `${parsedName.name}.png`)
  const rasterized = buildRasterizedPipeline(file.fullPath, file.extension)

  const trimmedBuffer = await rasterized
    .ensureAlpha()
    .trim()
    .resize({
      width: config.canvasSize - config.padding * 2,
      height: config.canvasSize - config.padding * 2,
      fit: "inside",
      withoutEnlargement: true,
      background: { r: 0, g: 0, b: 0, alpha: 0 }
    })
    .png()
    .toBuffer()

  const { mask, width, height } = await buildInkMask(trimmedBuffer, file.name)
  const ink = parseHexColor(config.inkColor)
  const coloredInk = Buffer.alloc(width * height * 4)

  for (let index = 0; index < mask.length; index += 1) {
    const alpha = Math.round(mask[index] * config.inkOpacity)
    const offset = index * 4

    coloredInk[offset] = ink.r
    coloredInk[offset + 1] = ink.g
    coloredInk[offset + 2] = ink.b
    coloredInk[offset + 3] = alpha
  }

  let output = sharp(coloredInk, {
    raw: {
      width,
      height,
      channels: 4
    }
  })

  if (config.blurSigma > 0) {
    output = output.blur(config.blurSigma)
  }

  await output
    .extend({
      top: Math.floor((config.canvasSize - height) / 2),
      bottom: Math.ceil((config.canvasSize - height) / 2),
      left: Math.floor((config.canvasSize - width) / 2),
      right: Math.ceil((config.canvasSize - width) / 2),
      background: { r: 0, g: 0, b: 0, alpha: 0 }
    })
    .png({ compressionLevel: 9, adaptiveFiltering: true })
    .toFile(outputPath)

  const metadata = await sharp(outputPath).metadata()

  return {
    outputPath,
    metadata
  }
}

const main = async () => {
  await fs.mkdir(config.outputDir, { recursive: true })

  const files = await collectSourceFiles(config.inputDir)
  const summary = {
    processed: 0,
    skipped: 0,
    failed: 0,
    generated: []
  }

  for (const file of files) {
    if (!SUPPORTED_EXTENSIONS.has(file.extension)) {
      console.log(`skip ${file.name} (unsupported extension)`)
      summary.skipped += 1
      continue
    }

    if (file.extension === ".webp" && !config.allowWebpInput) {
      console.log(`skip ${file.name} (webp input disabled)`)
      summary.skipped += 1
      continue
    }

    if (file.fullPath.startsWith(config.outputDir)) {
      summary.skipped += 1
      continue
    }

    try {
      const result = await convertLogo(file)
      summary.processed += 1
      summary.generated.push({
        source: file.name,
        output: path.relative(process.cwd(), result.outputPath),
        metadata: result.metadata
      })

      console.log(`ok   ${file.name} -> ${path.basename(result.outputPath)}`)
    } catch (error) {
      summary.failed += 1
      console.error(`fail ${file.name}: ${error.message}`)
    }
  }

  console.log("")
  console.log("summary")
  console.log(`processed: ${summary.processed}`)
  console.log(`skipped: ${summary.skipped}`)
  console.log(`failed: ${summary.failed}`)

  if (summary.failed > 0) {
    process.exitCode = 1
  }
}

main().catch((error) => {
  console.error(`fatal: ${error.message}`)
  process.exit(1)
})
