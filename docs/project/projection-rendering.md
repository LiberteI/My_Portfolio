# Physically-Based Projection Rendering

## Overview

The current implementation renders the projected image as a PNG mapped directly onto a plane, making it look like a poster attached to the wall. The goal of this task is to replace that approach with a physically inspired projection system that behaves like real projected light.

Instead of treating the texture as the final surface color, interpret it as **light intensity**. The wall should remain the primary visible surface, while the projector contributes additional illumination based on the brightness of the image.

---

# Objectives

The projection should resemble light emitted from a projector rather than a flat image.

Specifically:

- Dark pixels should contribute little or no light.
- Bright pixels should illuminate the wall.
- Colored pixels should tint the wall with colored light.
- The wall texture should remain visible underneath.
- Projection edges should appear naturally soft instead of perfectly sharp.

---

# Implementation

## 1. Create a Custom ShaderMaterial

Replace the existing material used for the projection plane with a custom `ShaderMaterial`.

The shader will be responsible for converting the projection texture into projected light.

Responsibilities include:

- Sampling the projection texture
- Computing pixel brightness
- Converting brightness into light intensity
- Applying edge fading
- Outputting light instead of a solid image

---

## 2. Treat the Texture as Light

Do **not** render the PNG directly.

Instead of interpreting the texture as:

```text
Image → Final Color
```

interpret it as:

```text
Image Brightness → Light Intensity
Image Color → Light Color
```

The texture becomes a light source rather than a painted surface.

---

## 3. Compute Per-Pixel Luminance

Sample the projection texture.

Compute luminance using a standard weighted RGB calculation.

Example:

```glsl
float luminance = dot(color.rgb, vec3(0.299, 0.587, 0.114));
```

This converts every pixel into a brightness value between **0** and **1**.

Then remap it using configurable thresholds:

```glsl
float intensity = smoothstep(
    blackPoint,
    whitePoint,
    luminance
);
```

This allows nearly-black pixels to disappear while keeping bright regions vivid.

---

## 4. Use Luminance as Projection Intensity

Instead of replacing the wall color, use the computed intensity to determine how much light the projector contributes.

Conceptually:

```text
Wall Surface
        +
Projected Light
        =
Final Appearance
```

This produces the behavior of a real projector:

- Black pixels project almost nothing.
- Mid-tone pixels emit weak light.
- Bright pixels emit strong light.

---

## 5. Preserve the Wall

One of the biggest visual improvements is allowing the wall to remain visible.

Avoid:

```text
Wall
↓

Hidden behind image
```

Instead:

```text
Wall Texture
↓

Still visible

+

Projection Light
↓

Added on top
```

The projection should enhance the wall, not replace it.

---

## 6. Blending

Use transparent blending so the projection behaves like emitted light.

Recommended material configuration:

```ts
transparent: true
depthWrite: false
```

Experiment with:

- Additive blending
- Screen blending
- Custom blending

Choose whichever produces the most natural projection while avoiding excessive overexposure.

---

## 7. Edge Softening

Real projectors do not produce perfectly sharp rectangular borders.

Fade the projection near the UV boundaries using smooth interpolation.

The transition should be subtle enough that the audience does not consciously notice it, but sufficient to eliminate the "sticker on a wall" appearance.

Expose:

```text
edgeSoftness
```

to allow artistic tuning.

---

## 8. Projection Controls

Expose configurable uniforms for runtime adjustment.

Suggested parameters:

| Uniform | Purpose |
|----------|----------|
| projectionStrength | Overall brightness |
| exposure | Projection exposure |
| blackPoint | Minimum brightness before projection appears |
| whitePoint | Maximum brightness |
| edgeSoftness | Border fade distance |
| opacityMultiplier | Overall opacity scaling |

These should be easily adjustable for different artwork.

---

## 9. Bloom Compatibility

Ensure the projection integrates well with bloom post-processing.

Bright regions should be capable of producing subtle glow while darker regions remain unaffected.

If the project already uses post-processing, verify compatibility with `UnrealBloomPass`.

If bloom has not yet been implemented, leave the rendering pipeline ready for future integration.

---

## 10. Tone Mapping

Use filmic tone mapping to make projected light feel more cinematic.

Recommended renderer configuration:

```ts
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.0;
```

The projection should look natural under different lighting conditions without clipping highlights.

---

## 11. Preserve Existing Features

The new implementation must continue supporting:

- Dynamic project image updates
- Different artwork (dark and bright)
- Existing projector placement
- Existing animation
- Existing light color controls
- Responsive layouts
- Mobile rendering

The rendering implementation should be upgraded without changing the surrounding project architecture.

---

# Expected Result

The final projection should satisfy the following characteristics:

- The wall remains clearly visible.
- Black regions blend naturally into the wall.
- Bright regions appear illuminated.
- Colored regions cast colored light.
- The projection feels like emitted light rather than a textured rectangle.
- Edges are softly faded.
- Bloom enhances only the brightest areas.
- The overall scene becomes noticeably more cinematic and physically believable.