import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface ThreeAiCoreProps {
  isProcessing?: boolean;
  reducedMotion?: boolean;
  size?: number;
}

export const ThreeAiCore: React.FC<ThreeAiCoreProps> = ({
  isProcessing = false,
  reducedMotion = false,
  size = 280
}) => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 1000);
    camera.position.z = 5.5;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(size, size);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mountRef.current.appendChild(renderer.domElement);

    // Central Neural Core Sphere
    const coreGeometry = new THREE.IcosahedronGeometry(1.2, 3);
    const coreMaterial = new THREE.MeshBasicMaterial({
      color: 0x00D2FF,
      wireframe: true,
      transparent: true,
      opacity: 0.75
    });
    const coreMesh = new THREE.Mesh(coreGeometry, coreMaterial);
    scene.add(coreMesh);

    // Inner Glowing Particle Sphere
    const innerGeometry = new THREE.SphereGeometry(0.8, 16, 16);
    const innerMaterial = new THREE.MeshBasicMaterial({
      color: 0x3B82F6,
      transparent: true,
      opacity: 0.35
    });
    const innerMesh = new THREE.Mesh(innerGeometry, innerMaterial);
    scene.add(innerMesh);

    // Orbiting Nodes (Vision, Voice, Security, Privacy, Agents)
    const nodeColors = [0x00D2FF, 0x3B82F6, 0x10B981, 0x8B5CF6, 0xF59E0B];
    const orbitingNodes: THREE.Mesh[] = [];
    const orbitRadius = 2.0;

    for (let i = 0; i < 5; i++) {
      const nodeGeom = new THREE.SphereGeometry(0.12, 12, 12);
      const nodeMat = new THREE.MeshBasicMaterial({ color: nodeColors[i] });
      const node = new THREE.Mesh(nodeGeom, nodeMat);
      orbitingNodes.push(node);
      scene.add(node);
    }

    // Outer Halo Ring
    const ringGeometry = new THREE.RingGeometry(2.1, 2.14, 64);
    const ringMaterial = new THREE.MeshBasicMaterial({
      color: 0x00D2FF,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.2
    });
    const ringMesh = new THREE.Mesh(ringGeometry, ringMaterial);
    ringMesh.rotation.x = Math.PI / 2.5;
    scene.add(ringMesh);

    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const delta = clock.getElapsedTime();

      if (!reducedMotion) {
        const speedMultiplier = isProcessing ? 2.5 : 0.8;

        // Core Rotation & Breathing
        coreMesh.rotation.x = delta * 0.2 * speedMultiplier;
        coreMesh.rotation.y = delta * 0.3 * speedMultiplier;
        const scale = 1.0 + Math.sin(delta * 2.0) * (isProcessing ? 0.12 : 0.04);
        coreMesh.scale.set(scale, scale, scale);

        // Inner Sphere
        innerMesh.rotation.y = -delta * 0.4 * speedMultiplier;

        // Orbiting Nodes
        orbitingNodes.forEach((node, idx) => {
          const angle = delta * 0.7 * speedMultiplier + (idx * (Math.PI * 2) / 5);
          node.position.x = Math.cos(angle) * orbitRadius;
          node.position.z = Math.sin(angle) * orbitRadius;
          node.position.y = Math.sin(delta * 1.5 + idx) * 0.35;
        });

        ringMesh.rotation.z = delta * 0.15;
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [isProcessing, reducedMotion, size]);

  return (
    <div className="relative flex items-center justify-center">
      <div ref={mountRef} style={{ width: size, height: size }} />
      {/* Background radial aura */}
      <div 
        className="absolute pointer-events-none rounded-full blur-2xl transition-all duration-500"
        style={{
          width: size * 0.7,
          height: size * 0.7,
          background: isProcessing
            ? 'radial-gradient(circle, rgba(0,210,255,0.35) 0%, rgba(59,130,246,0.1) 70%, transparent 100%)'
            : 'radial-gradient(circle, rgba(0,210,255,0.15) 0%, rgba(59,130,246,0.05) 70%, transparent 100%)'
        }}
      />
    </div>
  );
};
