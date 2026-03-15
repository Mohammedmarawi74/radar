import React, { useState, useMemo, useCallback, useEffect } from 'react';
import {
  Search, Database, CheckSquare, ChevronDown, ChevronUp, Sparkles, Zap, TrendingUp,
  BarChart2, Activity, Layers, Clock, Star, Bookmark, BookOpen, AlertTriangle,
  MessageCircle, FileText, Eye, Thermometer, Scale, Briefcase, Globe, ListFilter,
  X, Check, Copy, RefreshCw, Settings, Brain, Send, Filter, ArrowDownUp,
  Flame, Bell, Newspaper, GraduationCap, HelpCircle, List, Lightbulb,
  Calendar, Edit3, Save, ExternalLink, ChevronRight, ChevronLeft, Info
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
        title: `${cat.ar}: تحليل استراتيجي #${ci + 1}`,
        content: `بناءً على "${prompt.slice(0, 40)}..." تم استخلاص رؤية ${cat.ar} من ${datasetIds.length} مجموعة بيانات. النتائج تشير إلى اتجاهات مهمة تستحق المتابعة والتقييم الاستراتيجي الفوري للمخاطر والفرص المحتملة.`,
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
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[999] animate-fadeIn">
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
      className={`group p-4 rounded-2xl border-2 cursor-pointer transition-all duration-300 ${selected ? 'border-blue-500 bg-blue-50 shadow-xl shadow-blue-500/10' : 'border-slate-100 bg-white hover:border-blue-200 hover:shadow-lg'}`}
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center shrink-0 transition-all ${selected ? 'border-blue-600 bg-blue-600 text-white' : 'border-slate-200 group-hover:border-blue-300'}`}>
            {selected && <Check size={14} />}
          </div>
          <h4 className="text-sm font-black text-slate-800 truncate">{ds.name}</h4>
        </div>
        <span className={`w-2.5 h-2.5 rounded-full shrink-0 mt-1.5 ${statusColors[ds.status]} ${ds.status === 'live' ? 'animate-pulse' : ''}`} />
      </div>
      <div className="flex flex-wrap items-center gap-2 text-[10px] text-slate-400 font-bold pr-9">
        <span className="bg-slate-100 px-2 py-0.5 rounded-md text-slate-500">{ds.sector}</span>
        <span>{ds.date}</span>
        <span className="text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">{ds.records.toLocaleString()} سـجل</span>
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
          <h3 className="text-xl font-black text-gray-900">جدولة تسليم المعرفة</h3>
          <p className="text-sm text-gray-400 font-medium mt-1">تلقى الرؤى الاستراتيجية في مواعيدك المفضلة</p>
        </div>
        <div className="p-6 space-y-6">
          <div className="space-y-3">
            <label className="text-xs font-black text-gray-400 uppercase">وتيرة التكرار</label>
            <div className="grid grid-cols-3 gap-2">
              {(['daily', 'weekly', 'custom'] as const).map(f => (
                <button
                  key={f}
                  onClick={() => setConfig({ ...config, frequency: f })}
                  className={`py-3 rounded-xl text-xs font-black border-2 transition-all ${config.frequency === f ? 'bg-slate-900 border-slate-900 text-white shadow-lg' : 'bg-slate-50 border-slate-50 text-slate-400 hover:border-slate-200'}`}
                >
                  {f === 'daily' ? 'يومي' : f === 'weekly' ? 'أسبوعي' : 'مخصص'}
                </button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-3">
              <label className="text-xs font-black text-gray-400 uppercase">وقت الإرسال</label>
              <input type="time" value={config.time} onChange={e => setConfig({ ...config, time: e.target.value })} className="w-full bg-slate-50 border-2 border-slate-50 rounded-xl px-4 py-3 text-sm font-black focus:bg-white focus:border-blue-500 outline-none transition-all" />
            </div>
            <div className="space-y-3">
              <label className="text-xs font-black text-gray-400 uppercase">التنبيهات</label>
              <button onClick={() => setConfig({ ...config, reminders: !config.reminders })} className={`w-full py-3 rounded-xl text-xs font-black border-2 flex items-center justify-center gap-2 transition-all ${config.reminders ? 'bg-blue-50 text-blue-600 border-blue-100' : 'bg-slate-50 text-slate-400 border-slate-50'}`}>
                <Bell size={14} className={config.reminders ? 'fill-current' : ''} /> {config.reminders ? 'مفعلة' : 'معطلة'}
              </button>
            </div>
          </div>
        </div>
        <div className="p-6 bg-slate-50 flex gap-4">
          <button onClick={onClose} className="flex-1 py-4 text-sm font-black text-slate-400 hover:text-slate-600 uppercase">إلغاء</button>
          <button onClick={() => { onSave(config); onClose(); }} className="flex-1 py-4 bg-slate-900 text-white rounded-2xl text-sm font-black shadow-xl hover:bg-blue-600 active:scale-95 transition-all">تأكيد الجدولة</button>
        </div>
      </div>
    </div>
  );
};

// ─── Output Card Component ───
const OutputCardItem: React.FC<{ card: OutputCard; onBookmark: (id: string) => void; onDraft: (id: string) => void }> = ({ card, onBookmark, onDraft }) => {
  const [expanded, setExpanded] = useState(false);
  const typeStyles = {
    positive: { border: 'border-l-emerald-500', bg: 'bg-emerald-50/30', badge: 'bg-emerald-100 text-emerald-700' },
    negative: { border: 'border-l-red-500', bg: 'bg-red-50/30', badge: 'bg-red-100 text-red-700' },
    neutral: { border: 'border-l-slate-400', bg: 'bg-slate-50/30', badge: 'bg-slate-100 text-slate-700' },
    alert: { border: 'border-l-amber-500', bg: 'bg-amber-50/30', badge: 'bg-amber-100 text-amber-700' },
  };
  const s = typeStyles[card.type];
  const catObj = OUTPUT_CATEGORIES.find(c => c.id === card.category);
  const CatIcon = catObj?.icon || Zap;

  return (
    <div className={`rounded-2xl border border-slate-100 overflow-hidden transition-all duration-500 hover:shadow-2xl hover:-translate-y-1 ${card.isDraft ? 'opacity-70 grayscale bg-slate-50' : s.bg} border-l-4 ${s.border}`}>
      <div className="p-5">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex items-center gap-4 min-w-0 flex-1">
            <div className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 shadow-lg" style={{ backgroundColor: catObj?.color + '15' }}>
              <CatIcon size={20} style={{ color: catObj?.color }} />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className={`text-[9px] font-black px-2 py-0.5 rounded-md uppercase tracking-widest ${s.badge}`}>{card.categoryAr}</span>
                {card.isDraft && <span className="text-[9px] bg-slate-200 text-slate-600 px-2 py-0.5 rounded-md font-black">مسودة</span>}
              </div>
              <h4 className="text-sm font-black text-slate-900 truncate">{card.title}</h4>
            </div>
          </div>
          <div className="flex gap-2">
             <button onClick={() => onBookmark(card.id)} className="w-8 h-8 rounded-xl bg-white/80 flex items-center justify-center transition-all hover:bg-white shadow-sm border border-slate-100 group">
               <Bookmark size={14} className={card.bookmarked ? 'text-amber-500 fill-amber-500' : 'text-slate-300 group-hover:text-slate-500'} />
             </button>
             {!card.isDraft && (
               <button onClick={() => onDraft(card.id)} className="w-8 h-8 rounded-xl bg-white/80 flex items-center justify-center transition-all hover:bg-white shadow-sm border border-slate-100 group text-slate-300 hover:text-blue-500">
                 <Edit3 size={14} />
               </button>
             )}
          </div>
        </div>

        {expanded ? (
          <div className="animate-fadeIn">
            <p className="text-xs text-slate-600 leading-relaxed mb-5 font-medium">{card.content}</p>
            {card.chartData && (
              <div className="mb-5 bg-white/80 rounded-2xl p-4 border border-slate-100 shadow-inner">
                <Sparkline data={card.chartData} color={catObj?.color || '#3b82f6'} />
              </div>
            )}
            <div className="grid grid-cols-2 gap-4 mb-5">
              <div className="p-3 bg-white/80 rounded-xl border border-slate-50">
                <span className="text-[9px] text-slate-400 font-bold uppercase block mb-1">المصدر الاستشهادي</span>
                <span className="text-[10px] font-black text-slate-700 truncate block">{card.source}</span>
              </div>
              <div className="p-3 bg-white/80 rounded-xl border border-slate-50">
                <span className="text-[9px] text-slate-400 font-bold uppercase block mb-1">توقيت الاستنتاج</span>
                <span className="text-[10px] font-black text-slate-700 block">{card.date}</span>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-xs text-slate-500 line-clamp-2 mb-4 font-medium leading-relaxed opacity-60">{card.content}</p>
        )}

        <div className="flex items-center justify-between pt-2 border-t border-slate-200/50">
          <div className="flex items-center gap-6">
            <div className="space-y-1">
              <span className="text-[8px] font-black text-slate-400 uppercase tracking-tighter">Confidence</span>
              <div className="flex items-center gap-2">
                <div className="w-12 h-1 bg-slate-200 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full" style={{ width: `${card.confidence}%` }} />
                </div>
                <span className="text-[10px] font-black text-slate-900">{card.confidence}%</span>
              </div>
            </div>
            <div className="space-y-1">
              <span className="text-[8px] font-black text-slate-400 uppercase tracking-tighter">Impact</span>
              <div className="flex items-center gap-2">
                <div className="w-12 h-1 bg-slate-200 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${card.impact}%` }} />
                </div>
                <span className="text-[10px] font-black text-slate-900">{card.impact}%</span>
              </div>
            </div>
          </div>
          <button onClick={() => setExpanded(!expanded)} className="text-[10px] font-black text-blue-600 flex items-center gap-1.5 hover:underline">
            {expanded ? <><ChevronUp size={14} /> إخفاء</> : <><ChevronDown size={14} /> عرض التحليل</>}
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
        <div key={i} className="rounded-sm" style={{ backgroundColor: i * 8 < score ? `rgba(239, 68, 68, ${0.3 + (i / 12)})` : '#e2e8f0' }} />
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
    if (selectedContentTypes.length === 0) { setToast('مطلوب اختيار محتوى واحد على الأقل'); return; }
    if (!prompt.trim()) { setToast('يرجى إدخال تعليمات التحليل'); return; }
    
    setIsGenerating(true);
    setTimeout(() => {
      const newOutputs = generateOutputs(selectedDatasets, prompt, selectedContentTypes);
      setOutputs(newOutputs);
      setIsGenerating(false);
      setToast('✅ تم استخلاص الرؤى بنجاح!');
      if (window.innerWidth < 1024) setMobilePanel('outputs');
    }, 2000);
  }, [selectedDatasets, prompt, selectedContentTypes]);

  const loadSample = () => {
    setSelectedDatasets(['ds1', 'ds2', 'ds7', 'ds8']);
    setSelectedContentTypes(['signals', 'heatmap', 'insights', 'facts']);
    setPrompt('حلل الارتباط بين مؤشرات سوق العمل والمشاريع التقنية وتأثيرها المتوقع على الطاقة المتجددة للعام القادم.');
    setAiMode('trend');
    setToast('تم تطبيق النموذج الاستراتيجي');
  };

  const handleBookmark = useCallback((id: string) => {
    setOutputs(prev => prev.map(o => o.id === id ? { ...o, bookmarked: !o.bookmarked } : o));
    setToast('تم تحديث المفضلة');
  }, []);

  const handleDraft = useCallback((id: string) => {
    setOutputs(prev => prev.map(o => o.id === id ? { ...o, isDraft: true } : o));
    setToast('تم الحفظ في المسودات');
  }, []);

  const filteredOutputs = useMemo(() => {
    if (activeOutputFilter === 'all') return outputs;
    return outputs.filter(o => o.category === activeOutputFilter);
  }, [outputs, activeOutputFilter]);

  const handleSaveSchedule = (config: ScheduleConfig) => {
    setToast(`تم جدولة المعالجة الاستباقية في ${config.time}`);
  };

  return (
    <div className="h-[calc(100vh-72px)] flex flex-col overflow-hidden bg-slate-50">
      {/* ── Mobile Navigation ── */}
      <div className="lg:hidden flex border-b border-slate-200 bg-white sticky top-0 z-50">
        {[{ k: 'datasets' as const, l: 'البيانات', I: Database }, { k: 'ai' as const, l: 'الذكاء', I: Brain }, { k: 'outputs' as const, l: 'الرؤى', I: Layers }].map(t => (
          <button 
            key={t.k} 
            onClick={() => setMobilePanel(t.k)} 
            className={`flex-1 py-4 flex flex-col items-center justify-center gap-1 text-[10px] font-black transition-all ${mobilePanel === t.k ? 'text-blue-600 bg-blue-50/50' : 'text-slate-400'}`}
          >
            <t.I size={18} />{t.l}
            {t.k === 'outputs' && outputs.length > 0 && <span className="absolute top-2 w-2 h-2 bg-blue-600 rounded-full animate-ping" />}
          </button>
        ))}
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* ══════ RIGHT: DATA INGESTION (Phase 1) ══════ */}
        <aside className={`w-full lg:w-80 xl:w-96 border-l border-slate-200 bg-white flex flex-col shrink-0 ${mobilePanel !== 'datasets' ? 'hidden lg:flex' : 'flex'}`}>
          <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-black text-slate-900 flex items-center gap-2">
                  <Database size={16} className="text-blue-600" /> مراجعة البيانات
                </h2>
                <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest mt-0.5">Phase 1: Knowledge Ingestion</p>
              </div>
              <div className="flex items-center gap-1.5 px-2 py-1 bg-emerald-50 rounded-full border border-emerald-100">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                <span className="text-[9px] font-black text-emerald-700">LIVE</span>
              </div>
            </div>
            <div className="relative">
              <Search size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input value={datasetSearch} onChange={e => setDatasetSearch(e.target.value)} placeholder="ابحث في المستودع..." className="w-full pr-9 pl-4 py-2.5 text-xs bg-white border-2 border-slate-100 rounded-xl focus:border-blue-500 outline-none transition-all font-bold" />
            </div>
            <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
              {sectors.map(s => (
                <button key={s} onClick={() => setSectorFilter(s)} className={`px-4 py-1.5 rounded-full text-[10px] font-black whitespace-nowrap transition-all border-2 ${sectorFilter === s ? 'bg-slate-900 border-slate-900 text-white shadow-lg' : 'bg-white border-slate-100 text-slate-400 hover:border-blue-200'}`}>{s}</button>
              ))}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-5 space-y-3 custom-scrollbar">
            {paginatedDatasets.map(ds => (
              <DatasetCard key={ds.id} ds={ds} selected={selectedDatasets.includes(ds.id)} onToggle={() => toggleDataset(ds.id)} />
            ))}
          </div>

          <div className="p-5 border-t border-slate-100 bg-slate-50/50">
             <div className="flex items-center justify-between mb-2">
               <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">مستوى التحديث</span>
               <span className="text-[9px] font-black text-blue-600">{lastSync}</span>
             </div>
             <p className="text-[10px] text-slate-500 font-medium leading-relaxed italic">يتم سحب البيانات لحظياً من محركات الرصد العالمية والمحلية لبناء سياق التحليل.</p>
          </div>
        </aside>

        {/* ══════ CENTER: AI COMMAND CENTER (Phase 2 & 3) ══════ */}
        <main className={`flex-1 flex flex-col bg-slate-50 min-w-0 ${mobilePanel !== 'ai' ? 'hidden lg:flex' : 'flex'}`}>
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            <div className="max-w-5xl mx-auto p-6 lg:p-10 space-y-8">
              
              {/* --- Section Header --- */}
              <header className="relative p-8 rounded-[40px] bg-white border border-slate-200/60 shadow-sm overflow-hidden group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full -mr-32 -mt-32 transition-transform group-hover:scale-110" />
                <div className="relative z-10 flex flex-col md:flex-row items-center gap-8 text-center md:text-right">
                  <div className="relative">
                    <div className="w-20 h-20 rounded-3xl bg-slate-900 flex items-center justify-center shadow-2xl relative z-10">
                      <Brain size={40} className="text-blue-400 animate-pulse" />
                    </div>
                    <div className="absolute -inset-2 bg-blue-500/20 blur-xl rounded-full animate-pulse opacity-40" />
                  </div>
                  <div className="flex-1 space-y-2">
                    <h1 className="text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">
                      مركز <span className="bg-gradient-to-l from-blue-600 to-indigo-600 bg-clip-text text-transparent">الذكاء الاستراتيجي</span>
                    </h1>
                    <p className="text-sm text-slate-500 font-medium max-w-2xl">
                      <span className="text-blue-600 font-black">Phase 2: Intent & Parameterization.</span> قم ببرمجة المحرك التحليلي بناءً على أهدافك الاستراتيجية ونوع المخرجات المطلوبة.
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={loadSample} title="تعبئة نموذج ذكي" className="p-3 bg-slate-50 border border-slate-200 rounded-2xl text-slate-500 hover:bg-white hover:border-blue-400 hover:text-blue-600 transition-all">
                      <RefreshCw size={18} />
                    </button>
                    <button onClick={() => setShowScheduling(true)} className="flex items-center gap-2 px-6 py-3 bg-indigo-50 border border-indigo-100 rounded-2xl text-xs font-black text-indigo-600 hover:bg-indigo-100 transition-all">
                      <Clock size={16} /> الجدولة الآلية
                    </button>
                  </div>
                </div>
              </header>

              {/* --- Main Configuration Grid --- */}
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 pb-2">
                
                {/* Left: AI Mode & Confidence */}
                <div className="flex flex-col bg-white rounded-3xl border border-slate-200/60 shadow-sm overflow-hidden group hover:shadow-md transition-all">
                  <div className="p-6 border-b border-slate-50 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-600">
                        <Zap size={18} />
                      </div>
                      <div className="space-y-0.5">
                        <h3 className="text-sm font-black text-slate-900">بروتوكول التشغيل</h3>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Cognitive Processing Pattern</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 space-y-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-2 gap-3">
                      {[
                        { id: 'predictive', l: 'تنبؤي', i: Sparkles, color: 'text-blue-500', bg: 'bg-blue-50' },
                        { id: 'trend', l: 'اتجاهات', i: TrendingUp, color: 'text-emerald-500', bg: 'bg-emerald-50' },
                        { id: 'descriptive', l: 'تحليلي', i: BarChart2, color: 'text-indigo-500', bg: 'bg-indigo-50' },
                        { id: 'summarization', l: 'تلخيص', i: FileText, color: 'text-slate-500', bg: 'bg-slate-50' },
                      ].map(m => (
                        <button 
                          key={m.id}
                          onClick={() => setAiMode(m.id)}
                          className={`flex flex-col items-center justify-center gap-2 p-4 rounded-2xl border-2 transition-all duration-300 ${aiMode === m.id ? 'bg-slate-900 border-slate-900 text-white shadow-lg' : 'bg-slate-50 border-slate-50 text-slate-400 hover:border-slate-200 hover:bg-white'}`}
                        >
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${aiMode === m.id ? 'bg-white/10' : m.bg}`}>
                            <m.i size={16} className={aiMode === m.id ? 'text-white' : m.color} />
                          </div>
                          <span className="text-[10px] font-black">{m.l}</span>
                        </button>
                      ))}
                    </div>

                    <div className="pt-2 space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                           عمق البحث <Info size={12} className="text-slate-300" />
                        </span>
                        <span className="text-xs font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded-lg">{confidence}% Focus</span>
                      </div>
                      <div className="relative h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div className="absolute top-0 right-0 h-full bg-blue-600 transition-all duration-500" style={{ width: `${confidence}%` }} />
                        <input type="range" min={30} max={99} value={confidence} onChange={e => setConfidence(+e.target.value)} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right: AI Intent / Prompt */}
                <div className="flex flex-col bg-white rounded-3xl border border-slate-200/60 shadow-sm overflow-hidden group hover:shadow-md transition-all">
                  <div className="p-6 border-b border-slate-50 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-600">
                        <MessageCircle size={18} />
                      </div>
                      <div className="space-y-0.5">
                        <h3 className="text-sm font-black text-slate-900">أمر التشغيل</h3>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Strategic Intent Input</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-6 flex-1 flex flex-col">
                    <textarea 
                      value={prompt} 
                      onChange={e => setPrompt(e.target.value)}
                      placeholder="صف هنا أهدافك، التساؤلات المعقدة، أو نوع الاستنتاجات التي تريد استخلاصها..."
                      className="flex-1 w-full min-h-[160px] bg-slate-50 border-2 border-transparent rounded-2xl p-5 text-xs font-bold focus:bg-white focus:border-blue-500/20 outline-none transition-all placeholder:text-slate-300 leading-relaxed resize-none custom-scrollbar"
                    />
                    <div className="mt-3 flex items-center justify-between">
                       <p className="text-[9px] text-slate-400 font-bold italic">نصيحة: كن دقيقاً في وصف المتغيرات الاقتصادية.</p>
                       <span className="text-[9px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-md font-black">{prompt.length} / 500</span>
                    </div>
                  </div>
                </div>
              </div>


              {/* --- Output Matrix & Action --- */}
              <div className="bg-white p-8 rounded-[40px] border border-slate-200/60 shadow-sm transition-all hover:shadow-md space-y-8">
                <div className="space-y-2">
                  <h3 className="text-lg font-black text-slate-900">مصفوفة المخرجات المتعددة</h3>
                  <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Multi-Output Synthesis Matrix</p>
                </div>

                <div className="flex flex-wrap gap-3">
                  {OUTPUT_CATEGORIES.map(c => {
                    const isSelected = selectedContentTypes.includes(c.id);
                    return (
                      <button
                        key={c.id}
                        onClick={() => toggleContentType(c.id)}
                        className={`group px-6 py-3.5 rounded-2xl text-[11px] font-black transition-all border-2 flex items-center gap-3 ${isSelected ? 'bg-blue-600 border-blue-600 text-white shadow-lg' : 'bg-white border-slate-100 text-slate-400 hover:border-blue-300'}`}
                      >
                        <c.icon size={16} className={isSelected ? 'text-white' : 'text-slate-300 group-hover:text-blue-500'} />
                        {c.ar}
                      </button>
                    );
                  })}
                </div>

                <div className="pt-4 border-t border-slate-100">
                  <button 
                    onClick={handleGenerate}
                    disabled={isGenerating || selectedDatasets.length === 0}
                    className={`w-full py-8 rounded-[32px] text-xl font-black flex items-center justify-center gap-6 transition-all shadow-2xl ${isGenerating ? 'bg-slate-100 text-slate-300 cursor-wait' : 'bg-slate-900 text-white hover:bg-blue-600 hover:-translate-y-2 active:translate-y-0 shadow-blue-500/20'}`}
                  >
                    {isGenerating ? (
                      <>
                        <RefreshCw size={32} className="animate-spin" />
                        <div className="text-right">
                          <p className="text-lg">Phase 3: Deep Synthesis...</p>
                          <p className="text-[10px] font-bold opacity-60">جاري تحليل {selectedDatasets.length} قاعدة بيانات</p>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center">
                          <Zap size={28} className="fill-blue-400 text-blue-400" />
                        </div>
                        <span>تفعيل المعالجة المعرفية</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {isGenerating && (
                <div className="animate-fadeIn max-w-2xl mx-auto py-4">
                   <div className="p-6 bg-white rounded-3xl border border-slate-100 shadow-xl flex items-center gap-6">
                      <div className="w-16 h-16 bg-slate-950 rounded-[24px] flex items-center justify-center text-white shrink-0 shadow-lg relative overflow-hidden">
                         <Activity size={28} className="animate-pulse relative z-10" />
                         <div className="absolute inset-0 bg-blue-600/20 animate-pulse" />
                      </div>
                      <div className="flex-1 space-y-3">
                         <div className="flex justify-between items-end">
                            <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Processing IQ...</span>
                            <span className="text-[10px] text-blue-600 font-black bg-blue-50 px-2 py-0.5 rounded">SYNC: ACTIVE</span>
                         </div>
                         <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                            <div className="h-full bg-gradient-to-l from-blue-600 to-indigo-600 animate-[loading_2s_ease-in-out_infinite]" />
                         </div>
                      </div>
                   </div>
                </div>
              )}
            </div>
          </div>
        </main>


        {/* ══════ LEFT: STRATEGIC INSIGHTS (Phase 4) ══════ */}
        <aside className={`w-full lg:w-80 xl:w-[450px] border-r border-slate-200 bg-white flex flex-col shrink-0 ${mobilePanel !== 'outputs' ? 'hidden lg:flex' : 'flex'}`}>
          <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex flex-col gap-5 sticky top-0 z-20">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-black text-slate-900 flex items-center gap-2">
                  <Layers size={16} className="text-indigo-600" /> مستودع المعرفة
                </h2>
                <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest mt-0.5">Phase 4: Consumption & Strategy</p>
              </div>
              <button className="w-10 h-10 rounded-2xl hover:bg-white border-2 border-transparent hover:border-slate-100 flex items-center justify-center transition-all shadow-sm">
                <Filter size={16} className="text-slate-400" />
              </button>
            </div>
            
            <div className="flex gap-2 overflow-x-auto no-scrollbar">
              <button onClick={() => setActiveOutputFilter('all')} className={`px-5 py-2.5 rounded-2xl text-[10px] font-black transition-all ${activeOutputFilter === 'all' ? 'bg-indigo-600 text-white shadow-lg' : 'bg-white text-slate-500 border-2 border-slate-50'}`}>الكل</button>
              {OUTPUT_CATEGORIES.filter(c => outputs.some(o => o.category === c.id)).map(c => {
                 const isActive = activeOutputFilter === c.id;
                 return (
                   <button key={c.id} onClick={() => setActiveOutputFilter(c.id)} className={`px-5 py-2.5 rounded-2xl text-[10px] font-black whitespace-nowrap flex items-center gap-2 border-2 transition-all ${isActive ? 'text-white border-transparent' : 'bg-white border-slate-50 text-slate-500'}`} style={isActive ? { backgroundColor: c.color, boxShadow: `0 12px 20px -5px ${c.color}50` } : {}}>
                     <c.icon size={14} />{c.ar}
                   </button>
                 );
              })}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar bg-slate-50/10">
            {filteredOutputs.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center px-12 space-y-6 opacity-40 grayscale">
                <div className="w-24 h-24 bg-white rounded-[40px] shadow-sm border border-slate-100 flex items-center justify-center">
                   <Zap size={40} className="text-slate-200" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest">Awaiting Golden Insights</h3>
                  <p className="text-[11px] text-slate-400 font-medium leading-relaxed">بمجرد تفعيل المعالجة في مساحة العمل المركزية، ستظهر هنا نتائج التحليل الممنهج لبياناتك.</p>
                </div>
              </div>
            ) : (
              filteredOutputs.map(card => (
                <div key={card.id} className="animate-fadeIn">
                  <OutputCardItem card={card} onBookmark={handleBookmark} onDraft={handleDraft} />
                </div>
              ))
            )}
          </div>

          {outputs.length > 0 && (
            <div className="p-6 border-t border-slate-100 bg-white grid grid-cols-2 gap-4 shadow-[0_-15px_40px_-5px_rgba(0,0,0,0.04)]">
               <button className="flex items-center justify-center gap-3 py-4 bg-slate-900 text-white rounded-[24px] text-xs font-black shadow-2xl hover:bg-slate-800 active:scale-95 transition-all">
                  <ExternalLink size={16} /> تصدير المعرفة
               </button>
               <button className="flex items-center justify-center gap-3 py-4 border-2 border-slate-100 bg-white text-slate-900 rounded-[24px] text-xs font-black hover:bg-slate-50 active:scale-95 transition-all">
                  <Star size={16} className="text-amber-500 fill-amber-500" /> حفظ كمجلد
               </button>
            </div>
          )}
        </aside>
      </div>

      {toast && <Toast message={toast} onClose={() => setToast('')} />}
      <SchedulingModal isOpen={showScheduling} onClose={() => setShowScheduling(false)} onSave={handleSaveSchedule} />
      
      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #cbd5e1; }
        
        @keyframes loading {
          0% { width: 0%; transform: translateX(-100%); }
          50% { width: 60%; transform: translateX(20%); }
          100% { width: 100%; transform: translateX(100%); }
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes zoomIn {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
};

export default AIRadarDashboard;
