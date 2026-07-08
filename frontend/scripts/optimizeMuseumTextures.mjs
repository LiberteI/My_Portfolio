#!/usr/bin/env node

import { mkdir, stat } from "node:fs/promises"
import path from "node:path"
import sharp from "sharp"

const root = process.cwd()
const museumDir = path.join(root, "src/assets/Museum")
const outputDir = path.join(museumDir, "compressed-img")

const jobs = [
    {
        input: "wall-texture.jpg",
        width: 2048,
        quality: 70
    },
    {
        input: "floor-texture.jpg",
        width: 2048,
        quality: 70
    }
]

const formatBytes = (bytes) => {
    if (bytes >= 1024 * 1024) {
        return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
    }

    if (bytes >= 1024) {
        return `${(bytes / 1024).toFixed(0)} KB`
    }

    return `${bytes} B`
}

const main = async () => {
    await mkdir(outputDir, { recursive: true })

    for (const job of jobs) {
        const inputPath = path.join(museumDir, job.input)
        const outputName = `${path.parse(job.input).name}.webp`
        const outputPath = path.join(outputDir, outputName)
        const metadata = await sharp(inputPath).metadata()
        const sourceWidth = metadata.width ?? job.width
        const targetWidth = Math.min(sourceWidth, job.width)

        await sharp(inputPath)
            .resize({
                width: targetWidth,
                withoutEnlargement: true
            })
            .webp({
                quality: job.quality,
                effort: 6,
                smartSubsample: true
            })
            .toFile(outputPath)

        const [inputStats, outputStats] = await Promise.all([
            stat(inputPath),
            stat(outputPath)
        ])

        console.log(
            `${job.input} -> compressed-img/${outputName} ` +
            `(${formatBytes(inputStats.size)} -> ${formatBytes(outputStats.size)})`
        )
    }
}

main().catch((error) => {
    console.error(error)
    process.exitCode = 1
})
