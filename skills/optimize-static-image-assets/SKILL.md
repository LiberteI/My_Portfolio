---
name: optimize-static-image-assets
description: Optimize static website image assets offline with Sharp, especially root-relative files under `public/`, by generating sibling WebP files in `compressed-img/` and updating references only when the asset is used as a lightweight UI image. Use for large thumbnails, decorative images, and static artwork that load on initial render. Do not use for user-uploaded images, runtime resizing, or animated GIF conversion.
---

# Optimize Static Image Assets

## Purpose

Reduce static image payloads by generating offline-optimized assets ahead of time.

This repo-specific skill is for:

- Vite/React apps using root-relative `public/...` asset paths
- thumbnail or decorative images where a single optimized file is enough
- keeping originals untouched and writing optimized variants to sibling `compressed-img/`

This skill is not for:

- user-uploaded images
- runtime/on-the-fly resizing
- converting animated GIFs by default

## Use When

Use this skill when:

- DevTools or Lighthouse shows large image payloads
- a static image is clearly oversized for its rendered use
- a thumbnail can be optimized separately from a higher-detail image
- the repo already serves images from `public/` with plain `<img>` or root-relative URLs

## Repo Rules

### 1. Preserve originals

Never overwrite the source asset.

Preferred structure:

```text
public/images/project-thumbnails/agent.png
public/images/project-thumbnails/compressed-img/agent.webp
```

### 2. Split thumbnail and detail usage when needed

If one image currently serves both UI thumbnail and higher-detail display, split the references first.

In this repo, prefer separate fields such as:

- `thumbnailImage`
- `projectionImage`

Optimize only `thumbnailImage` unless the user explicitly asks to optimize the high-detail asset too.

### 3. Skip animated GIFs by default

Do not run the static WebP workflow on animated GIFs.

Reasons:

- the static optimizer path is for still images
- converting GIFs as if they were static images risks losing animation
- animated assets need a separate workflow, usually `mp4`, `webm`, or animated WebP

If the asset is `.gif`, stop and either:

- leave it alone
- or ask whether to start a separate animated-asset optimization pass

## Workflow

### 1. Identify worth-optimizing images

Check:

- file size
- source dimensions
- rendered role
- whether the image is a thumbnail, decorative asset, or primary detail image

Prioritize:

- thumbnails
- decorative illustrations
- static artwork used in initial render

Ignore:

- already-small images
- animated GIFs unless the user explicitly wants an animation workflow

### 2. Choose width from actual usage

Base resize width on rendered use, not original dimensions alone.

Examples:

- bottom-bar thumbnail: use a modest fixed width such as `328` or `640`
- decorative image with known layout width: size close to that usage
- if the rendered size is already near source size, keep width and only convert format

Always use:

- `withoutEnlargement: true`

### 3. Generate WebP offline

Use Sharp and prefer the bundled script pattern in:

- `BundleResources/optimize-static-images.mjs`

Useful defaults for this repo:

```js
sharp(input)
  .resize({ width, withoutEnlargement: true })
  .webp({
    quality: 70,
    alphaQuality: 70,
    effort: 6,
    smartSubsample: true,
  })
  .toFile(output)
```

For batch processing:

1. choose an initial width
2. choose an initial quality
3. write to sibling `compressed-img/`
4. compare input and output sizes
5. update references only after output exists

### 4. Replace only the intended references

In this repo, preserve root-relative usage such as:

```js
const agentThumb = "/images/project-thumbnails/agent.png"
const agentThumbnailImage = "/images/project-thumbnails/compressed-img/agent.webp"
```

Then point only the thumbnail field to the optimized file:

```js
thumbnailImage: agentThumbnailImage,
projectionImage: agentThumb,
```

Do not blindly replace every use of the original asset.

### 5. Verify

After changes:

- confirm the optimized file exists
- confirm references point to `compressed-img/...`
- confirm the original source is still available for non-thumbnail use
- run the app build
- spot-check visual quality

## Principles

1. Optimize only images that meaningfully affect load cost.
2. Keep original assets.
3. Use sibling `compressed-img/` outputs.
4. Optimize thumbnail/static UI assets first.
5. Keep high-detail assets separate when they serve another purpose.
6. Skip animated GIFs in the static-image workflow.
