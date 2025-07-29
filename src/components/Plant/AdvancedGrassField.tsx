import React, { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Advanced vertex shader for 3D cone-shaped grass with organic growth
const advancedGrassVertexShader = `
attribute vec3 grassPosition;
attribute float grassId;
attribute float randomSeed;
attribute float spawnTime;

uniform float time;
uniform float totalPoints;
uniform float maxGrassBlades;
uniform float windStrength;

varying vec2 vUv;
varying vec3 vWorldPosition;
varying float vGrowthFactor;
varying float vWindEffect;

// Smooth growth curve function
float easeOutCubic(float t) {
    return 1.0 - pow(1.0 - t, 3.0);
}

// Perlin-style noise for natural variation
float noise(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
}

void main() {
    vUv = uv;
    
    // Calculate growth based on points and spawn timing
    float grassThreshold = grassId / maxGrassBlades;
    float pointProgress = totalPoints / 1000.0; // Full growth at 1000 points
    
    // Staggered growth - each grass blade starts growing at different point thresholds
    float growthStart = grassThreshold * 0.8; // Spread growth across 80% of point range
    float rawGrowth = max(0.0, (pointProgress - growthStart) / (1.0 - growthStart));
    
    // Apply easing curve for natural growth animation
    float growthFactor = easeOutCubic(rawGrowth);
    
    // Clamp growth factor so grass stops growing once it reaches target
    growthFactor = clamp(growthFactor, 0.0, 1.0);
    
    vGrowthFactor = growthFactor;
    
    // Create 3D cone-shaped grass blade
    vec3 grassPos = position;
    
    // Scale radius based on height (cone shape)
    float heightFactor = (uv.y + 1.0) * 0.5; // Convert -1,1 to 0,1
    float radiusScale = mix(0.8, 0.1, heightFactor); // Wide at bottom, narrow at top
    grassPos.x *= radiusScale;
    grassPos.z *= radiusScale;
    
    // Scale height by growth factor with smooth animation
    grassPos.y *= growthFactor;
    
    // Add natural variation in final height
    float heightVariation = noise(vec2(grassId * 0.01, randomSeed)) * 0.3 + 0.85;
    grassPos.y *= heightVariation;
    
    // Wind animation - only affects upper parts, base stays anchored
    float windTime = time * 0.002 + grassId * 0.05;
    float windEffect = sin(windTime) * cos(windTime * 1.7) * windStrength;
    
    // Enhanced quadratic falloff - only top 70% of grass affected by wind
    float windHeightFactor = max(0.0, (heightFactor - 0.3) / 0.7); // Start wind effect at 30% height
    windEffect *= windHeightFactor * windHeightFactor * windHeightFactor; // Cubic falloff for more anchored base
    
    grassPos.x += windEffect * 0.3;
    grassPos.z += windEffect * 0.2;
    vWindEffect = windEffect;
    
    // Rotate grass blade for natural variation
    float rotationAngle = randomSeed * 6.28318; // 0 to 2PI
    float cosR = cos(rotationAngle);
    float sinR = sin(rotationAngle);
    vec3 rotatedPos = vec3(
        grassPos.x * cosR - grassPos.z * sinR,
        grassPos.y,
        grassPos.x * sinR + grassPos.z * cosR
    );
    
    // Position in world space
    vec3 worldPosition = grassPosition + rotatedPos;
    vWorldPosition = worldPosition;
    
    // If not grown enough, hide the grass blade
    if (growthFactor < 0.01) {
        worldPosition = vec3(0.0, -100.0, 0.0); // Move far underground
    }
    
    gl_Position = projectionMatrix * modelViewMatrix * vec4(worldPosition, 1.0);
}
`;

// Advanced fragment shader with realistic grass coloring and lighting
const advancedGrassFragmentShader = `
precision mediump float;

varying vec2 vUv;
varying vec3 vWorldPosition;
varying float vGrowthFactor;
varying float vWindEffect;

uniform float time;
uniform vec3 sunDirection;
uniform vec3 grassColorBase;
uniform vec3 grassColorTip;

void main() {
    // Calculate lighting
    vec3 normal = normalize(cross(dFdx(vWorldPosition), dFdy(vWorldPosition)));
    float lightDot = max(0.2, dot(normal, sunDirection));
    
    // Create grass color gradient from base to tip
    float heightFactor = (vUv.y + 1.0) * 0.5;
    vec3 grassColor = mix(grassColorBase, grassColorTip, heightFactor);
    
    // Add subtle variation based on growth and wind
    float variation = sin(vGrowthFactor * 3.14159 + vWindEffect) * 0.1 + 1.0;
    grassColor *= variation;
    
    // Apply lighting
    grassColor *= lightDot;
    
    // Enhanced transparency - more transparent at tips, solid at base
    float heightTransparency = mix(0.9, 0.6, heightFactor); // More transparent at tips
    float edgeAlpha = 1.0 - abs(vUv.x) * 0.2; // Softer edge transparency
    
    // Combine growth, height, and edge transparency
    float alpha = vGrowthFactor * heightTransparency * edgeAlpha;
    
    gl_FragColor = vec4(grassColor, alpha);
}
`;

interface AdvancedGrassFieldProps {
  totalPoints?: number;
  maxGrassBlades?: number;
  fieldSize?: number;
  grassHeight?: number;
  windStrength?: number;
  grassColorBase?: string;
  grassColorTip?: string;
}

export const AdvancedGrassField: React.FC<AdvancedGrassFieldProps> = ({
  totalPoints = 0,
  maxGrassBlades = 5000,
  fieldSize = 8,
  grassHeight = 1.2,
  windStrength = 0.5,
  grassColorBase = '#4a7c4a',
  grassColorTip = '#7db87d'
}) => {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  // Create 3D cone-shaped grass blade geometry
  const grassGeometry = useMemo(() => {
    const segments = 8; // Circular segments for cone
    const heightSegments = 4; // Vertical segments
    
    const positions: number[] = [];
    const uvs: number[] = [];
    const indices: number[] = [];
    
    // Generate vertices for cone-shaped grass blade
    for (let i = 0; i <= heightSegments; i++) {
      const y = (i / heightSegments) * 2 - 1; // -1 to 1 (bottom to top)
      const radius = 1.0; // Will be scaled in vertex shader based on height
      
      for (let j = 0; j <= segments; j++) {
        const theta = (j / segments) * Math.PI * 2;
        const x = Math.cos(theta) * radius;
        const z = Math.sin(theta) * radius;
        
        positions.push(x * 0.1, y * grassHeight, z * 0.1);
        uvs.push(j / segments, (i / heightSegments));
      }
    }
    
    // Generate indices for triangles
    for (let i = 0; i < heightSegments; i++) {
      for (let j = 0; j < segments; j++) {
        const a = i * (segments + 1) + j;
        const b = a + segments + 1;
        const c = a + 1;
        const d = b + 1;
        
        indices.push(a, b, c);
        indices.push(b, d, c);
      }
    }
    
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
    geometry.setIndex(indices);
    geometry.computeVertexNormals();
    
    return geometry;
  }, [grassHeight]);

  // Generate instance data for grass blades with collision detection
  const instanceData = useMemo(() => {
    const positions: number[] = [];
    const grassIds: number[] = [];
    const randomSeeds: number[] = [];
    const spawnTimes: number[] = [];
    
    // Collision detection parameters
    const minDistance = 0.3; // Minimum distance between grass blades
    const maxAttempts = 50; // Maximum attempts to place each blade
    const placedPositions: { x: number; z: number }[] = [];
    
    // Helper function to check if position is valid (no collisions)
    const isValidPosition = (x: number, z: number): boolean => {
      // Check ground boundaries (leave some padding from edges)
      const padding = 0.5;
      if (Math.abs(x) > (fieldSize / 2 - padding) || Math.abs(z) > (fieldSize / 2 - padding)) {
        return false;
      }
      
      // Check collision with existing grass blades
      for (const pos of placedPositions) {
        const distance = Math.sqrt((x - pos.x) ** 2 + (z - pos.z) ** 2);
        if (distance < minDistance) {
          return false;
        }
      }
      return true;
    };
    
    for (let i = 0; i < maxGrassBlades; i++) {
      let placed = false;
      let attempts = 0;
      
      while (!placed && attempts < maxAttempts) {
        // Generate random position within field
        const x = (Math.random() - 0.5) * fieldSize;
        const z = (Math.random() - 0.5) * fieldSize;
        
        if (isValidPosition(x, z)) {
          const y = 0; // Ground level
          
          positions.push(x, y, z);
          grassIds.push(i);
          randomSeeds.push(Math.random());
          spawnTimes.push(Math.random() * 10); // Staggered spawn times
          
          placedPositions.push({ x, z });
          placed = true;
        }
        attempts++;
      }
      
      // If we couldn't place this blade after max attempts, skip it
      if (!placed) {
        break;
      }
    }
    
    return {
      positions: new Float32Array(positions),
      grassIds: new Float32Array(grassIds),
      randomSeeds: new Float32Array(randomSeeds),
      spawnTimes: new Float32Array(spawnTimes),
      actualCount: positions.length / 3 // Actual number of placed grass blades
    };
  }, [maxGrassBlades, fieldSize]);

  // Create shader material
  const grassMaterial = useMemo(() => {
    const baseColor = new THREE.Color(grassColorBase);
    const tipColor = new THREE.Color(grassColorTip);
    
    return new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        totalPoints: { value: totalPoints },
        maxGrassBlades: { value: maxGrassBlades },
        windStrength: { value: windStrength },
        sunDirection: { value: new THREE.Vector3(0.5, 1, 0.3).normalize() },
        grassColorBase: { value: baseColor },
        grassColorTip: { value: tipColor }
      },
      vertexShader: advancedGrassVertexShader,
      fragmentShader: advancedGrassFragmentShader,
      transparent: true,
      side: THREE.DoubleSide,
      depthWrite: false
    });
  }, [totalPoints, maxGrassBlades, windStrength, grassColorBase, grassColorTip]);

  // Set up instanced mesh
  useEffect(() => {
    if (meshRef.current) {
      const mesh = meshRef.current;
      
      // Set instance attributes
      mesh.geometry.setAttribute(
        'grassPosition',
        new THREE.InstancedBufferAttribute(instanceData.positions, 3)
      );
      mesh.geometry.setAttribute(
        'grassId',
        new THREE.InstancedBufferAttribute(instanceData.grassIds, 1)
      );
      mesh.geometry.setAttribute(
        'randomSeed',
        new THREE.InstancedBufferAttribute(instanceData.randomSeeds, 1)
      );
      mesh.geometry.setAttribute(
        'spawnTime',
        new THREE.InstancedBufferAttribute(instanceData.spawnTimes, 1)
      );
      
      mesh.count = instanceData.actualCount || maxGrassBlades;
    }
  }, [instanceData, maxGrassBlades]);

  // Animation loop
  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.time.value = state.clock.elapsedTime * 1000;
      materialRef.current.uniforms.totalPoints.value = totalPoints;
    }
  });

  return (
    <group>
      {/* Ground plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
        <planeGeometry args={[fieldSize * 1.5, fieldSize * 1.5]} />
        <meshBasicMaterial color="#1a4d2e" />
      </mesh>
      
      {/* Advanced 3D grass field */}
      <instancedMesh
        ref={meshRef}
        args={[grassGeometry, grassMaterial, maxGrassBlades]}
        material={grassMaterial}
        frustumCulled={false}
      >
        <primitive object={grassMaterial} ref={materialRef} attach="material" />
      </instancedMesh>
    </group>
  );
};

export default AdvancedGrassField;