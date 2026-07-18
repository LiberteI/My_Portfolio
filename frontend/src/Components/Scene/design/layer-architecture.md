# Layer Architecture

## 1. Separate Shared Scene From Route-Specific Scene

```text
professional scene
├── shared layer
│   └── core layer
│       ├── room
│       └── ambient light
└── route layer
    ├── experience
    │   ├── core layer
    │   │   ├── table
    │   │   ├── desk pad
    │   │   ├── resume
    │   │   └── table spotlight
    │   └── decorative layer
    │       ├── desk decorations
    │       ├── piano
    │       ├── shelf
    │       ├── titanic lamp
    │       └── titanic lamp point light
    └── project
        ├── core layer
        │   ├── pedestal
        │   ├── projector
        │   ├── projection screen
        │   └── projector lighting rig
        └── decorative layer
            └── reserved for future project-only secondary props
```

The professional scene should be split into:

Source types to track explicitly:

- `mesh`
- `lighting`
- `material`
- `texture`
- `shader`
- `procedural helper`

Load hierarchy:

- `shared layer`: first render, always required once the professional scene is entered
- `route layer`: load only the currently active page payload

### `shared layer`

This layer contains assets shared by both `/experience` and `/projects`.

#### `core layer`

This is the minimum shared scene shell required to make the professional scene readable.

Mesh:

- `room`
  - built procedurally in `buildRoom.js`
  - contains:
    - floor plane
    - ceiling plane
    - back wall plane
    - left wall plane
    - right wall plane
    - front wall plane

Lighting:

- `ambientLight`
  - global fill light
  - defined in `buildAmbientLight.js`

Materials:

- room wall `MeshStandardMaterial`
- room floor `MeshStandardMaterial`
- room ceiling `MeshStandardMaterial`
- room back wall `MeshStandardMaterial`

Textures:

- `assets/Museum/compressed-img/wall-texture.webp`
  - used by room walls
  - also reused by room ceiling
- `assets/Museum/compressed-img/floor-texture.webp`
  - used by room floor
- `assets/Museum/prebaked-tex/compressed-img/wall-ao.webp`
  - ambient occlusion for wall-like surfaces
- `assets/Museum/prebaked-tex/compressed-img/wall-normal.webp`
  - normal map for wall-like surfaces
- `assets/Museum/prebaked-tex/compressed-img/wall-roughness.webp`
  - roughness map for wall-like surfaces
- `assets/Museum/prebaked-tex/compressed-img/floor-ao.webp`
  - ambient occlusion for floor
- `assets/Museum/prebaked-tex/compressed-img/floor-normal.webp`
  - normal map for floor
- `assets/Museum/prebaked-tex/compressed-img/floor-roughness.webp`
  - roughness map for floor

Procedural helpers:

- repeated UV cloning via `cloneUvAttribute`
- repeating texture configuration via `configureRepeatingTexture`
- material tuning via `applyMaterialResponse`
- projection frame geometry for wall alignment reference

Why this belongs in shared:

- both `/experience` and `/projects` need the same room shell
- these assets define scene context
- rebuilding the room shell per route would be wasteful

There is currently no separate shared decorative payload. Shared content is limited to the shared core shell.

### `route layer`

This layer contains page-specific payloads. Route assets should load only when the matching page is active.

#### `experience`

##### `core layer`

This layer should load only for the experience page.

Mesh:

- `table`
  - built procedurally in `buildTable.js`
  - contains:
    - tabletop box
    - four table leg boxes
- `leather desk pad`
  - built procedurally with `RoundedBoxGeometry`
  - centered on the table with an x-offset
- `resume plane`
  - built procedurally with `PlaneGeometry`
  - sits on top of the desk pad

Materials:

- table `MeshStandardMaterial`
- desk pad `MeshPhysicalMaterial`
  - dark leather response
  - subtle clearcoat
  - roughness and normal detail
- resume `MeshBasicMaterial`
  - direct texture display for the resume artwork
- contact shadow `MeshBasicMaterial`
  - translucent fake tabletop shadow beneath the desk pad

Lighting:

- `tableSpotLight`
  - top-down spotlight dedicated to the table area
  - defined in `buildTableSpotLight.js`

Textures:

- `assets/Museum/compressed-img/table-texture.webp`
  - used by the wooden table
- `assets/Museum/prebaked-tex/compressed-img/wall-ao.webp`
  - reused by the table material response
- `assets/Museum/prebaked-tex/compressed-img/wall-normal.webp`
  - reused by the table material response
- `assets/Museum/prebaked-tex/compressed-img/wall-roughness.webp`
  - reused by the table material response
- `assets/Museum/compressed-img/Leather026_1K-JPG_Color.webp`
  - leather albedo / base color
- `assets/Museum/compressed-img/Leather026_1K-JPG_Roughness.webp`
  - leather roughness map
- `assets/Museum/compressed-img/Leather026_1K-JPG_NormalGL.webp`
  - leather normal map
- `assets/resume.png`
  - mapped directly onto the resume plane

