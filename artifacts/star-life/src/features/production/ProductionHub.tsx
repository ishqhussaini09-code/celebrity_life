import React, { useEffect, useState } from 'react';
import { v4 as uuid } from 'uuid';
import type { Project, Scene, CrewMember, CameraSetup } from './types';
import { runShootDay, finalizeProject } from './productionUtils';
import './styles.css';

const STORAGE_KEY = 'production_projects_v1';

function sampleCrew(): CrewMember[] {
  return [
    { id: uuid(), name: 'Ava Director', role: 'Director', skill: 76, dailyRate: 600 },
    { id: uuid(), name: 'Sam DP', role: 'DP', skill: 62, dailyRate: 420 },
    { id: uuid(), name: 'Lina Gaffer', role: 'Gaffer', skill: 55, dailyRate: 220 },
    { id: uuid(), name: 'Chris Actor', role: 'Actor', skill: 58, dailyRate: 380 },
  ];
}

function sampleScenes() {
  return [
    { id: uuid(), name: 'Opening street', complexity: 48, pages: 3, preferredStyle: 'deep-focus' } as Scene,
    { id: uuid(), name: 'Apartment dialog', complexity: 30, pages: 2 },
    { id: uuid(), name: 'Climactic rooftop', complexity: 68, pages: 4, preferredStyle: 'deep-focus' } as Scene,
  ];
}

export default function ProductionHub() {
  const [projects, setProjects] = useState<Project[]>(() => {
    try { const raw = localStorage.getItem(STORAGE_KEY); return raw ? JSON.parse(raw) as Project[] : []; } catch { return []; }
  });
  const [selected, setSelected] = useState<string | null>(projects[0]?.id ?? null);
  const [log, setLog] = useState<string[]>([]);

  useEffect(() => { localStorage.setItem(STORAGE_KEY, JSON.stringify(projects)); }, [projects]);

  function createSample() {
    const p: Project = { id: uuid(), title: 'Indie Deep Focus', budget: 48000, daysPlanned: 6, crew: sampleCrew(), scenes: sampleScenes(), dayIndex: 0, spent: 0, criticScore: 50, completed: false };
    setProjects([p, ...projects]);
    setSelected(p.id);
  }

  function runNextDay() {
    if (!selected) return;
    const proj = projects.find(p => p.id === selected)!;
    if (proj.completed) return setLog(prev => ['Project already completed', ...prev]);
    const scene = proj.scenes[Math.min(proj.dayIndex, proj.scenes.length - 1)];
    // choose camera setup: prefer scene preference
    const camera: CameraSetup = { id: 'cam1', name: 'Standard Kit', lens: '50mm', aperture: 5.6, style: scene.preferredStyle ?? 'standard', costModifier: scene.preferredStyle === 'deep-focus' ? 0.45 : 0.12 };
    const res = runShootDay(proj, scene, camera);
    const updated: Project = { ...proj, dayIndex: proj.dayIndex + 1, spent: proj.spent + res.cost, criticScore: Math.min(100, proj.criticScore + res.qualityDelta) };
    if (updated.dayIndex >= proj.daysPlanned || updated.dayIndex >= proj.scenes.length) updated.completed = true;
    setProjects(projects.map(p => p.id === updated.id ? updated : p));
    setLog(prev => [`Day ${res.day}: cost ${res.cost} — Δquality ${res.qualityDelta} ${res.notes?.length ? ' | ' + res.notes.join(', ') : ''}`, ...prev].slice(0, 12));
  }

  function finalize(id: string) {
    const p = projects.find(x => x.id === id)!;
    const result = finalizeProject(p);
    setLog(prev => [`Finalized: boxOffice $${result.boxOffice.toLocaleString()} — critic ${result.criticScore}`, ...prev]);
  }

  return (
    <div className="production-root">
      <div className="production-left">
        <div className="prod-actions">
          <button onClick={createSample}>Create Sample Project</button>
        </div>
        <div className="project-list">
          {projects.map(p => (
            <div key={p.id} className={`project-item ${p.id === selected ? 'selected' : ''}`} onClick={() => setSelected(p.id)}>
              <div className="title">{p.title}</div>
              <div className="meta">Budget: ${p.budget.toLocaleString()} • Days: {p.daysPlanned} • Spent: ${p.spent}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="production-right">
        {selected ? (() => {
          const p = projects.find(x => x.id === selected)!;
          return (
            <div className="project-detail">
              <h3>{p.title}</h3>
              <div>Budget: ${p.budget.toLocaleString()} • Spent: ${p.spent.toLocaleString()}</div>
              <div>Days: {p.dayIndex}/{p.daysPlanned} • Critic: {p.criticScore}</div>
              <div className="scene-list">
                {p.scenes.map((s, i) => <div key={s.id} className="scene-row">{i+1}. {s.name} • Complexity {s.complexity} • Pages {s.pages} • Pref: {s.preferredStyle ?? 'standard'}</div>)}
              </div>
              <div className="controls">
                <button onClick={runNextDay} disabled={p.completed}>Run Next Day</button>
                <button onClick={() => finalize(p.id)}>Finalize Project</button>
                <button onClick={() => { navigator.clipboard?.writeText(JSON.stringify(p, null, 2)); alert('Project copied to clipboard'); }}>Export</button>
              </div>
            </div>
          );
        })() : <div className="empty">Select or create a project</div>}
        <div className="log">
          <h4>Production Log</h4>
          <ul>
            {log.map((l, i) => <li key={i}>{l}</li>)}
          </ul>
        </div>
      </div>
    </div>
  );
}
