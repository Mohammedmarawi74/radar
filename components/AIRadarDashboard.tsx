import React, { useState, useMemo, useCallback, useEffect } from 'react';
import {
  Search, Database, CheckSquare, ChevronDown, ChevronUp, Sparkles, Zap, TrendingUp,
  BarChart2, Activity, Layers, Clock, Star, Bookmark, BookOpen, AlertTriangle,
  MessageCircle, FileText, Eye, Thermometer, Scale, Briefcase, Globe, ListFilter,
  X, Check, Copy, RefreshCw, Settings, Brain, Send, Filter, ArrowDownUp,
  Flame, Bell, Newspaper, GraduationCap, HelpCircle, List, Lightbulb,
  Calendar, Edit3, Save, ExternalLink, ChevronRight, ChevronLeft
} from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid
} from 'recharts';

// ─── Types ───
interface DatasetMeta {
  id: string; name: string; sector: string; date: string; records: number; status: 'live' | 'static' | 'updating';
}

interface OutputCard {
  id: string; category: string; categoryAr: string; title: string; content: string;
  confidence: number; impact: number; source: string; date: string; type: 'positive' | 'negative' | 'neutral' | 'alert';
  bookmarked: boolean; isDraft?: boolean; chartData?: { name: string; value: number }[];
}

interface ScheduleConfig {
  frequency: 'daily' | 'weekly' | 'custom';
  time: string;
  days?: string[];
  reminders: boolean;
}

// ─── Mock Data ───
const MOCK_DATASETS: DatasetMeta[] = [
  { id: 'ds1', name: 'مؤشرات سوق العمل', sector: 'الاقتصاد', date: '2025-05-10', records: 45200, status: 'live' },
  { id: 'ds2', name: 'الاستثمار الأجنبي المباشر', sector: 'الاستثمار', date: '2025-05-11', records: 12800, status: 'live' },
  { id: 'ds3', name: 'مؤشر أسعار المستهلك', sector: 'المالية', date: '2025-05-09', records: 8900, status: 'static' },
  { id: 'ds4', name: 'بيانات التجارة الخارجية', sector: 'التجارة', date: '2025-05-08', records: 32100, status: 'updating' },
  { id: 'ds5', name: 'سوق العقارات السكنية', sector: 'العقارات', date: '2025-05-12', records: 18500, status: 'live' },
  { id: 'ds6', name: 'قطاع السياحة والترفيه', sector: 'السياحة', date: '2025-05-07', records: 9200, status: 'static' },
  { id: 'ds7', name: 'مؤشرات الطاقة المتجددة', sector: 'الطاقة', date: '2025-05-11', records: 6700, status: 'live' },
  { id: 'ds8', name: 'التقنية والابتكار', sector: 'التقنية', date: '2025-05-10', records: 15400, status: 'live' },
  { id: 'ds9', name: 'القطاع الصحي', sector: 'الصحة', date: '2025-05-06', records: 22300, status: 'static' },
  { id: 'ds10', name: 'التعليم والتدريب', sector: 'التعليم', date: '2025-05-05', records: 11200, status: 'updating' },
];

const OUTPUT_CATEGORIES = [
  { id: 'signals', ar: 'إشارات', icon: Zap, color: '#f59e0b' },
  { id: 'heatmap', ar: 'حرارة السوق', icon: Thermometer, color: '#ef4444' },
  { id: 'comparisons', ar: 'مقارنات', icon: Scale, color: '#8b5cf6' },
  { id: 'dashboards', ar: 'لوحات', icon: Layers, color: '#3b82f6' },
  { id: 'portfolios', ar: 'محافظ', icon: Briefcase, color: '#10b981' },
  { id: 'facts', ar: 'حقائق', icon: Lightbulb, color: '#06b6d4' },
  { id: 'urgent', ar: 'عاجل', icon: Bell, color: '#dc2626' },
  { id: 'events', ar: 'أحداث', icon: Globe, color: '#0ea5e9' },
  { id: 'articles', ar: 'مقالات', icon: Newspaper, color: '#6366f1' },
  { id: 'terms', ar: 'مصطلحات', icon: GraduationCap, color: '#a855f7' },
  { id: 'insights', ar: 'رؤى', icon: Eye, color: '#14b8a6' },
  { id: 'qna', ar: 'سؤال وجواب', icon: HelpCircle, color: '#f97316' },
  { id: 'lists', ar: 'قوائم', icon: List, color: '#64748b' },
];

