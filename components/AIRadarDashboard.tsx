import React, { useState, useMemo, useCallback, useEffect } from 'react';
import {
  Search, Database, Sparkles, Zap, TrendingUp, BarChart2, Activity, Layers, Clock, Star, 
  Bookmark, BookOpen, AlertTriangle, MessageCircle, FileText, Eye, Info, Check, X, 
  RefreshCw, ChevronDown, ChevronUp, ChevronRight, Filter, Target, Send, Shield, MousePointer2,
  Brain, Edit3, Settings
} from 'lucide-react';
import {
  AreaChart, Area, ResponsiveContainer
} from 'recharts';

// ─── Types ───
interface DatasetMeta {
  id: string; name: string; sector: string; date: string; records: number; status: 'live' | 'static' | 'updating';
}

interface OutputCard {
  id: string; category: string; categoryAr: string; title: string; content: string;
  confidence: number; impact: number; source: string; date: string; 
  type: 'opportunity' | 'risk' | 'alert' | 'neutral'; // opportunity=green, risk=red, alert=yellow
  bookmarked: boolean; isDraft?: boolean; 
  chartData?: { name: string; value: number }[];
}

// ─── Mock Data ───
const MOCK_DATASETS: DatasetMeta[] = [
  { id: 'ds1', name: 'مؤشرات سوق العمل الناشئ', sector: 'الاقتصاد', date: '2025-05-10', records: 45200, status: 'live' },
  { id: 'ds2', name: 'تدفقات الاستثمار الأجنبي المباشر', sector: 'الاستثمار', date: '2025-05-11', records: 12800, status: 'live' },
  { id: 'ds3', name: 'مؤشر أسعار المستهلك (التضخم)', sector: 'الاقتصاد', date: '2025-05-09', records: 8900, status: 'static' },
  { id: 'ds4', name: 'بيانات التجارة الخارجية والصادرات', sector: 'الاقتصاد', date: '2025-05-08', records: 32100, status: 'updating' },
  { id: 'ds5', name: 'سوق العقارات السكنية - الرياض', sector: 'العقارات', date: '2025-05-12', records: 18500, status: 'live' },
  { id: 'ds6', name: 'مؤشرات الطاقة المتجددة والهيدروجين', sector: 'الطاقة', date: '2025-05-11', records: 6700, status: 'live' },
  { id: 'ds7', name: 'قطاع السياحة والترفيه العالمي', sector: 'الاستثمار', date: '2025-05-07', records: 9200, status: 'static' },
  { id: 'ds8', name: 'بيانات المشاريع الكبرى (Giga Projects)', sector: 'الاستثمار', date: '2025-05-10', records: 15400, status: 'live' }
];

const SECTORS = ['الكل', 'الاقتصاد', 'الاستثمار', 'الطاقة', 'العقارات'];

const OUTPUT_TYPES = [
  { id: 'signals', ar: 'إشارات سريعة', icon: Zap, color: 'blue' },
  { id: 'heatmap', ar: 'خرائط حرارية', icon: Activity, color: 'orange' },
  { id: 'detailed', ar: 'مقالات مفصلة', icon: FileText, color: 'indigo' },
  { id: 'insights', ar: 'رؤى استراتيجية', icon: Eye, color: 'teal' }
];

