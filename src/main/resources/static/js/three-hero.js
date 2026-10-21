/**
 * NEXUS 3D Interactive Hologram Coin - Three.js (ES Module)
 * Optimized for 60fps smooth scrolling
 * Sri Eshwar College of Engineering - Digital Token Marketplace
 * Author: Hari Prasath
 */

export function initThreeHero(canvas) {
    if (!canvas || typeof window.THREE === 'undefined') {
        return () => {};
    }

    const THREE = window.THREE;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let scene, camera, renderer, coinGroup, particlesGroup;
    let animationFrameId = null;
    let isVisible = false;
    let isRunning = false;
    let mouseX = 0, mouseY = 0;
    let targetRotationX = 0.2;
    let targetRotationY = 0;

    const width = canvas.parentElement ? canvas.parentElement.clientWidth : 500;
    const height = canvas.parentElement ? canvas.parentElement.clientHeight || 450 : 450;

    // 1. Scene & Camera
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.z = 6;
    camera.position.y = 0.2;

    // 2. Renderer with Capped Pixel Ratio (max 1.5 for mid-range laptops)
    renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        alpha: true,
        antialias: true,
        powerPreference: 'default'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));

    // 3. Consolidated Lighting (Single Ambient + Single Directional Light)
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambientLight);

    const cyanLight = new THREE.DirectionalLight(0x00f0ff, 2.5);
    cyanLight.position.set(4, 5, 4);
    scene.add(cyanLight);

    // 4. Token Assembly Group (Simplified Materials & Geometries)
    coinGroup = new THREE.Group();
    scene.add(coinGroup);

    // Core Token Cylinder
    const coinGeo = new THREE.CylinderGeometry(1.6, 1.6, 0.22, 32);
    const coinMat = new THREE.MeshStandardMaterial({
        color: 0x07152b,
        metalness: 0.9,
        roughness: 0.25,
        emissive: 0x00f0ff,
        emissiveIntensity: 0.22
    });
    const coin = new THREE.Mesh(coinGeo, coinMat);
    coin.rotation.x = Math.PI / 2;
    coinGroup.add(coin);

    // Neon Rim Edge
    const rimGeo = new THREE.TorusGeometry(1.62, 0.035, 12, 40);
    const rimMat = new THREE.MeshBasicMaterial({
        color: 0x00f0ff,
        wireframe: true
    });
    const rim = new THREE.Mesh(rimGeo, rimMat);
    coinGroup.add(rim);

    // Orbiting Ring 1 (Cyan Data Track)
    const ring1Geo = new THREE.RingGeometry(1.85, 1.94, 36);
    const ring1Mat = new THREE.MeshBasicMaterial({
        color: 0x00f0ff,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.7,
        wireframe: true
    });
    const ring1 = new THREE.Mesh(ring1Geo, ring1Mat);
    coinGroup.add(ring1);

    // Orbiting Ring 2 (Violet Gyroscope)
    const ring2Geo = new THREE.RingGeometry(2.18, 2.25, 40);
    const ring2Mat = new THREE.MeshBasicMaterial({
        color: 0x8b5cff,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.55,
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
        opacity: 0.5
    });
    const hexFront = new THREE.Mesh(hexGeo, hexMat);
    hexFront.position.z = 0.12;
    coinGroup.add(hexFront);

    const hexBack = new THREE.Mesh(hexGeo, hexMat);
    hexBack.position.z = -0.12;
    coinGroup.add(hexBack);

    // 5. Lightweight Particle Cloud (Reduced from 180 to 48)
    particlesGroup = new THREE.Group();
    scene.add(particlesGroup);

    const particleCount = 48;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    const palette = [
        new THREE.Color(0x00f0ff),
        new THREE.Color(0x8b5cff),
        new THREE.Color(0xff3df2)
    ];

    for (let i = 0; i < particleCount; i++) {
        const radius = 2.4 + Math.random() * 2.5;
        const theta = Math.random() * Math.PI * 2;
        const phi = (Math.random() - 0.5) * Math.PI;

        positions[i * 3] = radius * Math.cos(theta) * Math.cos(phi);
        positions[i * 3 + 1] = radius * Math.sin(phi);
        positions[i * 3 + 2] = radius * Math.sin(theta) * Math.cos(phi);

        const col = palette[i % palette.length];
        colors[i * 3] = col.r;
        colors[i * 3 + 1] = col.g;
        colors[i * 3 + 2] = col.b;
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const particleMat = new THREE.PointsMaterial({
        size: 0.06,
        vertexColors: true,
        transparent: true,
        opacity: 0.8
    });

    const particleSystem = new THREE.Points(particleGeo, particleMat);
    particlesGroup.add(particleSystem);

    // 6. Throttled Mouse Movement Handler
    let mouseRafId = null;
    function onMouseMove(event) {
        if (!isVisible || mouseRafId) return;
        mouseRafId = requestAnimationFrame(() => {
            mouseRafId = null;
            const rect = canvas.getBoundingClientRect();
            mouseX = ((event.clientX - rect.left) / rect.width) * 2 - 1;
            mouseY = -(((event.clientY - rect.top) / rect.height) * 2 - 1);
            targetRotationY = mouseX * 0.7;
            targetRotationX = mouseY * 0.5 + 0.2;
        });
    }

    // Only attach mousemove on desktop devices
    const isDesktop = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (isDesktop && !prefersReducedMotion) {
        window.addEventListener('mousemove', onMouseMove, { passive: true });
    }

    // Resize Handler
    function onWindowResize() {
        if (!canvas.parentElement || !renderer) return;
        const newWidth = canvas.parentElement.clientWidth;
        const newHeight = canvas.parentElement.clientHeight || 450;
        camera.aspect = newWidth / newHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(newWidth, newHeight);
        renderer.render(scene, camera);
    }
    window.addEventListener('resize', onWindowResize, { passive: true });

    // 7. Animation Loop with IntersectionObserver & Visibility Pausing
    let clock = new THREE.Clock();

    function renderFrame() {
        if (!renderer || !scene || !camera) return;
        const elapsedTime = clock.getElapsedTime();

        coinGroup.rotation.y += 0.012;
        ring1.rotation.z -= 0.016;
        ring2.rotation.z += 0.014;

        coinGroup.rotation.x += (targetRotationX - coinGroup.rotation.x) * 0.05;
        coinGroup.rotation.y += (targetRotationY - coinGroup.rotation.y) * 0.05;

        coinGroup.position.y = Math.sin(elapsedTime * 1.5) * 0.1;
        particlesGroup.rotation.y += 0.0025;

        renderer.render(scene, camera);
    }

    function animate() {
        if (!isRunning || !isVisible || document.hidden) {
            isRunning = false;
            return;
        }
        renderFrame();
        animationFrameId = requestAnimationFrame(animate);
    }

    function startLoop() {
        if (isRunning || prefersReducedMotion) return;
        isRunning = true;
        clock.start();
        animate();
    }

    function stopLoop() {
        isRunning = false;
        if (animationFrameId) {
            cancelAnimationFrame(animationFrameId);
            animationFrameId = null;
        }
    }

    // Handle Page Tab Visibility (pause when tab hidden)
    function onVisibilityChange() {
        if (document.hidden) {
            stopLoop();
        } else if (isVisible) {
            startLoop();
        }
    }
    document.addEventListener('visibilitychange', onVisibilityChange);

    // 8. IntersectionObserver: Render ONLY while in viewport
    const observer = new IntersectionObserver((entries) => {
        const entry = entries[0];
        isVisible = entry.isIntersecting;
        if (isVisible) {
            if (prefersReducedMotion) {
                renderFrame();
            } else {
                startLoop();
            }
        } else {
            stopLoop();
        }
    }, { threshold: 0.05 });

    observer.observe(canvas);

    // Initial render for immediate appearance
    renderFrame();

    // 9. Thorough Cleanup and Disposal on Route Change
    return function destroy() {
        stopLoop();
        observer.disconnect();
        document.removeEventListener('visibilitychange', onVisibilityChange);
        window.removeEventListener('mousemove', onMouseMove);
        window.removeEventListener('resize', onWindowResize);

        if (mouseRafId) cancelAnimationFrame(mouseRafId);

        // Traverse and dispose all geometries, materials, and textures
        if (scene) {
            scene.traverse((obj) => {
                if (obj.geometry) {
                    obj.geometry.dispose();
                }
                if (obj.material) {
                    if (Array.isArray(obj.material)) {
                        obj.material.forEach(m => m.dispose());
                    } else {
                        obj.material.dispose();
                    }
                }
            });
        }

        if (renderer) {
            renderer.dispose();
            renderer.forceContextLoss();
            renderer.domElement = null;
        }

        scene = null;
        camera = null;
        renderer = null;
        coinGroup = null;
        particlesGroup = null;
    };
}

export default initThreeHero;
