# Persistent Showcase Architecture

## Goal

Create a seamless transition between **Projects** and **Experience** without tearing down the 3D scene.

The portfolio should feel like a single continuous environment rather than multiple independent webpages.

---

# Design Philosophy

Projects and Experience are **different views of the same exhibition**, not separate pages.

The transition should feel cinematic:

1. Current page UI moves outward and disappears.
2. Camera rotates to the next viewpoint (approximately 180°).
3. Destination UI moves inward and appears.
4. The underlying 3D world never remounts.

---

# Persistent Scene

The following components should remain mounted for the lifetime of the showcase.

- Navigation
- ArtGalleryScene
- Camera
- Camera Controller
- Lighting
- Models
- Environment
- Animation System

These should **never** be recreated when switching between sections.

---

# Replaceable UI Layer

Only the page-specific overlay changes.

Examples:

## Projects

- Project title
- Description
- Tech stack
- Navigation arrows
- Project cards
- View Project button

## Experience

- Timeline
- Experience cards
- Resume button
- Skills
- Company information

The overlay should sit above the scene using absolute positioning.

---

# Transition Flow

## 1. User initiates navigation

```
Projects → Experience
```

Lock user interaction during the transition.

---

## 2. Exit Animation

Current UI moves outward while fading.

Example:

- translateZ away from camera
- scale down
- fade opacity

---

## 3. Camera Transition

Animate camera to the next preset.

Instead of instantly changing camera values:

```
camera.position
camera.rotation
camera.lookAt
```

interpolate smoothly.

The camera may:

- rotate roughly 180°
- slightly move position
- update look target

to create a natural cinematic movement.

---

## 4. Overlay Swap

Once the previous UI has fully exited (or around the midpoint of the camera movement):

```
Projects UI
↓

Experience UI
```

Replace only the overlay.

The scene remains untouched.

---

## 5. Enter Animation

Animate the new UI into place.

Example:

- start slightly compressed
- move inward
- fade to full opacity

---

# Routing Strategy

Do **not** let routing own the scene lifecycle.

Instead:

```
ShowcaseLayout
├── Navbar
├── ArtGalleryScene
├── Camera Controller
└── Overlay
```

The overlay changes based on the current route or view.

Possible routes:

```
/projects
/experience
```

Both routes render the same persistent layout.

Only the overlay content changes.

---

# Scene State

Instead of treating pages as independent React trees:

```
Projects Page
Experience Page
```

treat them as scene states.

Example:

```ts
type SceneView =
    | "projects"
    | "experience";
```

The current scene state determines:

- active overlay
- camera preset
- interaction logic

---

# Camera Presets

Define reusable camera presets.

Example:

```ts
cameraPresets = {
    projects: {
        position,
        target
    },
    experience: {
        position,
        target
    }
}
```

The camera controller simply animates between presets.

---

# Transition State Machine

A small transition state machine keeps animations predictable.

```
Idle
    ↓
Exiting
    ↓
Camera Moving
    ↓
Overlay Swap
    ↓
Entering
    ↓
Idle
```

During any non-idle state:

- disable navigation
- ignore repeated clicks

---

# Component Structure

```
ShowcaseLayout
│
├── Navbar
├── ArtGalleryScene
├── CameraController
├── OverlayManager
│     ├── ProjectsOverlay
│     └── ExperienceOverlay
└── TransitionController
```

Responsibilities:

**ArtGalleryScene**

- renders the world
- stays mounted

**CameraController**

- owns camera presets
- animates camera

**OverlayManager**

- renders page-specific UI

**TransitionController**

- orchestrates transitions
- controls timing
- locks input
- swaps overlays

---

# Benefits

- No expensive scene remounts
- Camera remains alive
- Models stay loaded
- Animations continue uninterrupted
- Smooth cinematic transitions
- Better perceived performance
- Easier to add future sections (Music, About, Contact) using the same transition system

---

# Core Principle

> The scene is permanent.
>
> Pages are simply different viewpoints and UI overlays within the same interactive environment.