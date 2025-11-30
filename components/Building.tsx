import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Mesh, Color } from 'three';
import { BuildingData, BuildingType } from '../types';

interface BuildingProps {
  data: BuildingData;
  isSelected: boolean;
  onSelect: (id: string) => void;
}

const Building: React.FC<BuildingProps> = ({ data, isSelected, onSelect }) => {
  const meshRef = useRef<Mesh>(null);
  const [hovered, setHover] = useState(false);

  // Simple animation for hovering/selection
  useFrame((state, delta) => {
    if (meshRef.current) {
      // Bobbing animation
      meshRef.current.position.y = data.position[1] + Math.sin(state.clock.elapsedTime * 2 + parseInt(data.id, 16)) * 0.1;
      
      // Rotate if selected
      if (isSelected) {
        meshRef.current.rotation.y += delta * 1.5;
      } else {
        // Reset rotation slowly or set to fixed
         meshRef.current.rotation.y = data.rotation ? data.rotation[1] : 0;
      }
    }
  });

  const color = isSelected ? '#ffffff' : (hovered ? new Color(data.color).offsetHSL(0, 0, 0.2).getStyle() : data.color);

  const renderGeometry = () => {
    switch (data.type) {
      case BuildingType.TOWER:
        return (
          <group>
            {/* Main Spire */}
            <mesh position={[0, 0, 0]}>
              <cylinderGeometry args={[0.2, 0.8, 3, 6]} />
              <meshStandardMaterial color={color} roughness={0.3} metalness={0.8} />
            </mesh>
            {/* Ring */}
            <mesh position={[0, 1, 0]}>
              <torusGeometry args={[0.6, 0.1, 8, 20]} />
              <meshStandardMaterial color="#FFD700" emissive="#FFD700" emissiveIntensity={0.5} />
            </mesh>
          </group>
        );
      case BuildingType.DOMES:
        return (
          <group>
            <mesh position={[0, -0.2, 0]}>
              <sphereGeometry args={[1, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
              <meshStandardMaterial color={color} opacity={0.6} transparent roughness={0.1} />
            </mesh>
            <mesh position={[0.8, -0.5, 0.5]}>
              <sphereGeometry args={[0.6, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
              <meshStandardMaterial color={color} opacity={0.6} transparent roughness={0.1} />
            </mesh>
            {/* Base */}
            <mesh position={[0, -0.3, 0]}>
              <cylinderGeometry args={[1.1, 1.1, 0.2, 16]} />
              <meshStandardMaterial color="#555" />
            </mesh>
          </group>
        );
      case BuildingType.FACTORY:
        return (
          <group>
            <mesh position={[0, 0, 0]}>
              <boxGeometry args={[2, 1.5, 1.5]} />
              <meshStandardMaterial color={color} roughness={0.7} />
            </mesh>
            {/* Smokestacks */}
            <mesh position={[-0.5, 1, -0.3]}>
              <cylinderGeometry args={[0.15, 0.2, 1, 8]} />
              <meshStandardMaterial color="#333" />
            </mesh>
            <mesh position={[0.5, 0.9, 0.3]}>
              <cylinderGeometry args={[0.15, 0.2, 0.8, 8]} />
              <meshStandardMaterial color="#333" />
            </mesh>
          </group>
        );
      case BuildingType.PORT:
        return (
          <group>
            <mesh position={[0, 0, 0]}>
               <boxGeometry args={[2.5, 0.2, 1.5]} />
               <meshStandardMaterial color="#333" />
            </mesh>
            <mesh position={[0, 0.2, 0]}>
              <cylinderGeometry args={[1, 1, 0.1, 6]} />
              <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.2} />
            </mesh>
            {/* Lights */}
            <mesh position={[1, 0.2, 0.6]}>
              <sphereGeometry args={[0.1]} />
              <meshBasicMaterial color="red" />
            </mesh>
            <mesh position={[-1, 0.2, -0.6]}>
              <sphereGeometry args={[0.1]} />
              <meshBasicMaterial color="green" />
            </mesh>
          </group>
        );
      case BuildingType.HUB:
      default:
        return (
          <group>
             <mesh>
               <dodecahedronGeometry args={[1]} />
               <meshStandardMaterial color={color} metalness={0.9} roughness={0.1} />
             </mesh>
             <mesh scale={[1.2, 1.2, 1.2]}>
               <icosahedronGeometry args={[0.8, 0]} />
               <meshStandardMaterial color="#444" wireframe />
             </mesh>
          </group>
        );
    }
  };

  return (
    <group 
      position={data.position} 
      scale={data.scale}
      rotation={data.rotation ? [data.rotation[0], data.rotation[1], data.rotation[2]] : [0,0,0]}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(data.id);
      }}
      onPointerOver={() => {
        document.body.style.cursor = 'pointer';
        setHover(true);
      }}
      onPointerOut={() => {
        document.body.style.cursor = 'auto';
        setHover(false);
      }}
    >
      {renderGeometry()}
      {/* Selection Ring */}
      {isSelected && (
        <mesh position={[0, -0.8, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[1.5, 1.6, 32]} />
          <meshBasicMaterial color="#ffffff" opacity={0.5} transparent />
        </mesh>
      )}
    </group>
  );
};

export default Building;