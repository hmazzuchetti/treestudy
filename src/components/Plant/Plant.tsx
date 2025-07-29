import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { useAppContext } from '../../hooks/useAppContext';
import AdvancedGrassField from './AdvancedGrassField';

// Advanced 3D grass ecosystem scene
const AdvancedEcosystemScene: React.FC<{ totalPoints: number }> = ({ totalPoints }) => {
  return (
    <>
      {/* Ambient lighting for natural look */}
      <ambientLight intensity={0.4} />
      <directionalLight 
        position={[5, 10, 5]} 
        intensity={0.8} 
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />

      {/* Grid helper for reference (can be removed in production) */}
      <gridHelper args={[10, 10]} visible={false} />
      
      {/* Advanced 3D grass field with organic growth */}
      <AdvancedGrassField
        totalPoints={totalPoints}
        maxGrassBlades={6000}
        fieldSize={8}
        grassHeight={1.0}
        windStrength={0.3}
        grassColorBase="#2d5a2d"
        grassColorTip="#4a7c59"
      />
    </>
  );
};

// Main Plant component - JERROMY's exact setup
const Plant: React.FC = () => {
  const { state } = useAppContext();
  return (
    <div className="relative w-full h-full">
      <Canvas
        camera={{
          position: [0, 1.5, 4], // JERROMY's exact camera position
          fov: 70 // JERROMY's exact FOV
        }}
        gl={{
          antialias: true
        }}
        className="w-full h-full"
      >
        <AdvancedEcosystemScene totalPoints={state.plant.totalPoints} />

        {/* JERROMY's exact OrbitControls setup */}
        <OrbitControls minDistance={2} maxDistance={40} />
      </Canvas>

      {/* Debug info */}
      <div className="absolute top-4 left-4 bg-black/20 backdrop-blur-sm rounded-lg p-3 text-white text-sm">
        <div>Points: {state.plant.totalPoints}</div>
        <div>
          Growth:{' '}
          {Math.floor(Math.min(state.plant.totalPoints / 1000, 1) * 100)}%
        </div>
        <div>3D Advanced Grass Field</div>
        <div>Grass Blades: {Math.floor((state.plant.totalPoints / 1000) * 6000)}</div>
      </div>
    </div>
  );
};

export default Plant;
