import * as THREE from 'three';


export default function example(){

 
    const canvas = document.querySelector('#three-canvas');
    const renderer = new THREE.WebGLRenderer({
      canvas : canvas, // 기본
      antialias : true, // 안티알리어스
      // alpha : true  // 투명도
    });


    renderer.setSize(window.innerWidth,window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio > 1.1 ? 2 : 1); // 삼항연산자사용, 화질 개선하는 방법

    /**씬 설정 */
    const scene = new THREE.Scene();

    /** 원근카메라 */
    const camera = new THREE.PerspectiveCamera(75,window.innerWidth/window.innerHeight,0.1,1000)
    camera.position.y = 1;
    camera.position.z = 5;
    scene.add(camera);

    /** 빛 */
    const light = new THREE.DirectionalLight(0xffffff,5); // argument구성 확인해보기!
    light.position.z = 3;
    scene.add(light);
    

    /** 도형설정 */
    const box = new THREE.BoxGeometry(1,1,1);
    const material = new THREE.MeshStandardMaterial({
      color : 'red'
    })
    const mesh = new THREE.Mesh(box,material);
    scene.add(mesh);
    
    
    /** 최종실행 */
    
    renderer.render(scene, camera);

    const reSize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix(); // 카메라 투영에 관련된 값 변경시 무조건 업데이트 해주기
      renderer.setSize(window.innerWidth,window.innerHeight);
      renderer.render(scene, camera);
    }


    window.addEventListener('resize', reSize);

}