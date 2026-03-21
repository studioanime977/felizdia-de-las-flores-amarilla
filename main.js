/**
 * "Día de las Flores Amarillas" - Cosmic Floral Experience
 * Built with Three.js and GSAP
 */

// --- Configuration & Constants ---
const CONFIG = {
    flowerCount: 20,
    starCount: 2000,
    parallaxLayers: 3,
    colors: {
        goldBright: 0xffd700,
        spaceBlack: 0x010103,
        yellowNeon: 0xfffb00,
        yellowPetal: 0xffdb58,
        orangePetal: 0xffa500
    },
    assets: {
        sunflower: 'assets/sunflower.svg',
        sunflowerSmall: 'assets/sunflower_small.svg',
        petal: 'assets/petal.svg',
        music: 'QUIERO-DECIRTE.mp3'
    },
    messages: [
        "Tu brillo es mi sol",
        "Contigo todo es eterno",
        "Mi mundo es tuyo",
        "Cada pétalo es un deseo de felicidad para ti ✨",
        "Eres mi estrella más brillante 💛",
        "Un pedacito de sol para quien ilumina mis días ☀️",
        "Flores amarillas que nunca se marchitan 🌼"
    ]
};

// --- Scene Initialization ---
const scene = new THREE.Scene();
scene.background = new THREE.Color(CONFIG.colors.spaceBlack);
scene.fog = new THREE.FogExp2(CONFIG.colors.spaceBlack, 0.05);

const canvas = document.querySelector('#experience-canvas');
const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 0, 10);

// --- Lighting (Soft and Romantic) ---
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);

const pointLight = new THREE.PointLight(CONFIG.colors.yellowNeon, 1.2, 30);
pointLight.position.set(10, 10, 10);
scene.add(pointLight);

const backLight = new THREE.PointLight(0xffd700, 0.8, 20);
backLight.position.set(-10, -5, -10);
scene.add(backLight);

// --- Background: Galaxy & Stars ---
function createGalaxy() {
    const starGeometry = new THREE.BufferGeometry();
    const starMaterial = new THREE.PointsMaterial({
        color: 0xffffff,
        size: 0.05,
        transparent: true
    });

    const starVertices = [];
    for (let i = 0; i < CONFIG.starCount; i++) {
        const x = (Math.random() - 0.5) * 100;
        const y = (Math.random() - 0.5) * 100;
        const z = (Math.random() - 0.5) * 100;
        starVertices.push(x, y, z);
    }

    starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));
    const stars = new THREE.Points(starGeometry, starMaterial);
    scene.add(stars);

    // Nebula Effect (Glowing Sprites)
    const nebulaTexture = createNebulaTexture();
    const nebulaColors = [0x2a0845, 0x00d2ff, 0xff8c00]; // Purple, Blue, Orange
    for (let i = 0; i < 15; i++) {
        const material = new THREE.SpriteMaterial({
            map: nebulaTexture,
            color: nebulaColors[i % nebulaColors.length],
            transparent: true,
            opacity: 0.05, // Much subtler
            blending: THREE.AdditiveBlending
        });
        const sprite = new THREE.Sprite(material);
        sprite.position.set(
            (Math.random() - 0.5) * 60,
            (Math.random() - 0.5) * 60,
            (Math.random() - 0.5) * 40 - 30
        );
        sprite.scale.set(40 + Math.random() * 20, 40 + Math.random() * 20, 1);
        sprite.rotation.z = Math.random() * Math.PI;
        scene.add(sprite);
    }
}

function createNebulaTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');
    const gradient = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
    gradient.addColorStop(0.2, 'rgba(255, 255, 255, 0.3)');
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 128, 128);
    const texture = new THREE.CanvasTexture(canvas);
    return texture;
}

// --- Floral Elements: Pure Image-Based Sprites ---
const flowers = [];
const textureLoader = new THREE.TextureLoader();

// Load textures with error handling
let sunflowerTexture, sunflowerSmallTexture, petalTexture;
let texturesLoaded = 0;
const totalTextures = 3;

function checkAllTexturesLoaded() {
    texturesLoaded++;
    if (texturesLoaded === totalTextures) {
        console.log('✅ Todas las texturas cargadas');
    }
}

