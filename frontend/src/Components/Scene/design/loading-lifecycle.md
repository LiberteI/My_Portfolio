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

The loading lifecycle should be implemented in phases so behavior remains stable while the architecture is being refactored.

### Phase 1. Establish a Persistent Professional Scene Host

Goal:

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

Goal:

- make layer caching explicit
- prevent route transitions from triggering accidental rebuilds

Tasks:

1. give each layer its own runtime state object
2. track at minimum:
   - `loaded`
   - `loading`
   - `visible`
   - `handles`
3. keep the layer's `THREE.Group` alive after first load
4. toggle `group.visible` instead of disposing the layer on ordinary route changes

Expected result:

- a layer can be loaded once and reused many times
- visibility changes do not imply reloading

### Phase 3. Enforce Ordered Loading

Goal:

- make scene setup predictable
- keep critical render path short

Tasks:

1. load shared scene elements first
2. once shared is ready, load the active route's core layer
3. render the page as soon as the active core layer is usable
4. defer decorative layer loading until after the active core layer is visible

Expected result:

- the user sees a usable scene sooner
- decorative work no longer blocks first meaningful render

### Phase 4. Route-Driven Layer Activation

Goal:

- ensure route value is the source of truth for which layer should be active

Tasks:

1. entering `/experience`
   - show shared layer
   - ensure experience core is loaded
   - show experience core
   - hide project core
   - schedule experience decorative loading
2. entering `/projects`
   - show shared layer
   - ensure project core is loaded
   - show project core
   - hide experience core
   - hide experience decorative
3. leaving the professional section
   - hide scene host
   - keep already loaded layers cached

Expected result:

- route transitions only activate relevant content
- inactive route layers remain available for reuse

### Phase 5. Add Mobile-Specific Decorative Gating

Goal:

- reduce mobile load cost without affecting desktop composition

Tasks:

1. define a mobile viewport cutoff in scene runtime logic
2. under mobile viewport:
   - skip desk decoration meshes
   - skip `piano`
   - skip `titanicLamp`
   - skip `titanicLamp` point light
3. keep only the minimum decorative background payload if necessary

Expected result:

- mobile viewport avoids paying for non-essential decorative assets

### Phase 6. Protect Projection Timing

Goal:

- make sure project projection appears correctly on first project entry

Tasks:

1. keep projection screen creation dependent on both:
   - valid project texture
   - loaded project core layer
2. if the texture arrives before project core finishes loading, resync projection after project core resolves
3. replace existing projection screen safely when the active featured project changes

Expected result:

- first project thumbnail projects correctly
- switching projects updates projection without duplicating scene setup

### Phase 7. Cleanup Policy

Goal:

- define when resources should and should not be disposed

Tasks:

1. do not dispose layers during normal route changes
2. dispose layer resources only when:
   - the professional scene host is truly being unmounted
   - there is an explicit memory-reduction decision
3. keep cleanup ownership inside each layer module

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
