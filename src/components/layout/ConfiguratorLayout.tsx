'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import dynamic from 'next/dynamic';
import StepBar from '@/components/ui/StepBar';
import StepContent from '@/components/ui/StepContent';
import NavigationButtons from '@/components/ui/NavigationButtons';
import VizModeSelector from '@/components/ui/VizModeSelector';

const Scene = dynamic(() => import('@/components/three/Scene'), { ssr: false });

export default function ConfiguratorLayout() {
  const [panelWidth, setPanelWidth] = useState(420);
  const [panelVisible, setPanelVisible] = useState(true);
  const isDragging = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    isDragging.current = true;
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging.current || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      setPanelWidth(Math.max(320, Math.min(700, x)));
    };

    const handleMouseUp = () => {
      if (isDragging.current) {
        isDragging.current = false;
        document.body.style.cursor = '';
        document.body.style.userSelect = '';
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  return (
    <div ref={containerRef} className="h-screen flex overflow-hidden">
      {/* Left Input Panel */}
      <div
        className="flex-shrink-0 bg-white flex flex-col overflow-hidden border-r border-gray-200"
        style={{
          width: panelVisible ? panelWidth : 0,
          transition: isDragging.current ? 'none' : 'width 0.3s ease-out',
        }}
      >
        <StepBar />
        <div className="flex-1 overflow-y-auto min-h-0">
          <StepContent />
        </div>
        <NavigationButtons />
      </div>

      {/* Resize Handle */}
      {panelVisible && (
        <div
          className="w-1.5 flex-shrink-0 cursor-col-resize bg-gray-200 hover:bg-blue-400 active:bg-blue-500 transition-colors relative"
          onMouseDown={handleMouseDown}
        >
          <div className="absolute inset-y-0 -left-1.5 -right-1.5" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col gap-1 opacity-40">
            <div className="w-1 h-1 rounded-full bg-gray-600" />
            <div className="w-1 h-1 rounded-full bg-gray-600" />
            <div className="w-1 h-1 rounded-full bg-gray-600" />
          </div>
        </div>
      )}

      {/* Right 3D Viewport */}
      <div className="flex-1 relative bg-gradient-to-b from-gray-100 to-gray-300 min-w-0">
        <button
          onClick={() => setPanelVisible(!panelVisible)}
          className="absolute top-3 left-3 z-10 w-9 h-9 flex items-center justify-center
            bg-white/90 backdrop-blur-sm rounded-lg shadow-md border border-gray-200
            hover:bg-white hover:shadow-lg transition-all text-gray-600 hover:text-gray-900"
          title={panelVisible ? 'Hide panel' : 'Show panel'}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            {panelVisible
              ? <path d="M10 4L6 8L10 12" />
              : <path d="M6 4L10 8L6 12" />
            }
          </svg>
        </button>
        <Scene />
        <VizModeSelector />
      </div>
    </div>
  );
}
