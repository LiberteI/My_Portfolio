uniform vec3 beamColor;
uniform vec3 beamOrigin;
uniform vec3 beamAxis;
uniform float beamLength;
uniform float beamOpacity;

varying vec3 vWorldPosition;
varying vec3 vLocalPosition;

float hash(vec3 p) {
    p = fract(p * 0.3183099 + vec3(0.1, 0.2, 0.3));
    p *= 17.0;
    return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
}

void main() {
    vec3 beamVector = vWorldPosition - beamOrigin;
    float t = clamp(dot(beamVector, beamAxis) / beamLength, 0.0, 1.0);

    float edgeFade = pow(max(1.0 - abs(vLocalPosition.z) / 18.0, 0.0), 1.35);

    float distanceFade = pow(max(1.0 - t, 0.0), 1.65);

    float startBoost = 0.65 + 0.35 * pow(max(1.0 - t, 0.0), 1.2);

    float noise = mix(0.9, 1.0, hash(vWorldPosition * 0.35));

    float alpha = beamOpacity * edgeFade * distanceFade * startBoost * noise;

    if (alpha < 0.0015) {
        discard;
    }

    gl_FragColor = vec4(beamColor, alpha);
}
