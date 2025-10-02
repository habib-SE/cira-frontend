import React, { useEffect, useRef } from "react";
import { useFrame, useLoader } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import * as THREE from "three";

export default function NurseAvatar({ isSpeaking, isConnected }) {
  const avatar = useLoader(GLTFLoader, "/nurse6.glb");
  const blinkTimer = useRef(0);
  const isBlinking = useRef(false);
  const mouthOpenRef = useRef(0);
  const headRef = useRef();
  const speechTimer = useRef(0);
  const lastSpeechChange = useRef(0);
  const speechIntensity = useRef(0);

  // Blue outfit + subtle PBR tweaks
  useEffect(() => {
    avatar.scene.traverse((child) => {
      if (!child.isMesh) return;
      if (["Wolf3D_Outfit_Top","Wolf3D_Outfit_Bottom","Wolf3D_Outfit_Footwear"].includes(child.name)) {
        if (child.material.map) child.material.map = null;
        child.material.color = new THREE.Color("#8a8af1");
        child.material.roughness = 0.4;
        child.material.metalness = 0.1;
        child.material.needsUpdate = true;
      }
      if (child.name === "Wolf3D_Hair") {
        child.material.metalness = 0.5;
        child.material.roughness = 0.2;
        child.material.needsUpdate = true;
      }
      if (child.name === "Wolf3D_Body") {
        child.material.metalness = 0.05;
        child.material.roughness = 0.4;
        child.material.needsUpdate = true;
      }
    });
  }, [avatar]);

  useEffect(() => {
    if (!isConnected) {
      mouthOpenRef.current = 0;
      speechIntensity.current = 0;
      if (headRef.current?.morphTargetInfluences) {
        headRef.current.morphTargetInfluences.fill(0);
      }
    }
  }, [isConnected]);

  useFrame((_, delta) => {
    if (!headRef.current) {
      const head = avatar.scene.getObjectByName("Wolf3D_Head");
      if (head?.morphTargetInfluences) headRef.current = head;
    }
    if (headRef.current?.morphTargetInfluences) {
      speechTimer.current += delta;

      if (isConnected && isSpeaking) {
        speechIntensity.current = Math.min(speechIntensity.current + delta * 2, 1);
        if (speechTimer.current - lastSpeechChange.current > 0.12 + Math.random() * 0.1) {
          const speechPattern = Math.sin(speechTimer.current * 7) * 0.4 + 0.4;
          mouthOpenRef.current = Math.min(speechPattern, 0.6);
          lastSpeechChange.current = speechTimer.current;
        }
      } else {
        speechIntensity.current = Math.max(speechIntensity.current - delta * 3, 0);
        mouthOpenRef.current = Math.max(mouthOpenRef.current - delta * 3, 0);
      }

      const mouthOpenIndex = 0, mouthCloseIndex = 1, mouthSmileIndex = 2, mouthFrownIndex = 3;
      const aaSoundIndex = 4, eeSoundIndex = 5, ooSoundIndex = 6;
      const infl = headRef.current.morphTargetInfluences;
      const speechPhase = speechTimer.current * 6;

      if (infl[mouthOpenIndex] !== undefined) infl[mouthOpenIndex] = mouthOpenRef.current * speechIntensity.current;
      if (infl[mouthCloseIndex] !== undefined) infl[mouthCloseIndex] = (1 - mouthOpenRef.current) * 0.3 * speechIntensity.current;
      if (infl[mouthSmileIndex] !== undefined) infl[mouthSmileIndex] = 0.1 + (isSpeaking ? 0.1 : 0);
      if (infl[mouthFrownIndex] !== undefined) infl[mouthFrownIndex] = 0.05;

      if (infl[aaSoundIndex] !== undefined) infl[aaSoundIndex] = Math.max(0, Math.sin(speechPhase) * 0.4) * speechIntensity.current;
      if (infl[eeSoundIndex] !== undefined) infl[eeSoundIndex] = Math.max(0, Math.sin(speechPhase + 0.7) * 0.3) * speechIntensity.current;
      if (infl[ooSoundIndex] !== undefined) infl[ooSoundIndex] = Math.max(0, Math.sin(speechPhase + 1.4) * 0.35) * speechIntensity.current;
    }

    // blink
    blinkTimer.current += delta;
    const eyeLeft = avatar.scene.getObjectByName("EyeLeft");
    const eyeRight = avatar.scene.getObjectByName("EyeRight");
    if (blinkTimer.current > (2 + Math.random() * 2) && !isBlinking.current) {
      isBlinking.current = true;
      blinkTimer.current = 0;
      if (eyeLeft && eyeRight) { eyeLeft.scale.y = 0.1; eyeRight.scale.y = 0.1; }
      setTimeout(() => {
        if (eyeLeft && eyeRight) { eyeLeft.scale.y = 1; eyeRight.scale.y = 1; }
        isBlinking.current = false;
      }, 100 + Math.random() * 50);
    }
  });

  return (
    <primitive object={avatar.scene} scale={8} position={[0, -14.7, -1]} rotation={[-0.4, 0, 0]} />
  );
}
