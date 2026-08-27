import * as THREE from 'three';
import type { RenderTier } from '../lib/renderTier';
import { disposeScene } from './disposeScene';
import { posterFragmentShader, posterVertexShader } from './posterShader';

export interface PosterSceneOptions {
  tier: Exclude<RenderTier, 'static'>;
  posters: readonly string[];
  reducedMotion: boolean;
  onContextLoss?: () => void;
}

export interface PosterSceneController {
  dispose(): void;
  resize(width: number, height: number): void;
  setRunning(running: boolean): void;
}

export function createPosterScene(
  canvas: HTMLCanvasElement,
  options: PosterSceneOptions,
): PosterSceneController {
  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: options.tier === 'full',
    powerPreference: options.tier === 'full' ? 'high-performance' : 'low-power',
  });
  renderer.setPixelRatio(
    Math.min(window.devicePixelRatio || 1, options.tier === 'full' ? 1.5 : 1),
  );
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 40);
  camera.position.set(0, 0, 8.4);
  const loader = new THREE.TextureLoader();
  const planes: THREE.Mesh<THREE.PlaneGeometry, THREE.ShaderMaterial>[] = [];
  let disposed = false;

  options.posters.forEach((source, index) => {
    const offset = index - (options.posters.length - 1) / 2;
    const texture = loader.load(source, (loaded) => {
      loaded.colorSpace = THREE.SRGBColorSpace;
      if (!disposed) renderOnce();
    });
    texture.colorSpace = THREE.SRGBColorSpace;
    const geometry = new THREE.PlaneGeometry(1.2, 1.8, 1, 1);
    const material = new THREE.ShaderMaterial({
      transparent: true,
      uniforms: {
        uPoster: { value: texture },
        uGlow: { value: options.tier === 'full' ? 0.65 : 0.25 },
      },
      vertexShader: posterVertexShader,
      fragmentShader: posterFragmentShader,
    });
    const plane = new THREE.Mesh(geometry, material);
    plane.position.set(offset * 1.16, Math.abs(offset) * -0.09, -Math.abs(offset) * 0.32);
    plane.rotation.y = -offset * 0.065;
    plane.rotation.z = offset * -0.012;
    scene.add(plane);
    planes.push(plane);
  });

  let frame = 0;
  let running = false;
  let elapsed = 0;
  let lastTime = performance.now();

  const renderOnce = () => renderer.render(scene, camera);

  const render = (time: number) => {
    if (!running || disposed) return;
    const delta = Math.min(32, time - lastTime);
    lastTime = time;
    elapsed += delta;
    if (!options.reducedMotion) {
      planes.forEach((plane, index) => {
        plane.position.y += Math.sin(elapsed * 0.00022 + index * 0.8) * 0.00018;
      });
    }
    renderOnce();
    frame = requestAnimationFrame(render);
  };

  const onPointerMove = (event: PointerEvent) => {
    if (options.reducedMotion) return;
    const rect = canvas.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / Math.max(rect.width, 1) - 0.5) * 2;
    const y = ((event.clientY - rect.top) / Math.max(rect.height, 1) - 0.5) * 2;
    const cameraLimit = THREE.MathUtils.degToRad(0.6);
    const posterLimit = THREE.MathUtils.degToRad(2.5);
    camera.rotation.y = x * cameraLimit;
    camera.rotation.x = -y * cameraLimit;
    planes.forEach((plane, index) => {
      const base = -(index - (planes.length - 1) / 2) * 0.065;
      plane.rotation.y = base + x * posterLimit * 0.18;
      plane.rotation.x = -y * posterLimit * 0.12;
    });
  };
  canvas.addEventListener('pointermove', onPointerMove, { passive: true });

  const onContextLost = (event: Event) => {
    event.preventDefault();
    if (disposed) return;
    setRunning(false);
    options.onContextLoss?.();
  };
  canvas.addEventListener('webglcontextlost', onContextLost);

  const resize = (width: number, height: number) => {
    if (disposed || width <= 0 || height <= 0) return;
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderOnce();
  };

  const setRunning = (next: boolean) => {
    if (disposed || next === running) return;
    running = next;
    if (running) {
      lastTime = performance.now();
      frame = requestAnimationFrame(render);
    } else {
      cancelAnimationFrame(frame);
    }
  };

  renderOnce();

  return {
    resize,
    setRunning,
    dispose() {
      disposed = true;
      running = false;
      cancelAnimationFrame(frame);
      canvas.removeEventListener('pointermove', onPointerMove);
      canvas.removeEventListener('webglcontextlost', onContextLost);
      disposeScene(scene);
      renderer.dispose();
      renderer.forceContextLoss();
    },
  };
}
