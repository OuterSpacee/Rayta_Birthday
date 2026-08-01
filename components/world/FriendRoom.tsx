'use client';

import { useState, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Html } from '@react-three/drei';
import { useBirthdayStore } from '@/lib/store';
import { CONFIG } from '@/lib/config';
import InteractiveProp from './InteractiveProp';
import { useDoorTransition } from './DoorTransition';
import * as THREE from 'three';

export default function FriendRoom({ roomId }: { roomId: string }) {
  const { visitRoom, exitRoom } = useBirthdayStore();
  const { startTransition } = useDoorTransition();
  const friend = CONFIG.friends.find((f) => f.id === roomId);
  const [playing, setPlaying] = useState(false);

  const discRef = useRef<THREE.Mesh>(null);
  const artifactRef = useRef<THREE.Group>(null);

  if (!friend) return null;

  const accentColor = friend.accentColor || '#ffaa00';
  const wallColor = friend.wallColor || '#14131a';

  useFrame((_, delta) => {
    if (playing && discRef.current) {
      discRef.current.rotation.y -= delta * 3;
    }
    if (artifactRef.current) {
      artifactRef.current.rotation.y += delta * 0.5;
      artifactRef.current.position.y = Math.sin(Date.now() * 0.002) * 0.05 + 0.1;
    }
  });

  const handlePlay = () => {
    if (playing) return;
    setPlaying(true);
    setTimeout(() => {
      setPlaying(false);
      visitRoom(friend.id);
    }, 6000);
  };

  const handleExit = () => {
    startTransition(() => {
      exitRoom();
    });
  };

  return (
    <group>
      {/* Central Room Ambient Light */}
      <pointLight position={[0, 2.8, 0]} intensity={1.5} color={accentColor} distance={12} />

      {/* Spotlight for Keepsake Display */}
      <spotLight
        position={[-2.5, 2.8, -1.5]}
        target-position={[-2.5, 0.8, -2.5]}
        intensity={2.0}
        color="#ffffff"
        angle={0.6}
        penumbra={0.5}
      />

      {/* Floor with Wooden Decking / Rug */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <planeGeometry args={[11, 11]} />
        <meshStandardMaterial color="#111019" roughness={0.5} metalness={0.2} />
      </mesh>
      {/* Decorative Floor Carpet / Rug */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, -0.5]}>
        <planeGeometry args={[7, 7]} />
        <meshStandardMaterial color="#1a1828" roughness={0.8} />
      </mesh>

      {/* Ceiling */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 3.4, 0]}>
        <planeGeometry args={[11, 11]} />
        <meshStandardMaterial color="#0b0a12" />
      </mesh>

      {/* Room Walls with Two-Tone Panel Architecture */}
      {/* Back Wall */}
      <group position={[0, 1.7, -5.5]}>
        <mesh position={[0, 0, 0]}>
          <planeGeometry args={[11, 3.4]} />
          <meshStandardMaterial color={wallColor} roughness={0.6} />
        </mesh>
        {/* Wainscoting Lower Trim */}
        <mesh position={[0, -0.7, 0.05]}>
          <boxGeometry args={[11, 1.2, 0.08]} />
          <meshStandardMaterial color="#1b1828" metalness={0.4} />
        </mesh>
      </group>

      {/* Front Wall */}
      <group position={[0, 1.7, 5.5]} rotation={[0, Math.PI, 0]}>
        <mesh position={[0, 0, 0]}>
          <planeGeometry args={[11, 3.4]} />
          <meshStandardMaterial color="#141220" roughness={0.6} />
        </mesh>
        <mesh position={[0, -0.7, 0.05]}>
          <boxGeometry args={[11, 1.2, 0.08]} />
          <meshStandardMaterial color="#1b1828" metalness={0.4} />
        </mesh>
      </group>

      {/* Left Wall */}
      <group position={[-5.5, 1.7, 0]} rotation={[0, Math.PI / 2, 0]}>
        <mesh position={[0, 0, 0]}>
          <planeGeometry args={[11, 3.4]} />
          <meshStandardMaterial color="#141220" roughness={0.6} />
        </mesh>
        <mesh position={[0, -0.7, 0.05]}>
          <boxGeometry args={[11, 1.2, 0.08]} />
          <meshStandardMaterial color="#1b1828" metalness={0.4} />
        </mesh>
      </group>

      {/* Right Wall */}
      <group position={[5.5, 1.7, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <mesh position={[0, 0, 0]}>
          <planeGeometry args={[11, 3.4]} />
          <meshStandardMaterial color="#141220" roughness={0.6} />
        </mesh>
        <mesh position={[0, -0.7, 0.05]}>
          <boxGeometry args={[11, 1.2, 0.08]} />
          <meshStandardMaterial color="#1b1828" metalness={0.4} />
        </mesh>
      </group>

      {/* Exit Door (Front Wall) */}
      <InteractiveProp onClick={handleExit} glowColor="#ffaa00">
        <group position={[0, 0, 5.3]} rotation={[0, Math.PI, 0]}>
          {/* Architrave */}
          <mesh position={[0, 1.3, 0]}>
            <boxGeometry args={[1.7, 2.5, 0.08]} />
            <meshStandardMaterial color="#2d293e" metalness={0.6} />
          </mesh>
          {/* Door */}
          <mesh position={[0, 1.25, 0.05]}>
            <boxGeometry args={[1.4, 2.3, 0.06]} />
            <meshStandardMaterial color="#1d1b2a" roughness={0.4} />
          </mesh>
          {/* Handle */}
          <mesh position={[0.5, 1.1, 0.1]}>
            <sphereGeometry args={[0.06, 16, 16]} />
            <meshStandardMaterial color="#ffaa00" metalness={0.9} />
          </mesh>
          {/* Exit Badge */}
          <Text
            position={[0, 2.1, 0.12]}
            fontSize={0.16}
            color="#ffaa00"
            anchorX="center"
            anchorY="middle"
          >
            [ EXIT ROOM ]
          </Text>
        </group>
      </InteractiveProp>

      {/* Center Console Table with Vintage Record Player */}
      <group position={[0, 0, -3.2]}>
        {/* Wooden Console Table Base */}
        <mesh position={[0, 0.4, 0]}>
          <boxGeometry args={[2.0, 0.8, 1.2]} />
          <meshStandardMaterial color="#221e30" roughness={0.4} metalness={0.3} />
        </mesh>
        {/* Table Legs */}
        {[-0.8, 0.8].map((lx) =>
          [-0.4, 0.4].map((lz) => (
            <mesh key={`${lx}-${lz}`} position={[lx, 0.2, lz]}>
              <cylinderGeometry args={[0.04, 0.04, 0.4]} />
              <meshStandardMaterial color="#ffaa00" metalness={0.8} />
            </mesh>
          ))
        )}

        {/* Vintage Turntable System */}
        <group position={[0, 0.8, 0]}>
          {/* Main Turntable Casing */}
          <mesh position={[0, 0.1, 0]}>
            <boxGeometry args={[1.4, 0.2, 0.9]} />
            <meshStandardMaterial color="#1a1826" metalness={0.7} roughness={0.2} />
          </mesh>

          {/* Turntable Platter & Vinyl Record */}
          <InteractiveProp onClick={handlePlay} glowColor="#00ff66">
            <mesh ref={discRef} position={[-0.2, 0.22, 0]}>
              <cylinderGeometry args={[0.38, 0.38, 0.04, 32]} />
              <meshStandardMaterial
                color="#0a0a0d"
                roughness={0.2}
                emissive={playing ? '#00ff66' : '#000000'}
                emissiveIntensity={playing ? 0.6 : 0}
              />
            </mesh>
            {/* Vinyl Center Label */}
            <mesh position={[-0.2, 0.24, 0]}>
              <cylinderGeometry args={[0.12, 0.12, 0.042, 32]} />
              <meshStandardMaterial color={accentColor} />
            </mesh>
          </InteractiveProp>

          {/* Tone Arm Needle */}
          <group position={[0.35, 0.25, -0.2]} rotation={[0, playing ? -0.4 : 0, 0]}>
            <mesh position={[0, 0.08, 0]}>
              <cylinderGeometry args={[0.03, 0.03, 0.16]} />
              <meshStandardMaterial color="#ffaa00" metalness={0.9} />
            </mesh>
            <mesh position={[-0.2, 0.12, 0.15]} rotation={[0.2, 0.8, 0]}>
              <cylinderGeometry args={[0.012, 0.012, 0.4]} />
              <meshStandardMaterial color="#dddddd" metalness={0.9} />
            </mesh>
          </group>

          {/* Front Speaker Grille & LED Indicator */}
          <mesh position={[0, 0.1, 0.46]}>
            <planeGeometry args={[1.2, 0.12]} />
            <meshStandardMaterial color="#100f18" metalness={0.9} />
          </mesh>
          <mesh position={[0.5, 0.1, 0.47]}>
            <sphereGeometry args={[0.03, 16, 16]} />
            <meshStandardMaterial
              color={playing ? '#00ff66' : '#ff2a5f'}
              emissive={playing ? '#00ff66' : '#ff2a5f'}
              emissiveIntensity={1.5}
            />
          </mesh>

          {/* HTML Overlay Status when playing */}
          {playing && (
            <Html position={[0, 0.8, 0]} center>
              <div
                style={{
                  color: '#00ff66',
                  fontFamily: 'monospace',
                  fontSize: '13px',
                  letterSpacing: '0.1em',
                  padding: '6px 14px',
                  background: 'rgba(10, 10, 14, 0.92)',
                  border: '1px solid #00ff66',
                  borderRadius: '2px',
                  boxShadow: '0 0 15px rgba(0, 255, 102, 0.4)',
                  whiteSpace: 'nowrap',
                }}
              >
                ▶ PLAYING MESSAGE FROM {friend.name.toUpperCase()}...
              </div>
            </Html>
          )}
        </group>
      </group>

      {/* Left Keepsake Exhibition Display Stand */}
      <group position={[-3.2, 0, -1.8]} rotation={[0, Math.PI / 4, 0]}>
        {/* Exhibition Pedestal */}
        <mesh position={[0, 0.4, 0]}>
          <cylinderGeometry args={[0.6, 0.7, 0.8, 16]} />
          <meshStandardMaterial color="#1e1b2d" roughness={0.4} metalness={0.5} />
        </mesh>
        <mesh position={[0, 0.82, 0]}>
          <cylinderGeometry args={[0.65, 0.65, 0.05, 16]} />
          <meshStandardMaterial color="#ffaa00" metalness={0.8} />
        </mesh>

        {/* Dynamic Keepsake Object */}
        <group position={[0, 0.9, 0]}>
          <InteractiveProp gazeReveal glowColor={accentColor}>
            {/* Photo Frame */}
            {friend.keepsake === 'photo' && (
              <group position={[0, 0.5, 0]}>
                <mesh>
                  <boxGeometry args={[1.0, 1.2, 0.08]} />
                  <meshStandardMaterial color="#ffaa00" metalness={0.8} />
                </mesh>
                <mesh position={[0, 0, 0.05]}>
                  <planeGeometry args={[0.85, 1.05]} />
                  <meshStandardMaterial color="#2d283c" roughness={0.3} />
                </mesh>
              </group>
            )}

            {/* Letters Stack */}
            {friend.keepsake === 'letters' && (
              <group position={[0, 0.2, 0]}>
                <mesh position={[0, 0, 0]} rotation={[0, 0.2, 0]}>
                  <boxGeometry args={[0.8, 0.06, 0.5]} />
                  <meshStandardMaterial color="#e8dfce" roughness={0.9} />
                </mesh>
                <mesh position={[0.02, 0.07, -0.02]} rotation={[0, -0.1, 0]}>
                  <boxGeometry args={[0.8, 0.06, 0.5]} />
                  <meshStandardMaterial color="#dfd4bf" roughness={0.9} />
                </mesh>
                <mesh position={[0, 0.11, 0.1]}>
                  <sphereGeometry args={[0.06, 16, 16]} />
                  <meshStandardMaterial color="#ff2a5f" emissive="#ff2a5f" emissiveIntensity={0.5} />
                </mesh>
              </group>
            )}

            {/* Floating Crystal Artifact */}
            {friend.keepsake === 'trinket' && (
              <group ref={artifactRef} position={[0, 0.3, 0]}>
                <mesh>
                  <dodecahedronGeometry args={[0.35]} />
                  <meshStandardMaterial
                    color={accentColor}
                    emissive={accentColor}
                    emissiveIntensity={0.8}
                    roughness={0.1}
                    metalness={0.9}
                  />
                </mesh>
                <mesh rotation={[Math.PI / 3, 0, 0]}>
                  <torusGeometry args={[0.55, 0.02, 16, 32]} />
                  <meshStandardMaterial color="#00ff66" emissive="#00ff66" emissiveIntensity={0.6} />
                </mesh>
              </group>
            )}

            {/* Retro Arcade Poster */}
            {friend.keepsake === 'poster' && (
              <group position={[0, 0.7, 0]}>
                <mesh>
                  <boxGeometry args={[1.2, 1.6, 0.06]} />
                  <meshStandardMaterial color="#1a1826" metalness={0.7} />
                </mesh>
                <mesh position={[0, 0, 0.04]}>
                  <planeGeometry args={[1.05, 1.45]} />
                  <meshStandardMaterial color="#ffaa00" emissive="#ffaa00" emissiveIntensity={0.3} />
                </mesh>
              </group>
            )}

            {/* Friend's Personal Note */}
            {friend.note && (
              <Text
                position={[0, 1.3, 0]}
                fontSize={0.15}
                color="#ffaa00"
                anchorX="center"
                anchorY="middle"
                maxWidth={3.2}
              >
                {`"${friend.note}"`}
              </Text>
            )}
          </InteractiveProp>
        </group>
      </group>
    </group>
  );
}