Procedural helpers:

- contact shadow canvas texture generated at runtime in `buildLeatherDeskPad.js`
- paper sizing derived from hardcoded resume image dimensions in `buildResume.js`

Why this belongs in experience:

- the table is part of the experience-side tabletop composition
- these assets are the main tabletop storytelling content for `/experience`
- they are not needed for `/projects`

##### `decorative layer`

This layer should never block first render. It exists for scene richness only and should load after the experience core layer becomes usable.

Mobile viewport clause:

- on mobile viewport, do not load desk decoration meshes
- on mobile viewport, do not load `piano`
- on mobile viewport, do not load `titanicLamp`
- on mobile viewport, do not load the point light attached to `titanicLamp`
- on mobile viewport, the decorative payload may be reduced to only the minimum background dressing that is still visually necessary

Decorative tabletop meshes:

- `assets/Meshes/texture-compressed/tc-dc-winnie_the_pooh.glb`
- `assets/Meshes/texture-compressed/tc-dc-honey_pot.glb`
- `assets/Meshes/texture-compressed/tc-dc-ludwig_van_beethoven.glb`
- `assets/Meshes/texture-compressed/tc-dc-honey_pot.glb`

Decorative room-wall meshes:

- `assets/Meshes/texture-compressed/tc-dc-dusty_old_piano.glb`
- `assets/Meshes/texture-compressed/tc-dc-shelf.glb`
- `assets/Meshes/texture-compressed/tc-dc-titanic_lamp.glb`

Decorative lighting:

- point light attached to `titanicLamp`
  - warm accent light for the lamp model

Runtime behavior:

- all decorative GLBs are Draco-loaded through `GLTFLoader + DRACOLoader`
- models are normalized into pivot groups after load
- placement is derived from room bounds or table bounds

Why this belongs in the experience decorative layer:

- these props enrich the room but do not define page function
- the user can understand the page without them
- they should be delayed until after the active route is already usable

#### `project`

##### `core layer`

This layer should load only for the project page.

Mesh:

- `pedestal`
  - built procedurally in `buildPedestal.js`
- `projector model`
  - loaded from compressed GLB in `loadProjectorModel.js`
- `projection screen`
  - built procedurally as a plane in `buildProjectionScreen.js`
- `beam pyramid fill`
  - procedural beam volume created in `buildProjectorRig.js`
- optional debug beam lines
  - procedural line geometry when enabled

Lighting:

- `projectorSpotLightToWall`
- `projectorSpotLightToFloor`
  - currently disabled by config, but still part of the projector rig design
- `projectorOriginPointLight`
- `projectorBackRectAreaLight`
- `emissionLight`
- `wallGlowPlane`
  - additive glow card to fake projector bloom

Materials:

- pedestal `MeshStandardMaterial`
- projector upgraded `MeshPhysicalMaterial`
  - GLB materials are replaced at runtime
- projection material from `createProjectionMaterial.js`
- beam shader material from `createBeamMaterial.js`
- wall glow `MeshBasicMaterial`

Textures:

- `assets/Museum/compressed-img/wall-texture.webp`
  - reused by pedestal
- `assets/Museum/prebaked-tex/compressed-img/wall-ao.webp`
  - reused by pedestal
- `assets/Museum/prebaked-tex/compressed-img/wall-normal.webp`
  - reused by pedestal
- `assets/Museum/prebaked-tex/compressed-img/wall-roughness.webp`
  - reused by pedestal
- `assets/Meshes/texture-compressed/tc-dc-generic_white_digital_projector.glb`
  - projector mesh with embedded data
- `featuredProject.projectionImage`
  - route-driven runtime texture used on the projection screen
  - this is not a static scene asset file; it comes from project page state

Shaders:

- `shaders/projection/projection.vert.glsl`
- `shaders/projection/projection.frag.glsl`
- `shaders/beam/beam.vert.glsl`
- `shaders/beam/beam.frag.glsl`

Procedural helpers:

- wall glow canvas texture generated at runtime
- adaptive projector lighting analysis in `projectionAnalysis.js`
- adaptive light target updates in `adaptiveLighting.js`

Why this belongs in project:

- none of these assets are necessary for the experience page
- projector setup is one of the most expensive route-specific subsystems

##### `decorative layer`

There is currently no dedicated project decorative layer beyond the projector system itself. If project-only secondary props are added later, they should be documented here rather than introduced as a new top-level hierarchy.

## Asset Classification Summary

Critical on first professional render:

- room geometry
- ambient light
- wall and floor textures
- wall and floor support maps

Critical only for `/experience`:

- table geometry
- table material
- table spotlight
- table texture
- table support maps
- leather desk pad textures
- resume texture
- experience tabletop meshes

Critical only for `/projects`:

- projector GLB
- pedestal mesh and its texture set
- projection shader pipeline
- current project projection image
- projector lighting rig

Non-critical / deferrable:

- table figures
- wall-side furniture
- titanic lamp accent light

Only the `shared layer` should be considered mandatory for initial scene setup.
