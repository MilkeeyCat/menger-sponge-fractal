import { Box } from "./box.js";
import * as THREE from "./three.module.js";
import { OrbitControls } from "./OrbitControls.js";

let scene = new THREE.Scene();
let camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

let renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );
var controls = new OrbitControls( camera, renderer.domElement );        
camera.position.z = 5;

let boxes = [];

const box = new Box(scene, 0, 0 ,0, 4); 

boxes.push(box);

window.addEventListener("contextmenu", function(e) {
    let boxesCount = boxes.length;
    for(let i = 0; i < boxesCount; i++) {
        let newBoxes = boxes[i].generate();
        boxes = boxes.concat(newBoxes);
    }
});

function animate() {
    requestAnimationFrame( animate );
    
    for(let box of boxes) {
        box.show();
    }
    renderer.render( scene, camera );
    
}

animate();