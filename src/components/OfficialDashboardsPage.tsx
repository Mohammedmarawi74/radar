/**
 * ============================================
 * OFFICIAL DASHBOARDS PAGE
 * ============================================
 * 
 * صفحة اللوحات الرسمية - بتصاميم متعددة (Grid, List, Hybrid)
 * تدعم 30+ لوحة مع تصفية، بحث، ومفضلة
 */

import React, { useState, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
    LayoutGrid,
    List,
    Star,
    Search,
    Filter,
    BarChart2,
    PieChart,
    LineChart,
    ArrowUpRight,
    MoreHorizontal,
    Heart,
    ExternalLink,
    Info,
    Layers,
    Sparkles,
    Download,
    Share2,
    Calendar,
    Eye,
    TrendingUp,
    Building2,
    Zap,
    Globe,
    Briefcase,
    Landmark,
    Home,
    CheckCircle2,
    Smartphone,
    LayoutTemplate
} from 'lucide-react';
import { DATA_ANGLES } from '../constants/dataAngles';
import { Dashboard, Widget, UserRole } from '../types';
import WidgetCard from './WidgetCard';
import Hero from './panel/Hero';
import DatasetTabs from './panel/DatasetTabs';
import PanelSidebar from './panel/Sidebar';
import DatasetContent from './panel/DatasetContent';
import DashboardEmbed from './panel/DashboardEmbed';
import CommentsSection from './panel/CommentsSection';
import ReviewsSection from './panel/ReviewsSection';
import { ChevronLeft } from 'lucide-react';

// ============================================
// MOCK DATA - بيانات تجريبية موسعة ومثراة
// ============================================

interface ExtendedDashboard extends Dashboard {
    category: string;
    views: number;
    lastUpdated: string;
    isFavorite: boolean;
    color: string;
    trend: number;
    description: string;
    keyMetrics: string[]; // أبرز المؤشرات في اللوحة
    dataFreq: 'daily' | 'monthly' | 'quarterly' | 'yearly';
}

const DASHBOARD_CATEGORIES = [
    { id: 'all', label: 'الكل' },
    { id: 'economy', label: 'الاقتصاد الكلي' },
    { id: 'energy', label: 'الطاقة والتعدين' },
    { id: 'real_estate', label: 'العقار والإسكان' },
    { id: 'investment', label: 'الاستثمار' },
    { id: 'labor', label: 'سوق العمل' }
];

