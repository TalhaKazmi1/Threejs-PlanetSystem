'use client'
import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { OrbitControls } from 'three/examples/jsm/Addons.js';

const SolarSystem: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene
    const scene = new THREE.Scene();

    // Camera
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 25;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    mountRef.current.appendChild(renderer.domElement);

    // Orbit controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.enablePan = false;
    controls.minDistance = 5;
    controls.maxDistance = 50;

    // Texture loader
    const textureLoader = new THREE.TextureLoader();

    // Sun
    const sunGeometry = new THREE.SphereGeometry(2, 32, 32);
    const sunMaterial = new THREE.MeshBasicMaterial({ map: textureLoader.load('/sun1.jpg') });
    const sun = new THREE.Mesh(sunGeometry, sunMaterial);
    scene.add(sun);

    // Planets
    const planets = [
      { name: 'Mercury', size: 0.5, distance: 3, texture: '/mercury.jpg' },
      { name: 'Venus', size: 0.8, distance: 5, texture: '/venus1.jpg' },
      { name: 'Earth', size: 1, distance: 7, texture: '/earth.jpg' },
      { name: 'Mars', size: 0.6, distance: 9, texture: '/mars1.jpg' },
      { name: 'Jupiter', size: 1.5, distance: 12, texture: '/jupiter1.jpg' },
      { name: 'Saturn', size: 1.2, distance: 15, texture: '/saturn1.jpg' },
      { name: 'Uranus', size: 1, distance: 18, texture: '/uranus1.jpg' },
      { name: 'Neptune', size: 1, distance: 21, texture: '/neptune1.jpg' },
    ];

    const planetMeshes: THREE.Mesh[] = planets.map(planet => {
      const geometry = new THREE.SphereGeometry(planet.size, 32, 32);
      const material = new THREE.MeshStandardMaterial({
        map: textureLoader.load(planet.texture),
        emissive: 0x222222,
        emissiveIntensity: 0.5,
      });
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.x = planet.distance;
      scene.add(mesh);
      return mesh;
    });

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 10); // Soft white light
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xffffff, 10, 100);
    pointLight.position.set(0, 0, 0); // Position the point light at the center (Sun)
    scene.add(pointLight);

    // Create star field
    const starGeometry = new THREE.BufferGeometry();
    const starMaterial = new THREE.PointsMaterial({ color: 0x888888 });

    const starVertices = [];
    for (let i = 0; i < 10000; i++) {
      const x = THREE.MathUtils.randFloatSpread(2000);
      const y = THREE.MathUtils.randFloatSpread(2000);
      const z = THREE.MathUtils.randFloatSpread(2000);

      starVertices.push(x, y, z);
    }

    starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));

    const stars = new THREE.Points(starGeometry, starMaterial);
    scene.add(stars);

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);

      // Rotate planets around the Sun
      planetMeshes.forEach((mesh, index) => {
        const planet = planets[index];
        const time = Date.now() * 0.0001;
        mesh.position.x = planet.distance * Math.cos(time * (index + 1));
        mesh.position.z = planet.distance * Math.sin(time * (index + 1));
        mesh.rotation.y += 0.01; // Rotate the planet itself
      });

      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // Handle window resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    // Clean up on unmount
    return () => {
      mountRef.current?.removeChild(renderer.domElement);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return <div ref={mountRef} style={{ width: '100%', height: '100vh' }} />;
};

export default SolarSystem;
