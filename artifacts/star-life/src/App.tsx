/* Modified App.tsx: add ProductionHub toggle inside Studio view */
import { useState, type ReactNode } from 'react';
import { GameProvider, useGame, type AppName } from './state/game';
import { AppHeader, Button, Choice, Metric, Modal, Panel, SectionTitle } from './components/primitives';
import {
  Activity, Aperture, ArrowUpRight, Award, Banknote, Bike, BriefcaseBusiness, Building2, Camera,
  ChartNoAxesCombined, Check, Clapperboard, CloudSun, Coins, Crown, FileKey2, Film, Gavel, Heart,
  House, Landmark, LockKeyhole, MapPin, Megaphone, Moon, Newspaper, PartyPopper, PiggyBank, Play,
  Radio, ReceiptText, ScanFace, Shield, Shirt, Smartphone, Sparkles, Star, Stethoscope, TrendingUp,
  UserRound, Users, Video, WalletCards, Wifi, Youtube, Zap,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import ProductionHub from './features/production/ProductionHub';

const money = (n: number) => `${n < 0 ? '-' : ''}$${Math.abs(Math.round(n)).toLocaleString()}`;
const compact = (n: number) => n > 999999 ? `${(n / 1000000).toFixed(1)}M` : n > 999 ? `${(n / 1000).toFixed(1)}K` : n.toString();

type AppMeta = { id: AppName; name: string; note: string; icon: LucideIcon; color: string; group: string };
const apps: AppMeta[] = [
  ['instafame','InstaFame','social',Camera,'#c46d78','SIGNAL'], ['viewtube','ViewTube','video',Youtube,'#a94d5b','SIGNAL'],
  ['chirp','Chirp','hot takes',Megaphone,'#7680bc','SIGNAL'], ['reeltok','ReelTok','trends',Activity,'#57a1a2','SIGNAL'],
  ['studio','Studio','career',Clapperboard,'#c39155','CAREER'], ['jetsetter','JetSetter','travel',MapPin,'#628ca1','LIFE'], ['bizmogul','BizMogul','ventures',TrendingUp,'#8a6fa8','MONEY'], ['oscaraura','OscarAura','awards',Award,'#bc9851','CAREER'], ['justilaw','JustiLaw','legal',Gavel,'#64728d','RISK'], ['darkos','DarkOS','fictional',LockKeyhole,'#684f6c','RISK'], ['glowclinic','GlowClinic','appearance',ScanFace,'#bc6d88','LIFE'], ['rayamatch','RayaMatch','romance',Heart,'#a45b76','LIFE'], ['billionestate','BillionEstate','security',Building2,'#7d7770','MONEY'], ['fanpulse','FanPulse','community',Users,'#5e8194','SIGNAL'], ['starbank','StarBank','cashflow',Landmark,'#bf9b58','MONEY'], ['marketwatch','MarketWatch','portfolio',ChartNoAxesCombined,'#5e9d91','MONEY'], ['cryptovault','CryptoVault','volatile',Coins,'#a778bd','MONEY'], ['rentcontrol','RentControl','housing',House,'#b87d68','MONEY'], ['netstream','NetStream','streaming',Film,'#b86574','CAREER'], ['maxplus','MaxPlus','streaming',Play,'#6c8cb3','CAREER'], ['boxoffice','BoxOffice','receipts',ReceiptText,'#c79b5e','CAREER'], ['prcommand','PRCommand','crisis desk',Radio,'#ca7782','RISK'], ['ndavault','NDA Vault','quiet files',FileKey2,'#8b83ad','RISK'], ['rehab','Rehab','reset',Stethoscope,'#6fa18f','LIFE'], ['boxingnight','Boxing Night','relevance',Bike,'#bd725e','CAREER'], ['deepfakedesk','Deepfake Desk','synthetic risk',ScanFace,'#917eb4','RISK'], ['swatshield','SwatShield','security',Shield,'#7a9baf','RISK'], ['botfarm','BotFarm','fictional reach',Wifi,'#a27ca7','RISK'], ['trendlab','TrendLab','forecast',Sparkles,'#7d9a77','SIGNAL'], ['paparazzi','Paparazzi','pressure',Aperture,'#a27965','RISK'], ['newswire','NewsWire','headlines',Newspaper,'#ba8e68','SIGNAL'], ['contracts','Contracts','offers',BriefcaseBusiness,'#7c9ba3','CAREER'], ['talenthouse','TalentHouse','roster',Users,'#9c7ab4','CAREER'], ['healthos','HealthOS','vitals',Stethoscope,'#659e91','LIFE'], ['sleeplab','SleepLab','recovery',Moon,'#687ca8','LIFE'], ['nutrition','Nutrition','fuel',Zap,'#b19763','LIFE'], ['styledesk','StyleDesk','wardrobe',Shirt,'#ad7188','LIFE'], ['autodrive','AutoDrive','garage',Bike,'#7e8f9b','LIFE'], ['travelsafe','TravelSafe','itinerary',CloudSun,'#6e9caa','LIFE'], ['taxoffice','TaxOffice','quarterly',ReceiptText,'#9f9171','MONEY'], ['charity','Charity','giving',PiggyBank,'#769e8b','LIFE'], ['fanclub','FanClub','members',Users,'#b47780','SIGNAL'], ['eventpass','EventPass','calendar',PartyPopper,'#b08a65','LIFE'], ['securechat','SecureChat','private',LockKeyhole,'#758aa8','RISK'],].map(([id,name,note,icon,color,group]) => ({ id: id as AppName, name: name as string, note: note as string, icon: icon as LucideIcon, color: color as string, group: group as string }));

function App() { return <GameProvider><StarOS /></GameProvider>; }

function StarOS() {
  const { state, dispatch } = useGame();
  return <main className="star-app phone-noise text-[#eee6d7]"><div className="phone-frame"><div className="phone-inner">
    {state.activeApp === 'home' ? <Home /> : <AppView />}
    {state.modal && <Modal {...state.modal} onClose={() => dispatch({ type: 'CLOSE_MODAL' })} onPrimary={state.modal.onPrimary ? () => { if (state.modal?.onPrimary) dispatch(state.modal.onPrimary as any) } : undefined} onSecondary={state.modal.onSecondary ? () => { if (state.modal?.onSecondary) dispatch(state.modal.onSecondary as any) } : undefined} />}
  </div></div></main>;

  function Home() {
    const [page, setPage] = useState(0);
    const [showProfile, setShowProfile] = useState(false);
    const groups = ['ALL', 'SIGNAL', 'CAREER', 'MONEY', 'RISK', 'LIFE'];
    const filtered = page === 0 ? apps : apps.filter(a => a.group === groups[page]);
    return <div className="min-h-full bg-[linear-gradient(180deg,#121526_0%,#0e101c_100%)] pb-5">
      <StatusBar />
      <div className="px-5 pt-3">
        <div className="flex items-start justify-between"><div><p className="mono text-[10px] uppercase tracking-[.2em] text-[#8d92a4]">StarOS / week {state.week}</p><h1 className="mt-1 font-[Syne var(--size)] text-2xl">Star</h1></div></div>
        <div className="mt-7 grid grid-cols-3 gap-2"><TopStat label="CASH" value={money(state.money)} color="#f6b954" /><TopStat label="FAME" value={`${state.fame}`} color="#db7b86" /><TopStat label="REPUTATION" value={`${state.reputation}`} color="#c8a0da" /></div>
      </div>
    </div>;
  }
  function StatusBar() { return <div className="flex items-center justify-between px-5 pt-4 text-[10px] text-[#c1c0c0]"><span className="mono">09:41</span><span className="flex items-center gap-2"><span className="mono text-[10px]">LTE</span></span></div> }
  function AppView() { const common = { onBack: () => dispatch({ type: 'BACK_HOME' }) }; switch (state.activeApp) {
    case 'instafame': return <SocialApp {...common} title="InstaFame" kind="story" />;
    case 'viewtube': return <SocialApp {...common} title="ViewTube" kind="video" />;
    case 'chirp': return <SocialApp {...common} title="Chirp" kind="hot take" />;
    case 'reeltok': return <SocialApp {...common} title="ReelTok" kind="trend" />;
    case 'studio': return <Studio {...common} />; case 'starbank': case 'marketwatch': case 'cryptovault': case 'rentcontrol': return <MoneyApp {...common} />;
    case 'prcommand': case 'ndavault': case 'rehab': case 'deepfakedesk': case 'swatshield': case 'botfarm': return <RiskApp {...common} />;
    case 'netstream': case 'maxplus': case 'boxoffice': case 'contracts': case 'talenthouse': case 'boxingnight': return <CareerApp {...common} />;
    default: { const meta = apps.find(a => a.id === state.activeApp); return meta ? <AppDetail {...common} meta={meta} /> : null; }
  } }
}

function TopStat({ label, value, color }: { label: string; value: string; color: string }) { return <div className="rounded-xl border border-white/[.07] bg-[#1a1d2d] px-3 py-2"><span className="mono text-[9px] uppercase tracking-widest text-[#d28d9e]">{label}</span><div className="mt-1 font-medium" style={{ color }}>{value}</div></div> }
function Dock({ icon: Icon, label, value }: { icon: LucideIcon; label: string; value: string }) { return <div><Icon size={15} className="mx-auto mb-1 text-[#777d92]" /><span className="block text-[11px] text-[#bdb6ac]">{label}</span><strong className="block text-sm">{value}</strong></div> }

function SocialApp({ onBack, title, kind }: { onBack: () => void; title: string; kind: string }) {
  const { state, dispatch } = useGame(); const [tab, setTab] = useState('signal');
  return <Shell title={title} subtitle={`${kind} / algorithm control`} onBack={onBack}><Panel><SectionTitle>Publish</SectionTitle><div className="p-3">TODO</div></Panel></Shell>;
}

function Studio({ onBack }: { onBack: () => void }) {
  const { state, dispatch } = useGame(); const [showProduction, setShowProduction] = useState(true);
  return <Shell title="Studio" subtitle="casting / streaming wars" onBack={onBack}><Panel>
    <SectionTitle>Studio Tools</SectionTitle>
    <div className="grid grid-cols-2 gap-3">
      <Button onClick={() => setShowProduction(p => !p)} className="py-3">Production Hub</Button>
      <Button onClick={() => dispatch({ type: 'POST_STORY' })} className="py-3">Post a Story</Button>
    </div>
    {showProduction && <div className="mt-4"><ProductionHub /></div>}
  </Panel></Shell>;
}

function CareerApp({ onBack }: { onBack: () => void }) { const { state, dispatch } = useGame(); const meta = apps.find(a => a.id === state.activeApp)!; return <Shell title={meta.name} subtitle="career" onBack={onBack}><Panel><SectionTitle>{meta.name}</SectionTitle></Panel></Shell>; }

function RiskApp({ onBack }: { onBack: () => void }) { const { state, dispatch } = useGame(); const meta = apps.find(a => a.id === state.activeApp)!; return <Shell title={meta.name} subtitle="risk" onBack={onBack}><Panel><SectionTitle>{meta.name}</SectionTitle></Panel></Shell>; }

function AppDetail({ onBack, meta }: { onBack: () => void; meta: AppMeta }) { const { state, dispatch } = useGame(); return <Shell title={meta.name} subtitle={`${meta.note} / live service`} onBack={onBack}><Panel><SectionTitle>{meta.name}</SectionTitle></Panel></Shell>; }

export default App;
