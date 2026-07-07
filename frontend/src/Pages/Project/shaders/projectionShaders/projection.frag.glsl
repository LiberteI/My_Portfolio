uniform sampler2D projectionTexture;
uniform float projectionStrength;
uniform float exposure;
uniform float blackPoint;
uniform float whitePoint;
uniform float edgeSoftness;
uniform float opacityMultiplier;
uniform float shadowBoost;
uniform float highlightBoost;

varying vec2 vUv;

float getEdgeFade(vec2 uv, float softness) {
    vec2 distanceToEdge = min(uv, 1.0 - uv);
    float nearestEdge = min(distanceToEdge.x, distanceToEdge.y);
    return smoothstep(0.0, softness, nearestEdge);
}

void main() {
    vec4 projectionSample = texture2D(projectionTexture, vUv);
    float luminance = dot(projectionSample.rgb, vec3(0.299, 0.587, 0.114));
    float shadowMask = 1.0 - smoothstep(0.0, whitePoint, luminance);
    float highlightMask = smoothstep(blackPoint, 1.0, luminance);
    float shadowScaledLuminance = luminance * mix(shadowBoost, 1.0, 1.0 - shadowMask);
    float boostedLuminance = min(shadowScaledLuminance * mix(1.0, highlightBoost, highlightMask), 1.0);
    float intensity = smoothstep(blackPoint, whitePoint, boostedLuminance);
    float emittedLight = (1.0 - exp(-intensity * projectionStrength * exposure)) * getEdgeFade(vUv, edgeSoftness);
    vec3 projectedLight = projectionSample.rgb * emittedLight;
    float alpha = emittedLight * opacityMultiplier;

    if (alpha < 0.0015) {
        discard;
    }

    gl_FragColor = vec4(projectedLight, alpha);
}
