import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Stars, Float, Text3D, Center } from '@react-three/drei';
import { EffectComposer, Bloom, ChromaticAberration, Noise } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import * as THREE from 'three';

let scrollY = 0;
if (typeof window !== 'undefined') {
  window.addEventListener('scroll', () => { scrollY = window.scrollY; }, { passive: true });
}
let mouseX = 0, mouseY = 0;
if (typeof window !== 'undefined') {
  window.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth) * 2 - 1;
    mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
  });
}

const glassMat = (color, emissiveIntensity = 0.4) => (
  <meshPhysicalMaterial
    color={color}
    emissive={color}
    emissiveIntensity={emissiveIntensity}
    roughness={0.05}
    metalness={0.3}
    transmission={0.7}
    thickness={1.5}
    transparent
    opacity={0.75}
    clearcoat={1}
  />
);

const wireMat = (color) => (
  <meshPhysicalMaterial
    color="#ffffff"
    emissive={color}
    emissiveIntensity={0.5}
    wireframe
    transparent
    opacity={0.35}
  />
);

// Book — two flat boxes side by side with a spine
function FloatingBook({ position, scale, speed, color, scrollMultiplier = 1 }) {
  const group = useRef();
  useFrame((state) => {
    if (!group.current) return;
    group.current.rotation.y = state.clock.elapsedTime * 0.3 * speed + scrollY * 0.002 * scrollMultiplier;
    group.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.4 * speed) * 0.2;
    group.current.position.y = THREE.MathUtils.lerp(
      group.current.position.y, position[1] + scrollY * 0.004 * scrollMultiplier, 0.08
    );
  });
  return (
    <Float speed={speed} floatIntensity={2} rotationIntensity={0.5}>
      <group ref={group} position={position} scale={scale}>
        {/* Cover */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[1.2, 1.6, 0.12]} />
          {glassMat(color, 0.5)}
        </mesh>
        {/* Pages block */}
        <mesh position={[0.05, 0, 0.13]}>
          <boxGeometry args={[1.0, 1.5, 0.1]} />
          <meshStandardMaterial color="#e8e0d0" emissive="#ffffff" emissiveIntensity={0.05} />
        </mesh>
        {/* Spine */}
        <mesh position={[-0.62, 0, 0.06]}>
          <boxGeometry args={[0.06, 1.6, 0.22]} />
          {glassMat(color, 0.8)}
        </mesh>
        {/* Lines on cover (decorative) */}
        {[-0.4, -0.1, 0.2, 0.5].map((y, i) => (
          <mesh key={i} position={[0.05, y, 0.2]}>
            <boxGeometry args={[0.7, 0.04, 0.01]} />
            <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1} />
          </mesh>
        ))}
      </group>
    </Float>
  );
}

// Graduation Cap — flat square top + cylinder base + tassel
function FloatingGradCap({ position, scale, speed, color, scrollMultiplier = 1 }) {
  const group = useRef();
  useFrame((state) => {
    if (!group.current) return;
    group.current.rotation.y = state.clock.elapsedTime * 0.25 * speed + scrollY * 0.002 * scrollMultiplier;
    group.current.position.y = THREE.MathUtils.lerp(
      group.current.position.y, position[1] + scrollY * 0.005 * scrollMultiplier, 0.08
    );
  });
  return (
    <Float speed={speed} floatIntensity={2.5} rotationIntensity={0.8}>
      <group ref={group} position={position} scale={scale}>
        {/* Board (top) */}
        <mesh position={[0, 0.3, 0]} rotation={[0, Math.PI / 4, 0]}>
          <boxGeometry args={[1.8, 0.1, 1.8]} />
          {glassMat(color, 0.6)}
        </mesh>
        {/* Cap body */}
        <mesh position={[0, 0, 0]}>
          <cylinderGeometry args={[0.55, 0.65, 0.5, 16]} />
          {glassMat(color, 0.4)}
        </mesh>
        {/* Tassel string */}
        <mesh position={[0.7, 0.3, 0.7]}>
          <cylinderGeometry args={[0.02, 0.02, 0.8, 6]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1} />
        </mesh>
        {/* Tassel end */}
        <mesh position={[0.7, -0.1, 0.7]}>
          <sphereGeometry args={[0.1, 8, 8]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1.5} />
        </mesh>
      </group>
    </Float>
  );
}

