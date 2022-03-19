varying vec2 vUv;
uniform sampler2D uImage;
varying float vNoise;

void main() {
    vec2 newUV = vUv;

    vec4 imageView =  texture2D(uImage, newUV);
    gl_FragColor = imageView;
    gl_FragColor.rgb += vec3(vNoise / 7.0);
}