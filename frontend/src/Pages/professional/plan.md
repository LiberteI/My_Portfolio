# ArtGalleryScene Performance Optimization Plan

## Goal

Refactor the scene into independently loadable layers so that:

- First paint only loads assets required for the current route.
- Decorative assets never block initial rendering.
- Scene initialization happens only once.
- Route switching becomes instant through camera transitions and layer visibility changes.
- Heavy assets are loaded lazily and reused.

---

# 1. Scene Layer Architecture

Split the scene into four independent layers.

```
ArtGalleryScene
├── CoreLayer
├── ExperienceLayer
├── ProjectLayer
└── DecorativeLayer
```

---

## CoreLayer

Loaded immediately during scene initialization.

Contents:

- Room
- Camera
- Renderer
- Responsive Controller
- Base Lighting
- Table

Purpose:

Provide the minimum environment required for every route.

---

## ExperienceLayer

Loaded only when the Experience page is visited.

Contents:

- Leather desk pad
- Resume
- Experience-specific desk objects

Purpose:

Contains only assets required by the Experience camera view.

---

## ProjectLayer

Loaded only when the Projects page is visited.

Contents:

- Projector rig
- Projection screen
- Pedestal
- Project-specific assets

Purpose:

Contains only assets visible from the Project camera.

---

## DecorativeLayer

Contains all atmosphere-only assets.

Move these models here:

- President Xi
- Beethoven
- Winnie the Pooh
- Flower pot
- Piano
- Bookshelf
- Lamp

These assets should **never block first paint**.

Load after:

- route settles
- camera transition completes
- or `requestIdleCallback()`

---

# 2. Separate Loading From Visibility

Each layer should maintain two independent states.

```ts
loaded: boolean
visible: boolean
```

Meaning:

- **loaded** → assets already exist in memory.
- **visible** → assets are currently rendered.

Route changes should only modify visibility.

Never recreate layers once loaded.

---

# 3. Layer Loader

Each layer exposes:

```ts
ensureLoaded()
```

Behavior:

- Already loaded → immediately show.
- Currently loading → reuse existing Promise.
- Not loaded → load assets once.

Avoid duplicate requests.

---

# 4. Route-specific Initial Loading

Only load assets required for the first visited route.

Example:

### First visit `/experience`

Load:

- CoreLayer
- ExperienceLayer

Do NOT load:

- ProjectLayer
- Project decorations

---

### First visit `/projects`

Load:

- CoreLayer
- ProjectLayer

Do NOT load:

- Experience decorations

---

# 5. Decorative Asset Deferral

DecorativeLayer should load only after the page becomes usable.

Possible triggers:

- Camera transition finished
- `requestIdleCallback`
- Short timeout after first interaction

Decorative assets should never delay LCP.

---

# 6. GLB Optimization

Immediately optimize the largest models.

Priority:

1. `honey_pot.glb`
2. `ludwig_van_beethoven.glb`
3. `shelf.glb`
4. `winnie_the_pooh.glb`
5. `dusty_old_piano.glb`

For each model:

- Check embedded textures
- Reduce texture resolution
- Compress textures
- Compress GLB

Texture optimization usually produces larger gains than geometry compression.

---

# 7. Prioritize Visible Content

Professional routes should render UI immediately.

Display order:

```
Overlay Text
↓

Scene
↓

Decorative Assets
```

The overlay should never wait for all 3D assets.

---

# 8. Route Transition Optimization

Switching between Project and Experience should only perform:

- Camera transition
- Overlay transition
- Layer visibility changes

Never:

- Destroy renderer
- Recreate scene
- Reload GLBs

---

# 9. Heavy Layer Loading State

Heavy layers should display a lightweight loading indicator.

Goal:

- Page becomes interactive immediately.
- User receives feedback while assets stream in.

---

# 10. Background Prefetch

Once the current route is stable:

### After entering Experience

Idle preload:

```
ProjectLayer
```

---

### After entering Projects

Idle preload:

```
ExperienceLayer
```

This keeps future transitions instant without affecting first paint.

---

# Recommended Implementation Order

## Phase 1

- [ ] Split scene into independent layers
- [ ] Add Layer Manager
- [ ] Implement `ensureLoaded()`
- [ ] Separate `loaded` and `visible`

---

## Phase 2

- [ ] Delay DecorativeLayer loading
- [ ] Route-specific minimal asset loading
- [ ] Prevent scene reinitialization

---

## Phase 3

- [ ] Compress largest GLBs
- [ ] Reduce texture resolutions
- [ ] Remove unnecessary embedded textures

---

## Phase 4

- [ ] Add route-specific idle prefetch
- [ ] Add loading states for heavy layers
- [ ] Polish transition timing

---

# Expected Benefits

- Faster Largest Contentful Paint (LCP)
- Smaller initial network payload
- Reduced GPU and CPU work on first load
- No repeated GLB downloads
- Instant Project ↔ Experience transitions
- Better memory reuse
- Cleaner, more maintainable scene architecture
