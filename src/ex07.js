import * as THREE from 'three';
import dat from 'dat.gui';

// ----- 주제: 

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
	camera.position.y = 1.5;
	camera.position.z = 4;
	scene.add(camera);

	// Light
	const ambientLight = new THREE.AmbientLight('white', 0.5);
	scene.add(ambientLight);

	const directionalLight = new THREE.DirectionalLight('white', 1);
	directionalLight.position.x = 1;
	directionalLight.position.z = 2;
	scene.add(directionalLight);

	// Mesh
	const geometry = new THREE.BoxGeometry(1, 1, 1);
	const material = new THREE.MeshStandardMaterial({
		color: 'seagreen'
	});
	const mesh = new THREE.Mesh(geometry, material);
    // mesh.position.y = 2;
    mesh.position.set(0,1,0); // 위치
    // mesh.scale.x = 10;
    // mesh.scale.set(2,2,2);
    mesh.rotation.reorder('YXZ');
    mesh.rotation.y = THREE.MathUtils.degToRad(45);
    mesh.rotation.x = THREE.MathUtils.degToRad(20);

	scene.add(mesh);

	// AxesHelper
	const axesHelper = new THREE.AxesHelper(3);
	scene.add(axesHelper);

	// Dat GUI
	const gui = new dat.GUI();
	gui.add(camera.position, 'x', -5, 5, 0.1).name('카메라 X');
	gui.add(camera.position, 'y', -5, 5, 0.1).name('카메라 Y');
	gui.add(camera.position, 'z', 2, 10, 0.1).name('카메라 Z');

	// 그리기
	const clock = new THREE.Clock();

	function draw() {
		const delta = clock.getDelta();

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


    console.log(mesh.position.length());
    console.log(mesh.position.distanceTo( new THREE.Vector3(3,3,3)));
    console.log(mesh.position.distanceTo(camera.position));
}
