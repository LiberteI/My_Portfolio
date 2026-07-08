#!/usr/bin/env node

import { mkdir, stat } from "node:fs/promises"
import path from "node:path"
import sharp from "sharp"

const root = process.cwd()
const prebakedDir = path.join(root, "src/assets/Museum/prebaked-tex")
const outputDir = path.join(prebakedDir, "compressed-img")

const jobs = [
    { input: "wall-roughness.png", quality: 70 },
    { input: "wall-ao.png", quality: 70 },
    { input: "wall-normal.png", quality: 80 },
    { input: "floor-roughness.png", quality: 70 },
    { input: "floor-ao.png", quality: 70 },
    { input: "floor-normal.png", quality: 80 }
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
        const inputPath = path.join(prebakedDir, job.input)
        const outputName = `${path.parse(job.input).name}.webp`
        const outputPath = path.join(outputDir, outputName)

        await sharp(inputPath)
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
