import './style.css';

import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { Raycaster } from 'three';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
// import { TTFLoader, Font } from 'three/examples/jsm/loaders/TTFLoader.js';
// import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';
// import { Font } from "three/examples/jsm/loaders/Fontloader.js";

// for tracking when everything is loaded
let totalAssets = 0;
let loadedAssets = 0;   

function updateLoadingProgress() {
    loadedAssets++;
    const progress = (loadedAssets / totalAssets) * 100;
    const loader = document.querySelector('.loader');
    if (loader) {
        loader.textContent = `Loading... ${Math.round(progress)}%`;
    }
    
    // If everything is loaded, remove the preloader and show canvas
    if (loadedAssets === totalAssets) {
        const preloader = document.getElementById('preloader');
        const canvas = document.getElementById('moon-bg');
        
        if (preloader && canvas) {
            preloader.classList.add('fade-out');
            setTimeout(() => {
                preloader.style.display = 'none';
                canvas.style.display = 'block';
            }, 500);
        }
        
        console.log('All assets loaded!');
    }
}

// Count the assets
function initializeLoading() {
    totalAssets = 0;
    
    // Count your textures
    totalAssets += 5; //  moon.jpg, normal.jpg, p1.png, p2.png, p3.png
    
    // FBX models (arrows)
    totalAssets += 60;
    
    //  video
    totalAssets += 1;
}
initializeLoading();

//scene holds all our cameras, objects
const scene = new THREE.Scene();

// camera with human like perspective
// - field of view (75/360), aspect ratio (based off browser window), view frustrum (many objects are visible from camera lense)
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000);

// render graphics in scene
// use canvas as dom element to render from
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#moon-bg'),
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

// scene.add(torus);

const pointLight = new THREE.PointLight(0xffffff, 700); 
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5); // Lower intensity for ambient to maintain contrast

pointLight.position.set(4,4,4);

// add the object (light) to the scene
scene.add(pointLight, ambientLight);

const lightHelper = new THREE.PointLightHelper(pointLight);
const gridHelper = new THREE.GridHelper(200, 50);
scene.add(lightHelper, gridHelper);

// listen to dom events from mouse, update camera setting accordingly
const controls = new OrbitControls(camera, renderer.domElement);

const loader = new FBXLoader();


const arrows = [];
function addArrow() {
    loader.load(
        '16.fbx',   
        (object) => {
            // change material
            object.traverse((child) => {
                if (child.isMesh) {
                    // Create a new shiny pink material
                    const newMaterial = new THREE.MeshStandardMaterial({
                        color: 0xFF69B4,  // Hot pink color
                        metalness: 0.7,    // Makes it more metallic/shiny
                        roughness: 0.2,    // Lower roughness = more shiny
                        emissive: 0xFF69B4, // Makes it glow slightly
                        emissiveIntensity: 0.2 // Controls glow strength
                    });
                    child.material = newMaterial;
                }
            });
            // Random position
            const [x, y, z] = Array(3).fill().map(() => 
                THREE.MathUtils.randFloatSpread(100)
            );
            object.position.set(x, y, z);
            object.scale.set(0.01,0.01,0.01);

            // Random rotation
            object.rotation.x = Math.random() * Math.PI;
            object.rotation.y = Math.random() * Math.PI;
            object.rotation.z = Math.random() * Math.PI;

            // Random rotation speeds
            object.rotationSpeed = {
                x: (Math.random() - 0.5) * 0.01,
                y: (Math.random() - 0.5) * 0.01,
                z: (Math.random() - 0.5) * 0.01
            };
    
            scene.add(object);
            arrows.push(object);
            updateLoadingProgress();
    
            // // Add to your animation loop if you want it to rotate
            // function animate() {
            //     object.rotation.x += object.rotationSpeed.x;
            //     object.rotation.y += object.rotationSpeed.y;
            //     object.rotation.z += object.rotationSpeed.z;
            //     // ... rest of your animate code
            // }
        },
        (xhr) => {
            // Loading progress
            console.log((xhr.loaded / xhr.total * 100) + '% loaded');
        },
        (error) => {
            // Error occurred
            console.error('An error happened:', error);
            updateLoadingProgress();
        }
    );
}

