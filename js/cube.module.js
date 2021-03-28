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
        return (this.steps < this.stepCount);
    }
}

class AnimatedRotation extends Animatable {
  constructor(obj, axis, weight) {
    super(obj, null, 40);
    this.func = this.rotate;
    this.axis = axis;
    this.weight = weight * (Math.PI/180);
  }
  rotate(obj, count) {
    if(count == 0) {
      this.start = obj.rotation[this.axis];
    }
    obj.rotation[this.axis] = this.start + (count * this.weight);
    if (count == 1) {
      // Do the finish activity.  All this group's children are merged back to the parent, and this group is removed.
      const f = function(item, index) { obj.parent.attach(item) }
      obj.children.slice().forEach(f);
    }
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

    toString() {
      const RAD2DEG = (180 / Math.PI);
      const ang = function(val) {return Math.floor(val*RAD2DEG);};
      return " Px("+Math.floor(this.position.x)+") Py("+Math.floor(this.position.y)+") Pz("+Math.floor(this.position.z)+")" + 
             " Rx("+ang(this.rotation.x)+") Ry("+ang(this.rotation.y)+") Rz("+ang(this.rotation.z)+")";
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
    } else {
      return false;
    }
    return true;
  }

  _doAnim(f) {
    this.animationSteps.push(new Animatable(this, f, 90));
  }

  fullPresent() {
    this._doAnim(function(o, p) {
      o.group.rotation.y = Math.sin(p * Math.PI) * Math.PI;
    });
    this._doAnim(function(o, p) {
      o.group.rotation.z = Math.sin(p * Math.PI) * Math.PI/2;
    });
  }
  getCellAt(j, k, face) {
    switch(face) {
      case 0: // TOP
        return(this.data[j][2][k]);
      case 1: // BOTTOM
        return(this.data[j][0][k]);
      case 2: // LEFT
        return(this.data[0][j][k]);
      case 3: // RIGHT
        return(this.data[2][j][k]);
      case 4: // FRONT
        return(this.data[j][k][2]);
      case 5: // BACK
        return(this.data[j][k][0]);
    }
  }

  setCellAt(j, k, face, obj) {
    switch(face) {
      // Top    Center is {1, 2, 1}
      // Bottom Center is {1, 0, 1}
      // Left   Center is {0, 1, 1}
      // Right  Center is {2, 1, 1}
      // Front  Center is {1, 1, 0}
      // Back   Center is {1, 1, 2}
      case 0: // TOP
        this.data[j][2][k] = obj;
        break;
      case 1: // BOTTOM
        this.data[j][0][k] = obj;
        break;
      case 2: // LEFT
        this.data[0][j][k] = obj;
        break;
      case 3: // RIGHT
        this.data[2][j][k] = obj;
        break;
      case 4: // FRONT
        this.data[j][k][2] = obj;
        break;
      case 5: // BACK
        this.data[j][k][0] = obj;
        break;
    }
  }

  rotate(face, isClockWise) {
    const tempGroup = new Group();
    this.group.add(tempGroup);
    for (var i = 0; i < 9; i++) {
      var j = i % 3;
      var k = Math.floor(i/3);
      var cell = this.getCellAt(j, k, face);
      tempGroup.add(cell);
    }
    const axisArr = ['y', 'y', 'x', 'x', 'z', 'z'];
    const rotArr =  [ -90, 90,  90, -90,  -90, 90];
    this.animationSteps.push(new AnimatedRotation(tempGroup, axisArr[face], rotArr[face]));

    tempArr = new Array(this.depth * this.depth);
    for (var i = 0; i < this.depth; i++) {
      for (var j = 0; j < this.depth; j++) {
        tempArr[ (i * this.depth) + j] = this.getCellAt(j, this.depth - i);
      }
    }
    for (var i = 0; i < this.depth; i++) {
      for (var j = 0; j < this.depth; j++) {
        this.setCellAt(i, j, face, tempArr[(i * this.depth) + j]);
      }
    }
  }

  logCube() {
    for (var x = 0; x < this.depth; x++) {
      for (var y = 0; y < this.depth; y++) {
        for (var z = 0; z < this.depth; z++) {
          const cell = this.data[x][y][z];
          console.log("cell["+x+"]["+y+"]["+z+"]="+cell.toString())
        }
      }
    }
  }
}
