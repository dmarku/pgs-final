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
cam.setTarget(new Vector3(0, 2, 0));
cam.attachControl(canvas, true);

const particles = new GPUParticleSystem("snow_v1", { capacity: 1000 }, scene);
particles.particleTexture = new Texture("/snowflake.png", scene);
particles.blendMode = GPUParticleSystem.BLENDMODE_ADD;

// place a 20x20 units emitter plane parallel to the ground at a height of
// 10 units
particles.emitter = Vector3.Up().scaleInPlace(10);
particles.minEmitBox = new Vector3(-10, 0, -10);
particles.maxEmitBox = new Vector3(10, 0, 10);

// emit particles straight down, leave no place for random direction
particles.direction1 = Vector3.Down();
particles.direction2 = Vector3.Down();

// scaling: minSize/maxSize is for equal variance in both directions
// (min|max)Scale(X|Y) is for individual variation in both directions
//particles.minSize = 0.1;
//particles.maxSize = 0.3;
particles.minScaleX = 0.15;
particles.maxScaleX = 0.25;
particles.minScaleY = 0.15;
particles.maxScaleY = 0.25;

particles.minEmitPower = 1;
particles.maxEmitPower = 3;

// lifetime is in seconds
particles.maxLifeTime = 6;
particles.minLifeTime = 6;

particles.start();
engine.runRenderLoop(() => scene.render());
