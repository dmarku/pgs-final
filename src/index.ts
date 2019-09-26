import { GPUParticleSystem, Texture } from "@babylonjs/core";
import { ArcRotateCamera } from "@babylonjs/core/Cameras/arcRotateCamera";
import { Engine } from "@babylonjs/core/Engines/engine";
import { SceneLoader } from "@babylonjs/core/Loading/sceneLoader";
import { Vector3 } from "@babylonjs/core/Maths/math";
import { Scene } from "@babylonjs/core/scene";
import "@babylonjs/loaders/glTF";

const canvas = document.getElementById("renderCanvas") as HTMLCanvasElement;

const engine = new Engine(canvas);

const scene = new Scene(engine);

SceneLoader.LoadAssetContainer("/", "test-scene.glb", scene, assets => {
  assets.addAllToScene();
});

// for some reason, the exported scene from Blender doesn't contain any cameras.
// Explicitly set one up until the export is fixed (or not).
//const cam = new FreeCamera("test cam", new Vector3(20, 20, 14), scene);
const cam = new ArcRotateCamera("name", 2, 0.7, 30, Vector3.Zero(), scene);
cam.setTarget(Vector3.Zero());
cam.attachControl(canvas, true);

const particles = new GPUParticleSystem("snow_v1", { capacity: 1000 }, scene);

// place a 20x20 units emitter plane parallel to the ground at a height of
// 10 units
particles.emitter = Vector3.Up().scaleInPlace(10);

particles.particleTexture = new Texture("/snowflake.png", scene);

particles.minEmitPower = 1;
particles.maxEmitPower = 3;
particles.updateSpeed = 0.005;

particles.start();
engine.runRenderLoop(() => scene.render());
