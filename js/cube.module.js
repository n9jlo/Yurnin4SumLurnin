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

class CubeCell extends Group {
    constructor(x=1, y=1, z=1, size=10) {
        super();
        this.size = size * 1.02;
        const planeSize = size * 0.95;
        const boxSize   = size * 0.995;

        const baseMaterial    = new MeshStandardMaterial( { color: 0x202020, flatShading: true } );
        const redMaterial     = new MeshStandardMaterial( { color: 0xff0000, flatShading: true } );
        const greenMaterial   = new MeshStandardMaterial( { color: 0x00ff00, flatShading: true } );
        const blueMaterial    = new MeshStandardMaterial( { color: 0x0000ff, flatShading: true } );
        const orangeMaterial  = new MeshStandardMaterial( { color: 0xff8000, flatShading: true } );
        const whiteMaterial   = new MeshStandardMaterial( { color: 0xffffff, flatShading: true } );
        const yellowMaterial  = new MeshStandardMaterial( { color: 0xffff00, flatShading: true } );
        const geometry = new PlaneGeometry( planeSize, planeSize, 1, 1);

        const boxMesh = new Mesh( new BoxGeometry(boxSize, boxSize, boxSize), baseMaterial);
        this.add(boxMesh);

        const topMesh = new Mesh( geometry, whiteMaterial);
        topMesh.position.y = size / 2;
        topMesh.rotation.x = -Math.PI / 2;
        this.add( topMesh );

        const bottomMesh = new Mesh( geometry, yellowMaterial);
        bottomMesh.position.y = size / -2;
        bottomMesh.rotation.x = Math.PI / 2;
        this.add( bottomMesh );

        const frontMesh = new Mesh( geometry, greenMaterial);
        frontMesh.position.z = size / 2;
        this.add( frontMesh );

        const backMesh = new Mesh( geometry, blueMaterial);
        backMesh.position.z = size / -2;
        backMesh.rotation.x = Math.PI;
        this.add( backMesh );

        const leftMesh = new Mesh( geometry, orangeMaterial);
        leftMesh.position.x = size / -2;
        leftMesh.rotation.y = -Math.PI / 2;
        this.add( leftMesh );

        const rightMesh = new Mesh( geometry, redMaterial);
        rightMesh.position.x = size / 2;
        rightMesh.rotation.y = Math.PI / 2;
        this.add( rightMesh );
        this.position.x = x * this.size;
        this.position.y = y * this.size;
        this.position.z = z * this.size;

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
      this.group = new Group();
      this.state = 0;
      this.step = 0;
      this.data = [];
      const mp = ((this.depth - 1) / 2);
      for (var x = 0; x < this.depth; x++) {
        if (typeof this.data[x] === 'undefined') {
          this.data[x] = []
        }
        for (var y = 0; y < this.depth; y++) {
          if (typeof this.data[x][y] === 'undefined') {
            this.data[x][y] = []
          }
          for (var z = 0; z < this.depth; z++) {
            const cell = new CubeCell(x - mp, y - mp, z - mp);
            this.data[x][y][z] = cell;
            this.group.add(cell);
          }
        }
      }
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
