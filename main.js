import * as THREE from 'three';

var canvReference = document.getElementById("my_canvas");

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const dirLight = new THREE.DirectionalLight(0xffffff, 1.5);
dirLight.position.set(0, 0, 25);
scene.add(dirLight);



var renderer = new THREE.WebGLRenderer({ alpha: true, canvas: canvReference });
renderer.setSize(window.innerWidth, window.innerHeight);

renderer.setClearColor(0x000000, 0); // the default

document.body.appendChild(renderer.domElement);

const coneGeometry = new THREE.ConeGeometry(5, 8, 5);
const coneMaterial = new THREE.MeshStandardMaterial({ color: 0x3366cc, roughness: 0.5, metalness: 1 });
const cone = new THREE.Mesh(coneGeometry, coneMaterial);
scene.add(cone);


camera.position.z = 15;

cone.position.set(10, 0, -25);

const mouse = new THREE.Vector2();
const targetMouse = new THREE.Vector2();

window.addEventListener('mousemove', (event) => {
    targetMouse.x = (event.clientX / window.innerWidth) * 4 - 1;
    targetMouse.y = -(event.clientY / window.innerHeight) * 4 + 1;
});

function animate() {
  cone.rotation.y += 0.01;
  cone.rotation.x += 0.009;
  cone.rotation.z += 0.0099;

  mouse.lerp(targetMouse, 0.1);

  camera.position.x = mouse.x * .5;
  camera.position.y = mouse.y * .8;

  camera.lookAt(scene.position);
  renderer.render(scene, camera);
}
renderer.setAnimationLoop(animate);