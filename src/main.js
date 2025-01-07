import './style.css';

import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { Raycaster } from 'three';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
import { TTFLoader } from 'three/examples/jsm/loaders/TTFLoader';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry';
import { Font } from 'three/examples/jsm/loaders/FontLoader';
import { LineMaterial } from 'three/examples/jsm/lines/LineMaterial';
import { Line2 } from 'three/examples/jsm/lines/Line2';
import { LineGeometry } from 'three/examples/jsm/lines/LineGeometry';

// for tracking when everything is loaded
let totalAssets = 0;
let loadedAssets = 0;   

const p1text = `
<div>
    <h3>React, Node.js, Express, Postgresql</h3>
    <p><strong>Problem:</strong> My mom bought the 'Couch Guestbook' which is a fun guest log, but no one ever takes the time to fill it out.</p>
    <p><strong>Solution:</strong> Convert the guestbook into a digital logging system, where users can scan a QR code to fill out the guestbook log on their phone.</p>
    <p></p>
    <ul>
      <li>
        
        I created a full-stack web application that streamlines the guestbook experience through QR codes, solving the
challenge of gathering guest logs on paper. I did this by developing a React frontend with Firebase authentication and
implementing a Node.js/Express backend with PostgreSQL. The project resulted as a scalable system that enables families,
friends, and businesses to generate, manage, and analyze guest reviews through easily deployable QR codes. I am planning on deploying this website
once I can polish the styling, but I have personally used this for guestbook logs.
            
      <li>
        I designed an intuitive user interface for creating, sorting, and managing QR code-based logs, addressing
user friction by implementing dynamic form customization, mobile-responsive layouts using Tailwind CSS, and
streamlined navigation flows. Users have a seamless experience that allows users to generate QR codes, customize
guestbook form fields, and view submitted forms in an organized dashboard.

      
    </ul>
    <p><strong>Project Takeaways:</strong>
    This was my first time learning about and using indexes. This was also the first robust CRUD application I created, which taught me a lot about RESTful APIs. Lastly, I learned about rate limiting by checking a users IP addresses.
    </p>
    <a href="https://github.com/abby-ux/LogQR" class="project-link">GitHub</a>
</div>
                  `;


const p2text = `
<div>
    <h3>React, Node.js, Express, MongoDB, Socket.io</h3>
    <p><strong>Problem:</strong>I love doing karaoke with my friends, but it gets difficult to keep the sessions interesting or structured in large groups sometimes.</p>
    <p><strong>Solution:</strong>Create a website that lets users host gamified karaoke session for their friends to join! Use YouTube to pull karaoke playlists and songs.</p>
    <p></p>
    <ul>
      <li>
        This project is not finished yet, but so far I have implement a waiting room where the host and users are able to see players that 
        join in real time, using Socket.io. I used MongoDB and mongoose to track user and game creations, and I used RESTful apis to manage creating and accessing game and player information.
             
    </ul>
    <p><strong>Project Takeaways:</strong>
    This project taught me how important design planning was. I did not factor real time functionality into my first iteration and had a lot of trouble integrating Socket.io at first. After I took a step back, I realized my mistake with Socket.io and learned a lot about 
    the importance of planning ahead of time. Although I did not end up choosing Spotify to get playlists, I did test it out and learned 
    some valuable things about using Spotify APIs through this.
    </p>
    <a href="https://github.com/abby-ux/karaoke-jam" class="project-link">GitHub</a>
</div>
                  `;
          
                  
