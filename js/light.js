import * as THREE from "three";
import { OBJLoader } from "three/addons/loaders/OBJLoader.js";


class Light {
  constructor(scene, renderer) {
    this.scene = scene
    this.renderer = renderer
    this.CollectedCoins = 0
     this.ObjLoader = new OBJLoader();
  }

  SetupLights() {
    this.createLights()
    this.model();
  }

  createLights() {
    const dirlight = new THREE.DirectionalLight("blue", 1)
    dirlight.position.set(20, 10, 20)
    this.scene.add(dirlight)

    const dirlightt = new THREE.PointLight(0xff0000, 30)
    dirlightt.position.set(10, 5, 10)
    this.scene.add(dirlightt)

    const spotlight = new THREE.SpotLight(0xff0000, 30)
    spotlight.position.set(0, 3, 47)
    this.scene.add(spotlight)

    const dirlightt2 = new THREE.PointLight(0xff0000, 30)
    dirlightt2.position.set(10, 5, 30)
    this.scene.add(dirlightt2)

    const dirlightt3 = new THREE.PointLight(0xff0000, 30)
    dirlightt3.position.set(34, 5, 30)
    this.scene.add(dirlightt3)

    const dirlightt4 = new THREE.PointLight(0xff0000, 20)
    dirlightt4.position.set(30, 5, 7)
    this.scene.add(dirlightt4)

    const dirlightt5 = new THREE.PointLight(0xff0000, 30)
    dirlightt5.position.set(20, 5, 20)
    this.scene.add(dirlightt5)

    var RandomGeometry = new THREE.IcosahedronGeometry(0.3)
    var RandomGeoMaterial = new THREE.MeshLambertMaterial({ color: 0xffea00 })
    var mesh1 = new THREE.InstancedMesh(RandomGeometry, RandomGeoMaterial, 300)
    this.scene.add(mesh1)

    const dummy = new THREE.Object3D()
    for (let i = 0; i <= 300; i++) {
      dummy.position.x = Math.random() * 44
      dummy.position.y = Math.random() * 2
      dummy.position.z = Math.random() * 44

      dummy.updateMatrix()
      mesh1.setMatrixAt(i, dummy.matrix)
      mesh1.setColorAt(i, new THREE.Color(Math.random() * 0xffffff))
    }
    
  }
  model() {
       this.ObjLoader.load("../imges/rv_lamp_post_4.obj",(object) => {
           let endObject = object;
           endObject.position.set(40, 0, 0);
           endObject.rotation.y = 3
           endObject.scale.set(0.6, 0.5, 0.6);
           this.scene.add(endObject);
         });
  }
 
}

export { Light }
