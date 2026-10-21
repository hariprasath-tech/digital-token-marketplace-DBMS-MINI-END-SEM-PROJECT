/**
 * NEXUS 3D Interactive Hologram Coin - Three.js (ES Module)
 * Sri Eshwar College of Engineering - Digital Token Marketplace
 * Author: Hari Prasath
 */

export function initThreeHero(canvas) {
    if (!canvas || typeof window.THREE === 'undefined') {
        console.warn('Three.js canvas not found or THREE undefined');
        return () => {};
    }

    const THREE = window.THREE;

    let scene, camera, renderer, coinGroup, particlesGroup;
    let animationFrameId;
    let mouseX = 0, mouseY = 0;
    let targetRotationX = 0.2;
    let targetRotationY = 0;

    const width = canvas.parentElement ? canvas.parentElement.clientWidth : 500;
    const height = canvas.parentElement ? canvas.parentElement.clientHeight || 450 : 450;

    // 1. Scene & Camera
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 6;
    camera.position.y = 0.2;

    // 2. Renderer with Antialias & Alpha
    renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        alpha: true,
        antialias: true,
        powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

    // 3. Lighting Setup
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
    scene.add(ambientLight);

    const cyanPoint = new THREE.PointLight(0x00f0ff, 3.2, 50);
    cyanPoint.position.set(5, 5, 5);
    scene.add(cyanPoint);

    const purplePoint = new THREE.PointLight(0x8b5cff, 2.8, 50);
    purplePoint.position.set(-5, -3, 3);
    scene.add(purplePoint);

    const magentaPoint = new THREE.PointLight(0xff3df2, 2.0, 50);
    magentaPoint.position.set(0, -6, -2);
    scene.add(magentaPoint);

    // 4. Token Assembly Group
    coinGroup = new THREE.Group();
    scene.add(coinGroup);

    // Core Token Cylinder (Deep Cyber Metal)
    const coinGeo = new THREE.CylinderGeometry(1.6, 1.6, 0.22, 48);
    const coinMat = new THREE.MeshStandardMaterial({
        color: 0x07152b,
        metalness: 0.95,
        roughness: 0.18,
        emissive: 0x00f0ff,
        emissiveIntensity: 0.28
    });
    const coin = new THREE.Mesh(coinGeo, coinMat);
    coin.rotation.x = Math.PI / 2;
    coinGroup.add(coin);

    // Neon Rim Edge
    const rimGeo = new THREE.TorusGeometry(1.62, 0.04, 16, 64);
    const rimMat = new THREE.MeshBasicMaterial({
        color: 0x00f0ff,
        wireframe: true
    });
    const rim = new THREE.Mesh(rimGeo, rimMat);
    coinGroup.add(rim);

    // Concentric Orbiting Ring 1 (Cyan Data Track)
    const ring1Geo = new THREE.RingGeometry(1.85, 1.95, 48);
    const ring1Mat = new THREE.MeshBasicMaterial({
        color: 0x00f0ff,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.75,
        wireframe: true
    });
    const ring1 = new THREE.Mesh(ring1Geo, ring1Mat);
    coinGroup.add(ring1);

    // Concentric Orbiting Ring 2 (Violet Tilted Gyroscope)
    const ring2Geo = new THREE.RingGeometry(2.18, 2.25, 64);
    const ring2Mat = new THREE.MeshBasicMaterial({
        color: 0x8b5cff,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.6,
        wireframe: true
    });
    const ring2 = new THREE.Mesh(ring2Geo, ring2Mat);
    ring2.rotation.x = 0.45;
    ring2.rotation.y = 0.35;
    coinGroup.add(ring2);

    // Hexagonal Core Pattern on faces
    const hexGeo = new THREE.CircleGeometry(1.2, 6);
    const hexMat = new THREE.MeshBasicMaterial({
        color: 0x00f0ff,
        wireframe: true,
        transparent: true,
        opacity: 0.55
    });
    const hexFront = new THREE.Mesh(hexGeo, hexMat);
    hexFront.position.z = 0.12;
    coinGroup.add(hexFront);

    const hexBack = new THREE.Mesh(hexGeo, hexMat);
    hexBack.position.z = -0.12;
    coinGroup.add(hexBack);

    // 5. Orbiting Floating Cloud of Tech Particles
    particlesGroup = new THREE.Group();
    scene.add(particlesGroup);

    const particleCount = 180;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    const palette = [
        new THREE.Color(0x00f0ff),
        new THREE.Color(0x8b5cff),
        new THREE.Color(0xff3df2),
        new THREE.Color(0xb6ff3c)
    ];

    for (let i = 0; i < particleCount; i++) {
        const radius = 2.4 + Math.random() * 2.8;
        const theta = Math.random() * Math.PI * 2;
        const phi = (Math.random() - 0.5) * Math.PI;

        positions[i * 3] = radius * Math.cos(theta) * Math.cos(phi);
        positions[i * 3 + 1] = radius * Math.sin(phi);
        positions[i * 3 + 2] = radius * Math.sin(theta) * Math.cos(phi);

        const col = palette[Math.floor(Math.random() * palette.length)];
        colors[i * 3] = col.r;
        colors[i * 3 + 1] = col.g;
        colors[i * 3 + 2] = col.b;
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const particleMat = new THREE.PointsMaterial({
        size: 0.065,
        vertexColors: true,
        transparent: true,
        opacity: 0.85
    });

    const particleSystem = new THREE.Points(particleGeo, particleMat);
    particlesGroup.add(particleSystem);

    // 6. Interactive Mouse Movement
    function onMouseMove(event) {
        const rect = canvas.getBoundingClientRect();
        mouseX = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        mouseY = -(((event.clientY - rect.top) / rect.height) * 2 - 1);

        targetRotationY = mouseX * 0.8;
        targetRotationX = mouseY * 0.6 + 0.2;
    }

    window.addEventListener('mousemove', onMouseMove);

    // Resize Handler
    function onWindowResize() {
        if (!canvas.parentElement) return;
        const newWidth = canvas.parentElement.clientWidth;
        const newHeight = canvas.parentElement.clientHeight || 450;
        camera.aspect = newWidth / newHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(newWidth, newHeight);
    }
    window.addEventListener('resize', onWindowResize);

    // 7. Animation Loop
    let clock = new THREE.Clock();

    function animate() {
        animationFrameId = requestAnimationFrame(animate);
        const delta = clock.getDelta();
        const elapsedTime = clock.getElapsedTime();

        // Continuous Gyroscope Spin
        coinGroup.rotation.y += 0.012;
        ring1.rotation.z -= 0.018;
        ring2.rotation.z += 0.015;

        // Mouse Interactivity Lerp
        coinGroup.rotation.x += (targetRotationX - coinGroup.rotation.x) * 0.05;
        coinGroup.rotation.y += (targetRotationY - coinGroup.rotation.y) * 0.05;

        // Subtle Floating Bob
        coinGroup.position.y = Math.sin(elapsedTime * 1.5) * 0.12;

        // Particle field rotation
        particlesGroup.rotation.y += 0.003;
        particlesGroup.rotation.x = Math.sin(elapsedTime * 0.5) * 0.05;

        renderer.render(scene, camera);
    }

    animate();

    // Return cleanup callback
    return function destroy() {
        cancelAnimationFrame(animationFrameId);
        window.removeEventListener('mousemove', onMouseMove);
        window.removeEventListener('resize', onWindowResize);
        if (renderer) renderer.dispose();
    };
}

export default initThreeHero;
