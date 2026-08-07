import { createContext, useContext, useReducer, type Dispatch, type ReactNode } from 'react';

export type AppName = 'home' | 'instafame' | 'viewtube' | 'chirp' | 'reeltok' | 'studio' | 'jetsetter' | 'bizmogul' | 'oscaraura' | 'justilaw' | 'darkos' | 'glowclinic' | 'rayamatch' | 'billionestate' | 'fanpulse';
export type Tier = 'Z-List' | 'D-List' | 'C-List' | 'B-List' | 'A-List' | 'Global Icon';

export type State = {
  money: number; fame: number; reputation: number; stress: number; health: number; looks: number;
  age: number; week: number; city: string; career: string; tier: Tier; followers: number;
  fanMood: number; cancelHeat: number; legalStatus: string; security: number; stalkerThreat: number;
  relationships: string[]; assets: string[]; properties: string[]; eventLog: string[];
  stories: number; adsense: number; brands: string[]; movies: number; albumSales: number; nominated: boolean;
  activeApp: AppName; modal: { title: string; body: string; risk?: string; primary: string; secondary?: string; onPrimary?: Action; onSecondary?: Action } | null;
};
export type Action =
  | { type: 'CLOSE_MODAL' } | { type: 'OPEN_APP'; app: AppName } | { type: 'BACK_HOME' }
  | { type: 'ADVANCE_WEEK' } | { type: 'POST_STORY' } | { type: 'POST_FEED'; kind: string }
  | { type: 'BRAND_DEAL'; brand: string } | { type: 'UPLOAD'; mode: string } | { type: 'APOLOGY'; fake: boolean }
  | { type: 'BEEF'; rival: string } | { type: 'TREND'; kind: string } | { type: 'TRAVEL'; city: string }
  | { type: 'LAUNCH_BIZ'; kind: string; quality: number } | { type: 'NEGOTIATE'; push: number }
  | { type: 'STUNT'; accept: boolean } | { type: 'OSCAR'; outfit: number } | { type: 'LAW'; choice: string }
  | { type: 'DARKOS'; choice: string } | { type: 'SURGERY'; cost: number } | { type: 'DATE'; kind: string }
  | { type: 'ESTATE'; kind: string } | { type: 'BODYGUARD' }
  | { type: 'MODAL'; modal: NonNullable<State['modal']> };

const clamp = (n: number, min = 0, max = 100) => Math.max(min, Math.min(max, n));
const tierFor = (fame: number, rep: number): Tier => {
  const score = fame + rep * .6;
  if (score >= 190) return 'Global Icon'; if (score >= 135) return 'A-List'; if (score >= 95) return 'B-List';
  if (score >= 60) return 'C-List'; if (score >= 30) return 'D-List'; return 'Z-List';
};
const log = (s: State, message: string) => ({ ...s, eventLog: [message, ...s.eventLog].slice(0, 8) });

export const initialState: State = {
  money: 620, fame: 23, reputation: 46, stress: 31, health: 78, looks: 54, age: 18, week: 4,
  city: 'Los Angeles', career: 'Open-call actor', tier: 'Z-List', followers: 1840, fanMood: 72, cancelHeat: 8,
  legalStatus: 'Clean record', security: 0, stalkerThreat: 9, relationships: [], assets: [], properties: [],
  eventLog: ['A casting assistant saved your profile for a midnight indie.', 'Welcome to Star Life. Every choice leaves a mark.'],
  stories: 0, adsense: 84, brands: [], movies: 0, albumSales: 0, nominated: false, activeApp: 'home', modal: null,
};

