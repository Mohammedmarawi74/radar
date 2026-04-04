import React, { useEffect, useState, useMemo } from 'react';
import * as echarts from 'echarts';
import ReactECharts from 'echarts-for-react';
import NeighborhoodTable from './NeighborhoodTable';
import { 
  MapPin, Info, Activity, Banknote, 
  Target, Maximize2, Minimize2, Compass, Layers,
  Calendar, Building2, Filter, ChevronRight,
  TrendingUp, TrendingDown, LayoutGrid, Clock, Sparkles,
  Download, X, ArrowUpRight, ArrowDownRight, ArrowRightLeft,
  Search
} from 'lucide-react';

interface CityNeighborhoodMapProps {
  cityName: string;
}

const CityNeighborhoodMap: React.FC<CityNeighborhoodMapProps> = ({ cityName }) => {
  const CITY_SLUGS: { [key: string]: string } = {
    "الرياض": "riyadh",
    "جدة": "jeddah",
    "بريدة": "buraydah",
    "مكة المكرمة": "makkah",
    "المدينة المنورة": "madinah",
    "الدمام": "dammam",
    "حائل": "hail",
    "الهفوف": "hofuf",
    "الخبر": "khobar",
    "حفر الباطن": "hafr_al_batin",
    "الطائف": "taif",
    "الخرج": "kharj",
    "تبوك": "tabuk",
    "عرعر": "arar",
    "أبها": "abha",
    "نجران": "najran",
    "خميس مشيط": "khamis_mushait",
    "عنيزة": "unaizah",
    "المزاحمية": "muzahimiyah",
    "جيزان": "jizan",
    "الدوادمي": "duwadimi",
    "سكاكا": "sakaka",
    "الجبيل": "jubail",
    "بقعاء": "baqaa",
    "القطيف": "qatif"
  };

  const CHART_FONT = 'IBM Plex Sans Arabic';
  const YEARS = ['2024', '2023', '2022', '2021', '2020'];
  const QUARTERS = [
    { id: 'all', label: 'كافة الأرباع' },
    { id: '1', label: 'الربع الأول' },
    { id: '2', label: 'الربع الثاني' },
    { id: '3', label: 'الربع الثالث' },
    { id: '4', label: 'الربع الرابع' }
  ];
  const PROP_TYPES = [
    { id: 'all', label: 'الكل' },
    { id: 'سكني', label: 'سكني' },
    { id: 'تجاري', label: 'تجاري' },
    { id: 'زراعي', label: 'زراعي' },
    { id: 'صناعي', label: 'صناعي' }
  ];

  const SEARCH_PLACEHOLDERS: { [key: string]: string } = {
    "الرياض": "الملقا، الياسمين...",
    "جدة": "الشاطئ، أبحر الشمالي...",
    "مكة المكرمة": "الشوقية، العوالي...",
    "المدينة المنورة": "الخالدية، باقدو...",
    "بريدة": "الفايزية، الريان...",
    "الدمام": "الشاطئ، الحي الجامعي...",
    "الخبر": "العزيزية، الراكة...",
    "تبوك": "المروج، الصفا...",
    "أبها": "المنسك، الموظفين..."
  };

  const [geoData, setGeoData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isActualFullScreen, setIsActualFullScreen] = useState(false);
  const [selectedYear, setSelectedYear] = useState('2024');
  const [selectedQuarter, setSelectedQuarter] = useState('all');
  const [selectedPropType, setSelectedPropType] = useState('all');
  const [selectedMetric, setSelectedMetric] = useState<'liquidity' | 'transactions'>('liquidity');
  const [hoveredDistrict, setHoveredDistrict] = useState<any>(null);
  const [selectedDistricts, setSelectedDistricts] = useState<any[]>([]);
  const [isCompareMode, setIsCompareMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);

  // For compatibility with reports
  const selectedDistrict = selectedDistricts[0] || null;
  const chartRef = React.useRef<any>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);

  const norm = (s: string) => (s || '').replace(/^حي\s+/, '').replace(/[أإآ]/g, 'ا').replace(/ة/g, 'ه').trim();

  const toggleFullScreen = () => {
    if (!containerRef.current) return;
    
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable full-screen mode: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  };

  useEffect(() => {
    const handleFullScreenChange = () => {
      const isFS = !!document.fullscreenElement;
      setIsActualFullScreen(isFS);
      setIsFullScreen(isFS); // Sync CSS-based FS as well
    };
    document.addEventListener('fullscreenchange', handleFullScreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullScreenChange);
  }, []);

  const handleDownloadReport = () => {
    if (!selectedDistrict) return;

    const stats = selectedDistrict.detailedStats;
    const csvValue = selectedDistrict.name || 'District';
    const csvContent = 
      `District,${csvValue}\n` +
      `Year,${selectedYear}\n` +
      `Quarter,${selectedQuarter}\n` +
      `Property Type,${selectedPropType}\n\n` +
      `Metric,Value\n` +
      `Liquidity (M),${stats.total_price_M.toFixed(2)}\n` +
      `Transactions,${stats.txn_count}\n` +
      `Avg Price (M),${stats.avg_price_M.toFixed(2)}\n` +
      `Avg Area (sqm),${stats.avg_area.toFixed(0)}\n`;

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.href = url;
    link.setAttribute("download", `Report_${cityName}_${csvValue}_${selectedYear}.csv`);
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !document.fullscreenElement) {
        setIsFullScreen(false);
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  useEffect(() => {
    if (!cityName) return;
    setLoading(true);
    setError(false);
    setSelectedDistricts([]);
    setIsCompareMode(false);
    setGeoData(null);

    const slug = CITY_SLUGS[cityName] || encodeURIComponent(cityName);
    const mapName = `map_${slug}`;

    fetch(`/maps/${slug}.json`)
      .then(res => {
        if (!res.ok) throw new Error(`Map file not found: ${slug}`);
        return res.json();
      })
      .then(data => {
        if (!data || !data.features || data.features.length === 0) {
          throw new Error("Invalid map data structure");
        }

        // Just register it, ECharts will overwrite if already exists
        echarts.registerMap(mapName, {
          type: 'FeatureCollection',
          features: data.features
        } as any);

        setGeoData(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error loading city map:', err);
        setError(true);
        setLoading(false);
      });
  }, [cityName]);

  const processedData = useMemo(() => {
    if (!geoData || loading) return { series: [], maxVal: 0 };

    const stats = geoData.stats || {};
    const features = geoData.features || [];
    
    // Normalization helper for Arabic names
    const norm = (s: string) => (s || '').replace(/^حي\s+/, '').replace(/[أإآ]/g, 'ا').replace(/ة/g, 'ه').trim();

    const series = features.map((f: any) => {
      const nName = f.properties.name || f.properties.name_ar;
      
      // Try exact match, then normalized match
      let nStats = stats[nName];
      if (!nStats) {
        const searchNorm = norm(nName);
        const key = Object.keys(stats).find(k => norm(k) === searchNorm);
        if (key) nStats = stats[key];
      }
      nStats = nStats || {};
      
      let aggregatedStats = {
        total_price_M: 0,
        txn_count: 0,
        avg_price_M: 0,
        avg_area: 0
      };

      const yearData = nStats[selectedYear];
      if (yearData) {
        const quartersToProcess = selectedQuarter === 'all' 
          ? Object.keys(yearData) 
          : (yearData[selectedQuarter] ? [selectedQuarter] : []);

        quartersToProcess.forEach(q => {
          const quarterData = yearData[q];
          if (quarterData) {
            if (selectedPropType === 'all') {
              Object.values(quarterData).forEach((pt: any) => {
                aggregatedStats.total_price_M += pt.total_price_M || 0;
                aggregatedStats.txn_count += pt.txn_count || 0;
                aggregatedStats.avg_area += pt.avg_area || 0;
              });
            } else {
              const ptData = quarterData[selectedPropType];
              if (ptData) {
                aggregatedStats.total_price_M += ptData.total_price_M || 0;
                aggregatedStats.txn_count += ptData.txn_count || 0;
                aggregatedStats.avg_area += ptData.avg_area || 0;
              }
            }
          }
        });

        if (aggregatedStats.txn_count > 0) {
          aggregatedStats.avg_price_M = aggregatedStats.total_price_M / aggregatedStats.txn_count;
          const entriesCount = quartersToProcess.length * (selectedPropType === 'all' ? 4 : 1);
          if (entriesCount > 0) aggregatedStats.avg_area /= entriesCount;
        }
      }

      return {
        name: nName || 'غير معروف',
        value: selectedMetric === 'liquidity' ? (aggregatedStats.total_price_M || 0) : (aggregatedStats.txn_count || 0),
        detailedStats: aggregatedStats,
        itemStyle: selectedDistricts.findIndex(d => norm(d.name) === norm(nName)) === 0 
          ? { areaColor: '#f97316', borderColor: '#fff', borderWidth: 2, shadowColor: 'rgba(249, 115, 22, 0.5)', shadowBlur: 10 } 
          : selectedDistricts.findIndex(d => norm(d.name) === norm(nName)) === 1 
            ? { areaColor: '#6366f1', borderColor: '#fff', borderWidth: 2, shadowColor: 'rgba(99, 102, 241, 0.5)', shadowBlur: 10 } 
            : undefined
      };
    });

    const maxVal = Math.max(...series.map((d: any) => d.value), 1);
    return { series, maxVal };
  }, [geoData, loading, selectedYear, selectedQuarter, selectedPropType, selectedMetric, selectedDistricts]);

  const mapOption = useMemo(() => {
    if (!geoData || loading) return {};
    const slug = CITY_SLUGS[cityName] || encodeURIComponent(cityName);
    const mapName = `map_${slug}`;

    if (!echarts.getMap(mapName)) return {};

    const safeMaxVal = processedData.maxVal > 0 ? processedData.maxVal : 1;

    return {
      backgroundColor: '#d8dbdfff',
      tooltip: { show: false },
      visualMap: {
        min: 0,
        max: safeMaxVal,
        show: true,
        left: 'right',
        bottom: 20,
        orient: 'vertical',
        text: ['كثيفة', 'منخفضة'],
        textStyle: { color: '#94a3b8', fontFamily: CHART_FONT, fontSize: 10, fontWeight: 'bold' },
        itemWidth: 10,
        itemHeight: 120,
        inRange: {
          color: selectedMetric === 'liquidity' 
            ? ['#eff6ff', '#bfdbfe', '#60a5fa', '#2563eb', '#1e3a8a'] 
            : ['#f0fdf4', '#bbf7d0', '#4ade80', '#16a34a', '#14532d']
        }
      },
      series: [
        {
          type: 'map',
          map: mapName,
          roam: true,
          zoom: 1.1,
          selectedMode: false,
          emphasis: {
            label: { show: false },
            itemStyle: { areaColor: '#f59e0b', borderColor: '#fff', borderWidth: 2 }
          },
          select: {
            itemStyle: { areaColor: '#f97316', borderColor: '#fff', borderWidth: 2 }
          },
          label: { show: false },
          itemStyle: {
            borderColor: 'rgba(59, 130, 246, 0.2)',
            borderWidth: 0.5,
            areaColor: '#f8fafc'
          },
          data: processedData.series
        }
      ]
    };
  }, [geoData, loading, processedData, selectedMetric, cityName]);

  if (error) {
    return (
      <div className="bg-white p-12 rounded-[60px] border border-slate-100 flex flex-col items-center justify-center text-center gap-4 min-h-[400px]">
        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-300">
          <Compass size={32} />
        </div>
        <div>
          <h3 className="text-xl font-bold text-slate-900">الخريطة التفاعلية غير متوفرة</h3>
          <p className="text-slate-400 text-sm mt-1 max-w-xs">نحن نعمل على تجهيز بيانات الأحياء لهذه المدينة. سيتم توفيرها قريباً.</p>
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className={`bg-white border shadow-2xl transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] ${isFullScreen ? 'fixed top-0 bottom-0 left-0 right-0 !w-screen !h-screen z-[9999] rounded-none !m-0 overflow-y-auto' : 'rounded-[48px] border-slate-100'}`} dir="rtl">
      {/* ── HEADER ── */}
      <div className={`${isFullScreen ? 'px-8 lg:px-16 py-3.5 mt-1' : 'px-6 lg:px-8 py-3.5'} bg-gradient-to-br from-white to-slate-50/50 border-b border-slate-100 shrink-0 transition-all`}>
        <div className="flex flex-col xl:flex-row gap-4 justify-between items-center">
          {!isFullScreen && (
            <div className="flex items-center gap-4 animate-in fade-in slide-in-from-right-4">
              <div className="p-2.5 bg-blue-600 rounded-2xl text-white shadow-xl shadow-blue-500/20 transition-all">
                <Layers size={18}/>
              </div>
              <div className="hidden sm:block">
                <h3 className="text-lg font-black text-slate-900 tracking-tight transition-all leading-tight">رادارات الأحياء الذكية</h3>
                <p className="text-slate-400 text-[10px] font-bold mt-0.5 flex items-center gap-1.5 opacity-80">
                  <MapPin size={10} className="text-blue-500"/> تحليل جيو-مكاني متقدم لمدينة {cityName}
                </p>
              </div>
            </div>
          )}

          {isFullScreen && (
             <div className="flex items-center gap-3 animate-in fade-in slide-in-from-right-4">
                <div className="p-2 bg-slate-900 rounded-xl text-white">
                  <MapPin size={16}/>
                </div>
                <h3 className="text-lg font-black text-slate-900 tracking-tight">{cityName} - خريطة الاستثمار</h3>
             </div>
          )}

          <div className="flex-grow max-w-md mx-4 relative hidden md:block">
             <div className="relative group">
                <Search size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                <input 
                   type="text" 
                   value={searchQuery}
                   onChange={(e) => { setSearchQuery(e.target.value); setShowSearchResults(true); }}
                   placeholder={`ابحث عن حي في ${cityName}... (${SEARCH_PLACEHOLDERS[cityName] || 'اكتب اسم الحي...'})`}
                   className="w-full h-9 pr-10 pl-4 bg-slate-100/50 border border-slate-200/60 rounded-[14px] text-[11px] font-bold text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                />
                {searchQuery && (
                   <button 
                      onClick={() => { setSearchQuery(''); setShowSearchResults(false); }}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                   >
                      <X size={14}/>
                   </button>
                )}
             </div>

             {/* Search Suggestions */}
             {showSearchResults && searchQuery.length > 1 && (
                <div className="absolute top-full mt-2 left-0 right-0 bg-white border border-slate-100 shadow-2xl rounded-2xl overflow-hidden z-[60] animate-in fade-in slide-in-from-top-2">
                   <div className="max-h-64 overflow-y-auto">
                      {processedData.series
                         .filter((d: any) => norm(d.name).includes(norm(searchQuery)))
                         .slice(0, 10)
                         .map((d: any) => (
                            <button 
                               key={d.name}
                               onClick={() => {
                                  setSearchQuery('');
                                  setShowSearchResults(false);
                                  
                                  // Find the feature to get its center for zooming
                                  const feature = geoData.features.find((f: any) => 
                                     norm(f.properties.name || f.properties.name_ar) === norm(d.name)
                                  );

                                  if (feature && chartRef.current) {
                                     const inst = chartRef.current.getEchartsInstance();
                                     
                                     let coords = feature.geometry.coordinates;
                                     if (feature.geometry.type === 'MultiPolygon') coords = coords[0][0];
                                     else if (feature.geometry.type === 'Polygon') coords = coords[0];
                                     
                                     if (coords && coords.length > 0) {
                                        const center = coords[0];
                                        inst.setOption({
                                           series: [{ center: center, zoom: 4 }]
                                        });
                                        // NEW: Trigger vibrant highlight and tooltip
                                        inst.dispatchAction({ type: 'highlight', name: d.name });
                                        inst.dispatchAction({ type: 'showTip', name: d.name });
                                     }
                                  }

                                  setSelectedDistricts(prev => {
                                     if (isCompareMode) {
                                        if (prev.find(p => norm(p.name) === norm(d.name))) return prev;
                                        if (prev.length < 2) return [...prev, d];
                                        // If already have 2, clicking a 3rd in search resets to normal single
                                        setIsCompareMode(false);
                                        return [d];
                                     }
                                     return [d];
                                  });
                               }}
                               className="w-full px-5 py-3 text-right hover:bg-slate-50 transition-colors border-b border-slate-50 last:border-0 flex items-center justify-between group"
                            >
                               <span className="text-xs font-black text-slate-700">{d.name}</span>
                               <ChevronRight size={14} className="text-slate-300 group-hover:text-blue-500 transition-all" />
                            </button>
                         ))}
                      {processedData.series.filter((d: any) => norm(d.name).includes(norm(searchQuery))).length === 0 && (
                         <div className="p-10 text-center text-slate-400">
                            <Compass size={24} className="mx-auto mb-2 opacity-50"/>
                            <p className="text-[10px] font-bold tracking-widest">لم يتم العثور على نتائج</p>
                         </div>
                      )}
                   </div>
                </div>
             )}
          </div>

          <div className="flex flex-wrap items-center gap-2 bg-white/80 backdrop-blur p-0.5 rounded-2xl border border-slate-200/60 shadow-sm">
            {/* Filter Dropdowns */}
            <div className="flex items-center gap-1.5 px-2 border-l border-slate-100">
              <Calendar size={12} className="text-slate-400"/>
              <select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)} className="bg-transparent border-none text-[10px] font-black text-slate-700 focus:ring-0">
                {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>
            <div className="flex items-center gap-1.5 px-2 border-l border-slate-100">
               <Clock size={12} className="text-slate-400"/>
               <select value={selectedQuarter} onChange={(e) => setSelectedQuarter(e.target.value)} className="bg-transparent border-none text-[10px] font-black text-slate-700 focus:ring-0">
                  <option value="all">كافة الأرباع</option>
                  <option value="1">الربع الأول</option>
                  <option value="2">الربع الثاني</option>
                  <option value="3">الربع الثالث</option>
                  <option value="4">الربع الرابع</option>
               </select>
            </div>

            <div className="flex items-center gap-1.5 px-2 border-l border-slate-100">
               <Building2 size={12} className="text-slate-400"/>
               <select value={selectedPropType} onChange={(e) => setSelectedPropType(e.target.value)} className="bg-transparent border-none text-[10px] font-black text-slate-700 focus:ring-0">
                  <option value="all">الكل</option>
                  <option value="سكني">سكني</option>
                  <option value="تجاري">تجاري</option>
                  <option value="زراعي">زراعي</option>
                  <option value="صناعي">صناعي</option>
               </select>
            </div>

            <div className="flex bg-slate-100 p-0.5 rounded-xl">
               <button 
                 onClick={() => setSelectedMetric('liquidity')} 
                 className={`px-3 py-1 rounded-lg text-[9px] font-black transition-all ${selectedMetric === 'liquidity' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
               >
                 السيولة
               </button>
               <button 
                 onClick={() => setSelectedMetric('transactions')} 
                 className={`px-3 py-1 rounded-lg text-[9px] font-black transition-all ${selectedMetric === 'transactions' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
               >
                 الصفقات
               </button>
            </div>

            <div className="px-1.5 flex items-center gap-2">
               <button 
                 onClick={toggleFullScreen}
                 title="ملء الشاشة الحقيقي"
                 className={`flex items-center gap-2 px-3 py-1.5 rounded-xl transition-all ${isFullScreen ? 'bg-red-600 hover:bg-red-500' : 'bg-slate-900 hover:bg-slate-800'} text-white shadow-lg`}
               >
                 {isFullScreen ? (
                   <>
                     <Minimize2 size={14}/>
                     <span className="text-[9px] font-black">خروج</span>
                   </>
                 ) : (
                   <>
                     <Maximize2 size={14}/>
                     <span className="text-[9px] font-black">ملء الشاشة</span>
                   </>
                 )}
               </button>
            </div>
          </div>
        </div>
      </div>

      <div className={`relative flex flex-col lg:flex-row transition-all duration-500 ${isFullScreen ? 'h-[calc(100vh-80px)]' : 'min-h-[700px]'} bg-slate-50`}>
        <div className="flex-grow p-4 relative h-full bg-slate-100/40 border-l border-slate-200/40 shadow-inner">
          {loading ? (
            <div className="absolute inset-0 flex items-center justify-center gap-3 text-slate-400 font-bold z-50 bg-slate-50/80 backdrop-blur">
              <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
              <span>جاري تحميل بيانات {cityName}...</span>
            </div>
          ) : (
            <>
              <ReactECharts 
                ref={chartRef}
                onEvents={{
                  mouseover: (params: any) => { if(params.data) setHoveredDistrict(params.data); },
                  mouseout: () => setHoveredDistrict(null),
                  click: (params: any) => { 
                    if (!params.data) return;
                    const target = params.data;
                    setSelectedDistricts(prev => {
                      // If already selected, remove it and exit compare if empty
                      if (prev.find(d => norm(d.name) === norm(target.name))) {
                        const next = prev.filter(d => norm(d.name) !== norm(target.name));
                        if (next.length === 0) setIsCompareMode(false);
                        return next;
                      }
                      
                      // If in mode, allow adding second
                      if (isCompareMode) {
                        if (prev.length < 2) return [...prev, target];
                        // If already have 2, clicking a 3rd neighborhood resets to normal single mode
                        setIsCompareMode(false);
                        return [target];
                      }
                      
                      // Default: single select (replaces old)
                      return [target];
                    });
                  }
                }}
                option={mapOption} 
                style={{ height: '100%', minHeight: isFullScreen ? 'calc(100vh - 120px)' : 650, width: '100%', backgroundColor: '#f1f5f9', borderRadius: '16px' }} 
                lazyUpdate={false}
                notMerge={true}
              />
              {hoveredDistrict && (
                <div className={`absolute ${isFullScreen ? 'top-32 lg:top-36 right-12 lg:right-32' : 'top-16 right-12'} w-64 bg-slate-900/95 backdrop-blur-xl border border-white/10 p-6 rounded-[32px] shadow-2xl text-white animate-in fade-in slide-in-from-right-4 pointer-events-none z-40 text-right`}>
                  <h4 className="text-lg font-black mb-4">
                    {hoveredDistrict.name.startsWith('حي') ? hoveredDistrict.name : `حي ${hoveredDistrict.name}`}
                  </h4>
                  <div className="space-y-4">
                    <div>
                      <p className="text-[10px] font-black text-slate-500 uppercase">السيولة المتداولة</p>
                      <p className="text-xl font-black text-blue-400">{hoveredDistrict.detailedStats.total_price_M.toFixed(1)} <span className="text-xs">مليون</span></p>
                    </div>
                    <div className="flex flex-row-reverse justify-between border-t border-white/5 pt-4">
                      <div>
                        <p className="text-[9px] font-black text-slate-500 uppercase">الصفقات</p>
                        <p className="text-sm font-bold">{hoveredDistrict.detailedStats.txn_count}</p>
                      </div>
                      <div>
                        <p className="text-[9px] font-black text-slate-500 uppercase text-left">م. السعر</p>
                        <p className="text-sm font-bold text-emerald-400 text-left">{hoveredDistrict.detailedStats.avg_price_M.toFixed(1)}M</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
          <div className="absolute left-6 bottom-6 text-[10px] font-black text-slate-400 opacity-60">
            <Maximize2 size={12} className="inline mr-2"/> استخدم عجلة الفأرة للتكبير
          </div>
        </div>

        {/* ── SIDEBAR ── */}
        <div className={`transition-all duration-500 overflow-y-auto ${isFullScreen ? 'fixed top-24 bottom-8 left-8 w-[380px] z-[50] rounded-[40px] shadow-2xl border-none' : 'w-full lg:w-[420px] bg-white border-r border-slate-100'} ${selectedDistricts.length > 0 ? 'translate-x-0 opacity-100' : 'translate-x-[120%] lg:translate-x-0 lg:opacity-40'}`}>
          <div className={`${isFullScreen ? 'bg-white/95 backdrop-blur-xl h-full border border-white/20' : 'h-full bg-white'} rounded-[inherit]`}>
          {selectedDistricts.length > 1 ? (
            <div className="p-8 flex flex-col gap-6 animate-fadeIn">
              {/* Comparison Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-slate-900 text-white rounded-lg scale-90"><ArrowRightLeft size={16}/></div>
                  <h3 className="text-xl font-black text-slate-900">مقارنة الأحياء</h3>
                </div>
                <button onClick={() => { setSelectedDistricts([]); setIsCompareMode(false); }} className="text-slate-400 hover:text-red-500 transition-colors">
                  <X size={20}/>
                </button>
              </div>

              <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-6 rounded-[32px] text-white shadow-xl">
                 <div className="flex justify-between items-center gap-4 text-center">
                    <div className="flex-1">
                       <p className="text-orange-400 text-xs font-black mb-1">الحي الأول</p>
                       <p className="text-sm font-bold truncate">{selectedDistricts[0].name}</p>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-[10px] font-black">VS</div>
                    <div className="flex-1">
                       <p className="text-indigo-400 text-xs font-black mb-1">الحي الثاني</p>
                       <p className="text-sm font-bold truncate">{selectedDistricts[1].name}</p>
                    </div>
                 </div>
              </div>

              <div className="space-y-4">
                <ComparisonRow 
                   title="إجمالي السيولة" 
                   val1={selectedDistricts[0].detailedStats.total_price_M} 
                   val2={selectedDistricts[1].detailedStats.total_price_M}
                   unit="M"
                   color1="orange" color2="indigo"
                />
                <ComparisonRow 
                   title="عدد الصفقات" 
                   val1={selectedDistricts[0].detailedStats.txn_count} 
                   val2={selectedDistricts[1].detailedStats.txn_count}
                   color1="orange" color2="indigo"
                />
                <ComparisonRow 
                   title="متوسط السعر" 
                   val1={selectedDistricts[0].detailedStats.avg_price_M} 
                   val2={selectedDistricts[1].detailedStats.avg_price_M}
                   unit="M"
                   color1="orange" color2="indigo"
                />
                <ComparisonRow 
                   title="متوسط المساحة" 
                   val1={selectedDistricts[0].detailedStats.avg_area} 
                   val2={selectedDistricts[1].detailedStats.avg_area}
                   unit="م²"
                   color1="orange" color2="indigo"
                />
              </div>

              <div className="mt-4 p-6 bg-blue-50/50 rounded-[32px] border border-blue-100/50">
                 <div className="flex items-center gap-3 text-blue-600 mb-3">
                    <Sparkles size={18}/>
                    <p className="text-[11px] font-black uppercase">تحليل رادار الذكي</p>
                 </div>
                 <p className="text-xs text-slate-600 leading-relaxed font-bold">
                    بمقارنة {selectedDistricts[0].name} مع {selectedDistricts[1].name} في {CITY_SLUGS[cityName] || cityName}، يتفوق {selectedDistricts[0].detailedStats.total_price_M > selectedDistricts[1].detailedStats.total_price_M ? selectedDistricts[0].name : selectedDistricts[1].name} من حيث قوة السيولة المتداولة.
                 </p>
              </div>
            </div>
          ) : selectedDistrict ? (
            <div className="p-8 flex flex-col gap-8 animate-fadeIn">
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <h3 className="text-4xl font-black text-slate-900 tracking-tighter">
                    {selectedDistrict.name.startsWith('حي') ? selectedDistrict.name : `حي ${selectedDistrict.name}`}
                  </h3>
                  <p className="text-slate-400 font-bold">{selectedYear} · {QUARTERS.find(q => q.id === selectedQuarter)?.label}</p>
                </div>
                <button onClick={() => { setSelectedDistricts([]); setIsCompareMode(false); }} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                  <X size={20} className="text-slate-400" />
                </button>
              </div>

              {/* Compare Trigger Button */}
              {!isCompareMode ? (
                <button 
                  onClick={() => setIsCompareMode(true)}
                  className="bg-indigo-600/5 hover:bg-indigo-600 hover:text-white border border-indigo-600/10 text-indigo-600 p-4 rounded-2xl flex items-center justify-center gap-3 transition-all group"
                >
                  <ArrowRightLeft size={16} className="group-hover:rotate-180 transition-transform" />
                  <p className="text-xs font-black">أضف حي آخر للمقارنة</p>
                </button>
              ) : (
                <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-2xl flex items-center gap-3 animate-pulse">
                   <div className="p-2 bg-indigo-600 text-white rounded-lg"><MapPin size={16}/></div>
                   <div className="flex-1">
                      <p className="text-[10px] font-black text-indigo-700 leading-tight">بانتظار اختيار الحي الثاني...</p>
                      <button onClick={() => setIsCompareMode(false)} className="text-[9px] font-bold text-indigo-400 hover:text-indigo-600 mt-1">إلغاء المقارنة</button>
                   </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <StatCard icon={Banknote} color="blue" label="السيولة" val={`${selectedDistrict.detailedStats.total_price_M.toFixed(1)}M`} />
                <StatCard icon={Activity} color="emerald" label="الصفقات" val={selectedDistrict.detailedStats.txn_count} />
                <StatCard icon={Target} color="amber" label="موسط السعر" val={`${selectedDistrict.detailedStats.avg_price_M.toFixed(2)}M`} />
                <StatCard icon={LayoutGrid} color="indigo" label="موسط المساحة" val={`${selectedDistrict.detailedStats.avg_area.toFixed(0)}م²`} />
              </div>

              <div className="mt-4 p-8 bg-slate-900 rounded-[40px] text-white">
                <p className="text-slate-400 text-sm leading-relaxed font-medium mb-6">
                   يعتبر {selectedDistrict.name.startsWith('حي') ? selectedDistrict.name : `حي ${selectedDistrict.name}`} من الأحياء {selectedDistrict.detailedStats.total_price_M > 500 ? 'عالية السيولة' : 'الصاعدة'} في مدينة {cityName}.
                </p>
                <button 
                  onClick={handleDownloadReport}
                  className="w-full py-4 bg-white text-slate-900 rounded-2xl font-black text-xs hover:bg-blue-600 hover:text-white transition-all shadow-md flex items-center justify-center gap-2 group border border-slate-100"
                >
                   <Download size={16} className="group-hover:animate-bounce" />
                   تحميل تقرير الحي الكامل
                </button>
              </div>
              <button 
                onClick={() => { setSelectedDistricts([]); setIsCompareMode(false); }} 
                className="text-xs text-slate-400 font-bold hover:text-slate-900 transition-colors inline-flex items-center gap-2"
              >
                <X size={14}/> إلغاء الاختيار
              </button>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center p-8 opacity-40">
               <div className="w-14 h-14 bg-slate-50 border border-slate-100 rounded-full flex items-center justify-center mb-4">
                  <MapPin size={28}/>
               </div>
               <p className="text-lg text-slate-900 font-black mb-1.5 tracking-tight">استكشف أحياء {cityName}</p>
               <p className="text-[10px] font-bold text-slate-500 max-w-[180px] leading-relaxed">اضغط على أي حي لاستعراض التفاصيل أو قارن بين حيين بالضغط عليهما</p>
            </div>
          )}
          </div>
        </div>
      </div>

      {/* --- Data Deep-Dive: Transactions Table (All Cities) --- */}
      {!isFullScreen && (
        <div className="max-w-7xl mx-auto px-8 pb-12 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
          <NeighborhoodTable 
            cityName={cityName} 
            data={processedData.series} 
            isLoading={loading}
          />
        </div>
      )}
    </div>
  );
};

const StatCard = ({ icon: Icon, color, label, val }: any) => (
  <div className={`bg-slate-50 p-4.5 rounded-2xl border border-slate-100 hover:bg-${color}-50 transition-colors`}>
    <Icon className={`text-${color}-600 mb-2`} size={18}/>
    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5 opacity-80">{label}</p>
    <p className="text-lg font-black text-slate-900">{val}</p>
  </div>
);

const ComparisonRow = ({ title, val1, val2, unit = '', color1, color2 }: any) => {
  const isBetter = val1 > val2;
  return (
    <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
      <p className="text-[9px] font-black text-slate-400 mb-2.5 text-center uppercase tracking-widest opacity-80">{title}</p>
      <div className="grid grid-cols-2 gap-3 items-center">
        <div className={`text-center transition-all ${isBetter ? 'scale-105' : 'opacity-60'}`}>
          <div className={`inline-flex items-center gap-1 ${isBetter ? 'text-emerald-600' : 'text-slate-400'}`}>
            <p className="text-base font-black">{(typeof val1 === 'number' ? val1.toFixed(1) : val1)}{unit}</p>
            {isBetter && <ArrowUpRight size={12}/>}
          </div>
        </div>
        <div className={`text-center transition-all ${!isBetter ? 'scale-105' : 'opacity-60'}`}>
          <div className={`inline-flex items-center gap-1 ${!isBetter ? 'text-emerald-600' : 'text-slate-400'}`}>
            <p className="text-base font-black">{(typeof val2 === 'number' ? val2.toFixed(1) : val2)}{unit}</p>
            {!isBetter && <ArrowUpRight size={12}/>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CityNeighborhoodMap;
