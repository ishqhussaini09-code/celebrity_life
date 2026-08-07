import { createContext, useContext, useReducer, type Dispatch, type ReactNode } from 'react';

export type AppName =
  | 'home'
  | 'instafame' | 'viewtube' | 'chirp' | 'reeltok' | 'studio' | 'jetsetter' | 'bizmogul'
  | 'oscaraura' | 'justilaw' | 'darkos' | 'glowclinic' | 'rayamatch' | 'billionestate' | 'fanpulse'
  | 'starbank' | 'marketwatch' | 'cryptovault' | 'rentcontrol' | 'netstream' | 'maxplus'
  | 'boxoffice' | 'prcommand' | 'ndavault' | 'rehab' | 'boxingnight' | 'deepfakedesk'
  | 'swatshield' | 'botfarm' | 'trendlab' | 'paparazzi' | 'newswire' | 'contracts'
  | 'talenthouse' | 'healthos' | 'sleeplab' | 'nutrition' | 'styledesk' | 'autodrive'
  | 'travelsafe' | 'taxoffice' | 'charity' | 'fanclub' | 'eventpass' | 'securechat';
export type Tier = 'Z-List' | 'D-List' | 'C-List' | 'B-List' | 'A-List' | 'Global Icon';
export type ModalState = { title: string; body: string; risk?: string; primary: string; secondary?: string; onPrimary?: Action; onSecondary?: Action };

export type State = {
  money: number; fame: number; reputation: number; stress: number; health: number; looks: number;
  age: number; week: number; city: string; career: string; tier: Tier; followers: number;
  fanMood: number; cancelHeat: number; legalStatus: string; security: number; stalkerThreat: number;
  relationships: string[]; assets: string[]; properties: string[]; eventLog: string[];
  stories: number; adsense: number; brands: string[]; movies: number; albumSales: number; nominated: boolean;
  bankBalance: number; portfolio: number; cryptoExposure: number; debt: number; rent: number; inflation: number;
  lastWeeklyIncome: number; contentBurnout: number; algorithmFavor: number; deepfakeExposure: number;
  swatRisk: number; botSpend: number; prCredits: number; ndaCount: number; burnout: number;
  boxingWins: number; boxingLosses: number; streamingDeals: string[]; contractOffers: number;
  backendPoints: number; paparazziPressure: number; legalHeat: number; rehabWeeks: number;
  activeApp: AppName; modal: ModalState | null;
};

export type Action =
  | { type: 'CLOSE_MODAL' } | { type: 'OPEN_APP'; app: AppName } | { type: 'BACK_HOME' }
  | { type: 'ADVANCE_WEEK' } | { type: 'POST_STORY' } | { type: 'POST_FEED'; kind: string }
  | { type: 'BRAND_DEAL'; brand: string } | { type: 'UPLOAD'; mode: string } | { type: 'APOLOGY'; fake: boolean }
  | { type: 'BEEF'; rival: string } | { type: 'TREND'; kind: string } | { type: 'TRAVEL'; city: string }
  | { type: 'LAUNCH_BIZ'; kind: string; quality: number } | { type: 'NEGOTIATE'; push: number }
  | { type: 'STUNT'; accept: boolean } | { type: 'OSCAR'; outfit: number } | { type: 'LAW'; choice: string }
  | { type: 'DARKOS'; choice: string } | { type: 'SURGERY'; cost: number } | { type: 'DATE'; kind: string }
  | { type: 'ESTATE'; kind: string } | { type: 'BODYGUARD' } | { type: 'MODAL'; modal: ModalState }
  | { type: 'APP_LOOP'; app: AppName; choice: string };

const clamp = (n: number, min = 0, max = 100) => Math.max(min, Math.min(max, n));
const moneyFloor = (n: number) => Math.max(-50000, Math.round(n));
const tierFor = (fame: number, rep: number, reach: number): Tier => {
  const score = fame + rep * .58 + Math.log10(Math.max(1, reach)) * 4;
  if (score >= 210) return 'Global Icon'; if (score >= 157) return 'A-List'; if (score >= 112) return 'B-List';
  if (score >= 72) return 'C-List'; if (score >= 38) return 'D-List'; return 'Z-List';
};
const log = (s: State, message: string): State => ({ ...s, eventLog: [message, ...s.eventLog].slice(0, 12) });
const patch = (s: State, values: Partial<State>, message: string) => log({ ...s, ...values }, message);

