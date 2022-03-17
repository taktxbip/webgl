import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

export default class Sketch {
    constructor(options) {
        this.time = 0;
        this.dom = options.dom;

        this.width = this.dom.offsetWidth;
        this.height = this.dom.offsetHeight;

        // setup
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(70, this.width / this.height, 0.01, 10);
        this.camera.position.z = 1;

        // renderer
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(this.width, this.height);
        this.dom.appendChild(this.renderer.domElement);

        this.controls = new OrbitControls(this.camera, this.renderer.domElement);

        this.resize();
        this.events();
        this.addObjects();
        this.render();
    }

    events() {
        window.addEventListener('resize', this.resize.bind(this));
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

        this.geometry = new THREE.BoxGeometry(0.2, 0.2, 0.2);
        this.material = new THREE.MeshNormalMaterial();
        this.material = new THREE.ShaderMaterial({
            fragmentShader: `
            void main() {
                gl_FragColor = vec4(0.3, 0.3, 0, 1.0);
            }`,
            vertexShader: `
            void main() {
                vec4 modelPosition = modelMatrix * vec4(position, 1.0);

                vec4 viewPosition = modelViewMatrix * modelPosition;
                vec4 projectedPosition = projectionMatrix * viewPosition;

                gl_Position = projectedPosition;
            }
            `,
        });

        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.scene.add(this.mesh);
    }

    render() {
        this.time += 0.05;

        this.mesh.rotation.x = this.time / 2000;
        this.mesh.rotation.y = this.time / 1000;

        this.renderer.render(this.scene, this.camera);
        window.requestAnimationFrame(this.render.bind(this));
    }
}




