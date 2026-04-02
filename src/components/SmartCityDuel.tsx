import React, { useState, useMemo } from 'react';
import ReactECharts from 'echarts-for-react';
import { 
  Building2, ArrowRightLeft, TrendingUp, TrendingDown, 
  Target, Banknote, Activity, ShieldCheck, 
  MapPin, ChevronDown, Sparkles, LayoutDashboard,
  Crown, Info, Download, Share2
} from 'lucide-react';
import cityDataRaw from '../../data/city_analytics.json';

const CITY_DATA = cityDataRaw as any;
const CITIES = Object.keys(CITY_DATA);
const CHART_FONT = 'IBM Plex Sans Arabic';

const SmartCityDuel: React.FC = () => {
  const [city1Name, setCity1Name] = useState('الرياض');
  const [city2Name, setCity2Name] = useState('جدة');
  const [selectedYear, setSelectedYear] = useState('2024');
  const [selectedPropType, setSelectedPropType] = useState('all');

  const c1 = CITY_DATA[city1Name];
  const c2 = CITY_DATA[city2Name];

  // --- KPI Comparison Logic ---
  const compare = (v1: number, v2: number, lowerIsBetter = false) => {
    if (v1 === v2) return 'equal';
    if (lowerIsBetter) return v1 < v2 ? 'win' : 'loss';
    return v1 > v2 ? 'win' : 'loss';
  };

  // --- ECharts Options ---
  const radarOption = useMemo(() => ({
    backgroundColor: 'transparent',
    radar: {
      indicator: [
        { name: 'السيولة', max: Math.max(c1.stats.total_price_B, c2.stats.total_price_B) * 1.1 },
        { name: 'النشاط', max: Math.max(c1.stats.txn_count, c2.stats.txn_count) * 1.1 },
        { name: 'النمو %', max: 60 },
        { name: 'المتر', max: Math.max(c1.stats.price_per_sqm, c2.stats.price_per_sqm) * 1.1 },
        { name: 'الاستقرار', max: 5 }
      ],
      shape: 'polygon',
      splitNumber: 5,
      axisName: { color: '#64748b', fontFamily: CHART_FONT, fontWeight: 'bold' },
      splitLine: { lineStyle: { color: 'rgba(59, 130, 246, 0.1)' } },
      splitArea: { areaStyle: { color: ['rgba(255,255,255,0.05)', 'rgba(59,130,246,0.02)'] } }
    },
    series: [{
      name: 'City Comparison',
      type: 'radar',
      data: [
        {
          value: [c1.stats.total_price_B, c1.stats.txn_count, c1.growth_index, c1.stats.price_per_sqm, 4],
          name: city1Name,
          itemStyle: { color: '#2563eb' },
          areaStyle: { color: 'rgba(37, 99, 235, 0.3)' }
        },
        {
          value: [c2.stats.total_price_B, c2.stats.txn_count, c2.growth_index, c2.stats.price_per_sqm, 3.5],
          name: city2Name,
          itemStyle: { color: '#f59e0b' },
          areaStyle: { color: 'rgba(245, 158, 11, 0.3)' }
        }
      ]
    }]
  }), [c1, c2, city1Name, city2Name]);

  const trendOption = useMemo(() => ({
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    legend: { data: [city1Name, city2Name], bottom: 0, textStyle: { fontFamily: CHART_FONT } },
    grid: { left: '3%', right: '4%', top: '10%', bottom: '15%', containLabel: true },
    xAxis: { type: 'category', data: c1.yearly_trend.categories, axisLine: { show: false } },
    yAxis: { type: 'value', splitLine: { lineStyle: { type: 'dashed' } } },
    series: [
      {
        name: city1Name,
        type: 'bar',
        data: c1.yearly_trend.liquidity_B,
        itemStyle: { borderRadius: [8, 8, 0, 0], color: '#2563eb' }
      },
      {
        name: city2Name,
        type: 'bar',
        data: c2.yearly_trend.liquidity_B,
        itemStyle: { borderRadius: [8, 8, 0, 0], color: '#f59e0b' }
      }
    ]
  }), [c1, c2, city1Name, city2Name]);

  return (
    <div className="min-h-screen bg-slate-50 font-['IBM_Plex_Sans_Arabic'] pb-24" dir="rtl">
      
      {/* ── HEADER & SELECTORS ── */}
      <div className="bg-slate-900 pt-16 pb-32 px-8 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <div className="absolute top-[10%] right-[10%] w-[40%] h-[40%] bg-blue-500 blur-[120px] rounded-full"></div>
          <div className="absolute bottom-[10%] left-[10%] w-[30%] h-[30%] bg-amber-500 blur-[120px] rounded-full"></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex-1 w-full">
              <p className="text-blue-400 text-xs font-black uppercase tracking-widest mb-4">CITY DUEL ENGINE</p>
              <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter mb-4">
                 المقارنة <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-300">الذكية للمدن</span>
              </h1>
              <p className="text-slate-400 text-lg font-medium max-w-xl leading-relaxed">
                حلل وفاضل بين الفرص الاستثمارية في كبرى المدن السعودية باستخدام بيانات السيولة الحقيقية ونبض السوق اللحظي.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-4 bg-white/5 backdrop-blur-3xl p-4 rounded-[40px] border border-white/10 shadow-2xl">
               <div className="flex items-center gap-2">
                 <CitySelector value={city1Name} onChange={setCity1Name} color="blue" />
                 <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white/40 font-black text-[10px]">VS</div>
                 <CitySelector value={city2Name} onChange={setCity2Name} color="amber" />
               </div>
               
               <div className="h-10 w-px bg-white/10 mx-2 hidden lg:block"></div>
               
               <div className="flex items-center gap-3">
                 <select 
                    value={selectedYear} 
                    onChange={(e) => setSelectedYear(e.target.value)}
                    className="bg-white/5 border border-white/10 text-white text-xs font-black px-4 py-3 rounded-xl focus:outline-none hover:bg-white/10 transition-all"
                 >
                    {['2024', '2023', '2022', '2021', '2020'].map(y => <option key={y} value={y} className="text-slate-900">{y}</option>)}
                 </select>

                 <select 
                    value={selectedPropType} 
                    onChange={(e) => setSelectedPropType(e.target.value)}
                    className="bg-white/5 border border-white/10 text-white text-xs font-black px-4 py-3 rounded-xl focus:outline-none hover:bg-white/10 transition-all"
                 >
                    <option value="all" className="text-slate-900">كافة العقارات</option>
                    <option value="سكني" className="text-slate-900">سكني</option>
                    <option value="تجاري" className="text-slate-900">تجاري</option>
                 </select>
               </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── MAIN CONTENT GRID ── */}
      <div className="max-w-7xl mx-auto px-8 -mt-16 relative z-20">
        
        {/* KPI Battle Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
           <ComparisonCard 
              icon={Banknote} title="صافي السيولة" unit="B"
              val1={c1.stats.total_price_B} val2={c2.stats.total_price_B}
              city1={city1Name} city2={city2Name}
           />
           <ComparisonCard 
              icon={Activity} title="حجم الصفقات"
              val1={c1.stats.txn_count} val2={c2.stats.txn_count}
              city1={city1Name} city2={city2Name}
           />
           <ComparisonCard 
              icon={TrendingUp} title="مؤشر النمو" unit="%"
              val1={c1.growth_index} val2={c2.growth_index}
              city1={city1Name} city2={city2Name}
           />
           <ComparisonCard 
              icon={Target} title="متر المنطقة" unit="SR"
              val1={c1.stats.price_per_sqm} val2={c2.stats.price_per_sqm}
              city1={city1Name} city2={city2Name}
           />
        </div>

        {/* Deep Analysis Pair */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-12">
           
           {/* Visual Radar Duel */}
           <div className="lg:col-span-12 bg-white p-12 rounded-[60px] border border-slate-100 shadow-xl overflow-hidden relative group">
              <div className="flex flex-col lg:flex-row gap-12 items-center">
                 <div className="lg:w-1/3">
                    <div className="p-4 bg-slate-900 rounded-3xl text-white inline-block mb-6 shadow-xl"><ArrowRightLeft size={32}/></div>
                    <h3 className="text-3xl font-black text-slate-900 tracking-tight mb-4">بصمة الاستثمار</h3>
                    <p className="text-slate-400 text-lg leading-relaxed font-medium mb-8">
                       يوضح مخطط الرادار توازن القوى بين المدينتين. كلما زادت المساحة الملونة، زادت شمولية التفوق الاستثماري لهذه المدينة في معايير رادار.
                    </p>
                    <div className="flex flex-col gap-4">
                       <LegendItem color="bg-blue-600" label={city1Name} />
                       <LegendItem color="bg-amber-500" label={city2Name} />
                    </div>
                 </div>
                 <div className="lg:w-2/3 w-full h-[500px]">
                    <ReactECharts option={radarOption} style={{ height: '100%' }} />
                 </div>
              </div>
           </div>

           {/* Trend Comparison */}
           <div className="lg:col-span-8 bg-white p-10 rounded-[60px] border border-slate-100 shadow-xl">
              <div className="flex items-center gap-4 mb-10">
                 <div className="p-3 bg-indigo-50 rounded-2xl text-indigo-600"><TrendingUp size={24}/></div>
                 <h3 className="text-2xl font-black text-slate-900">المسار التاريخي للسيولة</h3>
              </div>
              <ReactECharts option={trendOption} style={{ height: 400 }} />
           </div>

           {/* Recommendation Panel */}
           <div className="lg:col-span-4 bg-slate-900 p-10 rounded-[60px] text-white flex flex-col justify-between shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-10 scale-150 rotate-12 group-hover:rotate-0 transition-transform duration-700 underline"><Sparkles size={100}/></div>
              <div className="relative z-10">
                 <h3 className="text-xl font-black mb-6 flex items-center gap-2">
                    <Crown size={24} className="text-amber-400"/> توصية المستشار الذكي
                 </h3>
                 <p className="text-slate-400 text-sm leading-relaxed font-bold mb-8">
                    بناءً على تحليل بيانات {selectedYear}، نجد أن <span className="text-white">{c1.growth_index > c2.growth_index ? city1Name : city2Name}</span> تقدم "كفاءة نمو" أعلى، بينما تظل <span className="text-white">{c1.stats.total_price_B > c2.stats.total_price_B ? city1Name : city2Name}</span> الخيار الأفضل للمستثمر الذي يبحث عن "السيولة والأمان المؤسسي".
                 </p>
              </div>
              <button className="w-full py-4 bg-white text-slate-900 rounded-2xl font-black text-xs hover:bg-blue-600 hover:text-white transition-all shadow-xl group">
                 تحميل تقرير التفضيل الكامل <Download size={16} className="inline mr-2 group-hover:animate-bounce" />
              </button>
           </div>

        </div>

      </div>
    </div>
  );
};