sunflowerTexture = textureLoader.load(
    CONFIG.assets.sunflower,
    (texture) => {
        console.log('✅ Sunflower texture loaded');
        checkAllTexturesLoaded();
    },
    (progress) => {
        console.log('Loading sunflower texture...', Math.round(progress.loaded / progress.total * 100) + '%');
    },
    (error) => {
        console.error('❌ Error loading sunflower texture:', error);
        checkAllTexturesLoaded();
    }
);

sunflowerSmallTexture = textureLoader.load(
    CONFIG.assets.sunflowerSmall,
    (texture) => {
        console.log('✅ Small sunflower texture loaded');
        checkAllTexturesLoaded();
    },
    (progress) => {
        console.log('Loading small sunflower texture...', Math.round(progress.loaded / progress.total * 100) + '%');
    },
    (error) => {
        console.error('❌ Error loading small sunflower texture:', error);
        checkAllTexturesLoaded();
    }
);

petalTexture = textureLoader.load(
    CONFIG.assets.petal,
    (texture) => {
        console.log('✅ Petal texture loaded');
        checkAllTexturesLoaded();
    },
    (progress) => {
        console.log('Loading petal texture...', Math.round(progress.loaded / progress.total * 100) + '%');
    },
    (error) => {
        console.error('❌ Error loading petal texture:', error);
        checkAllTexturesLoaded();
    }
);

// Enable transparency for all textures
[sunflowerTexture, sunflowerSmallTexture, petalTexture].forEach(texture => {
    if (texture) {
        texture.transparent = true;
        texture.alphaTest = 0.1;
    }
});

function createMainFlowers() {
    // Right Flower (Interactive Crystal)
    mainFlowerRight = createFlowerSprite(0, true, 'crystal', 'large');
    mainFlowerRight.position.set(4, 1, 3);
    
    // Left Flower (Golden Heart)
    mainFlowerLeft = createFlowerSprite(1, true, 'golden', 'large');
    mainFlowerLeft.position.set(-4, -1, 2);
}

function createFlowerSprite(index, isMain = false, interactionType = 'standard', size = 'medium') {
    try {
        // Choose texture based on size
        const texture = size === 'large' ? sunflowerTexture : sunflowerSmallTexture;
        
        if (!texture) {
            console.error('❌ Texture not available for flower', index);
            return null;
        }
        
        // Create sprite material with glow effect
        const material = new THREE.SpriteMaterial({
            map: texture,
            transparent: true,
            alphaTest: 0.1,
            color: isMain ? 0xffffff : 0xffffff,
            opacity: 1,
            blending: THREE.AdditiveBlending
        });
        
        const sprite = new THREE.Sprite(material);
        
        // Set size based on type - Smaller for an "universe" feel
        const baseSize = size === 'large' ? 2.5 : (size === 'medium' ? 1.5 : 0.8);
        sprite.scale.set(baseSize, baseSize, 1);
        
        // Add glow sprite for main flowers
        if (isMain) {
            const glowMaterial = new THREE.SpriteMaterial({
                map: texture,
                transparent: true,
                opacity: 0.3,
                color: interactionType === 'crystal' ? 0x00ffff : 0xffd700,
                blending: THREE.AdditiveBlending
            });
            const glowSprite = new THREE.Sprite(glowMaterial);
            glowSprite.scale.set(baseSize * 1.3, baseSize * 1.3, 1);
            glowSprite.position.z = -0.1;
            sprite.add(glowSprite);
        }
        
        // Position with parallax depth
        const depthLayer = Math.floor(Math.random() * CONFIG.parallaxLayers);
        const zPos = isMain ? (interactionType === 'crystal' ? 3 : 2) : (depthLayer - 1) * 5;
        
        // Position with more dispersion for an expansive universe
        sprite.position.set(
            (Math.random() - 0.5) * 60,
            (Math.random() - 0.5) * 40,
            zPos
        );
        
        // Store interaction data
        sprite.userData = {
            index,
            isMain,
            interactionType,
            size,
            originalScale: baseSize,
            depthLayer,
            message: isMain ? (interactionType === 'crystal' ? "Tu brillo es mi sol" : "Mi mundo es tuyo") : CONFIG.messages[index % CONFIG.messages.length],
            floatSpeed: 0.001 + Math.random() * 0.002,
            rotationSpeed: (Math.random() - 0.5) * 0.001,
            floatOffset: Math.random() * Math.PI * 2
        };
        
        scene.add(sprite);
        flowers.push(sprite);
        console.log(`✅ Flower ${index} created successfully`);
        return sprite;
    } catch (error) {
        console.error(`❌ Error creating flower ${index}:`, error);
        return null;
    }
}

