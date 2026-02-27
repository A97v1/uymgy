
import * as THREE from 'https://cdn.skypack.dev/three@0.136.0';

export function initBackground() {

    const container = document.getElementById('canvas-container');
    if (!container) return;

    /* SCENE */
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x000000, 0.08);

    /* CAMERA */
    const camera = new THREE.PerspectiveCamera(
        60,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    );
    camera.position.set(0, 2, 6);

    /* RENDERER */
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    /* PARTICLES (Soft Floating Dust) */
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 3000;
    const positions = new Float32Array(particlesCount * 3);

    for (let i = 0; i < particlesCount * 3; i++) {
        positions[i] = (Math.random() - 0.5) * 40;
    }

    particlesGeometry.setAttribute(
        'position',
        new THREE.BufferAttribute(positions, 3)
    );

    const particlesMaterial = new THREE.PointsMaterial({
        size: 0.02,
        color: 0xffffff,
        transparent: true,
        opacity: 0.4
    });

    const particles = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particles);

    /* SMOOTH WAVE SURFACE */
    const geometry = new THREE.PlaneGeometry(40, 40, 200, 200);
    const material = new THREE.MeshStandardMaterial({
        color: 0x111111,
        wireframe: false,
        roughness: 0.8,
        metalness: 0.2,
    });

    const plane = new THREE.Mesh(geometry, material);
    plane.rotation.x = -Math.PI / 2;
    plane.position.y = -2;
    scene.add(plane);

    /* LIGHTS (Cinematic Glow) */
    const ambient = new THREE.AmbientLight(0xffffff, 0.3);
    scene.add(ambient);

    const light1 = new THREE.PointLight(0xff6a00, 2, 50);
    light1.position.set(5, 5, 5);
    scene.add(light1);

    const light2 = new THREE.PointLight(0x3366ff, 2, 50);
    light2.position.set(-5, 5, -5);
    scene.add(light2);

    /* MOUSE EFFECT */
    let mouseX = 0;
    let mouseY = 0;

    document.addEventListener("mousemove", (event) => {
        mouseX = (event.clientX / window.innerWidth) * 2 - 1;
        mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
    });

    /* ANIMATION */
    const clock = new THREE.Clock();

    function animate() {
        requestAnimationFrame(animate);

        const time = clock.getElapsedTime();

        // Smooth wave animation
        const positions = plane.geometry.attributes.position;

        for (let i = 0; i < positions.count; i++) {
            const x = positions.getX(i);
            const y = positions.getY(i);
            const wave = Math.sin(x * 0.3 + time) * 0.3 +
                         Math.cos(y * 0.3 + time) * 0.3;
            positions.setZ(i, wave);
        }

        positions.needsUpdate = true;

        // Particles slow rotation
        particles.rotation.y += 0.0005;

        // Smooth cinematic camera movement
        camera.position.x += (mouseX * 1.5 - camera.position.x) * 0.03;
        camera.position.y += (mouseY * 1.2 + 2 - camera.position.y) * 0.03;
        camera.lookAt(scene.position);

        renderer.render(scene, camera);
    }

    animate();

    /* RESPONSIVE */
    window.addEventListener("resize", () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
}

