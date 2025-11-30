import React from 'react';
import { BuildingData, GeminiResponse } from '../types';

interface InfoPanelProps {
  building: BuildingData | null;
  lore: GeminiResponse | null;
  loading: boolean;
  onClose: () => void;
}

const InfoPanel: React.FC<InfoPanelProps> = ({ building, lore, loading, onClose }) => {
  if (!building) return null;

  return (
    <div className="absolute right-0 top-0 bottom-0 w-full sm:w-96 bg-black/80 border-l border-white/10 backdrop-blur-md p-8 z-10 text-white shadow-2xl overflow-y-auto transform transition-transform duration-300 ease-in-out">
      
      {/* Header */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <h2 className="text-3xl font-sci-fi font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 uppercase tracking-widest">
            {building.name}
          </h2>
          <span className="text-xs font-mono text-gray-400 mt-1 block">ID: {building.id.toUpperCase()}</span>
        </div>
        <button 
          onClick={onClose}
          className="text-gray-400 hover:text-white transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-12 space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          <p className="font-mono text-sm text-blue-300 animate-pulse">DECRYPTING ARCHIVES...</p>
        </div>
      )}

      {/* Content */}
      {!loading && lore && (
        <div className="space-y-6 animate-fadeIn">
          {/* Status Indicator */}
          <div className="flex items-center space-x-3 bg-white/5 p-3 rounded-lg border border-white/10">
            <div className={`h-3 w-3 rounded-full ${
              lore.status === 'operational' ? 'bg-green-500 shadow-[0_0_10px_#22c55e]' :
              lore.status === 'damaged' ? 'bg-red-500 shadow-[0_0_10px_#ef4444]' :
              lore.status === 'upgrading' ? 'bg-yellow-500 shadow-[0_0_10px_#eab308]' :
              'bg-gray-500'
            }`}></div>
            <span className="font-mono text-sm uppercase tracking-wider">
              Status: <span className={
                lore.status === 'operational' ? 'text-green-400' :
                lore.status === 'damaged' ? 'text-red-400' :
                lore.status === 'upgrading' ? 'text-yellow-400' :
                'text-gray-400'
              }>{lore.status}</span>
            </span>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider font-sci-fi">Log Entry</h3>
            <p className="font-body text-lg leading-relaxed text-gray-200">
              {lore.description}
            </p>
          </div>

          <div className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 p-4 rounded-lg border-l-4 border-purple-500">
            <h3 className="text-xs font-bold text-purple-400 uppercase tracking-wider mb-2 flex items-center">
              <span className="mr-2">🔒</span> Classified Rumor
            </h3>
            <p className="font-mono text-sm text-purple-200 italic">
              "{lore.secret}"
            </p>
          </div>

          <div className="pt-8 border-t border-white/10">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="bg-white/5 p-3 rounded">
                <div className="text-xs text-gray-500 uppercase">Energy Output</div>
                <div className="text-xl font-bold font-sci-fi text-blue-400">98.4%</div>
              </div>
              <div className="bg-white/5 p-3 rounded">
                <div className="text-xs text-gray-500 uppercase">Personnel</div>
                <div className="text-xl font-bold font-sci-fi text-blue-400">1,240</div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {!loading && !lore && (
         <div className="text-center text-gray-500 py-10 font-mono">
           No data available.
         </div>
      )}

    </div>
  );
};

export default InfoPanel;