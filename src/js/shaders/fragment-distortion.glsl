uniform sampler2D tDiffuse;
uniform float scrollSpeed;
varying vec2 vUv;

void main() {
    float area = smoothstep(.4, 0.,  vUv.y);
    area = pow(area, 4.0);

    vec2 newUV = vUv;
    newUV.x -= (vUv.x - 0.5) * 0.1 * area * scrollSpeed;

    gl_FragColor = texture2D( tDiffuse, newUV);
}