const MOCK_DASHBOARDS: ExtendedDashboard[] = [
    {
        id: 'odb1',
        name: 'مؤشرات الاستثمار الأجنبي المباشر',
        widgets: ['w1', 'w2'],
        category: 'investment',
        views: 45200,
        lastUpdated: 'منذ ساعتين',
        isFavorite: true,
        color: 'blue',
        trend: 12,
        type: 'official',
        description: 'رصد شامل لتدفقات الاستثمار الأجنبي وتوزيعها حسب القطاعات والمناطق الإدارية.',
        keyMetrics: ['صافي الاستثمار', 'التراخيص الجديدة', 'توزيع الدول'],
        dataFreq: 'quarterly'
    },
    {
        id: 'odb2',
        name: 'لوحة الرقم القياسي لأسعار المستهلك (التضخم)',
        widgets: ['w3', 'w4'],
        category: 'economy',
        views: 32100,
        lastUpdated: 'منذ يوم',
        isFavorite: false,
        color: 'green',
        trend: 5,
        type: 'official',
        description: 'تحليل شهري لتغيرات أسعار السلع والخدمات وتأثيرها على القوة الشرائية.',
        keyMetrics: ['معدل التضخم', 'النقل', 'الأغذية والمشروبات', 'السكن'],
        dataFreq: 'monthly'
    },
    {
        id: 'odb3_mining',
        name: 'المرصد الوطني للتعدين',
        widgets: ['w1', 'w3'],
        category: 'energy',
        views: 56000,
        lastUpdated: 'مباشر',
        isFavorite: true,
        color: 'amber',
        trend: 24,
        type: 'official',
        description: 'خريطة تفاعلية للموارد المعدنية، الرخص التعدينية، وحجم الإنتاج الفعلي.',
        keyMetrics: ['الرخص النشطة', 'إنتاج الذهب', 'الاستكشاف'],
        dataFreq: 'daily'
    },
    // ... generating enriched mock data
    ...Array.from({ length: 27 }).map((_, i) => {
        const catsLines = [
            { c: 'economy', desc: 'متابعة الأداء الاقتصادي الكلي ومؤشرات النمو والناتج المحلي.', metrics: ['GDP', 'الدين العام', 'الايرادات'] },
            { c: 'energy', desc: 'إحصائيات تفصيلية لاستهلاك وتصدير الطاقة ومشاريع الطاقة المتجددة.', metrics: ['الإنتاج', 'الصادرات', 'الاستهلاك المحلي'] },
            { c: 'real_estate', desc: 'رصد دقيق لحركة السوق العقاري والصفقات وكود البناء.', metrics: ['المبيعات', 'المتوسط السعري', 'المخططات'] },
            { c: 'investment', desc: 'تحليل الفرص الاستثمارية ونمو الشركات وتسهيلات الأعمال.', metrics: ['السجلات', 'رأس المال', 'النمو'] },
            { c: 'labor', desc: 'مؤشرات التوطين ومعدلات البطالة ومتوسط الأجور في القطاع الخاص.', metrics: ['معدل البطالة', 'الرواتب', 'القوى العاملة'] }
        ];
        const item = catsLines[i % catsLines.length];
        const colors = ['blue', 'green', 'amber', 'purple', 'rose', 'indigo', 'cyan'];

        return {
            id: `dash_${i + 4}`,
            name: [
                'تقرير سوق العمل المتعمق', 'التبادل التجاري الدولي', 'أداء القطاع الصناعي', 'مشاريع سكني', 'السياحة الوافدة',
                'التجارة الإلكترونية', 'الشركات الصغيرة والمتوسطة', 'القطاع المالي والمصرفي', 'سلاسل الإمداد والخدمات اللوجستية',
                'التعليم وسوق العمل', 'الرعاية الصحية', 'التحول الرقمي الحكومي', 'منظومة النقل', 'الأمن الغذائي والزراعة',
                'قطاع الترفيه وجودة الحياة', 'أسواق المال وتداول', 'الطاقة المتجددة', 'المحتوى المحلي',
            ][i % 18] + ` ${2025}`,
            widgets: ['w1'],
            category: item.c,
            views: Math.floor(Math.random() * 50000) + 1000,
            lastUpdated: ['منذ ساعة', 'منذ يومين', 'أسبوعي', 'شهري'][i % 4],
            isFavorite: Math.random() > 0.8,
            color: colors[i % colors.length],
            trend: Math.floor(Math.random() * 30) - 5,
            type: 'official' as const,
            description: item.desc,
            keyMetrics: item.metrics,
            dataFreq: (['daily', 'monthly', 'quarterly'] as const)[i % 3]
        };
    })
];

