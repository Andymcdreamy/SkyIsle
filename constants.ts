import { BuildingData, BuildingType } from './types';

export const BUILDINGS: BuildingData[] = [
  {
    id: 'b1',
    name: 'The Astral Spire',
    type: BuildingType.TOWER,
    position: [0, 4, 0],
    color: '#60A5FA', // Blue
    scale: [1, 1, 1],
    baseDescription: "The central communication tower connecting the island to the Galactic Web."
  },
  {
    id: 'b2',
    name: 'Bio-Domes Alpha',
    type: BuildingType.DOMES,
    position: [5, 1, 4],
    color: '#34D399', // Green
    scale: [0.8, 0.8, 0.8],
    baseDescription: "Contains the last remaining flora samples from Old Earth."
  },
  {
    id: 'b3',
    name: 'Quantum Foundry',
    type: BuildingType.FACTORY,
    position: [-4, 1.5, 3],
    rotation: [0, Math.PI / 4, 0],
    color: '#F87171', // Red
    scale: [1.2, 1, 1],
    baseDescription: "Processes stardust into usable energy cells."
  },
  {
    id: 'b4',
    name: 'Sky Harbor',
    type: BuildingType.PORT,
    position: [3, 0.5, -5],
    rotation: [0, -Math.PI / 6, 0],
    color: '#FBBF24', // Yellow
    scale: [1, 1, 1],
    baseDescription: "Docking bay for incoming supply drones and star-skiffs."
  },
  {
    id: 'b5',
    name: 'The Archive Core',
    type: BuildingType.HUB,
    position: [-3, 1, -3],
    color: '#A78BFA', // Purple
    scale: [0.9, 0.9, 0.9],
    baseDescription: "A secure vault storing the history of the colony."
  }
];