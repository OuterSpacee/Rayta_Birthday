'use client';

import React from 'react';
import { useBirthdayStore } from '@/lib/store';
import { CONFIG } from '@/lib/config';
import { Text } from '@react-three/drei';
import InteractiveProp from './InteractiveProp';
import { useDoorTransition } from './DoorTransition';

export default function Hallway() {
  const { enterRoom, roomsVisited, allRoomsVisited, setScene } = useBirthdayStore();
  const { startTransition } = useDoorTransition();
  const friends = CONFIG.friends;
  const numFriends = friends.length || 10;
  const radius = 6.2;
  const isFinished = allRoomsVisited();

  return (
    <group>
      {/* Main Floor with Metallic Ring Trims */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <circleGeometry args={[8.5, 32]} />
        <meshStandardMaterial color="#12111a" roughness={0.4} metalness={0.2} />
      </mesh>
      {/* Outer Brass Ring */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <ringGeometry args={[6.1, 6.3, 32]} />
        <meshStandardMaterial color="#ffaa00" emissive="#ffaa00" emissiveIntensity={0.3} metalness={0.8} />
      </mesh>
      {/* Center Decorative Inlay Ring */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <ringGeometry args={[2.0, 2.1, 32]} />
        <meshStandardMaterial color="#00ff66" emissive="#00ff66" emissiveIntensity={0.4} />
      </mesh>

      {/* Main Ceiling with Beam Patterns */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 3.4, 0]}>
        <circleGeometry args={[8.5, 32]} />
        <meshStandardMaterial
          color="#0e0d16"
          transparent
          opacity={isFinished ? 0.35 : 1}
          emissive={isFinished ? '#ffaa00' : '#141122'}
          emissiveIntensity={isFinished ? 0.4 : 0.1}
        />
      </mesh>

      {/* Finished Skylight Light Burst */}
      {isFinished && (
        <group position={[0, 3.2, 0]}>
          <pointLight intensity={3.5} color="#ffaa00" distance={15} />
          <mesh>
            <cylinderGeometry args={[2, 2, 0.1, 32]} />
            <meshStandardMaterial color="#ffaa00" emissive="#ffaa00" emissiveIntensity={1} />
          </mesh>
        </group>
      )}

      {/* Quiet LEAVE / EXIT Button at Floor Center */}
      <InteractiveProp onClick={() => setScene('finale')}>
        <group position={[0, 0.05, -3.5]}>
          {/* Base plate */}
          <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[2.4, 0.8]} />
            <meshStandardMaterial color="#1a1826" metalness={0.6} roughness={0.3} />
          </mesh>
          <Text
            position={[0, 0.08, 0]}
            rotation={[-Math.PI / 3, 0, 0]}
            fontSize={0.22}
            color={isFinished ? '#00ff66' : '#ffaa00'}
            anchorX="center"
            anchorY="middle"
          >
            {isFinished ? '★ EXIT TO FINALE ★' : '▶ LEAVE HALLWAY ◀'}
          </Text>
        </group>
      </InteractiveProp>

      {/* 10 Wall Sections & Doors */}
      {friends.map((friend, index) => {
        const angle = (index / numFriends) * Math.PI * 2;
        const x = Math.sin(angle) * radius;
        const z = -Math.cos(angle) * radius;
        const isVisited = roomsVisited.includes(friend.id);
        const accent = friend.accentColor || '#ffaa00';

        return (
          <group key={friend.id} position={[x, 0, z]} rotation={[0, -angle, 0]}>
            {/* Main Wall Panel */}
            <mesh position={[0, 1.7, 0]}>
              <boxGeometry args={[4.0, 3.4, 0.2]} />
              <meshStandardMaterial color="#161522" roughness={0.6} />
            </mesh>

            {/* Wall Baseboard Trim (Bottom) */}
            <mesh position={[0, 0.15, 0.12]}>
              <boxGeometry args={[4.0, 0.3, 0.08]} />
              <meshStandardMaterial color="#2a273a" metalness={0.5} />
            </mesh>

            {/* Wall Crown Molding Trim (Top) */}
            <mesh position={[0, 3.25, 0.12]}>
              <boxGeometry args={[4.0, 0.3, 0.08]} />
              <meshStandardMaterial color="#2a273a" metalness={0.5} />
            </mesh>

            {/* Pillar Columns Between Wall Segments */}
            <group position={[2.0, 1.7, 0.1]}>
              <mesh>
                <boxGeometry args={[0.3, 3.4, 0.3]} />
                <meshStandardMaterial color="#222030" metalness={0.7} roughness={0.3} />
              </mesh>
              {/* Pillar Brass Accent Stripes */}
              <mesh position={[0, 0, 0.16]}>
                <boxGeometry args={[0.1, 3.2, 0.02]} />
                <meshStandardMaterial color="#ffaa00" emissive="#ffaa00" emissiveIntensity={0.2} metalness={0.9} />
              </mesh>
            </group>

            {/* Doorway Outer Architrave Frame */}
            <mesh position={[0, 1.3, 0.14]}>
              <boxGeometry args={[1.7, 2.5, 0.08]} />
              <meshStandardMaterial color="#2d293e" metalness={0.6} />
            </mesh>

            {/* Sconce Lamp Fixture Above Door */}
            <group position={[0, 2.7, 0.25]}>
              {/* Arm & Mount */}
              <mesh position={[0, 0, -0.05]}>
                <boxGeometry args={[0.1, 0.2, 0.15]} />
                <meshStandardMaterial color="#ffaa00" metalness={0.8} />
              </mesh>
              {/* Lamp Shade */}
              <mesh position={[0, -0.1, 0.05]}>
                <coneGeometry args={[0.15, 0.2, 16]} />
                <meshStandardMaterial color="#1a1824" metalness={0.8} />
              </mesh>
              {/* Light Source */}
              <pointLight position={[0, -0.2, 0.05]} intensity={isVisited ? 1.5 : 0.8} color={accent} distance={4} />
            </group>

            {/* Interactive Door */}
            <InteractiveProp
              onClick={() => {
                startTransition(() => {
                  enterRoom(friend.id);
                });
              }}
              glowColor={accent}
            >
              {/* Recessed Door Body */}
              <mesh position={[0, 1.25, 0.19]}>
                <boxGeometry args={[1.4, 2.3, 0.06]} />
                <meshStandardMaterial color="#1d1b2a" roughness={0.4} metalness={0.3} />
              </mesh>

              {/* Inner Inset Door Panel */}
              <mesh position={[0, 1.25, 0.23]}>
                <boxGeometry args={[1.1, 2.0, 0.02]} />
                <meshStandardMaterial color="#262336" roughness={0.5} />
              </mesh>

              {/* Brass Door Handle Knob */}
              <mesh position={[0.5, 1.1, 0.27]}>
                <sphereGeometry args={[0.06, 16, 16]} />
                <meshStandardMaterial color="#ffaa00" metalness={0.9} roughness={0.1} />
              </mesh>

              {/* Friend Name Plate Badge */}
              <group position={[0, 2.1, 0.25]}>
                <mesh>
                  <planeGeometry args={[1.3, 0.3]} />
                  <meshStandardMaterial color="#0f0e17" metalness={0.8} />
                </mesh>
                <Text
                  position={[0, 0, 0.02]}
                  fontSize={0.15}
                  color={isVisited ? '#00ff66' : accent}
                  anchorX="center"
                  anchorY="middle"
                >
                  {friend.name.toUpperCase()}
                </Text>
              </group>
            </InteractiveProp>

            {/* Pedestal Candle Stand (Right of door) */}
            <group position={[1.2, 0, 0.25]}>
              {/* Brass Pedestal Stand */}
              <mesh position={[0, 0.4, 0]}>
                <cylinderGeometry args={[0.08, 0.12, 0.8, 16]} />
                <meshStandardMaterial color="#2d293e" metalness={0.8} />
              </mesh>
              {/* Candle Body */}
              <mesh position={[0, 0.95, 0]}>
                <cylinderGeometry args={[0.05, 0.05, 0.3, 16]} />
                <meshStandardMaterial color="#e6decb" roughness={0.8} />
              </mesh>
              {/* Flame */}
              <mesh position={[0, 1.15, 0]}>
                <coneGeometry args={[0.03, 0.1, 16]} />
                <meshStandardMaterial
                  color={isVisited ? '#ffaa00' : '#444455'}
                  emissive={isVisited ? '#ffaa00' : '#000000'}
                  emissiveIntensity={isVisited ? 1.5 : 0}
                />
              </mesh>
              {/* Warm Flame Glow */}
              {isVisited && (
                <pointLight position={[0, 1.2, 0]} intensity={1.2} color="#ffaa00" distance={3} />
              )}
            </group>
          </group>
        );
      })}
    </group>
  );
}
