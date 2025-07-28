import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { useAppContext } from '../../hooks/useAppContext';
import JerromyGrassField from './JerromyGrassField';

// JERROMY's exact scene setup - copied from Grass_Basic/index.js
const JerromyScene: React.FC<{ totalPoints: number }> = ({ totalPoints }) => {
  return (
    <>
      {/* No background color - let it be default */}

      {/* Grid helper like in JERROMY's setup */}
      <gridHelper args={[10, 10]} />
      {/* JERROMY's modular grass field with configurable parameters */}
      <JerromyGrassField
        totalPoints={totalPoints}
        instances={8000}
        fieldWidth={8}
        fieldDepth={8}
        windSpeed={0.5}
        grassColor="#4a7c59"
        groundColor="#2d5a2d"
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
        <JerromyScene totalPoints={state.plant.totalPoints} />

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
        <div>JERROMY Grass Field</div>
      </div>
    </div>
  );
};

export default Plant;