// ─── Analytics Engine (Mocking) ───
const generateAnalysis = (datasetIds: string[], prompt: string, mode: string, confidence: number): OutputCard[] => {
  const now = new Date().toISOString().split('T')[0];
  const results: OutputCard[] = [];
  
  const selectedDSNames = MOCK_DATASETS.filter(d => datasetIds.includes(d.id)).map(d => d.name);
  
  const templates = [
    { type: 'opportunity' as const, titleAr: 'فرصة استثمارية واعدة', cat: 'signals' },
    { type: 'risk' as const, titleAr: 'تحذير من مخاطر محتملة', cat: 'detailed' },
    { type: 'alert' as const, titleAr: 'تنبيه استراتيجي هام', cat: 'insights' }
  ];

  templates.forEach((tm, i) => {
    results.push({
      id: `res-${i}-${Date.now()}`,
      category: tm.cat,
      categoryAr: OUTPUT_TYPES.find(o => o.id === tm.cat)?.ar || 'عام',
      title: `${tm.titleAr}: نتائج تحليل ${mode}`,
      content: `بناءً على طلبك "${prompt}" والبيانات المستخرجة من ${selectedDSNames.join(' و ')}، يشير الذكاء الاصطناعي إلى ${tm.type === 'opportunity' ? 'نمو محتمل بنسبة 15%' : tm.type === 'risk' ? 'تذبذب في القيمة السوقية' : 'ضرورة إعادة التموضع الاستراتيجي'}. هذا التحصيل المعرفي يدعم النظرة المستقبلية للقطاع المختلَف عليه.`,
      confidence: Math.floor(confidence - 5 + Math.random() * 10),
      impact: Math.floor(60 + Math.random() * 30),
      source: selectedDSNames[0] || 'المستودع الرئيسي',
      date: now,
      type: tm.type,
      bookmarked: false,
      isDraft: false,
      chartData: Array.from({ length: 10 }, (_, j) => ({ name: j.toString(), value: Math.floor(20 + Math.random() * 80) }))
    });
  });

  return results;
};

// ─── Components ───

