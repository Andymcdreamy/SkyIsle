import React from 'react';
import { BUILDINGS } from '../constants';
import Building from './Building';

interface IslandProps {
  selectedId: string | null;
  onSelectBuilding: (id: string) => void;
}

const Island: React.FC<IslandProps> = ({ selectedId, onSelectBuilding }) => {
  return (
    <group>
      {/* Main Island Base */}
      <mesh position={[0, -2, 0]}>
        {/* Using a Cone for the floating island look, flattened and inverted usually, but here a simple hemisphere/cone hybrid */}
        <cylinderGeometry args={[12, 4, 6, 7]} /> 
        <meshStandardMaterial color="#4B5563" roughness={1} />
      </mesh>
      
      {/* Grass Top */}
      <mesh position={[0, 1.01, 0]} rotation={[-Math.PI/2, 0, 0]}>
         <circleGeometry args={[12, 7]} />
         <meshStandardMaterial color="#10B981" roughness={0.8} />
      </mesh>

      {/* Rough bottom detail */}
      <mesh position={[0, -5, 0]} rotation={[0, 0, Math.PI]}>
        <coneGeometry args={[4, 5, 5]} />
        <meshStandardMaterial color="#374151" roughness={1} />
      </mesh>

      {/* Buildings */}
      {BUILDINGS.map((building) => (
        <Building
          key={building.id}
          data={building}
          isSelected={selectedId === building.id}
          onSelect={onSelectBuilding}
        />
      ))}

      {/* Simple decorative low-poly trees/rocks */}
      <mesh position={[6, 1.5, 2]}>
         <dodecahedronGeometry args={[0.5]} />
         <meshStandardMaterial color="#6B7280" />
      </mesh>
      <mesh position={[-6, 1.5, -2]}>
         <coneGeometry args={[0.8, 2, 4]} />
         <meshStandardMaterial color="#059669" />
      </mesh>
      <mesh position={[-6, 0.5, -2]}>
         <cylinderGeometry args={[0.2, 0.2, 0.5]} />
         <meshStandardMaterial color="#3E2723" />
      </mesh>
    </group>
  );
};

export default Island;