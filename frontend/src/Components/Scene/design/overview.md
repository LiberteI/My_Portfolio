# Overview

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
