import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
export type SculptureKind = 'signature' | 'web' | 'systems' | 'growth' | 'architecture';

let logoMesh: Promise<{ geometry: THREE.BufferGeometry; scale: number }> | undefined;
function loadLogoMesh() {
  const compressed = 'DecompressionStream' in window;
  return logoMesh ??= fetch('/graphics/vizitor-mark.bin' + (compressed ? '.gz' : '')).then(async response => {
    if (!response.ok) throw new Error('Logo mesh unavailable');
    let buffer = await response.arrayBuffer();
    // Static hosts may already serve .gz with Content-Encoding: gzip.
    if (new DataView(buffer).getUint32(0, true) !== 0x565a4731 && compressed) buffer = await new Response(new Blob([buffer]).stream().pipeThrough(new DecompressionStream('gzip'))).arrayBuffer();
    const header = new DataView(buffer);
    if (header.getUint32(0, true) !== 0x565a4731) throw new Error('Invalid logo mesh');
    const count = header.getUint32(4, true), faces = header.getUint32(8, true);
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(new Int16Array(buffer, 16, count * 3), 3, true));
    geometry.setAttribute('normal', new THREE.BufferAttribute(new Int8Array(buffer, 16 + count * 6, count * 3), 3, true));
    geometry.addGroup(0, faces, 0); geometry.addGroup(faces, count - faces, 1);
    geometry.computeBoundingSphere();
    return { geometry, scale: header.getFloat32(12, true) };
  }).catch(error => { logoMesh = undefined; throw error; });
}
function studioEnvironment() {
  const canvas = document.createElement('canvas'); canvas.width = 512; canvas.height = 256;
  const context = canvas.getContext('2d')!;
  const gradient = context.createLinearGradient(0, 0, 0, 256);
  gradient.addColorStop(0, '#e8ecf0'); gradient.addColorStop(.4, '#39434c'); gradient.addColorStop(.65, '#18212a'); gradient.addColorStop(1, '#a1aab1');
  context.fillStyle = gradient; context.fillRect(0, 0, 512, 256);
  context.fillStyle = '#ffffff'; context.fillRect(35, 32, 95, 150); context.fillRect(240, 22, 58, 112);
  context.fillStyle = '#bbc9d4'; context.fillRect(410, 52, 43, 134);
  const texture = new THREE.CanvasTexture(canvas); texture.mapping = THREE.EquirectangularReflectionMapping; texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

export async function createSculpture(host: HTMLDivElement, kind: SculptureKind, isPaused: () => boolean, capture = false) {
  const prepared = kind === 'signature' ? await loadLogoMesh() : undefined;
  const compact = window.matchMedia('(max-width: 600px)');
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: capture, powerPreference: 'low-power' });
  renderer.setPixelRatio(1);
  renderer.setClearColor(0x000000, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.25;
  renderer.domElement.setAttribute('aria-hidden', 'true');
  host.appendChild(renderer.domElement);
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(kind === 'signature' ? 32 : 35, 1, .1, 50);
  camera.position.set(0, .1, kind === 'signature' ? 9.6 : 8.3);
  const environment = studioEnvironment();
  scene.environment = environment;
  scene.environmentIntensity = 1.45;
  const orange = new THREE.MeshStandardMaterial({ color: '#ff5c35', metalness: .65, roughness: .28, envMapIntensity: .6, emissive: '#ff5c35', emissiveIntensity: .07 });
  const orangeFace = new THREE.MeshBasicMaterial({ color: '#ff5c35', toneMapped: false });
  const platinum = new THREE.MeshStandardMaterial({ color: '#d6dde2', metalness: 1, roughness: .16, envMapIntensity: 1.9 });
  const graphite = new THREE.MeshStandardMaterial({ color: '#30373e', metalness: .95, roughness: .25, envMapIntensity: 1.5 });
  const light1 = new THREE.DirectionalLight('#ffffff', 3);light1.position.set(4,5,4);scene.add(light1);
  const light2 = new THREE.DirectionalLight('#c8daed', 3);light2.position.set(-4,1,3);scene.add(light2);
  const rim = new THREE.PointLight('#ff5c35', 14, 15);rim.position.set(2,-1,3);scene.add(rim);
  scene.add(new THREE.AmbientLight('#ffffff', .3));
  const root = new THREE.Group();scene.add(root);
  const animated: THREE.Object3D[] = [];
  const extraMaterials: THREE.Material[] = [];
  function mesh(geometry: THREE.BufferGeometry, material: THREE.Material, position: [number,number,number] = [0,0,0]) {
    const object = new THREE.Mesh(geometry, material);object.position.set(...position);root.add(object);return object;
  }
  if (kind === 'signature') {
    const logo = new THREE.Group();
    logo.add(new THREE.Mesh(prepared!.geometry.clone(), [orangeFace, orange]));
    logo.scale.set(prepared!.scale, -prepared!.scale, prepared!.scale);
    logo.rotation.set(.12, -.25, -.14);
    logo.position.z = .4;
    root.add(logo);
    logo.userData.isLogo = true;
    const orbit = mesh(new THREE.TorusGeometry(2,.045,12,128),platinum,[0,-.05,-1.6]);orbit.rotation.set(1.06,-.35,-.4);orbit.userData.mobileFrame=true;
    const orbit2 = mesh(new THREE.TorusGeometry(2.18,.012,8,128),graphite,[0,0,-1.7]);orbit2.rotation.set(.95,.4,-.25);
    const orb = mesh(new THREE.SphereGeometry(.25,32,24),platinum,[1.65,1.35,.6]);animated.push(orb);
    const orb2 = mesh(new THREE.SphereGeometry(.14,24,16),orange,[-1.8,-.85,.8]);animated.push(orb2);
    const orb3 = mesh(new THREE.SphereGeometry(.085,16,12),platinum,[1.5,-1.5,-.25]);animated.push(orb3);
    root.rotation.set(.08,.05,-.07);
  } else if (kind === 'architecture') {
    const material = new THREE.MeshStandardMaterial({ color: '#e1e5e8', metalness: .52, roughness: .27, envMapIntensity: 1.1 });
    extraMaterials.push(material);
    const cubes = new THREE.InstancedMesh(new RoundedBoxGeometry(.255, .255, 1, 2, .008), material, 252);
    const transform = new THREE.Object3D();
    const color = new THREE.Color();
    for (let index = 0; index < 252; index++) {
      const column = index % 18, row = Math.floor(index / 18);
      const variation = (column * 17 + row * 29 + column * row * 3) % 11;
      const depth = .19 + variation * .095;
      transform.position.set((column - 8.5) * .267, (row - 6.5) * .267, depth / 2 - .4);
      transform.scale.set(1, 1, depth); transform.updateMatrix(); cubes.setMatrixAt(index, transform.matrix);
      color.set(index === 38 || index === 93 || index === 149 || index === 208 ? '#ff5c35' : variation % 4 === 0 ? '#a1abb4' : variation % 3 === 0 ? '#d2d9df' : '#eef0f2');
      cubes.setColorAt(index, color);
    }
    cubes.instanceMatrix.needsUpdate = true; root.add(cubes); root.rotation.set(-.22, .34, .06);
  } else if (kind === 'web') {
    for (let i=0;i<3;i++) {
      const sheet = mesh(new RoundedBoxGeometry(2.65,1.75,.12,4,.09),i===1?orange:i===2?graphite:platinum,[0,(i-1)*.47,(i-1)*.35]);sheet.rotation.set(-.38,-.5,-.22);
    }
    mesh(new THREE.SphereGeometry(.18,24,16),orange,[1.5,1,-.1]);
  } else if (kind === 'systems') {
    const a = mesh(new THREE.TorusGeometry(.9,.19,20,80),platinum,[-.55,.1,0]);a.rotation.set(.5,.45,-.6);
    const b = mesh(new THREE.TorusGeometry(.9,.19,20,80),orange,[.6,-.1,.1]);b.rotation.set(-.55,-.5,.5);
    mesh(new THREE.SphereGeometry(.24,28,20),graphite,[.15,1.3,.3]);
  } else {
    for(let i=0;i<4;i++) {
      const column = mesh(new RoundedBoxGeometry(.5,.7+i*.45,.5,4,.09),i===3?orange:platinum,[-1.05+i*.7,-.6+i*.225,0]);column.rotation.y=-.2;
    }
    mesh(new THREE.SphereGeometry(.3,32,24),orange,[.6,1.55,.2]);root.rotation.set(.1,-.3,-.08);
  }
  const base = root.rotation.clone();
  const initialBounds = new THREE.Box3().setFromObject(root).getSize(new THREE.Vector3());
  const mobileLogo = root.children.find(child => child.userData.isLogo);
  const mobileBounds = mobileLogo ? new THREE.Box3().setFromObject(mobileLogo).getSize(new THREE.Vector3()) : initialBounds;
  const pointer = new THREE.Vector2();
  let visible = true, frame = 0, last = 0, elapsed = 0, stopped = false, lost = false, hovering = false;
  const moving = () => !isPaused() && !reduced.matches && !document.hidden && visible && !lost;
  function render(time = 0) {
    frame = 0;if(stopped || lost)return;
    if (!moving() && last !== 0) { renderer.render(scene,camera);return; }
    // A steady 30 fps at rest; fine-pointer interaction gets the full refresh rate.
    const interval = finePointer.matches && hovering ? 1000 / 60 : 1000 / 30;
    if(time-last >= interval - 1 || last===0) {
      const delta=last?Math.min((time-last)/1000,.08):0;last=time;elapsed+=delta;
      const active=moving();
      const damping = 1 - Math.exp(-delta * 1.85);
      root.rotation.y = THREE.MathUtils.lerp(root.rotation.y,base.y+(active?Math.sin(elapsed*.22)*.18+pointer.x*.17:0),damping);
      root.rotation.x = THREE.MathUtils.lerp(root.rotation.x,base.x+(active?Math.sin(elapsed*.17)*.07-pointer.y*.1:0),damping);
      root.position.y = active?Math.sin(elapsed*.6)*.07:0;
      animated.forEach((o,i)=>{o.rotation.y=elapsed*.25;if(i===0)o.position.y=1.35+(active?Math.sin(elapsed*.55)*.09:0);});
      renderer.render(scene,camera);
    }
    if(moving())frame=requestAnimationFrame(render);
  }
  function wake() { if(isPaused()){cancelAnimationFrame(frame);frame=0;return;} if(!frame&&!stopped){last=0;frame=requestAnimationFrame(render);} }
  function resize() {
    const { width, height } = host.getBoundingClientRect(); if (!width || !height) return;
    const pixelBudget = kind === 'signature' ? (compact.matches ? 210000 : 760000) : 160000;
    const ratio = capture ? 2 : Math.min(window.devicePixelRatio, compact.matches ? 1.6 : 1.7, Math.sqrt(pixelBudget / (width * height)));
    renderer.setSize(Math.round(width * ratio), Math.round(height * ratio), false);
    camera.aspect = width / height;
    if (kind === 'signature') {
      const logo = root.children.find(child => child.userData.isLogo);
      logo?.rotation.set(compact.matches ? .20 : .12, compact.matches ? -.32 : -.25, compact.matches ? -.10 : -.14);
      root.children.forEach(child => { child.visible = !compact.matches || !!child.userData.isLogo; });
      base.set(compact.matches ? .035 : .08, compact.matches ? .025 : .05, compact.matches ? 0 : -.07);
      const tangent = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
      camera.position.z = compact.matches ? Math.max(mobileBounds.y / (2 * tangent), mobileBounds.x / (2 * tangent * camera.aspect)) * 1.06 + .65 : 9.6;
    }
    if (kind !== 'signature') camera.position.z = kind === 'architecture' ? 6.7 : compact.matches ? 6.1 : 8.3;
    camera.updateProjectionMatrix(); wake();
  }
  function move(e: PointerEvent) {if(!finePointer.matches)return;hovering=true;const r=host.getBoundingClientRect();pointer.set((e.clientX-r.left)/r.width*2-1,(e.clientY-r.top)/r.height*2-1);}
  function leave(){hovering=false;pointer.set(0,0);}
  function contextLost(e: Event){e.preventDefault();lost=true;cancelAnimationFrame(frame);frame=0;host.classList.remove('ready');host.dataset.ready='false';}
  function contextRestored(){lost=false;host.classList.add('ready');host.dataset.ready='true';wake();}
  function visibility(){if(document.hidden){cancelAnimationFrame(frame);frame=0;}else wake();}
  const observer=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;if(visible)wake();else if(frame){cancelAnimationFrame(frame);frame=0;}},{threshold:.02});observer.observe(host);
  const sizeObserver=new ResizeObserver(resize);sizeObserver.observe(host);
  host.addEventListener('pointermove',move);host.addEventListener('pointerleave',leave);host.addEventListener('sculpture-pause',wake);
  renderer.domElement.addEventListener('webglcontextlost',contextLost);
  renderer.domElement.addEventListener('webglcontextrestored',contextRestored);
  document.addEventListener('visibilitychange',visibility);reduced.addEventListener('change',wake);
  resize();
  return ()=>{stopped=true;cancelAnimationFrame(frame);observer.disconnect();sizeObserver.disconnect();host.removeEventListener('pointermove',move);host.removeEventListener('pointerleave',leave);host.removeEventListener('sculpture-pause',wake);document.removeEventListener('visibilitychange',visibility);reduced.removeEventListener('change',wake);renderer.domElement.removeEventListener('webglcontextlost',contextLost);renderer.domElement.removeEventListener('webglcontextrestored',contextRestored);root.traverse(o=>{if(o instanceof THREE.Mesh)o.geometry.dispose();});orange.dispose();orangeFace.dispose();platinum.dispose();graphite.dispose();extraMaterials.forEach(material=>material.dispose());environment.dispose();renderer.dispose();renderer.forceContextLoss();renderer.domElement.remove();};
}