// populate outerspace with randomly generated stars
// Create an array to store the stars so we can rotate them
const stars = [];

function addShape() {

    // Create more interesting geometry options
//   const geometries = [
//     new THREE.TetrahedronGeometry(0.4), // Four-sided pyramid
//     new THREE.OctahedronGeometry(0.4),  // Eight-sided diamond
//     new THREE.IcosahedronGeometry(0.4), // Twenty-sided polyhedron
//     new THREE.TorusGeometry(0.3, 0.1, 8, 8) // Small donut shape
//   ];

//   // Randomly select a geometry
//   const geometry = geometries[Math.floor(Math.random() * geometries.length)];
const geometry = new THREE.IcosahedronGeometry(0.8);
  
  // Add some color variation
  const colors = [0xffffff, 0xffd700, 0xff8c00, 0x00ffff];
  const material = new THREE.MeshStandardMaterial({ 
    color: colors[Math.floor(Math.random() * colors.length)],
    metalness: 0.7,
    roughness: 0.3
  });

  const star = new THREE.Mesh(geometry, material);

  // Random position
  const [x, y, z] = Array(3).fill().map(() => 
    THREE.MathUtils.randFloatSpread(100)
  );
  star.position.set(x, y, z);

  // Random rotation
  star.rotation.x = Math.random() * Math.PI;
  star.rotation.y = Math.random() * Math.PI;
  star.rotation.z = Math.random() * Math.PI;

  // Random rotation speeds
  star.rotationSpeed = {
    x: (Math.random() - 0.5) * 0.01,
    y: (Math.random() - 0.5) * 0.01,
    z: (Math.random() - 0.5) * 0.01
  };

  stars.push(star);
  scene.add(star);

}

function addStar() {
      // Create computer group to hold all parts
  const computer = new THREE.Group();

  // Monitor
  const monitorScreen = new THREE.Mesh(
    new THREE.BoxGeometry(1.5, 1, 0.1),
    new THREE.MeshStandardMaterial({ 
      color: 0xFF69B4,
      metalness: 0.7,
      roughness: 0.3,
      emissive: 0xFF69B4,
      emissiveIntensity: 0.2
    })
  );
  
  // Monitor frame
  const monitorFrame = new THREE.Mesh(
    new THREE.BoxGeometry(1.7, 1.2, 0.15),
    new THREE.MeshStandardMaterial({ 
      color: 0xd4368e,
      metalness: 0.9,
      roughness: 0.2
    })
  );

  // Monitor stand
  const stand = new THREE.Mesh(
    new THREE.BoxGeometry(0.2, 0.8, 0.1),
    new THREE.MeshStandardMaterial({ 
      color: 0xd4368e,
      metalness: 0.9,
      roughness: 0.2
    })
  );

  // Monitor base
  const base = new THREE.Mesh(
    new THREE.BoxGeometry(0.6, 0.1, 0.4),
    new THREE.MeshStandardMaterial({ 
      color: 0xd4368e,
      metalness: 0.9,
      roughness: 0.2
    })
  );

//   Position the parts
  monitorScreen.position.z = 0.02;
  stand.position.y = -1;
  base.position.y = -1.4;

  // Add all parts to computer group
  computer.add(monitorFrame);
  computer.add(monitorScreen);
  computer.add(stand);
  computer.add(base);

  // Random position in space
  const [x, y, z] = Array(3).fill().map(() => 
    THREE.MathUtils.randFloatSpread(150)
  );
  computer.position.set(x, y, z);

  // Random initial rotation
  computer.rotation.x = Math.random() * Math.PI;
  computer.rotation.y = Math.random() * Math.PI;
  computer.rotation.z = Math.random() * Math.PI;

  // Rotation speeds
  computer.rotationSpeed = {
    x: (Math.random() - 0.5) * 0.02,
    y: (Math.random() - 0.5) * 0.02,
    z: (Math.random() - 0.5) * 0.02
  };

  stars.push(computer);
  scene.add(computer);
}

// Array(60).fill().forEach(addShape);
// Array(60).fill().forEach(addStar);
Array(60).fill().forEach(addArrow);

// const spaceTexture = new THREE.TextureLoader().load('space.jpg');
// scene.background = spaceTexture;