const generateOutputs = (datasetIds: string[], prompt: string, selectedTypes: string[]): OutputCard[] => {
  const cards: OutputCard[] = [];
  const now = new Date().toISOString().split('T')[0];
  const types: OutputCard['type'][] = ['positive', 'negative', 'neutral', 'alert'];

  OUTPUT_CATEGORIES.forEach((cat, ci) => {
    if (selectedTypes.length > 0 && !selectedTypes.includes(cat.id)) return;
    
    const count = Math.random() > 0.5 ? 2 : 1;
    for (let i = 0; i < count; i++) {
      const t = types[Math.floor(Math.random() * types.length)];
      cards.push({
        id: `out-${cat.id}-${i}-${Date.now()}`,
        category: cat.id, categoryAr: cat.ar,
        title: `${cat.ar}: تحليل ${datasetIds.length > 1 ? 'مشترك' : 'مباشر'} #${ci + 1}`,
        content: `بناءً على "${prompt.slice(0, 40)}..." تم استخلاص رؤية ${cat.ar} من ${datasetIds.length} مجموعة بيانات. النتائج تشير إلى اتجاهات مهمة تستحق المتابعة والتقييم.`,
        confidence: Math.floor(60 + Math.random() * 35),
        impact: Math.floor(40 + Math.random() * 55),
        source: MOCK_DATASETS.find(d => d.id === datasetIds[0])?.name || 'مصادر متعددة',
        date: now, type: t, bookmarked: false, isDraft: false,
        chartData: [
          { name: 'ي', value: Math.floor(20 + Math.random() * 80) },
          { name: 'ف', value: Math.floor(20 + Math.random() * 80) },
          { name: 'م', value: Math.floor(20 + Math.random() * 80) },
          { name: 'أ', value: Math.floor(20 + Math.random() * 80) },
          { name: 'ق', value: Math.floor(20 + Math.random() * 80) },
        ]
      });
    }
  });
  return cards;
};

// ─── Toast Component ───
const Toast = ({ message, onClose }: { message: string; onClose: () => void }) => {
  useEffect(() => { const t = setTimeout(onClose, 3000); return () => clearTimeout(t); }, [onClose]);
  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[999] animate-slideUp">
      <div className="bg-slate-900 text-white px-6 py-3 rounded-xl shadow-2xl flex items-center gap-3 border border-slate-700">
        <Check size={18} className="text-emerald-400" />
        <span className="text-sm font-medium">{message}</span>
        <button onClick={onClose} className="text-slate-400 hover:text-white"><X size={14} /></button>
      </div>
    </div>
  );
};

