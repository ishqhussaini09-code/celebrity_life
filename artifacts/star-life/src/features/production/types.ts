export type CameraStyle = 'deep-focus' | 'standard' | 'shallow-focus';

export type CameraSetup = {
  id: string;
  name: string;
  lens: string; // e.g. 35mm, 50mm
  aperture: number; // f-stop
  style: CameraStyle;
  costModifier?: number; // extra cost multiplier for complex setups
};

export type CrewMember = {
  id: string;
  name: string;
  role: 'Director' | 'DP' | 'Gaffer' | 'PA' | 'Actor' | 'Editor';
  skill: number; // 0-100
  dailyRate: number;
};

export type Scene = {
  id: string;
  name: string;
  complexity: number; // 1-100
  pages: number; // shooting length proxy
  preferredStyle?: CameraStyle;
};

export type Project = {
  id: string;
  title: string;
  budget: number;
  daysPlanned: number;
  crew: CrewMember[];
  scenes: Scene[];
  dayIndex: number; // progress
  spent: number;
  criticScore: number; // 0-100
  completed: boolean;
};

export type ShootDayResult = {
  day: number;
  cost: number;
  success: boolean;
  qualityDelta: number;
  notes?: string[];
};
