import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// ----- 주제: 

export default function example() {

let scene = new THREE.Scene(); // 3D 장면(Scene) 생성

let aspect = window.innerWidth / window.innerHeight;
let camera_distance = 10; 

const camera = new THREE.OrthographicCamera(
  -camera_distance * aspect, // 왼쪽 절편
  camera_distance * aspect,  // 오른쪽 절편
  camera_distance,            // 위쪽 절편
  -camera_distance,           // 아래쪽 절편
  0.1,                        // near plane
  100                         // far plane
);

camera.position.set(0, 0, 20); // 카메라 위치 설정
camera.lookAt(0, 0, 0);         // 카메라가 (0,0,0)을 바라보게 설정




const canvas = document.querySelector('#three-canvas');
const renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: true
    });
// WebGL 렌더러 생성
renderer.setSize(window.innerWidth, window.innerHeight); 
scene.background = new THREE.Color(0xffffff); 


    const controls = new OrbitControls(camera, renderer.domElement); // 2. 객체 생성
    controls.update();


// ---------------- 경로 설정 ----------------
let texturePath = "./image11.png";    // 메인 이미지 경로
let shadowTexturePath = "./image11.png"; // 그림자 이미지 경로

// ---------------- sphere (마우스 위치 표시용) ----------------
let geometry_sphere = new THREE.SphereGeometry(0.25, 32, 16); // 구 생성
let material_sphere = new THREE.MeshBasicMaterial({
  color: 0xff0000,  // 빨간색
  transparent: true, // 투명 지원
  opacity: 0,        // 완전 투명 (표시는 안 함)
  depthWrite: false  // 깊이 버퍼 기록 안 함
});
let sphere = new THREE.Mesh(geometry_sphere, material_sphere);
scene.add(sphere);

// ---------------- hit plane (마우스 Raycaster 충돌 감지용) ----------------
let geometry_hit = new THREE.PlaneGeometry(500, 500, 10, 10); // 매우 큰 평면
let material_hit = new THREE.MeshBasicMaterial({
  color: 0xffffff,
  transparent: true,
  opacity: 1,        // 보이지 않게
  depthWrite: false
});
let hit = new THREE.Mesh(geometry_hit, material_hit);
hit.name = "hit"; // 객체 이름 지정
scene.add(hit);

// ---------------- main plane (버텍스 셰이더 변형) ----------------
let geometry = new THREE.PlaneGeometry(15, 15, 100, 100); // 메인 평면 메시
let shader_material = new THREE.ShaderMaterial({
  uniforms: {
    uTexture: { type: "t", value: new THREE.TextureLoader().load(texturePath) }, // 메인 텍스처 로드
    uDisplacement: { value: new THREE.Vector3(0, 0, 0) } // 변형 중심 위치
  },
  vertexShader: `
    varying vec2 vUv; // 프래그먼트 셰이더로 전달할 UV 좌표
    uniform vec3 uDisplacement; // 마우스 위치로부터 변형 중심 좌표

    // easeInOutCubic: 0~1 값에 대해 부드러운 가속/감속 곡선 반환
    float easeInOutCubic(float x) {
      return x < 0.5 ? 4. * x * x * x : 1. - pow(-2. * x + 2., 3.) / 2.;
    }

    // map: 한 범위의 값을 다른 범위로 변환
    float map(float value, float min1, float max1, float min2, float max2) {
      return min2 + (value - min1) * (max2 - min2) / (max1 - min1);
    }  

    void main() {
      vUv = uv; // 현재 버텍스의 UV 좌표 저장
      vec3 new_position = position; // 버텍스 위치 복사

      vec4 localPosition = vec4(position, 1.); // 로컬 좌표
      vec4 worldPosition = modelMatrix * localPosition; // 월드 좌표로 변환

      float dist = length(uDisplacement - worldPosition.rgb); // 변형 중심까지 거리 계산
      float min_distance = 3.; // 변형이 적용되는 최대 거리

      // 거리 범위 내라면 Z축 변형 적용
      if (dist < min_distance){
        float distance_mapped = map(dist, 0., min_distance, 1., 0.); // 거리값 0~1 매핑
        float val = easeInOutCubic(distance_mapped) * 1.; // 부드러운 곡선 적용
        new_position.z += val; // Z축 방향으로 올리기
      }
      
      // 변형된 좌표로 최종 화면 위치 계산
      gl_Position = projectionMatrix * modelViewMatrix * vec4(new_position, 1.0);
    }
  `,
  fragmentShader: ` 
    varying vec2 vUv; // 버텍스 셰이더에서 전달받은 UV
    uniform sampler2D uTexture; // 메인 텍스처 샘플러

    void main() {
       vec4 color = texture2D(uTexture, vUv); // UV 좌표에 해당하는 텍스처 색상
       gl_FragColor = vec4(color); // 픽셀 색상 출력
    }
  `,
  transparent: true,
  depthWrite: false,
  side: THREE.DoubleSide
});
let plane = new THREE.Mesh(geometry, shader_material);
plane.rotation.z = Math.PI / 4; // 45도 회전
scene.add(plane);

