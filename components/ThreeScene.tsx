'use client';
import React, { useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { GLTF } from 'three/examples/jsm/Addons.js';

// Extend GLTF loader to avoid TypeScript errors
type GLTFResult = GLTF & {
  nodes: { [key: string]: THREE.Object3D };
  materials: { [key: string]: THREE.Material };
};

const ArmyCharacter: React.FC = () => {
  const group = useRef<THREE.Group>(null!);
  const { scene, animations } = useGLTF('/skeleton.glb') as unknown as GLTFResult;

  const mixer = useRef<THREE.AnimationMixer>();

  useEffect(() => {
    if (animations && group.current) {
      mixer.current = new THREE.AnimationMixer(group.current);

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

const ThreeScene: React.FC = () => {
  return (
    <Canvas camera={{ position: [0, 2, 5], fov: 50 }}>
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} />
      <OrbitControls />
      <ArmyCharacter />
    </Canvas>
  );
};

export default ThreeScene;