const p3text = `
<div>
    <h3>React, Node.js, Express, SQLite3</h3>
    <p><strong>Problem:</strong>Come up with an interesting project (that doesn't envolve writing as essay) for my Tech & Human values
    final class project.</p>
    <p><strong>Solution:</strong>Create a chatbot that discusses ethical dilemmas from various philisophical perspectives using rule 
    based JSON responses.</p>
    <p></p>
    <ul>
      <li>
      I implemented a full-stack web app that first has a user fill out a form on various opinions, then chat with a chatbot, and fill out another form after the conversation. The goal of this project was to measure humans fascination with technology, and how it can be dangerous at times.
      <li>
      I created my backend with Express and SQLite to save form responses and chat conversations that I later analyzed.
     
    </ul>
    <p><strong>Project Takeaways:</strong>
    Although this started at a project for a philiosophy class I had a great time making it. Using JSON responses was very simple, and it opened my eyes to how easily humans will assume any type of technology is intelligent. This was my first time using SQLite and it was a great experience.
    </p>
    <a href="https://github.com/abby-ux/philisophical-dilemmas-chatbot" class="project-link">GitHub</a>
</div>
                  `;

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

// ADD AUDIO ???
const listener = new THREE.AudioListener();
camera.add(listener);
// create a global audio source
const sound = new THREE.Audio( listener );

// load a sound and set it as the Audio object's buffer
const audioLoader = new THREE.AudioLoader();
//______________________________________________________________________ -- add audio
// audioLoader.load( 'sounds/ambient.ogg', function( buffer ) {
// 	sound.setBuffer( buffer );
// 	sound.setLoop( true );
// 	sound.setVolume( 0.5 );
// 	sound.play();
// });

// render graphics in scene
// use canvas as dom element to render from
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#moon-bg'),
});

