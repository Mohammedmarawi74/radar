import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Heart,
    Share2,
    Bookmark,
    MoreHorizontal,
    CheckCircle2,
    BarChart2,
    ExternalLink,
    Play,
    Clock,
    Headphones,
    Maximize2,
    FileText,
    Plus,
    TrendingUp,
    ArrowUpRight,
    ArrowDownRight,
    AlertTriangle,
    Lightbulb,
    Scale,
    Flame,
    Calendar,
    Quote,
    Layers,
    Vote,
    MapPin,
    Info,
    Check,
    Megaphone,
    BookOpen,
    HelpCircle,
    ListChecks,
    CheckSquare,
    Activity,
    Cpu,
    Briefcase,
    ShieldCheck,
    Zap
} from 'lucide-react';
import { FeedItem, FeedContentType } from '../types';
import WidgetChart from './WidgetChart';

interface FeedCardProps {
    item: FeedItem;
    onAction?: (action: string, itemId: string) => void;
}

const FeedCard: React.FC<FeedCardProps> = ({ item, onAction }) => {
    const navigate = useNavigate();
    const [liked, setLiked] = useState(false);
    const [saved, setSaved] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);

    // --- RENDERERS ---

    const renderSignalAlert = () => {
        const isPos = item.payload.isPositive;
        const colorClass = isPos ? 'emerald' : 'rose';
        
        return (
            <div className={`mt-5 relative group overflow-hidden rounded-[30px] border-2 transition-all duration-500 shadow-2xl ${
                isPos 
                ? 'bg-emerald-50/30 border-emerald-100/50 hover:shadow-emerald-500/10' 
                : 'bg-rose-50/30 border-rose-100/50 hover:shadow-rose-500/10'
            }`}>
                {/* Dynamic Background Mesh */}
                <div className={`absolute -right-20 -top-20 w-80 h-80 rounded-full blur-[100px] opacity-20 transition-all duration-1000 group-hover:scale-125 ${
                    isPos ? 'bg-emerald-400' : 'bg-rose-400'
                }`}></div>
                <div className={`absolute -left-20 -bottom-20 w-80 h-80 rounded-full blur-[100px] opacity-10 ${
                    isPos ? 'bg-blue-400' : 'bg-orange-400'
                }`}></div>

                <div className="relative z-10 p-7">
                    {/* Signal Status Bar */}
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-3">
                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg transition-transform duration-500 group-hover:rotate-12 ${
                                isPos ? 'bg-emerald-500 text-white shadow-emerald-500/30' : 'bg-rose-500 text-white shadow-rose-500/30'
                            }`}>
                                {isPos ? <TrendingUp size={24} /> : <AlertTriangle size={24} />}
                            </div>
                            <div>
                                <h4 className="text-gray-900 font-black text-sm lg:text-base leading-none mb-1">تنبيه إشارة فنيّة</h4>
                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">مصدر البيانات: رادار AI</p>
                            </div>
                        </div>
                        <div className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider backdrop-blur-md shadow-sm border ${
                            isPos 
                            ? 'bg-emerald-500/10 text-emerald-600 border-emerald-200/50' 
                            : 'bg-rose-500/10 text-rose-600 border-rose-200/50'
                        }`}>
                            {isPos ? 'اقتناص فرصة (BUY)' : 'تحذير خروج (SELL)'}
                        </div>
                    </div>

                    <div className="flex flex-col lg:flex-row lg:items-center gap-10">
                        {/* Core Metric */}
                        <div className="flex-shrink-0 text-center lg:text-right">
                            <div className={`text-6xl font-black mb-1 tracking-tighter drop-shadow-sm ${
                                isPos ? 'text-emerald-600' : 'text-rose-600'
                            }`}>
                                {isPos ? '+' : ''}{item.payload.delta}
                            </div>
                            <div className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">نسبة التغيير المتوقعة</div>
                        </div>

                        {/* Technical HUD */}
                        <div className="flex-1 grid grid-cols-2 lg:grid-cols-3 gap-3">
                            <div className="bg-white/60 border border-white/80 backdrop-blur-sm p-4 rounded-[22px] shadow-sm hover:shadow-md transition-shadow">
                                <span className="block text-[9px] font-black text-gray-400 uppercase mb-1">قوة الإشارة</span>
                                <div className="flex items-center gap-1.5">
                                    <div className="flex gap-0.5">
                                        {[1,2,3,4,5].map(i => (
                                            <div key={i} className={`w-1.5 h-3 rounded-full ${i <= 4 ? (isPos ? 'bg-emerald-500' : 'bg-rose-500') : 'bg-gray-100'}`}></div>
                                        ))}
                                    </div>
                                    <span className="text-xs font-black text-gray-700">قوية جداً</span>
                                </div>
                            </div>
                            <div className="bg-white/60 border border-white/80 backdrop-blur-sm p-4 rounded-[22px] shadow-sm">
                                <span className="block text-[9px] font-black text-gray-400 uppercase mb-1">الهدف المتوقع</span>
                                <span className="text-sm font-black text-gray-800">142.50 SAR</span>
                            </div>
                            <div className="bg-white/60 border border-white/80 backdrop-blur-sm p-4 rounded-[22px] shadow-sm">
                                <span className="block text-[9px] font-black text-gray-400 uppercase mb-1">وقف الخسارة</span>
                                <span className={`text-sm font-black ${isPos ? 'text-rose-500' : 'text-emerald-500'}`}>128.00 SAR</span>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 pt-6 border-t border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <p className="text-gray-500 text-sm font-bold leading-relaxed max-w-lg">
                            {item.payload.context}
                        </p>
                        
                        <div className="flex items-center gap-2 shrink-0">
                            <button className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-black text-xs transition-all shadow-lg active:scale-95 ${
                                isPos 
                                ? 'bg-emerald-600 text-white shadow-emerald-600/20 hover:bg-emerald-700' 
                                : 'bg-rose-600 text-white shadow-rose-600/20 hover:bg-rose-700'
                            }`}>
                                <Plus size={16} />
                                إضافة للمنبه الداخلي
                            </button>
                            <button className="p-3 bg-white text-gray-400 rounded-2xl hover:bg-gray-50 hover:text-blue-600 transition-all border border-gray-100 shadow-sm">
                                <Maximize2 size={18} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const renderMarketPulse = () => {
        const isHot = item.payload.status === 'hot';
        const isWarm = item.payload.status === 'warm';
        const color = isHot ? 'orange' : isWarm ? 'yellow' : 'blue';
        const colorHex = isHot ? '#f97316' : isWarm ? '#eab308' : '#3b82f6';

        return (
            <div className="mt-5 p-7 rounded-[35px] bg-white border border-slate-100 shadow-[0_15px_40px_-15px_rgba(0,0,0,0.05)] relative overflow-hidden group hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-700">
                {/* Dynamic Thermal Glow */}
                <div 
                    className="absolute -right-20 -top-20 w-64 h-64 rounded-full blur-[80px] opacity-10 transition-all duration-1000 group-hover:scale-150"
                    style={{ backgroundColor: colorHex }}
                ></div>

                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 relative z-10">
                    <div className="text-right">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span>
                            <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-[0.2em]">تحليل نبض القطاع</p>
                        </div>
                        <h3 className="text-2xl font-black text-slate-900 tracking-tight">{item.payload.sector}</h3>
                    </div>
                    
                    <div className={`flex items-center gap-2.5 px-5 py-2.5 rounded-2xl border backdrop-blur-md transition-all duration-500 group-hover:scale-105 ${
                        isHot ? 'bg-orange-50 text-orange-600 border-orange-100 shadow-lg shadow-orange-500/10' : 
                        isWarm ? 'bg-yellow-50 text-yellow-700 border-yellow-100' : 
                        'bg-blue-50 text-blue-600 border-blue-100'
                    }`}>
                        <div className="relative">
                            <Flame size={18} className={isHot ? 'animate-bounce' : ''} />
                            {isHot && <span className="absolute inset-0 bg-orange-400 blur-md rounded-full opacity-50 animate-pulse"></span>}
                        </div>
                        <span className="text-xs font-black uppercase tracking-widest">{isHot ? 'نشاط قياسي' : isWarm ? 'تحرك نشط' : 'استقرار هادئ'}</span>
                    </div>
                </div>

                {/* Advanced Thermal Meter */}
                <div className="relative mb-8 group/meter">
                    <div className="flex items-center justify-between mb-3 px-1">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">مقياس الحرارة</span>
                        <span className="text-sm font-black text-slate-900">{item.payload.score}%</span>
                    </div>
                    
                    <div className="h-4 w-full bg-slate-100/50 rounded-full p-1 border border-slate-100 overflow-hidden shadow-inner flex items-center">
                        <div 
                            className={`h-full rounded-full relative transition-all duration-[2000ms] cubic-bezier(0.34, 1.56, 0.64, 1) flex items-center justify-end pr-1`}
                            style={{ 
                                width: `${item.payload.score}%`,
                                background: `linear-gradient(90deg, #3b82f6 0%, ${colorHex} 100%)`,
                                boxShadow: `0 0 20px -5px ${colorHex}`
                            }}
                        >
                            <div className="w-1.5 h-1.5 bg-white rounded-full shadow-sm animate-ping"></div>
                        </div>
                    </div>
                    
                    {/* Tick Marks */}
                    <div className="absolute top-7 left-0 w-full flex justify-between px-1 pointer-events-none opacity-30">
                        {[0, 25, 50, 75, 100].map(v => (
                            <div key={v} className="flex flex-col items-center gap-1">
                                <div className="w-px h-1.5 bg-slate-400"></div>
                                <span className="text-[8px] font-black text-slate-400">{v}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-slate-50 relative z-10">
                    <div className="bg-slate-50/50 p-4 rounded-2xl border border-slate-100/50 hover:bg-white hover:shadow-lg transition-all">
                        <span className="block text-[9px] font-black text-slate-400 mb-1 uppercase">معدل التذبذب</span>
                        <span className="text-sm font-black text-slate-800">متوسط (4.2%)</span>
                    </div>
                    <div className="bg-slate-50/50 p-4 rounded-2xl border border-slate-100/50 hover:bg-white hover:shadow-lg transition-all">
                        <span className="block text-[9px] font-black text-slate-400 mb-1 uppercase">حجم التداول</span>
                        <span className="text-sm font-black text-slate-800">مرتفع (1.2M)</span>
                    </div>
                </div>

                <p className="mt-8 text-sm text-slate-500 font-bold leading-relaxed relative z-10 pr-4 border-r-2 border-slate-100/50 group-hover:border-blue-400 transition-colors">
                    {item.payload.summary}
                </p>
            </div>
        );
    };

    const renderFact = () => (
        <div className="group mt-6 relative bg-gradient-to-br from-amber-500/5 to-orange-600/5 border border-amber-200/20 rounded-[40px] p-10 hover:shadow-[0_40px_80px_-20px_rgba(245,158,11,0.15)] transition-all duration-700 overflow-hidden text-center">
            {/* Ambient Glows */}
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-amber-400 rounded-full blur-[80px] opacity-10 group-hover:opacity-20 transition-opacity"></div>
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-orange-500 rounded-full blur-[80px] opacity-10 group-hover:opacity-20 transition-opacity"></div>

            {/* Pattern Overlay */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>

            <div className="relative z-10 flex flex-col items-center">
                {/* Floating Intelligence Badge */}
                <div className="relative mb-8">
                    <div className="absolute inset-0 bg-amber-500 blur-2xl opacity-20 animate-pulse"></div>
                    <div className="w-16 h-16 bg-white rounded-[22px] shadow-2xl shadow-amber-500/20 flex items-center justify-center border border-amber-100 text-amber-500 relative z-10 group-hover:rotate-[15deg] transition-transform duration-500">
                        <Lightbulb size={32} className="fill-current" />
                    </div>
                </div>

                <div className="inline-flex items-center gap-2 px-5 py-2 bg-amber-500/10 text-amber-600 rounded-2xl text-[10px] font-black uppercase tracking-[0.25em] mb-6 border border-amber-500/10 scale-95 hover:scale-100 transition-transform cursor-default">
                    <Zap size={10} className="fill-current" /> اكتشاف ذكي
                </div>

                <h3 className="text-2xl lg:text-3xl font-black text-slate-900 leading-[1.4] mb-8 tracking-tight max-w-2xl">
                    "{item.payload.fact}"
                </h3>

                {/* Insight Highlights */}
                <div className="flex flex-wrap justify-center gap-3 mb-10">
                    <div className="px-6 py-3 bg-white/80 backdrop-blur-md rounded-2xl border border-amber-100/50 shadow-sm text-sm font-black text-amber-600">
                        {item.payload.highlight}
                    </div>
                </div>

                {/* Precise Source Footer */}
                <div className="pt-8 border-t border-amber-200/20 w-full flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center border border-slate-200">
                            <FileText size={14} className="text-slate-400" />
                        </div>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{item.payload.source}</span>
                    </div>
                    
                    <button className="flex items-center gap-2 text-amber-600 hover:text-amber-700 font-black text-[10px] uppercase tracking-widest transition-all hover:gap-3">
                        تحقق من المصدر <ArrowDownRight size={14} />
                    </button>
                </div>
            </div>
        </div>
    );

    const renderComparison = () => (
        <div className="mt-6 relative group">
            {/* Background Decorative Beam/Connection */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent opacity-50 z-0"></div>
            
            <div className="flex flex-col md:flex-row items-center gap-4 relative z-10">
                {/* Item A Card */}
                <div className="flex-1 w-full bg-white border border-slate-100 rounded-[35px] p-8 text-center hover:shadow-2xl hover:shadow-blue-500/10 hover:border-blue-200 transition-all duration-700 group/a cursor-pointer">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-50 text-blue-600 rounded-2xl text-[10px] font-black uppercase tracking-[0.1em] mb-6 border border-blue-100/50">
                        <ArrowUpRight size={12} className="group-hover/a:translate-x-1 group-hover/a:-translate-y-1 transition-transform" />
                        الخيار الأول
                    </div>
                    <div className="text-[11px] text-slate-400 font-extrabold uppercase tracking-[0.2em] mb-3">{item.payload.itemA.label}</div>
                    <div className="text-5xl font-black text-slate-900 group-hover/a:text-blue-600 transition-colors tracking-tighter mb-4">
                        {item.payload.itemA.value}
                    </div>
                    <div className="flex justify-center">
                        <div className="h-1.5 w-24 bg-slate-50 rounded-full overflow-hidden border border-slate-100">
                            <div className="h-full bg-gradient-to-r from-blue-400 to-blue-600 w-3/4 shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>
                        </div>
                    </div>
                </div>

                {/* Centered VS Badge - More Prominent & Bold */}
                <div className="relative z-20 shrink-0 -my-8 md:my-0 md:-mx-10 select-none">
                    <div className="w-24 h-24 rounded-full bg-white shadow-[0_25px_60px_-15px_rgba(0,0,0,0.2)] flex items-center justify-center border-[6px] border-slate-50 relative group-hover:scale-110 transition-transform duration-500 ease-out">
                        {/* Permanent Glow */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/10 to-purple-500/10 rounded-full"></div>
                        <div className="absolute inset-0 border-2 border-slate-100/50 rounded-full scale-90"></div>
                        
                        <div className="flex flex-col items-center justify-center leading-none z-10">
                            <span className="text-xl font-black text-blue-600 uppercase tracking-tighter drop-shadow-sm">VS</span>
                            <div className="h-[2px] w-8 bg-gradient-to-r from-blue-200 via-slate-400 to-purple-200 my-1.5 opacity-50"></div>
                            <span className="text-[11px] font-black text-slate-900 uppercase italic tracking-widest">رادار</span>
                        </div>
                    </div>
                </div>

                {/* Item B Card */}
                <div className="flex-1 w-full bg-white border border-slate-100 rounded-[35px] p-8 text-center hover:shadow-2xl hover:shadow-purple-500/10 hover:border-purple-200 transition-all duration-700 group/b cursor-pointer">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-purple-50 text-purple-600 rounded-2xl text-[10px] font-black uppercase tracking-[0.1em] mb-6 border border-purple-100/50">
                        <ArrowDownRight size={12} className="group-hover/b:translate-x-1 group-hover/b:translate-y-1 transition-transform" />
                        الخيار الثاني
                    </div>
                    <div className="text-[11px] text-slate-400 font-extrabold uppercase tracking-[0.2em] mb-3">{item.payload.itemB.label}</div>
                    <div className="text-5xl font-black text-slate-400 group-hover/b:text-purple-600 transition-colors tracking-tighter mb-4">
                        {item.payload.itemB.value}
                    </div>
                    <div className="flex justify-center">
                        <div className="h-1.5 w-24 bg-slate-50 rounded-full overflow-hidden border border-slate-100">
                            <div className="h-full bg-gradient-to-r from-purple-400 to-purple-600 w-1/2"></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Smart Insights Footer */}
            <div className="mt-8 flex items-start gap-4 p-5 bg-slate-50/50 rounded-3xl border border-slate-100 group-hover:bg-white group-hover:border-blue-100 transition-all">
                <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-blue-500 shrink-0 border border-slate-100">
                    <Scale size={20} />
                </div>
                <div>
                    <h5 className="text-xs font-black text-slate-800 mb-1">تحليل ذكاء الرادار</h5>
                    <p className="text-[11px] font-bold text-slate-400 leading-relaxed">
                        بناءً على حركة السعر الحالية وتدفق السيولة، يظهر **{item.payload.itemA.label}** أداءً أقوى بنسبة 15% من الناحية الفنية، مع حفاظ **{item.payload.itemB.label}** على استقرار أكبر في المدى المتوسط.
                    </p>
                </div>
            </div>
        </div>
    );

    const renderWeeklySnapshot = () => (
        <div className="mt-4 bg-slate-900 text-white rounded-2xl p-6 shadow-2xl relative overflow-hidden">
            {/* Abstract Shapes */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500 rounded-full blur-[100px] opacity-20 -mr-20 -mt-20"></div>
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-purple-500 rounded-full blur-[60px] opacity-20 -ml-10 -mb-10"></div>

            <div className="relative z-10">
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
                    <h4 className="font-bold flex items-center gap-2 text-lg">
                        <Calendar size={20} className="text-blue-400" />
                        ملخص الأسواق
                    </h4>
                    <span className="text-xs bg-white/10 px-2 py-1 rounded text-gray-300">الأسبوع 42</span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    {item.payload.highlights.map((point: any, idx: number) => (
                        <div key={idx} className="bg-white/5 rounded-xl p-3 border border-white/5 hover:bg-white/10 transition-colors">
                            <p className="text-xs text-gray-400 mb-1">{point.label}</p>
                            <p className="text-lg font-bold text-white tracking-wide">{point.value}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );

    const renderBreakingNews = () => (
        <div className="group mt-6 relative bg-gradient-to-br from-red-600 via-rose-700 to-red-900 text-white rounded-[40px] p-8 lg:p-10 shadow-[0_40px_80px_-20px_rgba(220,38,38,0.3)] overflow-hidden transition-all duration-700 hover:scale-[1.01]">
            {/* Dynamic Scanning Line */}
            <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent h-1/2 -translate-y-full group-hover:translate-y-[200%] transition-transform duration-[3000ms] ease-linear repeat-infinite pointer-events-none"></div>
            
            {/* Glow Orbs */}
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-white rounded-full blur-[100px] opacity-10 animate-pulse"></div>
            <div className="absolute -bottom-20 -left-20 w-48 h-48 bg-black rounded-full blur-[80px] opacity-20"></div>

            <div className="relative z-10 flex flex-col md:flex-row items-start gap-8">
                {/* Alert Icon with Ring Effect */}
                <div className="relative shrink-0">
                    <div className="absolute inset-0 bg-white blur-xl opacity-20 animate-ping"></div>
                    <div className="w-20 h-20 bg-white/10 backdrop-blur-xl rounded-[28px] flex items-center justify-center border border-white/20 shadow-2xl relative z-10">
                        <Megaphone size={36} className="text-white fill-white animate-bounce-slow" />
                    </div>
                </div>

                <div className="flex-1 text-right">
                    <div className="flex flex-wrap items-center justify-end md:justify-start gap-4 mb-6 flex-row-reverse md:flex-row">
                        <div className="px-4 py-1.5 bg-white text-red-600 rounded-xl text-[11px] font-black uppercase tracking-[0.2em] shadow-[0_0_20px_rgba(255,255,255,0.4)] animate-pulse">
                            عاجل • BREAKING
                        </div>
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-black/20 rounded-xl border border-white/10">
                            <Clock size={14} className="text-red-200" />
                            <span className="text-xs font-black font-mono text-red-100 uppercase tracking-widest whitespace-nowrap">
                                {new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })}
                            </span>
                        </div>
                    </div>

                    <h3 className="text-3xl lg:text-4xl font-black leading-[1.1] mb-5 tracking-tight drop-shadow-lg">
                        {item.payload.headline}
                    </h3>
                    
                    <p className="text-red-50/80 text-lg font-bold leading-relaxed mb-8 max-w-3xl line-clamp-2 md:line-clamp-none">
                        {item.payload.summary}
                    </p>

                    {/* Interactive Footer */}
                    <div className="flex items-center justify-between pt-8 border-t border-white/10 flex-row-reverse">
                        <div className="flex items-center gap-3">
                            <span className="w-2 h-2 rounded-full bg-white opacity-50 animate-pulse"></span>
                            <span className="text-[10px] font-black text-red-200 uppercase tracking-widest italic">Live Intelligence Stream</span>
                        </div>
                        <button className="flex items-center gap-2 bg-white text-red-700 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl hover:bg-black hover:text-white transition-all active:scale-95 group/btn">
                            عرض التغطية الكاملة
                            <ArrowUpRight size={18} className="group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderTerminology = () => (
        <div className="mt-4 bg-indigo-50/50 rounded-3xl p-8 border border-indigo-100 relative overflow-hidden group hover:bg-indigo-50 transition-colors">
            <BookOpen size={140} className="absolute -left-6 -bottom-6 text-indigo-500/5 rotate-12 group-hover:rotate-6 transition-transform duration-700" />
            <div className="relative z-10 text-center">
                <div className="inline-flex items-center gap-2 text-indigo-600 mb-4 bg-white/60 px-4 py-1.5 rounded-full border border-indigo-100 backdrop-blur-sm">
                    <BookOpen size={14} />
                    <span className="text-[10px] font-black uppercase tracking-widest">قاموس المستثمر</span>
                </div>
                <h3 className="text-3xl lg:text-4xl font-black text-indigo-900 mb-4 font-serif tracking-tight">
                    {item.payload.term}
                </h3>
                <div className="w-12 h-1 bg-indigo-200 mx-auto rounded-full mb-5"></div>
                <p className="text-indigo-900/70 leading-relaxed mb-6 text-base font-medium max-w-lg mx-auto">
                    {item.payload.definition}
                </p>
                <div className="flex flex-wrap justify-center gap-2">
                    {item.tags.map(tag => (
                        <span key={tag} className="text-[10px] bg-white text-indigo-500 px-3 py-1 rounded-lg border border-indigo-100 font-bold hover:shadow-sm transition-all cursor-default">#{tag}</span>
                    ))}
                </div>
            </div>
        </div>
    );

    const renderQAndA = () => (
        <div className="mt-4 border border-gray-100 rounded-3xl p-6 bg-gradient-to-b from-gray-50/50 to-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full blur-3xl -mr-10 -mt-10 opacity-60"></div>
            <div className="relative z-10">
                <div className="flex gap-4 mb-6">
                    <div className="w-10 h-10 rounded-2xl bg-white border border-gray-200 flex items-center justify-center shrink-0 shadow-sm text-gray-400">
                        <HelpCircle size={20} />
                    </div>
                    <div className="bg-white border border-gray-200 rounded-2xl rounded-tr-sm p-4 shadow-sm text-sm lg:text-base font-bold text-gray-800 leading-relaxed max-w-[85%]">
                        {item.payload.question}
                    </div>
                </div>
                <div className="flex gap-4 flex-row-reverse">
                    <div className="relative">
                        <img src={item.payload.expertAvatar} className="w-10 h-10 rounded-2xl border-2 border-white shadow-md object-cover" />
                        <div className="absolute -bottom-1 -right-1 bg-blue-600 text-white rounded-full p-0.5 border-2 border-white">
                            <Check size={8} strokeWidth={4} />
                        </div>
                    </div>
                    <div className="bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-2xl rounded-tl-sm p-5 shadow-lg shadow-blue-500/20 text-sm lg:text-base font-medium leading-relaxed max-w-[90%] relative">
                        <div className="absolute top-0 left-0 w-full h-full bg-white/5 opacity-0 hover:opacity-100 transition-opacity pointer-events-none"></div>
                        {item.payload.answer}
                    </div>
                </div>
            </div>
        </div>
    );

    const renderChecklist = () => (
        <div className="mt-4 border border-gray-200 rounded-2xl p-6 bg-white shadow-sm relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-400 to-blue-500"></div>
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h4 className="font-bold flex items-center gap-2 text-gray-900 text-lg">
                        <ListChecks size={22} className="text-green-600" />
                        {item.payload.listTitle}
                    </h4>
                    <p className="text-xs text-gray-400 mt-1 mr-8">أنجز الخطوات التالية</p>
                </div>
                <div className="text-center bg-gray-50 px-3 py-2 rounded-xl border border-gray-100">
                    <span className="block text-xl font-black text-gray-900">{Math.round((item.payload.items.filter((i: any) => i.checked).length / item.payload.items.length) * 100)}%</span>
                    <span className="text-[10px] font-bold text-gray-400 uppercase">اكتمال</span>
                </div>
            </div>
            <div className="space-y-3">
                {item.payload.items.map((checkItem: any, i: number) => (
                    <div key={i} className={`flex items-start gap-4 p-4 rounded-xl border transition-all cursor-pointer group ${checkItem.checked ? 'bg-green-50 border-green-100' : 'bg-white border-gray-100 hover:border-gray-300 hover:shadow-sm'}`}>
                        <div className={`mt-0.5 w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all shadow-sm ${checkItem.checked ? 'bg-green-500 border-green-500 scale-100' : 'bg-white border-gray-300 group-hover:border-green-400 scale-90 group-hover:scale-100'}`}>
                            {checkItem.checked && <Check size={14} className="text-white stroke-[4]" />}
                        </div>
                        <div className="flex-1">
                            <span className={`text-sm font-bold block mb-0.5 transition-colors ${checkItem.checked ? 'text-green-900 line-through decoration-green-300' : 'text-gray-900'}`}>
                                {checkItem.text}
                            </span>
                            {checkItem.subtext && <span className="text-xs text-gray-400 block">{checkItem.subtext}</span>}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    const renderPoll = () => (
        <div className="mt-4 border border-gray-200 rounded-2xl p-5 bg-gray-50/50">
            <div className="flex items-center justify-between mb-4">
                <h4 className="font-bold flex items-center gap-2 text-gray-800">
                    <Vote size={18} className="text-blue-600" />
                    تصويت الجمهور
                </h4>
                <span className="text-xs text-gray-500">{item.payload.totalVotes} صوت • ينتهي خلال 2 يوم</span>
            </div>
            <div className="space-y-3">
                {item.payload.options.map((opt: any, idx: number) => (
                    <div key={idx} className="relative group cursor-pointer">
                        <div className="flex justify-between text-xs font-bold mb-1 z-10 relative px-1">
                            <span>{opt.label}</span>
                            <span>{opt.percentage}%</span>
                        </div>
                        <div className="h-8 w-full bg-white border border-gray-200 rounded-lg overflow-hidden relative">
                            <div
                                className="h-full bg-blue-100 transition-all duration-1000 group-hover:bg-blue-200"
                                style={{ width: `${opt.percentage}%` }}
                            ></div>
                        </div>
                    </div>
                ))}
            </div>
            <button className="w-full mt-4 py-2.5 text-xs font-bold text-blue-600 border border-blue-200 rounded-xl hover:bg-blue-50 transition-colors">
                شارك برأيك
            </button>
        </div>
    );

    const renderEvent = () => (
        <div className="group mt-6 relative bg-slate-50/50 border-2 border-slate-100 rounded-[35px] overflow-hidden hover:bg-white hover:border-blue-500/30 transition-all duration-500 shadow-[0_15px_40px_-15px_rgba(0,0,0,0.05)] hover:shadow-[0_40px_80px_-25px_rgba(37,99,235,0.15)]">
            <div className="absolute top-0 bottom-0 left-0 w-1.5 bg-blue-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            
            <div className="relative z-10 flex items-center p-4 gap-6">
                {/* Compact Date Module - High Contrast */}
                <div className={`w-20 h-20 rounded-[26px] flex flex-col items-center justify-center shrink-0 border-2 ${
                    item.payload.isOnline ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-blue-50 text-blue-600 border-blue-100'
                } shadow-sm group-hover:scale-105 transition-transform`}>
                    <span className="text-[10px] font-black uppercase tracking-[0.25em] mb-1 opacity-60">{item.payload.month}</span>
                    <span className="text-3xl font-black leading-none tracking-tighter">{item.payload.day}</span>
                </div>

                {/* Information Hub */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2.5">
                         <div className={`px-3 py-1 rounded-xl text-[9px] font-black uppercase tracking-widest border-2 ${
                             item.payload.isOnline ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/10' : 'bg-blue-500/10 text-blue-600 border-blue-500/10'
                         }`}>
                             {item.payload.isOnline ? 'Remote' : 'Venue'}
                         </div>
                         <h3 className="text-xl font-black text-slate-900 truncate leading-none pt-0.5 group-hover:text-blue-600 transition-colors tracking-tight">{item.payload.eventName}</h3>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
                        <div className="flex items-center gap-2 text-slate-500">
                            <MapPin size={16} className="text-blue-500/50" />
                            <span className="text-[14px] font-bold truncate max-w-[220px]">{item.payload.location}</span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-500">
                            <Clock size={16} className="text-blue-500/50" />
                            <span className="text-[14px] font-bold">{item.payload.time}</span>
                        </div>
                    </div>
                </div>

                {/* Final CTA */}
                <button className="h-14 px-8 bg-slate-900 hover:bg-blue-600 text-white rounded-[24px] text-[11px] font-black uppercase tracking-[0.2em] transition-all shadow-xl active:scale-95 shrink-0 hover:translate-x-1">
                    حجز مقعد
                </button>
            </div>
        </div>
    );

    const renderExpertInsight = () => (
        <div className="mt-4 p-8 bg-slate-900 text-white rounded-2xl relative overflow-hidden text-center md:text-right">
            <Quote size={60} className="absolute top-4 right-4 text-white/10 rotate-180" />
            <div className="relative z-10">
                <p className="text-xl lg:text-2xl font-serif leading-relaxed mb-6 opacity-90">
                    "{item.payload.quote}"
                </p>
                <div className="flex items-center justify-center md:justify-start gap-4">
                    <img src={item.payload.expertImage} className="w-12 h-12 rounded-full border-2 border-slate-700 object-cover" />
                    <div>
                        <p className="font-bold text-sm text-white">{item.payload.expertName}</p>
                        <p className="text-xs text-slate-400">{item.payload.expertRole}</p>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderPortfolio = () => (
        <div className="group mt-8 relative bg-slate-50/50 border-2 border-slate-100 rounded-[48px] p-8 hover:bg-white hover:border-blue-500/30 transition-all duration-700 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.05)] hover:shadow-[0_45px_100px_-30px_rgba(37,99,235,0.15)] overflow-hidden">
            {/* Sidebar Accent */}
            <div className="absolute top-0 bottom-0 left-0 w-2 bg-blue-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            
            {/* Background Grain/Pattern */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>

            <div className="relative z-10">
                {/* Header Section */}
                <div className="flex items-center justify-between mb-10">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center border border-blue-100 group-hover:bg-blue-600 group-hover:border-blue-500 transition-all duration-500">
                            <Briefcase size={22} className="text-blue-600 group-hover:text-white transition-colors" />
                        </div>
                        <div>
                            <h3 className="text-xl font-black text-slate-900 tracking-tight leading-none mb-1.5 uppercase">الهيكل المتوازن</h3>
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">نموذج محفظة الخبراء</span>
                        </div>
                    </div>
                    <div className="px-5 py-2.5 bg-emerald-50 border border-emerald-100 rounded-2xl shadow-sm">
                        <span className="text-[11px] font-black text-emerald-600 uppercase tracking-widest">+{item.payload.expectedReturn}% عائد متوقع</span>
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row items-center gap-12">
                    {/* Advanced Conic Ring - Light Optimized */}
                    <div className="relative shrink-0 group-hover:scale-105 transition-transform duration-700">
                        <div className="absolute inset-0 bg-blue-500 blur-3xl opacity-5 rounded-full"></div>
                        <div className="relative w-48 h-48 rounded-full flex items-center justify-center p-4 bg-white shadow-[0_15px_35px_-10px_rgba(0,0,0,0.1)] border border-slate-100">
                            <div className="absolute inset-0 rounded-full border-[20px] border-slate-50"></div>
                            <div className="absolute inset-0 rounded-full border-[20px]"
                                style={{ 
                                    borderColor: 'transparent', 
                                    background: `conic-gradient(from 0deg, #3b82f6 0% 40%, #a855f7 40% 70%, #10b981 70% 90%, #f59e0b 90% 100%)`,
                                    WebkitMaskImage: `radial-gradient(transparent 58%, black 60%)`,
                                    maskImage: `radial-gradient(transparent 58%, black 60%)`
                                }} 
                            />
                            {/* Center Status Shield */}
                            <div className="flex flex-col items-center justify-center text-center">
                                <ShieldCheck size={32} className="text-blue-500 mb-1.5" />
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">مستوى الأمان</span>
                                <span className="text-xl font-black text-slate-900 leading-none">عالي</span>
                            </div>
                        </div>
                    </div>

                    {/* Detailed Asset Breakdown */}
                    <div className="flex-1 w-full space-y-5">
                        {item.payload.assets.map((asset: any, idx: number) => (
                            <div key={idx} className="group/asset relative">
                                <div className="flex justify-between items-center mb-2 px-1">
                                    <div className="flex items-center gap-3">
                                        <div className="w-2 h-2 rounded-full shadow-sm" style={{ backgroundColor: asset.color }}></div>
                                        <span className="text-sm font-black text-slate-600 group-hover/asset:text-blue-600 transition-colors uppercase tracking-tight">{asset.name}</span>
                                    </div>
                                    <span className="text-[13px] font-black text-slate-900 tabular-nums">{asset.value}%</span>
                                </div>
                                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-200/50">
                                    <div 
                                        className="h-full rounded-full transition-all duration-1000 ease-out shadow-sm" 
                                        style={{ width: `${asset.value}%`, backgroundColor: asset.color }}
                                    ></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Strategy insight footer */}
                <div className="mt-12 pt-8 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-3">
                         <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
                         <p className="text-[12px] font-bold text-slate-400 italic leading-snug">
                            تم تصميم هذا التوزيع لتقليل المخاطر في فترات التقلب العالي.
                         </p>
                    </div>
                    
                    <button className="h-14 px-10 bg-slate-900 text-white rounded-[22px] text-[11px] font-black uppercase tracking-[0.2em] shadow-xl hover:bg-blue-600 transition-all active:scale-95 shrink-0">
                        تبني الاستراتيجية
                    </button>
                </div>
            </div>
        </div>
    );

    const renderDashboardContent = () => (
        <div 
            className="group cursor-pointer mt-8 relative bg-slate-50/50 border-2 border-slate-100 rounded-[48px] p-6 hover:bg-white hover:border-blue-500/30 transition-all duration-700 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.05)] hover:shadow-[0_45px_100px_-30px_rgba(37,99,235,0.15)] overflow-hidden" 
            onClick={() => navigate(`/dashboards?id=${item.payload.dashboardId}`)}
        >
            {/* Sidebar Accent */}
            <div className="absolute top-0 bottom-0 left-0 w-2 bg-blue-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            
            {/* Glossy Header */}
            <div className="flex items-center justify-between mb-8 px-3 relative z-10">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-800 text-white rounded-[20px] flex items-center justify-center shadow-lg shadow-blue-900/20 border border-white/10 group-hover:rotate-6 transition-transform">
                        <Layers size={22} />
                    </div>
                    <div>
                        <h3 className="text-xl font-black text-slate-900 tracking-tight leading-none mb-1.5 uppercase">{item.title}</h3>
                        <div className="flex items-center gap-2">
                            <div className="flex gap-0.5">
                                <span className="w-1 h-1 rounded-full bg-blue-500"></span>
                                <span className="w-1 h-1 rounded-full bg-blue-300"></span>
                                <span className="w-1 h-1 rounded-full bg-blue-100"></span>
                            </div>
                            <span className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em]">Data Neural Sync</span>
                        </div>
                    </div>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 border border-slate-100 group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-500 transition-all duration-500">
                    <ArrowUpRight size={24} />
                </div>
            </div>

            {/* Immersive Preview Frame - Refined Light View */}
            <div className="relative aspect-[16/10] w-full rounded-[40px] overflow-hidden bg-slate-100 shadow-2xl ring-1 ring-slate-200 group-hover:ring-blue-500/30 transition-all duration-700">
                <img
                    src={item.payload.previewImage || 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200'}
                    className="w-full h-full object-cover transform scale-105 transition-transform duration-[3000ms] group-hover:scale-110 group-hover:rotate-1"
                    alt="Dashboard Preview"
                />
                
                {/* Advanced Technical Overlays - Adaptive */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-80 group-hover:opacity-90 transition-opacity"></div>
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 via-transparent to-purple-600/5 mix-blend-overlay"></div>
                
                {/* Floating Status Badges - Glassmorphic */}
                <div className="absolute top-8 right-8 flex flex-col items-end gap-3 z-10">
                    <div className="px-5 py-2.5 bg-white/95 backdrop-blur-2xl border border-white/20 rounded-[18px] text-[10px] font-black text-blue-600 uppercase tracking-widest shadow-xl flex items-center gap-2.5">
                        <Activity size={12} className="animate-pulse shadow-blue-500" />
                        Live Metrics
                    </div>
                    <div className="px-5 py-2.5 bg-black/10 backdrop-blur-2xl border border-white/10 rounded-[18px] text-[10px] font-black text-white/80 uppercase tracking-widest">
                        SECURE GRID
                    </div>
                </div>

                {/* Bottom Stats Layer */}
                <div className="absolute bottom-10 left-10 right-10 flex items-end justify-between z-10">
                    <div className="flex gap-10">
                        <div className="space-y-1.5">
                            <span className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">المقاييس الحية</span>
                            <div className="flex items-baseline gap-1.5">
                                <span className="text-4xl font-black text-white tracking-tighter">{item.payload.widgetCount}</span>
                                <span className="text-[10px] font-black text-blue-400 uppercase">محرك</span>
                            </div>
                        </div>
                        <div className="w-px h-12 bg-white/10 self-center"></div>
                        <div className="space-y-1.5">
                            <span className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">قوة التتبع</span>
                            <div className="flex items-baseline gap-1.5">
                                <span className="text-4xl font-black text-white tracking-tighter">{(item.payload.views || 0).toLocaleString()}</span>
                                <span className="text-[11px] font-black text-slate-500 uppercase">عقدة</span>
                            </div>
                        </div>
                    </div>
                    
                    <button className="h-16 px-10 bg-blue-600 hover:bg-white hover:text-blue-600 text-white rounded-[24px] text-[11px] font-black uppercase tracking-[0.2em] transition-all shadow-2xl shadow-blue-600/40 active:scale-95 flex items-center gap-3">
                        إطلاق اللوحة
                        <ArrowUpRight size={18} />
                    </button>
                </div>
            </div>

            {/* Bottom Config Bar */}
            <div className="mt-8 flex items-center justify-between px-4 relative z-10">
                <div className="flex items-center gap-5">
                    <div className="flex -space-x-3">
                        {[1,2,3,4].map(i => (
                            <div key={i} className="w-9 h-9 rounded-full border-2 border-slate-50 bg-white flex items-center justify-center shadow-md">
                                <Cpu size={14} className="text-blue-500/60" />
                            </div>
                        ))}
                    </div>
                    <p className="text-[12px] font-black text-slate-400 tracking-tight uppercase">
                        تمت المزامنة بنجاح مع <span className="text-blue-600">{item.payload.widgetCount}</span> مصدر بيانات عالمي
                    </p>
                </div>
                <div className="flex gap-2">
                    {[1,2,3].map(i => (
                        <div key={i} className={`w-1.5 h-1.5 rounded-full ${i === 1 ? 'bg-blue-600 shadow-[0_0_8px_rgba(37,99,235,0.8)]' : 'bg-slate-200'}`}></div>
                    ))}
                </div>
            </div>
        </div>
    );

    const renderArticleContent = () => (
        <div className="group mt-6 cursor-pointer relative bg-slate-50/50 border-2 border-slate-100 rounded-[40px] p-4 hover:bg-white hover:border-blue-500/30 transition-all duration-700 shadow-[0_15px_35px_-15px_rgba(0,0,0,0.05)] hover:shadow-[0_30px_60px_-20px_rgba(37,99,235,0.12)] overflow-hidden" onClick={() => navigate('/dataset/d1')}>
            {/* Sidebar Accent */}
            <div className="absolute top-0 bottom-0 left-0 w-1.5 bg-blue-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            
            {/* Image Frame - Wide Cinema */}
            {item.payload.imageUrl && (
                <div className="relative aspect-[16/9] lg:aspect-[21/8] rounded-[30px] overflow-hidden mb-6 shadow-[0_10px_25px_-10px_rgba(0,0,0,0.15)] group-hover:shadow-blue-500/10 transition-all duration-700">
                    <img
                        src={item.payload.imageUrl}
                        className="w-full h-full object-cover transition-transform duration-[3000ms] group-hover:scale-105"
                        alt="Article Cover"
                    />
                    
                    {/* Floating Tech Badge - Refined */}
                    <div className="absolute top-5 right-5">
                        <div className="px-4 py-1.5 bg-white/95 backdrop-blur-2xl border border-slate-100 rounded-xl text-[9px] font-black text-blue-600 uppercase tracking-widest flex items-center gap-2 shadow-xl">
                             <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse shadow-[0_0_8px_rgba(59,130,246,0.6)]"></div>
                             رؤية الرادار
                        </div>
                    </div>
                    
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-70"></div>
                </div>
            )}

            {/* Typography Section */}
            <div className="px-2 pb-2">
                <div className="flex items-center gap-3 mb-4">
                    <div className="flex items-center gap-1.5 bg-white px-3 py-1 rounded-full border border-slate-100 shadow-sm">
                        <Clock size={12} className="text-blue-500" />
                        <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">6 دقائق</span>
                    </div>
                    <div className="h-1 w-1 rounded-full bg-slate-200"></div>
                    <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">دراسة استراتيجية</span>
                </div>

                <h3 className="text-xl lg:text-2xl font-black text-slate-900 mb-3 group-hover:text-blue-600 transition-colors leading-tight tracking-tight">
                    {item.title}
                </h3>
                
                <p className="text-slate-500 text-sm lg:text-base leading-relaxed mb-6 font-medium line-clamp-2 max-w-3xl">
                    {item.payload.excerpt}
                </p>

                {/* Footer Interaction - Compact & Refined */}
                <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100 group-hover:border-blue-100 transition-colors">
                            <FileText size={18} className="text-slate-400 group-hover:text-blue-500" />
                        </div>
                        <div>
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">المصدر</p>
                            <p className="text-[10px] font-black text-slate-900">RADAR INTEL</p>
                        </div>
                    </div>
                    
                    <button className="h-11 px-6 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all hover:bg-blue-600 shadow-lg active:scale-95 group/btn flex items-center gap-2">
                        التفاصيل
                        <ArrowUpRight size={16} className="group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                    </button>
                </div>
            </div>
        </div>
    );

    // --- MAIN CARD LAYOUT ---

    return (
        <div className="bg-slate-50/30 p-4 md:p-8 rounded-[40px] border-2 border-slate-100 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.08)] hover:shadow-[0_30px_70px_-20px_rgba(0,0,0,0.15)] hover:bg-white hover:border-slate-200 transition-all duration-500 mb-8 group relative overflow-hidden">

            {/* Header */}
            <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <img
                            src={item.author.avatar || `https://ui-avatars.com/api/?name=${item.author.name}`}
                            className="w-11 h-11 rounded-xl object-cover border-2 border-white shadow-sm"
                            alt={item.author.name}
                        />
                        {item.author.verified && (
                            <div className="absolute -bottom-1 -right-1 bg-blue-500 text-white rounded-full p-0.5 border-2 border-white">
                                <CheckCircle2 size={10} strokeWidth={4} />
                            </div>
                        )}
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-900 text-sm">{item.author.name}</h3>
                        <p className="text-xs text-gray-400 flex items-center gap-2">
                            <span>{item.author.role}</span>
                            <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                            <span>{new Date(item.timestamp).toLocaleDateString('ar-SA')}</span>
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <button className="p-2 text-gray-300 hover:text-gray-600 hover:bg-gray-50 rounded-full transition-colors flex items-center justify-center">
                        <MoreHorizontal size={20} />
                    </button>
                </div>
            </div>

            {/* Content Body */}
            <div className="mb-5">
                {/* Text for non-article types (Article handles its own title) */}
                {item.contentType !== FeedContentType.ARTICLE && item.contentType !== FeedContentType.DASHBOARD && (
                    <p className="text-gray-800 font-bold text-lg mb-3 leading-snug">
                        {item.title}
                    </p>
                )}

                {/* Dynamic Content Renderer */}
                {item.contentType === FeedContentType.DASHBOARD && renderDashboardContent()}
                {item.contentType === FeedContentType.ARTICLE && renderArticleContent()}
                {item.contentType === FeedContentType.SIGNAL_ALERT && renderSignalAlert()}
                {item.contentType === FeedContentType.MARKET_PULSE && renderMarketPulse()}
                {item.contentType === FeedContentType.FACT && renderFact()}
                {item.contentType === FeedContentType.COMPARISON && renderComparison()}
                {item.contentType === FeedContentType.WEEKLY_SNAPSHOT && renderWeeklySnapshot()}
                {item.contentType === FeedContentType.POLL && renderPoll()}
                {item.contentType === FeedContentType.EVENT && renderEvent()}
                {item.contentType === FeedContentType.EXPERT_INSIGHT && renderExpertInsight()}
                {item.contentType === FeedContentType.PORTFOLIO && renderPortfolio()}

                {/* NEW EDUCATIONAL */}
                {item.contentType === FeedContentType.BREAKING_NEWS && renderBreakingNews()}
                {item.contentType === FeedContentType.TERMINOLOGY && renderTerminology()}
                {item.contentType === FeedContentType.Q_AND_A && renderQAndA()}
                {item.contentType === FeedContentType.CHECKLIST && renderChecklist()}

                {/* Generic fallback for others */}
                {(item.contentType === FeedContentType.VIDEO || item.contentType === FeedContentType.AUDIO || item.contentType === FeedContentType.IMAGE || item.contentType === FeedContentType.WIDGET) && (
                    <div className="p-10 text-center bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                        <p className="text-gray-400 text-sm">محتوى {item.contentType}</p>
                    </div>
                )}
            </div>

            {/* Footer Action Bar */}
            <div className="pt-4 border-t border-gray-50 flex items-center justify-between">
                <div className="flex gap-4">
                    <button
                        onClick={() => setLiked(!liked)}
                        className={`group flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all ${liked ? 'bg-pink-50 text-pink-600' : 'hover:bg-gray-50 text-gray-500'}`}
                    >
                        <Heart size={18} className={`transition-transform group-hover:scale-110 ${liked ? 'fill-current' : ''}`} />
                        <span className="text-xs font-bold">{item.engagement.likes + (liked ? 1 : 0)}</span>
                    </button>

                    <button className="group flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-gray-50 text-gray-500 transition-all">
                        <Share2 size={18} className="transition-transform group-hover:scale-110" />
                        <span className="text-xs font-bold">مشاركة</span>
                    </button>
                </div>

                <button
                    onClick={() => setSaved(!saved)}
                    className={`p-2 rounded-lg transition-all ${saved ? 'text-blue-600 bg-blue-50' : 'text-gray-400 hover:bg-gray-50 hover:text-gray-600'}`}
                >
                    <Bookmark size={20} className={saved ? 'fill-current' : ''} />
                </button>
            </div>
        </div>
    );
};

export default FeedCard;