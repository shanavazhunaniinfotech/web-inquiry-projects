/* Interactive 3D Technogel® surface (Three.js) */
import * as THREE from "three";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";

const canvas = document.getElementById("gel3d");
const section = canvas && canvas.closest(".press");
const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function fail() { if (section) section.classList.add("no-webgl"); }

if (canvas) {
  try { init(); } catch (e) { console.warn("WebGL unavailable", e); fail(); }
}

function init() {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: "high-performance" });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 0.9;

  const scene = new THREE.Scene();
  scene.fog = new THREE.Fog(0x0b1822, 9, 26);
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environmentIntensity = 0.6;

  const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 100);
  camera.position.set(0, 6.2, 12.5);
  camera.lookAt(0, 0, 2.2);

  // gel cubes
  const isSmall = window.innerWidth < 700;
  const COLS = isSmall ? 18 : 34, ROWS = isSmall ? 20 : 24, GAP = 1.0;
  const geo = new RoundedBoxGeometry(0.86, 0.55, 0.86, 2, 0.16);
  const mat = new THREE.MeshPhysicalMaterial({
    color: 0x0a9fdc, roughness: 0.2, metalness: 0.0, clearcoat: 1, clearcoatRoughness: 0.06,
    emissive: 0x012a44, emissiveIntensity: 0.3
  });
  const count = COLS * ROWS;
  const mesh = new THREE.InstancedMesh(geo, mat, count);
  mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  scene.add(mesh);

  // base tray
  const base = new THREE.Mesh(new THREE.PlaneGeometry(COLS * GAP + 6, ROWS * GAP + 6), new THREE.MeshStandardMaterial({ color: 0x0d2333, roughness: 0.9 }));
  base.rotation.x = -Math.PI / 2; base.position.y = -0.3; scene.add(base);

  scene.add(new THREE.HemisphereLight(0xbfefff, 0x06121b, 0.45));
  const key = new THREE.DirectionalLight(0xffffff, 1.2); key.position.set(-6, 12, 6); scene.add(key);
  const glow = new THREE.PointLight(0x7fdcff, 30, 9, 1.6); glow.position.set(0, 2.2, 0); scene.add(glow);

  const N = count;
  const px = new Float32Array(N), pz = new Float32Array(N);
  const sY = new Float32Array(N).fill(1), vY = new Float32Array(N);
  const ox = new Float32Array(N), oz = new Float32Array(N);
  const press = new Float32Array(N);
  let k = 0;
  for (let j = 0; j < ROWS; j++) for (let i = 0; i < COLS; i++) { px[k] = (i - (COLS - 1) / 2) * GAP; pz[k] = (j - (ROWS - 1) / 2) * GAP; k++; }

  const dummy = new THREE.Object3D();
  const cBase = new THREE.Color(0x0a9fdc), cDeep = new THREE.Color(0x034f86), cLight = new THREE.Color(0x7fdcff), tmp = new THREE.Color();
  for (let n = 0; n < N; n++) mesh.setColorAt(n, cBase);

  // pointer
  const ray = new THREE.Raycaster(), ndc = new THREE.Vector2(), plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0), hit = new THREE.Vector3();
  const P = { x: 0, z: 2, tx: 0, tz: 2, s: 0, ts: 0, last: -1e9, down: false };
  function onMove(e) {
    const r = canvas.getBoundingClientRect();
    const pt = e.touches ? e.touches[0] : e;
    ndc.set(((pt.clientX - r.left) / r.width) * 2 - 1, -((pt.clientY - r.top) / r.height) * 2 + 1);
    ray.setFromCamera(ndc, camera);
    if (ray.ray.intersectPlane(plane, hit)) { P.tx = hit.x; P.tz = hit.z; P.last = performance.now(); }
  }
  canvas.addEventListener("pointermove", onMove);
  canvas.addEventListener("pointerdown", (e) => { onMove(e); P.down = true; });
  window.addEventListener("pointerup", () => { P.down = false; });
  canvas.addEventListener("touchmove", onMove, { passive: true });

  function resize() {
    const w = canvas.clientWidth, h = canvas.clientHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.fov = w / h < 0.8 ? 50 : 34;
    camera.updateProjectionMatrix();
  }
  window.addEventListener("resize", resize); resize();

  let visible = true, running = false, t = 0;
  new IntersectionObserver((en) => { visible = en[0].isIntersecting; if (visible && !running) { running = true; requestAnimationFrame(loop); } }, { rootMargin: "120px" }).observe(canvas);

  const clock = new THREE.Clock();
  function loop() {
    if (!visible) { running = false; return; }
    const dt = Math.min(clock.getDelta(), 0.05); t += dt;
    const idle = performance.now() - P.last > 2200;
    if (idle) {
      P.tx = Math.sin(t * 0.45) * COLS * 0.28;
      P.tz = 4 + Math.sin(t * 0.7 + 1) * 2.6;
      P.ts = 0.55 + 0.45 * Math.max(0, Math.sin(t * 1.4));
    } else P.ts = P.down ? 1.25 : 1;
    P.x += (P.tx - P.x) * 0.1; P.z += (P.tz - P.z) * 0.1; P.s += (P.ts - P.s) * 0.08;
    glow.position.set(P.x, 1.6 + (1 - P.s) * 0.8, P.z);
    glow.intensity = 14 + P.s * 30;

    const R = P.down ? 2.4 : 1.9, R2 = R * R;
    for (let n = 0; n < N; n++) {
      const dx = px[n] - P.x, dz = pz[n] - P.z;
      const d2 = dx * dx + dz * dz, d = Math.sqrt(d2) || 1;
      const f = Math.exp(-d2 / R2) * P.s;
      const ring = Math.exp(-Math.pow((d - R * 1.45) / (R * 0.55), 2)) * P.s;
      const wave = Math.sin(d * 0.7 - t * 1.6) * 0.03;
      const target = 1 - 0.72 * f + 0.2 * ring + wave;
      vY[n] += (target - sY[n]) * 0.16; vY[n] *= 0.8; sY[n] += vY[n];
      const push = (f * 0.16 + ring * 0.06);
      ox[n] += ((dx / d) * push - ox[n]) * 0.15; oz[n] += ((dz / d) * push - oz[n]) * 0.15;
      press[n] += (f - press[n]) * 0.15;
      const sy = Math.max(0.3, sY[n]);
      dummy.position.set(px[n] + ox[n], -0.3 + 0.275 * sy, pz[n] + oz[n]);
      dummy.scale.set(1 + (1 - sy) * 0.22, sy, 1 + (1 - sy) * 0.22);
      dummy.updateMatrix();
      mesh.setMatrixAt(n, dummy.matrix);
      const p = Math.min(1, press[n] * 1.3);
      tmp.copy(cBase).lerp(cDeep, p * 0.85).lerp(cLight, Math.max(0, ring * 0.25));
      mesh.setColorAt(n, tmp);
    }
    mesh.instanceMatrix.needsUpdate = true;
    mesh.instanceColor.needsUpdate = true;
    renderer.render(scene, camera);
    if (!reduce) requestAnimationFrame(loop); else running = false;
  }
}
