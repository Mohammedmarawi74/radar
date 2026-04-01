/**
 * ============================================
 * INVESTMENT GEO-RADAR PAGE
 * ============================================
 *
 * خريطة المملكة التفاعلية للاستثمارات
 * - توزيع المشاريع الاستثمارية حسب المنطقة
 * - فلترة حسب: القطاع، حجم الاستثمار، المرحلة
 * - طبقات معلوماتية (طاقة، تعدين، سياحة، تقنية)
 */

import React, { useState, useMemo, useEffect } from 'react';
// import { MapContainer, TileLayer, Marker, Popup, CircleMarker } from 'react-leaflet';
// import 'leaflet/dist/leaflet.css';
import {
  MapPin,
  Layers,
  Filter,
  Search,
  TrendingUp,
  Building2,
  Zap,
  Gem,
  Plane,
  Cpu,
  Info,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  Calendar,
  DollarSign,
  Target,
  CheckCircle2,
  Clock,
  BarChart3,
  PieChart,
  Globe,
  Shield,
  Award,
  X,
  ChevronDown,
  SlidersHorizontal,
  Grid3X3,
  List,
  Maximize2,
  Users,
  Map as MapIcon
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip,
  ResponsiveContainer, BarChart, Bar, Legend, PieChart as RechartsPieChart,
  Pie, Cell, LineChart, Line
} from 'recharts';
import L from 'leaflet';

// ============================================
// TYPES & INTERFACES
// ============================================

interface InvestmentProject {
  id: string;
  name: string;
  region: string;
  regionEn: string;
  sector: 'energy' | 'mining' | 'tourism' | 'technology' | 'healthcare' | 'logistics';
  investmentSize: 'small' | 'medium' | 'large' | 'mega';
  investmentValue: number;
  phase: 'planning' | 'approval' | 'construction' | 'operational';
  coordinates: { lat: number; lng: number };
  description: string;
  jobsCreated: number;
  startDate: string;
  expectedCompletion?: string;
  status: 'active' | 'completed' | 'on-hold';
}

interface RegionData {
  id: string;
  name: string;
  nameEn: string;
  projectsCount: number;
  totalInvestment: number;
  jobsCreated: number;
  topSector: string;
  center: { lat: number; lng: number };
}

interface FilterState {
  sectors: string[];
  investmentSize: string[];
  phases: string[];
  regions: string[];
}

// ============================================
// MOCK DATA
// ============================================

const SECTORS = [
  { id: 'energy', label: 'الطاقة', icon: Zap, color: '#f59e0b', bg: 'bg-amber-50', text: 'text-amber-600' },
  { id: 'mining', label: 'التعدين', icon: Gem, color: '#8b5cf6', bg: 'bg-violet-50', text: 'text-violet-600' },
  { id: 'tourism', label: 'السياحة', icon: Plane, color: '#06b6d4', bg: 'bg-cyan-50', text: 'text-cyan-600' },
  { id: 'technology', label: 'التقنية', icon: Cpu, color: '#3b82f6', bg: 'bg-blue-50', text: 'text-blue-600' },
  { id: 'healthcare', label: 'الرعاية الصحية', icon: Shield, color: '#ef4444', bg: 'bg-red-50', text: 'text-red-600' },
  { id: 'logistics', label: 'اللوجستيات', icon: Globe, color: '#10b981', bg: 'bg-emerald-50', text: 'text-emerald-600' },
];

const INVESTMENT_SIZES = [
  { id: 'small', label: 'صغير (<50M)', min: 0, max: 50, color: '#94a3b8' },
  { id: 'medium', label: 'متوسط (50-500M)', min: 50, max: 500, color: '#3b82f6' },
  { id: 'large', label: 'كبير (500M-5B)', min: 500, max: 5000, color: '#8b5cf6' },
  { id: 'mega', label: 'عملاق (>5B)', min: 5000, max: Infinity, color: '#f59e0b' },
];

const PHASES = [
  { id: 'planning', label: 'التخطيط', icon: Clock, color: '#94a3b8' },
  { id: 'approval', label: 'الاعتماد', icon: CheckCircle2, color: '#3b82f6' },
  { id: 'construction', label: 'الإنشاء', icon: Building2, color: '#f59e0b' },
  { id: 'operational', label: 'تشغيلي', icon: Award, color: '#10b981' },
];

