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
  ['studio','Studio','career',Clapperboard,'#c39155','CAREER'], ['jetsetter','JetSetter','travel',MapPin,'#628ca1','LIFE'], ['bizmogul','BizMogul','ventures',TrendingUp,'#8a6fa8','MONEY'], ['oscaraura','OscarAura','awards',Award,'#bc9851','CAREER'], ['justilaw','JustiLaw','legal',Gavel,'#64728d','RISK'], ['darkos','DarkOS','fictional',LockKeyhole,'#684f6c','RISK'], ['glowclinic','GlowClinic','appearance',ScanFace,'#bc6d88','LIFE'], ['rayamatch','RayaMatch','romance',Heart,'#a45b76','LIFE'], ['billionestate','BillionEstate','security',Building2,'#7d7770','MONEY'], ['fanpulse','FanPulse','community',Users,'#5e8194','SIGNAL'], ['starbank','StarBank','cashflow',Landmark,'#bf9b58','MONEY'], ['marketwatch','MarketWatch','portfolio',ChartNoAxesCombined,'#5e9d91','MONEY'], ['cryptovault','CryptoVault','volatile',Coins,'#a778bd','MONEY'], ['rentcontrol','Rent: '], 