import * as THREE from "./three.module.js";

export class Box {
    
    constructor(scene, x, y, z, r_) {
        this.pos = {x, y, z};
        this.r = r_;
        this.scene = scene;        
    }
    
    show() {
        const geometry = new THREE.BoxGeometry(this.r, this.r, this.r);
        const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
        const cube = new THREE.Mesh( geometry, material );
        
        const wireframe = new THREE.WireframeGeometry( geometry );
        
        const line = new THREE.LineSegments( wireframe );
        line.material.depthTest = false;
        line.material.opacity = 0.25;
        line.material.transparent = true;
        
        line.position.x = this.pos.x;
        line.position.y = this.pos.y;
        line.position.z = this.pos.z;
        
        this.scene.add(line);
    }
    
    generate() {
        let boxes = [];
        for(let x = -1;x < 2; x++) {
            for(let y = -1;y < 2; y++) {
                for(let z = -1;z < 2; z++) {
                    let newR = this.r / 3;
                    let box = new Box(this.scene, this.pos.x+x*newR, this.pos.y+y*newR, this.pos.z+z*newR, newR);
                    boxes.push(box);
                }
            }
        }
        return boxes;
    }
}