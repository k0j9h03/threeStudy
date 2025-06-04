

import * as THREE from 'three';


export default function example(){

    // const renderer = new THREE.WebGLRenderer;
    // renderer.setSize(window.innerWidth,window.innerHeight);
    // document.body.appendChild(renderer.domElement);
    
    
    const canvas = document.querySelector('#three-canvas');
    const renderer = new THREE.WebGLRenderer({
      canvas : canvas,
      antialias : true,
    });
    renderer.setSize(window.innerWidth,window.innerHeight);
    
    const scene = new THREE.Scene();
    
    /** 원근카메라 */
    // const camera = new THREE.PerspectiveCamera(75,window.innerWidth/window.innerHeight,0.1,1000)
    // camera.position.y = 1;
    // camera.position.z = 5;
    // scene.add(camera);
    
    /** 직교카매라 */
    const camera = new THREE.OrthographicCamera(-window.innerWidth/window.innerHeight,window.innerWidth/window.innerHeight,1,-1,0.1,1000);
    camera.position.x = 1;
    camera.position.y = 2;
    camera.position.z = 5;
    camera.zoom = 0.5;
    camera.updateProjectionMatrix();
    camera.lookAt(0,0,0);
    
    
    const box = new THREE.BoxGeometry(1,1,1);
    const material = new THREE.MeshBasicMaterial({
      color : 'red'
    })
    const mesh = new THREE.Mesh(box,material);
    scene.add(mesh);
    
    
    
    renderer.render(scene, camera);
}