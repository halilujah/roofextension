'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useConfigStore } from '@/store/useConfigStore';
import { cmToM, calcTotalWidth, ROOF_SETBACK } from '@/lib/geometry';

const _center = new THREE.Vector3();

/** Read current dormer center from store imperatively. */
function getDormerCenter(out: THREE.Vector3): THREE.Vector3 {
  const s = useConfigStore.getState();
  const slopeRad = (s.slopeAngle * Math.PI) / 180;
  const totalWidthM = calcTotalWidth(s.panelWidths, s.sidewallWidth);
  const heightM = cmToM(s.height);
  return out.set(
    totalWidthM / 2,
    ROOF_SETBACK * Math.sin(slopeRad) + heightM / 2,
    -ROOF_SETBACK * Math.cos(slopeRad),
  );
}

/**
 * Keeps the OrbitControls target smoothly centered on the dormer.
 * Does NOT move the camera position — the user has full orbit control.
 */
export default function CameraController() {
  const initialized = useRef(false);

  useFrame((state) => {
    const controls = state.controls as any;
    if (!controls?.target) return;

    getDormerCenter(_center);

    if (!initialized.current) {
      controls.target.copy(_center);
      controls.update();
      initialized.current = true;
      return;
    }

    // Continuously lerp toward the true dormer center so orbit stays centered
    // when dimensions change. 0.12 gives smooth but responsive tracking.
    controls.target.lerp(_center, 0.12);
    controls.update();
  });

  return null;
}
