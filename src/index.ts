import { ArcRotateCamera } from "@babylonjs/core/Cameras/arcRotateCamera";
import { Engine } from "@babylonjs/core/Engines/engine";
import { SceneLoader } from "@babylonjs/core/Loading/sceneLoader";
import { Texture } from "@babylonjs/core/Materials/Textures/texture";
import { Color4, Vector3 } from "@babylonjs/core/Maths/math";
import { ParticleSystem } from "@babylonjs/core/Particles/particleSystem";
import { Scene } from "@babylonjs/core/scene";
import "@babylonjs/loaders/glTF";
import { NoiseProceduralTexture } from "@babylonjs/core/Materials/Textures/Procedurals/noiseProceduralTexture";

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

const particles = new ParticleSystem("snow_v1", 1000, scene);
particles.particleTexture = new Texture("/snowflake.png", scene);
particles.blendMode = ParticleSystem.BLENDMODE_ADD;

const areaHeight = 12;
const areaSize = 18;

// place a 20x20 units emitter plane parallel to the ground at a height of
// 10 units
particles.emitter = Vector3.Up().scaleInPlace(areaHeight);
particles.minEmitBox = new Vector3(-0.5 * areaSize, 0, -0.5 * areaSize);
particles.maxEmitBox = new Vector3(0.5 * areaSize, 0, 0.5 * areaSize);

// emit particles straight down, leave no place for random direction
particles.direction1 = Vector3.Down();
particles.direction2 = Vector3.Down();

particles.minAngularSpeed = -Math.PI;
particles.maxAngularSpeed = Math.PI;

// scaling: minSize/maxSize is for equal variance in both directions
// (min|max)Scale(X|Y) is for individual variation in both directions

const averageSize = 0.2;
const sizeVariance = 0.05;

const minSize = averageSize - sizeVariance;
const maxSize = averageSize - sizeVariance;

// slightly vary size around the 0.2 mark
// values are scaling factors relative to the original texture size?
//particles.minSize = 0.1;
//particles.maxSize = 0.3;
particles.minScaleX = minSize;
particles.maxScaleX = maxSize;
particles.minScaleY = minSize;
particles.maxScaleY = maxSize;

// slowly fade in from the top
particles.addColorGradient(0, new Color4(1, 1, 1, 0));
particles.addColorGradient(0.3, new Color4(1, 1, 1, 1));
particles.addColorGradient(0.95, new Color4(1, 1, 1, 1));
particles.addColorGradient(0.95, new Color4(1, 1, 1, 0));

particles.minEmitPower = 1;
particles.maxEmitPower = 3;

// lifetime is in seconds
particles.maxLifeTime = 6;
particles.minLifeTime = 6;

let windVelocity = Vector3.Right().scaleInPlace(0.3);

const noiseTexture = new NoiseProceduralTexture("perlin", 256, scene);
noiseTexture.animationSpeedFactor = 5;
noiseTexture.persistence = 2;
noiseTexture.brightness = 0.5;
noiseTexture.octaves = 2;

particles.noiseTexture = noiseTexture;
particles.noiseStrength = new Vector3(0.5, 0, 0.5);

// store and call default update function from customized update
const update = particles.updateFunction;

particles.updateFunction = function(ps) {
  const windDisplacement = windVelocity.scale(this._scaledUpdateSpeed);
  update(ps);
  for (const particle of ps) {
    particle.direction.addInPlace(windDisplacement);
  }
};

window.addEventListener("resize", () => engine.resize());

particles.start();
engine.runRenderLoop(() => scene.render());
