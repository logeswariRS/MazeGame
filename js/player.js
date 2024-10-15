import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { Enemies } from "./enemies.js";


  
export class Player {
  constructor(scene, renderer, coin, datas, camera) {
    this.scene = scene;
    this.renderer = renderer;
    this.datas = datas;
    this.camera = camera;
    this.coin = coin;
    this.gltf_loader = new GLTFLoader();
    this.CurrentColmnOfModel;
    this.CurrentRowOfModel;
    this.Model;
    this.CollectedCoins = 0;
    this.CellSize = 4;
    this.spheres = [];
    this.step = 0;

    this.onDocumentKeyDown = this.onDocumentKeyDown.bind(this);
  }

  createFunction() {
    this.createPlayer();
    this.AddCoin();
    this.animate();

    window.addEventListener("keydown", this.onDocumentKeyDown);
  }

  createPlayer() {
    this.gltf_loader.load("../imges/vivkanaut/scene.gltf", (gltf) => {
      this.Model = gltf.scene;
      this.Model.position.set(2, 0, 2);
      this.Model.rotation.y += 1.5;
      this.Model.scale.set(4, 4, 4);
      this.Model.castShadow = true;
      this.scene.add(this.Model);
      this.enemies = new Enemies(this.scene,this.renderer,this.datas,this.Model,this.camera);
      this.enemies.createEnemies();
    });

  }
  AddCoin() {
    for (let i = 0; i < 10; i++) {
      const geometry11 = new THREE.SphereGeometry(1, 2, 1);
      const material11 = new THREE.MeshBasicMaterial({ color: 0xffff00 });
      const sphere1 = new THREE.Mesh(geometry11, material11);
      sphere1.position.set(
        Math.floor(Math.random() * 10) * this.CellSize + 2,
        1,
        Math.floor(Math.random() * 10) * this.CellSize + 2
      );
      this.scene.add(sphere1);
      this.spheres.push(sphere1);
    }
  }
  removeObject() {
    if (this.CurrentRowOfModel == 0 && this.CurrentColmnOfModel == 8) {
      this.audioForWin();
    }
    if (this.CurrentRowOfModel == 5 && this.CurrentColmnOfModel == 4) {
      this.audioForHalfWin();
    }

    let CurrentRowOfModell = Math.floor(this.Model.position.x / this.CellSize);
    let CurrentColmnOfModell = Math.floor(
      this.Model.position.z / this.CellSize
    );
    for (let i = 0; i < this.spheres.length; i++) {
      let CurrentRowOfCoin = Math.floor(this.spheres[i].position.x / this.CellSize );
      let CurrentColumnOfCoin = Math.floor(this.spheres[i].position.z / this.CellSize);
      if (this.spheres[i] instanceof THREE.Mesh) {
        if ( CurrentColumnOfCoin == CurrentColmnOfModell && CurrentRowOfCoin == CurrentRowOfModell ) {
          this.audioForCoin();
          this.scene.remove(this.spheres[i]);
          this.spheres[i].geometry.dispose();
          this.spheres[i].material.dispose();
          this.CollectedCoins = this.CollectedCoins + 4;

          this.coin.value = this.CollectedCoins;
          let score = (document.getElementById("score").value = this.CollectedCoins);
        }
      }
    }
  }
  audioForCoin() {
    var listener = new THREE.AudioListener();
    this.camera.add(listener);

    var sound = new THREE.Audio(listener);

    var audioLoader = new THREE.AudioLoader();

    audioLoader.load("../audio/coin-recieved-230517.mp3", function (buffer) {
      sound.setBuffer(buffer);
      sound.setLoop(false);
      sound.setVolume(5);
      sound.play();
      console.log(sound);
    });
  }
  audioForWin() {
    var listener = new THREE.AudioListener();
    this.camera.add(listener);

    var sound = new THREE.Audio(listener);

    var audioLoader = new THREE.AudioLoader();

    audioLoader.load(
      "../audio/congratulations-deep-voice-172193.mp3",
      function (buffer) {
        sound.setBuffer(buffer);
        sound.setLoop(false);
        sound.setVolume(5);
        sound.play();
        console.log(sound);
      }
    );
  }
  audioForHalfWin() {
        var listener = new THREE.AudioListener();
        this.camera.add(listener);

        var sound = new THREE.Audio(listener);

        var audioLoader = new THREE.AudioLoader();

        audioLoader.load("../audio/sweet-game-over-sound-effect-230470.mp3",
          function (buffer) {
            sound.setBuffer(buffer);
            sound.setLoop(false);
            sound.setVolume(5);
            sound.play();
            console.log(sound);
          }
        );
  }

  onDocumentKeyDown(event) {
    var keyCode = event.which;

    this.CurrentRowOfModel = Math.floor(this.Model.position.x / this.CellSize);
    this.CurrentColmnOfModel = Math.floor(this.Model.position.z / this.CellSize);
    this.removeObject();
    for (let j of this.datas.data) {
      if ( j.row == this.CurrentRowOfModel && j.col == this.CurrentColmnOfModel) {
        if (keyCode == 87 && j.walls[0] == 0) {
          this.Model.position.x -= this.CellSize;
        } else if (keyCode == 83 && j.walls[2] == 0) {
          this.Model.position.x += this.CellSize;
        } else if (keyCode == 65 && j.walls[1] == 0) {
          this.Model.position.z += this.CellSize;
        } else if (keyCode == 68 && j.walls[3] == 0) {
          this.Model.position.z -= this.CellSize;
        }
      }
    }
  }
  animate() {
    requestAnimationFrame(this.animate.bind(this));

    this.step += 0.02;
    for (let sphere of this.spheres) {
      sphere.rotation.y = 3 * Math.abs(Math.sin(this.step));
    }
  }
}