// --- Sub-Components ---

const CitySelector = ({ value, onChange, color }: any) => (
  <div className="relative group">
    <select 
      value={value} 
      onChange={(e) => onChange(e.target.value)}
      className={`bg-white/10 hover:bg-white/20 border border-white/10 text-white text-lg font-black px-6 py-4 rounded-2xl appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-${color}-500/50 transition-all pr-12`}
    >
      {CITIES.map(c => <option key={c} value={c} className="text-slate-900">{c}</option>)}
    </select>
    <ChevronDown size={20} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 pointer-events-none" />
  </div>
);

const ComparisonCard = ({ icon: Icon, title, val1, val2, city1, city2, unit = '' }: any) => {
  const isC1Winner = val1 > val2;
  return (
    <div className="bg-white p-8 rounded-[48px] border border-slate-100 shadow-xl hover:-translate-y-2 transition-all duration-500 overflow-hidden relative">
      <div className="absolute top-4 right-4 text-slate-50"><Icon size={60} strokeWidth={1} /></div>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-8">{title}</p>
      
      <div className="space-y-6">
         <div className={`p-4 rounded-[28px] border-2 transition-all ${isC1Winner ? 'bg-blue-50 border-blue-200' : 'bg-slate-50 border-transparent opacity-60'}`}>
            <div className="flex items-center justify-between mb-1">
               <span className="text-[10px] font-black text-slate-500 truncate max-w-[80px]">{city1}</span>
               {isC1Winner && <Crown size={12} className="text-blue-600"/>}
            </div>
            <p className={`text-2xl font-black ${isC1Winner ? 'text-blue-700' : 'text-slate-900'}`}>{val1.toLocaleString()} {unit}</p>
         </div>

         <div className={`p-4 rounded-[28px] border-2 transition-all ${!isC1Winner ? 'bg-amber-50 border-amber-200' : 'bg-slate-50 border-transparent opacity-60'}`}>
            <div className="flex items-center justify-between mb-1">
               <span className="text-[10px] font-black text-slate-500 truncate max-w-[80px]">{city2}</span>
               {!isC1Winner && <Crown size={12} className="text-amber-600"/>}
            </div>
            <p className={`text-2xl font-black ${!isC1Winner ? 'text-amber-700' : 'text-slate-900'}`}>{val2.toLocaleString()} {unit}</p>
         </div>
      </div>
    </div>
  );
};

const LegendItem = ({ color, label }: any) => (
  <div className="flex items-center gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-100">
     <div className={`w-4 h-4 rounded-lg ${color}`}></div>
     <span className="text-xs font-black text-slate-700">{label}</span>
  </div>
);

export default SmartCityDuel;
