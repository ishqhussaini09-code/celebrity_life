import { Project, Scene, CrewMember, CameraSetup, ShootDayResult } from './types';

function randInt(min: number, max: number) { return Math.floor(Math.random() * (max - min + 1)) + min; }

export function estimateCrewQuality(crew: CrewMember[]) {
  if (!crew.length) return 30;
  const avg = crew.reduce((s, c) => s + c.skill, 0) / crew.length;
  return Math.round(avg);
}

export function runShootDay(project: Project, scene: Scene, camera: CameraSetup | null): ShootDayResult {
  // Base cost: crew daily + scene complexity factor
  const crewDaily = project.crew.reduce((s, c) => s + c.dailyRate, 0);
  const complexityFactor = 1 + scene.complexity / 120;
  const pagesFactor = 1 + scene.pages / 10;
  let baseCost = Math.round((crewDaily * complexityFactor + 120 * pagesFactor));

  // Camera cost modifier
  let cameraCost = 0;
  let cameraPenalty = 0;
  if (camera) {
    cameraCost = Math.round(baseCost * (camera.costModifier ?? (camera.style === 'deep-focus' ? 0.45 : 0.12)));
    cameraPenalty = camera.style === 'deep-focus' ? 6 : camera.style === 'shallow-focus' ? -2 : 0;
  }

  const dayCost = baseCost + cameraCost;

  // Success roll influenced by crew skill and scene complexity; deep-focus gives quality boost but needs skill
  const crewQuality = estimateCrewQuality(project.crew);
  const difficulty = scene.complexity + scene.pages * 3 - (crewQuality / 2);
  const roll = randInt(1, 100) + (crewQuality / 8) - (difficulty / 8);

  let success = roll > 30; // baseline
  const qualityDelta = Math.round((roll / 10) + (camera ? (camera.style === 'deep-focus' ? 6 : 1) : 0) + (crewQuality / 15) - (scene.complexity / 30));

  const notes: string[] = [];
  if (randInt(1, 100) < 8) { notes.push('Weather delay'); }
  if (randInt(1, 100) < 5) { notes.push('Actor late, schedule pushed'); }
  if (camera?.style === 'deep-focus' && crewQuality < 45) { notes.push('Deep-focus struggled due to low DP skill'); }

  return { day: project.dayIndex + 1, cost: dayCost, success, qualityDelta: success ? Math.max(0, qualityDelta) : Math.min(0, qualityDelta), notes };
}

export function finalizeProject(project: Project) {
  // Simple commercial model: base box office from criticScore and budget
  const base = project.budget * (0.6 + project.criticScore / 200);
  const buzz = project.criticScore > 70 ? 1.6 : project.criticScore > 50 ? 1.1 : 0.7;
  const boxOffice = Math.round(base * buzz);
  return { boxOffice, criticScore: project.criticScore };
}
