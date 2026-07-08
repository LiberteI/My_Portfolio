---
name: optimize-static-image-assets
description: Optimize static image assets (hero/background images, decorative illustrations, character art, storybook demo assets) offline with Sharp to reduce bundle size and improve page load performance. Use this whenever a page loads large static images, Lighthouse or the Network panel flags large image payloads, decorative assets are contributing to initial page weight, when migrating decorative assets away from next/image, or when prebuilding optimized assets is preferable to request-time image optimization. Also use when the user mentions image compression, WebP conversion, or reducing image file size for a website. Do NOT use for user-uploaded images or images that need runtime/on-the-fly resizing.
---

# Optimize Static Image Assets

## Purpose

Optimize static image assets to reduce bundle size and improve page load performance while maintaining acceptable visual quality.
This skill is specifically for generating optimized files ahead of time instead of depending on runtime or cold-start image optimization.
Bundled resources are available under `BundleResources/` and should be preferred over ad hoc scripts when they fit the task.
In Next.js repos, image optimization is not just an asset-size problem. It is also a rendering-strategy decision:

- keep `next/image` when you benefit from responsive `srcset`, intrinsic sizing, lazy loading, and blur placeholders
- prefer an offline-optimized static asset plus plain `<img>` when the asset is decorative, already pre-sized for its rendered use, or the app intentionally avoids `/_next/image` request-time optimization

Before changing image usage in a Next.js repo, read the relevant local docs in `node_modules/next/dist/docs/` for the current installed version instead of assuming historical Next.js behavior.

---

## When to Use

Use this skill whenever:

- A page loads large static images.
- Lighthouse or Network indicates large image payloads.
- Decorative assets contribute to initial page weight.
- Migrating decorative assets away from next/image.
- Prebuilding optimized assets is better than relying on request-time image optimization, especially for decorative assets or self-hosted deployments.

Do NOT use this skill for user-uploaded images or images that require runtime resizing.

If the repo uses Next.js, also use this skill when an agent needs to decide whether an image should stay on `next/image` or be migrated to an offline-optimized static asset.

---

## Next.js Image Decision

Treat this as a first-class part of the workflow in Next.js codebases.

### Read the current Next docs first

Before editing imports or swapping `<Image>` and `<img>`, read the local docs that match the installed Next version:

- `node_modules/next/dist/docs/01-app/01-getting-started/12-images.md`
- `node_modules/next/dist/docs/01-app/03-api-reference/02-components/image.md`

At minimum, verify:

- how local static imports behave
- whether `width` and `height` are inferred
- when `fill` and `sizes` are required
- current deprecations and renamed props
- whether the built-in optimizer behavior matters for this asset

### Keep `next/image` when

- the image is content-bearing or user-visible primary artwork
- responsive `srcset` generation is valuable
- preventing layout shift depends on intrinsic size handling
- blur placeholders or automatic lazy loading are useful
- the asset should still participate in Next's image optimization pipeline

### Prefer offline optimization plus plain `<img>` when

- the image is decorative and does not need responsive variants
- the asset is already imported statically and rendered at a known size
- the page intentionally avoids `/_next/image` work for latency or hosting reasons
- the image is part of a layered animated scene, background treatment, or other art-directed composition where request-time optimization adds little value
- the component already documents an intentional `next/image` bypass

### Repo-specific note

If the code comments explain why `next/image` is bypassed, preserve that architectural choice unless the user explicitly asks to revisit it.

---

## Workflow

### 1. Identify Images Worth Optimizing

Inspect:

- Network panel
- DevTools
- File size
- Import chain
- Whether the code currently uses `next/image`, a static import, or plain `<img>`
- Whether comments or surrounding code indicate an intentional bypass of `next/image`

Prioritize:

- Hero/background images
- Decorative illustrations
- Island artwork
- Character body parts
- Storybook demo assets

Ignore images that are rarely loaded or already sufficiently optimized.

---

### 2. Determine Whether Optimization Is Necessary