// Create video element
// const video = document.createElement('video');
// video.src = 'background-vid.mp4';
// video.addEventListener('loadeddata', updateLoadingProgress);
// video.loop = true;
// video.muted = true;
// video.playsInline = true;
// video.autoplay = true;
// video.play();
const video = document.createElement('video');
video.src = 'background-vid.mp4';
video.addEventListener('loadeddata', () => {
    console.log('Video loaded successfully');
    updateLoadingProgress();
});
video.addEventListener('error', (e) => {
    console.error('Video loading error:', e);
    updateLoadingProgress(); // Still update even on error
});
video.addEventListener('play', () => {
    console.log('Video started playing');
});
video.loop = true;
video.muted = true;
video.playsInline = true;
video.autoplay = true;
video.play().catch(e => {
    console.error('Video play error:', e);
});

// Create video texture
const videoTexture = new THREE.VideoTexture(video);
videoTexture.minFilter = THREE.LinearFilter;
videoTexture.magFilter = THREE.LinearFilter;
videoTexture.format = THREE.RGBAFormat;
videoTexture.colorSpace = THREE.SRGBColorSpace;  // Proper color space
videoTexture.encoding = THREE.sRGBEncoding;      // Proper color encoding

// Set as scene background
scene.background = videoTexture;

const moonTexture = new THREE.TextureLoader().load('moon.jpg', updateLoadingProgress);
const normalTexture = new THREE.TextureLoader().load('normal.jpg', updateLoadingProgress);
const p1Texture = new THREE.TextureLoader().load('p1.png', updateLoadingProgress);
const p2Texture = new THREE.TextureLoader().load('p2.png', updateLoadingProgress);
const p3Texture = new THREE.TextureLoader().load('p3.png', updateLoadingProgress);


const abby = new THREE.Mesh(
    new THREE.BoxGeometry(3,3,3),
    new THREE.MeshBasicMaterial({ 
      map: p1Texture,
      transparent: true,
      opacity: 0 
    })
  );
  abby.name = 'abby1';
  
  const abby2 = new THREE.Mesh(
    new THREE.BoxGeometry(3,3,3),
    new THREE.MeshBasicMaterial({ 
      map: p2Texture,
      transparent: true,
      opacity: 0
    })
  );
  abby2.name = 'abby2';
  
  const abby3 = new THREE.Mesh(
    new THREE.BoxGeometry(3,3,3),
    new THREE.MeshBasicMaterial({ 
      map: p3Texture,
      transparent: true,
      opacity: 0
    })
  );
  abby3.name = 'abby3';

// const abby = new THREE.Mesh(
//   new THREE.BoxGeometry(3,3,3),
//   new THREE.MeshBasicMaterial({ map: abbyTexture })
// );

scene.add(abby);

// const abby2 = new THREE.Mesh(
//     new THREE.BoxGeometry(3,3,3),
//     new THREE.MeshBasicMaterial({ map: abbyTexture })
//   );

// Change these lines where abby2 position is set
abby2.position.z = 5;  // Closer than 45
abby2.position.y = 0;   // Start at same height as other objects
abby2.position.x = 2;  // Offset to the right to make it visible
  
  scene.add(abby2);

//   const abby3 = new THREE.Mesh(
//     new THREE.BoxGeometry(3,3,3),
//     new THREE.MeshBasicMaterial({ map: abbyTexture })
//   );

// Change these lines where abby3 position is set
abby3.position.z = 10;  // Closer than 45
abby3.position.y = 0;   // Start at same height as other objects
abby3.position.x = -2;  // Offset to the right to make it visible
  
  scene.add(abby3);

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
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects([moon, abby, abby2, abby3]);

    if (intersects.length > 0) {
        const clickedObject = intersects[0].object;
        
        // Only handle click if object is visible (opacity > 0)
        if (clickedObject.material.opacity > 0) {
            switch(clickedObject.name) {
                case 'abby1':
                    window.location.href = '/p1.html';
                    break;
                case 'abby2':
                    window.location.href = '/p2.html';
                    break;
                case 'abby3':
                    window.location.href = '/p3.html';
                    break;
                default:
                    if (clickedObject === moon) {
                        window.location.href = '/home.html';
                    }
            }
        }
    }
});

