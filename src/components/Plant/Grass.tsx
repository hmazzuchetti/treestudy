import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Grass vertex shader inspired by JERROMY's implementation
const grassVertexShader = `
uniform mat4 projectionMatrix;
uniform mat4 modelViewMatrix;
uniform mat4 viewMatrix;
uniform mat4 modelMatrix;

attribute vec3 position;
attribute vec3 terrPosi;
attribute vec2 uv;
attribute float angle;
attribute float instanceId;

uniform float time;
uniform float growthProgress;
uniform float totalInstances;

varying vec2 vUv;
varying vec3 vPosition;
varying float vAngle;

vec4 quat_from_axis_angle(vec3 axis, float angle){ 
    vec4 qr;
    float half_angle = (angle * 0.5) * 3.14159 / 180.0;
    qr.x = axis.x * sin(half_angle);
    qr.y = axis.y * sin(half_angle);
    qr.z = axis.z * sin(half_angle);
    qr.w = cos(half_angle);
    return qr;
}

vec3 rotate_vertex_position(vec3 position, vec3 axis, float angle){
    vec4 q = quat_from_axis_angle(axis, angle);
    vec3 v = position.xyz;
    return v + 2.0 * cross(q.xyz, cross(q.xyz, v) + q.w * v);
}

void main() {
    vUv = uv;
    vAngle = angle;

    vec3 upDir = vec3(0.0, 1.0, 0.0);    vec3 finalPosi = position;
    finalPosi.x *= 0.1; // Make grass blade thin
    finalPosi.y *= 1.0; // Keep full height
    
    // Grass should extend upward from the ground, not horizontally
    // The Y axis should represent the height of the grass blade
    if (finalPosi.y < 0.0) {
        finalPosi.y = 0.0; // Bottom of grass blade at ground level
    }// Growth animation - grass blades grow gradually based on instanceId and growthProgress
    float grassThreshold = instanceId / totalInstances; // Normalize instanceId to 0-1
    float grassGrowth = smoothstep(grassThreshold - 0.1, grassThreshold + 0.1, growthProgress);
    
    // Scale height by growth factor with smooth animation
    finalPosi.y *= grassGrowth;
    
    // If not yet grown, make it invisible by scaling to zero
    if (grassGrowth < 0.01) {
        finalPosi *= 0.0;
    }

    finalPosi = rotate_vertex_position(finalPosi, upDir, vAngle);    // Wind animation - only affect upper part of grass
    if(finalPosi.y > 0.5) {
        finalPosi.x = (finalPosi.x + sin(time / 1000.0 * (vAngle * 0.01)) * 0.08);
        finalPosi.z = (finalPosi.z + cos(time / 1000.0 * (vAngle * 0.01)) * 0.08);
    }
    
    finalPosi = terrPosi + finalPosi;
    
    vec4 posi = vec4(finalPosi, 1.0);
    vec4 mPosi = modelViewMatrix * posi;
    
    gl_Position = projectionMatrix * mPosi;
}
`;

// Grass fragment shader - improved for darker environment
const grassFragmentShader = `
precision mediump float;

varying vec2 vUv;
varying vec3 vPosition;
varying float vAngle;

uniform sampler2D grassMaskTex;
uniform sampler2D grassDiffTex;
uniform float time;

void main() {
    vec3 grassMaskColor = texture2D(grassMaskTex, vUv).rgb;
    vec3 grassColor = texture2D(grassDiffTex, vUv).rgb;
    
    // Add more variation and brightness for contrast
    float variation = sin(vAngle * 0.1 + time * 0.001) * 0.15 + 1.0;
    float heightVariation = vUv.y * 0.3 + 0.7; // Lighter towards top
    grassColor *= variation * heightVariation;
    
    // Add slight brightness boost for darker environment
    grassColor = pow(grassColor, vec3(0.9));
    
    gl_FragColor = vec4(grassColor, 1.0);

    // Discard transparent parts using mask
    if(grassMaskColor.r <= 0.1) {
        discard;
    }
}
`;

interface GrassProps {
  instances?: number;
  width?: number;
  depth?: number;
  height?: number;
  totalPoints?: number;
  terrainBounds?: {
    minX: number;
    maxX: number;
    minZ: number;
    maxZ: number;
  };
}

