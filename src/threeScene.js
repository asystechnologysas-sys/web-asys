import * as THREE from 'three';

export function initHero3DScene(canvasContainerId) {
  const container = document.getElementById(canvasContainerId);
  if (!container) return;

  // Clear previous canvas if re-initialized
  container.innerHTML = '';

  // Scene setup
  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x060e20, 0.012);

  // Camera setup
  const camera = new THREE.PerspectiveCamera(
    55,
    container.clientWidth / container.clientHeight,
    0.1,
    1000
  );
  camera.position.set(0, 0, 16);

  // Renderer setup
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  container.appendChild(renderer.domElement);

  // Lighting
  const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
  scene.add(ambientLight);

  const mainLight = new THREE.DirectionalLight(0x2563eb, 3.5);
  mainLight.position.set(10, 15, 10);
  scene.add(mainLight);

  const cyanLight = new THREE.PointLight(0x06b6d4, 4, 30);
  cyanLight.position.set(-10, -8, 8);
  scene.add(cyanLight);

  const topLight = new THREE.PointLight(0xffffff, 2, 20);
  topLight.position.set(0, 10, 5);
  scene.add(topLight);

  // Main 3D Automation Sphere Core Group
  const mainGroup = new THREE.Group();
  scene.add(mainGroup);

  // 1. Central Metallic AI Crystal Core (Icosahedron + Wireframe Frame)
  const coreGeo = new THREE.IcosahedronGeometry(3.2, 1);
  const coreMat = new THREE.MeshStandardMaterial({
    color: 0x1d4ed8,
    metalness: 0.9,
    roughness: 0.15,
    wireframe: false,
    emissive: 0x1e40af,
    emissiveIntensity: 0.4
  });
  const coreMesh = new THREE.Mesh(coreGeo, coreMat);
  mainGroup.add(coreMesh);

  // Outer Glowing Wireframe Cage
  const wireGeo = new THREE.IcosahedronGeometry(3.6, 2);
  const wireMat = new THREE.MeshBasicMaterial({
    color: 0x60a5fa,
    wireframe: true,
    transparent: true,
    opacity: 0.4
  });
  const wireFrame = new THREE.Mesh(wireGeo, wireMat);
  mainGroup.add(wireFrame);

  // Inner Core Glow Sphere
  const innerGeo = new THREE.SphereGeometry(2.0, 32, 32);
  const innerMat = new THREE.MeshBasicMaterial({
    color: 0x38bdf8,
    transparent: true,
    opacity: 0.7
  });
  const innerCore = new THREE.Mesh(innerGeo, innerMat);
  mainGroup.add(innerCore);

  // 2. Concentric Orbital Energy Rings (Automation Workflows)
  const ringGroup = new THREE.Group();
  mainGroup.add(ringGroup);

  const createRing = (radius, tube, color, rotX, rotY) => {
    const ringGeo = new THREE.TorusGeometry(radius, tube, 16, 120);
    const ringMat = new THREE.MeshStandardMaterial({
      color: color,
      metalness: 0.95,
      roughness: 0.1,
      emissive: color,
      emissiveIntensity: 0.5
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = rotX;
    ring.rotation.y = rotY;
    ringGroup.add(ring);
    return ring;
  };

  const ring1 = createRing(5.0, 0.07, 0x2563eb, Math.PI / 3, Math.PI / 6);
  const ring2 = createRing(6.5, 0.05, 0x0284c7, -Math.PI / 4, Math.PI / 3);
  const ring3 = createRing(7.8, 0.04, 0x38bdf8, Math.PI / 2, 0);

  // 3. Floating 3D Automation Satellite Nodes
  const nodeCount = 32;
  const nodes = [];

  const cubeGeo = new THREE.BoxGeometry(0.6, 0.6, 0.6);
  const octaGeo = new THREE.OctahedronGeometry(0.5);

  const nodeMaterial = new THREE.MeshStandardMaterial({
    color: 0x38bdf8,
    metalness: 0.9,
    roughness: 0.2,
    emissive: 0x1d4ed8,
    emissiveIntensity: 0.4
  });

  for (let i = 0; i < nodeCount; i++) {
    const isCube = i % 2 === 0;
    const mesh = new THREE.Mesh(isCube ? cubeGeo : octaGeo, nodeMaterial.clone());

    const phi = Math.acos(-1 + (2 * i) / nodeCount);
    const theta = Math.sqrt(nodeCount * Math.PI) * phi;
    const radius = 6.0 + Math.random() * 3.5;

    mesh.position.x = radius * Math.cos(theta) * Math.sin(phi);
    mesh.position.y = radius * Math.sin(theta) * Math.sin(phi);
    mesh.position.z = radius * Math.cos(phi);

    mesh.rotation.x = Math.random() * Math.PI;
    mesh.rotation.y = Math.random() * Math.PI;

    mesh.userData = {
      speedX: (Math.random() - 0.5) * 0.008,
      speedY: (Math.random() - 0.5) * 0.008,
      initialPos: mesh.position.clone()
    };

    mainGroup.add(mesh);
    nodes.push(mesh);
  }

  // 4. Connecting Laser Synapse Lines
  const lineGeo = new THREE.BufferGeometry();
  const lineMat = new THREE.LineBasicMaterial({
    color: 0x38bdf8,
    transparent: true,
    opacity: 0.3
  });

  const linesMesh = new THREE.LineSegments(lineGeo, lineMat);
  mainGroup.add(linesMesh);

  function updateLines() {
    const posArray = [];
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dist = nodes[i].position.distanceTo(nodes[j].position);
        if (dist < 5.8) {
          posArray.push(
            nodes[i].position.x, nodes[i].position.y, nodes[i].position.z,
            nodes[j].position.x, nodes[j].position.y, nodes[j].position.z
          );
        }
      }
    }
    lineGeo.setAttribute('position', new THREE.Float32BufferAttribute(posArray, 3));
  }

  // 5. Ambient Glowing Particles
  const particleCount = 350;
  const particleGeo = new THREE.BufferGeometry();
  const particlePositions = new Float32Array(particleCount * 3);

  for (let i = 0; i < particleCount * 3; i += 3) {
    particlePositions[i] = (Math.random() - 0.5) * 50;
    particlePositions[i + 1] = (Math.random() - 0.5) * 50;
    particlePositions[i + 2] = (Math.random() - 0.5) * 50;
  }

  particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));

  const particleMat = new THREE.PointsMaterial({
    color: 0x93c5fd,
    size: 0.12,
    transparent: true,
    opacity: 0.6,
    blending: THREE.AdditiveBlending
  });

  const particleSystem = new THREE.Points(particleGeo, particleMat);
  scene.add(particleSystem);

  // Mouse Interactivity
  let mouseX = 0;
  let mouseY = 0;
  let targetX = 0;
  let targetY = 0;

  const windowHalfX = window.innerWidth / 2;
  const windowHalfY = window.innerHeight / 2;

  const onMouseMove = (event) => {
    mouseX = (event.clientX - windowHalfX) * 0.0012;
    mouseY = (event.clientY - windowHalfY) * 0.0012;
  };

  window.addEventListener('mousemove', onMouseMove, false);

  // Resize Handler
  const onWindowResize = () => {
    if (!container) return;
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
  };

  window.addEventListener('resize', onWindowResize, false);

  // Animation Loop
  let clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);
    const elapsedTime = clock.getElapsedTime();

    // Smooth mouse damping
    targetX += (mouseX - targetX) * 0.05;
    targetY += (mouseY - targetY) * 0.05;

    mainGroup.rotation.y = targetX * 1.4 + elapsedTime * 0.12;
    mainGroup.rotation.x = targetY * 1.4 + Math.sin(elapsedTime * 0.2) * 0.08;

    coreMesh.rotation.x = elapsedTime * 0.2;
    coreMesh.rotation.y = elapsedTime * 0.3;
    wireFrame.rotation.x = -elapsedTime * 0.15;
    wireFrame.rotation.y = -elapsedTime * 0.25;

    innerCore.scale.setScalar(1 + Math.sin(elapsedTime * 2.5) * 0.06);

    ring1.rotation.z = elapsedTime * 0.35;
    ring2.rotation.z = -elapsedTime * 0.25;
    ring3.rotation.y = elapsedTime * 0.2;

    nodes.forEach((node, index) => {
      node.rotation.x += 0.012;
      node.rotation.y += 0.015;
      node.position.y = node.userData.initialPos.y + Math.sin(elapsedTime * 1.5 + index) * 0.25;
    });

    updateLines();

    particleSystem.rotation.y = elapsedTime * 0.025;

    renderer.render(scene, camera);
  }

  animate();
}