// ─── Mini Sparkline ───
const Sparkline = ({ data, color }: { data: { name: string; value: number }[]; color: string }) => (
  <ResponsiveContainer width="100%" height={40}>
    <AreaChart data={data}><defs><linearGradient id={`sg-${color.replace('#','')}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={color} stopOpacity={0.3} /><stop offset="100%" stopColor={color} stopOpacity={0} /></linearGradient></defs>
      <Area type="monotone" dataKey="value" stroke={color} strokeWidth={1.5} fill={`url(#sg-${color.replace('#','')})`} dot={false} />
    </AreaChart>
  </ResponsiveContainer>
);

// ─── Dataset Card ───
const DatasetCard: React.FC<{ ds: DatasetMeta; selected: boolean; onToggle: () => void }> = ({ ds, selected, onToggle }) => {
  const statusColors = { live: 'bg-emerald-500', static: 'bg-slate-400', updating: 'bg-amber-500' };
  return (
    <div 
      onClick={onToggle} 
      role="button"
      aria-pressed={selected}
      aria-label={`اختر مجموعة بيانات ${ds.name}`}
      className={`group p-3 rounded-xl border cursor-pointer transition-all duration-200 ${selected ? 'border-blue-500 bg-blue-50/80 shadow-md shadow-blue-500/10 ring-1 ring-blue-400/30' : 'border-white bg-white hover:border-blue-300 hover:shadow-lg'}`}
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-all ${selected ? 'border-blue-500 bg-blue-500' : 'border-gray-200 group-hover:border-blue-200'}`}>
            {selected && <Check size={12} className="text-white" />}
          </div>
          <h4 className="text-sm font-bold text-gray-800 truncate">{ds.name}</h4>
        </div>
        <span className={`w-2 h-2 rounded-full shrink-0 mt-1.5 ${statusColors[ds.status]} ${ds.status === 'live' ? 'animate-pulse' : ''}`} title={ds.status} />
      </div>
      <div className="flex items-center gap-3 text-[11px] text-gray-500 pr-7">
        <span className="bg-gray-100 px-2 py-0.5 rounded-md font-medium">{ds.sector}</span>
        <span>{ds.date}</span>
        <span className="font-mono">{ds.records.toLocaleString('ar-SA')}</span>
      </div>
    </div>
  );
};

// ─── Scheduling Modal ───
const SchedulingModal: React.FC<{ isOpen: boolean; onClose: () => void; onSave: (config: ScheduleConfig) => void }> = ({ isOpen, onClose, onSave }) => {
  const [config, setConfig] = useState<ScheduleConfig>({ frequency: 'daily', time: '09:00', reminders: true });
  
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
      <div className="bg-white rounded-3xl w-full max-w-md relative shadow-2xl overflow-hidden animate-zoomIn">
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-lg font-black text-gray-900">جدولة تسليم المحتوى</h3>
          <p className="text-sm text-gray-500 mt-1">تلقى الرؤى والتقارير في مواعيد محددة</p>
        </div>
        <div className="p-6 space-y-5">
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-600 block">التكرار</label>
            <div className="grid grid-cols-3 gap-2">
              {(['daily', 'weekly', 'custom'] as const).map(f => (
                <button
                  key={f}
                  onClick={() => setConfig({ ...config, frequency: f })}
                  className={`py-2 rounded-xl text-xs font-bold border transition-all ${config.frequency === f ? 'bg-blue-600 border-blue-600 text-white' : 'bg-gray-50 border-gray-100 text-gray-500 hover:bg-white hover:border-blue-200'}`}
                >
                  {f === 'daily' ? 'يومي' : f === 'weekly' ? 'أسبوعي' : 'مخصص'}
                </button>
              ))}
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-600 block">التوقيت</label>
              <input 
                type="time" 
                value={config.time}
                onChange={e => setConfig({ ...config, time: e.target.value })}
                className="w-full bg-gray-50 border border-gray-100 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-blue-100 outline-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-600 block">التنبيهات</label>
              <button 
                onClick={() => setConfig({ ...config, reminders: !config.reminders })}
                className={`w-full py-2 rounded-xl text-xs font-bold border flex items-center justify-center gap-2 transition-all ${config.reminders ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-gray-50 text-gray-400 border-gray-100'}`}
              >
                {config.reminders ? <Bell size={14} className="fill-current" /> : <Bell size={14} />}
                {config.reminders ? 'مفعلة' : 'معطلة'}
              </button>
            </div>
          </div>
        </div>
        <div className="p-6 bg-gray-50 flex gap-3">
          <button onClick={onClose} className="flex-1 py-3 text-sm font-bold text-gray-500 hover:text-gray-700">إلغاء</button>
          <button onClick={() => { onSave(config); onClose(); }} className="flex-1 py-3 bg-blue-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-blue-600/20 active:scale-95 transition-transform">حفظ الجدول</button>
        </div>
      </div>
    </div>
  );
};

// ─── Output Card Component ───
const OutputCardItem: React.FC<{ card: OutputCard; onBookmark: (id: string) => void; onDraft: (id: string) => void }> = ({ card, onBookmark, onDraft }) => {
  const [expanded, setExpanded] = useState(false);
  const typeStyles = {
    positive: { border: 'border-l-emerald-500', bg: 'bg-emerald-50/40', badge: 'bg-emerald-100 text-emerald-700' },
    negative: { border: 'border-l-red-500', bg: 'bg-red-50/40', badge: 'bg-red-100 text-red-700' },
    neutral: { border: 'border-l-slate-400', bg: 'bg-slate-50/40', badge: 'bg-slate-100 text-slate-700' },
    alert: { border: 'border-l-amber-500', bg: 'bg-amber-50/40', badge: 'bg-amber-100 text-amber-700' },
  };
  const s = typeStyles[card.type];
  const catObj = OUTPUT_CATEGORIES.find(c => c.id === card.category);
  const CatIcon = catObj?.icon || Zap;

  return (
    <div className={`rounded-xl border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-xl hover:translate-x-1 ${card.isDraft ? 'opacity-75 bg-gray-50' : s.bg} border-l-4 ${s.border}`} aria-expanded={expanded}>
      <div className="p-4">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 shadow-sm" style={{ backgroundColor: catObj?.color + '20' }}>
              <CatIcon size={16} style={{ color: catObj?.color }} />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className={`text-[10px] font-black px-1.5 py-0.5 rounded uppercase tracking-wider ${s.badge}`}>{card.categoryAr}</span>
                {card.isDraft && <span className="text-[10px] bg-slate-200 text-slate-600 px-1.5 py-0.5 rounded font-bold">مسودة</span>}
              </div>
              <h4 className="text-sm font-black text-gray-900 truncate mt-1">{card.title}</h4>
            </div>
          </div>
          <div className="flex gap-1 shrink-0">
             <button 
               onClick={() => onBookmark(card.id)} 
               className="p-1.5 hover:bg-white/80 rounded-lg transition-colors border border-transparent hover:border-gray-200"
               title="حفظ"
             >
               <Bookmark size={15} className={card.bookmarked ? 'text-amber-500 fill-amber-500' : 'text-gray-400'} />
             </button>
             {!card.isDraft && (
               <button 
                 onClick={() => onDraft(card.id)} 
                 className="p-1.5 hover:bg-white/80 rounded-lg transition-colors border border-transparent hover:border-gray-200 text-gray-400 hover:text-blue-600"
                 title="تحويل لمسودة"
               >
                 <Edit3 size={15} />
               </button>
             )}
          </div>
        </div>

        {expanded && (
          <div className="animate-slideDown overflow-hidden">
            <p className="text-xs text-slate-600 leading-relaxed mb-4 pr-11 border-r-2 border-slate-200/50 mr-1">{card.content}</p>
            {card.chartData && (
              <div className="pr-11 mb-4 h-24 bg-white/60 rounded-2xl p-3 border border-gray-100 shadow-inner">
                <Sparkline data={card.chartData} color={catObj?.color || '#3b82f6'} />
              </div>
            )}
            <div className="pr-11 mb-4 grid grid-cols-2 gap-3">
              <div className="p-2.5 bg-white/80 rounded-xl border border-gray-100 shadow-sm">
                <span className="text-[10px] text-gray-400 block mb-1 font-bold">المصدر</span>
                <span className="text-[10px] font-black text-slate-700 truncate block">{card.source}</span>
              </div>
              <div className="p-2.5 bg-white/80 rounded-xl border border-gray-100 shadow-sm">
                <span className="text-[10px] text-gray-400 block mb-1 font-bold">التاريخ</span>
                <span className="text-[10px] font-black text-slate-700 block">{card.date}</span>
              </div>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between pr-11">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 group/score relative cursor-help">
              <div className="w-14 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 transition-all duration-1000" style={{ width: `${card.confidence}%` }} />
              </div>
              <span className="text-[10px] font-black text-slate-500">{card.confidence}%</span>
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1 bg-slate-900 text-white text-[10px] rounded-lg opacity-0 group-hover/score:opacity-100 pointer-events-none transition-all shadow-xl whitespace-nowrap z-50">درجة الثقة</div>
            </div>
            <div className="flex items-center gap-1.5 group/impact relative cursor-help">
              <div className="w-14 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-indigo-500 transition-all duration-1000" style={{ width: `${card.impact}%` }} />
              </div>
              <span className="text-[10px] font-black text-slate-500">{card.impact}%</span>
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1 bg-slate-900 text-white text-[10px] rounded-lg opacity-0 group-hover/impact:opacity-100 pointer-events-none transition-all shadow-xl whitespace-nowrap z-50">درجة الأثر</div>
            </div>
          </div>
          <button onClick={() => setExpanded(!expanded)} className="text-[10px] text-blue-600 hover:text-blue-800 font-black flex items-center gap-1.5 bg-blue-50/50 px-3 py-1.5 rounded-lg transition-colors">
            {expanded ? <><ChevronUp size={12} /> إخفاء</> : <><ChevronDown size={12} /> التفاصيل</>}
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Heatmap Component ───
const MiniHeatmap = ({ score }: { score: number }) => {
  const cells = Array.from({ length: 12 }, (_, i) => i);
  return (
    <div className="grid grid-cols-6 gap-0.5 w-24 h-8 bg-gray-100 p-0.5 rounded">
      {cells.map(i => (
        <div 
          key={i} 
          className="rounded-sm" 
          style={{ 
            backgroundColor: i * 8 < score ? `rgba(239, 68, 68, ${0.3 + (i / 12)})` : '#e2e8f0' 
          }} 
        />
      ))}
    </div>
  );
};

// ═══════════════════ MAIN DASHBOARD ═══════════════════
const AIRadarDashboard = () => {
  const [selectedDatasets, setSelectedDatasets] = useState<string[]>([]);
  const [datasetSearch, setDatasetSearch] = useState('');
  const [sectorFilter, setSectorFilter] = useState('الكل');
  const [prompt, setPrompt] = useState('');
  const [aiMode, setAiMode] = useState('predictive');
  const [selectedContentTypes, setSelectedContentTypes] = useState<string[]>(['signals', 'insights']);
  const [confidence, setConfidence] = useState(70);
  const [outputs, setOutputs] = useState<OutputCard[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeOutputFilter, setActiveOutputFilter] = useState('all');
  const [toast, setToast] = useState('');
  const [mobilePanel, setMobilePanel] = useState<'datasets' | 'ai' | 'outputs'>('ai');
  const [lastSync, setLastSync] = useState(new Date().toLocaleTimeString('ar-SA'));
  const [showScheduling, setShowScheduling] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  useEffect(() => {
    const interval = setInterval(() => {
      setLastSync(new Date().toLocaleTimeString('ar-SA'));
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const sectors = useMemo(() => ['الكل', ...Array.from(new Set(MOCK_DATASETS.map(d => d.sector)))], []);

  const filteredDatasets = useMemo(() => {
    return MOCK_DATASETS.filter(d => {
      const matchSearch = d.name.includes(datasetSearch) || d.sector.includes(datasetSearch);
      const matchSector = sectorFilter === 'الكل' || d.sector === sectorFilter;
      return matchSearch && matchSector;
    });
  }, [datasetSearch, sectorFilter]);

  const paginatedDatasets = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredDatasets.slice(start, start + pageSize);
  }, [filteredDatasets, currentPage]);

  const totalPages = Math.ceil(filteredDatasets.length / pageSize);

  const toggleDataset = useCallback((id: string) => {
    setSelectedDatasets(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  }, []);

  const toggleContentType = useCallback((id: string) => {
    setSelectedContentTypes(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  }, []);

  const handleGenerate = useCallback(() => {
    if (selectedDatasets.length === 0) { setToast('يرجى اختيار مجموعة بيانات واحدة على الأقل'); return; }
    if (selectedContentTypes.length === 0) { setToast('يرجى اختيار نوع محتوى واحد على الأقل'); return; }
    if (!prompt.trim()) { setToast('يرجى إدخال تعليمات للذكاء الاصطناعي'); return; }
    
    setIsGenerating(true);
    if (window.innerWidth < 1024) setMobilePanel('ai');

    setTimeout(() => {
      const newOutputs = generateOutputs(selectedDatasets, prompt, selectedContentTypes);
      setOutputs(newOutputs);
      setIsGenerating(false);
      setToast('✅ تم توليد الرؤى بنجاح!');
      if (window.innerWidth < 1024) setMobilePanel('outputs');
    }, 2000);
  }, [selectedDatasets, prompt, selectedContentTypes]);

  const loadSample = () => {
    setSelectedDatasets(['ds1', 'ds2', 'ds5']);
    setSelectedContentTypes(['signals', 'heatmap', 'insights']);
    setPrompt('حلل الارتباط بين نمو سوق العمل ونشاط العقارات السكنية مع توقعات الاستثمار الأجنبي المباشر للربع القادم.');
    setAiMode('comparative');
    setToast('تم تحميل نموذج تجريبي');
  };

  const handleBookmark = useCallback((id: string) => {
    setOutputs(prev => prev.map(o => o.id === id ? { ...o, bookmarked: !o.bookmarked } : o));
    setToast('تم تحديث المفضلة');
  }, []);

  const handleDraft = useCallback((id: string) => {
    setOutputs(prev => prev.map(o => o.id === id ? { ...o, isDraft: true } : o));
    setToast('تم الحفظ كمسودة');
  }, []);

  const filteredOutputs = useMemo(() => {
    if (activeOutputFilter === 'all') return outputs;
    return outputs.filter(o => o.category === activeOutputFilter);
  }, [outputs, activeOutputFilter]);

  const handleSaveSchedule = (config: ScheduleConfig) => {
    setToast(`تمت جدولة التسليم: ${config.frequency === 'daily' ? 'يومياً' : config.frequency === 'weekly' ? 'أسبوعياً' : 'مخصص'} في ${config.time}`);
  };

  // ─── RENDER ───
  return (
    <div className="h-[calc(100vh-72px)] flex flex-col overflow-hidden bg-slate-50">
      {/* ── Mobile Tab Bar ── */}
      <div className="lg:hidden flex border-b border-gray-200 bg-white sticky top-0 z-20">
        {[{ k: 'datasets' as const, l: 'البيانات', I: Database }, { k: 'ai' as const, l: 'الذكاء', I: Brain }, { k: 'outputs' as const, l: 'المخرجات', I: Layers }].map(t => (
          <button 
            key={t.k} 
            onClick={() => setMobilePanel(t.k)} 
            className={`flex-1 py-3 flex items-center justify-center gap-2 text-sm font-bold transition-all ${mobilePanel === t.k ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/50' : 'text-gray-500'}`}
          >
            <t.I size={16} />{t.l}
            {t.k === 'outputs' && outputs.length > 0 && <span className="w-2 h-2 bg-blue-600 rounded-full animate-ping" />}
          </button>
        ))}
      </div>

      {/* ── Three Column Layout ── */}
      <div className="flex-1 flex overflow-hidden">

        {/* ══════ RIGHT COLUMN ─ Datasets ══════ */}
        <aside className={`w-full lg:w-80 xl:w-96 border-l border-gray-200 bg-white flex flex-col shrink-0 ${mobilePanel !== 'datasets' ? 'hidden lg:flex' : 'flex'}`}>
          {/* Sticky Header */}
          <div className="p-4 border-b border-gray-100 bg-white/80 backdrop-blur-sm sticky top-0 z-10 shrink-0">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-base font-black text-gray-900 flex items-center gap-2">
                <Database size={18} className="text-blue-600" /> مجموعات البيانات
              </h2>
              <div className="flex items-center gap-1.5">
                <div className="flex items-center gap-1 px-1.5 py-0.5 bg-emerald-50 rounded-md border border-emerald-100">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                  <span className="text-[9px] font-bold text-emerald-700 uppercase">Live Sync</span>
                </div>
              </div>
            </div>
            <div className="relative mb-2">
              <Search size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input value={datasetSearch} onChange={e => setDatasetSearch(e.target.value)} placeholder="بحث عن بيانات..." className="w-full pr-9 pl-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none" />
            </div>
            <div className="flex gap-1.5 overflow-x-auto no-scrollbar pb-1">
              {sectors.map(s => (
                <button key={s} onClick={() => setSectorFilter(s)} className={`px-3 py-1 rounded-full text-[11px] font-bold whitespace-nowrap transition-all ${sectorFilter === s ? 'bg-blue-600 text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>{s}</button>
              ))}
            </div>
          </div>
          {/* Selected Count */}
          {selectedDatasets.length > 0 && (
            <div className="px-4 py-2 bg-blue-50 border-b border-blue-100 flex items-center justify-between shrink-0">
              <span className="text-xs font-bold text-blue-700">{selectedDatasets.length} محدد</span>
              <button onClick={() => setSelectedDatasets([])} className="text-[11px] text-blue-600 hover:underline font-medium">مسح الكل</button>
            </div>
          )}
          {/* Dataset List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar bg-slate-50/30">
            {paginatedDatasets.map(ds => (
              <DatasetCard 
                key={ds.id} 
                ds={ds} 
                selected={selectedDatasets.includes(ds.id)} 
                onToggle={() => toggleDataset(ds.id)} 
              />
            ))}
            {filteredDatasets.length === 0 && <div className="text-center py-12 text-gray-400 text-sm">لا توجد نتائج</div>}
          </div>
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="p-3 border-t border-gray-100 bg-white flex items-center justify-between shrink-0">
               <button 
                 disabled={currentPage === 1}
                 onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                 className="p-1.5 rounded-lg hover:bg-gray-100 disabled:opacity-30 transition-colors"
               >
                 <ChevronRight size={18} />
               </button>
               <span className="text-[11px] font-black text-slate-500">صفحة {currentPage} من {totalPages}</span>
               <button 
                 disabled={currentPage === totalPages}
                 onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                 className="p-1.5 rounded-lg hover:bg-gray-100 disabled:opacity-30 transition-colors"
               >
                 <ChevronLeft size={18} />
               </button>
            </div>
          )}
          {/* Sync Status Footer */}
          <div className="p-4 bg-white border-t border-gray-100 text-center shrink-0">
            <p className="text-[10px] text-gray-400 flex items-center justify-center gap-1.5 font-bold uppercase tracking-wider">
              <RefreshCw size={10} className="animate-spin-slow text-blue-500" /> المزامنة الحية: <span className="text-slate-600">{lastSync}</span>
            </p>
          </div>
        </aside>

        {/* ══════ CENTER COLUMN ─ AI Workspace ══════ */}
        <main className={`flex-1 flex flex-col bg-white min-w-0 shadow-inner ${mobilePanel !== 'ai' ? 'hidden lg:flex' : 'flex'}`}>
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            <div className="max-w-3xl mx-auto p-4 lg:p-8 space-y-6">
              {/* Header */}
              <div className="text-center space-y-2">
                <div className="inline-flex relative">
                   <div className="absolute inset-0 bg-blue-600 blur-2xl opacity-20 animate-pulse" />
                   <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 shadow-xl flex items-center justify-center text-white">
                      <Brain size={32} />
                   </div>
                </div>
                <h1 className="text-2xl lg:text-3xl font-black text-gray-900 tracking-tight">مساعد التحليل الذكي</h1>
                <p className="text-sm text-gray-500 max-w-sm mx-auto">قم بدمج البيانات واستخراج رؤى عميقة مدعومة بالذكاء الاصطناعي</p>
              </div>

              {/* Dataset Selection Notification */}
              {selectedDatasets.length === 0 && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3 animate-pulse">
                  <AlertTriangle size={18} className="text-amber-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-bold text-amber-800">بانتظار البيانات</p>
                    <p className="text-[11px] text-amber-600 mt-0.5">يرجى اختيار مجموعة بيانات واحدة على الأقل من القائمة اليمنى للبدء.</p>
                  </div>
                </div>
              )}

              {/* Selected Datasets Tags */}
              {selectedDatasets.length > 0 && (
                <div className="space-y-2">
                   <div className="flex items-center justify-between">
                     <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5"><Database size={14} /> مصدر التحليل</h3>
                     <span className="text-[10px] text-gray-400">{selectedDatasets.length} مصادر مختارة</span>
                   </div>
                   <div className="flex flex-wrap gap-2 p-3 bg-gray-50 rounded-xl border border-gray-100">
                    {selectedDatasets.map(id => {
                      const ds = MOCK_DATASETS.find(d => d.id === id);
                      return ds ? (
                        <span key={id} className="inline-flex items-center gap-1.5 bg-white text-blue-700 px-3 py-1.5 rounded-lg text-xs font-bold border border-blue-100 shadow-sm transition-all hover:scale-105">
                          {ds.name}
                          <button onClick={() => toggleDataset(id)} className="hover:text-red-500 transition-colors"><X size={12} /></button>
                        </span>
                      ) : null;
                    })}
                   </div>
                </div>
              )}

              {/* Interaction Panel */}
              <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm space-y-5 lg:p-6 relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-1 h-full bg-blue-600 opacity-0 group-focus-within:opacity-100 transition-opacity" />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-black text-gray-700 flex items-center gap-1.5">
                      <Filter size={14} className="text-blue-600" /> ذكاء المبدع
                    </label>
                    <select value={aiMode} onChange={e => setAiMode(e.target.value)} className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-4 py-3.5 text-sm font-black focus:ring-4 focus:ring-blue-50 focus:border-blue-500 outline-none transition-all appearance-none cursor-pointer">
                      <option value="predictive">🔮 تنبؤي (Predictive)</option>
                      <option value="descriptive">📊 تحليلي (Analytical)</option>
                      <option value="summarization">📝 تلخيص (Summarization)</option>
                      <option value="trend">📉 رصد الاتجاهات (Trends)</option>
                    </select>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-black text-gray-700">مستوى الثقة</label>
                      <span className="text-xs font-black text-blue-600 px-2 py-0.5 bg-blue-50 rounded-md">{confidence}%</span>
                    </div>
                    <div className="relative pt-1">
                      <input type="range" min={30} max={99} value={confidence} onChange={e => setConfidence(+e.target.value)} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600" />
                      <div className="flex justify-between text-[10px] text-gray-400 mt-2 font-bold uppercase">
                        <span>سريع</span>
                        <span>شامل</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Content Types Multi-select */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-black text-gray-700 flex items-center gap-1.5">
                      <Layers size={14} className="text-blue-600" /> أنواع المخرجات المطلوبة
                    </label>
                    <span className="text-[10px] font-bold text-slate-400">{selectedContentTypes.length} محدد</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {OUTPUT_CATEGORIES.map(c => {
                      const isSelected = selectedContentTypes.includes(c.id);
                      return (
                        <button
                          key={c.id}
                          onClick={() => toggleContentType(c.id)}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-black transition-all border ${isSelected ? 'bg-slate-900 border-slate-900 text-white shadow-lg' : 'bg-white border-gray-100 text-slate-500 hover:border-blue-200'}`}
                        >
                          <c.icon size={12} className={isSelected ? 'text-blue-400' : 'text-gray-400'} />
                          {c.ar}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-black text-gray-700 flex items-center gap-1.5">
                      <MessageCircle size={14} className="text-blue-600" /> تعليمات التحليل
                    </label>
                    <div className="flex gap-2">
                       <button onClick={() => setShowScheduling(true)} className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-xl hover:bg-indigo-100 transition-colors flex items-center gap-1.5 shadow-sm border border-indigo-100">
                          <Clock size={12} /> جدولة التسليم
                       </button>
                       <button onClick={loadSample} className="text-[10px] font-black text-blue-600 bg-blue-50 px-3 py-1.5 rounded-xl hover:bg-blue-100 transition-colors shadow-sm border border-blue-100">تحميل نموذج</button>
                    </div>
                  </div>
                  <div className="relative group">
                    <textarea 
                      value={prompt} 
                      onChange={e => setPrompt(e.target.value)} 
                      placeholder="صف ما تريد استخلاصه من البيانات... (مثال: توقعات الربع القادم بناءً على التاريخ)"
                      className="w-full bg-slate-50/50 border border-gray-200 rounded-3xl px-5 py-5 text-sm resize-none h-40 focus:ring-4 focus:ring-blue-50 focus:border-blue-500 outline-none placeholder-gray-400 font-medium leading-relaxed transition-all" 
                    />
                    <div className="absolute bottom-4 left-4 flex gap-2">
                       <Sparkles size={18} className={`text-blue-500 transition-all duration-700 ${prompt ? 'animate-pulse scale-110' : 'opacity-20'}`} />
                    </div>
                  </div>
                </div>

                <button 
                  onClick={handleGenerate} 
                  disabled={isGenerating || selectedDatasets.length === 0} 
                  className={`w-full py-4.5 rounded-2xl text-sm font-black flex items-center justify-center gap-3 transition-all ${isGenerating ? 'bg-slate-100 text-slate-400 cursor-wait' : 'bg-gradient-to-l from-slate-900 to-slate-800 text-white hover:to-blue-600 shadow-2xl hover:shadow-blue-600/30 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed group'}`}
                >
                  {isGenerating ? <><RefreshCw size={22} className="animate-spin" /> جاري التحليل النمطي...</> : <><Zap size={22} className="fill-blue-400 group-hover:fill-white transition-colors" /> إنشاء المحتوى الذكي</>}
                </button>
              </div>

              {/* Generation State Visualizer */}
              {isGenerating && (
                <div className="bg-slate-900 rounded-2xl p-8 text-center space-y-4 border border-slate-800 shadow-2xl relative overflow-hidden">
                  <div className="absolute inset-0 bg-blue-600/5 animate-pulse" />
                  <div className="relative z-10">
                    <div className="w-16 h-16 mx-auto bg-blue-500/10 rounded-full flex items-center justify-center mb-4">
                      <RefreshCw size={32} className="text-blue-500 animate-spin" />
                    </div>
                    <h3 className="text-lg font-bold text-white mb-1">الذكاء الجماعي يعمل الآن</h3>
                    <p className="text-xs text-slate-400 max-w-xs mx-auto">نقوم الآن بمعالجة {MOCK_DATASETS.filter(d=>selectedDatasets.includes(d.id)).reduce((acc,d)=>acc+d.records, 0).toLocaleString()} سجلاً بيانيًا...</p>
                  </div>
                </div>
              )}

              {/* Progress/Success Summary */}
              {outputs.length > 0 && !isGenerating && (
                <div className="p-6 bg-gradient-to-br from-indigo-600 to-blue-700 rounded-2xl text-white shadow-xl flex items-center gap-5 group relative overflow-hidden">
                  <div className="absolute right-0 top-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16" />
                  <div className="w-14 h-14 rounded-xl bg-white/20 flex items-center justify-center shrink-0 border border-white/30">
                    <Check size={32} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-black leading-tight">اكتمل التوليد</h3>
                    <p className="text-xs text-blue-100 opacity-90 mt-1">تمت مراجعة {selectedDatasets.length} مصادر وخرجنا بـ {outputs.length} رؤية ذكية متنوعة.</p>
                  </div>
                  <button onClick={() => setMobilePanel('outputs')} className="lg:hidden bg-white text-blue-600 px-4 py-2 rounded-lg text-xs font-bold shadow-sm">عرض النتائج</button>
                </div>
              )}
            </div>
          </div>
        </main>

        {/* ══════ LEFT COLUMN ─ Outputs ══════ */}
        <aside className={`w-full lg:w-80 xl:w-[420px] border-r border-gray-200 bg-white flex flex-col shrink-0 ${mobilePanel !== 'outputs' ? 'hidden lg:flex' : 'flex'}`}>
          {/* Sticky Header */}
          <div className="p-4 border-b border-gray-100 bg-gray-50/50 backdrop-blur-sm sticky top-0 z-10 shrink-0">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-base font-black text-gray-900 flex items-center gap-2">
                <Layers size={18} className="text-indigo-600" /> المخرجات الذكية
              </h2>
              <div className="flex items-center gap-2">
                 <button className="p-1.5 hover:bg-white rounded-md transition-colors" title="إعدادات التصدير"><Copy size={14} className="text-gray-400" /></button>
                 <button className="p-1.5 hover:bg-white rounded-md transition-colors" title="تصفية المخرجات"><Filter size={14} className="text-gray-400" /></button>
              </div>
            </div>
            
            {/* Output Category Filter */}
            <div className="flex gap-1.5 overflow-x-auto no-scrollbar pb-1">
              <button onClick={() => setActiveOutputFilter('all')} className={`px-3 py-1.5 rounded-xl text-[11px] font-bold whitespace-nowrap transition-all ${activeOutputFilter === 'all' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'}`}>الكل</button>
              {OUTPUT_CATEGORIES.map(c => (
                <button 
                  key={c.id} 
                  onClick={() => setActiveOutputFilter(c.id)} 
                  className={`px-3 py-1.5 rounded-xl text-[11px] font-bold whitespace-nowrap transition-all flex items-center gap-1.5 border ${activeOutputFilter === c.id ? 'text-white shadow-lg' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'}`} 
                  style={activeOutputFilter === c.id ? { backgroundColor: c.color, borderColor: c.color, boxShadow: `0 4px 12px -2px ${c.color}40` } : {}}
                >
                  <c.icon size={12} />{c.ar}
                </button>
              ))}
            </div>
          </div>

          {/* Output Cards Scrollable Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-slate-50/50">
            {filteredOutputs.length === 0 && (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-4 shadow-sm border border-gray-100">
                   <Lightbulb size={32} className="text-gray-300" />
                </div>
                <h3 className="text-sm font-bold text-gray-600">لا توجد رؤى متاحة</h3>
                <p className="text-[11px] text-gray-400 max-w-[180px] mt-1 italic">بانتظار تعليماتك في مساحة العمل المركزية لتوليد تحليل جديد...</p>
              </div>
            )}
            
            {filteredOutputs.map(card => (
              <div key={card.id} className="group relative">
                <OutputCardItem card={card} onBookmark={handleBookmark} onDraft={handleDraft} />
                {card.category === 'heatmap' && (
                  <div className="absolute left-4 bottom-4 opacity-40 group-hover:opacity-100 transition-opacity pointer-events-none">
                     <MiniHeatmap score={card.impact} />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Actions Footer */}
          {outputs.length > 0 && (
            <div className="p-3 bg-white border-t border-gray-100 grid grid-cols-2 gap-2">
               <button className="flex items-center justify-center gap-2 py-2.5 bg-gray-900 text-white rounded-xl text-xs font-bold hover:bg-gray-800 transition-colors">
                  <FileText size={14} /> تصوير التقرير
               </button>
               <button className="flex items-center justify-center gap-2 py-2.5 border border-gray-200 text-gray-700 rounded-xl text-xs font-bold hover:bg-gray-50 transition-colors">
                  <Star size={14} className="text-amber-500" /> حفظ الكل
               </button>
            </div>
          )}
        </aside>
      </div>

      {/* Toast Notification */}
      {toast && <Toast message={toast} onClose={() => setToast('')} />}
      
      {/* Scheduling Modal */}
      <SchedulingModal 
        isOpen={showScheduling} 
        onClose={() => setShowScheduling(false)} 
        onSave={handleSaveSchedule} 
      />
      
      {/* Global CSS Enhancements */}
      <style>{`
        .animate-spin-slow { animation: spin 4s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .custom-scrollbar::-webkit-scrollbar { width: 5px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
        
        @keyframes zoomIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-zoomIn { animation: zoomIn 0.2s ease-out forwards; }
      `}</style>
    </div>
  );
};

export default AIRadarDashboard;
