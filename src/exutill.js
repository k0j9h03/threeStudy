import * as THREE from 'three';
import Stats from 'stats.js'; // 라이브러리 불러오기
// import Dat from 'dat.gui';
import * as dat from 'dat.gui';

// ----- 주제: AxesHelper, GridHelper

export default function example() {
	// Renderer
	const canvas = document.querySelector('#three-canvas');
	const renderer = new THREE.WebGLRenderer({
		canvas,
		antialias: true
	});
	renderer.setSize(window.innerWidth, window.innerHeight);
	renderer.setPixelRatio(window.devicePixelRatio > 1 ? 2 : 1);

	// Scene
	const scene = new THREE.Scene();

	// Camera
	const camera = new THREE.PerspectiveCamera(
		75,
		window.innerWidth / window.innerHeight,
		0.1,
		1000
	);
	camera.position.z = 5;
    camera.position.y = 1;
	scene.add(camera);



    //light

    const ambientLight = new THREE.AmbientLight(0xfffff,0.5);
	const light = new THREE.DirectionalLight(0xffffff, 2);
	light.position.x = 1;
	light.position.z = 2;
    scene.add(ambientLight);
	scene.add(light);



    //AxesHelper

    const axesHelper = new THREE.AxesHelper(10); //인자는 사이즈 크기
    scene.add(axesHelper);


    //GridHelper

    const gridHelper = new THREE.GridHelper(5); // 인자는 사이즈 크기
    scene.add(gridHelper);

	// Mesh
	const geometry = new THREE.BoxGeometry(1, 1, 1);
	const material = new THREE.MeshStandardMaterial({
		color: 'seagreen'
	});
	const mesh = new THREE.Mesh(geometry, material);
	scene.add(mesh);


    /** 유틸 성능 체크 */

    //FPS
    const stats = new Stats();
    document.body.append(stats.domElement); // 돔 엘리먼트에 넣기


    //DAT
     const gui = new dat.GUI();
            gui.add(mesh.position, 'y', -5, 5, 0.01).name('큐브 Y 위치'); // 한글 이름 추가
            // dat.GUI는 자동으로 DOM에 추가되므로, 다음 라인은 필요하지 않습니다.
            // document.body.appendChild(gui.domElement);
            document.querySelector('.dg.ac').style.display = 'block';
            document.querySelector('.dg.ac').style.zIndex = 9999;

	// 그리기
	const clock = new THREE.Clock();

	function draw() {
		const time = clock.getElapsedTime();

		mesh.rotation.y = time;
        stats.update(); //이게 업데이트 하는 메소드

		renderer.render(scene, camera);
		renderer.setAnimationLoop(draw); 
	}

	function setSize() {
		camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();
		renderer.setSize(window.innerWidth, window.innerHeight);
		renderer.render(scene, camera);
	}

	// 이벤트
	window.addEventListener('resize', setSize);

	draw();
}