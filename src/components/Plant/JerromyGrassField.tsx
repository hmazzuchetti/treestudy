import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// JERROMY's exact vertex shader from shaders/grass.vert
const jerromyVertexShader = `
attribute vec3 position;
attribute vec2 uv;
attribute vec3 terrPosi;
attribute float angle;

uniform mat4 projectionMatrix;
uniform mat4 modelViewMatrix;
uniform float time;

varying vec2 vUv;

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
    
    vec3 upDir = vec3(0.0, 1.0, 0.0);
    vec3 finalPosi = rotate_vertex_position(position, upDir, angle);
    
    // Wind animation
    float windStrength = sin(time * 0.001 + terrPosi.x * 0.1 + terrPosi.z * 0.1) * 0.1;
    finalPosi.x += windStrength * position.y;
    
    // Position the grass blade in world space
    finalPosi += terrPosi;
    
    gl_Position = projectionMatrix * modelViewMatrix * vec4(finalPosi, 1.0);
}
`;

// JERROMY's exact fragment shader from shaders/grass.frag
const jerromyFragmentShader = `
precision mediump float;

uniform sampler2D grassMaskTex;
uniform sampler2D grassDiffTex;
uniform float time;

varying vec2 vUv;

void main() {
    vec4 grassMask = texture2D(grassMaskTex, vUv);
    vec4 grassColor = texture2D(grassDiffTex, vUv);
    
    gl_FragColor = vec4(grassColor.rgb, 1.0);
    
    // Discard transparent parts
    if(grassMask.r <= 0.1) {
        discard;
    }
}
`;

interface JerromyGrassFieldProps {
  totalPoints?: number;
  instances?: number;
  fieldWidth?: number;
  fieldDepth?: number;
  grassHeight?: number;
  windSpeed?: number;
  grassColor?: string;
  groundColor?: string;
}