// ---------------- shadow plane (그림자 표현) ----------------
let shader_material_shadow = new THREE.ShaderMaterial({
  uniforms: {
    uTexture: { type: "t", value: new THREE.TextureLoader().load(shadowTexturePath) }, // 그림자 텍스처
    uDisplacement: { value: new THREE.Vector3(0, 0, 0) }
  },
  vertexShader: `
    varying vec2 vUv; // UV 좌표 전달
    varying float dist; // 변형 중심까지 거리 전달
    uniform vec3 uDisplacement; // 변형 중심 좌표

    void main() {
      vUv = uv; // UV 좌표 저장
      vec4 localPosition = vec4(position, 1.); // 로컬 좌표
      vec4 worldPosition = modelMatrix * localPosition; // 월드 좌표로 변환
      dist = length(uDisplacement - worldPosition.rgb); // 중심까지 거리 계산
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); // 변형 없이 출력
    }
  `,
  fragmentShader: ` 
    varying vec2 vUv; // UV 좌표
    varying float dist; // 변형 중심까지 거리
    uniform sampler2D uTexture; // 그림자 텍스처

    // 범위 매핑 함수
    float map(float value, float min1, float max1, float min2, float max2) {
      return min2 + (value - min1) * (max2 - min2) / (max1 - min1);
    }  

    void main() {
      vec4 color = texture2D(uTexture, vUv); // 그림자 텍스처 색상
      float min_distance = 10.; // 그림자 최대 범위

      // 거리 범위 안에서는 알파값 조정
      if (dist < min_distance){
        float alpha = map(dist, min_distance, 0., color.a, 0.); // 중심 가까울수록 투명도 낮춤
        color.a  = alpha; // 알파 적용
      }
       
      gl_FragColor = vec4(color); // 픽셀 색상 출력
    }
  `,
  transparent: true,
  depthWrite: false,
  side: THREE.DoubleSide
});
let plane_shadow = new THREE.Mesh(geometry, shader_material_shadow);
plane_shadow.rotation.z = Math.PI / 4; // 45도 회전
scene.add(plane_shadow);

// ---------------- 이벤트 ----------------
window.addEventListener("resize", onWindowResize); // 화면 크기 변경 이벤트

const raycaster = new THREE.Raycaster(); // 마우스-오브젝트 충돌 감지기
const pointer = new THREE.Vector2();     // 마우스 위치 (NDC 좌표)
window.addEventListener("pointermove", onPointerMove); // 마우스 이동 이벤트

function onPointerMove(event) {
  pointer.x = (event.clientX / window.innerWidth) * 2 - 1; // NDC 변환 X
  pointer.y = -(event.clientY / window.innerHeight) * 2 + 1; // NDC 변환 Y

  raycaster.setFromCamera(pointer, camera); // 레이캐스터에 마우스 좌표 적용
  const intersects = raycaster.intersectObject(hit); // hit 평면과 충돌 감지

  if (intersects.length > 0) {
    // 구를 마우스 위치로 이동
    sphere.position.set(
      intersects[0].point.x,
      intersects[0].point.y,
      intersects[0].point.z
    );

    // 셰이더의 변형 중심 좌표 업데이트
    shader_material.uniforms.uDisplacement.value = sphere.position;
    shader_material_shadow.uniforms.uDisplacement.value = sphere.position;
  }
}

// ---------------- 렌더링 ----------------
function render() {
  requestAnimationFrame(render); // 매 프레임 반복
  renderer.render(scene, camera); // 장면 렌더링
}
render();

function onWindowResize() {
  aspect = window.innerWidth / window.innerHeight; // 화면 비율 재계산

  // 카메라 절편 업데이트
  camera.left = -camera_distance * aspect;
  camera.right = camera_distance * aspect;
  camera.top = camera_distance;
  camera.bottom = -camera_distance;

  camera.updateProjectionMatrix(); // 변경된 카메라 행렬 적용
  renderer.setSize(window.innerWidth, window.innerHeight); // 렌더러 크기 변경
}



}



