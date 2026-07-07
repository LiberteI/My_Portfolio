# 1. Physically-Based Projection Rendering

### Goal

Replace the current "image pasted onto a plane" approach with a projection that behaves like real projected light.

Instead of rendering the PNG directly, the shader should interpret the image as a **light contribution**:

- Use the texture's luminance to determine per-pixel opacity.
- Dark pixels should reveal the wall texture instead of appearing as black.
- Bright pixels should behave as projected light.
- Optionally apply a Screen/Additive blend to better simulate light projection.
- Add subtle edge blur and bloom to soften the projection boundary.

### Implementation Overview

- Create a custom `ShaderMaterial` for the projection screen.
- Sample the projection texture.
- Compute per-pixel luminance.
- Convert luminance into alpha (or light intensity).
- Blend the projection with the underlying wall instead of completely replacing it.
- Apply projection strength and exposure controls for artistic tuning.

---

# 2. Adaptive Projection Lighting

### Goal

Allow the environment lighting to automatically respond to the projected image, making every project feel naturally integrated into the exhibition space.

Instead of using a fixed warm projector light, dynamically adjust the projection beam and surrounding illumination based on the image currently being projected.

### Implementation Overview

- Analyze the projection texture when it changes.
- Compute the average color of only the bright pixels (ignore dark regions).
- Compute the overall average brightness.
- Update the projector beam color using the computed average color.
- Update the wall bounce light color.
- Scale projector and bounce light intensity using the average brightness.
- Smoothly interpolate between lighting states to avoid abrupt transitions when switching projects.

This creates a projection system where:

- Bright UIs produce stronger illumination.
- Dark interfaces naturally dim the environment.
- Warm images produce warmer bounce lighting.
- Cool-toned images subtly tint the surrounding space.