renderer.setPixelRatio( window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
// move position farther from middle fo scene
camera.position.set(0, 0, 1);
// camera.position.setZ(30);
// const initialScrollTop = document.body.getBoundingClientRect().top;
// camera.position.z = initialScrollTop * -0.01;
// camera.position.x = initialScrollTop * -0.0002;
// camera.position.y = initialScrollTop * -0.0002;

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

const spotLight = new THREE.PointLight(0xffffff, 700); 
spotLight.position.set(0, 10, 10); // Position above and in front of the text
spotLight.angle = Math.PI / 4; // 45-degree angle
spotLight.penumbra = 0.1; // Soft edge of the spotlight
spotLight.decay = 2; // Physical light decay
spotLight.distance = 200; // Maximum distance of light
spotLight.position.set(0, 0, -10); // Point at the text position
const ambientLight = new THREE.AmbientLight(0xffffff, 4); // Lower intensity for ambient to maintain contrast
const movingLight1 = new THREE.PointLight(0xffffff, 100); 
const movingLight2 = new THREE.PointLight(0xffffff, 100); // White light
const movingLight3 = new THREE.PointLight(0xffffff, 100);

// spotLight.position.set(4,4,4);

// add the object (light) to the scene
scene.add(spotLight);
// scene.add(spotLight.target);
scene.add(movingLight1, movingLight2);

const lightHelper = new THREE.PointLightHelper(spotLight);
// const gridHelper = new THREE.GridHelper(200, 50);
// scene.add(lightHelper, gridHelper);
scene.add(lightHelper);

// listen to dom events from mouse, update camera setting accordingly
const controls = new OrbitControls(camera, renderer.domElement);

const loader = new FBXLoader();


const arrows = [];
function addArrow() {
    loader.load(
        './16.fbx',   
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
                    child.renderOrder = -1;
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
video.src = './background-vid.mp4';
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
const p1Texture = new THREE.TextureLoader().load('./p1.png', updateLoadingProgress);
const p2Texture = new THREE.TextureLoader().load('./p2.png', updateLoadingProgress);
const p3Texture = new THREE.TextureLoader().load('./p3.png', updateLoadingProgress);


const abby = new THREE.Mesh(
    new THREE.BoxGeometry(3,3,3),
    new THREE.MeshBasicMaterial({ 
      map: p1Texture,
      transparent: true,
      opacity: 0,
      side: THREE.DoubleSide
    })
  );
  abby.name = 'abby1';
  
  const abby2 = new THREE.Mesh(
    new THREE.BoxGeometry(3,3,3),
    new THREE.MeshBasicMaterial({ 
      map: p2Texture,
      transparent: true,
      opacity: 0,
      side: THREE.DoubleSide
    })
  );
  abby2.name = 'abby2';
  
  const abby3 = new THREE.Mesh(
    new THREE.BoxGeometry(3,3,3),
    new THREE.MeshBasicMaterial({ 
      map: p3Texture,
      transparent: true,
      opacity: 0,
      side: THREE.DoubleSide
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

// scene.add(moon);

// = vs set does same thing
moon.position.z = 30;
moon.position.setX(-10);

window.addEventListener('click', (event) => {
  // First check if we clicked a close button
  if (event.target.classList.contains('exit-btn')) {
    // Stop event from propagating to prevent raycaster handling
    event.stopPropagation();
    const popup = event.target.closest('.popup');
    if (popup) {
      popup.classList.add('hidden');
    }
    return; 
  }

  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects([abby, abby2, abby3]);

  if (intersects.length > 0) {
      const clickedObject = intersects[0].object;
      
      // Only handle click if object is visible (opacity > 0)
      if (clickedObject.material.opacity > 0) {
          switch(clickedObject.name) {
              case 'abby1':
                  const popup1 = document.getElementById('popup1');
                  const popupContent1 = document.getElementById('popup-content1');
                  popupContent1.innerHTML = p1text;
                  popup1.classList.remove('hidden');
                  break;
              case 'abby2':
                  const popup2 = document.getElementById('popup2');
                  const popupContent2 = document.getElementById('popup-content2');
                  popupContent2.innerHTML = p2text;
                  popup2.classList.remove('hidden');
                  break;
              case 'abby3':
                  const popup3 = document.getElementById('popup3');
                  const popupContent3 = document.getElementById('popup-content3');
                  popupContent3.innerHTML = p3text;
                  popup3.classList.remove('hidden');
                  break;
          }
      }
  }
});

// Add event listeners for all close buttons
document.getElementById('exit-btn1').addEventListener('click', () => {
  document.getElementById('popup1').classList.add('hidden');
});

document.getElementById('exit-btn2').addEventListener('click', () => {
  document.getElementById('popup2').classList.add('hidden');
});

document.getElementById('exit-btn3').addEventListener('click', () => {
  document.getElementById('popup3').classList.add('hidden');
});

// Optional: Close popup when clicking outside
document.querySelectorAll('.popup').forEach(popup => {
  popup.addEventListener('click', (e) => {
      if (e.target === popup) {
          popup.classList.add('hidden');
      }
  });
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

    camera.position.z = 1 + (t * -0.01);  
    camera.position.x = t * -0.0002;
    camera.position.y = t * -0.0002;

    // moon.rotation.x += 0.05;
    // moon.rotation.y += 0.075;
    // moon.rotation.z += 0.05;
  
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
  
  }
  // moveCamera();
document.body.onscroll = moveCamera

let text;
let subtitle;
function initScene(res) {
  const font = new Font(res);
  text = createText({ font, message: "Abby Reese" });
  subtitle = createSubtitle({ font, message: `Computer Science\n @ Northeastern University`})
  scene.add(text, subtitle);
  animate();
}
function loadFont() {
  const loader = new TTFLoader();
  loader.load("./Lacupra-Bubble.ttf", (res) => {
    const font = new Font(res);
    text = createText({ font, message: "Abby Reese" });
    // subtitle = createSubtitle({ font, message: "Computer Science @ Northeastern University"})
    scene.add(text);
    animate();
  });
  loader.load("./HEXA.ttf", (res) => {
    const font = new Font(res);
  // text = createText({ font, message: "Abby Reese" });
  subtitle = createSubtitle({ font, message: `Computer Science\n @ Northeastern University`})
  scene.add(subtitle);
  animate();
  });
}

// set up recursice function (endless) that automatically rerenders
function animate(timeStep) {
  requestAnimationFrame(animate);

  // amount change per animation frame
  torus.rotation.x += 0.01;
  torus.rotation.y += 0.005;
  torus.rotation.z += 0.01;

  controls.update();

  // Update the picking ray with the camera and mouse position
  raycaster.setFromCamera(mouse, camera);
  // Move lights in a circular pattern
  const time = Date.now() * 0.001; // Convert to seconds
  movingLight1.position.x = Math.sin(time) * 5;
  movingLight1.position.z = Math.cos(time) * 5;
  movingLight1.position.y = Math.cos(time * 0.5) * 2;

  movingLight2.position.x = Math.sin(time * 0.5) * 10;
  movingLight2.position.z = Math.cos(time * 0.5) * 10;
  movingLight2.position.y = Math.sin(time) * 2;

  movingLight3.position.x = Math.sin(time) * 40;
  movingLight3.position.z = Math.cos(time) * 40;
  movingLight3.position.y = Math.cos(time * 0.5) * 10;

  const intersects = raycaster.intersectObjects([abby, abby2, abby3]);
  
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

  text.userData.update(timeStep);

  renderer.render(scene, camera);
}


function handleWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}
window.addEventListener('resize', handleWindowResize, false);

const cubeTextureLoader = new THREE.CubeTextureLoader();
const envMap = cubeTextureLoader.load([
    'px.jpg', 'nx.jpg',
    'py.jpg', 'ny.jpg',
    'pz.jpg', 'nz.jpg'
]);


function createOutlines({ font, message }) {
  const strokeGroup = new THREE.Group();

  let totalDist = 1.0;
  const lineMaterial = new LineMaterial({
    color: 0xff69b4,
    linewidth: 3,
    dashed: true,
    dashSize: totalDist * 2,
    gapSize: totalDist * 2,
    dashOffset: Math.random() * totalDist,
  });

  function getStrokeMesh({ shape, i = 0.0 }) {
    let points = shape.getPoints();
    let points3d = [];
    points.forEach((p) => {
      points3d.push(p.x, p.y, 0);
    });
    const lineGeo = new LineGeometry();
    lineGeo.setPositions(points3d);
  
    totalDist = shape.getLength();
    lineMaterial.dashSize = totalDist * 2;
    lineMaterial.gapSize = totalDist * 2;
    lineMaterial.dashOffset = Math.random() * totalDist;
    // lineMaterial.position.z = -1;
    
    const strokeMesh = new Line2(lineGeo, lineMaterial);
    strokeMesh.computeLineDistances();
    let offset = i * 0;
    strokeMesh.userData.update = (t) => {
      strokeMesh.material.dashOffset = t * (totalDist * 0.1) + offset;
    };
    strokeMesh.position.z = -4;
    return strokeMesh;
  }
  const shapes = font.generateShapes(message, 1);
  shapes.forEach((s, i) => {
    strokeGroup.add(getStrokeMesh({ shape: s, i }));

    if (s.holes?.length > 0) {
      s.holes.forEach((h) => {
        strokeGroup.add(getStrokeMesh({ shape: h, i }));
      });
    }
  });
  strokeGroup.update = (t, i) => {
    strokeGroup.children.forEach((c) => {
      c.userData.update?.(t);
    });
  };
  return strokeGroup;
}

function createSubtitle({ font, message }) {
  const textGroup = new THREE.Group();
  const props = {
    font,
    size: .5,
    depth: 0.1,
    curveSegments: 6,
    bevelEnabled: true,
    bevelThickness: 0.08,
    bevelSize: 0.01,
    bevelOffset: 0,
    bevelSegments: 2,
  };
  const textGeo = new TextGeometry(message, props);
  textGeo.computeBoundingBox();
  const centerOffset = -0.5 * (textGeo.boundingBox.max.x - textGeo.boundingBox.min.x);
  const glassMat = new THREE.MeshPhysicalMaterial({
    roughness: 0.5,
    transmission: 1.0,
    transparent: true,
    thickness: 1.0,
    color: 0xFF69B4
  });
  const textMesh = new THREE.Mesh(textGeo, glassMat);
  // const textMesh = new THREE.Mesh(textGeo);
  textMesh.position.x = centerOffset;
  textMesh.position.y = -2;
  textMesh.position.z = -10;
  textGroup.add(textMesh);

  // const outlineText = createOutlines({ font, message });
  // outlineText.position.set(centerOffset, 0, 0.2);
  // textGroup.add(outlineText);

  

  textGroup.userData.update = (t) => {
    let timeStep = t * 0.005;
    outlineText.update(timeStep);
  };
  return textGroup;
}

function createText({ font, message }) {
  const textGroup = new THREE.Group();
  const props = {
    font,
    size: 1,
    depth: 0.1,
    curveSegments: 6,
    bevelEnabled: true,
    bevelThickness: 0.08,
    bevelSize: 0.01,
    bevelOffset: 0,
    bevelSegments: 2,
  };
  const textGeo = new TextGeometry(message, props);
  textGeo.computeBoundingBox();
  const centerOffset = -0.5 * (textGeo.boundingBox.max.x - textGeo.boundingBox.min.x);
  // const glassMat = new THREE.MeshPhysicalMaterial({
  //   roughness: 0.5,
  //   transmission: 1.0,
  //   transparent: true,
  //   thickness: 1.0,
  // });
  const glassMat = new THREE.MeshPhysicalMaterial({
    envMap: envMap,
    envMapIntensity: 1.0,
    color: 0xffffff,      // Light pink
    metalness: 1.0,       // Maximum metalness
    roughness: 0.1,       // Very low roughness for maximum shininess
    clearcoat: 1.0,       // Add clearcoat for extra shine
    clearcoatRoughness: 0.1, // Make the clearcoat glossy
    reflectivity: 1.0,    // Maximum reflectivity
    transparent: true,
    // opacity: 0.7,         // Slightly more opaque
    transmission: 0.3     // Less transmission for more metallic look
});
  const textMesh = new THREE.Mesh(textGeo, glassMat);
  // const textMesh = new THREE.Mesh(textGeo);
  textMesh.position.x = centerOffset;
  textMesh.position.z = -4;
  textGroup.add(textMesh);

  const outlineText = createOutlines({ font, message });
  outlineText.position.set(centerOffset, 0, 0.2);
  textGroup.add(outlineText);

  

  textGroup.userData.update = (t) => {
    let timeStep = t * 0.005;
    outlineText.update(timeStep);
  };
  return textGroup;
}

loadFont();
// animate();


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
//         textGeo.boundingBox.max.x - textGeo.boundingBox.min.x
//     );
//     const mat = new THREE.MeshStandardMaterial({ color: 0xff9900, wireframe: true});
//     const textMesh = new THREE.Mesh(textGeo, mat);
//     // textMesh.postition.x = centerOffset;
//     scene.add(textMesh);

//     const strokeGroup = new THREE.Group();
//     const lineMaterial = new LineMaterial({
//         color:0xffffff,
//         linewidth:3
//     });
//     // console.log(res)
//     const shapes = font.generateShapes("Abby Reese", 1);
//     shapes.forEach((s) => {
//         let points = s.getPoints();
//         let points3d = [];
//         points.forEach((p) =>{ 
//         points3d.push(p.x, p.y, 0)
//         });
//         const lineGeo = new LineGeometry();
//         lineGeo.setPositions(points3d);
//         const strokeMesh = new Line2(lineGeo, lineMaterial);
//         strokeMesh.computeLineDistances();
//         strokeGroup.add(strokeMesh);
//     });
//     scene.add(strokeGroup);
    
// });