import React, { useEffect, useState, useMemo } from 'react';
import * as echarts from 'echarts';
import ReactECharts from 'echarts-for-react';
import { 
  MapPin, Info, Activity, Banknote, 
  Target, Maximize2, Compass, Layers,
  Calendar, Building2, Filter, ChevronRight,
  TrendingUp, TrendingDown, LayoutGrid, Clock, Sparkles
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

  const [geoData, setGeoData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  
  const [selectedYear, setSelectedYear] = useState('2024');
  const [selectedQuarter, setSelectedQuarter] = useState('all');
  const [selectedPropType, setSelectedPropType] = useState('all');
  const [selectedMetric, setSelectedMetric] = useState<'liquidity' | 'transactions'>('liquidity');
  const [hoveredDistrict, setHoveredDistrict] = useState<any>(null);
  const [selectedDistrict, setSelectedDistrict] = useState<any>(null);

  useEffect(() => {
    if (!cityName) return;
    setLoading(true);
    setError(false);
    setSelectedDistrict(null);
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
    
    const series = features.map((f: any) => {
      const nName = f.properties.name || f.properties.name_ar;
      const nStats = stats[nName] || {};
      
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
        detailedStats: aggregatedStats
      };
    });

    const maxVal = Math.max(...series.map((d: any) => d.value), 1);
    return { series, maxVal };
  }, [geoData, loading, selectedYear, selectedQuarter, selectedPropType, selectedMetric]);

  const mapOption = useMemo(() => {
    if (!geoData || loading) return {};
    const slug = CITY_SLUGS[cityName] || encodeURIComponent(cityName);
    const mapName = `map_${slug}`;

    if (!echarts.getMap(mapName)) return {};

    const safeMaxVal = processedData.maxVal > 0 ? processedData.maxVal : 1;

    return {
      backgroundColor: 'transparent',
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
          emphasis: {
            label: { show: true, color: '#fff', fontWeight: 'bold', fontFamily: CHART_FONT },
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
    <div className="bg-white rounded-[60px] border border-slate-100 shadow-[0_4px_30px_rgba(0,0,0,0.02)] overflow-hidden" dir="rtl">
      {/* ── HEADER ── */}
      <div className="p-10 bg-gradient-to-br from-white to-slate-50/50 border-b border-slate-100">
        <div className="flex flex-col xl:flex-row gap-8 justify-between items-start">
          <div className="flex items-center gap-5">
            <div className="p-4 bg-blue-600 rounded-[28px] text-white shadow-xl shadow-blue-500/20">
              <Layers size={28}/>
            </div>
            <div>
              <h3 className="text-3xl font-black text-slate-900 tracking-tight">رادارات الأحياء الذكية</h3>
              <p className="text-slate-400 text-sm font-bold mt-1 flex items-center gap-2">
                <MapPin size={14} className="text-blue-500"/> تحليل جيو-مكاني متقدم لمدينة {cityName}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 bg-white/80 backdrop-blur p-2 rounded-[32px] border border-slate-200/60 shadow-sm">
            {/* Filter Dropdowns */}
            <div className="flex items-center gap-2 px-4 border-l border-slate-100">
              <Calendar size={16} className="text-slate-400"/>
              <select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)} className="bg-transparent border-none text-sm font-black text-slate-700 focus:ring-0">
                {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>
            <div className="flex items-center gap-2 px-4 border-l border-slate-100">
              <Clock size={16} className="text-slate-400"/>
              <select value={selectedQuarter} onChange={(e) => setSelectedQuarter(e.target.value)} className="bg-transparent border-none text-sm font-black text-slate-700 focus:ring-0">
                {QUARTERS.map(q => <option key={q.id} value={q.id}>{q.label}</option>)}
              </select>
            </div>
            <div className="flex items-center gap-2 px-4 border-l border-slate-100">
              <Building2 size={16} className="text-slate-400"/>
              <select value={selectedPropType} onChange={(e) => setSelectedPropType(e.target.value)} className="bg-transparent border-none text-sm font-black text-slate-700 focus:ring-0">
                {PROP_TYPES.map(pt => <option key={pt.id} value={pt.id}>{pt.label}</option>)}
              </select>
            </div>
            <div className="flex bg-slate-100 p-1 rounded-2xl">
              <button 
                onClick={() => setSelectedMetric('liquidity')}
                className={`px-5 py-2 rounded-xl text-[11px] font-black transition-all ${selectedMetric === 'liquidity' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
              >
                السيولة
              </button>
              <button 
                onClick={() => setSelectedMetric('transactions')}
                className={`px-5 py-2 rounded-xl text-[11px] font-black transition-all ${selectedMetric === 'transactions' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
              >
                الصفقات
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="relative flex flex-col lg:flex-row min-h-[700px] bg-slate-50/30">
        <div className="flex-grow p-4 relative min-h-[600px]">
          {loading ? (
            <div className="absolute inset-0 flex items-center justify-center gap-3 text-slate-400 font-bold z-50 bg-slate-50/80 backdrop-blur">
              <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
              <span>جاري تحميل بيانات {cityName}...</span>
            </div>
          ) : (
            <>
              <ReactECharts 
                onEvents={{
                  mouseover: (params: any) => { if(params.data) setHoveredDistrict(params.data); },
                  mouseout: () => setHoveredDistrict(null),
                  click: (params: any) => { if(params.data) setSelectedDistrict(params.data); }
                }}
                option={mapOption} 
                style={{ height: 650, width: '100%' }} 
                lazyUpdate={true}
              />
              {hoveredDistrict && !selectedDistrict && (
                <div className="absolute top-8 right-8 w-64 bg-slate-900/95 backdrop-blur-xl border border-white/10 p-6 rounded-[32px] shadow-2xl text-white animate-in fade-in slide-in-from-right-4 pointer-events-none z-40 text-right">
                  <h4 className="text-lg font-black mb-4">{hoveredDistrict.name}</h4>
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
          <div className="absolute left-8 bottom-8 text-xs font-black text-slate-400">
            <Maximize2 size={16} className="inline mr-2"/> استخدم عجلة الفأرة للتكبير
          </div>
        </div>

        {/* ── SIDEBAR ── */}
        <div className={`w-full lg:w-[420px] bg-white border-r border-slate-100 p-8 flex flex-col gap-8 transition-all duration-500 ${selectedDistrict ? 'translate-x-0' : 'translate-x-full lg:translate-x-0 lg:opacity-40'}`}>
          {selectedDistrict ? (
            <>
              <div className="space-y-2">
                <h3 className="text-4xl font-black text-slate-900 tracking-tighter">حي {selectedDistrict.name}</h3>
                <p className="text-slate-400 font-bold">{selectedYear} · {QUARTERS.find(q => q.id === selectedQuarter)?.label}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <StatCard icon={Banknote} color="blue" label="السيولة" val={`${selectedDistrict.detailedStats.total_price_M.toFixed(1)}M`} />
                <StatCard icon={Activity} color="emerald" label="الصفقات" val={selectedDistrict.detailedStats.txn_count} />
                <StatCard icon={Target} color="amber" label="موسط السعر" val={`${selectedDistrict.detailedStats.avg_price_M.toFixed(2)}M`} />
                <StatCard icon={LayoutGrid} color="indigo" label="موسط المساحة" val={`${selectedDistrict.detailedStats.avg_area.toFixed(0)}م²`} />
              </div>
              <div className="mt-4 p-8 bg-slate-900 rounded-[40px] text-white">
                <p className="text-slate-400 text-sm leading-relaxed font-medium mb-6">
                   يعتبر حي {selectedDistrict.name} من الأحياء {selectedDistrict.detailedStats.total_price_M > 500 ? 'عالية السيولة' : 'الصاعدة'} في مدينة {cityName}.
                </p>
                <button className="w-full py-4 bg-white text-slate-900 rounded-2xl font-black text-xs hover:bg-blue-400 hover:text-white transition-all shadow-xl">
                   تحميل تقرير الحي الكامل
                </button>
              </div>
              <button onClick={() => setSelectedDistrict(null)} className="text-blue-600 font-bold hover:underline">اختيار حي آخر</button>
            </>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center opacity-40">
               <MapPin size={40} className="mb-4"/>
               <p className="text-slate-900 font-black">اضغط على أي حي لاستعراض التفاصيل</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ icon: Icon, color, label, val }: any) => (
  <div className={`bg-slate-50 p-6 rounded-[32px] border border-slate-100 hover:bg-${color}-50 transition-colors`}>
    <Icon className={`text-${color}-600 mb-3`} size={24}/>
    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
    <p className="text-2xl font-black text-slate-900">{val}</p>
  </div>
);

export default CityNeighborhoodMap;