// Pencil — long hexagonal prism with tip
function FloatingPencil({ position, scale, speed, color, scrollMultiplier = 1 }) {
  const group = useRef();
  useFrame((state) => {
    if (!group.current) return;
    group.current.rotation.z = state.clock.elapsedTime * 0.2 * speed;
    group.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3 * speed) * 0.3;
    group.current.position.y = THREE.MathUtils.lerp(
      group.current.position.y, position[1] + scrollY * 0.003 * scrollMultiplier, 0.08
    );
  });
  return (
    <Float speed={speed} floatIntensity={1.5} rotationIntensity={1}>
      <group ref={group} position={position} scale={scale}>
        {/* Body */}
        <mesh>
          <cylinderGeometry args={[0.12, 0.12, 2.2, 6]} />
          {glassMat(color, 0.5)}
        </mesh>
        {/* Tip cone */}
        <mesh position={[0, -1.25, 0]}>
          <coneGeometry args={[0.12, 0.4, 6]} />
          <meshStandardMaterial color="#f5deb3" emissive="#ffaa44" emissiveIntensity={0.3} />
        </mesh>
        {/* Lead tip */}
        <mesh position={[0, -1.5, 0]}>
          <coneGeometry args={[0.03, 0.15, 6]} />
          <meshStandardMaterial color="#333" emissive="#666" emissiveIntensity={0.2} />
        </mesh>
        {/* Eraser */}
        <mesh position={[0, 1.2, 0]}>
          <cylinderGeometry args={[0.13, 0.13, 0.2, 6]} />
          <meshStandardMaterial color="#ff8888" emissive="#ff4444" emissiveIntensity={0.4} />
        </mesh>
        {/* Eraser band */}
        <mesh position={[0, 1.08, 0]}>
          <cylinderGeometry args={[0.135, 0.135, 0.06, 6]} />
          <meshStandardMaterial color="#aaaaaa" emissive="#cccccc" emissiveIntensity={0.3} />
        </mesh>
      </group>
    </Float>
  );
}

// Atom — nucleus + 3 orbital rings
function FloatingAtom({ position, scale, speed, color, scrollMultiplier = 1 }) {
  const group = useRef();
  const ring1 = useRef();
  const ring2 = useRef();
  const ring3 = useRef();
  useFrame((state) => {
    if (!group.current) return;
    const t = state.clock.elapsedTime * speed;
    group.current.position.y = THREE.MathUtils.lerp(
      group.current.position.y, position[1] + scrollY * 0.004 * scrollMultiplier, 0.08
    );
    if (ring1.current) ring1.current.rotation.z = t * 0.8;
    if (ring2.current) ring2.current.rotation.x = t * 0.6;
    if (ring3.current) { ring3.current.rotation.y = t * 0.7; ring3.current.rotation.x = 0.5; }
  });
  return (
    <Float speed={speed} floatIntensity={2} rotationIntensity={0.6}>
      <group ref={group} position={position} scale={scale}>
        {/* Nucleus */}
        <mesh>
          <sphereGeometry args={[0.25, 16, 16]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1.5} />
        </mesh>
        {/* Orbital rings */}
        {[ring1, ring2, ring3].map((ref, i) => (
          <mesh key={i} ref={ref} rotation={[i * Math.PI / 3, 0, 0]}>
            <torusGeometry args={[0.9, 0.03, 8, 48]} />
            <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.8} transparent opacity={0.7} />
          </mesh>
        ))}
        {/* Electrons */}
        {[0, 1, 2].map((i) => (
          <mesh key={i} position={[Math.cos(i * Math.PI * 2 / 3) * 0.9, Math.sin(i * Math.PI * 2 / 3) * 0.9, 0]}>
            <sphereGeometry args={[0.07, 8, 8]} />
            <meshStandardMaterial color="#ffffff" emissive={color} emissiveIntensity={2} />
          </mesh>
        ))}
      </group>
    </Float>
  );
}

// Diploma scroll — rolled cylinder with ribbon
function FloatingScroll({ position, scale, speed, color, scrollMultiplier = 1 }) {
  const group = useRef();
  useFrame((state) => {
    if (!group.current) return;
    group.current.rotation.y = state.clock.elapsedTime * 0.3 * speed + scrollY * 0.002 * scrollMultiplier;
    group.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.4 * speed) * 0.15;
    group.current.position.y = THREE.MathUtils.lerp(
      group.current.position.y, position[1] + scrollY * 0.005 * scrollMultiplier, 0.08
    );
  });
  return (
    <Float speed={speed} floatIntensity={2} rotationIntensity={0.7}>
      <group ref={group} position={position} scale={scale}>
        {/* Scroll body */}
        <mesh>
          <cylinderGeometry args={[0.35, 0.35, 1.4, 20]} />
          {glassMat(color, 0.4)}
        </mesh>
        {/* End caps */}
        {[-0.75, 0.75].map((y, i) => (
          <mesh key={i} position={[0, y, 0]}>
            <cylinderGeometry args={[0.42, 0.42, 0.12, 20]} />
            {glassMat(color, 0.7)}
          </mesh>
        ))}
        {/* Ribbon */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.36, 0.025, 6, 30]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1.2} />
        </mesh>
      </group>
    </Float>
  );
}

