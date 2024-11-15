'use client';
import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { OrbitControls, useGLTF, useTexture } from '@react-three/drei';
import { Canvas, useFrame } from '@react-three/fiber';
import { GLTF } from 'three/examples/jsm/Addons.js';

// Extend GLTF loader to avoid TypeScript errors
type GLTFResult = GLTF & {
  nodes: { [key: string]: THREE.Object3D };
  materials: { [key: string]: THREE.Material };
};

const FireParticles: React.FC = () => {
  const particles = useRef<THREE.Points>(null);

  useEffect(() => {
    const particleCount = 10000;
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesMaterial = new THREE.PointsMaterial({
      color: new THREE.Color(0xff0000), // Fire red color
      size: 0.5,
      blending: THREE.AdditiveBlending,
      transparent: true,
      opacity: 0.8,
    });

    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 200;
      positions[i * 3 + 1] = Math.random() * 10;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 200;
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);

    if (particles.current) {
      particles.current.add(particlesMesh);
    }

    return () => {
      particlesGeometry.dispose();
      particlesMaterial.dispose();
    };
  }, []);

  useFrame(({ clock }) => {
    if (particles.current) {
      particles.current.rotation.y = clock.getElapsedTime() * 0.05;
    }
  });

  return <primitive ref={particles} object={new THREE.Object3D()} />;
};

const ArmyCharacter: React.FC = () => {
  const group = useRef<THREE.Group>(null!);
  const { scene, animations } = useGLTF('/skeleton.glb') as unknown as GLTFResult;

  const mixer = useRef<THREE.AnimationMixer>();

  useEffect(() => {
    if (animations && group.current) {
      mixer.current = new THREE.AnimationMixer(group.current);
      group.current.position.set(0, 0, 0);
      group.current.position.y = -0.5;

      // Find the walking animation clip by name
      const walkAnimation = animations.find((clip) => clip.name === 'Walk Cycle');
      if (walkAnimation) {
        const action = mixer.current.clipAction(walkAnimation);
        action.play();
      } else {
        console.warn('Walking animation not found');
      }
    }
  }, [animations]);

  useFrame((state, delta) => {
    if (mixer.current) mixer.current.update(delta);
  });

  return <primitive ref={group} object={scene} />;
};

const BackgroundTexture: React.FC = () => {
  const backgroundTexture = useTexture('/ghost.jpg'); // Load the background texture

  return null; // This component doesn't need to render anything
};

const ThreeScene: React.FC = () => {
  return (
    <Canvas
      camera={{ position: [0, 2, 5], fov: 50 }}
      onCreated={({ scene }) => {
        // Set the background texture for the scene
        const backgroundTexture = new THREE.TextureLoader().load('/red-fire.jpg');
        scene.background = backgroundTexture;
        scene.fog = new THREE.FogExp2(0xff4500, 0.1); // Fog for a fiery effect
      }}
    >
      <ambientLight intensity={0.4} />
      <pointLight position={[5, 5, 5]} intensity={2} color={new THREE.Color(0xff8c00)} />
      <pointLight position={[-5, -5, -5]} intensity={1.5} color={new THREE.Color(0xff4500)} />
      <OrbitControls />
      <FireParticles />
      <ArmyCharacter />
      <BackgroundTexture /> {/* Include the background texture component here */}
    </Canvas>
  );
};

export default ThreeScene;
