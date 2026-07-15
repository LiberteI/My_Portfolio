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

