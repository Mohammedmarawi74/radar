import React, { useMemo, useEffect, useRef, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import ReactECharts from 'echarts-for-react';
import { 
  Building2, MapPin, TrendingUp, TrendingDown, 
  BarChart3, PieChart, Activity, ArrowUpRight, 
  ArrowDownRight, ChevronRight, Info, Banknote,
  Navigation, Target, Zap, Waves, Sparkles, Home,
  Search, ShieldCheck, Download, Share2, Layers,
  Globe, Compass
} from 'lucide-react';
import cityDataRaw from '../../data/city_analytics.json';
import CityNeighborhoodMap from './CityNeighborhoodMap';
import { useChartResize } from '../hooks/useChartResize';

const CITY_DATA = cityDataRaw as any;
const CHART_FONT = 'IBM Plex Sans Arabic';

const CityAnalytics: React.FC = () => {
  const { cityName } = useParams<{ cityName: string }>();
  const city = cityName ? CITY_DATA[cityName] : null;
  const [isReady, setIsReady] = useState(false);

  // Refs for manual resize triggers (fixing the "squashed chart" bug)
  const yearlyRef = useRef<any>(null);
  const mixRef = useRef<any>(null);

  // Apply the smart resizing hook
  useChartResize(yearlyRef, cityName);
  useChartResize(mixRef, cityName);

  // Scroll to top and delay rendering slightly to ensure layout is stable
  useEffect(() => {
    window.scrollTo(0, 0);
    setIsReady(false);
    const timer = setTimeout(() => setIsReady(true), 150);
    return () => clearTimeout(timer);
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
      xAxis: {
        type: 'category',
        data: city.yearly_trend.categories,
        axisLine: { lineStyle: { color: 'rgba(148, 163, 184, 0.2)' } },
        axisLabel: { color: '#64748b', fontFamily: CHART_FONT, fontWeight: 'bold' }
      },
      grid: { left: '3%', right: '4%', bottom: '3%', top: '12%', containLabel: true },
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
        emphasis: { label: { show: false } },
        data: city.property_mix.map((m: any, i: number) => ({
          value: m.pct,
          name: m.name,
          itemStyle: { color: i === 0 ? '#3b82f6' : i === 1 ? '#10b981' : i === 2 ? '#f59e0b' : '#8b5cf6' }
        }))
      }]
    };
  }, [city]);

  if (!city) return null;

  return (
    <div className="min-h-screen bg-slate-50/50 pb-12 overflow-x-hidden pt-1 space-y-4">
      {/* ── HERO SECTION ── */}
      <div className="relative bg-[#0b1121] border-b border-white/5 pt-6 pb-4 overflow-hidden mb-6">
        {/* Background Effects */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[50%] bg-blue-600/10 blur-[100px] rounded-full animate-pulse"></div>
          <div className="absolute bottom-[-10%] left-[-10%] w-[30%] h-[40%] bg-indigo-600/10 blur-[100px] rounded-full delay-1000 animate-pulse"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-px bg-gradient-to-r from-transparent via-white/5 to-transparent"></div>
        </div>

        <div className="max-w-7xl mx-auto px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 flex flex-col gap-3 text-right">
              <div className="flex items-center gap-3">
                <div className="relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-[20px] blur opacity-30 group-hover:opacity-60 transition duration-1000"></div>
                  <div className="relative w-12 h-12 bg-slate-900 border border-white/10 rounded-xl flex items-center justify-center shadow-2xl">
                    <Building2 className="text-blue-500 transform group-hover:scale-110 transition-transform duration-500" size={24}/>
                  </div>
                </div>
                <div>
                  <div className="flex flex-row items-center gap-2 mb-1">
                    <span className="bg-blue-500/20 text-blue-300 text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border border-blue-500/30">Strategic Hub</span>
                    <span className="flex flex-row items-center gap-1 text-slate-500 text-[8px] font-bold">
                       <Activity size={10}/> عينة التحليل: {city.stats.txn_count.toLocaleString()} صفقة
                    </span>
                  </div>
                  <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white drop-shadow-sm">
                    استشراف <span className="text-transparent bg-clip-text bg-gradient-to-l from-blue-400 via-indigo-300 to-white">مستقبل {cityName}</span>
                  </h1>
                </div>
              </div>
              <p className="text-slate-400 text-[11px] leading-relaxed max-w-lg font-medium opacity-90">
                تحليل استراتيجي لمسار السيولة والفرص العقارية الواعدة في {cityName}. نقدم لك بيانات دقيقة مدعومة بأتمتة MySQL واتجاهات السوق التاريخية.
              </p>
            </div>

            <div className="lg:col-span-4 flex flex-col gap-4">
              <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[24px] p-5 flex flex-col items-center justify-center relative group select-none max-w-[200px] mx-auto lg:mr-auto lg:ml-0">
                <div className="absolute top-3 left-3 text-white/5">
                   <Sparkles size={20}/>
                </div>
                <div className="text-3xl font-black tracking-tighter mb-0.5 text-emerald-400">+{city.growth_index}%</div>
                <p className="text-slate-500 text-[8px] font-black uppercase tracking-widest mb-2.5">GROWTH INDEX</p>
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full font-black text-[8px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                   <ArrowUpRight size={10}/> نمو خارق
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── DYNAMIC CONTENT: DATA GRID ── */}
      <div className="max-w-7xl mx-auto px-8 mt-6 relative z-30">
        
        {/* --- INTERACTIVE NEIGHBORHOOD MAP --- */}
        <div className="mt-0">
          <CityNeighborhoodMap cityName={cityName || ''} />
        </div>

        {/* MAIN ANALYTICS: GRID 12 */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Trend Chart (Large) - Refructured for Max Stability */}
          <div className="lg:col-span-8 bg-white p-6 rounded-[32px] border border-slate-100 shadow-[0_4px_30px_rgba(0,0,0,0.02)] min-w-0 flex flex-col h-[480px]">
            <div className="flex-shrink-0 flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-blue-50 rounded-xl text-blue-600"><TrendingUp size={20}/></div>
                <div>
                  <h3 className="text-xl font-black text-slate-900 tracking-tight">مسار السيولة الاستراتيجي</h3>
                  <p className="text-slate-400 text-xs font-bold mt-0.5">خط زمني ممتد لـ 5 سنوات (بالمليارات)</p>
                </div>
              </div>
              <div className="flex gap-1.5">
                {city.yearly_trend.categories.slice(-2).map((y: any) => (
                  <div key={y} className="bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-100 text-[9px] font-black">{y}</div>
                ))}
              </div>
            </div>
            
            {/* The Plot Area - Highly Responsive Wrapper */}
            <div className="flex-grow w-full relative min-h-0">
              {isReady ? (
                <ReactECharts 
                  ref={yearlyRef}
                  option={yearlyOption} 
                  style={{ height: '100%', width: '100%' }} 
                  notMerge={true}
                  lazyUpdate={true}
                  opts={{ renderer: 'svg' }}
                />
              ) : (
                <div className="w-full h-full bg-slate-50 rounded-2xl animate-pulse flex items-center justify-center">
                  <div className="text-slate-300 font-bold text-sm">جاري معالجة البيانات...</div>
                </div>
              )}
            </div>
          </div>

          {/* Property Mix (Compact) */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-[0_4px_30px_rgba(0,0,0,0.02)] relative overflow-hidden group h-full">
              <div className="relative z-10 h-full flex flex-col">
                <h3 className="text-lg font-black text-slate-900 mb-1">هيكل المحفظة</h3>
                <p className="text-slate-400 text-[9px] font-black uppercase tracking-widest mb-6">Asset Allocation</p>
                
                <div className="relative flex-grow flex justify-center items-center min-h-[200px]">
                  {isReady && (
                    <>
                      <ReactECharts 
                        ref={mixRef}
                        option={mixOption} 
                        style={{ height: '100%', width: '100%' }} 
                        notMerge={true}
                        lazyUpdate={true}
                        opts={{ renderer: 'svg' }}
                      />
                      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                        <p className="text-xl font-black text-slate-900">%{city.property_mix[0]?.pct.toFixed(0)}</p>
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">{city.property_mix[0]?.name}</p>
                      </div>
                    </>
                  )}
                </div>

                <div className="space-y-2 mt-auto pt-6">
                  {city.property_mix.slice(0, 3).map((m: any, i: number) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-50 hover:bg-slate-100 transition-all cursor-pointer">
                      <div className="flex items-center gap-2.5">
                        <div className="w-2 h-2 rounded-full" style={{ background: i === 0 ? '#3b82f6' : i === 1 ? '#10b981' : i === 2 ? '#f59e0b' : '#8b5cf6' }} />
                        <span className="text-[11px] font-black text-slate-700">{m.name}</span>
                      </div>
                      <span className="text-[11px] font-black text-slate-900">%{m.pct.toFixed(1)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* KPI CARDS: Repositioned under the charts */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'صافي السيولة', val: city.stats.total_price_B.toFixed(1) + ' مليار', icon: Banknote, color: 'blue', sub: 'سوق ملياري ضخم' },
            { label: 'كثافة الصفقات', val: city.stats.txn_count.toLocaleString(), icon: Waves, color: 'indigo', sub: 'نشاط تشغيلي عالٍ' },
            { label: 'متوسط المتر', val: city.stats.price_per_sqm.toFixed(0), icon: Target, color: 'amber', sub: 'ريال لكل متر مربع' },
            { label: 'جودة الاستثمار', val: city.growth_index + 'x', icon: ShieldCheck, color: 'emerald', sub: 'تصنيف آمن ومستقر' },
          ].map((k, i) => (
            <div key={i} className="group relative bg-white border border-slate-200/60 p-4 rounded-2xl shadow-[0_8px_16px_-6px_rgba(0,0,0,0.05)] hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500 hover:-translate-y-1 hover:border-blue-500/30 overflow-hidden">
              {/* Decorative Accent */}
              <div className={`absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-${k.color}-500 to-transparent opacity-40 group-hover:opacity-100 transition-opacity`}></div>
              
              <div className="flex items-center justify-between mb-3">
                <div className={`w-9 h-9 bg-${k.color}-500/10 rounded-xl flex items-center justify-center text-${k.color}-600 group-hover:scale-110 transition-transform duration-500`}>
                  <k.icon size={16} strokeWidth={2.5}/>
                </div>
                <div className={`px-1.5 py-0.5 rounded-full bg-${k.color}-500/10 text-${k.color}-700 text-[7px] font-black uppercase tracking-tighter opacity-0 group-hover:opacity-100 transition-opacity`}>
                   LIVE
                </div>
              </div>
              <h3 className="text-base font-black text-slate-900 tracking-tight mb-0.5 leading-none">{k.val}</h3>
              <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest leading-none">{k.label}</p>
              <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center gap-1.5">
                <span className={`w-1 h-1 rounded-full bg-${k.color}-500 animate-pulse`}></span>
                <span className="text-[8px] font-bold text-slate-600 truncate">{k.sub}</span>
              </div>
            </div>
          ))}
        </div>

        {/* --- WEALTH GRADIENT SECTION --- */}
        <div className="mt-8 relative bg-slate-900 rounded-[32px] p-8 overflow-hidden shadow-2xl border border-white/5 group">
          <div className="absolute bottom-0 right-0 p-8 opacity-5 scale-150 rotate-12 group-hover:rotate-0 transition-transform duration-1000">
            <Zap size={100} className="text-white"/>
          </div>
          <div className="relative z-10 flex flex-col lg:flex-row gap-8 items-center">
            <div className="lg:w-1/3">
              <div className="w-10 h-10 bg-blue-500 rounded-[14px] flex items-center justify-center mb-3 shadow-xl shadow-blue-500/40 transform group-hover:scale-110 transition-transform">
                <Banknote className="text-white" size={20}/>
              </div>
              <h3 className="text-xl font-black text-white mb-2 tracking-tighter">تدرج الثروة العقارية</h3>
              <p className="text-slate-400 text-xs leading-relaxed font-medium">
                يوضح هذا الرسم توزيع السيولة حسب القدرة الشرائية للمستثمرين في {cityName}. الفهم الدقيق لهذه الطبقات هو مفتاح النجاح لأي مطور عقاري.
              </p>
            </div>
            
            <div className="lg:w-2/3 grid grid-cols-2 md:grid-cols-5 gap-3 w-full">
              {[
                { val: '70.2k', label: '1-3 مليون' },
                { val: '17.0k', label: '3-10 مليون' },
                { val: '90.9k', label: '500ألف-1مليون' },
                { val: '114.4k', label: 'أقل من 500ألف' },
                { val: '4.7k', label: 'أكثر من 10مليون' },
              ].map((item, idx) => (
                <div key={idx} className="bg-white/5 border border-white/10 p-4 rounded-2xl flex flex-col items-center justify-center text-center hover:bg-white/10 hover:border-white/20 transition-all group/stat">
                  <p className="text-lg font-black text-white mb-0.5 group-hover/stat:scale-110 transition-transform tracking-tight">{item.val}</p>
                  <p className="text-slate-400 text-[9px] font-black uppercase tracking-tight leading-tight">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* --- SMART RECOMMENDATION --- */}
        <div className="mt-6 mb-8 bg-white border border-slate-100 p-6 rounded-[32px] flex flex-col md:flex-row items-center gap-8 shadow-[0_8px_30px_rgba(0,0,0,0.02)] hover:shadow-xl transition-all border border-slate-100 group">
          <div className="w-16 h-16 bg-blue-50 rounded-[24px] flex items-center justify-center shrink-0 group-hover:rotate-12 transition-transform duration-500">
            <Sparkles className="text-blue-600" size={28}/>
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-black text-slate-900 tracking-tight mb-1.5 flex items-center gap-2">
              توصية رادار المستثمر الذكية
              <span className="bg-blue-600 text-white text-[8px] font-black px-2 py-0.5 rounded-full animate-pulse">AI ADVISOR</span>
            </h3>
            <p className="text-slate-500 text-sm leading-relaxed font-medium">
              بناءً على زخم الصفقات الأخير في مدينة {cityName}، نجد أن القطاع <span className="text-blue-600 font-black">سكني</span> هو الحصان الرابح حالياً. نوصي المستثمرين بالتركيز على النطاق السعري <span className="font-black text-slate-800">"1-3 مليون"</span> نظراً لارتفاع الطلب السلوكي فيه.
            </p>
          </div>
          <div className="shrink-0 w-full md:w-auto">
            <button className="w-full px-10 py-4 bg-slate-900 text-white rounded-[18px] font-black text-xs hover:bg-blue-600 hover:-translate-y-1 transition-all shadow-lg shadow-slate-900/10">التفاصيل الكاملة</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CityAnalytics;
