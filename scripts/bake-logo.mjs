// Run in a browser through Vite. This work is intentionally absent from the runtime bundle.
// The original SVG remains the source of truth; no replacement logo is drawn here.
import * as THREE from 'three';
import { SVGLoader } from 'three/addons/loaders/SVGLoader.js';

export async function bakeLogo() {
  const response = await fetch('/vizitor-logo.svg');
  const paths = new SVGLoader().parse(await response.text()).paths;
  const geometries = paths.flatMap(path => path.toShapes()).map(shape => new THREE.ExtrudeGeometry(shape, {
    depth: 20, bevelEnabled: true, bevelSegments: 1, steps: 1,
    bevelSize: .85, bevelThickness: 1.1, curveSegments: 6,
  }));
  const bounds = new THREE.Box3();
  geometries.forEach(geometry => { geometry.computeBoundingBox(); bounds.union(geometry.boundingBox); });
  const center = bounds.getCenter(new THREE.Vector3());
  const size = bounds.getSize(new THREE.Vector3()).multiplyScalar(.5);
  const scale = Math.max(size.x, size.y, size.z);
  const front = [], edges = [];
  for (const geometry of geometries) {
    const position = geometry.attributes.position, normal = geometry.attributes.normal;
    for (const group of geometry.groups) {
      const target = group.materialIndex === 0 ? front : edges;
      for (let index = group.start; index < group.start + group.count; index++) {
        target.push((position.getX(index) - center.x) / scale, (position.getY(index) - center.y) / scale,
          (position.getZ(index) - center.z) / scale, normal.getX(index), normal.getY(index), normal.getZ(index));
      }
    }
    geometry.dispose();
  }
  const values = front.concat(edges), vertices = values.length / 6;
  const buffer = new ArrayBuffer(16 + vertices * 9), header = new DataView(buffer);
  header.setUint32(0, 0x565a4731, true); header.setUint32(4, vertices, true);
  header.setUint32(8, front.length / 6, true); header.setFloat32(12, scale * .0128, true);
  const positions = new Int16Array(buffer, 16, vertices * 3);
  const normals = new Int8Array(buffer, 16 + vertices * 6, vertices * 3);
  for (let index = 0; index < vertices; index++) for (let axis = 0; axis < 3; axis++) {
    positions[index * 3 + axis] = Math.round(values[index * 6 + axis] * 32767);
    normals[index * 3 + axis] = Math.round(values[index * 6 + axis + 3] * 127);
  }
  const gzip = new Uint8Array(await new Response(new Blob([buffer]).stream().pipeThrough(new CompressionStream('gzip'))).arrayBuffer());
  return { plain: new Uint8Array(buffer), gzip };
}
