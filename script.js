import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.118/build/three.module.js';

import {OrbitControls} from 'https://cdn.jsdelivr.net/npm/three@0.118/examples/jsm/controls/OrbitControls.js';

///// audio setup //////
let analyser;
let dataArray;
const audioElement = document.getElementById('audio1');
const audioCtx = new AudioContext();
analyser = audioCtx.createAnalyser();
const source = audioCtx.createMediaElementSource(audioElement);
source.connect(analyser);
analyser.connect(audioCtx.destination);
let bufferLength = analyser.frequencyBinCount;
dataArray = new Uint8Array(bufferLength);




///// create scene /////
let boxes = [];
const scene = new THREE.Scene();
scene.background = new THREE.TextureLoader().load('../solarSystem3D/images/space4.png');
scene.rotateX(0.5);
scene.rotateY(0.5);
//console.log(scene);

const camera = new THREE.PerspectiveCamera(
     70,
     window.innerWidth / window.innerHeight,
     0.1, 
     1000
)
camera.position.z = 30;
camera.position.y = 0;

const container= document.querySelector('.container');
const renderer = new THREE.WebGLRenderer({
     antialias: true,
     canvas: document.getElementById('canvas1')   
})
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
//renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.body.appendChild(renderer.domElement);

const orbitControls = new OrbitControls(camera, renderer.domElement);
orbitControls.enablePan = true;
orbitControls.enableDamping = true;
orbitControls.dampingFactor = 0.05;

const directionalLight = new THREE.DirectionalLight(0xffffff);
directionalLight.castShadow = true;
directionalLight.position.set(0, 1000, 0);
//scene.add(directionalLight);

const ambientLight = new THREE.AmbientLight(0x555555);
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0xffffff, 1);
pointLight.position.set(0, 15, 0);
scene.add(pointLight);

const spotLight = new THREE.SpotLight(0xffffff, 2);
spotLight.position.set(0, 100, 0);
spotLight.castShadow = true;
spotLight.angle = 0.3;
spotLight.shadow.mapSize.width = 512;
spotLight.shadow.mapSize.height = 512;
spotLight.shadow.camera.near = 0.5; // default
spotLight.shadow.camera.far = 200; // default
spotLight.shadow.focus = 0.1; // default
scene.add(spotLight);

/* const helper = new THREE.CameraHelper( spotLight.shadow.camera );
scene.add( helper ); */

const gridHelper = new THREE.GridHelper(60, 30);
gridHelper.position.set(0, 0, 0);
gridHelper.material.opacity = 0.6;
gridHelper.material.transparent = true;
scene.add(gridHelper);

const sphereGeometry = new THREE.SphereGeometry(3, 30, 30);
const sphereMaterial = new THREE.MeshPhongMaterial({
     //color: 0x0000ff,
     map: new THREE.TextureLoader().load('../solarSystem3D/images/2k_sun.jpg')

})
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
sphere.position.set(0, 15, 0);
sphere.castShadow = true;
scene.add(sphere);

///// create box /////
let count = 24;
const boxGroup = new THREE.Object3D();
const boxGeometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
/* const boxMaterial = new THREE.MeshPhongMaterial({
     color: 0xff0000,
     specular: 0x2d0bf0,
      shininess: 50,
      emissive: 0x0,
      side: THREE.DoubleSide
}) */
const boxMaterials = [
  new THREE.MeshPhongMaterial({map: new THREE.TextureLoader().load('../solarSystem3D/images/2k_earth_daymap.jpg')}),
  new THREE.MeshPhongMaterial({map: new THREE.TextureLoader().load('../solarSystem3D/images/2k_jupiter.jpg')}),
  new THREE.MeshPhongMaterial({map: new THREE.TextureLoader().load('../solarSystem3D/images/2k_mars.jpg')}),
  new THREE.MeshPhongMaterial({map: new THREE.TextureLoader().load('../solarSystem3D/images/2k_saturn.jpg')}),
  new THREE.MeshPhongMaterial({map: new THREE.TextureLoader().load('../solarSystem3D/images/2k_sun.jpg')}),
  new THREE.MeshPhongMaterial({map: new THREE.TextureLoader().load('../solarSystem3D/images/2k_venus_surface.jpg')}),
];
for(let i = 0; i < count; i++){
     for(let j = 0; j < count; j++){
          let box = new THREE.Mesh(boxGeometry, boxMaterials);
          
          box.position.x = i;
          box.position.z = j;
          //box.castShadow = true;
          box.receiveShadow = true;
          //boxGroup.castShadow = true;
          boxes.push(box);
          boxGroup.add(box);
     }
}
boxGroup.position.set(-12, 0, -12);
scene.add(boxGroup);

