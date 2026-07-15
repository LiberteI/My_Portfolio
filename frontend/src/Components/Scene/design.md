# Scene Loading Design

## Current Problem

The current scene architecture mixes `experience` and `project` content into one build path.

When the user enters either professional page:

- the full scene starts building
- page-specific meshes load even when they are not visible
- decorative assets load too early
- route transitions pay for work they do not need

This is expensive and directly hurts perceived performance, especially LCP and first-time entry to the professional section.

## Design Goal

The scene should load in layers, not all at once.

High-level goals:

1. Load only what the current route needs.
2. Keep the shared room persistent once initialized.
3. Separate scene loading from scene visibility.
4. Make route state the source of truth for page-specific content.
5. Delay decorative and non-critical assets until after the base scene is usable.

## Architectural Direction

### 1. Separate Shared Scene From Route-Specific Scene

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
- `decorative layer`: load later, never part of the critical path

#### `shared layer`

This layer is the minimum scene shell required to make the professional scene readable.

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

#### `experience layer`

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

#### `project layer`

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

- `shaders/projectionShaders/projection.vert.glsl`
- `shaders/projectionShaders/projection.frag.glsl`
- `shaders/beamShaders/beam.vert.glsl`
- `shaders/beamShaders/beam.frag.glsl`

Procedural helpers:

- wall glow canvas texture generated at runtime
- adaptive projector lighting analysis in `projectionAnalysis.js`
- adaptive light target updates in `adaptiveLighting.js`

Why this belongs in project:

- none of these assets are necessary for the experience page
- projector setup is one of the most expensive route-specific subsystems

#### `decorative layer`

This layer should never block first render. It exists for scene richness only.

Decorative tabletop meshes:

- `assets/Meshes/texture-compressed/tc-dc-winnie_the_pooh.glb`
- `assets/Meshes/texture-compressed/tc-dc-president_xi_jing_ping.glb`
- `assets/Meshes/texture-compressed/tc-dc-ludwig_van_beethoven.glb`
- `assets/Meshes/texture-compressed/tc-dc-flower_pot.glb`

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

Why this belongs in decorative:

- these props enrich the room but do not define page function
- the user can understand the page without them
- they should be delayed until after the active route is already usable

#### Asset Classification Summary

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

### 2. Route Controls What Loads

The route should decide which scene layer is needed.

That means:

- entering `/experience` should not preload project-only assets
- entering `/projects` should not preload experience-only assets
- leaving the professional section should hide the scene, not necessarily destroy it
- returning to the professional section should reuse the shared scene host when possible

The scene should respond to route intent, rather than eagerly loading everything up front.

### 3. Load Order Must Be Explicit

Loading order should be intentional:

1. initialize renderer, camera, room, and base lights
2. load the active route layer
3. render the page in a usable state
4. load decorative assets later

This keeps first paint focused on what the user actually needs to see.

### 4. Load vs Visible

`loaded` and `visible` must be treated as different states.

#### Core Rule

Once a route-specific asset has been loaded at least once, leaving the professional section must not cause it to reload by default.

That means:

- if the user enters `/experience`, the experience layer may load once
- if the user later leaves to another route, the experience layer should become hidden, not unloaded
- if the user comes back to `/experience`, the already loaded experience layer should be shown again without rebuilding it
- the same rule applies to `/projects`

#### Expected Behavior

First visit:

- route enters `/experience` or `/projects`
- required layer loads
- layer becomes visible

Leave professional section:

- scene host may become hidden
- loaded route layers remain in memory
- no automatic teardown of already loaded professional assets

Return later:

- scene host becomes visible again
- previously loaded route layer is reused
- no second network fetch
- no second GLTF parse
- no second texture decode
- no second scene construction for the same layer

#### State Model

Each layer should be tracked with at least two independent concerns:

- `load state`
  - `not_loaded`
  - `loading`
  - `loaded`
- `visibility state`
  - `hidden`
  - `visible`

These states must not be collapsed into one boolean.

For example:

- a layer can be `loaded + hidden`
- a layer can be `loaded + visible`
- a layer should not return to `not_loaded` just because the route changed

#### Why This Matters

If route exit destroys already loaded assets, then returning to `/experience` or `/projects` will:

- trigger duplicate network work
- trigger duplicate model parsing
- trigger duplicate texture creation
- increase transition cost
- make the professional section feel unstable and expensive

The correct behavior is:

- load once when first needed
- keep cached while the app session is alive
- toggle visibility as the user navigates

Unload should happen only when there is an explicit memory-management reason, not as a default response to ordinary route changes.
