# 2. Adaptive Projection Lighting

## Overview

A real projector does more than display an image—it also affects the surrounding environment. As the projected content changes, the emitted light changes in both color and intensity, subtly influencing nearby surfaces.

The current implementation uses a fixed projector light regardless of the projected image. As a result, every project shares the same environmental lighting, making the projection feel disconnected from the scene.

The goal of this feature is to automatically analyze each projected image and dynamically adjust the projector lighting so that every project naturally influences the exhibition space.

---

# Objectives

The environment lighting should automatically respond to the currently projected image.

Specifically:

- Bright images should illuminate the room more strongly.
- Dark images should naturally dim the projector.
- Warm images should produce warmer spill light.
- Cool-toned images should tint the environment with cooler lighting.
- Lighting transitions should be smooth when switching between projects.

The objective is not perfect physical simulation, but to create a more immersive and cohesive viewing experience.

---

# Implementation

## 1. Analyze the Projection Texture

Whenever the projected image changes, analyze the texture once before rendering.

Extract two primary pieces of information:

- Average bright color
- Overall brightness

These values will drive the lighting system.

Since this analysis only occurs when the texture changes, it introduces negligible runtime cost.

---

## 2. Ignore Dark Pixels

Do not average every pixel equally.

Many projected images—especially dark interfaces, pixel art, or night scenes—contain large black or dark regions that contribute little or no projected light.

Instead, compute luminance for every pixel:

```text
luminance = 0.299R + 0.587G + 0.114B
```

Ignore pixels whose luminance falls below a configurable threshold.

Example:

```text
brightPixelThreshold = 0.25
```

This ensures that the computed light color represents the actual emitted light rather than the dominant background color.

---

## 3. Compute the Average Bright Color

Average only the pixels that pass the luminance threshold.

The resulting color represents the dominant projected light emitted by the projector.

Examples:

| Project Image | Estimated Light Color |
|---------------|-----------------------|
| Blue dashboard | Cool blue |
| Warm artwork | Orange / amber |
| White interface | Neutral white |
| Green terminal | Soft green |

This color becomes the target color for the projector lighting.

---

## 4. Compute Overall Brightness

In addition to color, calculate the average brightness of the projection.

This value controls how much light the projector contributes to the environment.

Example behavior:

```text
Bright project
↓
Higher projector intensity

Dark project
↓
Lower projector intensity
```

Brightness should influence illumination independently from color.

---

## 5. Update the Projector Beam

Use the computed average color to tint the projector beam.

Instead of emitting a fixed warm white light, the beam should adapt to the projected content.

Examples:

```text
Blue UI
→ Blue projector beam

Orange artwork
→ Warm projector beam

White interface
→ Neutral beam

Purple artwork
→ Slight purple tint
```

This helps the projector feel like it is genuinely emitting the displayed image.

---

## 6. Update Wall Bounce Lighting

Projected light naturally reflects off nearby surfaces.

Use the computed average color to tint the wall bounce light.

However, avoid using the raw color directly.

Instead, slightly desaturate or blend it toward a neutral warm white to produce more subtle and believable indirect lighting.

This prevents the room from becoming overly saturated while still allowing the projected content to influence the environment.

---

## 7. Scale Light Intensity

Adjust the brightness of the projector beam and bounce lighting according to the computed image brightness.

Conceptually:

```text
Bright image
↓

Stronger projector beam

+

Brighter wall bounce

↓

Brighter exhibition space
```

```text
Dark image
↓

Weaker projector beam

+

Reduced bounce light

↓

Moodier environment
```

The projector should naturally feel brighter or dimmer depending on the content being displayed.

---

## 8. Smooth Lighting Transitions

Lighting should never change instantly when switching between projects.

Instead, interpolate between the current lighting state and the newly computed lighting state.

Smoothly transition:

- Projector beam color
- Projector beam intensity
- Wall bounce color
- Wall bounce intensity

This creates a natural fade between projects and prevents abrupt visual changes.

---

## 9. Preserve Artistic Control

Automatic lighting should enhance the scene without removing artistic control.

Expose configurable parameters such as:

| Parameter | Purpose |
|----------|----------|
| brightPixelThreshold | Ignore dark pixels during analysis |
| projectorIntensityMultiplier | Scale beam intensity |
| bounceIntensityMultiplier | Scale indirect lighting |
| colorSaturation | Control lighting color richness |
| transitionSpeed | Lighting interpolation speed |
| minimumIntensity | Prevent projector from becoming completely dark |
| maximumIntensity | Prevent excessive brightness |

These values should remain easily adjustable for fine-tuning different exhibition styles.

---

# Rendering Pipeline

The lighting update should follow this sequence whenever a new project is selected:

```text
Project Changes
        ↓
Load Projection Texture
        ↓
Analyze Image Pixels
        ↓
Compute Average Bright Color
        ↓
Compute Overall Brightness
        ↓
Generate Target Lighting State
        ↓
Update Projector Beam
        ↓
Update Wall Bounce Light
        ↓
Smoothly Interpolate to New Lighting
```

---

# Expected Result

The final lighting system should produce the following behavior:

- Every projected image generates its own lighting mood.
- Cool images subtly cool the surrounding environment.
- Warm images create warmer spill lighting.
- Bright projects illuminate the exhibition space more strongly.
- Dark projects naturally reduce environmental illumination.
- Lighting transitions remain smooth and cinematic.
- The projected content feels physically connected to the environment instead of appearing as an isolated texture.