const REGIONS: RegionData[] = [
  {
    id: 'riyadh',
    name: 'الرياض',
    nameEn: 'Riyadh',
    projectsCount: 156,
    totalInvestment: 285000,
    jobsCreated: 45000,
    topSector: 'technology',
    center: { lat: 24.7136, lng: 46.6753 },
  },
  {
    id: 'makkah',
    name: 'مكة المكرمة',
    nameEn: 'Makkah',
    projectsCount: 124,
    totalInvestment: 195000,
    jobsCreated: 38000,
    topSector: 'tourism',
    center: { lat: 21.4225, lng: 39.8262 },
  },
  {
    id: 'eastern',
    name: 'الشرقية',
    nameEn: 'Eastern',
    projectsCount: 189,
    totalInvestment: 420000,
    jobsCreated: 62000,
    topSector: 'energy',
    center: { lat: 25.3548, lng: 49.5918 },
  },
  {
    id: 'neom',
    name: 'نيوم',
    nameEn: 'NEOM',
    projectsCount: 45,
    totalInvestment: 550000,
    jobsCreated: 28000,
    topSector: 'technology',
    center: { lat: 28.0, lng: 35.0 },
  },
  {
    id: 'qiddiya',
    name: 'القدية',
    nameEn: 'Qiddiya',
    projectsCount: 28,
    totalInvestment: 120000,
    jobsCreated: 15000,
    topSector: 'tourism',
    center: { lat: 24.3, lng: 46.3 },
  },
  {
    id: 'redsea',
    name: 'مشروع البحر الأحمر',
    nameEn: 'Red Sea',
    projectsCount: 32,
    totalInvestment: 180000,
    jobsCreated: 18000,
    topSector: 'tourism',
    center: { lat: 24.5, lng: 37.5 },
  },
  {
    id: 'mining',
    name: 'منطقة التعدين',
    nameEn: 'Mining Zone',
    projectsCount: 67,
    totalInvestment: 95000,
    jobsCreated: 22000,
    topSector: 'mining',
    center: { lat: 26.5, lng: 43.0 },
  },
];

const PROJECTS: InvestmentProject[] = [
  {
    id: 'p1',
    name: 'مدينة نيوم التقنية',
    region: 'neom',
    regionEn: 'NEOM',
    sector: 'technology',
    investmentSize: 'mega',
    investmentValue: 150000,
    phase: 'construction',
    coordinates: { lat: 28.0, lng: 35.0 },
    description: 'مدينة مستقبلية تعتمد على الذكاء الاصطناعي والتقنيات المتقدمة',
    jobsCreated: 12000,
    startDate: '2024-01',
    expectedCompletion: '2030-12',
    status: 'active'
  },
  {
    id: 'p2',
    name: 'مصنع الهيدروجين الأخضر',
    region: 'neom',
    regionEn: 'NEOM',
    sector: 'energy',
    investmentSize: 'mega',
    investmentValue: 85000,
    phase: 'construction',
    coordinates: { lat: 28.2, lng: 35.2 },
    description: 'أكبر مصنع للهيدروجين الأخضر في العالم',
    jobsCreated: 5500,
    startDate: '2023-06',
    expectedCompletion: '2027-06',
    status: 'active'
  },
  {
    id: 'p3',
    name: 'منتجع البحر الأحمر الفاخر',
    region: 'redsea',
    regionEn: 'Red Sea',
    sector: 'tourism',
    investmentSize: 'large',
    investmentValue: 45000,
    phase: 'operational',
    coordinates: { lat: 24.5, lng: 37.5 },
    description: 'وجهة سياحية فاخرة على ساحل البحر الأحمر',
    jobsCreated: 8000,
    startDate: '2020-03',
    expectedCompletion: '2025-12',
    status: 'active'
  },
  {
    id: 'p4',
    name: 'منجم الذهب الشمالي',
    region: 'mining',
    regionEn: 'Mining Zone',
    sector: 'mining',
    investmentSize: 'large',
    investmentValue: 12000,
    phase: 'operational',
    coordinates: { lat: 26.5, lng: 43.0 },
    description: 'منجم ذهب متطور بأحدث التقنيات العالمية',
    jobsCreated: 3200,
    startDate: '2021-09',
    status: 'active'
  },
  {
    id: 'p5',
    name: 'مجمع الطاقة الشمسية',
    region: 'riyadh',
    regionEn: 'Riyadh',
    sector: 'energy',
    investmentSize: 'medium',
    investmentValue: 8500,
    phase: 'approval',
    coordinates: { lat: 24.7136, lng: 46.6753 },
    description: 'محطة طاقة شمسية بقدرة 2000 ميجاواط',
    jobsCreated: 1800,
    startDate: '2025-06',
    expectedCompletion: '2028-06',
    status: 'active'
  },
  {
    id: 'p6',
    name: 'مدينة الملك عبدالله الطبية',
    region: 'makkah',
    regionEn: 'Makkah',
    sector: 'healthcare',
    investmentSize: 'large',
    investmentValue: 15000,
    phase: 'construction',
    coordinates: { lat: 21.4225, lng: 39.8262 },
    description: 'مجمع طبي متكامل بأحدث التقنيات',
    jobsCreated: 4500,
    startDate: '2023-01',
    expectedCompletion: '2026-12',
    status: 'active'
  },
  {
    id: 'p7',
    name: 'مركز اللوجستيات الذكي',
    region: 'eastern',
    regionEn: 'Eastern',
    sector: 'logistics',
    investmentSize: 'medium',
    investmentValue: 6200,
    phase: 'operational',
    coordinates: { lat: 25.3548, lng: 49.5918 },
    description: 'مركز توزيع ذكي يخدم المنطقة الشرقية',
    jobsCreated: 2100,
    startDate: '2022-03',
    status: 'active'
  },
  {
    id: 'p8',
    name: 'وادي السيليكون السعودي',
    region: 'riyadh',
    regionEn: 'Riyadh',
    sector: 'technology',
    investmentSize: 'mega',
    investmentValue: 75000,
    phase: 'planning',
    coordinates: { lat: 24.75, lng: 46.7 },
    description: 'مجمع تقني للشركات الناشئة والمبتكرة',
    jobsCreated: 18000,
    startDate: '2025-09',
    expectedCompletion: '2032-12',
    status: 'active'
  },
  {
    id: 'p9',
    name: 'منتجع القدية الترفيهي',
    region: 'qiddiya',
    regionEn: 'Qiddiya',
    sector: 'tourism',
    investmentSize: 'mega',
    investmentValue: 95000,
    phase: 'construction',
    coordinates: { lat: 24.3, lng: 46.3 },
    description: 'أكبر وجهة ترفيهية في الشرق الأوسط',
    jobsCreated: 15000,
    startDate: '2022-01',
    expectedCompletion: '2028-06',
    status: 'active'
  },
  {
    id: 'p10',
    name: 'مصنع البتروكيماويات المتقدم',
    region: 'eastern',
    regionEn: 'Eastern',
    sector: 'energy',
    investmentSize: 'large',
    investmentValue: 28000,
    phase: 'operational',
    coordinates: { lat: 25.4, lng: 49.6 },
    description: 'مصنع متطور لإنتاج البتروكيماويات',
    jobsCreated: 4200,
    startDate: '2020-06',
    status: 'active'
  },
];