// JERROMY's exact GrassField class implementation - converted to React Three Fiber
export const JerromyGrassField: React.FC<JerromyGrassFieldProps> = ({
  totalPoints,
  instances = 10000,
  fieldWidth = 10,
  fieldDepth = 10,
  grassHeight = 0,
  windSpeed = 1.0,
  grassColor = '#4a7c59',
  groundColor = '#08731f'
}) => {
  const meshRef = useRef<THREE.Mesh>(null);

  // Use totalPoints for future growth animation
  const growthProgress = Math.min(totalPoints || 0, 1000) / 1000;

  // JERROMY's exact parameters (made configurable)
  const w = fieldWidth;
  const d = fieldDepth;
  const h = grassHeight;
  // Create JERROMY's exact textures
  const textures = useMemo(() => {
    const createGrassTexture = (isMask: boolean) => {
      const canvas = document.createElement('canvas');
      canvas.width = canvas.height = 64;
      const ctx = canvas.getContext('2d')!;

      if (isMask) {
        // Create grass mask texture - white grass shape on black background
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, 64, 64);

        // Draw grass blade shape
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.moveTo(32, 64);
        ctx.quadraticCurveTo(28, 40, 30, 20);
        ctx.quadraticCurveTo(32, 0, 34, 20);
        ctx.quadraticCurveTo(36, 40, 32, 64);
        ctx.fill();
      } else {
        // Create grass diffuse texture - customizable grass color
        const color = new THREE.Color(grassColor);
        const gradient = ctx.createLinearGradient(0, 0, 0, 64);
        gradient.addColorStop(0, color.clone().multiplyScalar(0.8).getStyle());
        gradient.addColorStop(
          0.5,
          color.clone().multiplyScalar(1.0).getStyle()
        );
        gradient.addColorStop(1, color.clone().multiplyScalar(1.2).getStyle());
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 64, 64);
      }

      const texture = new THREE.CanvasTexture(canvas);
      texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
      return texture;
    };

    return {
      grassDiffTex: createGrassTexture(false),
      grassMaskTex: createGrassTexture(true)
    };
  }, [grassColor]);
  // Create 3D cone-like grass blade geometry (not flat quads)
  const geometry = useMemo(() => {
    // Create thicker 3D grass blade with multiple faces to simulate volume
    // Base vertices (bottom of grass blade) - made thicker
    const positions = [
      // Front face
      -0.12,
      0.0,
      0.12, // bottom left front
      0.12,
      0.0,
      0.12, // bottom right front
      0.05,
      1.0,
      0.05, // top front

      // Back face
      0.12,
      0.0,
      -0.12, // bottom right back
      -0.12,
      0.0,
      -0.12, // bottom left back
      -0.05,
      1.0,
      -0.05, // top back

      // Left face
      -0.12,
      0.0,
      -0.12, // bottom left back
      -0.12,
      0.0,
      0.12, // bottom left front
      -0.05,
      1.0,
      0.05, // top front

      // Right face
      0.12,
      0.0,
      0.12, // bottom right front
      0.12,
      0.0,
      -0.12, // bottom right back
      0.05,
      1.0,
      -0.05 // top back
    ];

    // Indices for triangular faces
    const indices = [
      // Front face
      0, 1, 2,
      // Back face
      3, 4, 5,
      // Left face
      6, 7, 8,
      // Right face
      9, 10, 11
    ];

    // UV coordinates for texture mapping
    const uvs = [
      // Front face
      0.0, 0.0, 0.5, 0.0, 0.25, 1.0,
      // Back face
      0.5, 0.0, 1.0, 0.0, 0.75, 1.0,
      // Left face
      0.0, 0.0, 0.0, 0.5, 0.25, 1.0,
      // Right face
      1.0, 0.0, 1.0, 0.5, 0.75, 1.0
    ];

    // Generate instance data
    const terrPosis = [];
    const angles = [];
    for (let i = 0; i < instances; i++) {
      const posiX = Math.random() * w - w / 2;
      const posiY = h;
      const posiZ = Math.random() * d - d / 2;

      terrPosis.push(posiX, posiY, posiZ);

      // JERROMY's 3D grass rotation - using 250 degrees instead of 360 for more natural look
      const angle = Math.random() * 250;
      angles.push(angle);
    }

    const geo = new THREE.InstancedBufferGeometry();
    // Use growth progress to control visible instances
    geo.instanceCount = Math.floor(instances * growthProgress);

    geo.setAttribute(
      'position',
      new THREE.Float32BufferAttribute(positions, 3)
    );
    geo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
    geo.setIndex(new THREE.BufferAttribute(new Uint16Array(indices), 1));

    geo.setAttribute(
      'terrPosi',
      new THREE.InstancedBufferAttribute(new Float32Array(terrPosis), 3)
    );
    geo.setAttribute(
      'angle',
      new THREE.InstancedBufferAttribute(new Float32Array(angles), 1)
    );
    return geo;
  }, [instances, w, d, h, growthProgress]);

  // JERROMY's exact material setup
  const material = useMemo(() => {
    return new THREE.RawShaderMaterial({
      uniforms: {
        grassMaskTex: { value: textures.grassMaskTex },
        grassDiffTex: { value: textures.grassDiffTex },
        time: { value: 0 }
      },
      vertexShader: jerromyVertexShader,
      fragmentShader: jerromyFragmentShader,
      side: THREE.DoubleSide,
      transparent: false
    });
  }, [textures]);
  // JERROMY's exact ground plane setup
  const groundPlane = useMemo(() => {
    const planeGeo = new THREE.PlaneGeometry(w, d);
    const planeMat = new THREE.MeshBasicMaterial({
      color: groundColor,
      side: THREE.DoubleSide
    });
    return { geometry: planeGeo, material: planeMat };
  }, [w, d, groundColor]);
  // Update time uniform for animation
  useFrame((state) => {
    if (material.uniforms) {
      material.uniforms.time.value = state.clock.elapsedTime * 1000 * windSpeed;
    }
  });

  return (
    <group>
      {/* JERROMY's ground plane rotated to be horizontal */}
      <mesh
        rotation={[Math.PI / 2, 0, 0]}
        geometry={groundPlane.geometry}
        material={groundPlane.material}
      />

      {/* JERROMY's grass field */}
      <mesh
        ref={meshRef}
        geometry={geometry}
        material={material}
        frustumCulled={false}
      />
    </group>
  );
};

export default JerromyGrassField;
