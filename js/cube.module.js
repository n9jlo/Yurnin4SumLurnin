import {
    BoxGeometry,
    Group,
    AxesHelper,
    Mesh,
    MeshStandardMaterial,
    PlaneGeometry
} from './three.module.js';


export class Cube {
  constructor(scene, depth=3) {
    this.scene = scene;
    this.depth = depth;

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

    // this.group.position.x = 15.2;
    // this.group.position.y = 15.2;
    // this.group.position.z = 15.2;

    scene.add( this.group );
    this.state = 0;
    this.step = 0;
  }

  animate() {
    if (this.state == 0) {
      this.group.rotation.x += Math.PI / 180;
    } else if (this.state == 1) {
      this.group.rotation.y += Math.PI / 180;
    } else if (this.state == 2) {
      this.group.rotation.z += Math.PI / 180;
    }
    this.step += 1;
    if (this.step == 360) {
      this.state = (this.state + 1) % 3;
      this.step = 0;
    }
  }
}
  