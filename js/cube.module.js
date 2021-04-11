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

class RotateCommand {
  constructor(cube, face, isClockWise) {
    this.cube = cube;
    this.face = face;
    this.isClockWise = isClockWise;
    this.anim = null;
  }

  animate() {
    if (this.anim == null) {
      var depth = this.cube.depth;
      this.tempArr = new Array(depth * depth);
      const tempGroup = new Group();
      this.cube.group.add(tempGroup);
      var d = depth - 1;
      for (var i = 0; i < depth; i++) {
        for (var j = 0; j < depth; j++) {
          tempGroup.add(this.cube.getCellAt(i, j, this.face));
          this.tempArr[ (i * depth) + j] = this.cube.getCellAt(d - j, i, this.face);
        }
      }
      const axisArr = ['y', 'y', 'x', 'x', 'z', 'z'];
      const rotArr =  [ -90, 90,  90, -90,  -90, 90];
      this.anim = new AnimatedRotation(tempGroup, axisArr[this.face], rotArr[this.face]);
    }
    var isDone = this.anim.animate();
    if( isDone ) {
      var depth = this.cube.depth;
      for (var i = 0; i < depth; i++) {
        for (var j = 0; j < depth; j++) {
          this.cube.setCellAt(i, j, this.face, this.tempArr[(i * depth) + j]);
        }
      }
    }
    return isDone;
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
        this.name = "" + (x+1) + "," + (y+1) + "," + (z+1);
        const planeSize = size * 0.95;
        const boxSize   = size * 0.995;

        const baseMaterial    = new MeshStandardMaterial( { color: 0x404040, flatShading: true } );
        const redMaterial     = new MeshStandardMaterial( { color: 0xff0000, flatShading: true } );
        const greenMaterial   = new MeshStandardMaterial( { color: 0x00ff00, flatShading: true } );
        const blueMaterial    = new MeshStandardMaterial( { color: 0x0000ff, flatShading: true } );
        const orangeMaterial  = new MeshStandardMaterial( { color: 0xff8000, flatShading: true } );
        const whiteMaterial   = new MeshStandardMaterial( { color: 0xffffff, flatShading: true } );
        const yellowMaterial  = new MeshStandardMaterial( { color: 0xffff00, flatShading: true } );
        const average = 1;
        var variablePlaneSize1 = planeSize * (average + ((1-average) * Math.random()));
        var variablePlaneSize2 = planeSize * (average + ((1-average) * Math.random()));
        var geometry = new PlaneGeometry( variablePlaneSize1, variablePlaneSize2, 1, 1);

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
      return "Name(" + this.name + ") P("+(Math.floor(this.position.x / this.size)+1)+","+
                                          (Math.floor(this.position.y / this.size)+1)+","+
                                          (Math.floor(this.position.z / this.size)+1)+")";
//             " Rx("+ang(this.rotation.x)+") Ry("+ang(this.rotation.y)+") Rz("+ang(this.rotation.z)+")";
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

  IJFtoXYZ(i,j,face) {
    var d = this.depth - 1;
    switch(face) {
      case 0: // TOP
        return [i, 2, d - j];
      case 1: // BOTTOM
        return [i, 0, j];
      case 2: // LEFT
        return [0, j, i];
      case 3: // RIGHT
        return [2, j, d - i];
      case 4: // FRONT
        return [i, j, 2];
      case 5: // BACK
        return [d - i, j, 0];
    }
  }

  getCellAt(i, j, f) {
    var xyz = this.IJFtoXYZ(i, j, f);
    console.log("getCellAt(" + i + "," + j + "," + f + ")=" + xyz);
    return this.data[xyz[0]][xyz[1]][xyz[2]];
  }

  setCellAt(i, j, f, obj) {
    var xyz = this.IJFtoXYZ(i, j, f);
    console.log("setCellAt(" + i + "," + j + "," + f + ")=" + xyz);
    this.data[xyz[0]][xyz[1]][xyz[2]] = obj;
  }

  rotate(face, isClockWise) {
    this.animationSteps.push(new RotateCommand(this, face, isClockWise));
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
