import React, { useState, useCallback } from 'react';
import World from './components/World';
import InfoPanel from './components/InfoPanel';
import { BUILDINGS } from './constants';
import { BuildingData, GeminiResponse } from './types';
import { generateBuildingLore } from './services/geminiService';

const App: React.FC = () => {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [currentBuilding, setCurrentBuilding] = useState<BuildingData | null>(null);
  const [lore, setLore] = useState<GeminiResponse | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSelectBuilding = useCallback(async (id: string) => {
    if (id === selectedId) return;

    setSelectedId(id);
    const building = BUILDINGS.find(b => b.id === id) || null;
    setCurrentBuilding(building);
    setLore(null);

    if (building) {
      setLoading(true);
      const data = await generateBuildingLore(building);
      setLore(data);
      setLoading(false);
    }
  }, [selectedId]);

  const handleClosePanel = () => {
    setSelectedId(null);
    setCurrentBuilding(null);
  };

  return (
    <div className="relative w-full h-full bg-black">
      {/* 3D World */}
      <World selectedId={selectedId} onSelectBuilding={handleSelectBuilding} />

      {/* UI Overlay */}
      <div className="absolute top-6 left-6 z-10 pointer-events-none">
        <h1 className="text-4xl md:text-6xl font-sci-fi font-bold text-white tracking-tighter drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">
          SKY<span className="text-blue-500">ISLE</span>
        </h1>
        <p className="text-blue-200 font-mono text-sm md:text-base mt-2 max-w-xs drop-shadow-md">
          Colony Sector 7 // Select a structure to access archives.
        </p>
      </div>

      <InfoPanel
        building={currentBuilding}
        lore={lore}
        loading={loading}
        onClose={handleClosePanel}
      />

      {/* Instruction hint */}
      {!selectedId && (
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 text-white/50 text-sm font-mono animate-bounce pointer-events-none">
          Click on a building to explore
        </div>
      )}
    </div>
  );
};

export default App;