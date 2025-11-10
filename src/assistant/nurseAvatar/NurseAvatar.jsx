import React, { useEffect, useRef } from "react";
import { useFrame, useLoader } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import * as THREE from "three";

/**
 * Nurse Avatar with lip sync + blinking etc
 */
export default function NurseAvatar({ isSpeaking, isConnected, phoneme }) {
  // const avatar = useLoader(GLTFLoader, "/nurse6.glb");
  const avatar = useLoader(
  GLTFLoader,
  import.meta.env.BASE_URL + "nurse6.glb"
);

  const headRef = useRef();
  const blinkTimer = useRef(0);
  const isBlinking = useRef(false);

  const mouthOpenRef = useRef(0);
  const speechIntensity = useRef(0);

  // Phoneme → morph mapping
  const visemeMap = {
    AA: { open: 1.0, smile: 0.0 },
    AE: { open: 1.0, smile: 0.2 },
    AH: { open: 0.8, smile: 0.0 },
    AO: { open: 0.9, smile: 0.0 },
    UW: { open: 0.8, smile: 0.0 },
    EH: { open: 0.7, smile: 0.6 },
    IY: { open: 0.6, smile: 0.8 },
    IH: { open: 0.6, smile: 0.5 },
    M: { open: 0.2, smile: 0.2 },
    P: { open: 0.2, smile: 0.2 },
    B: { open: 0.2, smile: 0.2 },
    F: { open: 0.4, smile: 0.5 },
    V: { open: 0.4, smile: 0.5 },
  };

  // Style adjustments
  useEffect(() => {
    avatar.scene.traverse((child) => {
      if (child.isMesh) {
        if (
          child.name === "Wolf3D_Outfit_Top" ||
          child.name === "Wolf3D_Outfit_Bottom" ||
          child.name === "Wolf3D_Outfit_Footwear"
        ) {
          if (child.material.map) child.material.map = null;
          child.material.color = new THREE.Color("#8a8af1");
          child.material.roughness = 0.4;
          child.material.metalness = 0.1;
        }
        if (child.name === "Wolf3D_Hair") {
          child.material.metalness = 0.5;
          child.material.roughness = 0.2;
        }
        if (child.name === "Wolf3D_Body") {
          child.material.metalness = 0.05;
          child.material.roughness = 0.4;
        }
      }
    });
  }, [avatar]);

  // Main animation loop
  useFrame((_, delta) => {
    if (!headRef.current) {
      const head = avatar.scene.getObjectByName("Wolf3D_Head");
      if (head && head.morphTargetInfluences) headRef.current = head;
    }

    if (headRef.current && headRef.current.morphTargetInfluences) {
      const morphs = headRef.current.morphTargetInfluences;

      if (!isConnected) {
        morphs[0] = THREE.MathUtils.lerp(morphs[0], 0, 0.3);
        morphs[1] = THREE.MathUtils.lerp(morphs[1], 0, 0.3);
        speechIntensity.current = 0;
        return;
      }

      for (let i = 0; i < morphs.length; i++) {
        morphs[i] = THREE.MathUtils.lerp(morphs[i], 0, 0.5);
      }

      if (phoneme && visemeMap[phoneme]) {
        const { open, smile } = visemeMap[phoneme];
        morphs[0] = THREE.MathUtils.lerp(morphs[0], open, 0.6);
        morphs[1] = THREE.MathUtils.lerp(morphs[1], smile, 0.6);
      } else if (isSpeaking) {
        speechIntensity.current = Math.min(
          speechIntensity.current + delta * 2,
          1
        );
        mouthOpenRef.current =
          0.5 + Math.sin(Date.now() * 0.018) * 0.25;
        morphs[0] = THREE.MathUtils.lerp(
          morphs[0],
          mouthOpenRef.current * speechIntensity.current,
          0.6
        );
      } else {
        speechIntensity.current = Math.max(speechIntensity.current - delta * 3, 0);
        morphs[0] = THREE.MathUtils.lerp(morphs[0], 0, 0.6);
        morphs[1] = THREE.MathUtils.lerp(morphs[1], 0, 0.6);
      }
    }

    // Blinking
    blinkTimer.current += delta;
    const eyeLeft = avatar.scene.getObjectByName("EyeLeft");
    const eyeRight = avatar.scene.getObjectByName("EyeRight");

    if (blinkTimer.current > 2.5 + Math.random() * 2 && !isBlinking.current) {
      isBlinking.current = true;
      blinkTimer.current = 0;

      if (eyeLeft && eyeRight) {
        eyeLeft.scale.y = 0.1;
        eyeRight.scale.y = 0.1;
      }

      setTimeout(() => {
        if (eyeLeft && eyeRight) {
          eyeLeft.scale.y = 1;
          eyeRight.scale.y = 1;
        }
        isBlinking.current = false;
      }, 150 + Math.random() * 100);
    }
  });

  return (
    <primitive
      object={avatar.scene}
      scale={8}
      position={[0, -14.7, -1]}
      rotation={[-0.4, 0, 0]}
    />
  );
}