// --- Falling Petals Effect ---
let petalParticles = [];

function createFallingPetals() {
    try {
        const count = 80;
        for (let i = 0; i < count; i++) {
            if (!petalTexture) {
                console.warn('⚠️ Petal texture not loaded yet, skipping petal creation');
                continue;
            }
            
            const material = new THREE.SpriteMaterial({
                map: petalTexture,
                transparent: true,
                opacity: 0.7,
                rotation: Math.random() * Math.PI,
                blending: THREE.AdditiveBlending
            });
            const sprite = new THREE.Sprite(material);
            resetPetal(sprite);
            scene.add(sprite);
            petalParticles.push(sprite);
        }
        console.log(`✅ Created ${petalParticles.length} falling petals`);
    } catch (error) {
        console.error('❌ Error creating falling petals:', error);
    }
}

function resetPetal(petal) {
    petal.position.set(
        (Math.random() - 0.5) * 30,
        15 + Math.random() * 10,
        (Math.random() - 0.5) * 20
    );
    petal.scale.set(0.3, 0.3, 1);
    petal.userData.speed = 0.02 + Math.random() * 0.05;
    petal.userData.rotSpeed = (Math.random() - 0.5) * 0.02;
}

function updatePetals() {
    petalParticles.forEach(petal => {
        petal.position.y -= petal.userData.speed;
        petal.position.x += Math.sin(Date.now() * 0.001 + petal.position.y) * 0.01;
        petal.material.rotation += petal.userData.rotSpeed;
        
        if (petal.position.y < -15) {
            resetPetal(petal);
        }
    });
}

// --- Stardust Trail: Floating particles and buds ---
function createStardustTrail() {
    const particleCount = 200;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    
    for (let i = 0; i < particleCount; i++) {
        // Create a trail from left to right
        const x = (i / particleCount) * 40 - 20;
        const y = Math.sin(i * 0.1) * 5 + (Math.random() - 0.5) * 2;
        const z = Math.cos(i * 0.1) * 2 + (Math.random() - 0.5) * 5;
        
        positions[i * 3] = x;
        positions[i * 3 + 1] = y;
        positions[i * 3 + 2] = z;
        
        colors[i * 3] = 1; // R (Gold/Yellow)
        colors[i * 3 + 1] = 0.8; // G
        colors[i * 3 + 2] = 0; // B

        // Spawn a bud occasionally
        if (i % 20 === 0) {
            createBud(new THREE.Vector3(x, y, z));
        }
    }
    
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    
    const material = new THREE.PointsMaterial({
        size: 0.1,
        vertexColors: true,
        transparent: true,
        opacity: 0.6,
        blending: THREE.AdditiveBlending
    });
    
    const points = new THREE.Points(geometry, material);
    scene.add(points);
}

function createBud(position) {
    const budGeo = new THREE.SphereGeometry(0.1, 8, 8);
    const budMat = new THREE.MeshStandardMaterial({
        color: CONFIG.colors.orangePetal,
        emissive: CONFIG.colors.yellowPetal,
        emissiveIntensity: 0.5
    });
    const bud = new THREE.Mesh(budGeo, budMat);
    bud.position.copy(position);
    scene.add(bud);
    
    // Slight animation for buds
    gsap.to(bud.scale, {
        x: 1.5, y: 1.5, z: 1.5,
        duration: 1 + Math.random(),
        yoyo: true,
        repeat: -1,
        ease: "sine.inOut"
    });
}

// --- Interaction Logic ---
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
let hoveredFlower = null;

const uiContainer = document.querySelector('#message-display');
const messageText = document.querySelector('#message-text');

