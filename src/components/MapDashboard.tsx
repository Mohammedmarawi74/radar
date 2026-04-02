import React, { useEffect, useRef, useState, useMemo } from 'react';
import * as echarts from 'echarts';
import {
  MapPin, TrendingUp, TrendingDown, BarChart3, Layers,
  Play, Pause, ChevronRight, Info, Building2, Globe, Flame,
  Activity, ArrowUpRight, ArrowDownRight
} from 'lucide-react';

// ── فونت الرسوم البيانية ──
const CHART_FONT = 'IBM Plex Sans Arabic';

// ── ألوان التدرّج للخريطة ──
const MAP_COLORS = ['#f0f9ff', '#bae6fd', '#38bdf8', '#0284c7', '#0c4a6e'];
const GROWTH_COLORS_POS = ['#f0fdf4', '#86efac', '#22c55e', '#15803d', '#14532d'];
const GROWTH_COLORS_NEG = ['#fff7ed', '#fdba74', '#f97316', '#ea580c', '#7c2d12'];

// ── قراءة بيانات الخريطة من JSON (لو موجود) ──
let MAP_DATA: any = null;
try {
  MAP_DATA = require('../../data/map_data.json');
} catch {
  MAP_DATA = null;
}

// ── بيانات تجريبية في حال عدم وجود map_data.json ──
const DEMO_DATA: any = {
  years: ['2020', '2021', '2022', '2023', '2024'],
  byYear: {
    '2020': [
      { name: 'منطقة الرياض',          value: 95.2,  count: 180000, avg_M: 0.53, norm: 100 },
      { name: 'منطقة مكة المكرمة',     value: 42.1,  count: 85000,  avg_M: 0.50, norm: 44  },
      { name: 'المنطقة الشرقية',        value: 22.4,  count: 55000,  avg_M: 0.41, norm: 24  },
      { name: 'منطقة المدينة المنورة',  value: 6.8,   count: 18000,  avg_M: 0.38, norm: 7   },
      { name: 'منطقة القصيم',           value: 3.5,   count: 14000,  avg_M: 0.25, norm: 4   },
      { name: 'منطقة عسير',             value: 2.9,   count: 8000,   avg_M: 0.36, norm: 3   },
      { name: 'منطقة تبوك',             value: 1.8,   count: 5500,   avg_M: 0.33, norm: 2   },
      { name: 'منطقة حائل',             value: 1.5,   count: 6800,   avg_M: 0.22, norm: 2   },
      { name: 'منطقة الجوف',            value: 0.8,   count: 3200,   avg_M: 0.25, norm: 1   },
      { name: 'منطقة نجران',            value: 0.7,   count: 2400,   avg_M: 0.29, norm: 1   },
      { name: 'منطقة جازان',            value: 1.1,   count: 4100,   avg_M: 0.27, norm: 1   },
      { name: 'منطقة الباحة',           value: 0.5,   count: 1900,   avg_M: 0.26, norm: 1   },
      { name: 'منطقة الحدود الشمالية', value: 0.4,   count: 1500,   avg_M: 0.27, norm: 0   },
    ],
    '2021': [
      { name: 'منطقة الرياض',          value: 108.4, count: 196000, avg_M: 0.55, norm: 100 },
      { name: 'منطقة مكة المكرمة',     value: 48.3,  count: 89000,  avg_M: 0.54, norm: 45  },
      { name: 'المنطقة الشرقية',        value: 26.8,  count: 60000,  avg_M: 0.45, norm: 25  },
      { name: 'منطقة المدينة المنورة',  value: 7.2,   count: 19500,  avg_M: 0.37, norm: 7   },
      { name: 'منطقة القصيم',           value: 4.0,   count: 15000,  avg_M: 0.27, norm: 4   },
      { name: 'منطقة عسير',             value: 3.4,   count: 8500,   avg_M: 0.40, norm: 3   },
      { name: 'منطقة تبوك',             value: 1.9,   count: 5800,   avg_M: 0.33, norm: 2   },
      { name: 'منطقة حائل',             value: 1.7,   count: 7200,   avg_M: 0.24, norm: 2   },
      { name: 'منطقة الجوف',            value: 0.9,   count: 3400,   avg_M: 0.26, norm: 1   },
      { name: 'منطقة نجران',            value: 0.8,   count: 2600,   avg_M: 0.31, norm: 1   },
      { name: 'منطقة جازان',            value: 1.2,   count: 4300,   avg_M: 0.28, norm: 1   },
      { name: 'منطقة الباحة',           value: 0.6,   count: 2100,   avg_M: 0.29, norm: 1   },
      { name: 'منطقة الحدود الشمالية', value: 0.4,   count: 1600,   avg_M: 0.25, norm: 0   },
    ],
    '2022': [
      { name: 'منطقة الرياض',          value: 128.5, count: 215000, avg_M: 0.60, norm: 100 },
      { name: 'منطقة مكة المكرمة',     value: 55.2,  count: 94000,  avg_M: 0.59, norm: 43  },
      { name: 'المنطقة الشرقية',        value: 30.1,  count: 65000,  avg_M: 0.46, norm: 23  },
      { name: 'منطقة المدينة المنورة',  value: 7.8,   count: 20500,  avg_M: 0.38, norm: 6   },
      { name: 'منطقة القصيم',           value: 4.5,   count: 16200,  avg_M: 0.28, norm: 4   },
      { name: 'منطقة عسير',             value: 4.0,   count: 9000,   avg_M: 0.44, norm: 3   },
      { name: 'منطقة تبوك',             value: 2.2,   count: 6100,   avg_M: 0.36, norm: 2   },
      { name: 'منطقة حائل',             value: 1.9,   count: 7600,   avg_M: 0.25, norm: 1   },
      { name: 'منطقة الجوف',            value: 1.0,   count: 3600,   avg_M: 0.28, norm: 1   },
      { name: 'منطقة نجران',            value: 0.9,   count: 2800,   avg_M: 0.32, norm: 1   },
      { name: 'منطقة جازان',            value: 1.4,   count: 4600,   avg_M: 0.30, norm: 1   },
      { name: 'منطقة الباحة',           value: 0.7,   count: 2300,   avg_M: 0.30, norm: 1   },
      { name: 'منطقة الحدود الشمالية', value: 0.5,   count: 1700,   avg_M: 0.29, norm: 0   },
    ],
    '2023': [
      { name: 'منطقة الرياض',          value: 148.2, count: 240000, avg_M: 0.62, norm: 100 },
      { name: 'منطقة مكة المكرمة',     value: 60.5,  count: 98000,  avg_M: 0.62, norm: 41  },
      { name: 'المنطقة الشرقية',        value: 34.8,  count: 70000,  avg_M: 0.50, norm: 23  },
      { name: 'منطقة المدينة المنورة',  value: 8.1,   count: 21000,  avg_M: 0.39, norm: 5   },
      { name: 'منطقة القصيم',           value: 5.0,   count: 17000,  avg_M: 0.29, norm: 3   },
      { name: 'منطقة عسير',             value: 4.5,   count: 9200,   avg_M: 0.49, norm: 3   },
      { name: 'منطقة تبوك',             value: 2.3,   count: 6300,   avg_M: 0.37, norm: 2   },
      { name: 'منطقة حائل',             value: 2.1,   count: 8000,   avg_M: 0.26, norm: 1   },
      { name: 'منطقة الجوف',            value: 1.1,   count: 3800,   avg_M: 0.29, norm: 1   },
      { name: 'منطقة نجران',            value: 1.0,   count: 3000,   avg_M: 0.33, norm: 1   },
      { name: 'منطقة جازان',            value: 1.6,   count: 4900,   avg_M: 0.33, norm: 1   },
      { name: 'منطقة الباحة',           value: 0.8,   count: 2500,   avg_M: 0.32, norm: 1   },
      { name: 'منطقة الحدود الشمالية', value: 0.5,   count: 1800,   avg_M: 0.28, norm: 0   },
    ],
    '2024': [
      { name: 'منطقة الرياض',          value: 152.1, count: 249000, avg_M: 1.54, norm: 100 },
      { name: 'منطقة مكة المكرمة',     value: 65.4,  count: 102000, avg_M: 1.34, norm: 43  },
      { name: 'المنطقة الشرقية',        value: 36.9,  count: 75000,  avg_M: 1.03, norm: 24  },
      { name: 'منطقة المدينة المنورة',  value: 8.2,   count: 22000,  avg_M: 0.74, norm: 5   },
      { name: 'منطقة القصيم',           value: 5.3,   count: 18000,  avg_M: 0.31, norm: 3   },
      { name: 'منطقة عسير',             value: 5.0,   count: 9500,   avg_M: 0.53, norm: 3   },
      { name: 'منطقة تبوك',             value: 2.5,   count: 6500,   avg_M: 0.59, norm: 2   },
      { name: 'منطقة حائل',             value: 2.3,   count: 8200,   avg_M: 0.25, norm: 2   },
      { name: 'منطقة الجوف',            value: 1.2,   count: 4000,   avg_M: 0.30, norm: 1   },
      { name: 'منطقة نجران',            value: 1.1,   count: 3200,   avg_M: 0.34, norm: 1   },
      { name: 'منطقة جازان',            value: 1.7,   count: 5100,   avg_M: 0.33, norm: 1   },
      { name: 'منطقة الباحة',           value: 0.9,   count: 2700,   avg_M: 0.33, norm: 1   },
      { name: 'منطقة الحدود الشمالية', value: 0.6,   count: 1900,   avg_M: 0.32, norm: 0   },
    ],
  },
  growthMap: {
    '2021 vs 2020': [
      { name: 'منطقة الرياض',          value: 13.9 },
      { name: 'منطقة مكة المكرمة',     value: 14.7 },
      { name: 'المنطقة الشرقية',        value: 19.6 },
      { name: 'منطقة المدينة المنورة',  value: 5.9  },
      { name: 'منطقة القصيم',           value: 14.3 },
    ],
    '2022 vs 2021': [
      { name: 'منطقة الرياض',          value: 18.5 },
      { name: 'منطقة مكة المكرمة',     value: 14.3 },
      { name: 'المنطقة الشرقية',        value: 12.3 },
      { name: 'منطقة المدينة المنورة',  value: 8.3  },
      { name: 'منطقة القصيم',           value: 12.5 },
    ],
    '2023 vs 2022': [
      { name: 'منطقة الرياض',          value: 15.3 },
      { name: 'منطقة مكة المكرمة',     value: 9.6  },
      { name: 'المنطقة الشرقية',        value: 15.6 },
      { name: 'منطقة المدينة المنورة',  value: 3.8  },
      { name: 'منطقة القصيم',           value: 11.1 },
    ],
    '2024 vs 2023': [
      { name: 'منطقة الرياض',          value: 2.6  },
      { name: 'منطقة مكة المكرمة',     value: 8.1  },
      { name: 'المنطقة الشرقية',        value: 6.0  },
      { name: 'منطقة المدينة المنورة',  value: 1.2  },
      { name: 'منطقة القصيم',           value: 6.0  },
    ],
  },
  kpiByYear: [
    { year: 2020, total_B: 179.7, count: 381300, regions: 13 },
    { year: 2021, total_B: 204.3, count: 413700, regions: 13 },
    { year: 2022, total_B: 237.0, count: 452600, regions: 13 },
    { year: 2023, total_B: 271.8, count: 495000, regions: 13 },
    { year: 2024, total_B: 281.2, count: 507100, regions: 13 },
  ],
};

