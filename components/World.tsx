import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars, Float } from '@react-three/drei';
import Island from './Island';
import SoundController from './SoundController';

interface WorldProps {
  selectedId: string | null;
  onSelectBuilding: (id: string) => void;
}

const World: React.FC<WorldProps> = ({ selectedId, onSelectBuilding }) => {
  return (
    <div className="w-full h-full absolute inset-0 z-0">
      <Canvas shadows camera={{ position: [15, 10, 15], fov: 45 }}>
        <color attach="background" args={['#050510']} />

        {/* Audio Manager for Ambience and SFX */}
        <SoundController selectedId={selectedId} />

        {/* Atmospheric Lighting */}
        <ambientLight intensity={0.3} color="#ccccff" />
        <directionalLight
          position={[10, 20, 10]}
          intensity={1.5}
          castShadow
          color="#ffeedd"
        />
        <pointLight position={[-10, 5, -10]} intensity={0.5} color="#00ffcc" />

        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />

        {/* Floating Animation for the whole island */}
        <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
          <Island selectedId={selectedId} onSelectBuilding={onSelectBuilding} />
        </Float>

        <OrbitControls
          enablePan={false}
          minDistance={10}
          maxDistance={40}
          maxPolarAngle={Math.PI / 2} // Don't allow going under the island too much
          autoRotate={!selectedId} // Auto rotate if nothing selected
          autoRotateSpeed={0.5}
          dampingFactor={0.05}
        />
      </Canvas>
    </div>
  );
};

export default World;
