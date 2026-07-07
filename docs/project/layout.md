# Projects Page Layout Plan

## Layout Hierarchy

```text
Project
├── Navigation
├── Project Information Panel (Left)
├── Three.js Scene (Background)
├── Project Carousel (Bottom)
└── Pagination Indicator (Bottom Center)
```

---

# 1. Navigation

Position

- fixed
- top: 32px
- left/right padding: 48~64px
- z-index above canvas

Layout

```text
home                         Projects Experience Music About
```

Left

- home Navigation link

Right

Navigation links

- Projects (active)
- Experience
- Music
- About

Interactions

- hover
- active indicator
- route transition

---

# 2. Project Information Panel

Position

Left side

```text
──────────────────────

01
FEATURED PROJECT

AI Ear Trainer

description...

──────────

ROLE

Full Stack Developer

DURATION

Jan 2024 - Apr 2024

STACK

...

CATEGORY

...

[ View Project ]

──────────────────────
```

Width

Approximately

320~420px

Sections

---

## Project Index

Example

```text
01
FEATURED PROJECT
```

Need

- project index
- featured/archive label

---

## Project Title

Large serif typography

Examples

```
AI Ear Trainer
```

---

## Description

2~4 lines

---

## Divider

Thin horizontal line

---

## Metadata List

Display as key-value pairs

```text
ROLE

Full Stack Developer

DURATION

Jan 2024 - Apr 2024

STACK

Next.js
Azure
Postgres

CATEGORY

AI / Music
```

Suggested component

```tsx
<ProjectMetadata />
```

---

## CTA Button

Primary action

```
View Project →
```

Interactions

- hover glow
- arrow animation

---

# 3. Bottom Project Carousel

Position

bottom

full width

Layout

```text
<

01
thumbnail
title
category

02
thumbnail
...

03
...

>

```

Contains

- left arrow
- project cards
- right arrow

---

## Carousel Container

Horizontal flex

Overflow hidden

Animated translateX

---

## Carousel Card

Structure

```text
01

thumbnail

Title

Category
```

Selected state

- brighter
- border
- glow

Inactive state

- darker
- reduced opacity

Hover

- lift slightly
- brighten image

---

## Card Thumbnail

Image only

No Three.js

Rounded corners

---

## Card Number

Small

Upper left

```
01
```

---

## Card Title

Medium typography

---

## Card Subtitle

Category

Examples

```
AI / Music
```

---

## Carousel Navigation

Left button

```
←
```

Right button

```
→
```

Floating circular buttons

---

# 4. Bottom Pagination

Position

absolute bottom center

Display

```text
○ ● ○ ○ ○
```

Reflects current carousel page

Optional

animate when changing

---

# 5. UI Layering

```text
z=0
Three.js Scene

z=10
Navigation

z=10
Left Information Panel

z=10
Carousel

z=10
Pagination
```

Canvas never overlaps UI.

---

# 6. Suggested React Component Structure

```text
ProjectsPage
│
├── Navigation
│
├── ProjectInfoPanel
│   ├── FeaturedLabel
│   ├── ProjectTitle
│   ├── ProjectDescription
│   ├── MetadataList
│   └── ViewProjectButton
│
├── ProjectScene
│
├── ProjectCarousel
│   ├── CarouselArrow
│   ├── CarouselTrack
│   ├── ProjectCard
│   └── CarouselArrow
│
└── PaginationDots
```

---

# 7. Data Flow

```text
selectedProjectIndex
        │
        ▼
currentProject
        │
        ├── ProjectScene
        │      ├── screen texture
        │      ├── projector light color
        │      └── projector animation
        │
        ├── ProjectInfoPanel
        │
        ├── ProjectCarousel
        │
        └── PaginationDots
```

The page should have a **single source of truth (`selectedProjectIndex`)**, with every UI element deriving its content from the currently selected project.