// ============================================
// HELPER COMPONENTS
// ============================================

const StatCard = ({ title, value, change, isPositive, icon: Icon, subtitle, color = 'blue' }: any) => {
  const colorClasses: any = {
    blue: 'from-blue-500 to-blue-600',
    amber: 'from-amber-500 to-amber-600',
    violet: 'from-violet-500 to-violet-600',
    emerald: 'from-emerald-500 to-emerald-600',
    cyan: 'from-cyan-500 to-cyan-600',
  };

  return (
    <div className="relative bg-white rounded-[28px] p-6 border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-blue-500/10 hover:-translate-y-1 transition-all duration-300 group overflow-hidden">
      <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${colorClasses[color]} opacity-5 rounded-full blur-2xl -mr-16 -mt-16 group-hover:opacity-10 transition-opacity`}></div>
      
      <div className="relative z-10">
        <div className="flex justify-between items-start mb-4">
          <div className={`p-3.5 bg-gradient-to-br ${colorClasses[color]} text-white rounded-2xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg`}>
            <Icon size={24} strokeWidth={2} />
          </div>
          {change && (
            <div className={`flex items-center gap-1 text-sm font-bold px-2.5 py-1.5 rounded-xl ${
              isPositive ? 'text-emerald-600 bg-emerald-50' : 'text-rose-600 bg-rose-50'
            }`}>
              {isPositive ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
              <span>{Math.abs(change)}%</span>
            </div>
          )}
        </div>
        
        <div>
          <h3 className="text-slate-500 text-sm font-bold mb-2">{title}</h3>
          <div className="text-3xl font-black text-slate-900 tracking-tight">{value}</div>
          {subtitle && <p className="text-xs font-bold text-slate-400 mt-2">{subtitle}</p>}
        </div>
      </div>
    </div>
  );
};

const SectorBadge = ({ sector, onClick, isActive }: { sector: any; onClick?: () => void; isActive?: boolean }) => {
  const Icon = sector.icon;
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl transition-all duration-200 border-2 ${
        isActive
          ? `${sector.bg} ${sector.text} border-current shadow-md scale-105`
          : 'bg-white text-slate-500 border-slate-100 hover:border-slate-200 hover:bg-slate-50'
      }`}
    >
      <Icon size={18} strokeWidth={2} />
      <span className="text-sm font-bold">{sector.label}</span>
    </button>
  );
};

