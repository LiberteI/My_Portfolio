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

1. initialize renderer, camera, room, and base lights
2. load the active route layer
3. render the page in a usable state
4. load decorative assets later

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

### Expected Behavior

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

### State Model

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

### Why This Matters

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
