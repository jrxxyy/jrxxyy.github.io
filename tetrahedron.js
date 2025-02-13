// JavaScript code for rendering a 3D tetrahedron
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Create a black and white material for the tetrahedron
const material = new THREE.MeshBasicMaterial({ color: 0x000000, wireframe: true });

// Create a geometry for the tetrahedron
const geometry = new THREE.TetrahedronGeometry();
const tetrahedron = new THREE.Mesh(geometry, material);

// Position the tetrahedron at the center of the scene
tetrahedron.position.set(0, 0, 0);  // Center the tetrahedron

// Add the tetrahedron to the scene
scene.add(tetrahedron);

function animate() {
    requestAnimationFrame(animate);
    tetrahedron.rotation.x += 0.01;
    tetrahedron.rotation.y += 0.01;
    renderer.render(scene, camera);
}
animate();
