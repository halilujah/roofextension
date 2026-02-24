'use client';

import { useRef, useEffect, useState } from 'react';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useConfigStore } from '@/store/useConfigStore';
import { useShallow } from 'zustand/react/shallow';

const edgeMaterial = new THREE.LineBasicMaterial({
  color: '#333333',
  transparent: true,
  opacity: 0.6,
});

/**
 * Traverses the scene and renders EdgesGeometry outlines for all meshes.
 * Only rendered when vizMode === 'shadedEdges'.
 */
export default function EdgeOverlay() {
  const { scene } = useThree();
  const groupRef = useRef<THREE.Group>(null!);
  const [version, setVersion] = useState(0);

  // Track geometry-affecting store values to know when to rebuild edges
  const deps = useConfigStore(useShallow((s) => ({
    height: s.height,
    slopeAngle: s.slopeAngle,
    panelWidths: s.panelWidths,
    sidewallWidth: s.sidewallWidth,
    parapet: s.parapet,
    panelCount: s.panelCount,
  })));

  // Bump version when geometry deps change
  useEffect(() => {
    setVersion((v) => v + 1);
  }, [deps.height, deps.slopeAngle, deps.panelWidths, deps.sidewallWidth, deps.parapet, deps.panelCount]);

  // Build edges from current scene meshes
  useEffect(() => {
    const group = groupRef.current;
    if (!group) return;

    // Use requestAnimationFrame to ensure scene geometries are up to date
    const raf = requestAnimationFrame(() => {
      // Clear old edges
      while (group.children.length > 0) {
        const child = group.children[0];
        if (child instanceof THREE.LineSegments) {
          child.geometry.dispose();
        }
        group.remove(child);
      }

      scene.traverse((obj) => {
        if (!(obj instanceof THREE.Mesh)) return;
        if (!obj.geometry) return;
        // Don't add edges to the edge overlay group itself
        if ((obj as THREE.Object3D) === group) return;

        try {
          const edges = new THREE.EdgesGeometry(obj.geometry, 15);
          const line = new THREE.LineSegments(edges, edgeMaterial);
          obj.updateWorldMatrix(true, false);
          line.applyMatrix4(obj.matrixWorld);
          group.add(line);
        } catch {
          // Skip broken geometry
        }
      });
    });

    return () => cancelAnimationFrame(raf);
  }, [version, scene]);

  return <group ref={groupRef} />;
}