const Sparkline = ({ data, type }: { data: any[], type: string }) => {
  const color = type === 'opportunity' ? '#10b981' : type === 'risk' ? '#ef4444' : '#f59e0b';
  return (
    <div className="h-10 w-24">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <Area type="monotone" dataKey="value" stroke={color} fill={color} fillOpacity={0.1} strokeWidth={1.5} dot={false} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

const PulsingDot = () => (
  <span className="relative flex h-2 w-2">
    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
  </span>
);

const AIRadarDashboard = () => {
  // --- States ---
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSector, setActiveSector] = useState('الكل');
  const [selectedDatasets, setSelectedDatasets] = useState<string[]>([]);
  const [prompt, setPrompt] = useState('');
  const [aiMode, setAiMode] = useState('predictive'); // predictive, analytical, summarization
  const [confLevel, setConfLevel] = useState(75);
  const [selectedOutputTypes, setSelectedOutputTypes] = useState<string[]>(['signals']);
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [showConfig, setShowConfig] = useState(true);
  const [showResults, setShowResults] = useState(false);
  const [outputs, setOutputs] = useState<OutputCard[]>([]);
  const [resultsFilter, setResultsFilter] = useState('all');

  // --- Memos ---
  const filteredDatasets = useMemo(() => {
    return MOCK_DATASETS.filter(ds => {
      const matchSearch = ds.name.includes(searchQuery) || ds.sector.includes(searchQuery);
      const matchSector = activeSector === 'الكل' || ds.sector === activeSector;
      return matchSearch && matchSector;
    });
  }, [searchQuery, activeSector]);

  // --- Handlers ---
  const handleToggleDS = (id: string) => {
    setSelectedDatasets(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const handleStartAnalysis = () => {
    if (selectedDatasets.length === 0) return alert('الرجاء اختيار بيانات للتحليل');
    if (!prompt.trim()) return alert('الرجاء كتابة أمر التشغيل');
    
    setIsGenerating(true);
    setShowResults(false);
    
    // Simulate AI Work
    setTimeout(() => {
      const results = generateAnalysis(selectedDatasets, prompt, aiMode, confLevel);
      setOutputs(results);
      setIsGenerating(false);
      setShowResults(true);
      // Auto-collapse config for focus
      setShowConfig(false);
      // Scroll to results
      document.getElementById('results-area')?.scrollIntoView({ behavior: 'smooth' });
    }, 2500);
  };

  const toggleBookmark = (id: string) => {
    setOutputs(prev => prev.map(o => o.id === id ? { ...o, bookmarked: !o.bookmarked } : o));
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-20 font-sans" dir="rtl">
      <div className="max-w-4xl mx-auto px-6 pt-12 space-y-10">
        
        {/* --- Header Section --- */}
        <header className="space-y-4">
          <div className="flex items-center gap-3">
             <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-xl shadow-blue-500/20">
                <Brain size={28} className="text-white animate-pulse" />
             </div>
             <div>
                <h1 className="text-2xl font-black text-slate-900">رادار الذكاء الاستراتيجي</h1>
                <p className="text-sm text-slate-500 font-medium">نظام التحليل المعرفي المبني على البيانات الحية</p>
             </div>
          </div>
        </header>

        {/* --- STEP 1: Search & Filter --- */}
        <section className="space-y-6 animate-fadeIn">
          <div className="flex flex-col gap-4">
            <div className="relative group">
               <Search size={20} className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
               <input 
                type="text" 
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="ابحث عن مجموعات البيانات... (مثل: التضخم، العقارات)"
                className="w-full pr-14 pl-6 py-5 bg-white border border-slate-200 rounded-[24px] text-sm font-bold shadow-sm focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 outline-none transition-all"
               />
               {searchQuery && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl border border-slate-100 shadow-xl z-50 p-2 border-t-0 animate-scaleIn origin-top">
                     <p className="text-[10px] text-slate-400 font-black px-3 py-2 uppercase tracking-widest">اقتراحات ذكية</p>
                     <div className="flex flex-col gap-1">
                        <button className="flex items-center gap-2 px-3 py-2 hover:bg-slate-50 rounded-xl transition-all text-xs font-bold text-slate-700">
                          <Activity size={14} className="text-blue-500" /> تحليل الارتباط مع {searchQuery}
                        </button>
                        <button className="flex items-center gap-2 px-3 py-2 hover:bg-slate-50 rounded-xl transition-all text-xs font-bold text-slate-700">
                          <TrendingUp size={14} className="text-emerald-500" /> توقعات المدى البعيد لـ {searchQuery}
                        </button>
                     </div>
                  </div>
               )}
            </div>

            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
              {SECTORS.map(sector => (
                <button
                  key={sector}
                  onClick={() => setActiveSector(sector)}
                  className={`px-5 py-2.5 rounded-full text-xs font-black transition-all whitespace-nowrap border ${activeSector === sector ? 'bg-slate-900 border-slate-900 text-white shadow-lg' : 'bg-white border-slate-200 text-slate-500 hover:border-blue-300 hover:text-blue-600'}`}
                >
                  {sector}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* --- STEP 2: Data Cards --- */}
        <section className="space-y-4">
          <div className="flex items-center justify-between px-2">
             <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <Database size={14} /> البيانات المتوفرة
             </h3>
             <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">{selectedDatasets.length} مختار</span>
          </div>
          
          <div className="flex flex-col gap-3 max-h-[340px] overflow-y-auto no-scrollbar pr-1 py-1 custom-scrollbar">
            {filteredDatasets.map(ds => (
              <div 
                key={ds.id}
                onClick={() => handleToggleDS(ds.id)}
                className={`p-5 rounded-[28px] border-2 transition-all cursor-pointer flex items-center justify-between group ${selectedDatasets.includes(ds.id) ? 'bg-blue-600 border-blue-600 text-white shadow-xl shadow-blue-500/10' : 'bg-white border-slate-100 hover:border-blue-200 hover:shadow-md'}`}
              >
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-2xl ${selectedDatasets.includes(ds.id) ? 'bg-white/10' : 'bg-slate-50 group-hover:bg-blue-50'} transition-colors`}>
                    <Database size={20} className={selectedDatasets.includes(ds.id) ? 'text-white' : 'text-slate-400 group-hover:text-blue-500'} />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-sm font-black">{ds.name}</h4>
                    <div className="flex items-center gap-3">
                       <span className={`text-[10px] font-bold ${selectedDatasets.includes(ds.id) ? 'text-blue-100' : 'text-slate-400'}`}>{ds.sector}</span>
                       <span className="w-1 h-1 bg-slate-300 rounded-full" />
                       <span className={`text-[10px] font-bold ${selectedDatasets.includes(ds.id) ? 'text-blue-100' : 'text-slate-400'}`}>{ds.records.toLocaleString()} سجل</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 bg-black/5 px-2 py-1 rounded-full">
                    <PulsingDot />
                    <span className={`text-[9px] font-black uppercase tracking-tighter ${selectedDatasets.includes(ds.id) ? 'text-white' : 'text-emerald-600'}`}>Live Sync</span>
                  </div>
                  <ChevronRight size={18} className={`transition-transform ${selectedDatasets.includes(ds.id) ? 'text-white rotate-90' : 'text-slate-200 group-hover:text-blue-200'}`} />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* --- STEP 3: Command Box --- */}
        <section className="bg-white p-8 rounded-[40px] border border-slate-200 shadow-sm space-y-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full -mr-16 -mt-16 opacity-50" />
          
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative z-10">
            <div className="space-y-1">
              <h3 className="text-lg font-black text-slate-900">أمر التشغيل</h3>
              <p className="text-xs text-slate-400 font-bold">اكتب ما تريد أن يقوم الذكاء الاصطناعي بتحليله</p>
            </div>
            <div className="flex items-center gap-2 text-blue-600 bg-blue-50 px-4 py-2 rounded-2xl">
              <Sparkles size={16} />
              <span className="text-[11px] font-black uppercase tracking-widest">AI Engine Active</span>
            </div>
          </div>

          <div className="relative">
            <textarea 
              value={prompt}
              onChange={e => setPrompt(e.target.value)}
              placeholder="مثلاً: توقع مستقبل سوق العقارات السكني بناءً على النمو الديموغرافي..."
              className="w-full min-h-[160px] bg-slate-50 border-2 border-transparent rounded-[32px] p-6 text-sm font-bold focus:bg-white focus:border-blue-500/20 outline-none transition-all placeholder:text-slate-300 leading-relaxed resize-none overflow-y-auto custom-scrollbar"
            />
            <div className="absolute bottom-6 left-6 flex items-center gap-2">
               <span className="text-[10px] font-black text-slate-400 uppercase">{prompt.length} / 500</span>
            </div>
          </div>

          <button 
            onClick={handleStartAnalysis}
            disabled={isGenerating}
            className={`w-full py-5 rounded-[24px] text-lg font-black flex items-center justify-center gap-4 transition-all shadow-xl group ${isGenerating ? 'bg-slate-100 text-slate-400 cursor-wait' : 'bg-blue-600 text-white hover:bg-blue-700 hover:-translate-y-1 active:scale-95 shadow-blue-500/20'}`}
          >
            {isGenerating ? (
              <>
                <RefreshCw size={24} className="animate-spin" />
                <span>جاري استخلاص المعرفة...</span>
              </>
            ) : (
              <>
                <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center group-hover:animate-pulse">
                  <Zap size={22} className="fill-white" />
                </div>
                <span>توليد المحتوى الذكي</span>
              </>
            )}
          </button>
        </section>

        {/* --- STEP 4: AI Control Panel --- */}
        <section className="bg-white rounded-[32px] border border-slate-200 shadow-sm overflow-hidden">
           <button 
            onClick={() => setShowConfig(!showConfig)}
            className="w-full p-6 flex items-center justify-between border-b border-slate-50 hover:bg-slate-50 transition-colors"
           >
             <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
                  <Settings size={20} />
                </div>
                <div className="text-right">
                   <h3 className="text-sm font-black text-slate-900">إعدادات المحرك التحليلي</h3>
                   <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Parameter Orchestration</p>
                </div>
             </div>
             <ChevronDown size={20} className={`text-slate-300 transition-transform duration-300 ${showConfig ? 'rotate-180' : ''}`} />
           </button>

           {showConfig && (
              <div className="p-8 space-y-10 animate-scaleIn origin-top">
                {/* AI Mode Selection */}
                <div className="space-y-4">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">نمط الذكاء الاصطناعي</label>
                   <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {[
                        { id: 'predictive', l: 'تنبؤي استشرافي', i: Sparkles },
                        { id: 'analytical', l: 'تحليلي معمق', i: BarChart2 },
                        { id: 'summarization', l: 'تلخيص استراتيجي', i: FileText }
                      ].map(mode => (
                        <button
                          key={mode.id}
                          onClick={() => setAiMode(mode.id)}
                          className={`flex items-center gap-3 p-4 rounded-2xl border-2 transition-all ${aiMode === mode.id ? 'bg-slate-900 border-slate-900 text-white shadow-lg shadow-slate-900/10' : 'bg-slate-50 border-slate-50 text-slate-400 hover:border-blue-200 hover:bg-white'}`}
                        >
                          <mode.i size={18} className={aiMode === mode.id ? 'text-blue-400' : 'text-slate-300'} />
                          <span className="text-xs font-black">{mode.l}</span>
                        </button>
                      ))}
                   </div>
                </div>

                {/* Confidence Slider */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">مستوى الثقة المطلوب</label>
                    <span className="text-xs font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded-lg">{confLevel}% Accuracy Target</span>
                  </div>
                  <div className="relative py-4">
                    <div className="h-2 w-full bg-slate-100 rounded-full">
                       <div className="h-full bg-blue-600 rounded-full transition-all duration-300" style={{ width: `${confLevel}%` }} />
                    </div>
                    <input 
                      type="range" 
                      min={30} max={99} 
                      value={confLevel}
                      onChange={e => setConfLevel(+e.target.value)}
                      className="absolute inset-x-0 top-1/2 -translate-y-1/2 w-full h-2 opacity-0 cursor-pointer"
                    />
                  </div>
                </div>

                {/* Output Types */}
                <div className="space-y-4">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">تنسيق المخرجات</label>
                   <div className="flex flex-wrap gap-2">
                      {OUTPUT_TYPES.map(type => (
                        <button
                          key={type.id}
                          onClick={() => setSelectedOutputTypes(prev => prev.includes(type.id) ? prev.filter(x => x !== type.id) : [...prev, type.id])}
                          className={`flex items-center gap-2 px-5 py-3 rounded-2xl border-2 transition-all ${selectedOutputTypes.includes(type.id) ? 'bg-blue-600 border-blue-600 text-white shadow-lg' : 'bg-white border-slate-100 text-slate-400 hover:border-blue-200'}`}
                        >
                          <type.icon size={16} className={selectedOutputTypes.includes(type.id) ? 'text-white' : 'text-slate-300'} />
                          <span className="text-xs font-black">{type.ar}</span>
                        </button>
                      ))}
                   </div>
                </div>
              </div>
           )}
        </section>

        {/* --- STEP 5: Results Area --- */}
        <section id="results-area" className="space-y-6">
           {showResults && (
              <div className="space-y-8 animate-fadeIn">
                 <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div>
                       <h3 className="text-xl font-black text-slate-900">مخرجات التحليل</h3>
                       <p className="text-xs text-slate-500 font-medium">تمت معالجة {selectedDatasets.length} مصدر بيانات في {aiMode} mode</p>
                    </div>
                    
                    <div className="flex items-center gap-2 bg-white p-1.5 rounded-2xl border border-slate-200 shadow-sm">
                       {['all', 'opportunity', 'risk', 'alert'].map(f => (
                          <button
                            key={f}
                            onClick={() => setResultsFilter(f)}
                            className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${resultsFilter === f ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-50'}`}
                          >
                            {f === 'all' ? 'الكل' : f === 'opportunity' ? 'فرص' : f === 'risk' ? 'مخاطر' : 'تنبيهات'}
                          </button>
                       ))}
                    </div>
                 </div>

                 <div className="grid grid-cols-1 gap-6">
                    {outputs.filter(o => resultsFilter === 'all' || o.type === resultsFilter).map((card, idx) => {
                       const isOpportunity = card.type === 'opportunity';
                       const isRisk = card.type === 'risk';
                       const isAlert = card.type === 'alert';
                       
                       const borderClass = isOpportunity ? 'border-r-emerald-500' : isRisk ? 'border-r-red-500' : 'border-r-amber-500';
                       const iconColor = isOpportunity ? 'text-emerald-500' : isRisk ? 'text-red-500' : 'text-amber-500';
                       const bgColor = isOpportunity ? 'bg-emerald-50/50' : isRisk ? 'bg-red-50/50' : 'bg-amber-50/50';

                       return (
                          <div 
                            key={card.id} 
                            className={`bg-white rounded-[32px] border border-slate-200 border-r-8 ${borderClass} shadow-sm overflow-hidden transition-all hover:shadow-xl hover:-translate-y-1 group animate-slideInUp`}
                            style={{ animationDelay: `${idx * 150}ms` }}
                          >
                             <div className="p-8 space-y-6">
                                <div className="flex items-start justify-between">
                                   <div className="flex items-center gap-4">
                                      <div className={`w-12 h-12 rounded-2xl ${bgColor} flex items-center justify-center transition-transform group-hover:scale-110`}>
                                         {isOpportunity ? <Zap size={24} className={iconColor} /> : isRisk ? <AlertTriangle size={24} className={iconColor} /> : <Info size={24} className={iconColor} />}
                                      </div>
                                      <div>
                                         <span className={`text-[10px] font-black px-2 py-0.5 rounded-md ${isOpportunity ? 'bg-emerald-100 text-emerald-700' : isRisk ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}`}>
                                            {card.categoryAr}
                                         </span>
                                         <h4 className="text-lg font-black text-slate-900 mt-1">{card.title}</h4>
                                      </div>
                                   </div>
                                   <button 
                                    onClick={() => toggleBookmark(card.id)}
                                    className="p-3 bg-slate-50 border border-slate-100 rounded-xl text-slate-300 hover:text-blue-600 hover:bg-white transition-all shadow-sm"
                                  >
                                     <Bookmark size={18} className={card.bookmarked ? 'fill-blue-600 text-blue-600' : ''} />
                                   </button>
                                </div>

                                <p className="text-sm text-slate-600 leading-relaxed font-bold opacity-80">{card.content}</p>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-end pt-6 border-t border-slate-50">
                                   <div className="flex items-center gap-8">
                                      <div className="space-y-2">
                                         <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Confidence Score</p>
                                         <div className="flex items-center gap-3">
                                            <div className="h-1.5 w-20 bg-slate-100 rounded-full overflow-hidden">
                                               <div className={`h-full ${isOpportunity ? 'bg-emerald-500' : isRisk ? 'bg-red-500' : 'bg-amber-500'}`} style={{ width: `${card.confidence}%` }} />
                                            </div>
                                            <span className="text-sm font-black text-slate-900">{card.confidence}%</span>
                                         </div>
                                      </div>
                                      <div className="space-y-2">
                                         <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Projected Impact</p>
                                         <span className="text-sm font-black text-slate-900">{card.impact}% Growth</span>
                                      </div>
                                   </div>

                                   <div className="flex flex-col items-end gap-2">
                                      <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Trend Analysis</p>
                                      <Sparkline data={card.chartData || []} type={card.type} />
                                   </div>
                                </div>
                                
                                <div className="flex items-center justify-end gap-3 pt-4">
                                   <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-100 text-[11px] font-black text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition-all">
                                      <Edit3 size={14} /> حفظ كمسودة
                                   </button>
                                   <button className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-slate-900 text-white text-[11px] font-black hover:bg-blue-600 shadow-lg shadow-slate-900/10 transition-all">
                                      <Star size={14} className="text-amber-400" /> إضافة للمفضلة
                                   </button>
                                </div>
                             </div>
                          </div>
                       );
                    })}
                 </div>
              </div>
           )}

           {!showResults && !isGenerating && (
              <div className="py-20 text-center space-y-6 opacity-40 animate-fadeIn">
                 <div className="w-24 h-24 bg-white rounded-[40px] shadow-sm border border-slate-100 flex items-center justify-center mx-auto">
                    <MousePointer2 size={40} className="text-slate-200" />
                 </div>
                 <div className="space-y-2">
                    <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">بانتظار التعليمات الاستراتيجية</h3>
                    <p className="text-xs text-slate-400 font-bold max-w-sm mx-auto leading-relaxed">بمجرد الضغط على "توليد المحتوى"، سيبدأ الذكاء الاصطناعي بربط البيانات واستخلاص الرؤى هنا.</p>
                 </div>
              </div>
           )}
        </section>

      </div>

      {/* --- Global Styles --- */}
      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; height: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #cbd5e1; }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn { animation: fadeIn 0.8s ease-out forwards; }

        @keyframes slideInUp {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slideInUp { animation: slideInUp 0.6s ease-out forwards; }

        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-scaleIn { animation: scaleIn 0.4s ease-out forwards; }
      `}</style>
    </div>
  );
};

export default AIRadarDashboard;