const PhaseBadge = ({ phase }: { phase: string }) => {
  const phaseData = PHASES.find(p => p.id === phase);
  if (!phaseData) return null;
  const Icon = phaseData.icon;

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold`} style={{ backgroundColor: `${phaseData.color}15`, color: phaseData.color }}>
      <Icon size={14} strokeWidth={2.5} />
      {phaseData.label}
    </span>
  );
};

const InvestmentSizeBadge = ({ size }: { size: string }) => {
  const sizeData = INVESTMENT_SIZES.find(s => s.id === size);
  if (!sizeData) return null;

  return (
    <span
      className="inline-flex items-center px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider"
      style={{ backgroundColor: `${sizeData.color}15`, color: sizeData.color }}
    >
      {sizeData.label.split(' ')[0]}
    </span>
  );
};

// ============================================
// CUSTOM MARKER ICON
// ============================================

const createCustomIcon = (color: string, size: number = 24) => {
  return L.divIcon({
    className: 'custom-div-icon',
    html: `
      <div style="
        width: ${size}px;
        height: ${size}px;
        background-color: ${color};
        border: 3px solid white;
        border-radius: 50%;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        animation: pulse 2s infinite;
      "></div>
    `,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -size / 2]
  });
};

// ============================================
// MAP COMPONENT
// ============================================

const SaudiArabiaMap = ({
  projects,
  selectedRegion,
  onRegionClick,
  onProjectClick,
  activeLayers,
}: {
  projects: InvestmentProject[];
  selectedRegion: string | null;
  onRegionClick: (regionId: string) => void;
  onProjectClick: (project: InvestmentProject) => void;
  activeLayers: string[];
}) => {
  const saudiCenter: [number, number] = [24.7136, 46.6753];
  const [mapReady, setMapReady] = useState(false);

  useEffect(() => {
    setMapReady(true);
  }, []);

  if (!mapReady) {
    return (
      <div className="relative w-full h-[500px] bg-gradient-to-br from-slate-50 to-slate-100 rounded-[32px] border border-slate-200 overflow-hidden shadow-inner flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-500 font-bold">جاري تحميل الخريطة...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-[500px] bg-gradient-to-br from-slate-50 to-slate-100 rounded-[32px] border border-slate-200 overflow-hidden shadow-inner flex items-center justify-center">
      {/* Placeholder until react-leaflet is properly installed */}
      <div className="text-center p-8">
        <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <MapPin size={40} className="text-blue-600" />
        </div>
        <h3 className="text-xl font-black text-slate-900 mb-2">خريطة الاستثمار التفاعلية</h3>
        <p className="text-slate-600 font-bold mb-4">قريباً: توزيع المشاريع الاستثمارية على خريطة المملكة</p>
        <div className="flex items-center justify-center gap-2 text-sm text-slate-500">
          <span className="px-3 py-1 bg-slate-200 rounded-full">🗺️ خريطة تفاعلية</span>
          <span className="px-3 py-1 bg-slate-200 rounded-full">📍 مواقع المشاريع</span>
          <span className="px-3 py-1 bg-slate-200 rounded-full">📊 إحصائيات منطقة</span>
        </div>
      </div>

      {/* Map Legend - Temporarily Hidden */}
      {/* <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-sm rounded-2xl p-4 border border-slate-200 shadow-lg z-[1000]">
        <h4 className="text-xs font-bold text-slate-700 mb-3 flex items-center gap-2">
          <Layers size={14} />
          حجم الاستثمار
        </h4>
        <div className="space-y-2">
          {INVESTMENT_SIZES.map((size) => (
            <div key={size.id} className="flex items-center gap-2">
              <div
                className="rounded-full"
                style={{
                  width: size.id === 'mega' ? 16 : size.id === 'large' ? 12 : size.id === 'medium' ? 8 : 6,
                  height: size.id === 'mega' ? 16 : size.id === 'large' ? 12 : size.id === 'medium' ? 8 : 6,
                  backgroundColor: size.color
                }}
              />
              <span className="text-[10px] font-bold text-slate-600">{size.label}</span>
            </div>
          ))}
        </div>
      </div> */}

      {/* Active Layers Indicator - Temporarily Hidden */}
      {/* <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm rounded-2xl p-3 border border-slate-200 shadow-lg z-[1000]">
        <div className="flex items-center gap-2 flex-wrap">
          {SECTORS.filter(s => activeLayers.includes(s.id)).map((sector) => {
            const Icon = sector.icon;
            return (
              <div
                key={sector.id}
                className="w-8 h-8 rounded-xl flex items-center justify-center text-white shadow-md"
                style={{ backgroundColor: sector.color }}
                title={sector.label}
              >
                <Icon size={16} strokeWidth={2.5} />
              </div>
            );
          })}
        </div>
      </div> */}

      {/* Zoom Controls - Temporarily Hidden */}
      {/* <div className="absolute left-4 top-1/2 -translate-y-1/2 bg-white rounded-xl shadow-lg border border-slate-200 z-[1000] overflow-hidden">
        <button
          className="w-10 h-10 flex items-center justify-center text-slate-600 hover:bg-slate-50 border-b border-slate-200"
          onClick={() => {
            const map = (window as any).leafletMap;
            if (map) map.zoomIn();
          }}
        >
          <span className="text-xl font-bold">+</span>
        </button>
        <button
          className="w-10 h-10 flex items-center justify-center text-slate-600 hover:bg-slate-50"
          onClick={() => {
            const map = (window as any).leafletMap;
            if (map) map.zoomOut();
          }}
        >
          <span className="text-xl font-bold">−</span>
        </button>
      </div> */}
    </div>
  );
};

// ============================================
// PROJECT DETAIL MODAL
// ============================================

const ProjectDetailModal = ({
  project,
  onClose
}: {
  project: InvestmentProject | null;
  onClose: () => void;
}) => {
  if (!project) return null;

  const sector = SECTORS.find(s => s.id === project.sector);
  const region = REGIONS.find(r => r.id === project.region);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn" onClick={onClose}>
      <div
        className="bg-white rounded-[32px] w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl animate-scaleIn"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative h-48 bg-gradient-to-br from-slate-900 to-slate-800 rounded-t-[32px] overflow-hidden">
          <div className="absolute inset-0 opacity-20" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
            backgroundSize: '32px 32px'
          }}></div>
          
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-10 h-10 bg-white/10 backdrop-blur rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors"
          >
            <X size={20} />
          </button>

          <div className="absolute bottom-6 right-6 left-6">
            <div className="flex items-center gap-3 mb-3">
              {sector && (
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg"
                  style={{ backgroundColor: sector.color }}
                >
                  {sector.icon && <sector.icon size={24} strokeWidth={2} />}
                </div>
              )}
              <div>
                <h2 className="text-2xl font-black text-white">{project.name}</h2>
                <p className="text-slate-300 text-sm font-bold flex items-center gap-2">
                  <MapPin size={14} />
                  {region?.name}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="p-8">
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-100">
              <p className="text-2xl font-black text-blue-600">{project.investmentValue.toLocaleString()}</p>
              <p className="text-[10px] font-bold text-blue-500 uppercase tracking-wider mt-1">مليون ريال</p>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-emerald-50 to-green-50 rounded-2xl border border-emerald-100">
              <p className="text-2xl font-black text-emerald-600">{project.jobsCreated.toLocaleString()}</p>
              <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-wider mt-1">وظيفة</p>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl border border-amber-100">
              <PhaseBadge phase={project.phase} />
              <p className="text-[10px] font-bold text-amber-500 uppercase tracking-wider mt-2">المرحلة</p>
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-lg font-black text-slate-900 mb-3 flex items-center gap-2">
              <Info size={18} className="text-blue-600" />
              نبذة عن المشروع
            </h3>
            <p className="text-slate-600 leading-relaxed">{project.description}</p>
          </div>

          <div className="mb-8">
            <h3 className="text-lg font-black text-slate-900 mb-4 flex items-center gap-2">
              <Calendar size={18} className="text-blue-600" />
              الجدول الزمني
            </h3>
            <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <div className="flex-1 text-center">
                <p className="text-xs font-bold text-slate-500 mb-1">تاريخ البدء</p>
                <p className="text-lg font-black text-slate-900">{project.startDate}</p>
              </div>
              <div className="w-16 h-1 bg-gradient-to-l from-emerald-500 to-blue-500 rounded-full"></div>
              {project.expectedCompletion && (
                <div className="flex-1 text-center">
                  <p className="text-xs font-bold text-slate-500 mb-1">الانتهاء المتوقع</p>
                  <p className="text-lg font-black text-slate-900">{project.expectedCompletion}</p>
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <InvestmentSizeBadge size={project.investmentSize} />
            <span className="inline-flex items-center px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-100 text-slate-600">
              {sector?.label}
            </span>
            <span className="inline-flex items-center px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-100 text-slate-600">
              {region?.name}
            </span>
            <span className={`inline-flex items-center px-3 py-1.5 rounded-xl text-xs font-bold ${
              project.status === 'active' ? 'bg-emerald-100 text-emerald-600' :
              project.status === 'completed' ? 'bg-blue-100 text-blue-600' :
              'bg-amber-100 text-amber-600'
            }`}>
              {project.status === 'active' ? 'نشط' : project.status === 'completed' ? 'مكتمل' : 'معلق'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================
// MAIN COMPONENT
// ============================================

export default function InvestmentGeoRadar() {
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [selectedProject, setSelectedProject] = useState<InvestmentProject | null>(null);
  const [viewMode, setViewMode] = useState<'map' | 'list' | 'grid'>('map');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeLayers, setActiveLayers] = useState<string[]>(
    SECTORS.map(s => s.id)
  );
  
  const [filters, setFilters] = useState<FilterState>({
    sectors: [],
    investmentSize: [],
    phases: [],
    regions: []
  });

  const [showFilters, setShowFilters] = useState(false);

  const filteredProjects = useMemo(() => {
    return PROJECTS.filter(project => {
      const matchesSearch = project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           project.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesRegion = !selectedRegion || project.region === selectedRegion;
      const matchesSector = filters.sectors.length === 0 || filters.sectors.includes(project.sector);
      const matchesSize = filters.investmentSize.length === 0 || filters.investmentSize.includes(project.investmentSize);
      const matchesPhase = filters.phases.length === 0 || filters.phases.includes(project.phase);
      
      return matchesSearch && matchesRegion && matchesSector && matchesSize && matchesPhase;
    });
  }, [searchQuery, selectedRegion, filters]);

  const toggleLayer = (sectorId: string) => {
    setActiveLayers(prev =>
      prev.includes(sectorId)
        ? prev.filter(id => id !== sectorId)
        : [...prev, sectorId]
    );
  };

  const toggleFilter = (category: keyof FilterState, value: string) => {
    setFilters(prev => ({
      ...prev,
      [category]: prev[category].includes(value)
        ? prev[category].filter(v => v !== value)
        : [...prev[category], value]
    }));
  };

  const stats = useMemo(() => {
    const totalInvestment = filteredProjects.reduce((sum, p) => sum + p.investmentValue, 0);
    const totalJobs = filteredProjects.reduce((sum, p) => sum + p.jobsCreated, 0);
    const activeProjects = filteredProjects.filter(p => p.status === 'active').length;
    
    return { totalInvestment, totalJobs, activeProjects };
  }, [filteredProjects]);

  const sectorDistribution = useMemo(() => {
    return SECTORS.map(sector => ({
      name: sector.label,
      value: filteredProjects.filter(p => p.sector === sector.id).length,
      investment: filteredProjects
        .filter(p => p.sector === sector.id)
        .reduce((sum, p) => sum + p.investmentValue, 0)
    }));
  }, [filteredProjects]);

  const regionData = useMemo(() => {
    return REGIONS.map(region => ({
      name: region.name,
      projects: filteredProjects.filter(p => p.region === region.id).length,
      investment: filteredProjects
        .filter(p => p.region === region.id)
        .reduce((sum, p) => sum + p.investmentValue, 0)
    }));
  }, [filteredProjects]);

  return (
    <div className="max-w-[1600px] mx-auto p-4 lg:p-8 min-h-screen pb-24">
      <div className="mb-8 relative">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl -z-10 -mt-20 -mr-20"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-amber-600/10 rounded-full blur-3xl -z-10 -mb-20 -ml-20"></div>

        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6">
          <div>
            <h1 className="text-3xl lg:text-5xl font-black text-slate-900 tracking-tight flex items-center gap-4 mb-4">
              <div className="p-4 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl shadow-2xl shadow-blue-500/30 text-white">
                <MapIcon size={36} strokeWidth={1.5} />
              </div>
              الرادار الجغرافي للاستثمارات
            </h1>
            <p className="text-lg text-slate-500 max-w-3xl leading-relaxed font-medium">
              خريطة تفاعلية شاملة لتوزيع المشاريع الاستثمارية في المملكة العربية السعودية
              مع طبقات معلوماتية متقدمة وفلاتر ذكية
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-white/80 backdrop-blur rounded-2xl p-4 border border-slate-200 text-center shadow-sm">
              <p className="text-3xl font-black text-blue-600">{filteredProjects.length}</p>
              <p className="text-xs text-slate-500 uppercase tracking-wider font-bold mt-1">مشروع</p>
            </div>
            <div className="bg-white/80 backdrop-blur rounded-2xl p-4 border border-slate-200 text-center shadow-sm">
              <p className="text-3xl font-black text-amber-600">{REGIONS.length}</p>
              <p className="text-xs text-slate-500 uppercase tracking-wider font-bold mt-1">منطقة</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="إجمالي الاستثمارات"
          value={`${stats.totalInvestment.toLocaleString()}M`}
          change={24.5}
          isPositive={true}
          icon={DollarSign}
          subtitle="ريال سعودي"
          color="amber"
        />
        <StatCard
          title="الوظائف المُنشأة"
          value={stats.totalJobs.toLocaleString()}
          change={18.2}
          isPositive={true}
          icon={Users}
          subtitle="فرصة وظيفية"
          color="emerald"
        />
        <StatCard
          title="المشاريع النشطة"
          value={stats.activeProjects}
          change={12.8}
          isPositive={true}
          icon={Target}
          subtitle={`من أصل ${filteredProjects.length}`}
          color="blue"
        />
        <StatCard
          title="متوسط حجم المشروع"
          value={`${Math.round(stats.totalInvestment / filteredProjects.length || 0)}M`}
          change={8.4}
          isPositive={true}
          icon={BarChart3}
          subtitle="ريال سعودي"
          color="violet"
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        <div className="xl:col-span-1 space-y-4">
          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm">
            <div className="relative">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="بحث عن مشروع..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-4 pr-10 py-3 text-sm font-bold focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
              />
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-black text-slate-700 flex items-center gap-2">
                <Layers size={16} className="text-blue-600" />
                القطاعات
              </h3>
              <button
                onClick={() => setActiveLayers(SECTORS.map(s => s.id))}
                className="text-xs font-bold text-blue-600 hover:text-blue-700"
              >
                الكل
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {SECTORS.map(sector => (
                <SectorBadge
                  key={sector.id}
                  sector={sector}
                  onClick={() => toggleLayer(sector.id)}
                  isActive={activeLayers.includes(sector.id)}
                />
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="w-full flex items-center justify-between text-sm font-black text-slate-700 mb-4"
            >
              <span className="flex items-center gap-2">
                <SlidersHorizontal size={16} className="text-blue-600" />
                فلاتر متقدمة
              </span>
              <ChevronDown
                size={16}
                className={`transition-transform ${showFilters ? 'rotate-180' : ''}`}
              />
            </button>

            {showFilters && (
              <div className="space-y-4 animate-fadeIn">
                <div>
                  <h4 className="text-xs font-bold text-slate-500 mb-2">حجم الاستثمار</h4>
                  <div className="space-y-2">
                    {INVESTMENT_SIZES.map(size => (
                      <label key={size.id} className="flex items-center gap-2 cursor-pointer group">
                        <input
                          type="checkbox"
                          checked={filters.investmentSize.includes(size.id)}
                          onChange={() => toggleFilter('investmentSize', size.id)}
                          className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                        />
                        <div className="flex items-center gap-2">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: size.color }}
                          />
                          <span className="text-sm font-bold text-slate-600 group-hover:text-slate-900">
                            {size.label}
                          </span>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-slate-500 mb-2">مرحلة المشروع</h4>
                  <div className="space-y-2">
                    {PHASES.map(phase => (
                      <label key={phase.id} className="flex items-center gap-2 cursor-pointer group">
                        <input
                          type="checkbox"
                          checked={filters.phases.includes(phase.id)}
                          onChange={() => toggleFilter('phases', phase.id)}
                          className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm font-bold text-slate-600 group-hover:text-slate-900">
                          {phase.label}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm">
            <h3 className="text-sm font-black text-slate-700 mb-4 flex items-center gap-2">
              <PieChart size={16} className="text-blue-600" />
              توزيع المناطق
            </h3>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={regionData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10}} angle={-45} textAnchor="end" height={60} />
                  <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10}} />
                  <RechartsTooltip
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}
                  />
                  <Bar dataKey="projects" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="xl:col-span-3 space-y-6">
          <div className="bg-white rounded-2xl p-2 border border-slate-200 shadow-sm flex items-center justify-between">
            <div className="flex bg-slate-100 rounded-xl p-1">
              <button
                onClick={() => setViewMode('map')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                  viewMode === 'map'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                <MapIcon size={18} />
                الخريطة
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                  viewMode === 'grid'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                <Grid3X3 size={18} />
                شبكة
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                  viewMode === 'list'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                <List size={18} />
                قائمة
              </button>
            </div>

            <div className="flex items-center gap-2 text-sm text-slate-500">
              <Filter size={16} />
              <span className="font-bold">{filteredProjects.length} مشروع</span>
            </div>
          </div>

          {viewMode === 'map' && (
            <div className="animate-fadeIn">
              <SaudiArabiaMap
                projects={filteredProjects}
                selectedRegion={selectedRegion}
                onRegionClick={setSelectedRegion}
                onProjectClick={setSelectedProject}
                activeLayers={activeLayers}
              />
              
              {selectedRegion && (
                <div className="mt-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100 animate-slideUp">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                      <MapPin size={20} className="text-blue-600" />
                      {REGIONS.find(r => r.id === selectedRegion)?.name}
                    </h3>
                    <button
                      onClick={() => setSelectedRegion(null)}
                      className="text-sm font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
                    >
                      <X size={16} />
                      إزالة الفلتر
                    </button>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <p className="text-xs font-bold text-slate-500 mb-1">المشاريع</p>
                      <p className="text-2xl font-black text-slate-900">
                        {filteredProjects.filter(p => p.region === selectedRegion).length}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-500 mb-1">الاستثمار</p>
                      <p className="text-2xl font-black text-slate-900">
                        {filteredProjects
                          .filter(p => p.region === selectedRegion)
                          .reduce((sum, p) => sum + p.investmentValue, 0)
                          .toLocaleString()}M
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-500 mb-1">الوظائف</p>
                      <p className="text-2xl font-black text-slate-900">
                        {filteredProjects
                          .filter(p => p.region === selectedRegion)
                          .reduce((sum, p) => sum + p.jobsCreated, 0)
                          .toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {viewMode === 'grid' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fadeIn">
              {filteredProjects.map(project => {
                const sector = SECTORS.find(s => s.id === project.sector);
                const region = REGIONS.find(r => r.id === project.region);
                
                return (
                  <div
                    key={project.id}
                    onClick={() => setSelectedProject(project)}
                    className="group bg-white rounded-[28px] p-6 border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-blue-500/10 hover:-translate-y-1 transition-all duration-300 cursor-pointer"
                  >
                    <div className="flex items-start gap-4 mb-4">
                      <div
                        className="w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all"
                        style={{ backgroundColor: sector?.color }}
                      >
                        {sector?.icon && <sector.icon size={28} strokeWidth={2} />}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-black text-slate-900 mb-1 group-hover:text-blue-600 transition-colors">
                          {project.name}
                        </h3>
                        <p className="text-sm font-bold text-slate-500 flex items-center gap-1">
                          <MapPin size={14} />
                          {region?.name}
                        </p>
                      </div>
                    </div>
                    
                    <p className="text-sm text-slate-600 mb-4 line-clamp-2">{project.description}</p>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      <PhaseBadge phase={project.phase} />
                      <InvestmentSizeBadge size={project.investmentSize} />
                    </div>
                    
                    <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                      <div>
                        <p className="text-xs font-bold text-slate-500 mb-1">الاستثمار</p>
                        <p className="text-lg font-black text-amber-600">{project.investmentValue.toLocaleString()}M</p>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-500 mb-1">الوظائف</p>
                        <p className="text-lg font-black text-emerald-600">{project.jobsCreated.toLocaleString()}</p>
                      </div>
                      <button className="w-10 h-10 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-400 group-hover:bg-blue-600 group-hover:border-blue-600 group-hover:text-white transition-all">
                        <ArrowUpRight size={18} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {viewMode === 'list' && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden animate-fadeIn">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200">
                      <th className="text-right p-4 text-xs font-black text-slate-500 uppercase tracking-wider">المشروع</th>
                      <th className="text-right p-4 text-xs font-black text-slate-500 uppercase tracking-wider">المنطقة</th>
                      <th className="text-right p-4 text-xs font-black text-slate-500 uppercase tracking-wider">القطاع</th>
                      <th className="text-right p-4 text-xs font-black text-slate-500 uppercase tracking-wider">المرحلة</th>
                      <th className="text-right p-4 text-xs font-black text-slate-500 uppercase tracking-wider">الاستثمار</th>
                      <th className="text-right p-4 text-xs font-black text-slate-500 uppercase tracking-wider">الوظائف</th>
                      <th className="p-4"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredProjects.map(project => {
                      const sector = SECTORS.find(s => s.id === project.sector);
                      const region = REGIONS.find(r => r.id === project.region);
                      
                      return (
                        <tr
                          key={project.id}
                          onClick={() => setSelectedProject(project)}
                          className="group hover:bg-slate-50 transition-colors cursor-pointer"
                        >
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <div
                                className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow"
                                style={{ backgroundColor: sector?.color }}
                              >
                                {sector?.icon && <sector.icon size={18} strokeWidth={2} />}
                              </div>
                              <span className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                                {project.name}
                              </span>
                            </div>
                          </td>
                          <td className="p-4">
                            <span className="text-sm font-bold text-slate-600">{region?.name}</span>
                          </td>
                          <td className="p-4">
                            <span className="text-sm font-bold text-slate-600">{sector?.label}</span>
                          </td>
                          <td className="p-4">
                            <PhaseBadge phase={project.phase} />
                          </td>
                          <td className="p-4">
                            <span className="text-sm font-black text-amber-600">{project.investmentValue.toLocaleString()}M</span>
                          </td>
                          <td className="p-4">
                            <span className="text-sm font-black text-emerald-600">{project.jobsCreated.toLocaleString()}</span>
                          </td>
                          <td className="p-4">
                            <button className="w-8 h-8 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-400 group-hover:bg-blue-600 group-hover:border-blue-600 group-hover:text-white transition-all">
                              <ArrowUpRight size={16} />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-[28px] p-6 border border-slate-200 shadow-sm">
          <h3 className="text-lg font-black text-slate-900 mb-6 flex items-center gap-2">
            <PieChart size={20} className="text-blue-600" />
            توزيع المشاريع حسب القطاع
          </h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsPieChart>
                <Pie
                  data={sectorDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={120}
                  paddingAngle={2}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {sectorDistribution.map((entry, index) => (
                    <Cell key={`cell-${entry.name}-${index}`} fill={SECTORS[index].color} />
                  ))}
                </Pie>
                <RechartsTooltip
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                />
                <Legend />
              </RechartsPieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-[28px] p-6 border border-slate-200 shadow-sm">
          <h3 className="text-lg font-black text-slate-900 mb-6 flex items-center gap-2">
            <BarChart3 size={20} className="text-blue-600" />
            الاستثمارات حسب المنطقة
          </h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={regionData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12}} dx={-10} />
                <RechartsTooltip
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                />
                <Legend />
                <Bar dataKey="investment" name="الاستثمار (M)" fill="#3b82f6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <ProjectDetailModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </div>
  );
}
