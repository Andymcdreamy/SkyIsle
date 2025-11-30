export enum BuildingType {
  TOWER = 'TOWER',
  DOMES = 'DOMES',
  FACTORY = 'FACTORY',
  PORT = 'PORT',
  HUB = 'HUB'
}

export interface BuildingData {
  id: string;
  name: string;
  type: BuildingType;
  position: [number, number, number];
  rotation?: [number, number, number];
  color: string;
  scale?: [number, number, number];
  baseDescription: string; // Fallback or initial context for Gemini
}

export interface GeminiResponse {
  description: string;
  secret: string;
  status: 'operational' | 'damaged' | 'unknown' | 'upgrading';
}