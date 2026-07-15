# Loading Lifecycle

## 2. Route Controls What Loads

The route should decide which scene layer is needed.

That means:

- entering `/experience` should not preload project-only assets
- entering `/projects` should not preload experience-only assets
- leaving the professional section should hide the scene, not necessarily destroy it
- returning to the professional section should reuse the shared scene host when possible

The scene should respond to route intent, rather than eagerly loading everything up front.

## 3. Load Order Must Be Explicit

Loading order should be intentional:

1. load the shared scene elements first. 
2. load the active route layer 
  - core layer first
  - render the page in a usable state
  - load decorative assets later

This keeps first paint focused on what the user actually needs to see.

## 4. Load vs Visible

`loaded` and `visible` must be treated as different states.

### Core Rule

Once a route-specific asset has been loaded at least once, leaving the professional section must not cause it to reload by default.

That means:

- if the user enters `/experience`, the experience layer may load once
- if the user later leaves to another route, the experience layer should become hidden, not unloaded
- if the user comes back to `/experience`, the already loaded experience layer should be shown again without rebuilding it
- the same rule applies to `/projects`

## 5. Detailed Implementation Plan

The loading lifecycle should be implemented in phases. Each phase should own one concern only.

### Phase 1. Establish a Persistent Professional Scene Host

Status:

- implemented

Responsibility:

- keep the professional Three.js scene mounted outside individual professional pages
- avoid destroying the scene when navigating away from `/experience` or `/projects`

Tasks:

1. lift scene ownership to the app-level professional shell
2. mount the scene host only after the user first enters the professional section
3. when the user leaves the professional section, hide the scene host instead of unmounting it
4. when the user returns, reveal the existing host instance

Expected result:

- first visit creates the scene
- later visits reuse the same scene instance

### Phase 2. Separate Load State From Visibility State

Status:

- in progress

Responsibility:

- make layer caching explicit
- prevent route transitions from triggering accidental rebuilds

Tasks:

1. add an explicit `visible` state to the layer runtime model instead of relying only on `group.visible`
2. make `loading` an explicit tracked state rather than an implicit `loadingPromise` convention
3. standardize one layer-state shape across every layer so shared, experience, and project layers follow the same runtime contract
4. move layer state handling out of the main scene file into dedicated layer runtime helpers

Expected result:

- a layer can be loaded once and reused many times
- visibility changes do not imply reloading

### Phase 3. Enforce Ordered Loading

Status:

- partially implemented

Responsibility:

- make scene setup predictable
- keep critical render path short

Tasks:

1. formalize ordered loading as a dedicated orchestration flow instead of leaving it inline inside `ArtGalleryScene.jsx`
2. define readiness checkpoints for:
   - shared core ready
   - active route core ready
   - decorative safe to start
3. make decorative loading start from an explicit lifecycle signal instead of ad hoc timeout timing only
4. document or encode which assets are allowed to block route usability and which are always deferred

Expected result:

- the user sees a usable scene sooner
- decorative work no longer blocks first meaningful render

### Phase 4. Route-Driven Layer Activation

Status:

- implemented, with room for polish

Responsibility:

- ensure route value is the source of truth for which layer should be active

Tasks:

1. replace simple delayed hide with a transition-aware visibility policy that can support fade, stagger, or per-layer timing
2. isolate route activation logic from `ArtGalleryScene.jsx` into a dedicated route/layer transition controller
3. define a stable contract for:
   - entering a route
   - leaving a route
   - switching directly between `/experience` and `/projects`
4. ensure route activation rules stay correct if more project-only or experience-only sublayers are added later

Expected result:

- route transitions only activate relevant content
- inactive route layers remain available for reuse

### Phase 5. Add Mobile-Specific Decorative Gating

Status:

- partially implemented

Responsibility:

- reduce mobile load cost without affecting desktop composition

Tasks:

1. move mobile gating rules into a single configuration source instead of hardcoding them directly in decorative loaders
2. define which decorative assets are:
   - always desktop-only
   - optional on tablet
   - always allowed on mobile
3. add a clearer fallback policy for what the minimum mobile decorative payload actually is
4. ensure mobile gating can be reused by future decorative layers without duplicating logic

Expected result:

- mobile viewport avoids paying for non-essential decorative assets

### Phase 6. Cleanup Policy

Status:

- implemented

Responsibility:

- define when resources should and should not be disposed

Tasks:

1. move cleanup ownership out of the monolithic scene file and into per-layer runtime units
2. define a single disposal contract for:
   - shared core
   - experience core
   - experience decorative
   - project core
3. separate `hide`, `deactivate`, and `dispose` as three different lifecycle actions
4. leave room for an explicit future unload path without making ordinary route changes dispose assets

Expected result:

- runtime behavior is stable
- disposal is intentional instead of incidental

## 6. Validation Checklist

After implementation, validate the lifecycle with the following checks:

1. Direct entry to `/experience`
   - shared loads
   - experience core loads
   - experience decorative loads later
   - project core does not load
2. Direct entry to `/projects`
   - shared loads
   - project core loads
   - experience core does not load
3. `/experience` -> `/projects`
   - shared remains mounted
   - experience core hides
   - project core activates
   - no full scene rebuild
4. `/projects` -> `/experience`
   - project core hides
   - experience core reappears
   - if already loaded, it does not reload
5. Leave professional section and return
   - scene host is reused
   - previously loaded layers are reused
   - no duplicate GLTF fetch or texture decode
6. Mobile viewport on `/experience`
   - desk decoration meshes do not load
   - `piano` does not load
   - `titanicLamp` does not load
   - `titanicLamp` light does not load
