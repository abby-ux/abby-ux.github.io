import './style.css';

import * as THREE from 'three';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';

document.addEventListener('DOMContentLoaded', () => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    
    const canvas = document.querySelector('#about-bg');
    const renderer = new THREE.WebGLRenderer({ canvas });
    
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.position.set(0, 0, 1);

    renderer.render(scene, camera);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(0, 5, 5);
scene.add(ambientLight, directionalLight);


const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();



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
        },
        (xhr) => {
            // Loading progress
            console.log((xhr.loaded / xhr.total * 100) + '% loaded');
        },
        (error) => {
            // Error occurred
            console.error('An error happened:', error);
        }
    );
}

// Array(60).fill().forEach(addArrow);



const video = document.createElement('video');
video.src = './background-vid.mp4';
video.addEventListener('loadeddata', () => {
    console.log('Video loaded successfully');
});
video.addEventListener('error', (e) => {
    console.error('Video loading error:', e);
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

const p1Texture = new THREE.TextureLoader().load('./p1.png');
const p2Texture = new THREE.TextureLoader().load('./p2.png');
const p3Texture = new THREE.TextureLoader().load('./p3.png');
const pic1 = new THREE.TextureLoader().load('./abby1.jpg');
const pic2 = new THREE.TextureLoader().load('scenic.jpg');
const pic3 = new THREE.TextureLoader().load('stonehedge.jpg');
const pic4 = new THREE.TextureLoader().load('./bookstore.jpg')


const abby = new THREE.Mesh(
    new THREE.BoxGeometry(3,3,3),
    new THREE.MeshBasicMaterial({ 
      map: pic1,
    //   transparent: true,
      opacity: 0,
      side: THREE.DoubleSide
    })
  );
  abby.name = 'abby1';
  
  const abby2 = new THREE.Mesh(
    new THREE.BoxGeometry(3,3,3),
    new THREE.MeshBasicMaterial({ 
      map: pic2,
      transparent: true,
      opacity: 0,
      side: THREE.DoubleSide
    })
  );
  abby2.name = 'abby2';
  
  const abby3 = new THREE.Mesh(
    new THREE.BoxGeometry(3,3,3),
    new THREE.MeshBasicMaterial({ 
      map: pic3,
      transparent: true,
      opacity: 0,
      side: THREE.DoubleSide
    })
  );
  abby3.name = 'abby3';

  const abby4 = new THREE.Mesh(
    new THREE.BoxGeometry(3,3,3),
    new THREE.MeshBasicMaterial({ 
      map: pic4,
      transparent: true,
      opacity: 0,
      side: THREE.DoubleSide
    })
  );
  abby4.name = 'abby4';

  abby.position.z = 0;  // Closer than 45
abby.position.y = 1;   // Start at same height as other objects
abby.position.x = 2;

abby2.position.z = 3;  // Closer than 45
abby2.position.y = 0;   // Start at same height as other objects
abby2.position.x = 2; 

abby3.position.z = 5;  // Closer than 45
abby3.position.y = 1;   // Start at same height as other objects
abby3.position.x = 0;

abby4.position.z = 9;  // Closer than 45
abby4.position.y = 0;   // Start at same height as other objects
abby4.position.x = 2;

const photos = [abby, abby2, abby3, abby4];
photos.forEach((p) => {
    p.rotationSpeed = 0.005;
    // p.scale.set(.7,.7,.7,.7);
})

scene.add(abby, abby2, abby3, abby4);


// Add mousemove event listener
window.addEventListener('mousemove', (event) => {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  });

  camera.position.set(0, 0, 0);

  function moveCamera() {
    const t = document.body.getBoundingClientRect().top;
    
    // Smoother camera movement
    camera.position.z = 5 + (t * -0.005);
    camera.position.x = t * -0.0001;
    camera.position.y = t * -0.0001;
    
    // Adjusted scroll triggers and fade-in distances
    const fadeDistance = 150;
    
    if (t < -300) {
      abby.material.opacity = Math.min(1, (-t - 300) / fadeDistance);
    } else {
      abby.material.opacity = 0;
    }
    
    if (t < -800) {
      abby2.material.opacity = Math.min(1, (-t - 700) / fadeDistance);
    } else {
      abby2.material.opacity = 0;
    }
    
    if (t < -1300) {
      abby3.material.opacity = Math.min(1, (-t - 900) / fadeDistance);
    } else {
      abby3.material.opacity = 0;
    }
    
    if (t < -1800) {
      abby4.material.opacity = Math.min(1, (-t - 1200) / fadeDistance);
    } else {
      abby4.material.opacity = 0;
    }
  }
  moveCamera();
document.body.onscroll = moveCamera

// set up recursice function (endless) that automatically rerenders
function animate() {
  requestAnimationFrame(animate);


  // Update the picking ray with the camera and mouse position
  raycaster.setFromCamera(mouse, camera);
  // Move lights in a circular pattern
  const time = Date.now() * 0.001; // Convert to seconds

  const intersects = raycaster.intersectObjects([abby, abby2, abby3, abby4]);

  // Rotate all arrows
  arrows.forEach(arrow => {
    arrow.rotation.x += arrow.rotationSpeed.x;
    arrow.rotation.y += arrow.rotationSpeed.y;
    arrow.rotation.z += arrow.rotationSpeed.z;
});

    
    
    photos.forEach((p) => {
        
        p.rotation.x += p.rotationSpeed;
    })

  renderer.render(scene, camera);
}

animate();


function handleWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}
window.addEventListener('resize', handleWindowResize, false);

  
    
  });