// Wireframe globe (knowledge/world)
function FloatingGlobe({ position, scale, speed, color, scrollMultiplier = 1 }) {
  const mesh = useRef();
  useFrame((state) => {
    if (!mesh.current) return;
    mesh.current.rotation.y = state.clock.elapsedTime * 0.4 * speed + scrollY * 0.002 * scrollMultiplier;
    mesh.current.position.y = THREE.MathUtils.lerp(
      mesh.current.position.y, position[1] + scrollY * 0.004 * scrollMultiplier, 0.08
    );
  });
  return (
    <Float speed={speed} floatIntensity={1.5} rotationIntensity={0.4}>
      <group position={position} scale={scale}>
        <mesh ref={mesh}>
          <sphereGeometry args={[1, 18, 12]} />
          {wireMat(color)}
        </mesh>
        {/* Equator ring */}
        <mesh>
          <torusGeometry args={[1, 0.025, 6, 40]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.8} transparent opacity={0.5} />
        </mesh>
      </group>
    </Float>
  );
}

function StudentObjects() {
  return (
    <>
      <FloatingBook      position={[6, 2, -8]}    scale={1.4} color="#6366f1" speed={0.8}  scrollMultiplier={1.2} />
      <FloatingGradCap   position={[-5, 3, -10]}  scale={1.6} color="#00ffcc" speed={0.7}  scrollMultiplier={-1} />
      <FloatingPencil    position={[4, -4, -7]}   scale={1.2} color="#ffcc00" speed={1.2}  scrollMultiplier={1.5} />
      <FloatingAtom      position={[-6, -3, -9]}  scale={1.3} color="#ff6ec7" speed={1.0}  scrollMultiplier={-1.2} />
      <FloatingScroll    position={[7, -8, -11]}  scale={1.5} color="#00ffcc" speed={0.9}  scrollMultiplier={1.3} />
      <FloatingGlobe     position={[-4, -12, -8]} scale={1.8} color="#6366f1" speed={0.6}  scrollMultiplier={0.8} />
      <FloatingBook      position={[-7, 6, -14]}  scale={1.0} color="#ffcc00" speed={1.1}  scrollMultiplier={-1.5} />
      <FloatingPencil    position={[-3, -20, -9]} scale={1.4} color="#00ffcc" speed={0.8}  scrollMultiplier={1.0} />
      <FloatingAtom      position={[5, -16, -12]} scale={2.0} color="#6366f1" speed={0.5}  scrollMultiplier={1.8} />
    </>
  );
}

function MouseReactiveCamera() {
  const group = useRef();
  useFrame(() => {
    if (!group.current) return;
    group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, (mouseX * Math.PI) / 10, 0.05);
    group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, (mouseY * Math.PI) / 10, 0.05);
    group.current.position.y = THREE.MathUtils.lerp(group.current.position.y, -(scrollY * 0.002), 0.1);
  });
  return (
    <group ref={group}>
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={1} fade speed={1.2} />
      <StudentObjects />
    </group>
  );
}

export default function StarfieldBackground() {
  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: -1, pointerEvents: 'none' }}>
      <Canvas camera={{ position: [0, 0, 5], fov: 60 }}>
        <color attach="background" args={['#030308']} />
        <ambientLight intensity={0.4} />
        <directionalLight position={[10, 10, 5]} intensity={1.2} color="#ffffff" />
        <directionalLight position={[-10, -5, -5]} intensity={0.8} color="#8888ff" />
        <pointLight position={[0, 5, 3]} intensity={0.5} color="#00ffcc" />
        <MouseReactiveCamera />
        <EffectComposer disableNormalPass>
          <Bloom luminanceThreshold={0.4} luminanceSmoothing={0.9} height={300} opacity={0.7} />
          <ChromaticAberration blendFunction={BlendFunction.NORMAL} offset={[0.0012, 0.0012]} />
          <Noise opacity={0.05} />
        </EffectComposer>
      </Canvas>
    </div>
  );
}
