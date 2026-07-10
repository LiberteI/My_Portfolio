# Project Page First Render Optimization

## Goal

Improve the first render speed of the project page by reducing the amount of work required before the scene is displayed.

The focus is to **remove unnecessary runtime work**, not simply postpone it.

---

# 1. Compress Project Screen Textures

The projected screen image is one of the largest assets loaded during startup.

## What to do

- Compress all project screen images.
- Prefer WebP or AVIF over PNG whenever possible.
- Resize textures to match their actual display resolution.
- Avoid shipping unnecessarily large source images.

## Benefits

- Smaller network transfer
- Faster texture decoding
- Faster GPU upload
- Lower GPU memory usage

---

# 2. Precompute Material Maps

Avoid generating material response maps during runtime.

If wall or floor roughness, AO, or normal maps are created in JavaScript, generate them offline instead.

## Runtime

```txt
Load finished textures
↓
Create material
↓
Render
```

instead of

```txt
Load texture
↓
Generate maps
↓
Create material
↓
Render
```

## Recommended assets

```txt
wall-color.webp
wall-roughness.webp
wall-normal.webp
wall-ao.webp

floor-color.webp
floor-roughness.webp
floor-normal.webp
floor-ao.webp
```

## Benefits

- Less CPU work
- Faster scene initialization
- Simpler runtime code

---

# 3. Optimize Projector Assets

Reduce the cost of loading the projector model.

## What to do

- Compress the GLB.
- Remove unused meshes.
- Remove unused materials.
- Resize embedded textures.
- Compress textures using WebP where possible.

## Benefits

- Smaller downloads
- Faster parsing
- Lower memory usage

---

# 4. Avoid Expensive Materials

Only use advanced materials where they provide visible benefits.

## Prefer

```js
MeshStandardMaterial
```

instead of

```js
MeshPhysicalMaterial
```

unless features like transmission, clearcoat, or advanced reflections are actually needed.

## Benefits

- Less shader complexity
- Lower GPU workload
- Faster material compilation

---

# 5. Optimize Texture Formats

Use the most appropriate texture format for each asset.

## Recommendations

- WebP / AVIF for standard image textures.
- KTX2 / Basis for large Three.js textures.

## Benefits

- Smaller downloads
- Faster GPU uploads
- Lower VRAM usage

---

# Optimization Priority

1. Compress project screen textures.
2. Precompute wall and floor material maps.
3. Compress and simplify the projector model.
4. Replace unnecessary `MeshPhysicalMaterial` instances.
5. Use more efficient texture formats.

---

# Philosophy

The fastest work is the work that never needs to happen.

Instead of moving expensive operations later in the loading process, prioritize removing unnecessary runtime computation through asset optimization and offline preprocessing.