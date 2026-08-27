import * as THREE from 'three';

export function disposeScene(scene: THREE.Scene) {
  scene.traverse((object) => {
    if (!(object instanceof THREE.Mesh)) return;
    object.geometry.dispose();
    const materials = Array.isArray(object.material)
      ? object.material
      : [object.material];
    for (const material of materials) {
      if (material instanceof THREE.ShaderMaterial) {
        const poster = material.uniforms.uPoster?.value;
        if (poster instanceof THREE.Texture) poster.dispose();
      }
      material.dispose();
    }
  });
}