function onMouseMove(event) {
    // Mouse coords for raycasting
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    // Custom cursor update
    const cursor = document.querySelector('#custom-cursor');
    gsap.to(cursor, {
        x: event.clientX - 4,
        y: event.clientY - 4,
        duration: 0.1
    });

    // Cursor trail
    createTrail(event.clientX, event.clientY);

    // Enhanced parallax effect on camera with depth layers
    const parallaxStrength = 3;
    gsap.to(camera.position, {
        x: mouse.x * parallaxStrength,
        y: mouse.y * parallaxStrength,
        duration: 1.2,
        ease: "power2.out"
    });
    
    // Parallax movement for flowers based on depth
    flowers.forEach(flower => {
        const depth = flower.userData.depthLayer || 0;
        const depthFactor = 1 - (depth / CONFIG.parallaxLayers);
        const parallaxX = mouse.x * depthFactor * 2;
        const parallaxY = mouse.y * depthFactor * 2;
        
        gsap.to(flower.position, {
            x: flower.position.x + parallaxX * 0.1,
            y: flower.position.y + parallaxY * 0.1,
            duration: 1,
            ease: "power2.out"
        });
    });
}

function createTrail(x, y) {
    const particle = document.createElement('div');
    particle.className = 'trail-particle';
    particle.style.left = x + 'px';
    particle.style.top = y + 'px';
    document.body.appendChild(particle);

    gsap.to(particle, {
        scale: 0,
        opacity: 0,
        duration: 0.8,
        ease: "power1.in",
        onComplete: () => particle.remove()
    });
}

function onClick() {
    try {
        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(flowers, false);

        if (intersects.length > 0) {
            // For sprites, the intersected object is the flower itself
            const flower = intersects[0].object;
            
            if (flower && flower.userData) {
                console.log(`🌸 Clicked on flower ${flower.userData.index}`);
                triggerFlowerAction(flower);
            }
        }
    } catch (error) {
        console.error('❌ Error in onClick:', error);
    }
}

let typewriterInterval = null;

function triggerFlowerAction(flower) {
    // Enhanced bloom animation
    const originalScale = flower.userData.originalScale;
    gsap.to(flower.scale, {
        x: originalScale * 1.8,
        y: originalScale * 1.8,
        duration: 0.6,
        yoyo: true,
        repeat: 1,
        ease: "elastic.out(1, 0.3)"
    });
    
    // Glow pulse effect
    if (flower.children.length > 0) {
        const glow = flower.children[0];
        gsap.to(glow.material, {
            opacity: 0.8,
            duration: 0.3,
            yoyo: true,
            repeat: 1
        });
    }
    
    // Create petal burst effect
    createPetalBurst(flower.position);

    if (flower.userData.interactionType === 'crystal') {
        showScroll(flower.userData.message);
    } else {
        // Display Message with enhanced animation
        uiContainer.classList.add('active');
        typeWriter(messageText, flower.userData.message);

        // Auto-hide after 5 seconds
        setTimeout(() => {
            uiContainer.classList.remove('active');
        }, 5000);
    }
}

const scrollOverlay = document.querySelector('#scroll-overlay');
const scrollContent = document.querySelector('#scroll-content');

function showScroll(text) {
    scrollOverlay.classList.add('active');
    scrollContent.classList.add('typing');
    
    // Typewriter effect for scroll with gold span support
    scrollContent.innerHTML = '';
    
    // Split text into parts to highlight if needed
    // For "Tu brillo es mi sol", let's highlight "sol"
    const displayMessage = text.replace("mi sol", "<span>mi sol</span>");
    
    let i = 0;
    const speed = 70;
    let tempContent = "";

    function type() {
        if (i < text.length) {
            tempContent += text.charAt(i);
            // Replace in real-time or just at the end? Let's do a simple version
            scrollContent.innerHTML = tempContent.replace("mi sol", "<span>mi sol</span>");
            i++;
            setTimeout(type, speed);
        }
    }
    
    setTimeout(type, 800); // Wait for scroll to open

    // Close on click anywhere
    const closeHandler = () => {
        scrollOverlay.classList.remove('active');
        scrollContent.classList.remove('typing');
        window.removeEventListener('click', closeHandler);
    };
    
    // Delay adding the click listener so the opening click doesn't close it instantly
    setTimeout(() => {
        window.addEventListener('click', closeHandler);
    }, 1000);
}

