#!/usr/bin/env node
// Offline optimizer for decorative static assets.
// It keeps the original files and writes sibling .webp files next to them.
//
// Usage examples:
//   node scripts/optimize-static-images.mjs
//   node scripts/optimize-static-images.mjs public/story/story1.png --outputDir=compressed-img
//   node scripts/optimize-static-images.mjs --dir=public/story --width=1024 --outputDir=compressed-img
//   node scripts/optimize-static-images.mjs --glob="public/**/*.png" --quality=68 --effort=5

import { existsSync } from "node:fs";
import { mkdir, readdir, stat } from "node:fs/promises";
import { dirname, extname, join, normalize, parse, relative, resolve, sep } from "node:path";
import { pathToFileURL } from "node:url";
import sharp from "sharp";

const root = resolve(process.cwd());

const DEFAULT_QUALITY = 72;
const DEFAULT_EFFORT = 4;
const DEFAULT_WIDTH = undefined;
const DEFAULT_OUTPUT_DIR = undefined;
const CONFIG_CANDIDATES = [
  "scripts/static-image-optimization-jobs.mjs",
  "scripts/static-image-optimization-jobs.json",
];
const IMAGE_EXTENSIONS = new Set([".png", ".jpg", ".jpeg", ".avif", ".tif", ".tiff"]);
const SKIPPED_ANIMATED_EXTENSIONS = new Set([".gif"]);

function printHelp() {
  console.log(`Optimize decorative static images into sibling WebP files.

Priority:
  1. Explicit file target
  2. Directory/glob mode
  3. Job config file

Usage:
  node scripts/optimize-static-images.mjs [--force] [--quality=72] [--effort=4]
  node scripts/optimize-static-images.mjs public/some/image.png [--width=1024] [--outputDir=compressed-img]
  node scripts/optimize-static-images.mjs --dir=public/story [--width=1024] [--outputDir=compressed-img]
  node scripts/optimize-static-images.mjs --glob="public/**/*.png" [--width=1024] [--outputDir=compressed-img]

Options:
  --dir=PATH         Walk a directory recursively from the current working directory.
  --glob=PATTERN     Match current-working-directory-relative files with a simple glob (supports *, ?, **).
  --width=N          Fallback resize width. If omitted, preserves the source width.
  --outputDir=NAME   Sibling folder name for generated .webp files.
  --force            Regenerate .webp even if it already exists.
  --quality=N        WebP quality (1-100). Default: ${DEFAULT_QUALITY}
  --effort=N         WebP encode effort (0-6). Default: ${DEFAULT_EFFORT}
  Animated GIF inputs are intentionally skipped to avoid flattening animation.
  --help             Show this message.
`);
}

function parseFlagNumber(name, fallback) {
  const prefix = `--${name}=`;
  const raw = process.argv.find((arg) => arg.startsWith(prefix));
  if (!raw) return fallback;
  const value = Number.parseInt(raw.slice(prefix.length), 10);
  if (!Number.isFinite(value)) {
    console.error(`✖ Invalid ${name}: ${raw}`);
    process.exit(1);
  }
  return value;
}

function parseFlagString(name) {
  const prefix = `--${name}=`;
  const raw = process.argv.find((arg) => arg.startsWith(prefix));
  if (!raw) return undefined;
  const value = raw.slice(prefix.length).trim();
  if (!value) {
    console.error(`✖ Invalid ${name}: ${raw}`);
    process.exit(1);
  }
  return value;
}

function isFlag(arg) {
  return arg.startsWith("--");
}

function toPosixPath(value) {
  return value.split(sep).join("/");
}

function isAnimatedInput(filePath) {
  return SKIPPED_ANIMATED_EXTENSIONS.has(extname(filePath).toLowerCase());
}

function normalizeRepoRelativePath(value) {
  const resolved = resolve(root, value);
  return toPosixPath(relative(root, resolved));
}

function outputPath(inputPath, outputDir) {
  const file = parse(inputPath);
  if (!outputDir) return join(file.dir, `${file.name}.webp`);
  return join(file.dir, outputDir, `${file.name}.webp`);
}

async function formatBytes(filePath) {
  const { size } = await stat(filePath);
  if (size >= 1024 * 1024) return `${(size / (1024 * 1024)).toFixed(2)} MB`;
  if (size >= 1024) return `${(size / 1024).toFixed(0)} KB`;
  return `${size} B`;
}

async function readConfigJobs() {
  for (const candidate of CONFIG_CANDIDATES) {
    const fullPath = join(root, candidate);
    if (!existsSync(fullPath)) continue;

    if (candidate.endsWith(".json")) {
      const importedConfig = await import(pathToFileURL(fullPath).href, { with: { type: "json" } });
      return { path: candidate, jobs: importedConfig.default ?? importedConfig };
    }

    const importedConfig = await import(pathToFileURL(fullPath).href);
    return { path: candidate, jobs: importedConfig.default ?? importedConfig.jobs ?? importedConfig };
  }

  return null;
}

