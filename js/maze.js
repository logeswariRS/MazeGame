import * as THREE from "three";
import { Player } from "./player.js";
import { Light } from "./light.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { OBJLoader } from "three/addons/loaders/OBJLoader.js";

var completeViewer = null;

function create() {
  completeViewer = new Viewer();
  createUI();
  completeViewer.createViewer();
  completeViewer.animate();
  completeViewer.onWindowResize();
}
function createUI() {
  let UiButton = document.getElementById("uiDiv");

  let startButton = document.createElement("button");
  startButton.innerHTML = "startGame";
  startButton.className = "uibuttons";
  startButton.onclick = () => {
    document.getElementById("uiDiv").style.display = "none";
    completeViewer.mazeGame();
  };

  let CanvasButton = document.getElementById("canvas");
  let coins = document.createElement("input");
  coins.type = "text";
  coins.className = "coinClass";
  coins.value = "0";
  coins.id = "coins";
 
  

  UiButton.appendChild(startButton);
  CanvasButton.appendChild(coins);

  document.body.appendChild(UiButton);
  document.body.appendChild(CanvasButton);
}

class Viewer {
  constructor() {
    this.model = null;
    this.camera = null;
    this.orthographicCamera = null;
    this.controls = null;
    this.container = null;
    this.scene = null;
    this.renderer = null;
    this.widthO = 1700;
    this.heightO = 780;
    this.datas = null;
    this.wall;
    this.CellSize;
    this.ObjLoader = new OBJLoader();
    this.particleSystem;
  }

  createViewer() {
    this.container = document.getElementById("canvas");
    document.body.appendChild(this.container);

    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(this.widthO, this.heightO);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.container.appendChild(this.renderer.domElement);

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color("lightblue");

    this.camera = new THREE.OrthographicCamera(-60, 50, 10, -50, 0.01, 1000);
    this.camera.position.set(51, 84, 41);
    this.camera.lookAt(this.scene.position);
    this.scene.add(this.camera);

    this.lights = new THREE.AmbientLight("black", 0.1);
    this.scene.add(this.lights);

    let tryAgain = document.getElementById("TryAgain");
    let gaemOver = document.getElementById("gaemOver");
    tryAgain.addEventListener("click", () => {
      window.location.reload();
      gaemOver.style.display = "None";
    });
    this.bubbles();
  }
  bubbles() {
    var RandomGeometry = new THREE.IcosahedronGeometry(0.11);
    var RandomGeoMaterial = new THREE.MeshLambertMaterial({ color: 0xffea00 });
    var mesh1 = new THREE.InstancedMesh(
      RandomGeometry,
      RandomGeoMaterial,
      1000
    );
    this.scene.add(mesh1);

    const dummy = new THREE.Object3D();
    for (let i = 0; i <= 1000; i++) {
      dummy.position.x = Math.random() * 100;
      dummy.position.y = Math.random() * 100;
      dummy.position.z = Math.random() * 100;

      dummy.updateMatrix();
      mesh1.setMatrixAt(i, dummy.matrix);
      mesh1.setColorAt(i, new THREE.Color(Math.random() * 0xffffff));
    }
  }
  

  async mazeGame() {
    try {
      const res = await fetch("./data.json", { method: "GET" });
      const data = await res.json();
      this.datas = data;
    } catch (error) {
      return;
    }

    let coin = document.getElementById("coins");

    this.player = new Player(this.scene,this.renderer,coin,this.datas,this.camera);
    this.light = new Light(this.scene, this.renderer);

    this.light.SetupLights();
    this.player.createFunction();

    this.ObjLoader.load(
      "../imges/uploads_files_4012489_Fairy+house+1.obj",
      (object) => {
        let endObject = object;
        endObject.position.set(0, 0, 40);
        endObject.scale.set(2, 3, 2);
        this.scene.add(endObject);
      }
    );

    const planegeo = new THREE.PlaneGeometry(45, 45);
    const planemat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      side: THREE.DoubleSide,
    });
    const plane = new THREE.Mesh(planegeo, planemat);
    plane.position.set(22, -1, 22);
    plane.receiveShadow = true;
    plane.rotation.x = -0.5 * Math.PI;
    this.scene.add(plane);

    const wallThickness = 1;
    this.CellSize = 4;

    for (const cell of this.datas.data) {
      this.walls = cell.walls;
      const row = cell.row;
      const col = cell.col;

      const cellX = row * this.CellSize;
      const cellZ = col * this.CellSize;

      if (this.walls[0] === 1) {
        const RandomGeometry = new THREE.BoxGeometry(
          wallThickness,
          4,
          this.CellSize
        );
        const RandomGeoMaterial = new THREE.MeshStandardMaterial({
          color: 0x57f53b,
        });
        this.wall = new THREE.Mesh(RandomGeometry, RandomGeoMaterial);
        this.wall.position.set(cellX - this.CellSize / 2 + 2, 1, cellZ + 2);
        this.scene.add(this.wall);
      }

      if (this.walls[1] === 1) {
        const RandomGeometry = new THREE.BoxGeometry(
          this.CellSize,
          4,
          wallThickness
        );
        const RandomGeoMaterial = new THREE.MeshStandardMaterial({
          color: 0x57f53b,
        });
        this.wall = new THREE.Mesh(RandomGeometry, RandomGeoMaterial);
        this.wall.position.set(cellX + 2, 1, cellZ + this.CellSize / 2 + 2);
        this.scene.add(this.wall);
      }
      if (this.walls[2] === 1) {
        const RandomGeometry = new THREE.BoxGeometry(
          wallThickness,
          4,
          this.CellSize
        );
        const RandomGeoMaterial = new THREE.MeshStandardMaterial({
          color: 0x57f53b,
        });
        this.wall = new THREE.Mesh(RandomGeometry, RandomGeoMaterial);
        this.wall.position.set(cellX + this.CellSize / 2 + 2, 1, cellZ + 2);
        this.scene.add(this.wall);
      }
      if (this.walls[3] === 1) {
        const RandomGeometry = new THREE.BoxGeometry(
          this.CellSize,
          4,
          wallThickness
        );
        const RandomGeoMaterial = new THREE.MeshStandardMaterial({
          color: 0x57f53b,
        });
        this.wall = new THREE.Mesh(RandomGeometry, RandomGeoMaterial);
        this.wall.position.set(cellX + 2, 1, cellZ - this.CellSize / 2 + 2);
        this.scene.add(this.wall);
      }
    }
  }

  onWindowResize() {
    window.addEventListener("resize", () => {
      this.widthO = window.innerWidth;
      this.heightO = window.innerHeight;

      this.camera.aspect = this.widthO / this.heightO;
      this.camera.updateProjectionMatrix();
    });
  }

  render() {
    this.renderer.render(this.scene, this.camera);
  }

  animate() {
    requestAnimationFrame(this.animate.bind(this));
   
    this.render();
  }
}

export { completeViewer, create, Viewer };