const data = MAP_DATA || DEMO_DATA;

// ─────────────────────────────────────────────────
// Helper: بناء بيانات سلسلة الخريطة لسنة معيّنة
// ─────────────────────────────────────────────────
function buildMapSeries(yearKey: string, mode: 'liquidity' | 'growth'): any[] {
  if (mode === 'liquidity') {
    const rows: any[] = data.byYear?.[yearKey] || [];
    return rows.map((r: any) => ({ name: r.name, value: r.value, count: r.count, avg_M: r.avg_M }));
  } else {
    const growthKeys = Object.keys(data.growthMap || {});
    const gKey = growthKeys.find(k => k.startsWith(yearKey));
    const rows: any[] = gKey ? data.growthMap[gKey] : [];
    return rows.map((r: any) => ({ name: r.name, value: r.value }));
  }
}

// ─────────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────────
const MapDashboard: React.FC = () => {
  const mapRef    = useRef<HTMLDivElement>(null);
  const chartRef  = useRef<echarts.ECharts | null>(null);

  const [geoLoaded,   setGeoLoaded]   = useState(false);
  const [geoError,    setGeoError]    = useState(false);
  const [yearIdx,     setYearIdx]     = useState(data.years.length - 1);
  const [playing,     setPlaying]     = useState(false);
  const [mapMode,     setMapMode]     = useState<'liquidity' | 'growth'>('liquidity');
  const [filterType,  setFilterType]  = useState<'all' | 'residential' | 'commercial'>('all');
  const [hoverInfo,   setHoverInfo]   = useState<any>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const currentYear = data.years[yearIdx];
  const currentKPI  = data.kpiByYear?.find((k: any) => k.year === parseInt(currentYear));

  // ── تحميل GeoJSON ──
  useEffect(() => {
    fetch('/saudi_regions_flat.geojson')
      .then(r => {
        if (!r.ok) throw new Error(`HTTP error! status: ${r.status}`);
        return r.json();
      })
      .then(geojson => {
        console.log('GeoJSON Loaded:', geojson.features?.length, 'regions');
        // تأكد من خلوه من GeometryCollection للحصول على أفضل أداء مع ECharts
        echarts.registerMap('saudi', geojson);
        setGeoLoaded(true);
      })
      .catch(err => {
        console.error('GeoJSON Load Error:', err);
        setGeoError(true);
      });
  }, []);

  // ── بناء الرسم ──
  useEffect(() => {
    if (!geoLoaded || !mapRef.current) return;
    if (!chartRef.current) {
      chartRef.current = echarts.init(mapRef.current, undefined, { renderer: 'canvas' });
    }
    const chart = chartRef.current;
    const seriesData = buildMapSeries(currentYear, mapMode);
    const isGrowth   = mapMode === 'growth';
    const maxVal     = Math.max(...seriesData.map((d: any) => Math.abs(d.value)), 1);

    const option: echarts.EChartsOption = {
      backgroundColor: 'transparent',
      tooltip: {
        trigger: 'item',
        confine: true,
        textStyle: { fontFamily: CHART_FONT, fontSize: 12 },
        formatter: (params: any) => {
          const d = params.data;
          if (!d) return params.name;
          if (isGrowth) {
            const arrow = d.value >= 0 ? '📈' : '📉';
            return `<div style="font-family:${CHART_FONT};padding:6px 8px">
              <div style="font-weight:700;font-size:14px;margin-bottom:4px">${params.name}</div>
              <div>${arrow} نسبة النمو: <b style="color:${d.value >= 0 ? '#22c55e' : '#ef4444'}">${d.value > 0 ? '+' : ''}${d.value?.toFixed(1)}%</b></div>
              <div style="font-size:11px;color:#94a3b8;margin-top:4px">${currentYear.split(' vs ')[0]} مقارنةً بـ ${currentYear.split(' vs ')[1]}</div>
            </div>`;
          }
          return `<div style="font-family:${CHART_FONT};padding:6px 8px">
            <div style="font-weight:700;font-size:14px;margin-bottom:6px">${params.name}</div>
            <div>🏦 السيولة: <b style="color:#f59e0b">${d.value?.toFixed(1)} مليار ريال</b></div>
            <div>📋 الصفقات: <b>${d.count?.toLocaleString('ar-SA')}</b></div>
            <div>💰 متوسط السعر: <b>${d.avg_M?.toFixed(2)} مليون</b></div>
          </div>`;
        },
      },
      visualMap: {
        min: isGrowth ? -maxVal : 0,
        max: isGrowth ?  maxVal : maxVal,
        show: true,
        left: 'left',
        bottom: 20,
        orient: 'vertical',
        textStyle: { fontFamily: CHART_FONT, fontSize: 11, color: '#94a3b8' },
        text: isGrowth ? ['نمو عالٍ', 'تراجع'] : ['أعلى سيولة', 'أقل سيولة'],
        inRange: {
          color: isGrowth
            ? ['#dc2626', '#f97316', '#f8fafc', '#4ade80', '#16a34a']
            : ['#f0f9ff', '#bae6fd', '#38bdf8', '#0284c7', '#1e3a8a'],
        },
      },
      series: [
        {
          type: 'map',
          map: 'saudi',
          roam: true,
          zoom: 1.1,
          center: [44.5, 23.5],
          aspectScale: 0.85,
          nameProperty: 'name_ar',
          data: seriesData,
          emphasis: {
            label:     { show: true, fontFamily: CHART_FONT, fontWeight: 'bold', color: '#fff', fontSize: 11 },
            itemStyle: { areaColor: '#f59e0b', borderColor: '#fbbf24', borderWidth: 2, shadowBlur: 20, shadowColor: 'rgba(245,158,11,0.5)' },
          },
          label: {
            show: false,
            fontFamily: CHART_FONT,
            fontSize: 10,
          },
          itemStyle: {
            borderColor: '#1e293b',
            borderWidth: 0.8,
            areaColor: '#1e3a5f',
          },
          select: {
            label: { show: true, color: '#fff', fontFamily: CHART_FONT },
            itemStyle: { areaColor: '#f59e0b' },
          },
        },
      ],
    };

    chart.setOption(option, true);

    chart.on('mouseover', (params: any) => {
      if (params.data) setHoverInfo(params.data);
    });
    chart.on('mouseout', () => setHoverInfo(null));

    const handleResize = () => chart.resize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [geoLoaded, currentYear, mapMode]);

  // ── تشغيل التايم لابس ──
  useEffect(() => {
    if (playing) {
      intervalRef.current = setInterval(() => {
        setYearIdx(i => {
          if (i >= data.years.length - 1) { setPlaying(false); return i; }
          return i + 1;
        });
      }, 1800);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [playing]);

  const growthLabels = Object.keys(data.growthMap || {});
  const currentGrowthLabel = growthLabels.find(k => k.startsWith(currentYear)) || growthLabels[growthLabels.length - 1];
  const growthForYear = mapMode === 'growth' ? (data.growthMap?.[currentGrowthLabel] || []) : [];

  return (
    <div className="min-h-screen bg-slate-950 font-['IBM_Plex_Sans_Arabic']" dir="rtl">

      {/* ── Header ── */}
      <div className="bg-gradient-to-l from-slate-900 via-blue-950 to-slate-900 border-b border-slate-800 px-8 py-6">
        <div className="max-w-screen-2xl mx-auto">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-amber-500/10 rounded-xl border border-amber-500/20">
                <Globe className="w-7 h-7 text-amber-400" />
              </div>
              <div>
                <h1 className="text-2xl font-black text-white">رادار السوق العقاري · الخريطة التفاعلية</h1>
                <p className="text-slate-400 text-sm">تتبع حركة السيولة عبر 13 منطقة · 2020 - 2024</p>
              </div>
            </div>
            {/* KPI سريعة */}
            {currentKPI && (
              <div className="flex gap-4 flex-wrap">
                {[
                  { label: 'إجمالي السيولة',  val: `${currentKPI.total_B?.toFixed(1)} مليار`, icon: Flame,     color: 'amber' },
                  { label: 'عدد الصفقات',      val: currentKPI.count?.toLocaleString('ar-SA'),  icon: Activity,  color: 'blue'  },
                  { label: 'المناطق النشطة',   val: `${currentKPI.regions} مناطق`,              icon: MapPin,    color: 'emerald'},
                ].map(({ label, val, icon: Icon, color }) => (
                  <div key={label} className={`bg-slate-800/60 border border-${color}-500/20 rounded-xl px-4 py-3 text-center min-w-[130px]`}>
                    <div className={`text-${color}-400 text-xs font-medium mb-1 flex items-center justify-center gap-1`}>
                      <Icon className="w-3 h-3" />{label}
                    </div>
                    <div className="text-white font-black text-lg">{val}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-screen-2xl mx-auto px-8 py-6">
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">

          {/* ═══ لوحة التحكم (يسار) ═══ */}
          <div className="xl:col-span-1 space-y-4">

            {/* اختيار وضع العرض */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
              <h3 className="text-slate-300 text-sm font-bold mb-3 flex items-center gap-2">
                <Layers className="w-4 h-4 text-amber-400" /> وضع الخريطة
              </h3>
              <div className="space-y-2">
                {[
                  { key: 'liquidity', label: 'خريطة السيولة',   sub: 'حجم المليارات لكل منطقة', icon: BarChart3    },
                  { key: 'growth',    label: 'خريطة النمو YoY', sub: 'نسبة التغير عن السنة السابقة', icon: TrendingUp },
                ].map(({ key, label, sub, icon: Icon }) => (
                  <button
                    key={key}
                    onClick={() => setMapMode(key as any)}
                    className={`w-full text-right p-3 rounded-xl border transition-all text-sm ${
                      mapMode === key
                        ? 'bg-amber-500/10 border-amber-500/40 text-amber-300'
                        : 'bg-slate-800/50 border-slate-700 text-slate-400 hover:border-slate-600'
                    }`}
                  >
                    <div className="flex items-center gap-2 font-bold">
                      <Icon className="w-4 h-4" />{label}
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5 mr-6">{sub}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Timeline Control */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
              <h3 className="text-slate-300 text-sm font-bold mb-3 flex items-center gap-2">
                <Play className="w-4 h-4 text-blue-400" /> الخط الزمني
              </h3>
              <div className="flex flex-col gap-2">
                {data.years.map((yr: string, i: number) => (
                  <button
                    key={yr}
                    onClick={() => { setYearIdx(i); setPlaying(false); }}
                    className={`flex items-center gap-3 p-2.5 rounded-xl border text-sm transition-all ${
                      yearIdx === i
                        ? 'bg-blue-500/10 border-blue-500/40 text-blue-300'
                        : 'bg-slate-800/40 border-slate-700 text-slate-400 hover:border-slate-600'
                    }`}
                  >
                    <span className={`w-2 h-2 rounded-full flex-shrink-0 ${yearIdx === i ? 'bg-blue-400' : 'bg-slate-600'}`} />
                    <span className="font-bold">{yr}</span>
                    {data.kpiByYear?.find((k: any) => k.year === parseInt(yr)) && (
                      <span className="text-xs text-slate-500 mr-auto">
                        {data.kpiByYear.find((k: any) => k.year === parseInt(yr)).total_B?.toFixed(0)}B
                      </span>
                    )}
                  </button>
                ))}
              </div>
              <button
                onClick={() => setPlaying(p => !p)}
                className={`mt-3 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border text-sm font-bold transition-all ${
                  playing
                    ? 'bg-red-500/10 border-red-500/30 text-red-400 hover:bg-red-500/20'
                    : 'bg-blue-500/10 border-blue-500/30 text-blue-400 hover:bg-blue-500/20'
                }`}
              >
                {playing ? <><Pause className="w-4 h-4" /> إيقاف</> : <><Play className="w-4 h-4" /> تشغيل تلقائي</>}
              </button>
            </div>

            {/* معلومات المنطقة عند Hover */}
            {hoverInfo && (
              <div className="bg-gradient-to-b from-amber-500/5 to-slate-900 border border-amber-500/30 rounded-2xl p-4 animate-in fade-in duration-200">
                <h3 className="text-amber-400 font-black text-sm mb-3 flex items-center gap-2">
                  <MapPin className="w-4 h-4" /> {hoverInfo.name}
                </h3>
                <div className="space-y-2">
                  {mapMode === 'liquidity' ? (
                    <>
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-400">السيولة</span>
                        <span className="text-amber-300 font-bold">{hoverInfo.value?.toFixed(2)} مليار</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-400">الصفقات</span>
                        <span className="text-blue-300 font-bold">{hoverInfo.count?.toLocaleString('ar-SA')}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-400">متوسط السعر</span>
                        <span className="text-emerald-300 font-bold">{hoverInfo.avg_M?.toFixed(2)} مليون</span>
                      </div>
                    </>
                  ) : (
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400">نسبة النمو</span>
                      <span className={`font-bold ${hoverInfo.value >= 0 ? 'text-emerald-300' : 'text-red-400'}`}>
                        {hoverInfo.value > 0 ? '+' : ''}{hoverInfo.value?.toFixed(1)}%
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

          </div>

          {/* ═══ الخريطة الرئيسية ═══ */}
          <div className="xl:col-span-3 space-y-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
              {/* شريط العنوان */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
                <div>
                  <h2 className="text-white font-black text-lg">
                    {mapMode === 'liquidity'
                      ? `السيولة العقارية – ${currentYear}`
                      : `نمو السيولة – ${currentGrowthLabel || currentYear}`}
                  </h2>
                  <p className="text-slate-400 text-xs mt-0.5">
                    {mapMode === 'liquidity'
                      ? 'اضغط على منطقة للتكبير · حرّك الفأرة لرؤية التفاصيل'
                      : 'اللون الأخضر = نمو · اللون الأحمر = تراجع في السيولة'}
                  </p>
                </div>
                {/* مقياس السنة */}
                <div className="flex items-center gap-1">
                  {data.years.map((yr: string, i: number) => (
                    <button
                      key={yr}
                      onClick={() => { setYearIdx(i); setPlaying(false); }}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        yearIdx === i
                          ? 'bg-amber-500 text-black'
                          : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                      }`}
                    >
                      {yr}
                    </button>
                  ))}
                </div>
              </div>

              {/* الخريطة */}
              {geoError ? (
                <div className="h-[520px] flex flex-col items-center justify-center text-slate-500 gap-4">
                  <Globe className="w-12 h-12 opacity-30" />
                  <div className="text-center">
                    <p className="font-bold">لم يتم تحميل ملف الخريطة</p>
                    <p className="text-xs mt-1">تأكد من وضع saudi_regions.geojson في مجلد /public</p>
                  </div>
                </div>
              ) : !geoLoaded ? (
                <div className="h-[520px] flex items-center justify-center gap-3 text-slate-400">
                  <div className="w-6 h-6 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
                  <span>جاري تحميل خريطة المملكة...</span>
                </div>
              ) : (
                <div ref={mapRef} style={{ height: '520px', width: '100%' }} />
              )}
            </div>

            {/* ── شريط المناطق السريع ── */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
              <h3 className="text-slate-300 text-sm font-bold mb-3 flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-blue-400" />
                ترتيب المناطق حسب السيولة – {currentYear}
              </h3>
              <div className="space-y-2">
                {(data.byYear?.[currentYear] || []).slice(0, 8).map((r: any, i: number) => {
                  const maxV = data.byYear?.[currentYear]?.[0]?.value || 1;
                  const pct  = (r.value / maxV) * 100;
                  const colors = ['#f59e0b','#3b82f6','#10b981','#8b5cf6','#ec4899','#06b6d4','#84cc16','#f97316'];
                  return (
                    <div key={r.name} className="flex items-center gap-3">
                      <span className="text-slate-500 text-xs w-4 shrink-0">{i + 1}</span>
                      <span className="text-slate-300 text-xs w-44 truncate shrink-0">{r.name}</span>
                      <div className="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-700"
                          style={{ width: `${pct}%`, backgroundColor: colors[i] }}
                        />
                      </div>
                      <span className="text-slate-400 text-xs w-16 text-left shrink-0">{r.value?.toFixed(1)}B</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ── تحليل النمو ── */}
            {mapMode === 'growth' && growthForYear.length > 0 && (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
                <h3 className="text-slate-300 text-sm font-bold mb-3 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                  نسبة النمو لكل منطقة – {currentGrowthLabel}
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {growthForYear.map((r: any) => (
                    <div key={r.name} className={`flex items-center justify-between p-2.5 rounded-xl border text-xs ${
                      r.value >= 0
                        ? 'bg-emerald-500/5 border-emerald-500/20'
                        : 'bg-red-500/5 border-red-500/20'
                    }`}>
                      <span className="text-slate-300 truncate max-w-[120px]">{r.name}</span>
                      <span className={`font-black flex items-center gap-1 ${r.value >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                        {r.value >= 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                        {r.value > 0 ? '+' : ''}{r.value?.toFixed(1)}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        </div>
      </div>

    </div>
  );
};

export default MapDashboard;