function validateConfigJobs(configPath, jobs) {
  if (!Array.isArray(jobs)) {
    console.error(`✖ ${configPath} must export an array of jobs.`);
    process.exit(1);
  }

  for (const [index, job] of jobs.entries()) {
    if (!job || typeof job !== "object") {
      console.error(`✖ Invalid job at ${configPath}[${index}]. Expected an object.`);
      process.exit(1);
    }

    if (typeof job.input !== "string" || job.input.trim() === "") {
      console.error(`✖ Invalid job at ${configPath}[${index}]. "input" is required.`);
      process.exit(1);
    }

    if (isAnimatedInput(job.input)) {
      console.error(`✖ Animated GIFs are not supported by ${configPath}[${index}]. Remove ${job.input} from the batch job list.`);
      process.exit(1);
    }

    const inputPath = join(root, job.input);
    if (!existsSync(inputPath)) {
      console.error(`✖ Missing source image in ${configPath}: ${job.input}`);
      process.exit(1);
    }
  }
}

function buildConfigMap(jobs) {
  return new Map(
    jobs.map((job) => [normalizeRepoRelativePath(job.input), { ...job, input: normalizeRepoRelativePath(job.input) }]),
  );
}

async function walkDirectory(dirPath) {
  const entries = await readdir(dirPath, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = join(dirPath, entry.name);
    if (entry.isDirectory()) {
      files.push(...await walkDirectory(fullPath));
      continue;
    }

    if (!entry.isFile()) continue;
    if (!IMAGE_EXTENSIONS.has(extname(entry.name).toLowerCase())) continue;
    files.push(fullPath);
  }

  return files;
}

function globToRegex(pattern) {
  let regex = "^";

  for (let i = 0; i < pattern.length; i++) {
    const char = pattern[i];
    const next = pattern[i + 1];

    if (char === "*") {
      if (next === "*") {
        const nextNext = pattern[i + 2];
        if (nextNext === "/") {
          regex += "(?:.*/)?";
          i += 2;
          continue;
        }
        regex += ".*";
        i += 1;
        continue;
      }

      regex += "[^/]*";
      continue;
    }

    if (char === "?") {
      regex += "[^/]";
      continue;
    }

    if (char === "/") {
      regex += "/";
      continue;
    }

    if (/[$^+.()|[\]{}\\]/.test(char)) {
      regex += `\\${char}`;
      continue;
    }

    regex += char;
  }

  regex += "$";
  return new RegExp(regex);
}

async function resolveGlob(pattern) {
  const regex = globToRegex(toPosixPath(normalize(pattern)));
  const allFiles = await walkDirectory(root);
  return allFiles
    .map((filePath) => normalizeRepoRelativePath(filePath))
    .filter((relativePath) => regex.test(relativePath));
}

async function resolveDirectory(dirValue) {
  const fullDir = join(root, dirValue);
  if (!existsSync(fullDir)) {
    console.error(`✖ Missing directory: ${dirValue}`);
    process.exit(1);
  }

  const dirStats = await stat(fullDir);
  if (!dirStats.isDirectory()) {
    console.error(`✖ Not a directory: ${dirValue}`);
    process.exit(1);
  }

  const files = await walkDirectory(fullDir);
  return files.map((filePath) => normalizeRepoRelativePath(filePath));
}

function mergeJob(baseJob, overrideJob) {
  return {
    ...baseJob,
    ...overrideJob,
    input: overrideJob.input ?? baseJob.input,
  };
}

async function withResolvedWidth(job, inputPath) {
  if (job.width != null) return job;

  const metadata = await sharp(inputPath).metadata();
  if (!metadata.width) {
    console.error(`✖ Could not determine image width for ${job.input}`);
    process.exit(1);
  }

  return {
    ...job,
    width: metadata.width,
  };
}

async function encodeJob(inputPath, output, job, fallbackQuality, fallbackEffort) {
  const effectiveJob = await withResolvedWidth(job, inputPath);
  const baseQuality = effectiveJob.quality ?? fallbackQuality;
  const minQuality = effectiveJob.minQuality ?? baseQuality;
  const minWidth = effectiveJob.minWidth ?? effectiveJob.width;
  const encodeEffort = effectiveJob.effort ?? fallbackEffort;
  let currentWidth = effectiveJob.width;
  let currentQuality = baseQuality;

  while (true) {
    await sharp(inputPath)
      .resize({ width: currentWidth, withoutEnlargement: true })
      .webp({
        quality: currentQuality,
        alphaQuality: currentQuality,
        effort: encodeEffort,
        smartSubsample: true,
      })
      .toFile(output);

    const { size } = await stat(output);
    const hitTarget = !effectiveJob.targetMaxBytes || size <= effectiveJob.targetMaxBytes;
    const widthFloorReached = currentWidth <= minWidth;
    const qualityFloorReached = currentQuality <= minQuality;

    if (hitTarget || (widthFloorReached && qualityFloorReached)) {
      return { size, width: currentWidth, quality: currentQuality };
    }

    if (!qualityFloorReached) {
      currentQuality = Math.max(minQuality, currentQuality - 4);
      continue;
    }

    if (!widthFloorReached) {
      currentWidth = Math.max(minWidth, Math.floor(currentWidth * 0.85));
      currentQuality = baseQuality;
      continue;
    }
  }
}