export const initialState: State = {
  money: 620, fame: 23, reputation: 46, stress: 31, health: 78, looks: 54, age: 18, week: 4,
  city: 'Los Angeles', career: 'Open-call actor', tier: 'Z-List', followers: 1840, fanMood: 72, cancelHeat: 8,
  legalStatus: 'Clean record', security: 0, stalkerThreat: 9, relationships: [], assets: [], properties: [],
  eventLog: ['A casting assistant saved your profile for a midnight indie.', 'Welcome to StarOS. Every choice leaves a mark.'],
  stories: 0, adsense: 84, brands: [], movies: 0, albumSales: 0, nominated: false,
  bankBalance: 620, portfolio: 0, cryptoExposure: 0, debt: 0, rent: 1400, inflation: 4.8,
  lastWeeklyIncome: 84, contentBurnout: 22, algorithmFavor: 51, deepfakeExposure: 4, swatRisk: 5,
  botSpend: 0, prCredits: 2, ndaCount: 0, burnout: 31, boxingWins: 0, boxingLosses: 0,
  streamingDeals: [], contractOffers: 3, backendPoints: 0, paparazziPressure: 12, legalHeat: 7, rehabWeeks: 0,
  activeApp: 'home', modal: null,
};

function finish(s: State): State {
  return { ...s, money: moneyFloor(s.money), bankBalance: moneyFloor(s.bankBalance), tier: tierFor(s.fame, s.reputation, s.followers),
    stress: clamp(s.stress), health: clamp(s.health), reputation: clamp(s.reputation), fame: clamp(s.fame),
    cancelHeat: clamp(s.cancelHeat), algorithmFavor: clamp(s.algorithmFavor), burnout: clamp(s.burnout),
    contentBurnout: clamp(s.contentBurnout), deepfakeExposure: clamp(s.deepfakeExposure), swatRisk: clamp(s.swatRisk),
    legalHeat: clamp(s.legalHeat), paparazziPressure: clamp(s.paparazziPressure) };
}

function genericLoop(state: State, app: AppName, choice: string): State {
  const name = app.replace(/([a-z])([a-z]+)/, (_, a, b) => `${a.toUpperCase()}${b}`);
  const common = { burnout: state.burnout + 2, stress: state.stress + 2 };
  const outcomes: Record<string, Partial<State>> = {
    save: { money: state.money + 120, bankBalance: state.bankBalance + 120, reputation: state.reputation + 2 },
    invest: { money: state.money - 180, portfolio: state.portfolio + 220, fame: state.fame + 1 },
    insure: { money: state.money - 90, security: state.security + 4, swatRisk: state.swatRisk - 4 },
    publish: { fame: state.fame + 3, followers: state.followers + 320, algorithmFavor: state.algorithmFavor + 3, contentBurnout: state.contentBurnout + 5 },
    pause: { stress: state.stress - 8, burnout: state.burnout - 10, health: state.health + 3 },
    accept: { money: state.money + 360, contractOffers: state.contractOffers - 1, fame: state.fame + 4, ndaCount: state.ndaCount + 1 },
    decline: { reputation: state.reputation + 3, stress: state.stress - 3 },
    report: { deepfakeExposure: state.deepfakeExposure - 12, legalHeat: state.legalHeat + 1, reputation: state.reputation + 2 },
    block: { swatRisk: state.swatRisk - 12, money: state.money - 140, security: state.security + 3 },
    class: { health: state.health + 6, stress: state.stress - 6, money: state.money - 80 },
    night: { fame: state.fame + 5, followers: state.followers + 900, stress: state.stress + 9, paparazziPressure: state.paparazziPressure + 6 },
  };
  const delta = outcomes[choice] ?? { fame: state.fame + 1 };
  return patch(state, { ...common, ...delta }, `${name}: ${choice} logged. The signal will surface in the weekly report.`);
}

