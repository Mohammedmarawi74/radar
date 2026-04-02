import React, { useMemo, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import ReactECharts from 'echarts-for-react';
import { 
  Building2, MapPin, TrendingUp, TrendingDown, 
  BarChart3, PieChart, Activity, ArrowUpRight, 
  ArrowDownRight, ChevronRight, Info, Banknote,
  Navigation, Target, Zap, Waves, Sparkles, Home,
  Search, ShieldCheck, Download, Share2
} from 'lucide-react';
import cityDataRaw from '../../data/city_analytics.json';

const CITY_DATA = cityDataRaw as any;
const CHART_FONT = 'IBM Plex Sans Arabic';

// --- Premium Palette ---
const PALETTE = [
  '#3b82f6', // Bright Blue
  '#10b981', // Emerald
  '#f59e0b', // Amber
  '#8b5cf6', // Violet
  '#ec4899', // Pink
  '#06b6d4'  // Cyan
];

const CityAnalytics: React.FC = () => {
  const { cityName } = useParams<{ cityName: string }>();
  const city = cityName ? CITY_DATA[cityName] : null;

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [cityName]);

  const yearlyOption = useMemo(() => {
    if (!city) return {};
    return {
      backgroundColor: 'transparent',
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'line', lineStyle: { color: 'rgba(59, 130, 246, 0.4)', width: 2, type: 'dashed' } },
        backgroundColor: 'rgba(15, 23, 42, 0.95)',
        borderColor: 'rgba(59, 130, 246, 0.2)',
        borderWidth: 1,
        padding: [12, 16],
        textStyle: { color: '#fff', fontFamily: CHART_FONT, fontSize: 13 },
        formatter: (params: any) => {
          const p = params[0];
          return `<div style="text-align:right">
            <div style="font-weight:bold;margin-bottom:4px;color:#93c5fd">${p.name}</div>
            <div style="font-size:16px;font-weight:900"> مليار ${p.value.toFixed(1)} <span style="font-size:10px;font-weight:bold;color:#94a3b8">ريال</span></div>
          </div>`;
        }
      },
      grid: { left: 40, right: 20, top: 20, bottom: 40 },
      xAxis: {
        type: 'category',
        data: city.yearly_trend.categories,
        axisLine: { lineStyle: { color: 'rgba(148, 163, 184, 0.2)' } },
        axisLabel: { color: '#64748b', fontFamily: CHART_FONT, fontWeight: 'bold' }
      },
      yAxis: {
        type: 'value',
        splitLine: { lineStyle: { color: 'rgba(226, 232, 240, 0.6)', type: 'dashed' } },
        axisLabel: { color: '#94a3b8', fontFamily: CHART_FONT, formatter: '{value}B' }
      },
      series: [{
        name: 'السيولة',
        type: 'line',
        smooth: true,
        data: city.yearly_trend.liquidity_B,
        symbol: 'circle',
        symbolSize: 10,
        itemStyle: { color: '#2563eb', borderWidth: 3, borderColor: '#fff' },
        lineStyle: { width: 5, shadowBlur: 15, shadowColor: 'rgba(37, 99, 235, 0.4)', shadowOffsetY: 8 },
        areaStyle: {
          color: {
            type: 'linear', x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(37, 99, 235, 0.15)' },
              { offset: 1, color: 'rgba(37, 99, 235, 0)' }
            ]
          }
        }
      }]
    };
  }, [city]);

  const mixOption = useMemo(() => {
    if (!city) return {};
    return {
      tooltip: { trigger: 'item', backgroundColor: '#0f172a', textStyle: { color: '#fff', fontFamily: CHART_FONT } },
      series: [{
        type: 'pie',
        radius: ['55%', '85%'],
        center: ['50%', '50%'],
        avoidLabelOverlap: true,
        itemStyle: { borderRadius: 12, borderColor: '#fff', borderWidth: 4 },
        label: { show: false },
        emphasis: { 
          scale: true,
          label: { show: false }
        },
        data: city.property_mix.map((m: any, i: number) => ({
          name: m.name,
          value: m.price_B,
          itemStyle: { color: PALETTE[i % PALETTE.length] }
        }))
      }]
    };
  }, [city]);

  if (!city) return null;

  return (
    <div className="min-h-screen bg-slate-50 font-['IBM_Plex_Sans_Arabic'] pb-24" dir="rtl">
      
      {/* ── PRE-HERO: BREADCRUMBS ── */}
      <div className="bg-slate-900 pt-8 px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 text-slate-400 text-xs font-bold bg-white/5 px-4 py-2 rounded-full border border-white/10 backdrop-blur-md">
            <Link to="/" className="hover:text-blue-400 transition-colors flex items-center gap-1"><Home size={12}/> الرئيسية</Link>
            <ChevronRight size={12} className="opacity-30" />
            <span className="text-blue-400">تحليل مدينة {cityName}</span>
          </div>
          <div className="flex gap-2">
            <button className="p-2.5 bg-white/5 border border-white/10 rounded-xl text-slate-400 hover:bg-white/10 hover:text-white transition-all"><Share2 size={16}/></button>
            <button className="p-2.5 bg-white/5 border border-white/10 rounded-xl text-slate-400 hover:bg-white/10 hover:text-white transition-all"><Download size={16}/></button>
          </div>
        </div>
      </div>

      {/* ── HERO SECTION: THE CROWN JEWEL ── */}
      <div className="bg-slate-900 relative overflow-hidden pt-12 pb-24">
        {/* Animated Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[60%] bg-blue-600/10 blur-[100px] rounded-full animate-pulse"></div>
          <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[50%] bg-indigo-600/10 blur-[100px] rounded-full delay-1000 animate-pulse"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-px bg-gradient-to-r from-transparent via-white/5 to-transparent"></div>
        </div>

        <div className="max-w-7xl mx-auto px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-8 flex flex-col gap-6">
              <div className="flex items-center gap-4">
                <div className="relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-[32px] blur opacity-30 group-hover:opacity-60 transition duration-1000"></div>
                  <div className="relative w-24 h-24 bg-slate-900 border border-white/10 rounded-[30px] flex items-center justify-center shadow-2xl">
                    <Building2 size={48} className="text-blue-500 transform group-hover:scale-110 transition-transform duration-500" />
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="bg-blue-500/20 text-blue-300 text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-full border border-blue-500/30">Strategic Hub</span>
                    <span className="flex items-center gap-1 text-slate-500 text-[10px] font-bold">
                       <Activity size={12}/> عينة التحليل: {city.stats.txn_count.toLocaleString()} صفقة
                    </span>
                  </div>
                  <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-white drop-shadow-sm">
                    استشراف <span className="text-transparent bg-clip-text bg-gradient-to-l from-blue-400 via-indigo-300 to-white">مستقبل {cityName}</span>
                  </h1>
                </div>
              </div>
              <p className="text-slate-400 text-lg leading-relaxed max-w-2xl font-medium">
                تحليل استراتيجي لمسار السيولة والفرص العقارية الواعدة في مدينة {cityName}. نقدم لك بيانات دقيقة مدعومة بأتمتة MySQL واتجاهات السوق التاريخية.
              </p>
            </div>

            <div className="lg:col-span-4 flex flex-col gap-4">
               {/* Growth Pulse Badge */}
               <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[40px] p-8 flex flex-col items-center justify-center relative group select-none">
                  <div className="absolute top-4 left-4 text-white/5"><Sparkles size={40}/></div>
                  <div className={`text-6xl font-black tracking-tighter mb-2 ${city.growth_index >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {city.growth_index > 0 ? '+' : ''}{city.growth_index}%
                  </div>
                  <p className="text-slate-500 text-xs font-black uppercase tracking-widest mb-4">CITY GROWTH INDEX</p>
                  <div className={`flex items-center gap-2 px-6 py-2 rounded-full font-black text-xs ${city.growth_index >= 0 ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'}`}>
                    {city.growth_index >= 0 ? <ArrowUpRight size={16}/> : <ArrowDownRight size={16}/>}
                    {city.growth_index >= 10 ? 'بيئة نمو خارقة' : city.growth_index >= 0 ? 'استقرار متنامٍ' : 'ترقب استراتيجي'}
                  </div>
               </div>
            </div>

          </div>
        </div>
      </div>

      {/* ── DYNAMIC CONTENT: DATA GRID ── */}
      <div className="max-w-7xl mx-auto px-8 -mt-16 relative z-30">
        
        {/* KPI CARDS: Bento Glass Style */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { label: 'صافي السيولة', val: city.stats.total_price_B.toFixed(1) + ' مليار', icon: Banknote, color: 'blue', sub: 'سوق ملياري ضخم' },
            { label: 'كثافة الصفقات', val: city.stats.txn_count.toLocaleString(), icon: Waves, color: 'indigo', sub: 'نشاط تشغيلي عالٍ' },
            { label: 'متوسط المتر', val: city.stats.price_per_sqm.toFixed(0), icon: Target, color: 'amber', sub: 'ريال لكل متر مربع' },
            { label: 'جودة الاستثمار', val: city.growth_index + 'x', icon: ShieldCheck, color: 'emerald', sub: 'تصنيف آمن ومستقر' },
          ].map((k, i) => (
            <div key={i} className="relative group bg-white hover:bg-slate-50 border border-slate-100 p-8 rounded-[48px] shadow-[0_20px_50px_rgba(30,41,59,0.05)] transition-all duration-500 hover:-translate-y-2">
              <div className={`w-14 h-14 bg-${k.color}-500/5 rounded-2xl flex items-center justify-center text-${k.color}-600 mb-6 group-hover:scale-110 transition-transform`}>
                <k.icon size={26} strokeWidth={2.5}/>
              </div>
              <h3 className="text-3xl font-black text-slate-900 tracking-tight mb-1">{k.val}</h3>
              <p className="text-xs font-black text-slate-400 uppercase tracking-widest">{k.label}</p>
              <div className="mt-4 pt-4 border-t border-slate-50 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span>
                <span className="text-[10px] font-bold text-slate-400">{k.sub}</span>
              </div>
            </div>
          ))}
        </div>

        {/* MAIN ANALYTICS: GRID 12 */}
        <div className="mt-12 grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Trend Chart (Large) */}
          <div className="lg:col-span-8 bg-white p-10 rounded-[60px] border border-slate-100 shadow-[0_4px_30px_rgba(0,0,0,0.02)]">
            <div className="flex items-center justify-between mb-10">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-50 rounded-2xl text-blue-600"><TrendingUp size={24}/></div>
                <div>
                  <h3 className="text-2xl font-black text-slate-900 tracking-tight">مسار السيولة الاستراتيجي</h3>
                  <p className="text-slate-400 text-sm font-bold mt-0.5">خط زمني ممتد لـ 5 سنوات (بالمليارات)</p>
                </div>
              </div>
              <div className="flex gap-2">
                {city.yearly_trend.categories.slice(-2).map(y => (
                  <div key={y} className="bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100 text-[10px] font-black">{y}</div>
                ))}
              </div>
            </div>
            <ReactECharts option={yearlyOption} style={{ height: 400 }} />
          </div>

          {/* Property Mix (Compact) */}
          <div className="lg:col-span-4 space-y-8">
            <div className="bg-white p-10 rounded-[60px] border border-slate-100 shadow-[0_4px_30px_rgba(0,0,0,0.02)] relative overflow-hidden group">
              <div className="relative z-10">
                <h3 className="text-xl font-black text-slate-900 mb-2">هيكل المحفظة</h3>
                <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-8">Asset Allocation</p>
                
                <div className="relative flex justify-center items-center">
                  <ReactECharts option={mixOption} style={{ height: 280, width: '100%' }} />
                  <div className="absolute inset-x-0 inset-y-0 flex flex-col items-center justify-center pointer-events-none">
                    <p className="text-2xl font-black text-slate-900">%{city.property_mix[0]?.pct.toFixed(0)}</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{city.property_mix[0]?.name}</p>
                  </div>
                </div>

                <div className="space-y-3 mt-8">
                  {city.property_mix.slice(0, 3).map((m: any, i: number) => (
                    <div key={i} className="flex items-center justify-between p-4 rounded-3xl bg-slate-50 border border-slate-50 hover:bg-slate-100 transition-all cursor-pointer">
                      <div className="flex items-center gap-3">
                        <div className="w-2.5 h-2.5 rounded-full" style={{ background: PALETTE[i % PALETTE.length] }} />
                        <span className="text-xs font-black text-slate-700">{m.name}</span>
                      </div>
                      <span className="text-xs font-black text-slate-900">%{m.pct.toFixed(1)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Price Brackets - Full Width Bento */}
          <div className="lg:col-span-12 bg-slate-900 p-12 rounded-[70px] overflow-hidden relative shadow-2xl">
            {/* Background design */}
            <div className="absolute bottom-0 right-0 p-12 opacity-5 scale-150 rotate-12"><Zap size={200}/></div>
            
            <div className="relative z-10 flex flex-col lg:flex-row gap-12 items-center">
              <div className="lg:w-1/3">
                <div className="w-16 h-16 bg-blue-500 rounded-3xl flex items-center justify-center mb-6 shadow-xl shadow-blue-500/40">
                  <Banknote size={32} className="text-white" />
                </div>
                <h3 className="text-4xl font-black text-white mb-4 tracking-tighter">تدرج الثروة العقارية</h3>
                <p className="text-slate-400 text-lg leading-relaxed font-medium">
                  يوضح هذا الرسم توزيع السيولة حسب القدرة الشرائية للمستثمرين في {cityName}. الفهم الدقيق لهذه الطبقات هو مفتاح النجاح لأي مطور عقاري.
                </p>
              </div>
              <div className="lg:w-2/3 grid grid-cols-2 md:grid-cols-5 gap-4 w-full">
                {city.price_ranges.map((r:any, i:number) => (
                  <div key={i} className="bg-white/5 border border-white/10 p-6 rounded-[32px] flex flex-col items-center justify-center text-center hover:bg-white/10 transition-all border group">
                    <p className="text-3xl font-black text-white mb-2 group-hover:scale-110 transition-transform">{r.value > 1000 ? (r.value/1000).toFixed(1)+'k' : r.value}</p>
                    <p className="text-slate-400 text-[10px] font-black uppercase tracking-tight leading-tight">{r.name}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Strategic Insight Card */}
          <div className="lg:col-span-12 bg-gradient-to-r from-blue-600 to-indigo-700 p-1 rounded-[60px] shadow-2xl overflow-hidden shadow-blue-500/20">
            <div className="bg-white p-12 rounded-[59px] flex flex-col md:flex-row items-center gap-10">
              <div className="w-24 h-24 bg-blue-100 rounded-[35px] flex items-center justify-center shrink-0">
                <Sparkles size={40} className="text-blue-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-3xl font-black text-slate-900 tracking-tight mb-2">توصية رادار المستثمر الذكية</h3>
                <p className="text-slate-500 text-lg leading-relaxed font-medium">
                  بناءً على زخم الصفقات الأخير في مدينة {cityName}، نجد أن القطاع <span className="text-blue-600 font-black">{city.property_mix[0]?.name}</span> هو الحصان الرابح حالياً. نوصي المستثمرين بالتركيز على النطاق السعري <span className="font-black text-slate-800">"{city.price_ranges[0]?.name}"</span> نظراً لارتفاع الطلب السلوكي فيه.
                </p>
              </div>
              <button className="bg-slate-900 text-white px-10 py-5 rounded-3xl font-black text-lg hover:bg-blue-600 tracking-tight shadow-xl shadow-slate-900/20 transition-all active:scale-95">
                تفعيل تنبيهات {cityName}
              </button>
            </div>
          </div>

        </div>

      </div>

      {/* FOOTER SPACING */}
      <div className="mt-24 h-1 border-t border-slate-100"></div>

    </div>
  );
};

export default CityAnalytics;
