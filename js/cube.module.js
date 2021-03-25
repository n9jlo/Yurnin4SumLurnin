import {
    BoxGeometry,
    Group,
    Mesh,
    MeshStandardMaterial,
    PlaneGeometry
} from './three.module.js';

class Animatable {
    constructor(obj, func, steps=100) {
        this.steps = steps;
        this.obj = obj;
        this.stepCount = 0;
        this.func = func;
    }

    animate() {
        this.func(this.obj, this.stepCount / this.steps);
        this.stepCount += 1;
        return (this.steps == this.stepCount);
    }
}

export class Cube {
  constructor(depth=3) {
    this.depth = depth;
    this.group = null;
    this.animationSteps = [];
  }

  getMesh() {
    if( this.group == null ) {
        const baseMaterial    = new MeshStandardMaterial( { color: 0x202020, flatShading: true } );
        const redMaterial     = new MeshStandardMaterial( { color: 0xff0000, flatShading: true } );
        const greenMaterial   = new MeshStandardMaterial( { color: 0x00ff00, flatShading: true } );
        const blueMaterial    = new MeshStandardMaterial( { color: 0x0000ff, flatShading: true } );
        const orangeMaterial  = new MeshStandardMaterial( { color: 0xff8000, flatShading: true } );
        const whiteMaterial   = new MeshStandardMaterial( { color: 0xffffff, flatShading: true } );
        const yellowMaterial  = new MeshStandardMaterial( { color: 0xffff00, flatShading: true } );
        const geometry = new PlaneGeometry( 9.5, 9.5, 1, 1);

        const cube = new Group();

        const boxMesh = new Mesh( new BoxGeometry(9.95,9.95,9.95), baseMaterial);
        cube.add(boxMesh);

        const topMesh = new Mesh( geometry, whiteMaterial);
        topMesh.position.y = 5;
        topMesh.rotation.x = -Math.PI/2;
        cube.add( topMesh );

        const bottomMesh = new Mesh( geometry, yellowMaterial);
        bottomMesh.position.y = -5;
        bottomMesh.rotation.x = Math.PI/2;
        cube.add( bottomMesh );

        const frontMesh = new Mesh( geometry, greenMaterial);
        frontMesh.position.z = 5;
        cube.add( frontMesh );

        const backMesh = new Mesh( geometry, blueMaterial);
        backMesh.position.z = -5;
        backMesh.rotation.x = Math.PI;
        cube.add( backMesh );

        const leftMesh = new Mesh( geometry, orangeMaterial);
        leftMesh.position.x = -5;
        leftMesh.rotation.y = -Math.PI / 2;
        cube.add( leftMesh );

        const rightMesh = new Mesh( geometry, redMaterial);
        rightMesh.position.x = 5;
        rightMesh.rotation.y = Math.PI / 2;
        cube.add( rightMesh );

        const col = new Group();
        col.add( cube );

        const cube2 = cube.clone(true);
        cube2.position.z = 10.1;
        col.add( cube2 );

        const cube3 = cube.clone(true);
        cube3.position.z = -10.1;
        col.add( cube3 );

        const slice = new Group();
        slice.add( col );

        const col2 = col.clone(true);
        col2.position.y = 10.1;
        slice.add( col2 );

        const col3 = col.clone(true);
        col3.position.y = -10.1;
        slice.add( col3 );

        this.group = new Group();
        this.group.add( slice );

        const slice2 = slice.clone(true);
        slice2.position.x = 10.1;
        this.group.add( slice2 );

        const slice3 = slice.clone(true);
        slice3.position.x = -10.1;
        this.group.add( slice3 );
        this.state = 0;
        this.step = 0;
    }
    return this.group;
  }

  animate() {
    if (this.animationSteps.length > 0) {
        var isDone = this.animationSteps[0].animate();
        if (isDone) {
            this.animationSteps.shift();
        }
    }
  }

  fullPresent() {
    this.animationSteps.push(new Animatable(this, function(o, p) {o.group.rotation.x = p * Math.PI * 2}, 360));
    this.animationSteps.push(new Animatable(this, function(o, p) {o.group.rotation.y = p * Math.PI * 2}, 360));
    this.animationSteps.push(new Animatable(this, function(o, p) {o.group.rotation.z = p * Math.PI * 2}, 360));
  }

  rotate(face, isClockWise) {
      // face should be 
  }
}