function typeWriter(element, text) {
    if (typewriterInterval) clearInterval(typewriterInterval);
    
    element.innerHTML = '';
    let i = 0;
    const speed = 50;

    typewriterInterval = setInterval(() => {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
        } else {
            clearInterval(typewriterInterval);
        }
    }, speed);
}

// --- Enhanced Petal Effects ---
function createPetalBurst(position) {
    const burstCount = 12;
    for (let i = 0; i < burstCount; i++) {
        const material = new THREE.SpriteMaterial({
            map: petalTexture,
            transparent: true,
            opacity: 0.8,
            blending: THREE.AdditiveBlending
        });
        const sprite = new THREE.Sprite(material);
        sprite.scale.set(0.5, 0.5, 1);
        sprite.position.copy(position);
        scene.add(sprite);
        
        const angle = (i / burstCount) * Math.PI * 2;
        const velocity = 0.1 + Math.random() * 0.1;
        
        gsap.to(sprite.position, {
            x: position.x + Math.cos(angle) * velocity * 50,
            y: position.y + Math.sin(angle) * velocity * 30,
            z: position.z + (Math.random() - 0.5) * 20,
            duration: 2,
            ease: "power1.out"
        });
        
        gsap.to(sprite.material, {
            opacity: 0,
            duration: 2,
            onComplete: () => scene.remove(sprite)
        });
        
        gsap.to(sprite.rotation, {
            z: Math.PI * 2,
            duration: 2
        });
    }
}

// --- Main Loop with Enhanced Animations ---
function animate() {
    requestAnimationFrame(animate);

    // Enhanced flower animations with individual properties
    flowers.forEach((flower, i) => {
        const userData = flower.userData;
        const time = Date.now() * 0.001;
        
        // Gentle floating movement
        flower.position.y += Math.sin(time * userData.floatSpeed + userData.floatOffset) * 0.008;
        
        // Subtle rotation
        flower.rotation.z += userData.rotationSpeed;
        
        // Gentle pulsing for main flowers
        if (userData.isMain) {
            const pulseScale = userData.originalScale * (1 + Math.sin(time * 0.5) * 0.05);
            flower.scale.set(pulseScale, pulseScale, 1);
        }
        
        // Depth-based opacity fade
        if (userData.depthLayer > 0) {
            const distanceFactor = 1 - (userData.depthLayer / CONFIG.parallaxLayers) * 0.3;
            flower.material.opacity = Math.max(0.7, distanceFactor);
        }
    });

    updatePetals();

    // Enhanced hover effect with glow
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(flowers, false);
    
    if (intersects.length > 0) {
        if (!hoveredFlower) {
            document.querySelector('#custom-cursor').style.transform = 'scale(2.5)';
            document.querySelector('#custom-cursor').style.boxShadow = '0 0 20px var(--yellow-neon), 0 0 40px var(--yellow-neon)';
        }
        hoveredFlower = true;
    } else {
        if (hoveredFlower) {
            document.querySelector('#custom-cursor').style.transform = 'scale(1)';
            document.querySelector('#custom-cursor').style.boxShadow = '0 0 10px var(--yellow-neon), 0 0 20px var(--yellow-neon)';
        }
        hoveredFlower = false;
    }

    renderer.render(scene, camera);
}

// --- Event Listeners & Start ---
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

