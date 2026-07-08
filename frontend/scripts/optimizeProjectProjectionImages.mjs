#!/usr/bin/env node

import { mkdir, stat } from "node:fs/promises"
import path from "node:path"
import sharp from "sharp"

const root = process.cwd()
const imagesDir = path.join(root, "public/images/project-thumbnails")
const outputDir = path.join(imagesDir, "projection-compressed")

const jobs = [
    { input: "portfolio.png", width: 1600, quality: 78 },
    { input: "supervisedLearning.png", width: 1600, quality: 78 },
    { input: "daltutor.png", width: 1600, quality: 78 },
    { input: "iceSpy.png", width: 1467, quality: 78 },
    { input: "agent.png", width: 1600, quality: 78 },
    { input: "KnightThumbnail.png", width: 800, quality: 78 },
    { input: "Bubble.png", width: 328, quality: 78 }
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
        const inputPath = path.join(imagesDir, job.input)
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
                alphaQuality: job.quality,
                effort: 6,
                smartSubsample: true
            })
            .toFile(outputPath)

        const [inputStats, outputStats] = await Promise.all([
            stat(inputPath),
            stat(outputPath)
        ])

        console.log(
            `${job.input} -> projection-compressed/${outputName} ` +
            `(${formatBytes(inputStats.size)} -> ${formatBytes(outputStats.size)})`
        )
    }
}

main().catch((error) => {
    console.error(error)
    process.exitCode = 1
})