export function reducer(state: State, action: Action): State {
  let next = state;
  switch (action.type) {
    case 'OPEN_APP': return { ...state, activeApp: action.app };
    case 'BACK_HOME': return { ...state, activeApp: 'home', modal: null };
    case 'CLOSE_MODAL': return { ...state, modal: null };
    case 'POST_STORY': next = patch(state, { stories: state.stories + 1, fame: state.fame + 3, followers: state.followers + 112, stress: state.stress + 2, contentBurnout: state.contentBurnout + 3, algorithmFavor: state.algorithmFavor + 2 }, 'InstaFame: a late-night story made the audience feel close. It expires next week.'); break;
    case 'POST_FEED': {
      const honest = action.kind === 'honest';
      next = patch(state, { fame: state.fame + (honest ? 4 : 8), reputation: state.reputation + (honest ? 3 : -5), followers: state.followers + (honest ? 230 : 520), stress: state.stress + 3, contentBurnout: state.contentBurnout + (honest ? 2 : 8), algorithmFavor: state.algorithmFavor + (honest ? 2 : 6) }, `InstaFame: the ${honest ? 'honest post' : 'thirst trap'} moved through the feed. Expectation moved with it.`); break;
    }
    case 'BRAND_DEAL': {
      const values: Record<string, [number, number, number, number]> = { Perfume: [850, 5, 3, 0], 'Crypto wallet': [2200, 8, 17, 16], 'Detox tea': [460, 2, 7, 4], 'Betting house': [3200, 12, 22, 12] };
      const [cash, fame, risk, crypto] = values[action.brand] ?? [0, 0, 0, 0];
      next = patch(state, { money: state.money + cash, bankBalance: state.bankBalance + cash, fame: state.fame + fame, reputation: state.reputation - risk, cancelHeat: state.cancelHeat + risk, cryptoExposure: state.cryptoExposure + crypto, brands: [...state.brands, action.brand] }, `${action.brand} deal signed. Disclosure was optional in the brief; consequences are not.`);
      break;
    }
    case 'UPLOAD': next = patch(state, { fame: state.fame + (action.mode === 'safe' ? 4 : 12), followers: state.followers + (action.mode === 'safe' ? 340 : 1180), adsense: state.adsense + (action.mode === 'safe' ? 12 : -18), cancelHeat: state.cancelHeat + (action.mode === 'safe' ? 0 : 9), stress: state.stress + 4, contentBurnout: state.contentBurnout + (action.mode === 'safe' ? 3 : 11), algorithmFavor: state.algorithmFavor + (action.mode === 'safe' ? 2 : 8) }, `ViewTube: ${action.mode === 'safe' ? 'a polished rehearsal' : 'an unfiltered confession'} went live.`); break;
    case 'APOLOGY': next = patch(state, { fame: state.fame + 2, reputation: state.reputation + (action.fake ? -10 : 6), cancelHeat: state.cancelHeat + (action.fake ? 7 : -4), stress: state.stress + 6, algorithmFavor: state.algorithmFavor + (action.fake ? 4 : 1) }, action.fake ? 'Cancel Culture 2.0: the apology hit every algorithm. The tears were not real, and people noticed.' : 'Cancel Culture 2.0: you corrected the record without a script. The room cooled.'); break;
    case 'BEEF': next = patch(state, { fame: state.fame + 10, followers: state.followers + 2200, stress: state.stress + 14, reputation: state.reputation - 5, cancelHeat: state.cancelHeat + 4, legalHeat: state.legalHeat + 3 }, `Chirp: the public beef with ${action.rival} is now the only thing anyone is discussing.`); break;
    case 'TREND': {
      const success = action.kind === 'dance' || state.age < 24;
      next = patch(state, { fame: state.fame + (success ? 8 : 1), followers: state.followers + (success ? 4200 : 180), stress: state.stress + 7, reputation: state.reputation + (success ? 2 : -3), contentBurnout: state.contentBurnout + 8, algorithmFavor: state.algorithmFavor + (success ? 10 : -5) }, success ? `ReelTok: your ${action.kind} trend escaped the app.` : 'ReelTok: comments called you cringe. The clip is still climbing.');
      break;
    }
    case 'TRAVEL': {
      const cost = action.city === 'Tokyo' || action.city === 'Paris' ? 420 : 230;
      next = patch(state, { city: action.city, money: state.money - cost, stress: state.stress + 9, fame: state.fame + 2, paparazziPressure: state.paparazziPressure + 3 }, `JetSetter landed in ${action.city}. A local casting board has new names on it.`);
      break;
    }
    case 'LAUNCH_BIZ': {
      const good = action.quality >= 70;
      next = patch(state, { money: state.money - 3200, assets: [...state.assets, action.kind], reputation: state.reputation + (good ? 10 : -12), fame: state.fame + (good ? 7 : 1), cancelHeat: state.cancelHeat + (good ? 0 : 14) }, good ? `${action.kind} is unexpectedly excellent. Investors want a meeting.` : `${action.kind} launched undercooked. A reviewer called it a cash grab.`);
      break;
    }
    case 'NEGOTIATE': {
      const fired = action.push >= 3;
      next = patch(state, { money: fired ? state.money : state.money + 1200 + action.push * 700, fame: fired ? state.fame - 2 : state.fame + 9, reputation: state.reputation + (fired ? -8 : 3), movies: fired ? state.movies : state.movies + 1, backendPoints: state.backendPoints + (fired ? 0 : action.push * 2), contractOffers: Math.max(0, state.contractOffers - 1) }, fired ? 'Studio politics: you pushed one clause too far. The director withdrew the offer.' : 'Studio contract signed. Your backend points are small, but they are yours.');
      break;
    }
    case 'STUNT': next = patch(state, { health: state.health - (action.accept ? 18 : 2), fame: state.fame + (action.accept ? 6 : -3), stress: state.stress + 8 }, action.accept ? 'Studio: you took the dangerous stunt. The footage is astonishing; your shoulder is not.' : 'Studio: you refused the stunt. The role went to someone easier to insure.'); break;
    case 'OSCAR': {
      const win = state.movies + state.albumSales / 1000 + state.fame / 15 > 10;
      next = patch(state, { money: state.money - action.outfit, nominated: win, reputation: state.reputation + (win ? 16 : action.outfit > 25000 ? -12 : 2), fame: state.fame + (win ? 20 : action.outfit > 25000 ? -4 : 3), cancelHeat: state.cancelHeat + (!win && action.outfit > 25000 ? 12 : 0) }, win ? 'OscarAura: you won. The room stood before you did.' : 'OscarAura: no statue, but your restraint made every shortlist.');
      break;
    }
    case 'LAW': {
      const win = action.choice === 'lawyer' || state.stress < 60;
      next = patch(state, { money: state.money - (action.choice === 'lawyer' ? 1800 : 0), legalStatus: win ? 'Case dismissed' : 'Court ordered probation', reputation: state.reputation + (win ? 4 : -12), fame: win ? state.fame : state.fame - 6, stress: state.stress - 8, legalHeat: state.legalHeat + (win ? -3 : 12) }, win ? 'JustiLaw: the expensive lawyer found the missing timestamp.' : 'JustiLaw: the judge found you liable. Your team is in damage control.');
      break;
    }
    case 'DARKOS': next = patch(state, action.choice === 'booster' ? { money: state.money - 900, health: state.health - 20, fame: state.fame + 5, stress: state.stress + 12, cancelHeat: state.cancelHeat + 10 } : { fame: state.fame + 8, stress: state.stress + 18, cancelHeat: state.cancelHeat + 18, reputation: state.reputation - 14, legalStatus: 'Under quiet investigation' }, `DarkOS: fictional underground politics logged — ${action.choice}. No real-world service or instructions are involved.`); break;
    case 'SURGERY': next = patch(state, { money: state.money - action.cost, looks: state.looks + (action.cost / 10000) * 3, fame: state.fame + (action.cost > 30000 ? 5 : 1), health: state.health - 4 }, 'GlowClinic: the recovery is private, the new face is not.'); break;
    case 'DATE': next = patch(state, { relationships: [...state.relationships, action.kind], fame: state.fame + (action.kind === 'PR stunt' ? 12 : 2), stress: state.stress + (action.kind === 'PR stunt' ? 13 : 3), reputation: state.reputation + (action.kind === 'PR stunt' ? -3 : 4) }, `${action.kind} date logged. The cameras had their own reservation.`); break;
    case 'ESTATE': {
      const cost = action.kind === 'Mansion' ? 28000 : 8500;
      next = patch(state, { money: state.money - cost, properties: [...state.properties, action.kind], rent: state.rent + (action.kind === 'Mansion' ? 900 : 420), security: state.security + (action.kind === 'Mansion' ? 12 : 6), stalkerThreat: state.stalkerThreat - 4 }, `${action.kind} acquired. Your address now has a gate, and a larger weekly bill.`);
      break;
    }
    case 'BODYGUARD': next = patch(state, { money: state.money - 1400, security: state.security + 18, stalkerThreat: state.stalkerThreat - 8, swatRisk: state.swatRisk - 5 }, 'A former close-protection officer joined your orbit.'); break;
    case 'APP_LOOP': next = genericLoop(state, action.app, action.choice); break;
    case 'ADVANCE_WEEK': {
      const rentDue = Math.round(state.rent * (1 + state.inflation / 100));
      const income = state.adsense + state.assets.length * 280 + state.streamingDeals.length * 420 + state.portfolio * .012;
      const expenses = rentDue + state.debt * .015 + (state.security > 0 ? 110 : 0);
      const cryptoLoss = state.cryptoExposure > 0 && state.week % 4 === 0 ? Math.round(state.cryptoExposure * .2) : 0;
      const net = Math.round(income - expenses - cryptoLoss);
      const overload = state.stress > 70 || state.burnout > 70;
      next = log({ ...state, week: state.week + 1, age: state.week % 52 === 51 ? state.age + 1 : state.age, money: state.money + net, bankBalance: state.bankBalance + net, lastWeeklyIncome: net, portfolio: Math.max(0, state.portfolio - cryptoLoss), debt: state.debt + (net < 0 ? Math.abs(net) * .15 : 0), stress: clamp(state.stress - 5 + (overload ? 9 : 0)), burnout: clamp(state.burnout - 5 + state.contentBurnout * .08), contentBurnout: clamp(state.contentBurnout - 4), health: clamp(state.health - (overload ? 5 : 1)), stalkerThreat: clamp(state.stalkerThreat + (state.fame > 65 ? 3 : 0)), cancelHeat: clamp(state.cancelHeat - 2), paparazziPressure: clamp(state.paparazziPressure + (state.fame > 65 ? 2 : 0)), inflation: Math.min(14, state.inflation + (state.week % 8 === 0 ? .2 : 0)), stories: 0, nominated: state.week % 52 === 51 && state.movies > 0 }, net < 0 ? `Week ${state.week + 1}: inflation-adjusted rent and debt interest outpaced income by ${Math.abs(net).toFixed(0)}.` : `Week ${state.week + 1}: income ${Math.round(income)} cleared expenses ${Math.round(expenses)}. The industry kept watching.`);
      break;
    }
    case 'MODAL': return { ...state, modal: action.modal };
  }
  return finish(next);
}

const GameContext = createContext<{ state: State; dispatch: Dispatch<Action> } | null>(null);
export function GameProvider({ children }: { children: ReactNode }) { const [state, dispatch] = useReducer(reducer, initialState); return <GameContext.Provider value={{ state, dispatch }}>{children}</GameContext.Provider>; }
export function useGame() { const ctx = useContext(GameContext); if (!ctx) throw new Error('useGame must be used inside GameProvider'); return ctx; }