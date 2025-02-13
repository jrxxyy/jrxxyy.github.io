// JavaScript code for rendering a 3D tetrahedron
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const geometry = new THREE.TetrahedronGeometry();
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true });
const tetrahedron = new THREE.Mesh(geometry, material);
scene.add(tetrahedron);

function animate() {
    requestAnimationFrame(animate);
    tetrahedron.rotation.x += 0.01;
    tetrahedron.rotation.y += 0.01;
    renderer.render(scene, camera);
}
animate();
