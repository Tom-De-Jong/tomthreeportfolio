import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

//hero
var canvReference = document.getElementById("my_canvas");

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const ambientLight = new THREE.AmbientLight(0xddeeff, 0.9);
scene.add(ambientLight);

const keyLight = new THREE.DirectionalLight(0xffffff, 1.2);
keyLight.position.set(-8, 12, 15);
scene.add(keyLight);

const fillLight = new THREE.DirectionalLight(0x9ab8e8, 0.4);
fillLight.position.set(10, 0, -10);
scene.add(fillLight);



const canvas = document.getElementById('my_canvas');
const renderer = new THREE.WebGLRenderer({ canvas });

const container = canvas.parentElement;

renderer.setSize(container.clientWidth, container.clientHeight);


renderer.setClearColor(0x000000, 0); // the default

// bg plane
const geometry = new THREE.PlaneGeometry(250, 250, 24, 24);
const material = new THREE.MeshBasicMaterial({
  color: 0x8E95C7,
  side: THREE.DoubleSide,
  wireframe: true,
  transparent: true,
  opacity: 0.05,
});
const plane = new THREE.Mesh(geometry, material);
plane.position.set(0, 0, -50)
scene.add(plane);


//cone
const coneGeometry = new THREE.ConeGeometry(7, 10, 5);
const coneMaterial = new THREE.MeshStandardMaterial({
  color: 0x2a5298,
  roughness: 0.85,
  metalness: 0.15,
  envMapIntensity: 0.8,
});
const cone = new THREE.Mesh(coneGeometry, coneMaterial);
scene.add(cone);

const dodecahedronGeometry = new THREE.DodecahedronGeometry(7);
const dodecahedronMaterial = new THREE.MeshStandardMaterial({
  color: 0x2a5298,
  roughness: 0.85,
  metalness: 0.15,
  envMapIntensity: 0.8,
});
const dodecahedron = new THREE.Mesh(dodecahedronGeometry, dodecahedronMaterial);
scene.add(dodecahedron);


const octahedronGeometry = new THREE.OctahedronGeometry(10);
const octahedronMaterial = new THREE.MeshStandardMaterial({
  color: 0x2a5298,
  roughness: 0.85,
  metalness: 0.15,
  envMapIntensity: 0.8,
});
const octahedron = new THREE.Mesh(octahedronGeometry, octahedronMaterial);
scene.add(octahedron);

const tetrahedronGeometry = new THREE.TetrahedronGeometry(8);
const tetrahedronMaterial = new THREE.MeshStandardMaterial({
  color: 0x2a5298,
  roughness: 0.85,
  metalness: 0.15,
  envMapIntensity: 0.8,
});
const tetrahedron = new THREE.Mesh(tetrahedronGeometry, tetrahedronMaterial);
scene.add(tetrahedron);



camera.position.z = 15;

cone.position.set(-1, -5, -25);
dodecahedron.position.set(25, 20, -25);
octahedron.position.set(-10, 18, -25)
tetrahedron.position.set(35, -18, -25)

const mouse = new THREE.Vector2();
const targetMouse = new THREE.Vector2();

window.addEventListener('mousemove', (event) => {
  targetMouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  targetMouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
});

const origins = {
  cone: cone.position.clone(),
  dodecahedron: dodecahedron.position.clone(),
  octahedron: octahedron.position.clone(),
  tetrahedron: tetrahedron.position.clone(),
};

//my work cards

var workCanvReference = document.getElementById("workCanvas");

const workScene = new THREE.Scene();
const workCamera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const workAmbientLight = new THREE.AmbientLight(0xddeeff, 0.9);
workScene.add(workAmbientLight);

const workKeyLight = new THREE.DirectionalLight(0xffffff, 1.2);
workKeyLight.position.set(-8, 12, 15);
workScene.add(workKeyLight);

const workFillLight = new THREE.DirectionalLight(0x9ab8e8, 0.4);
workFillLight.position.set(10, 0, -10);
workScene.add(workFillLight);

var workRenderer = new THREE.WebGLRenderer({ alpha: true, canvas: workCanvReference });
workRenderer.setSize(window.innerWidth, window.innerHeight);
workRenderer.setPixelRatio(window.devicePixelRatio);
workRenderer.setClearColor(0x000000, 0);
workRenderer.outputEncoding = THREE.sRGBEncoding;

const workControls = new OrbitControls(workCamera, workRenderer.domElement);

workControls.minPolarAngle = Math.PI / 2.2;
workControls.maxPolarAngle = Math.PI / 1.8;
workControls.enableZoom = false;
workControls.enableDamping = true;
workControls.dampingFactor = 0.025;
workControls.autoRotate = true
workControls.autoRotateSpeed = -2;
workControls.enablePan = false;

