import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import imagesLoaded from 'imagesloaded';
import FontFaceObserver from 'fontfaceobserver';

import fragment from '../shaders/fragment.glsl';
import vertex from '../shaders/vertex.glsl';
import Scroll from '../scroll';

import ocean from '../../images/ocean.jpeg';

export default class Sketch {
    constructor(options) {
        this.time = 0;
        this.dom = options.dom;
        this.currentScroll = 0;

        this.width = this.dom.offsetWidth;
        this.height = this.dom.offsetHeight;

        // setup
        this.loadingManager = new THREE.LoadingManager();
        this.textureLoader = new THREE.TextureLoader(this.loadingManager);

        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(70, this.width / this.height, 100, 2000);
        this.camera.position.z = 600;

        this.camera.fov = 2 * Math.atan((this.height / 2) / this.camera.position.z) * (180 / Math.PI);

        // renderer
        this.renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true
        });
        this.renderer.setSize(this.width, this.height);
        this.dom.appendChild(this.renderer.domElement);

        this.controls = new OrbitControls(this.camera, this.renderer.domElement);

        this.images = [...document.querySelectorAll('img')];


        const fontRoboto = new Promise(resolve => {
            new FontFaceObserver("Roboto").load().then(() => {
                resolve();
            });
        });

        // Preload images
        const preloadImages = new Promise((resolve, reject) => {
            imagesLoaded(document.querySelectorAll("img"), { background: true }, resolve);
        });

        const allPromises = [fontRoboto, preloadImages];
        Promise.all(allPromises).then(() => {
            this.scroll = new Scroll();
            this.addImages();
            this.setPositions();
            this.resize();
            this.events();
            this.addObjects();
            this.render();
        });
    }

    setPositions() {
        console.log('setPositions');
        this.imageStore.forEach(o => {
            o.mesh.position.y = this.currentScroll - o.top + this.height / 2 - o.height / 2;
            o.mesh.position.x = o.left - this.width / 2 + o.width / 2;
        });
    }

    addImages() {
        this.imageStore = this.images.map(img => {
            const bounds = img.getBoundingClientRect();

            const { top, left, height, width } = bounds;
            const geometry = new THREE.PlaneBufferGeometry(width, height, 10, 10);
            const texture = new THREE.TextureLoader().load(img.src);
            texture.needsUpdate = true;

            const material = new THREE.MeshBasicMaterial({
                map: texture
            });

            const mesh = new THREE.Mesh(geometry, material);

            this.scene.add(mesh);

            return {
                img, mesh, top, left, width, height
            };
        });
    }

    events() {
        window.addEventListener('resize', () => {
            console.log('resize');
            this.resize();
            this.setPositions();
        });
    }

    resize() {
        this.width = this.dom.offsetWidth;
        this.height = this.dom.offsetHeight;

        // Update camera
        this.camera.aspect = this.width / this.height;
        this.camera.updateProjectionMatrix();

        // Update renderer
        this.renderer.setSize(this.width, this.height);
    }

    addObjects() {

        this.geometry = new THREE.PlaneBufferGeometry(100, 100, 10, 10);

        this.material = new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0 },
                oceanTexture: { value: new THREE.TextureLoader().load(ocean) }
            },
            side: THREE.DoubleSide,
            fragmentShader: fragment,
            vertexShader: vertex,
            wireframe: true
        });

        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.scene.add(this.mesh);
    }

    render() {
        console.log('render');
        // this.time += 0.05;

        this.scroll.render();
        this.currentScroll = this.scroll.scrollToRender;
        this.setPositions();

        // this.material.uniforms.time.value = this.time;

        this.renderer.render(this.scene, this.camera);
        window.requestAnimationFrame(this.render.bind(this));
    }
}