export const Grass: React.FC<GrassProps> = ({
  instances = 2000,
  width = 10,
  depth = 10,
  height = 0,
  totalPoints = 0,
  terrainBounds
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.RawShaderMaterial>(null);
  // Create grass textures
  const textures = useMemo(() => {
    // Create simple procedural grass textures since we don't have external images
    const createGrassTexture = (isAlpha = false) => {
      const canvas = document.createElement('canvas');
      canvas.width = 105;
      canvas.height = 105;
      const ctx = canvas.getContext('2d')!;

      if (isAlpha) {
        // Create grass blade alpha mask
        const gradient = ctx.createLinearGradient(0, 0, 0, 30);
        gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
        gradient.addColorStop(0.7, 'rgba(255, 255, 255, 1)');
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 64, 64);

        // Add some noise for natural variation
        const imageData = ctx.getImageData(0, 0, 64, 64);
        const data = imageData.data;
        for (let i = 0; i < data.length; i += 4) {
          if (Math.random() > 0.95) {
            data[i] = data[i + 1] = data[i + 2] = 0; // Make some pixels transparent
          }
        }
        ctx.putImageData(imageData, 0, 0);
      } else {
        // Create grass color texture with darker, more realistic gradient
        const gradient = ctx.createLinearGradient(0, 0, 0, 64);
        gradient.addColorStop(0, '#2d5a3d'); // Darker green at top
        gradient.addColorStop(0.5, '#3d6e4a'); // Medium dark green
        gradient.addColorStop(1, '#4d7e5a'); // Slightly lighter green at bottom
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 64, 64);

        // Add some texture variation
        ctx.fillStyle = 'rgba(255, 255, 255, 0.05)'; // Very subtle highlights
        for (let i = 0; i < 50; i++) {
          ctx.fillRect(
            Math.random() * 64,
            Math.random() * 64,
            1,
            Math.random() * 2
          );
        }
      }

      const texture = new THREE.CanvasTexture(canvas);
      texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
      return texture;
    };
    return {
      grassDiffTex: createGrassTexture(false),
      grassMaskTex: createGrassTexture(true)
    };
  }, []); // Create grass geometry and positions
  const geometry = useMemo(() => {
    // Basic grass blade geometry (quad)
    const grassPositions = [
      0.5,
      -0.5,
      0, // bottom right
      -0.5,
      -0.5,
      0, // bottom left
      -0.5,
      0.5,
      0, // top left
      0.5,
      0.5,
      0 // top right
    ];

    const grassIndices = [0, 1, 2, 2, 3, 0];

    const grassUvs = [1.0, 0.0, 0.0, 0.0, 0.0, 1.0, 1.0, 1.0];

    // Generate instance data
    const terrainPositions = [];
    const rotationAngles = [];
    const instanceIds = [];

    for (let i = 0; i < instances; i++) {
      let posiX, posiZ;

      if (terrainBounds) {
        // Position within terrain bounds
        posiX =
          terrainBounds.minX +
          Math.random() * (terrainBounds.maxX - terrainBounds.minX);
        posiZ =
          terrainBounds.minZ +
          Math.random() * (terrainBounds.maxZ - terrainBounds.minZ);
      } else {
        // Default random positioning
        posiX = Math.random() * width - width / 2;
        posiZ = Math.random() * depth - depth / 2;
      }

      const posiY = height;

      terrainPositions.push(posiX, posiY, posiZ);

      // Random rotation angle for natural variation
      const angle = Math.random() * 360;
      rotationAngles.push(angle);

      // Instance ID for growth animation
      instanceIds.push(i);
    }

    // Create geometry
    const geo = new THREE.InstancedBufferGeometry();
    geo.instanceCount = instances;

    geo.setAttribute(
      'position',
      new THREE.Float32BufferAttribute(grassPositions, 3)
    );
    geo.setAttribute('uv', new THREE.Float32BufferAttribute(grassUvs, 2));
    geo.setIndex(new THREE.BufferAttribute(new Uint16Array(grassIndices), 1));

    // Instance attributes
    geo.setAttribute(
      'terrPosi',
      new THREE.InstancedBufferAttribute(new Float32Array(terrainPositions), 3)
    );
    geo.setAttribute(
      'angle',
      new THREE.InstancedBufferAttribute(
        new Float32Array(rotationAngles),
        1
      ).setUsage(THREE.DynamicDrawUsage)
    );
    geo.setAttribute(
      'instanceId',
      new THREE.InstancedBufferAttribute(new Float32Array(instanceIds), 1)
    );
    return geo;
  }, [instances, width, depth, height, terrainBounds]); // Create shader material
  const material = useMemo(() => {
    return new THREE.RawShaderMaterial({
      uniforms: {
        grassMaskTex: { value: textures.grassMaskTex },
        grassDiffTex: { value: textures.grassDiffTex },
        time: { value: 0 },
        growthProgress: { value: 0 },
        totalInstances: { value: instances }
      },
      vertexShader: grassVertexShader,
      fragmentShader: grassFragmentShader,
      side: THREE.DoubleSide,
      transparent: true,
      alphaTest: 0.1
    });
  }, [textures, instances]); // Animation loop
  useFrame((frameState) => {
    if (materialRef.current) {
      materialRef.current.uniforms.time.value =
        frameState.clock.elapsedTime * 1000;

      // Calculate growth progress based on points (0 to 1)
      // Let's say full growth occurs at 1000 points for testing
      const maxPoints = 1000;
      const growthProgress = Math.min(totalPoints / maxPoints, 1);
      materialRef.current.uniforms.growthProgress.value = growthProgress;
    }
  });

  return (
    <mesh
      ref={meshRef}
      geometry={geometry}
      material={material}
      frustumCulled={false}
    >
      <primitive object={material} ref={materialRef} attach="material" />
    </mesh>
  );
};

export default Grass;
