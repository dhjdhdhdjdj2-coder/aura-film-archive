export const posterVertexShader = /* glsl */ `
  varying vec2 vUv;

  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export const posterFragmentShader = /* glsl */ `
  uniform sampler2D uPoster;
  uniform float uGlow;
  varying vec2 vUv;

  void main() {
    vec4 color = texture2D(uPoster, vUv);
    float edge = smoothstep(0.72, 0.08, distance(vUv, vec2(0.5)));
    vec3 retrieval = vec3(0.16, 0.105, 0.045) * edge * uGlow;
    gl_FragColor = vec4(color.rgb + retrieval, color.a);
  }
`;
