# ProjectScene Refactor Plan

## Goal

Refactor `ProjectScene.jsx` from a monolithic implementation into a composition of independent, reusable scene subsystems.

The end goal is for `ProjectScene.jsx` to orchestrate the scene rather than own every implementation detail.

---

# Current Responsibilities

`ProjectScene.jsx` currently owns multiple unrelated concerns:

- Static scene configuration
- Projection analysis
- Adaptive projector lighting
- Material and texture generation
- Environment construction
- Camera and responsive calculations
- Debug helpers
- Pointer interaction
- Animation loop
- Lifecycle setup and cleanup
- Optional movement controls

These responsibilities should be separated into dedicated modules.

---

# 1. Extract Configuration

Move all pure configuration functions into standalone modules.

### Candidate Functions

- `getProjectionFrameConfig()`
- `getDisplayPositions()`
- `getCameraConfig()`
- `getResponsiveResizeConfig()`
- `getProjectionRenderConfig()`
- `lightParam()`

### Suggested Structure

```text
scene/
    sceneConfig.js
    cameraConfig.js
    lightingConfig.js
```

These files should contain no Three.js logic—only constants and configuration.

---

# 2. Projection & Adaptive Lighting

These functions form a natural subsystem.

### Candidate Functions

- `analyzeProjectionTexture()`
- `buildAdaptiveLightingState()`
- `initializeAdaptiveProjectorLighting()`
- `applyAdaptiveLightingTargets()`
- `updateAdaptiveProjectorLighting()`
- `buildProjectionScreen()`

### Suggested Structure

```text
projection/
    projectionAnalysis.js
    adaptiveLighting.js
    buildProjectionScreen.js
```

Responsibilities include:

- projection texture analysis
- adaptive light state
- screen creation
- projector surface behavior

---

# 3. Environment Module

The room construction and material generation belong together.

### Candidate Functions

- `cloneUvAttribute()`
- `configureRepeatingTexture()`
- `inheritTextureTransform()`
- `createCanvasTexture()`
- `createMaterialResponseMaps()`
- `applyMaterialResponse()`
- `buildRoom()`
- `buildBox()`

### Suggested Structure

```text
environment/
    buildRoom.js
    buildPedestal.js
    materialResponse.js
```

Responsibilities include:

- room geometry
- wall materials
- procedural textures
- material response maps

---

# 4. Lighting Module

Separate lighting construction from scene assembly.

### Candidate Functions

- `buildAmbientLight()`
- `buildProjectBeamOrigin()`
- `buildProjectorBeam()`

### Suggested Structure

```text
lighting/
    buildAmbientLight.js
    buildProjectorRig.js
```

---

# 5. Debug Helpers

Debug helpers should not live beside production lighting logic.

### Candidate Functions

- `createSpotLightDebugger()`
- `createPointLightDebugger()`

### Suggested Structure

```text
lighting/
    debugLightHelpers.js
```

---

# 6. Introduce a Projector Rig

Instead of returning multiple independent lights, meshes, targets, and helpers, encapsulate everything into a single subsystem.

Current approach:

```js
const beam
const spotlight
const pointLight
const target
const helper
```

Preferred approach:

```js
const projectorRig = createProjectorRig(scene, options)
```

with an interface like:

```ts
{
    object,
    update(),
    dispose()
}
```

The projector rig should own:

- projector body
- beam mesh
- spotlight
- point light
- targets
- debug helpers
- adaptive lighting updates

---

# 7. Introduce Disposable Subsystems

Every major builder should return an object that manages its own lifecycle.

Instead of exposing raw meshes and materials, expose:

```ts
{
    object,
    update(),
    dispose()
}
```

Examples:

```js
const room = createRoom(scene)

const projectorRig = createProjectorRig(scene)

const projectionSurface = createProjectionSurface(scene)

const cameraController = createResponsiveCameraController(...)
```

---

# 8. Simplify Cleanup

Current cleanup manually disposes dozens of resources.

Target:

```js
return () => {
    cameraController.dispose()

    projectionSurface.dispose()

    projectorRig.dispose()

    room.dispose()

    renderer.dispose()
}
```

Each subsystem should clean up its own:

- geometry
- materials
- textures
- event listeners
- animation resources

---

# 9. Extract Controllers

The following logic should become reusable controllers rather than remaining inside `ProjectScene.jsx`.

## Responsive Camera

```text
createResponsiveCameraController.js
```

Responsibilities:

- resize listener
- camera updates
- renderer sizing

---

## Pointer Interaction

```text
createPointerInteractionController.js
```

Responsibilities:

- raycasting
- click handling
- hover state

---

## Movement Controller

```text
createMovementController.js
```

Responsibilities:

- keyboard input
- movement updates
- cleanup

---

# 10. Desired Project Structure

```text
Project/
│
├── Project.jsx
├── ProjectScene.jsx
├── project.data.js
├── project.mapper.js
│
└── scene/
    │
    ├── cameraConfig.js
    ├── lightingConfig.js
    ├── sceneConfig.js
    │
    ├── createResponsiveCameraController.js
    ├── createPointerInteractionController.js
    ├── createMovementController.js
    │
    ├── environment/
    │   ├── buildRoom.js
    │   ├── buildPedestal.js
    │   └── materialResponse.js
    │
    ├── lighting/
    │   ├── buildAmbientLight.js
    │   ├── buildProjectorRig.js
    │   └── debugLightHelpers.js
    │
    ├── projection/
    │   ├── projectionAnalysis.js
    │   ├── adaptiveLighting.js
    │   └── buildProjectionScreen.js
    │
    └── utils/
        ├── color.js
        ├── geometry.js
        └── texture.js
```

---

# Recommended Refactor Order

## Phase 1 — Low Risk

- Extract configuration getters
- Extract debug helpers

---

## Phase 2 — Medium Risk

- Extract projection analysis
- Extract adaptive lighting
- Extract projection screen builder

---

## Phase 3 — High Value

- Replace `buildProjectorBeam()` with `createProjectorRig()`
- Introduce `update()`
- Introduce `dispose()`

---

## Phase 4

- Convert room into a disposable subsystem
- Convert pedestal into a disposable subsystem

---

## Phase 5

- Extract responsive camera controller
- Extract pointer interaction controller
- Extract movement controller

---

# End Goal

`ProjectScene.jsx` should become an orchestration layer responsible only for:

- creating the scene
- creating the renderer
- composing reusable subsystems
- wiring update loops
- wiring controllers
- rendering the canvas

All rendering details, lighting logic, projection logic, environment construction, and cleanup should be delegated to dedicated modules.