if (process.argv.includes("--help")) {
  printHelp();
  process.exit(0);
}

const force = process.argv.includes("--force");
const quality = parseFlagNumber("quality", DEFAULT_QUALITY);
const effort = parseFlagNumber("effort", DEFAULT_EFFORT);
const width = parseFlagNumber("width", DEFAULT_WIDTH);
const outputDir = parseFlagString("outputDir") ?? DEFAULT_OUTPUT_DIR;
const dirArg = parseFlagString("dir");
const globArg = parseFlagString("glob");
const positionalTargets = process.argv.slice(2).filter((arg) => !isFlag(arg));

if (quality < 1 || quality > 100) {
  console.error(`✖ quality must be between 1 and 100. Received ${quality}.`);
  process.exit(1);
}

if (effort < 0 || effort > 6) {
  console.error(`✖ effort must be between 0 and 6. Received ${effort}.`);
  process.exit(1);
}

if (width != null && width <= 0) {
  console.error(`✖ width must be greater than 0. Received ${width}.`);
  process.exit(1);
}

if (positionalTargets.length > 1) {
  console.error("✖ Only one explicit target path is supported per run.");
  process.exit(1);
}

if (dirArg && globArg) {
  console.error("✖ Use either --dir or --glob, not both in the same run.");
  process.exit(1);
}

const configSource = await readConfigJobs();
if (configSource) validateConfigJobs(configSource.path, configSource.jobs);
const configJobs = configSource?.jobs ?? [];
const configMap = buildConfigMap(configJobs);

let runJobs = [];

if (positionalTargets.length === 1) {
  const explicitInput = normalizeRepoRelativePath(positionalTargets[0]);
  const explicitPath = join(root, explicitInput);

  if (isAnimatedInput(explicitInput)) {
    console.error(`✖ Animated GIFs are not supported by this helper. Skip ${positionalTargets[0]} or convert it with an animation-aware workflow.`);
    process.exit(1);
  }

  if (!existsSync(explicitPath)) {
    console.error(`✖ Missing explicit target image: ${positionalTargets[0]}`);
    process.exit(1);
  }

  runJobs = [{
    input: explicitInput,
    width,
    quality,
    effort,
    outputDir,
  }];
} else if (dirArg || globArg) {
  const matchedInputs = dirArg
    ? await resolveDirectory(dirArg)
    : await resolveGlob(globArg);

  if (matchedInputs.length === 0) {
    console.error(`✖ No files matched ${dirArg ? `directory ${dirArg}` : `glob ${globArg}`}.`);
    process.exit(1);
  }

  const defaultJob = {
    width,
    quality,
    effort,
    outputDir,
  };

  runJobs = matchedInputs.map((input) => {
    const configured = configMap.get(input);
    if (!configured) return { input, ...defaultJob };
    return mergeJob({ input, ...defaultJob }, configured);
  });
} else if (configJobs.length > 0) {
  runJobs = configJobs.map((job) =>
    mergeJob(
      {
        input: normalizeRepoRelativePath(job.input),
        width,
        quality,
        effort,
        outputDir,
      },
      { ...job, input: normalizeRepoRelativePath(job.input) },
    ));
} else {
  printHelp();
  process.exit(0);
}

const dedupedJobs = new Map();
for (const job of runJobs) {
  dedupedJobs.set(job.input, job);
}

let generated = 0;
let skipped = 0;

for (const job of dedupedJobs.values()) {
  const inputPath = join(root, job.input);
  const output = outputPath(inputPath, job.outputDir);

  if (!existsSync(inputPath)) {
    console.error(`✖ Missing source image: ${job.input}`);
    process.exit(1);
  }

  if (!force && existsSync(output)) {
    skipped++;
    console.log(`• skip ${job.input} -> ${output.replace(`${root}/`, "")}`);
    continue;
  }

  await mkdir(dirname(output), { recursive: true });

  generated++;
  const result = await encodeJob(inputPath, output, job, quality, effort);

  const before = await formatBytes(inputPath);
  const after = await formatBytes(output);
  const targetNote = job.targetMaxBytes ? `, target<=${Math.round(job.targetMaxBytes / 1024)}KB` : "";
  console.log(`✓ ${job.input} -> ${output.replace(`${root}/`, "")} (${before} -> ${after}, w=${result.width}, q=${result.quality}${targetNote})`);
}

console.log(`\nDone. Generated ${generated} file(s), skipped ${skipped}. Originals were kept.`);
