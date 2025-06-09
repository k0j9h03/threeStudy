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
    const box1 = new THREE.Mesh(geometry, material);
    const box2 = box1.clone();
    const box3 = box2.clone();
    const group1 = new THREE.Group();
    const group2 = new THREE.Group();
    const group3 = new THREE.Group();

    group2.position.set(2,0,0);
    box2.scale.set(0.5,0.5,0.5);
    group3.position.set(1,0,0);
    box3.scale.set(0.2,0.2,0.2);

    group3.add(box3);
    group2.add(box2,group3);
    group1.add(box1,group2);

    scene.add(group1);


    // scene.add(mesh);

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


        group1.rotation.y += delta;
        group2.rotation.y += delta;
        group3.rotation.y += delta;



        // group3.rotation.y += delta;

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


    // console.log(mesh.position.length());
    // console.log(mesh.position.distanceTo( new THREE.Vector3(3,3,3)));
    // console.log(mesh.position.distanceTo(camera.position));
}
