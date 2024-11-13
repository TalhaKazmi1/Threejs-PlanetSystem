'use client'
import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/Addons.js';
import { Points, PointsMaterial, SphereGeometry, TextureLoader, Vector3 } from 'three';

const Globe: React.FC = () => {
    const mountRef = useRef<HTMLDivElement>(null);
  
    useEffect(() => {
      if (!mountRef.current) return;
  
      // Scene
      const scene = new THREE.Scene();
  
      // Camera
      const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
      camera.position.z = 5;
  
      // Renderer
      const renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setSize(window.innerWidth, window.innerHeight);
      mountRef.current.appendChild(renderer.domElement);
  
      // Orbit controls
      const controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true; // Enable damping (inertia)
      controls.dampingFactor = 0.05; // Damping factor
      controls.enablePan = false; // Disable panning
      controls.minDistance = 1.5; // Minimum zoom distance
      controls.maxDistance = 10; // Maximum zoom distance
  
      // Texture loader
      const textureLoader = new THREE.TextureLoader();
      const dayTexture = textureLoader.load('/earth_day.png');
      const nightTexture = textureLoader.load('/earth_night.webp');
  
      // Sphere geometry
      const geometry = new THREE.SphereGeometry(1, 32, 32);
      const material = new THREE.MeshPhongMaterial({
        map: dayTexture,
        emissiveMap: nightTexture,
        emissiveIntensity: 1.0, // Increase the intensity for better visibility
        emissive: new THREE.Color(0x000000),
      });
      const sphere = new THREE.Mesh(geometry, material);
      scene.add(sphere);
  
      // Lighting
      const ambientLight = new THREE.AmbientLight(0x333333, 0.6);
      scene.add(ambientLight);
  
      const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
      directionalLight.position.set(5, 3, 5);
      scene.add(directionalLight);
  
      // Particles
      const particlesGeometry = new THREE.BufferGeometry();
      const particlesCount = 5000;
      const positions = new Float32Array(particlesCount * 3);
  
      for (let i = 0; i < particlesCount * 3; i++) {
        positions[i] = (Math.random() - 0.5) * 10;
      }
  
      particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  
      const particlesMaterial = new THREE.PointsMaterial({
        color: 0x888888,
        size: 0.05,
        sizeAttenuation: true,
      });
  
      const particles = new THREE.Points(particlesGeometry, particlesMaterial);
      scene.add(particles);
  
      // Animation loop
      const animate = () => {
        requestAnimationFrame(animate);
        sphere.rotation.y += 0.001; // Slow rotation for night-day cycle
        controls.update(); // Update controls
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
  

export default Globe;
