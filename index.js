import * as Cesium from "cesium";
import * as THREE from "three";
import glb from "./Ailis_to_Unity.glb";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

// Cesiumのビューアを初期化
const viewer = new Cesium.Viewer("cesiumContainer", {
  terrainProvider: Cesium.createWorldTerrain(),
});
Cesium.Ion.defaultAccessToken = "your_access_token";

// 明石市の位置
const akashiCityPosition = Cesium.Cartesian3.fromDegrees(
  134.9875,
  34.6453,
  100
);

// glTF形式のモデルを追加
console.log(glb);
// モデルを追加
var modelMatrix = Cesium.Transforms.eastNorthUpToFixedFrame(akashiCityPosition);

var model = Cesium.Model.fromGltf({
  url: glb,
  modelMatrix: modelMatrix,
  scale: 100,
  minimumPixelSize: 128,
  maximumScale: 20000,
});

// モデルが読み込まれた後にアニメーションをループさせる
model.readyPromise.then(function (model) {
  if (
    model.activeAnimations &&
    model.activeAnimations._animations &&
    model.activeAnimations._animations.length > 0
  ) {
    model.activeAnimations.addAll({
      loop: Cesium.ModelAnimationLoop.REPEAT.value,
    });
  }
});

viewer.scene.primitives.add(model);

// カメラの位置と向きを調整
viewer.camera.setView({
  destination: akashiCityPosition,
  orientation: {
    heading: Cesium.Math.toRadians(0),
    pitch: Cesium.Math.toRadians(-45),
    roll: 0,
  },
});

function getMaxVertexAttributes() {
  // WebGL コンテキストを取得
  var canvas = document.createElement("canvas");
  var gl =
    canvas.getContext("webgl") || canvas.getContext("experimental-webgl");

  // サポートされている頂点属性の最大数を取得
  var maxVertexAttribs = gl.getParameter(gl.MAX_VERTEX_ATTRIBS);

  return maxVertexAttribs;
}

console.log("Max vertex attributes:", getMaxVertexAttributes());

function countAttributesInGltf(url) {
  const loader = new GLTFLoader();

  loader.load(url, (gltf) => {
    let attributeCount = 0;

    gltf.scene.traverse((object) => {
      if (object.isMesh) {
        const geometry = object.geometry;
        for (const attribute in geometry.attributes) {
          attributeCount++;
        }
      }
    });

    console.log(`Total attributes in GLTF file: ${attributeCount}`);
  });
}

// GLTF/GLB ファイルの URL を指定して、属性数を調べる
countAttributesInGltf(glb);