export function reducer(state: State, action: Action): State {
  let next = state;
  switch (action.type) {
    case 'OPEN_APP': return { ...state, activeApp: action.app };
    case 'BACK_HOME': return { ...state, activeApp: 'home', modal: null };
    case 'CLOSE_MODAL': return { ...state, modal: null };
    case 'POST_STORY': next = log({ ...state, stories: state.stories + 1, fame: state.fame + 3, followers: state.followers + 112, stress: state.stress + 2 }, 'A late-night story made your followers feel close. It expires next week.'); break;
    case 'POST_FEED': next = log({ ...state, fame: state.fame + (action.kind === 'honest' ? 4 : 7), reputation: state.reputation + (action.kind === 'honest' ? 3 : -4), followers: state.followers + (action.kind === 'honest' ? 230 : 470), stress: state.stress + 3 }, `InstaFame: ${action.kind === 'honest' ? 'the honest post' : 'the thirst trap'} is moving through the feed.`); break;
    case 'BRAND_DEAL': {
      const values: Record<string, [number, number, number]> = { Perfume: [850, 5, 3], 'Crypto wallet': [2200, 8, 17], 'Detox tea': [460, 2, 7] };
      const [cash, fame, risk] = values[action.brand] ?? [0, 0, 0];
      next = log({ ...state, money: state.money + cash, fame: state.fame + fame, reputation: state.reputation - risk, cancelHeat: state.cancelHeat + risk, brands: [...state.brands, action.brand] }, `${action.brand} deal signed. The money is clean; the terms are not.`);
      break;
    }
    case 'UPLOAD': next = log({ ...state, fame: state.fame + (action.mode === 'safe' ? 4 : 12), followers: state.followers + (action.mode === 'safe' ? 340 : 1180), adsense: state.adsense + (action.mode === 'safe' ? 12 : -18), cancelHeat: state.cancelHeat + (action.mode === 'safe' ? 0 : 9), stress: state.stress + 4 }, `ViewTube upload: ${action.mode === 'safe' ? 'a polished rehearsal' : 'an unfiltered confession'} went live.`); break;
    case 'APOLOGY': next = log({ ...state, fame: state.fame + 2, reputation: state.reputation + (action.fake ? -10 : 6), cancelHeat: state.cancelHeat + (action.fake ? 7 : -4), stress: state.stress + 6 }, action.fake ? 'The apology hit every algorithm. The tears were not real, and people noticed.' : 'You apologized without a script. The internet gave you a second chance.'); break;
    case 'BEEF': next = log({ ...state, fame: state.fame + 10, followers: state.followers + 2200, stress: state.stress + 14, reputation: state.reputation - 5, cancelHeat: state.cancelHeat + 4 }, `Chirp beef with ${action.rival} is now the only thing anyone is discussing.`); break;
    case 'TREND': {
      const success = action.kind === 'dance' || state.age < 24;
      next = log({ ...state, fame: state.fame + (success ? 8 : 1), followers: state.followers + (success ? 4200 : 180), stress: state.stress + 7, reputation: state.reputation + (success ? 2 : -3) }, success ? `ReelTok: your ${action.kind} trend escaped the app.` : 'ReelTok comments called you cringe. The clip is still climbing.');
      break;
    }
    case 'TRAVEL': {
      const cost = action.city === 'Tokyo' || action.city === 'Paris' ? 420 : 230;
      next = log({ ...state, city: action.city, money: state.money - cost, stress: state.stress + 9, fame: state.fame + 2 }, `JetSetter landed in ${action.city}. A local casting board has new names on it.`);
      break;
    }
    case 'LAUNCH_BIZ': {
      const cost = 3200;
      const good = action.quality >= 70;
      next = log({ ...state, money: state.money - cost, assets: [...state.assets, action.kind], reputation: state.reputation + (good ? 10 : -12), fame: state.fame + (good ? 7 : 1), cancelHeat: state.cancelHeat + (good ? 0 : 14) }, good ? `${action.kind} is unexpectedly excellent. Investors want a meeting.` : `${action.kind} launched undercooked. A reviewer called it a cash grab.`);
      break;
    }
    case 'NEGOTIATE': {
      const fired = action.push >= 3;
      next = log({ ...state, money: fired ? state.money : state.money + 1200 + action.push * 700, fame: fired ? state.fame - 2 : state.fame + 9, reputation: state.reputation + (fired ? -8 : 3), movies: fired ? state.movies : state.movies + 1 }, fired ? 'You pushed one clause too far. The director withdrew the offer.' : 'Contract signed. Your backend points are small, but they are yours.');
      break;
    }
    case 'STUNT': next = log({ ...state, health: state.health - (action.accept ? 18 : 2), fame: state.fame + (action.accept ? 6 : -3), stress: state.stress + 8 }, action.accept ? 'You took the dangerous stunt. The footage is astonishing; your shoulder is not.' : 'You refused the stunt. The role went to someone easier to insure.'); break;
    case 'OSCAR': {
      const win = state.movies + state.albumSales / 1000 + state.fame / 15 > 10;
      next = log({ ...state, money: state.money - action.outfit, nominated: win, reputation: state.reputation + (win ? 16 : action.outfit > 25000 ? -12 : 2), fame: state.fame + (win ? 20 : action.outfit > 25000 ? -4 : 3), cancelHeat: state.cancelHeat + (!win && action.outfit > 25000 ? 12 : 0) }, win ? 'OscarAura: you won. The room stood before you did.' : action.outfit > 25000 ? 'OscarAura: the look was expensive. The verdict was worst dressed.' : 'OscarAura: no statue, but your restraint made every shortlist.');
      break;
    }
    case 'LAW': {
      const win = action.choice === 'lawyer' || state.stress < 60;
      next = log({ ...state, money: state.money - (action.choice === 'lawyer' ? 1800 : 0), legalStatus: win ? 'Case dismissed' : 'Court ordered probation', reputation: state.reputation + (win ? 4 : -12), fame: win ? state.fame : Math.max(0, state.fame - 6), stress: Math.max(0, state.stress - 8) }, win ? 'JustiLaw: the expensive lawyer found the missing timestamp.' : 'JustiLaw: the judge found you liable. Your team is in damage control.');
      break;
    }
    case 'DARKOS': {
      const delta = action.choice === 'booster' ? { money: -900, health: -20, fame: 5, stress: 12, cancelHeat: 10 } : { fame: 8, stress: 18, cancelHeat: 18 };
      next = log({ ...state, ...delta, legalStatus: 'Under quiet investigation', reputation: state.reputation - 14 }, `DarkOS: fictional underworld contact confirmed — ${action.choice}. The risk is no longer theoretical.`);
      break;
    }
    case 'SURGERY': next = log({ ...state, money: state.money - action.cost, looks: clamp(state.looks + (action.cost / 10000) * 3), fame: state.fame + (action.cost > 30000 ? 5 : 1), health: state.health - 4 }, 'GlowClinic: the recovery is private, the new face is not.'); break;
    case 'DATE': next = log({ ...state, relationships: [...state.relationships, action.kind], fame: state.fame + (action.kind === 'PR stunt' ? 12 : 2), stress: state.stress + (action.kind === 'PR stunt' ? 13 : 3), reputation: state.reputation + (action.kind === 'PR stunt' ? -3 : 4) }, `${action.kind} date logged. The cameras had their own reservation.`); break;
    case 'ESTATE': {
      const cost = action.kind === 'Mansion' ? 28000 : 8500;
      next = log({ ...state, money: state.money - cost, properties: [...state.properties, action.kind], security: state.security + (action.kind === 'Mansion' ? 12 : 6), stalkerThreat: Math.max(0, state.stalkerThreat - 4) }, `${action.kind} acquired. Your address now has a gate.`);
      break;
    }
    case 'BODYGUARD': next = log({ ...state, money: state.money - 1400, security: state.security + 18, stalkerThreat: Math.max(0, state.stalkerThreat - 8) }, 'A former close-protection officer joined your orbit.'); break;
    case 'ADVANCE_WEEK': {
      const stalker = state.fame > 65 && state.security < 10;
      const newAge = state.week % 52 === 51 ? state.age + 1 : state.age;
      next = log({ ...state, week: state.week + 1, age: newAge, money: state.money + state.adsense + state.assets.length * 280, stress: clamp(state.stress - 5 + (stalker ? 12 : 0)), health: clamp(state.health - (state.stress > 70 ? 5 : 1)), stalkerThreat: clamp(state.stalkerThreat + (state.fame > 65 ? 3 : 0)), stories: 0, tier: tierFor(state.fame, state.reputation), nominated: state.week % 52 === 51 && state.movies > 0 }, stalker ? 'Week turned: a fan found your hotel. Security is now a career expense.' : `Week ${state.week + 1}: rent cleared, trends shifted, and the industry kept watching.`);
      break;
    }
    case 'MODAL': return { ...state, modal: action.modal };
  }
  return { ...next, tier: tierFor(next.fame, next.reputation) };
}

const GameContext = createContext<{ state: State; dispatch: Dispatch<Action> } | null>(null);
export function GameProvider({ children }: { children: ReactNode }) { const [state, dispatch] = useReducer(reducer, initialState); return <GameContext.Provider value={{ state, dispatch }}>{children}</GameContext.Provider>; }
export function useGame() { const ctx = useContext(GameContext); if (!ctx) throw new Error('useGame must be used inside GameProvider'); return ctx; }