// Add mousemove event listener
window.addEventListener('mousemove', (event) => {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
});

// function moveCamera() {
//   // calculate where user is scrolled to
//   const t = document.body.getBoundingClientRect().top;
//   moon.rotation.x += 0.05;
//   moon.rotation.y += 0.075;
//   moon.rotation.z += 0.05;

//   abby.rotation.y += 0.01;
//   abby.rotation.z += 0.01;

//   // Only start rotating abby2 after scrolling past a certain point
//   if (t < -500) {  // Adjust this value to control when abby2 starts animating
//     abby2.rotation.y += 0.01;
//     abby2.rotation.z += 0.01;
//     // Optional: Add a fade-in effect by adjusting opacity
//     if (abby2.material.opacity < 1) {
//       abby2.material.opacity = Math.min(1, (-t - 500) / 500);
//     }
//   }

//   camera.position.z = t * -0.01;
//   camera.position.x = t * -0.0002;
//   camera.position.y = t * -0.0002;

// }

function moveCamera() {
    const t = document.body.getBoundingClientRect().top;
    moon.rotation.x += 0.05;
    moon.rotation.y += 0.075;
    moon.rotation.z += 0.05;
  
    // First abby appears after scrolling down 300px
    if (t < -300) {
      abby.rotation.y += 0.01;
      abby.rotation.z += 0.01;
      abby.material.opacity = Math.min(1, (-t - 300) / 200);
    } else {
      abby.material.opacity = 0;
    }
  
    // Second abby appears after scrolling down 600px
    if (t < -800) {
      abby2.rotation.y += 0.01;
      abby2.rotation.z += 0.01;
      abby2.material.opacity = Math.min(1, (-t - 800) / 200);
    } else {
      abby2.material.opacity = 0;
    }
  
    // Third abby appears after scrolling down 900px
    if (t < -1300) {
      abby3.rotation.y += 0.01;
      abby3.rotation.z += 0.01;
      abby3.material.opacity = Math.min(1, (-t - 1300) / 200);
    } else {
      abby3.material.opacity = 0;
    }
  
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
  const intersects = raycaster.intersectObjects([moon, abby, abby2, abby3]);
  
  // Change cursor if intersecting with a visible object
  if (intersects.length > 0 && 
      (intersects[0].object === moon || intersects[0].object.material.opacity > 0)) {
    document.body.style.cursor = 'pointer';
  } else {
    document.body.style.cursor = 'default';
  }

  // Rotate all arrows
  arrows.forEach(arrow => {
    arrow.rotation.x += arrow.rotationSpeed.x;
    arrow.rotation.y += arrow.rotationSpeed.y;
    arrow.rotation.z += arrow.rotationSpeed.z;
});
  // Rotate all computers
  stars.forEach(computer => {
    computer.rotation.x += computer.rotationSpeed.x;
    computer.rotation.y += computer.rotationSpeed.y;
    computer.rotation.z += computer.rotationSpeed.z;
  });


  renderer.render(scene, camera);
}

animate();

// function handleWindowResize() {
//     camera.aspect = window.innerWidth / window.innerHeight;
//     camera.updateProjectionMatrix();
//     renderer.setSize(window.innerWidth, window.innerHeight);
// }
// window.addEventListener('resize', handleWindowResize, false);

// const fontLoader = new TTFLoader();
// fontLoader.load("./Lacupra-Bubble.ttf", (res) => {
//     const font = new Font(res);
//     const props = {
//         font,
//         size: 1,
//         depth: .5,
//         curveSegments: 6,
//         bevelEnabled: true,
//         bevelThickness: 0.08,
//         bevelSize: 0.01,
//         bevelOffset: 0,
//         bevelSegments: 2,
//     };
//     const textGeo = new TextGeometry("Abby Reese", props);
//     textGeo.computeBoundingBox();
//     const centerOffset = -0.5 * (
//         textGeo.boundingBox.max.x = textGeo.boundingBox.min.x
//     );
//     const mat = new THREE.MeshStandardMaterial({ color: 0xff9900});
//     const textMesh = new THREE.Mesh(textGeo, mat);
//     // textMesh.postition.x = centerOffset;
//     scene.add(textMesh);
//     // console.log(res)

// });