Evaluate two factors.

#### File Size

Large files (hundreds of KB to several MB) are candidates.

#### Display Size

Compare rendered dimensions with source dimensions.

Example:

Rendered:

300 × 300

Source:

1500 × 1500

This usually indicates unnecessary pixels.

For fullscreen backgrounds, compare against the viewport size rather than the DOM element size.

Also evaluate delivery behavior:

- Is the current asset already statically imported and small enough after offline compression?
- Would `next/image` generate useful responsive variants, or would it mostly add `/_next/image` overhead?
- Is the rendered size fixed enough that a single offline-optimized asset is the simpler and faster choice?

---

### 3. Select an Optimization Strategy

Choose based on asset type.

#### Decorative assets

- Aggressively reduce quality.
- Prioritize small file size.
- Consider keeping a static import and rendering with plain `<img>` if the repo intentionally bypasses `next/image`.

#### Primary artwork

- Resize close to rendered dimensions.
- Convert to WebP.
- Usually keep `next/image` unless the codebase has a documented reason not to.

#### Fullscreen backgrounds

- Preserve dimensions if necessary.
- Convert PNG → WebP.

#### Character body parts

Target a maximum file size.

Reduce quality first.

Only reduce dimensions if necessary.

---

### 4. Generate Optimized Assets Offline

Use Sharp.
Prefer the bundled resource scripts in `BundleResources/` first:

- `BundleResources/optimize-static-images.mjs`
- `BundleResources/static-image-optimization-jobs.mjs`

Use them directly or adapt them for the current repo before writing a new one-off optimizer.

Convert only:

```ts
sharp(input)
  .webp({
    quality: 70,
    effort: 6,
  })
  .toFile(output);
```

Resize then convert:

```ts
sharp(input)
  .resize({
    width: 1024,
    withoutEnlargement: true,
  })
  .webp({
    quality: 68,
    effort: 6,
  })
  .toFile(output);
```

For batch processing:

1. Start with an initial width.
2. Choose an initial quality.
3. If the asset exceeds the target size:
   - Reduce quality.
   - If necessary, reduce width.
4. Repeat until the target size is reached.

---

### 5. Preserve Original Assets

Never overwrite the source image.

Recommended structure:

```
public/homepage/home-island.png
public/homepage/compressed-img/home-island.webp
```

Benefits:

- Easy rollback
- Visual comparison
- Future optimization passes

---

### 6. Replace References and Verify

Update imports:

```ts
import island from "./compressed-img/home-island.webp";
```

or update static paths accordingly.

In Next.js repos, do not blindly convert usage patterns. Decide explicitly between:

- static import consumed by `next/image`
- static import consumed by plain `<img>` using `asset.src`
- root-relative public URL usage such as `/homepage/home-island.webp`

Preserve whichever approach matches the repo's current architecture and the asset's role.

Verify:

- Network requests load the optimized asset.
- Initial page load improves.
- Visual quality remains acceptable.
- Decorative assets no longer trigger unnecessary `/_next/image` optimization.
- If `next/image` is retained, confirm `sizes` and sizing behavior are still correct for the rendered layout.
- Lint passes.
- No broken asset references.

---

## Principles

Always follow these principles.

1. Optimize only images that meaningfully affect performance.
2. Preserve original assets alongside optimized versions.
3. Base optimization decisions on rendered usage, not original dimensions alone.
4. Prefer offline optimization over runtime optimization for decorative assets.
5. In Next.js repos, treat `next/image` vs plain `<img>` as an explicit decision, not a default assumption.
6. Validate both performance improvements and visual fidelity before merging.

---

## Checklist

- [ ] Target images identified
- [ ] Optimization strategy selected
- [ ] Assets generated with Sharp
- [ ] Original assets preserved
- [ ] Imports updated
- [ ] Next.js image strategy confirmed against local docs
- [ ] Network verified
- [ ] Visual quality reviewed
- [ ] Lint passed