const getColorClasses = (color: string) => {
  const mapping: any = {
    blue: { bg: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-100', iconBg: 'bg-blue-500/10', iconText: 'text-blue-400' },
    green: { bg: 'bg-green-50', text: 'text-green-600', border: 'border-green-100', iconBg: 'bg-green-500/10', iconText: 'text-green-400' },
    amber: { bg: 'bg-amber-50', text: 'text-amber-600', border: 'border-amber-100', iconBg: 'bg-amber-500/10', iconText: 'text-amber-400' },
    indigo: { bg: 'bg-indigo-50', text: 'text-indigo-600', border: 'border-indigo-100', iconBg: 'bg-indigo-500/10', iconText: 'text-indigo-400' },
    emerald: { bg: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-100', iconBg: 'bg-emerald-500/10', iconText: 'text-emerald-400' },
    rose: { bg: 'bg-rose-50', text: 'text-rose-600', border: 'border-rose-100', iconBg: 'bg-rose-500/10', iconText: 'text-rose-400' },
    purple: { bg: 'bg-purple-50', text: 'text-purple-600', border: 'border-purple-100', iconBg: 'bg-purple-500/10', iconText: 'text-purple-400' },
    cyan: { bg: 'bg-cyan-50', text: 'text-cyan-600', border: 'border-cyan-100', iconBg: 'bg-cyan-500/10', iconText: 'text-cyan-400' },
    orange: { bg: 'bg-orange-50', text: 'text-orange-600', border: 'border-orange-100', iconBg: 'bg-orange-500/10', iconText: 'text-orange-400' },
    slate: { bg: 'bg-slate-50', text: 'text-slate-600', border: 'border-slate-100', iconBg: 'bg-slate-500/10', iconText: 'text-slate-400' },
  };
  return mapping[color] || mapping.blue;
};

// ============================================
// COMPONENTS
// ============================================

type ViewMode = 'grid' | 'list' | 'compact';

interface OfficialDashboardsPageProps {
    dashboards: Dashboard[];
    widgets: Widget[];
    userRole: UserRole;
}

const OfficialDashboardsPage: React.FC<OfficialDashboardsPageProps> = ({ widgets, userRole }) => {
    const [searchParams] = useSearchParams();
    const activeTab = searchParams.get('tab') || 'smart';
    const navigate = useNavigate();
    const [viewMode, setViewMode] = useState<ViewMode>('grid');
    const [searchQuery, setSearchQuery] = useState('');
    const [activeCategory, setActiveCategory] = useState('all');
    const [favorites, setFavorites] = useState<string[]>(['odb1', 'odb3_mining']);
    const [selectedDash, setSelectedDash] = useState<ExtendedDashboard | null>(null);
    const [activePanelTab, setActivePanelTab] = useState('dataset');

    // Filter Logic
    const filteredDashboards = useMemo(() => {
        return MOCK_DASHBOARDS.filter(d => {
            const matchesSearch = d.name.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesCategory = activeCategory === 'all' || d.category === activeCategory;
            return matchesSearch && matchesCategory;
        });
    }, [searchQuery, activeCategory]);

    const toggleFavorite = (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        setFavorites(prev =>
            prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
        );
    };
    
    if (selectedDash) {
        const isFullWidthTab = activePanelTab === 'dashboard';
        
        return (
            <div className="min-h-screen bg-transparent font-sans text-right animate-fadeIn" dir="rtl">
                <div className="bg-white border-b border-gray-100 sticky top-0 z-[60] py-4 px-6 shadow-sm">
                    <button 
                        onClick={() => setSelectedDash(null)}
                        className="flex items-center gap-2 text-gov-blue font-black hover:bg-gray-50 px-4 py-2 rounded-xl transition-all"
                    >
                        <ChevronLeft size={20} />
                        العودة إلى كل اللوحات
                    </button>
                </div>
                <main>
                    <Hero />
                    
                    <DatasetTabs 
                        activeTab={activePanelTab} 
                        onTabChange={setActivePanelTab} 
                    />

                    <div className="container mx-auto px-4 py-8">
                        <div className={`flex flex-col ${isFullWidthTab ? '' : 'lg:flex-row'} gap-8`}>
                            
                            {/* Main Content Area */}
                            <div className={`w-full ${isFullWidthTab ? '' : 'lg:w-2/3'} order-2 lg:order-1`}>
                               {activePanelTab === 'dataset' ? (
                                 <DatasetContent />
                               ) : activePanelTab === 'dashboard' ? (
                                 <DashboardEmbed />
                               ) : activePanelTab === 'comments' ? (
                                 <CommentsSection />
                               ) : activePanelTab === 'reviews' ? (
                                 <ReviewsSection />
                               ) : (
                                 <div className="p-12 text-center text-gray-400 bg-white rounded-xl border border-gray-200">
                                    <p className="text-lg">المحتوى قيد التطوير لهذا التبويب</p>
                                 </div>
                               )}
                            </div>

                            {/* Sidebar (Only shown if NOT full width tab) */}
                            {!isFullWidthTab && (
                                <aside className="w-full lg:w-1/3 order-1 lg:order-2">
                                    <PanelSidebar />
                                </aside>
                            )}

                        </div>
                    </div>
                </main>
            </div>
        );
    }

    // --- RENDERERS ---

    /**
     * GRID VIEW DESIGN - PRO VERSION
     * تصميم يركز على المحتوى والشرح
     */
    const renderGridView = () => (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredDashboards.map(dash => (
                <div
                    key={dash.id}
                    onClick={() => setSelectedDash(dash)}
                    className="group relative bg-white rounded-[2rem] border border-gray-100/80 shadow-sm hover:shadow-2xl hover:shadow-blue-500/10 hover:-translate-y-1.5 transition-all duration-500 cursor-pointer overflow-hidden flex flex-col h-[380px]"
                >
                    {/* 1. Header: Visual Context & Actions */}
                    <div className={`h-36 relative p-6 flex flex-col justify-between overflow-hidden`}>
                        {/* Background Mesh/Pattern */}
                        <div className={`absolute inset-0 bg-gradient-to-br from-${dash.color}-50 via-white to-${dash.color}-50 opacity-100 group-hover:scale-105 transition-transform duration-700`}></div>
                        <div className={`absolute inset-0 bg-[radial-gradient(${dash.color}_1px,transparent_1px)] [background-size:16px_16px] opacity-[0.15]`}></div>

                        <div className="relative z-10 flex justify-between items-start">
                            {/* Icon Box */}
                            <div className={`w-12 h-12 rounded-2xl bg-white shadow-lg shadow-${dash.color}-500/10 border border-${dash.color}-100 flex items-center justify-center text-${dash.color}-600 group-hover:rotate-6 transition-transform duration-300`}>
                                {dash.category === 'economy' && <Landmark size={22} strokeWidth={1.5} />}
                                {dash.category === 'energy' && <Zap size={22} strokeWidth={1.5} />}
                                {dash.category === 'investment' && <TrendingUp size={22} strokeWidth={1.5} />}
                                {dash.category === 'real_estate' && <Building2 size={22} strokeWidth={1.5} />}
                                {dash.category === 'labor' && <Briefcase size={22} strokeWidth={1.5} />}
                                {/* Default Icon */}
                                {!['economy', 'energy', 'investment', 'real_estate', 'labor'].includes(dash.category) && <BarChart2 size={22} strokeWidth={1.5} />}
                            </div>

                            <button
                                onClick={(e) => toggleFavorite(e, dash.id)}
                                className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 border border-transparent hover:border-gray-100 ${favorites.includes(dash.id) ? 'bg-amber-50 text-amber-500' : 'bg-white/80 backdrop-blur text-gray-400 hover:bg-white hover:text-red-500 hover:shadow-md'}`}
                            >
                                <Heart size={18} fill={favorites.includes(dash.id) ? "currentColor" : "none"} />
                            </button>
                        </div>

                        {/* Frequency Badge */}
                        <div className="relative z-10 self-end">
                            <span className={`text-[10px] uppercase tracking-wider font-bold px-2.5 py-1 rounded-lg bg-white/80 backdrop-blur border border-${dash.color}-100 text-${dash.color}-700 shadow-sm`}>
                                {dash.dataFreq === 'daily' ? 'Live Data' : `${dash.dataFreq} Update`}
                            </span>
                        </div>
                    </div>

                    {/* 2. Body: Content Explanation */}
                    <div className="px-6 pt-2 pb-6 flex-1 flex flex-col">
                        {/* Category & Title */}
                        <div className="mb-4">
                            <span className="text-[11px] font-bold text-gray-400 mb-1 block">
                                {DASHBOARD_CATEGORIES.find(c => c.id === dash.category)?.label}
                            </span>
                            <h3 className="font-bold text-gray-900 text-xl leading-snug group-hover:text-blue-700 transition-colors line-clamp-2">
                                {dash.name}
                            </h3>
                        </div>

                        {/* Description */}
                        <p className="text-sm text-gray-500 leading-relaxed mb-5 line-clamp-2">
                            {dash.description}
                        </p>

                        {/* What's Inside (Key Metrics) */}
                        <div className="mt-auto">
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-1">
                                <Layers size={10} /> بيانات اللوحة
                            </p>
                            <div className="flex flex-wrap gap-2">
                                {dash.keyMetrics.map((metric, idx) => (
                                    <span key={idx} className="text-[11px] font-medium bg-gray-50 text-gray-600 px-2.5 py-1.5 rounded-md border border-gray-100 group-hover:border-blue-100 group-hover:text-blue-700 transition-colors">
                                        {metric}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* 3. Footer: Stats & Action */}
                    <div className="px-6 py-4 border-t border-gray-50 bg-gray-50/30 flex items-center justify-between group-hover:bg-blue-50/30 transition-colors">
                        <div className="flex items-center gap-3 text-xs font-medium text-gray-400">
                            <span className="flex items-center gap-1 hover:text-gray-600 cursor-help" title="مشاهدات">
                                <Eye size={14} /> {(dash.views / 1000).toFixed(1)}k
                            </span>
                            <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                            <span className={`flex items-center gap-1 ${dash.trend > 0 ? 'text-green-600' : 'text-gray-400'}`}>
                                {dash.trend > 0 ? '+' : ''}{dash.trend}% تفاعل
                            </span>
                        </div>

                        <div className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-400 group-hover:bg-blue-600 group-hover:border-blue-600 group-hover:text-white transition-all shadow-sm group-hover:shadow-lg group-hover:shadow-blue-500/30">
                            <ArrowUpRight size={16} className="group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform" />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );

    /**
     * LIST VIEW DESIGN
     */
    const renderListView = () => (
        <div className="space-y-3 bg-white rounded-3xl border border-gray-100 p-2 shadow-sm">
            {filteredDashboards.map(dash => (
                <div
                    key={dash.id}
                    onClick={() => setSelectedDash(dash)}
                    className="group flex items-center gap-4 p-3 rounded-2xl hover:bg-gray-50 transition-colors cursor-pointer border border-transparent hover:border-gray-100"
                >
                    {/* Icon */}
                    <div className={`w-12 h-12 rounded-xl bg-${dash.color}-50 flex items-center justify-center text-${dash.color}-600 shrink-0`}>
                        {dash.category === 'economy' ? <Landmark size={24} /> : <BarChart2 size={24} />}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-gray-900 text-base mb-1 truncate group-hover:text-blue-600 transition-colors">
                            {dash.name}
                        </h3>
                        <div className="flex items-center gap-3 text-xs text-gray-500">
                            <span className="flex items-center gap-1"><Layers size={12} /> {DASHBOARD_CATEGORIES.find(c => c.id === dash.category)?.label}</span>
                            <span className="flex items-center gap-1 hidden sm:flex"><Info size={12} /> {dash.description.substring(0, 40)}...</span>
                        </div>
                    </div>

                    {/* Metrics Preview (New for List View) */}
                    <div className="hidden lg:flex gap-2">
                        {dash.keyMetrics.slice(0, 2).map((m, i) => (
                            <span key={i} className="text-[10px] bg-white border border-gray-200 px-2 py-1 rounded-md text-gray-500">
                                {m}
                            </span>
                        ))}
                    </div>

                    {/* Trend & Action */}
                    <div className="text-left shrink-0 hidden sm:block">
                        <div className={`text-sm font-bold ${dash.trend > 0 ? 'text-green-600' : 'text-red-500'} flex items-center justify-end gap-1`}>
                            {dash.trend > 0 ? '+' : ''}{dash.trend}% <TrendingUp size={14} className={dash.trend < 0 ? 'rotate-180' : ''} />
                        </div>
                        <div className="text-[10px] text-gray-400">تفاعل</div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                        <button
                            onClick={(e) => toggleFavorite(e, dash.id)}
                            className={`p-2 rounded-lg transition-colors ${favorites.includes(dash.id) ? 'bg-amber-50 text-amber-500' : 'text-gray-300 hover:bg-gray-100 hover:text-gray-500'}`}
                        >
                            <Heart size={18} fill={favorites.includes(dash.id) ? "currentColor" : "none"} />
                        </button>
                        <button className="p-2 text-gray-300 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                            <ArrowUpRight size={18} />
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );

    /**
     * COMPACT VIEW DESIGN
     */
    const renderCompactView = () => (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {filteredDashboards.map(dash => (
                <div
                    key={dash.id}
                    onClick={() => setSelectedDash(dash)}
                    className="group bg-white rounded-2xl border border-gray-100 hover:border-blue-300 p-4 hover:shadow-lg transition-all cursor-pointer text-center relative"
                >
                    <button
                        onClick={(e) => toggleFavorite(e, dash.id)}
                        className={`absolute top-2 right-2 p-1.5 rounded-full ${favorites.includes(dash.id) ? 'text-amber-500' : 'text-transparent group-hover:text-gray-300 hover:bg-gray-50'}`}
                    >
                        <Star size={14} fill={favorites.includes(dash.id) ? "currentColor" : "none"} />
                    </button>

                    <div className={`w-12 h-12 mx-auto rounded-full bg-${dash.color}-50 flex items-center justify-center text-${dash.color}-600 mb-3 group-hover:scale-110 transition-transform`}>
                        {/* Simplified icon logic for compact view, using BarChart2 as a default */}
                        <BarChart2 size={20} />
                    </div>

                    <h3 className="font-bold text-gray-900 text-sm mb-1 line-clamp-2 min-h-[2.5rem]">
                        {dash.name}
                    </h3>

                    <p className="text-[10px] text-gray-400 mb-3">
                        {DASHBOARD_CATEGORIES.find(c => c.id === dash.category)?.label}
                    </p>

                    <div className="flex justify-center items-center gap-2">
                        <span className="text-[10px] bg-gray-50 text-gray-600 px-2 py-0.5 rounded border border-gray-100">
                            {dash.views > 1000 ? (dash.views / 1000).toFixed(1) + 'k' : dash.views}
                        </span>
                        {dash.isFavorite && <span className="w-2 h-2 rounded-full bg-amber-400"></span>}
                    </div>
                </div>
            ))}
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-50/30 pb-20 font-sans text-right" dir="rtl">
            {/* --- NEW DATA ANGLES SECTION --- */}
            {activeTab === 'smart' && (
              <div className="bg-slate-900 pt-16 pb-24 px-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3" />
                <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-indigo-600/10 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/3" />

                <div className="container mx-auto relative z-10 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/5 border border-white/10 rounded-full text-[10px] font-black uppercase text-blue-400 tracking-widest backdrop-blur-md mb-8">
                        <Sparkles size={14} className="animate-pulse" />
                        نظام زوايا البيانات الذكي
                    </div>
                    <h1 className="text-4xl lg:text-6xl font-black text-white mb-6 tracking-tight">
                        استكشف الاقتصاد <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">بزاوية مختلفة</span>
                    </h1>
                    <p className="text-slate-400 text-lg lg:text-xl font-bold max-w-3xl mx-auto leading-relaxed mb-16">
                        نحوّل البيانات الجافة إلى رؤى استراتيجية. اختر زاوية التحليل التي تهمك واستعرض البيانات المجمعة من كافة المصادر الرسمية.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
                        {DATA_ANGLES.map((angle) => {
                            const Icon = angle.icon;
                            const colors = getColorClasses(angle.color);
                            return (
                                <div
                                    key={angle.id}
                                    onClick={() => navigate(`/dataset-explorer/${angle.id}`)}
                                    className="group relative bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-[32px] hover:bg-white/10 hover:border-blue-400/50 hover:-translate-y-2 transition-all duration-500 cursor-pointer text-right flex flex-col items-start min-h-[240px]"
                                >
                                    <div className={`p-4 ${colors.iconBg} ${colors.iconText} rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-500`}>
                                        <Icon size={32} />
                                    </div>

                                    {angle.badge && (
                                        <span className={`absolute top-6 left-6 px-2 py-0.5 rounded-lg ${colors.iconBg} ${colors.iconText} text-[8px] font-black uppercase tracking-tighter border border-white/10`}>
                                            {angle.badge}
                                        </span>
                                    )}

                                    <h3 className="text-lg font-black text-white mb-3 group-hover:text-blue-400 transition-colors">
                                        {angle.title}
                                    </h3>
                                    <p className="text-xs text-slate-400 font-bold leading-relaxed line-clamp-3">
                                        {angle.shortDescription}
                                    </p>

                                    <div className="mt-auto pt-6 flex items-center gap-2 text-blue-400 text-[10px] font-black opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0">
                                        استكشاف الجداول والخرائط
                                        <ArrowUpRight size={14} />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
              </div>
            )}

            {/* --- EXISTING DASHBOARDS LIST (MOVED DOWN) --- */}
            {activeTab === 'official' && (
              <div className="container mx-auto px-6 -mt-12 relative z-20">
                {/* Controls Toolbar */}
                <div className="bg-white/90 backdrop-blur-xl rounded-[32px] border border-slate-100 shadow-2xl p-3 mb-10 flex flex-col lg:flex-row gap-4 items-center justify-between">
                    <div className="flex items-center gap-3 px-4">
                        <div className="w-10 h-10 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-600">
                           <LayoutTemplate size={20} />
                        </div>
                        <div>
                           <h2 className="text-sm font-black text-slate-900">اللوحات المتكاملة</h2>
                           <p className="text-[10px] text-slate-400 font-bold">لوحات تحليلية جاهزة للعرض المباشر</p>
                        </div>
                    </div>

                    <div className="flex-1 max-w-md w-full relative">
                        <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="ابحث عن لوحة محددة..."
                            className="w-full bg-slate-50 border border-slate-100 rounded-2xl pr-12 pl-4 py-3 text-sm focus:ring-2 focus:ring-blue-500/20 outline-none font-bold"
                        />
                    </div>

                    <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-2xl">
                        <button onClick={() => setViewMode('grid')} className={`p-2 rounded-xl ${viewMode === 'grid' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-400'}`}><LayoutGrid size={18} /></button>
                        <button onClick={() => setViewMode('list')} className={`p-2 rounded-xl ${viewMode === 'list' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-400'}`}><List size={18} /></button>
                    </div>
                </div>

                {/* Categories */}
                <div className="flex items-center gap-1 overflow-x-auto w-full p-1 no-scrollbar mb-8">
                    {DASHBOARD_CATEGORIES.map(cat => (
                        <button
                            key={cat.id}
                            onClick={() => setActiveCategory(cat.id)}
                            className={`px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-all ${activeCategory === cat.id
                                    ? 'bg-slate-900 text-white shadow-md scale-105'
                                    : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'
                                }`}
                        >
                            {cat.label}
                        </button>
                    ))}
                </div>

                {/* Content */}
                <div className="animate-fadeIn min-h-[500px]">
                    {filteredDashboards.length > 0 ? (
                        <>
                            {viewMode === 'grid' && renderGridView()}
                            {viewMode === 'list' && renderListView()}
                            {viewMode === 'compact' && renderCompactView()}
                        </>
                    ) : (
                        <div className="text-center py-20 bg-gray-50 rounded-[2rem] border-2 border-dashed border-gray-200">
                            <div className="inline-block p-6 bg-white rounded-full shadow-sm mb-4">
                                <Search size={40} className="text-gray-300" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">لا توجد نتائج مطابقة</h3>
                            <p className="text-gray-500 max-w-sm mx-auto">لم نعثر على لوحات تطابق بحثك. جرب البحث عن "الناتج المحلي" أو "التضخم".</p>
                        </div>
                    )}
                </div>
              </div>
            )}
            {/* Dashboard details are now handled via full panel view return */}
        </div>
    );
};

export default OfficialDashboardsPage;
