import * as THREE from "three";
import { OBJLoader } from "three/addons/loaders/OBJLoader.js";


export class Enemies {
  constructor(scene, renderer, datas, model, camera) {
    this.scene = scene;
    this.renderer = renderer;
    this.data = datas;
    this.enemies = [];
    this.CellSize = 4;
    this.t = 0;
    this.dt = 0.02;
    this.ObjLoader = new OBJLoader();
    this.model = model;
    this.camera = camera;
  }

  enemyFunction() {
    let enemyGeometry = new THREE.IcosahedronGeometry(2);
    let enemyGeoMaterial = new THREE.MeshLambertMaterial({ color: 0x0000ff });
    let enemyy = new THREE.Mesh(enemyGeometry, enemyGeoMaterial);

    const row = Math.floor(Math.random() * 10) * this.CellSize + 2;
    const col = Math.floor(Math.random() * 10) * this.CellSize + 2;
    enemyy.position.set(row, 0, col);

    enemyy.userData.startPosition = enemyy.position.clone();
    enemyy.userData.endPosition = enemyy.position.clone();
    enemyy.userData.t = 0;

    enemyy.userData.moving = false;

    this.scene.add(enemyy);
    return enemyy;
  }

  createEnemies() {
    this.enemies.push(
      this.enemyFunction(),
      this.enemyFunction(),
      this.enemyFunction()
    );
    this.animate();
  }

  lerp(a, b, t) {
    return a + (b - a) * t;
  }

  updateEnemyPosition(enemy) {
    if (!enemy.userData.moving) {
      const direction = this.getRandomDirection(enemy);
      if (direction) {
        enemy.userData.endPosition.copy(direction.endPosition);
        enemy.userData.moving = true;
        enemy.userData.startPosition.copy(enemy.position);
        enemy.userData.t = 0;
      }
    } else {
      enemy.position.x = this.lerp(
        enemy.userData.startPosition.x,
        enemy.userData.endPosition.x,
        enemy.userData.t
      );
      enemy.position.z = this.lerp(
        enemy.userData.startPosition.z,
        enemy.userData.endPosition.z,
        enemy.userData.t
      );
      enemy.userData.t += this.dt;

      if (enemy.userData.t >= 1) {
        enemy.userData.moving = false;
        enemy.userData.t = 0;
      }
    }
  }

  getRandomDirection(enemy) {
    const row = Math.floor(enemy.position.x / this.CellSize);
    const col = Math.floor(enemy.position.z / this.CellSize);

    const wallsList = [];
    for (const j of this.data.data) {
      if (j.row === row && j.col === col) {
        for (let i = 0; i < 4; i++) {
          if (j.walls[i] === 0) {
            wallsList.push(i);
          }
        }
      }
    }

    const wall = wallsList[Math.floor(Math.random() * wallsList.length)];
    let endPosition = enemy.position.clone();

    if (wall == 0) {
      endPosition.x -= this.CellSize;
    }
    if (wall == 1) {
      endPosition.z += this.CellSize;
    }
    if (wall == 2) {
      endPosition.x += this.CellSize;
    }
    if (wall == 3) {
      endPosition.z -= this.CellSize;
    }

    return { endPosition };
  }
  checkCollision(enemy) {
    let CurrentRowOfEnemy = Math.floor(enemy.position.x / this.CellSize);
    let CurrentColmnOfEnemy = Math.floor(enemy.position.z / this.CellSize);
    let CurrentRowOfModel = Math.floor(this.model.position.x / this.CellSize);
    let CurrentColmnOfModel = Math.floor(this.model.position.z / this.CellSize);

    if (
      CurrentRowOfEnemy == CurrentRowOfModel &&
      CurrentColmnOfEnemy == CurrentColmnOfModel
    ) {
      this.audio();
      for (var i = this.scene.children.length - 1; i >= 0; i--) {
        let obj = this.scene.children[i];
        this.scene.remove(obj);

        let game = document.getElementById("gaemOver");
        game.style.color = "red";
        game.style.display = "block";
      }
    }
  }
  audio() {
    var listener = new THREE.AudioListener();
    this.camera.add(listener);

    var sound = new THREE.Audio(listener);

    var audioLoader = new THREE.AudioLoader();

    audioLoader.load("../audio/open-new-level-143027.mp3", function (buffer) {
      sound.setBuffer(buffer);
      sound.setLoop(false);
      sound.setVolume(5);
      sound.play();
    });
  }

  animate() {
    requestAnimationFrame(this.animate.bind(this));
    this.enemies.forEach((enemy) => {
      this.updateEnemyPosition(enemy);
      this.checkCollision(enemy);
    });
  }
}