window.addEventListener('mousemove', onMouseMove);
window.addEventListener('click', onClick);
window.addEventListener('touchstart', (e) => {
    mouse.x = (e.touches[0].clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(e.touches[0].clientY / window.innerHeight) * 2 + 1;
    onClick();
});

window.addEventListener('touchmove', (e) => {
    // Prevent default scrolling to allow internal navigation
    if (e.cancelable) e.preventDefault();
    
    mouse.x = (e.touches[0].clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(e.touches[0].clientY / window.innerHeight) * 2 + 1;
}, { passive: false });

// Audio Support with Enhanced Controls
let sound, audioLoader, listener, audioAnalyser, audioData;
let isAudioPlaying = false;

// Expose functions globally for HTML controls
window.toggleMusic = toggleMusic;
window.isAudioPlaying = false;

function initAudio() {
    listener = new THREE.AudioListener();
    camera.add(listener);
    
    // Create audio analyser for visualization
    audioAnalyser = new THREE.AudioAnalyser(listener, 32);
    
    sound = new THREE.Audio(listener);
    audioLoader = new THREE.AudioLoader();
    
    // Load the personal romantic music
    loadAudioTrack(CONFIG.assets.music);
}

function loadAudioTrack(url) {
    audioLoader.load(url, function(buffer) {
        sound.setBuffer(buffer);
        sound.setLoop(true);
        sound.setVolume(0.4); // Slightly higher volume for personal track
        audioData = audioAnalyser.getAverageFrequency();
        console.log('✅ Audio personal cargado: QUIERO-DECIRTE.mp3');
    }, function(progress) {
        console.log('Cargando audio...', Math.round(progress.loaded / progress.total * 100) + '%');
    }, function(error) {
        console.error('❌ Error al cargar el audio personal:', error);
        // Continue without audio
    });
}

function playMusic() {
    if (sound && sound.buffer && !sound.isPlaying) {
        sound.play();
        isAudioPlaying = true;
        window.isAudioPlaying = true;
        showAudioNotification();
    }
}

function stopMusic() {
    if (sound && sound.isPlaying) {
        sound.pause();
        isAudioPlaying = false;
        window.isAudioPlaying = false;
    }
}

function toggleMusic() {
    if (isAudioPlaying) {
        stopMusic();
    } else {
        playMusic();
    }
}

function showAudioNotification() {
    // Create subtle audio notification
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 80px;
        background: rgba(255, 215, 0, 0.1);
        border: 1px solid rgba(255, 215, 0, 0.3);
        color: var(--yellow-neon);
        padding: 10px 20px;
        border-radius: 20px;
        font-size: 0.9rem;
        z-index: 1000;
        backdrop-filter: blur(10px);
        transition: all 0.3s ease;
        white-space: nowrap;
    `;
    notification.textContent = '🎵 Quiere Decirte - Nuestra canción';
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.opacity = '0';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Remove loader after scene setup
window.onload = () => {
    console.log('🚀 Initializing scene...');
    
    try {
        createGalaxy();
        console.log('✅ Galaxy created');
        
        createFallingPetals();
        console.log('✅ Falling petals created');
        
        createMainFlowers();
        console.log('✅ Main flowers created');
        
        // Create multiple flowers with parallax layers
        let flowersCreated = 0;
        for (let i = 2; i < CONFIG.flowerCount; i++) {
            const size = ['small', 'medium', 'large'][Math.floor(Math.random() * 3)];
            const flower = createFlowerSprite(i, false, 'standard', size);
            if (flower) flowersCreated++;
        }
        console.log(`✅ Created ${flowersCreated} additional flowers`);
        
        initAudio();
        console.log('✅ Audio initialized');
        
        // Safety timeout to ensure loader is removed even if there are issues
        const safetyTimeout = setTimeout(() => {
            console.log('⚠️ Safety timeout reached, forcing loader removal');
            removeLoader();
        }, 5000);
        
        setTimeout(() => {
            clearTimeout(safetyTimeout);
            removeLoader();
        }, 1500);
        
    } catch (error) {
        console.error('❌ Error during scene initialization:', error);
        // Still remove loader even if there are errors
        setTimeout(removeLoader, 1000);
    }
};

function removeLoader() {
    console.log('🎬 Removing loader and starting animation...');
    const loader = document.querySelector('#loader');
    if (loader) {
        loader.style.opacity = '0';
        setTimeout(() => {
            loader.remove();
            console.log('✅ Loader removed successfully');
        }, 1000);
    }
    
    // Start audio on first interaction due to browser policy
    const startAudio = () => {
        playMusic();
        window.removeEventListener('click', startAudio);
        window.removeEventListener('touchstart', startAudio);
        window.removeEventListener('mousemove', startAudio);
    };
    
    window.addEventListener('click', startAudio);
    window.addEventListener('touchstart', startAudio);
    window.addEventListener('mousemove', startAudio);
    
    // Start animation loop
    animate();
}