const planeCount = 4;
const radius = 70;

const textureLoader = new THREE.TextureLoader();

const images = [
  '/img/1.png',
  '/img/2.png',
  '/img/3.png',
  '/img/4.png'
];

const urls = [
  'https://trouwambtenaarmarlies.nl',
  'https://naomisluisterhart.nl/',
  'https://trein.tomwebsites.nl/',
  'https://health.tomwebsites.nl/'
];

const planeGeometry = new THREE.PlaneGeometry(100, 60, 1, 1);

for (let i = 0; i < planeCount; i++) {
  const angle = (i / planeCount) * Math.PI * 2;

  const planeMaterial = new THREE.MeshBasicMaterial({
    side: THREE.DoubleSide,
    color: 0xcccccc,
  });

  textureLoader.load(images[i], (texture) => {
    texture.colorSpace = THREE.SRGBColorSpace;
    planeMaterial.map = texture;
    planeMaterial.needsUpdate = true;
  });

  const plane = new THREE.Mesh(planeGeometry, planeMaterial);

  plane.userData.url = urls[i];

  plane.position.x = Math.sin(angle) * radius;
  plane.position.z = Math.cos(angle) * radius;
  plane.lookAt(0, 0, 0);
  plane.rotation.y += Math.PI;

  workScene.add(plane);
}
workCamera.position.z = 150;

const raycaster = new THREE.Raycaster();

//fixed dragging click issue
let isDragging = false;
let startX = 0;
let startY = 0;

document.addEventListener('mousedown', function (event) {
  startX = event.clientX;
  startY = event.clientY;
  isDragging = false;
});

document.addEventListener('mousemove', function (event) {
  const dx = event.clientX - startX;
  const dy = event.clientY - startY;

  if (Math.abs(dx) > 8 || Math.abs(dy) > 8) {
    isDragging = true;
  }
});

document.addEventListener('mouseup', function (event) {
  if (isDragging) return;

  const coords = new THREE.Vector2(
    (event.clientX / renderer.domElement.clientWidth) * 2 - 1,
    -((event.clientY / renderer.domElement.clientHeight) * 2 - 1),
  )

  raycaster.setFromCamera(coords, workCamera)

  const intersections = raycaster.intersectObjects(workScene.children, true);
  if (intersections.length > 0) {
    const selectedObject = intersections[0].object;

    if (selectedObject.userData.url) {
      window.open(selectedObject.userData.url, "_blank");
    }
  }
});



let t = 0;


function animate() {
  t += 0.01;

  cone.rotation.y += 0.003;
  cone.rotation.x += 0.00175;
  cone.rotation.z += 0.00125;

  dodecahedron.rotation.y += 0.00175;
  dodecahedron.rotation.x += 0.00325;
  dodecahedron.rotation.z += 0.00225;

  octahedron.rotation.y += 0.00125;
  octahedron.rotation.x += 0.00225;
  octahedron.rotation.z += 0.004;

  tetrahedron.rotation.y += 0.0045;
  tetrahedron.rotation.x += 0.001;
  tetrahedron.rotation.z += 0.00275;

  cone.position.x = origins.cone.x + Math.sin(t * 0.8) * 0.3;
  cone.position.y = origins.cone.y + Math.sin(t) * 0.5;
  cone.position.z = origins.cone.z + Math.sin(t * 1.2) * 0.3;

  dodecahedron.position.x = origins.dodecahedron.x + Math.sin(t * 0.9 + Math.PI) * 5;
  dodecahedron.position.y = origins.dodecahedron.y + Math.sin(t + Math.PI) * 5;
  dodecahedron.position.z = origins.dodecahedron.z + Math.sin(t * 0.7 + Math.PI) * 5;

  octahedron.position.x = origins.octahedron.x + Math.sin(t * 1.1 + Math.PI / 2) * 5;
  octahedron.position.y = origins.octahedron.y + Math.sin(t + Math.PI / 2) * 5;
  octahedron.position.z = origins.octahedron.z + Math.sin(t * 0.6 + Math.PI / 2) * 5;

  tetrahedron.position.x = origins.tetrahedron.x + Math.sin(t * 0.7 + Math.PI * 1.5) * 5;
  tetrahedron.position.y = origins.tetrahedron.y + Math.sin(t + Math.PI * 1.5) * 5;
  tetrahedron.position.z = origins.tetrahedron.z + Math.sin(t * 1.3 + Math.PI * 1.5) * 5;

  mouse.lerp(targetMouse, 0.1);

  camera.position.x = mouse.x * 1.5;
  camera.position.y = mouse.y * 1.5;

  camera.lookAt(scene.position);
  renderer.render(scene, camera);

  //work stuff
  workControls.update();
  workRenderer.render(workScene, workCamera);

}
renderer.setAnimationLoop(animate);