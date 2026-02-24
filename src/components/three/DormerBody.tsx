'use client';

import { useMemo } from 'react';
import * as THREE from 'three';
import { useConfigStore } from '@/store/useConfigStore';
import { useShallow } from 'zustand/react/shallow';
import { cmToM, calcTotalWidth, calcWindowPositions } from '@/lib/geometry';

export default function DormerBody() {
  const { height, parapet, panelWidths, sidewallWidth, colors, vizMode } = useConfigStore(useShallow((s) => ({
    height: s.height,
    parapet: s.parapet,
    panelWidths: s.panelWidths,
    sidewallWidth: s.sidewallWidth,
    colors: s.colors,
    vizMode: s.vizMode,
  })));

  const heightM = cmToM(height);
  const totalWidthM = calcTotalWidth(panelWidths, sidewallWidth);
  const dormerH = heightM;

  // Window dimensions (must match WindowSection logic)
  const windowTop = dormerH * 0.88;
  const windowBottom = cmToM(parapet) + 0.05;
  const windows = calcWindowPositions(panelWidths, sidewallWidth);

  // Build shape with window cutouts
  const geometry = useMemo(() => {
    const hw = totalWidthM / 2;
    const hh = heightM / 2;

    // Outer rectangle (centered at origin — mesh is positioned at heightM/2)
    const shape = new THREE.Shape();
    shape.moveTo(-hw, -hh);
    shape.lineTo(hw, -hh);
    shape.lineTo(hw, hh);
    shape.lineTo(-hw, hh);
    shape.lineTo(-hw, -hh);

    // Punch window holes
    for (const w of windows) {
      const frameWidthM = cmToM(w.width) * 0.85;
      const wLeft = w.x - frameWidthM / 2;
      const wRight = w.x + frameWidthM / 2;
      // Window coords relative to mesh center (which is at heightM/2)
      const wBot = windowBottom - hh;
      const wTop = windowTop - hh;

      const hole = new THREE.Path();
      hole.moveTo(wLeft, wBot);
      hole.lineTo(wRight, wBot);
      hole.lineTo(wRight, wTop);
      hole.lineTo(wLeft, wTop);
      hole.lineTo(wLeft, wBot);
      shape.holes.push(hole);
    }

    const geo = new THREE.ShapeGeometry(shape);
    // Compute UVs for texture mapping (normalize to 0-1 range over the full wall)
    const pos = geo.attributes.position;
    const uvs = new Float32Array(pos.count * 2);
    for (let i = 0; i < pos.count; i++) {
      uvs[i * 2] = (pos.getX(i) + hw) / totalWidthM;
      uvs[i * 2 + 1] = (pos.getY(i) + hh) / heightM;
    }
    geo.setAttribute('uv', new THREE.BufferAttribute(uvs, 2));

    return geo;
  }, [totalWidthM, heightM, windowTop, windowBottom, windows]);

  // Cladding texture – realistic horizontal lap siding
  const claddingTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d')!;

    ctx.fillStyle = '#c8c8c8';
    ctx.fillRect(0, 0, 512, 1024);

    const boardHeight = 48;
    for (let y = 0; y < 1024; y += boardHeight) {
      const bVar = Math.random() * 20 - 10;
      const base = 180 + bVar;

      const gradient = ctx.createLinearGradient(0, y + 3, 0, y + boardHeight - 3);
      gradient.addColorStop(0, `rgb(${base + 12}, ${base + 12}, ${base + 10})`);
      gradient.addColorStop(0.7, `rgb(${base}, ${base}, ${base - 2})`);
      gradient.addColorStop(1, `rgb(${base - 8}, ${base - 8}, ${base - 10})`);
      ctx.fillStyle = gradient;
      ctx.fillRect(0, y + 3, 512, boardHeight - 4);

      for (let g = 0; g < 4; g++) {
        const gy = y + 6 + Math.random() * (boardHeight - 12);
        ctx.fillStyle = `rgba(0, 0, 0, ${0.03 + Math.random() * 0.04})`;
        ctx.fillRect(0, gy, 512, 1);
      }

      ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
      ctx.fillRect(0, y + boardHeight - 2, 512, 2);
      ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
      ctx.fillRect(0, y + boardHeight, 512, 1);

      ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
      ctx.fillRect(0, y + 3, 512, 1);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.12)';
      ctx.fillRect(0, y + 4, 512, 1);
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(totalWidthM * 1.5, heightM * 2.5);
    return tex;
  }, [totalWidthM, heightM]);

  const useTexture = vizMode === 'realistic' || vizMode === 'textured';

  return (
    <mesh
      geometry={geometry}
      position={[0, heightM / 2, 0]}
      castShadow
      receiveShadow
    >
      <meshStandardMaterial
        color={colors.frontAndSides}
        map={useTexture ? claddingTexture : null}
        roughness={useTexture ? 0.75 : 0.6}
        metalness={0.05}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}
