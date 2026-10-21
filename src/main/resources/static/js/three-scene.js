/**
 * NEXUS 3D Interactive Hologram - Three.js
 * Author: Hari Prasath (Sri Eshwar College of Engineering)
 */

(function () {
    const canvas = document.getElementById('threeHologramCanvas');
    if (!canvas || typeof THREE === 'undefined') return;

    let scene, camera, renderer, coinGroup, particles;
    let targetRotationX = 0.2;
    let targetRotationY = 0;
    let mouseX = 0, mouseY = 0;

    function init() {
        const width = canvas.parentElement.clientWidth;
        const height = canvas.parentElement.clientHeight || 450;

        // Scene
        scene = new THREE.Scene();

        // Camera
        camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
        camera.position.z = 6;
        camera.position.y = 0.3;

        // Renderer
        renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
        renderer.setSize(width, height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        // Lights
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
        scene.add(ambientLight);

        const pointLight1 = new THREE.PointLight(0x00f0ff, 3, 50);
        pointLight1.position.set(5, 5, 5);
        scene.add(pointLight1);

        const pointLight2 = new THREE.PointLight(0xa855f7, 2.5, 50);
        pointLight2.position.set(-5, -3, 3);
        scene.add(pointLight2);

        // Hologram Group
        coinGroup = new THREE.Group();
        scene.add(coinGroup);

        // 1. Central Holographic Coin Cylinder
        const coinGeometry = new THREE.CylinderGeometry(1.6, 1.6, 0.2, 32);
        const coinMaterial = new THREE.MeshStandardMaterial({
            color: 0x07152b,
            metalness: 0.9,
            roughness: 0.2,
            emissive: 0x00f0ff,
            emissiveIntensity: 0.25,
            wireframe: false
        });
        const coin = new THREE.Mesh(coinGeometry, coinMaterial);
        coin.rotation.x = Math.PI / 2;
        coinGroup.add(coin);

        // 2. Wireframe Rim
        const rimGeometry = new THREE.TorusGeometry(1.62, 0.04, 16, 64);
        const rimMaterial = new THREE.MeshBasicMaterial({
            color: 0x00f0ff,
            wireframe: true
        });
        const rim = new THREE.Mesh(rimGeometry, rimMaterial);
        coinGroup.add(rim);

        // 3. Concentric Rotating Data Ring 1
        const ring1Geo = new THREE.RingGeometry(1.85, 1.95, 48);
        const ring1Mat = new THREE.MeshBasicMaterial({
            color: 0x00f0ff,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.65,
            wireframe: true
        });
        const ring1 = new THREE.Mesh(ring1Geo, ring1Mat);
        ring1.name = "ring1";
        coinGroup.add(ring1);

        // 4. Concentric Rotating Data Ring 2 (Tilted Orbit)
        const ring2Geo = new THREE.RingGeometry(2.15, 2.22, 64);
        const ring2Mat = new THREE.MeshBasicMaterial({
            color: 0xa855f7,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.5,
            wireframe: true
        });
        const ring2 = new THREE.Mesh(ring2Geo, ring2Mat);
        ring2.rotation.x = 0.4;
        ring2.rotation.y = 0.3;
        ring2.name = "ring2";
        coinGroup.add(ring2);

        // 5. Hexagonal Core Grid
        const hexGeo = new THREE.CircleGeometry(1.2, 6);
        const hexMat = new THREE.MeshBasicMaterial({
            color: 0x00f0ff,
            wireframe: true,
            transparent: true,
            opacity: 0.8
        });
        const hex = new THREE.Mesh(hexGeo, hexMat);
        hex.position.z = 0.12;
        coinGroup.add(hex);

        const hexBack = hex.clone();
        hexBack.position.z = -0.12;
        coinGroup.add(hexBack);

        // 6. Floating Ambient Cyber Particles
        const particleCount = 200;
        const particleGeo = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);

        for (let i = 0; i < particleCount * 3; i += 3) {
            const radius = 2.4 + Math.random() * 2.0;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(Math.random() * 2 - 1);
            positions[i] = radius * Math.sin(phi) * Math.cos(theta);
            positions[i + 1] = radius * Math.sin(phi) * Math.sin(theta);
            positions[i + 2] = radius * Math.cos(phi);
        }

        particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        const particleMat = new THREE.PointsMaterial({
            color: 0x00f0ff,
            size: 0.05,
            transparent: true,
            opacity: 0.75
        });
        particles = new THREE.Points(particleGeo, particleMat);
        scene.add(particles);

        // Mouse Parallax Listeners
        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('resize', onWindowResize);

        // Touch support for mobile
        window.addEventListener('touchmove', onTouchMove, { passive: true });

        animate();
    }

    function onMouseMove(e) {
        const halfWidth = window.innerWidth / 2;
        const halfHeight = window.innerHeight / 2;
        mouseX = (e.clientX - halfWidth) / halfWidth;
        mouseY = (e.clientY - halfHeight) / halfHeight;

        targetRotationY = mouseX * 0.8;
        targetRotationX = mouseY * 0.5 + 0.2;
    }

    function onTouchMove(e) {
        if (e.touches.length > 0) {
            const touch = e.touches[0];
            const halfWidth = window.innerWidth / 2;
            const halfHeight = window.innerHeight / 2;
            mouseX = (touch.clientX - halfWidth) / halfWidth;
            mouseY = (touch.clientY - halfHeight) / halfHeight;
            targetRotationY = mouseX * 0.8;
            targetRotationX = mouseY * 0.5 + 0.2;
        }
    }

    function onWindowResize() {
        if (!canvas || !canvas.parentElement) return;
        const width = canvas.parentElement.clientWidth;
        const height = canvas.parentElement.clientHeight || 450;

        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
    }

    let clock = new THREE.Clock();

    function animate() {
        requestAnimationFrame(animate);

        const delta = clock.getDelta();
        const time = clock.getElapsedTime();

        if (coinGroup) {
            // Auto idle rotation + mouse spring interpolation
            coinGroup.rotation.y += (targetRotationY - coinGroup.rotation.y) * 0.05 + 0.008;
            coinGroup.rotation.x += (targetRotationX - coinGroup.rotation.x) * 0.05;

            // Gentle floating bob
            coinGroup.position.y = Math.sin(time * 1.5) * 0.12;

            // Counter rotate rings
            const ring1 = coinGroup.getObjectByName("ring1");
            if (ring1) ring1.rotation.z -= 0.015;

            const ring2 = coinGroup.getObjectByName("ring2");
            if (ring2) ring2.rotation.z += 0.01;
        }

        if (particles) {
            particles.rotation.y -= 0.002;
            particles.rotation.x += 0.001;
        }

        renderer.render(scene, camera);
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
