export interface TimerState {
  isRunning: boolean;
  isPaused: boolean;
  mode: 'work' | 'break';
  timeLeft: number;
  totalTime: number;
  completedSessions: number;
}

export interface PlantState {
  level: number;
  totalPoints: number;
  currentStage: PlantStage;
}

export interface PlantStage {
  stage: 'seed' | 'sprout' | 'sapling' | 'young' | 'mature' | 'elder';
  minPoints: number;
  maxPoints: number;
  height: number;
  branches: number;
  leaves: number;
}

// Enhanced ecosystem types
export interface EcosystemElement {
  id: string;
  type:
    | 'grass'
    | 'sprite'
    | 'tree'
    | 'ant'
    | 'butterfly'
    | 'bee'
    | 'flower'
    | 'mushroom'
    | 'rock';
  position: [number, number, number];
  scale: number;
  rotation: [number, number, number];
  birthTime: number;
  isAlive: boolean;
}

export interface TerrainData {
  id: string;
  x: number;
  z: number;
  size: number;
  growth: number;
  elements: EcosystemElement[];
  biome: 'forest' | 'meadow' | 'garden' | 'wilderness';
  fertility: number;
}

export interface EcosystemState {
  terrains: TerrainData[];
  totalBiodiversity: number;
  activeElements: number;
  ecosystemHealth: number;
}

export interface AppSettings {
  workDuration: number; // in minutes
  breakDuration: number; // in minutes
  longBreakDuration: number; // in minutes
  sessionsUntilLongBreak: number;
  soundEnabled: boolean;
  notificationsEnabled: boolean;
  pointsPerSession: number;
  ecosystemSpeed: number;
  renderQuality: 'low' | 'medium' | 'high';
}

export interface UserProgress {
  totalStudyTime: number; // in minutes
  totalSessions: number;
  streak: number;
  lastStudyDate: string;
  achievements: Achievement[];
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  unlockedAt: string;
  icon: string;
}
