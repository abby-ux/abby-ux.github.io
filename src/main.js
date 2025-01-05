import './style.css';

import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { Raycaster } from 'three';

//scene holds all our cameras, objects
const scene = new THREE.Scene();

// camera with human like perspective
// - field of view (75/360), aspect ratio (based off browser window), view frustrum (many objects are visible from camera lense)
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000);

// render graphics in scene
// use canvas as dom element to render from
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg'),
});

renderer.setPixelRatio( window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
// move position farther from middle fo scene
camera.position.setZ(30);

renderer.render(scene, camera);

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

// creating an object
// 1) geometry - vectors the define object
// 2) material - wrapping paper of object
// 3) mesh - geo + material

const geometry = new THREE.TorusGeometry( 10, 3, 16, 100);
// most material require light source, this does not
const material = new THREE.MeshStandardMaterial({ color: 0xFF6347 });
const torus = new THREE.Mesh( geometry, material );

scene.add(torus);

const pointLight = new THREE.PointLight(0xffffff, 700); // Second parameter is intensity
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5); // Lower intensity for ambient to maintain contrast

pointLight.position.set(12,12,12);

// add the object (light) to the scene
scene.add(pointLight, ambientLight);

const lightHelper = new THREE.PointLightHelper(pointLight);
const gridHelper = new THREE.GridHelper(200, 50);
scene.add(lightHelper, gridHelper);

// listen to dom events from mouse, update camera setting accordingly
const controls = new OrbitControls(camera, renderer.domElement);

// populate outerspace with randomly generated stars
function addStar() {
  // each sphere has radius .25
  const geometry = new THREE.SphereGeometry(0.25, 24, 24);
  const material = new THREE.MeshStandardMaterial({ color: 0Xffffff });
  const star = new THREE.Mesh(geometry, material);

  // map each value to random float spread function
  const [x, y, z] = Array(3).fill().map(() => 
    THREE.MathUtils.randFloatSpread(100)
  );

  star.position.set(x, y, z);
  scene.add(star);
}

Array(200).fill().forEach(addStar);

const spaceTexture = new THREE.TextureLoader().load('space.jpg');
scene.background = spaceTexture;

const p1Texture = new THREE.TextureLoader().load('p1.png');
const p2Texture = new THREE.TextureLoader().load('p2.png');
const p3Texture = new THREE.TextureLoader().load('p3.png');

const abby = new THREE.Mesh(
  new THREE.BoxGeometry(3,3,3),
  new THREE.MeshBasicMaterial({ map: p1Texture })
);

scene.add(abby);

const moonTexture = new THREE.TextureLoader().load('moon.jpg');
const normalTexture = new THREE.TextureLoader().load('normal.jpg');
const moon = new THREE.Mesh(
  new THREE.SphereGeometry(3, 32, 32),
  new THREE.MeshStandardMaterial({
    map:moonTexture,
    normalMap: normalTexture
  })
);

scene.add(moon);

// = vs set does same thing
moon.position.z = 30;
moon.position.setX(-10);

window.addEventListener('click', (event) => {
  // Calculate mouse position in normalized device coordinates
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  // Update the picking ray with the camera and mouse position
  raycaster.setFromCamera(mouse, camera);

  // Calculate objects intersecting the picking ray
  const intersects = raycaster.intersectObject(moon);

  if (intersects.length > 0) {
    // Navigate to your desired page
    window.location.href = '/home.html';
  }
});

// Add mousemove event listener
window.addEventListener('mousemove', (event) => {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
});

function moveCamera() {
  // calculate where user is scrolled to
  const t = document.body.getBoundingClientRect().top;
  moon.rotation.x += 0.05;
  moon.rotation.y += 0.075;
  moon.rotation.z += 0.05;

  abby.rotation.y += 0.01;
  abby.rotation.z += 0.01;

  camera.position.z = t * -0.01;
  camera.position.x = t * -0.0002;
  camera.position.y = t * -0.0002;

}

document.body.onscroll = moveCamera

// set up recursice function (endless) that automatically rerenders
function animate() {
  requestAnimationFrame(animate);

  // amount change per animation frame
  torus.rotation.x += 0.01;
  torus.rotation.y += 0.005;
  torus.rotation.z += 0.01;

  controls.update();

  // Update the picking ray with the camera and mouse position
  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObject(moon);
  
  if (intersects.length > 0) {
    document.body.style.cursor = 'pointer';
  } else {
    document.body.style.cursor = 'default';
  }


  renderer.render(scene, camera);
}

animate();