///// create ring ///////////
let ringSpheres = [];
const ringOne = new THREE.Object3D();
const ringTwo = new THREE.Object3D();
const ringThree = new THREE.Object3D();
const ringFour = new THREE.Object3D();

function createRingSpheres(count, radius, color, group){
     const size = 0.5;
     const geometry = new THREE.SphereGeometry(size, 30, 30);
     const material = new THREE.MeshPhongMaterial({
          color
     })
     for(let i = 0; i < count; i++){
          const angle = Math.PI * 2 / count * i;
          const ringSphere = new THREE.Mesh(geometry, material);
          const ringSphereX = Math.sin(angle) * 2 * radius;
          const ringSphereZ = Math.cos(angle) * 2 * radius;
          ringSphere.position.set(ringSphereX, 1, ringSphereZ);
          ringSphere.rotateY(angle);
          ringSpheres.push(ringSphere);
          group.add(ringSphere);
     }
     scene.add(group);
}

createRingSpheres(48, 9, 0xf2560f, ringOne);
createRingSpheres(64, 10, 0x2f60f4, ringTwo);
createRingSpheres(80, 11, 0x7121fa, ringThree);
createRingSpheres(96, 12, 0x28f082, ringFour);
/////////////////////////////////////

const planeGeometry = new THREE.PlaneGeometry(50, 50, 10, 10);
const planeMaterial = new THREE.MeshLambertMaterial({    color: 0xffffff,
      shininess: 100,
      flatShading: true,
      side: THREE.DoubleSide
     })
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.position.set(0, 0, 0);
plane.rotation.x = -Math.PI / 2;
plane.receiveShadow = true;
//scene.add(plane);
    


function animate(){
     sphere.rotation.y += 0.01;
     analyser.getByteFrequencyData(dataArray);
     for(let i = 0; i < 576; i++){
          const p = dataArray[i];
          const s = boxes[i];
          const z = s.position;
          TweenMax.to(z, 0.2, {
               y: p/24, ease: Power2.easeOut
          })
     }

     for(let j = 0; j < 288; j++){
          const p = dataArray[j];
          const s = ringSpheres[j];
          const z = s.position;
          TweenMax.to(z, 0.2, {
               y: p/12, ease: Power2.easeOut
          })
     }
     boxes.forEach(box => {
          box.rotation.x += 0.005;
          box.rotation.y += 0.008; 
     })
          //boxGroup.rotation.x += 0.001;
          //boxGroup.rotation.y += 0.003;
          //boxGroup.rotation.z += 0.005;
     ringOne.rotation.y += 0.004;
     ringTwo.rotation.y += -0.006;
     ringThree.rotation.y += 0.008;
     ringFour.rotation.y += -0.01;
     renderer.render(scene, camera);
     requestAnimationFrame(animate);
}
animate();

const file = document.getElementById('fileupload');

file.addEventListener('change', function(){ 
   const files = this.files;
   audio1.src = URL.createObjectURL(files[0]);
   audio1.load();
})

window.addEventListener('resize', function(){
     camera.aspect = window.innerWidth / this.window.innerHeight;
     camera.updateProjectionMatrix();
     camera.setSize(window.innerWidth, window.innerHeight);
});