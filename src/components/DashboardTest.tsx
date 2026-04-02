import React, { useMemo, useState } from 'react';
import ReactECharts from 'echarts-for-react';
import {
  BarChart3, TrendingUp, Building2, Map, Activity,
  Layers, DollarSign, Home, RefreshCw, ChevronRight,
  ArrowUpRight, ArrowDownRight, Info, LayoutDashboard,
  Globe, Sparkles, ClipboardList, Award, Maximize, MapPin,
  Banknote, BarChart, PieChart, LineChart, TrendingDown,
  Radar, Flame, Circle, FileText, LayoutTemplate, History, Clock
} from 'lucide-react';
import rawData from '../../data/dashboard_charts.json';
import MapDashboard from './MapDashboard';

// ────────────────────────────────────────────────────────────
// Type helpers
// ────────────────────────────────────────────────────────────
const D = rawData as any;

const PALETTE = [
  '#3b82f6','#10b981','#f59e0b','#ef4444','#8b5cf6',
  '#06b6d4','#ec4899','#84cc16','#f97316','#64748b',
];
const CHART_FONT = 'IBM Plex Sans Arabic';

function kfmt(n: number, unit = '') {
  if (Math.abs(n) >= 1000) return (n / 1000).toFixed(1) + 'K' + unit;
  return n.toFixed(1) + unit;
}

// ────────────────────────────────────────────────────────────
// KPI Card
// ────────────────────────────────────────────────────────────
const KPICard = ({ label, value, sub, icon: Icon, color, delta }: any) => (
  <div className="relative overflow-hidden bg-white rounded-3xl border border-slate-100 shadow-sm p-6 flex flex-col justify-between group hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
    <div className="flex items-start justify-between">
      <div className={`w-12 h-12 rounded-2xl bg-${color}-50 flex items-center justify-center group-hover:scale-110 transition-transform`}>
        <Icon size={22} className={`text-${color}-600`} />
      </div>
      {delta !== undefined && (
        <span className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full ${delta >= 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
          {delta >= 0 ? <ArrowUpRight size={12}/> : <ArrowDownRight size={12}/>}
          {Math.abs(delta)}%
        </span>
      )}
    </div>
    <div className="mt-4">
      <p className="text-3xl font-black text-slate-900 tracking-tight">{value}</p>
      <p className="text-sm font-bold text-slate-400 mt-1">{label}</p>
      {sub && <p className="text-xs text-slate-300 mt-1">{sub}</p>}
    </div>
    <div className={`absolute -bottom-6 -left-6 w-24 h-24 bg-${color}-50 rounded-full opacity-50`} />
  </div>
);

// ────────────────────────────────────────────────────────────
// Chart Section wrapper
// ────────────────────────────────────────────────────────────
const ChartCard = ({ title, subtitle, children, colSpan = 1, icon: Icon }: any) => (
  <div className={`bg-white rounded-3xl border border-slate-100 shadow-sm p-6 flex flex-col ${colSpan === 2 ? 'col-span-2' : ''}`}>
    <div className="mb-4">
      <div className="flex items-center gap-2 mb-1">
        {Icon && <Icon size={18} className="text-blue-500" />}
        <h3 className="text-base font-black text-slate-800">{title}</h3>
      </div>
      {subtitle && <p className="text-xs text-slate-400 mt-0.5 font-medium">{subtitle}</p>}
    </div>
    {children}
  </div>
);

// ────────────────────────────────────────────────────────────
// MAIN DASHBOARD
// ────────────────────────────────────────────────────────────
const DashboardTest: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview'|'regions'|'advanced'|'longterm'|'georadar'>('overview');
  const kpi = D.kpi;

  // ── 1. Liquidity Area + Line (dual axis) ──────────────────
  const liquidityOption = useMemo(() => ({
    backgroundColor: 'transparent',
    tooltip: { trigger: 'axis', axisPointer: { type: 'cross' } },
    legend: { data: ['السيولة (مليار)', 'عدد الصفقات'], bottom: 0, textStyle: { fontFamily: CHART_FONT } },
    grid: { left: 60, right: 60, top: 30, bottom: 50 },
    xAxis: { type: 'category', data: D.quarterlyTrend.categories, axisLine: { lineStyle: { color: '#e2e8f0' } } },
    yAxis: [
      { type: 'value', name: 'مليار ريال', nameTextStyle: { color: '#94a3b8' },
        axisLabel: { formatter: (v: number) => v + 'B' }, splitLine: { lineStyle: { color: '#f1f5f9' } } },
      { type: 'value', name: 'صفقات', nameTextStyle: { color: '#94a3b8' },
        axisLabel: { formatter: (v: number) => kfmt(v) }, splitLine: { show: false } }
    ],
    series: [
      {
        name: 'السيولة (مليار)', type: 'line', yAxisIndex: 0,
        data: D.quarterlyTrend.liquidity_B,
        smooth: true, lineStyle: { width: 4, color: '#3b82f6' },
        symbol: 'circle', symbolSize: 10,
        itemStyle: { color: '#3b82f6', borderWidth: 3, borderColor: '#fff' },
        areaStyle: {
          color: { type: 'linear', x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [{ offset: 0, color: 'rgba(59,130,246,0.35)' }, { offset: 1, color: 'rgba(59,130,246,0)' }] }
        },
        markPoint: {
          data: [{ type: 'max', name: 'أعلى قيمة', label: { fontWeight: 'bold' } }]
        }
      },
      {
        name: 'عدد الصفقات', type: 'bar', yAxisIndex: 1,
        data: D.quarterlyTrend.txn_count,
        barWidth: '30%',
        itemStyle: { color: { type: 'linear', x: 0, y: 0, x2: 0, y2: 1,
          colorStops: [{ offset: 0, color: 'rgba(16,185,129,0.9)' }, { offset: 1, color: 'rgba(16,185,129,0.3)' }] },
          borderRadius: [6, 6, 0, 0]
        }
      }
    ]
  }), []);

  // ── 2. Region Grouped Bar ─────────────────────────────────
  const regionBarOption = useMemo(() => ({
    tooltip: { trigger: 'axis', textStyle: { fontFamily: CHART_FONT } },
    legend: { data: ['السيولة(م)', 'الصفقات(100)'], bottom: 0, textStyle: { fontFamily: CHART_FONT } },
    grid: { left: 80, right: 20, top: 20, bottom: 50 },
    xAxis: { type: 'value', splitLine: { lineStyle: { color: '#f1f5f9' } }, axisLabel: { fontFamily: CHART_FONT } },
    yAxis: { type: 'category', data: [...D.regionMulti.regions].reverse(),
      axisLabel: { width: 70, overflow: 'truncate', fontSize: 11, fontFamily: CHART_FONT } },
    series: [
      {
        name: 'السيولة(م)', type: 'bar', stack: 'total',
        data: [...D.regionMulti.price_B].reverse(),
        itemStyle: { color: { type: 'linear', x: 0, y: 0, x2: 1, y2: 0,
          colorStops: [{ offset: 0, color: '#3b82f6' }, { offset: 1, color: '#60a5fa' }] },
          borderRadius: [0, 4, 4, 0] },
        label: { show: true, position: 'right', formatter: (p: any) => p.value + 'B' }
      }
    ]
  }), []);

  // ── 3. Donut – Property Type ──────────────────────────────
  const donutOption = useMemo(() => ({
    tooltip: { trigger: 'item', formatter: '{b}: {c} صفقة ({d}%)', textStyle: { fontFamily: CHART_FONT } },
    legend: { orient: 'vertical', right: 10, top: 'center', textStyle: { fontSize: 11, fontFamily: CHART_FONT } },
    series: [{
      type: 'pie', radius: ['45%', '72%'], center: ['38%', '50%'],
      avoidLabelOverlap: true,
      itemStyle: { borderRadius: 8, borderColor: '#fff', borderWidth: 3 },
      label: { show: false, fontFamily: CHART_FONT },
      emphasis: { label: { show: true, fontSize: 16, fontWeight: 'bold', formatter: '{b}\n{c}' } },
      data: D.propertyTypes.map((p: any, i: number) => ({ name: p.name, value: p.count, itemStyle: { color: PALETTE[i] } }))
    }]
  }), []);

  // ── 4. Sunburst / Pie nested – Price Ranges ───────────────
  const priceRangeOption = useMemo(() => {
    const total = D.priceRanges.reduce((s: number, p: any) => s + p.value, 0);
    return {
      tooltip: { trigger: 'item', textStyle: { fontFamily: CHART_FONT }, formatter: (params: any) =>
        `${params.name}<br/>الصفقات: ${params.value.toLocaleString()}<br/>النسبة: ${(params.value/total*100).toFixed(1)}%`
      },
      series: [{
        type: 'pie', radius: ['25%', '60%'], roseType: 'area',
        itemStyle: { borderRadius: 6 },
        label: { alignTo: 'edge', minMargin: 5, edgeDistance: 10, lineHeight: 15,
          fontFamily: CHART_FONT,
          formatter: '{b|{b}}\n{per|{d}%}',
          rich: { b: { fontSize: 11, color: '#475569', fontWeight: 'bold' }, per: { fontSize: 10, color: '#94a3b8' } }
        },
        data: D.priceRanges.map((p: any, i: number) => ({ name: p.name, value: p.value, itemStyle: { color: PALETTE[i] } }))
      }]
    };
  }, []);

  // ── 5. Radar ──────────────────────────────────────────────
  const radarOption = useMemo(() => ({
    backgroundColor: 'transparent',
    tooltip: { textStyle: { fontFamily: CHART_FONT } },
    legend: { data: D.radarRegions.series.map((s: any) => s.name), bottom: 0, textStyle: { fontSize: 11, fontFamily: CHART_FONT } },
    radar: {
      indicator: D.radarRegions.indicators,
      shape: 'polygon', splitNumber: 4,
      axisName: { color: '#475569', fontWeight: 'bold', fontSize: 12, fontFamily: CHART_FONT },
      splitArea: { areaStyle: { color: ['rgba(241,245,249,0.3)', 'rgba(241,245,249,0.5)'] } },
      splitLine: { lineStyle: { color: '#e2e8f0' } }
    },
    series: [{
      type: 'radar',
      data: D.radarRegions.series.map((s: any, i: number) => ({
        name: s.name,
        value: s.value,
        itemStyle: { color: PALETTE[i] },
        lineStyle: { width: 2, color: PALETTE[i] },
        areaStyle: { opacity: 0.15 },
        symbol: 'circle', symbolSize: 6
      }))
    }]
  }), []);

  // ── 6. Heatmap ────────────────────────────────────────────
  const hmMax = useMemo(() => Math.max(...D.heatmap.data.map((d: number[]) => d[2])), []);
  const heatmapOption = useMemo(() => ({
    tooltip: {
      textStyle: { fontFamily: CHART_FONT },
      formatter: (params: any) =>
        `<b>${D.heatmap.xaxis[params.data[0]]}</b><br/>${D.heatmap.yaxis[params.data[1]]}<br/>الصفقات: <b>${params.data[2].toLocaleString()}</b>`
    },
    grid: { left: 100, right: 40, top: 20, bottom: 60 },
    xAxis: { type: 'category', data: D.heatmap.xaxis, axisLabel: { rotate: 30, fontSize: 11, overflow: 'truncate', width: 80, fontFamily: CHART_FONT } },
    yAxis: { type: 'category', data: D.heatmap.yaxis, axisLabel: { fontSize: 11, fontFamily: CHART_FONT } },
    visualMap: {
      min: 0, max: hmMax, calculable: true, orient: 'horizontal',
      left: 'center', bottom: 0, inRange: { color: ['#eff6ff', '#bfdbfe', '#3b82f6', '#1d4ed8'] }
    },
    series: [{
      type: 'heatmap', data: D.heatmap.data,
      label: { show: true, fontSize: 10, color: '#334155',
        formatter: (p: any) => p.data[2] > 0 ? p.data[2].toLocaleString() : '' },
      emphasis: { itemStyle: { shadowBlur: 10, shadowColor: 'rgba(59,130,246,0.5)' } }
    }]
  }), [hmMax]);

  // ── 7. Scatter (multi-series by type) ────────────────────
  const scatterOption = useMemo(() => {
    const types = Object.keys(D.scatter);
    return {
      tooltip: { trigger: 'item', textStyle: { fontFamily: CHART_FONT }, formatter: (p: any) =>
        `<b>${p.seriesName}</b><br/>المساحة: ${p.data[0]} م²<br/>السعر: ${p.data[1]} مليون ريال`
      },
      legend: { data: types, bottom: 0, textStyle: { fontSize: 10, fontFamily: CHART_FONT } },
      grid: { left: 60, right: 20, top: 20, bottom: 50 },
      xAxis: { type: 'value', name: 'المساحة (م²)', nameTextStyle: { color: '#94a3b8' },
        splitLine: { lineStyle: { color: '#f1f5f9' } } },
      yAxis: { type: 'value', name: 'السعر (مليون)', nameTextStyle: { color: '#94a3b8' },
        splitLine: { lineStyle: { color: '#f1f5f9' } } },
      series: types.map((t, i) => ({
        name: t, type: 'scatter',
        data: (D.scatter[t] as number[][]).filter(d => d[1] < 100),
        symbolSize: (d: number[]) => Math.min(Math.max(d[1] * 2, 6), 24),
        itemStyle: { color: PALETTE[i], opacity: 0.7 },
        emphasis: { itemStyle: { opacity: 1 } }
      }))
    };
  }, []);

  // ── 8. Q1 vs Q4 Column Comparison ────────────────────────
  const qCompOption = useMemo(() => ({
    tooltip: { trigger: 'axis', textStyle: { fontFamily: CHART_FONT } },
    legend: { data: ['Q1 2024', 'Q4 2024'], bottom: 0, textStyle: { fontFamily: CHART_FONT } },
    grid: { left: 80, right: 20, top: 20, bottom: 50 },
    xAxis: { type: 'category', data: D.qComparison.regions, axisLabel: { rotate: 20, fontSize: 10, overflow: 'truncate', width: 80, fontFamily: CHART_FONT } },
    yAxis: { type: 'value', axisLabel: { formatter: (v: number) => v + 'B' }, splitLine: { lineStyle: { color: '#f1f5f9' } } },
    series: [
      {
        name: 'Q1 2024', type: 'bar', data: D.qComparison.q1_B,
        barWidth: '30%',
        itemStyle: { color: { type: 'linear', x: 0, y: 0, x2: 0, y2: 1,
          colorStops: [{ offset: 0, color: '#60a5fa' }, { offset: 1, color: '#bfdbfe' }] }, borderRadius: [6,6,0,0] }
      },
      {
        name: 'Q4 2024', type: 'bar', data: D.qComparison.q4_B,
        barWidth: '30%',
        itemStyle: { color: { type: 'linear', x: 0, y: 0, x2: 0, y2: 1,
          colorStops: [{ offset: 0, color: '#10b981' }, { offset: 1, color: '#a7f3d0' }] }, borderRadius: [6,6,0,0] }
      },
    ]
  }), []);

  // ── 9. Top Cities Bar Race ────────────────────────────────
  const cityOption = useMemo(() => ({
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' }, textStyle: { fontFamily: CHART_FONT } },
    grid: { left: 100, right: 60, top: 10, bottom: 20 },
    xAxis: { type: 'value', axisLabel: { formatter: (v: number) => v + 'B', fontFamily: CHART_FONT }, splitLine: { lineStyle: { color: '#f1f5f9' } } },
    yAxis: { type: 'category', data: [...D.topCities.cities].reverse(), axisLabel: { fontSize: 11, fontFamily: CHART_FONT } },
    series: [{
      type: 'bar', data: [...D.topCities.total_B].reverse(),
      label: { show: true, position: 'right', formatter: (p: any) => p.value + 'B', fontSize: 11, color: '#475569' },
      itemStyle: {
        borderRadius: [0, 8, 8, 0],
        color: (params: any) => {
          const colors = ['#1d4ed8','#2563eb','#3b82f6','#60a5fa','#93c5fd','#bfdbfe','#dbeafe','#eff6ff','#f8fafc','#f1f5f9'];
          return colors[params.dataIndex] || '#3b82f6';
        }
      }
    }]
  }), []);

  // ── 10. Area – Avg Price Trend ────────────────────────────
  const avgPriceOption = useMemo(() => ({
    tooltip: { trigger: 'axis', textStyle: { fontFamily: CHART_FONT }, valueFormatter: (v: number) => v.toFixed(2) + ' مليون' },
    grid: { left: 60, right: 20, top: 30, bottom: 40 },
    xAxis: { type: 'category', data: D.liquidityTrend.periods, axisLabel: { fontSize: 11, fontFamily: CHART_FONT } },
    yAxis: { type: 'value', axisLabel: { formatter: (v: number) => v + 'M', fontFamily: CHART_FONT }, splitLine: { lineStyle: { color: '#f1f5f9' } } },
    series: [
      {
        name: 'متوسط السعر', type: 'line', smooth: true,
        data: D.quarterlyTrend.avg_price_M,
        lineStyle: { width: 3, color: '#8b5cf6' },
        areaStyle: { color: { type: 'linear', x: 0, y: 0, x2: 0, y2: 1,
          colorStops: [{ offset: 0, color: 'rgba(139,92,246,0.4)' }, { offset: 1, color: 'rgba(139,92,246,0)' }] }
        },
        symbol: 'circle', symbolSize: 8,
        itemStyle: { color: '#8b5cf6', borderColor: '#fff', borderWidth: 2 },
        markLine: {
          data: [{ type: 'average', name: 'المتوسط العام', label: { formatter: 'متوسط: {c}M' } }],
          lineStyle: { color: '#f59e0b', type: 'dashed' }
        }
      }
    ]
  }), []);

  // ── 11. Multi-Year Trend ──────────────────
  const multiYearOption = useMemo(() => ({
    backgroundColor: 'transparent',
    tooltip: { trigger: 'axis', axisPointer: { type: 'cross' } },
    legend: { data: ['السيولة (مليار)', 'عدد الصفقات'], bottom: 0, textStyle: { fontFamily: CHART_FONT } },
    grid: { left: 60, right: 60, top: 30, bottom: 50 },
    xAxis: { type: 'category', data: D.multiYearTrend?.years || [], axisLine: { lineStyle: { color: '#e2e8f0' } }, axisLabel: { fontFamily: CHART_FONT, fontWeight: 'bold' } },
    yAxis: [
      { type: 'value', name: 'مليار ريال', nameTextStyle: { color: '#94a3b8', fontFamily: CHART_FONT }, axisLabel: { formatter: (v: number) => v + 'B', fontFamily: CHART_FONT }, splitLine: { lineStyle: { color: '#f1f5f9' } } },
      { type: 'value', name: 'صفقات', nameTextStyle: { color: '#94a3b8', fontFamily: CHART_FONT }, axisLabel: { formatter: (v: number) => kfmt(v), fontFamily: CHART_FONT }, splitLine: { show: false } }
    ],
    series: [
      {
        name: 'السيولة (مليار)', type: 'line', yAxisIndex: 0,
        data: D.multiYearTrend?.liquidity_B || [],
        smooth: true, lineStyle: { width: 4, color: '#f59e0b' },
        symbol: 'circle', symbolSize: 10,
        itemStyle: { color: '#f59e0b', borderWidth: 3, borderColor: '#fff' },
        areaStyle: {
          color: { type: 'linear', x: 0, y: 0, x2: 0, y2: 1, colorStops: [{ offset: 0, color: 'rgba(245,158,11,0.35)' }, { offset: 1, color: 'rgba(245,158,11,0)' }] }
        }
      },
      {
        name: 'عدد الصفقات', type: 'bar', yAxisIndex: 1,
        data: D.multiYearTrend?.txn_count || [],
        barWidth: '30%',
        itemStyle: { color: { type: 'linear', x: 0, y: 0, x2: 0, y2: 1, colorStops: [{ offset: 0, color: 'rgba(99,102,241,0.9)' }, { offset: 1, color: 'rgba(99,102,241,0.3)' }] }, borderRadius: [6, 6, 0, 0] }
      }
    ]
  }), [D.multiYearTrend]);

  // ── 12. YoY Growth ────────────────────────
  const yoyOption = useMemo(() => {
    if (!D.yoyGrowth) return {};
    return {
      tooltip: { trigger: 'axis', formatter: (p: any) => `<b>${p[0].name}</b><br/>نمو: ${p[0].value}%`, textStyle: { fontFamily: CHART_FONT } },
      grid: { left: 50, right: 20, top: 20, bottom: 40 },
      xAxis: { type: 'category', data: D.yoyGrowth.map((y: any) => y.label), axisLabel: { fontFamily: CHART_FONT } },
      yAxis: { type: 'value', axisLabel: { formatter: '{value}%', fontFamily: CHART_FONT }, splitLine: { lineStyle: { color: '#f1f5f9' } } },
      series: [{
        type: 'bar', data: D.yoyGrowth.map((y: any) => y.growth),
        label: { show: true, position: 'top', formatter: '{c}%', fontFamily: CHART_FONT, fontWeight: 'bold', color: 'inherit' },
        itemStyle: {
          borderRadius: [4, 4, 0, 0],
          color: (params: any) => params.value >= 0 ? '#10b981' : '#ef4444' // Emerald for positive, Red for negative
        }
      }]
    };
  }, [D.yoyGrowth]);

  // ── 13. Seasonality ───────────────────────
  const seasonalityOption = useMemo(() => {
    if (!D.seasonality) return {};
    return {
      tooltip: { trigger: 'item', formatter: '{b}: {c}B ({d}%)', textStyle: { fontFamily: CHART_FONT } },
      legend: { bottom: 0, textStyle: { fontFamily: CHART_FONT } },
      series: [{
        type: 'pie', radius: ['40%', '70%'],
        itemStyle: { borderRadius: 8, borderColor: '#fff', borderWidth: 2 },
        label: { fontFamily: CHART_FONT, formatter: '{b}\n{d}%', fontWeight: 'bold' },
        data: D.seasonality.quarters.map((q: string, i: number) => ({
          name: q, value: D.seasonality.total_B[i], itemStyle: { color: PALETTE[i % PALETTE.length] }
        }))
      }]
    };
  }, [D.seasonality]);

  // ── 14. Top Cities 5 Years ────────────────
  const topCities5Option = useMemo(() => {
    if (!D.topCities5Years) return {};
    return {
      tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' }, textStyle: { fontFamily: CHART_FONT } },
      grid: { left: 100, right: 60, top: 10, bottom: 20 },
      xAxis: { type: 'value', axisLabel: { formatter: (v: number) => v + 'B', fontFamily: CHART_FONT }, splitLine: { lineStyle: { color: '#f1f5f9' } } },
      yAxis: { type: 'category', data: [...D.topCities5Years.cities].reverse(), axisLabel: { fontSize: 11, fontFamily: CHART_FONT } },
      series: [{
        type: 'bar', data: [...D.topCities5Years.total_B].reverse(),
        label: { show: true, position: 'right', formatter: (p: any) => p.value + 'B', fontSize: 11, color: '#475569' },
        itemStyle: {
          borderRadius: [0, 8, 8, 0],
          color: (p: any) => PALETTE[p.dataIndex % PALETTE.length]
        }
      }]
    };
  }, [D.topCities5Years]);

  // ── 15. Heatmap Year x Quarter ────────────
  const yqHmMax = useMemo(() => D.heatmapYearQuarter ? Math.max(...D.heatmapYearQuarter.data.map((d: number[]) => d[2])) : 0, [D.heatmapYearQuarter]);
  const heatmapYQOption = useMemo(() => {
    if (!D.heatmapYearQuarter) return {};
    return {
      tooltip: {
        textStyle: { fontFamily: CHART_FONT },
        formatter: (p: any) => `<b>${D.heatmapYearQuarter.years[p.data[0]]}</b> - ${D.heatmapYearQuarter.quarters[p.data[1]]}<br/>السيولة: <b>${p.data[2].toLocaleString()} مليار</b>`
      },
      grid: { left: 60, right: 40, top: 20, bottom: 60 },
      xAxis: { type: 'category', data: D.heatmapYearQuarter.years, axisLabel: { fontFamily: CHART_FONT, fontWeight: 'bold' } },
      yAxis: { type: 'category', data: D.heatmapYearQuarter.quarters, axisLabel: { fontFamily: CHART_FONT, fontWeight: 'bold' } },
      visualMap: {
        min: 0, max: yqHmMax, calculable: true, orient: 'horizontal',
        left: 'center', bottom: 0, inRange: { color: ['#f8fafc', '#bae6fd', '#3b82f6', '#1e3a8a'] }
      },
      series: [{
        type: 'heatmap', data: D.heatmapYearQuarter.data,
        label: { show: true, fontSize: 11, color: '#334155', formatter: (p: any) => p.data[2] > 0 ? p.data[2].toFixed(1) + 'B' : '' },
        emphasis: { itemStyle: { shadowBlur: 10, shadowColor: 'rgba(59,130,246,0.5)' } }
      }]
    };
  }, [D.heatmapYearQuarter, yqHmMax]);

  const tabs = [
    { key: 'overview', label: 'نظرة عامة', icon: LayoutDashboard },
    { key: 'regions',  label: 'تحليل منطقي', icon: Map },
    { key: 'advanced', label: 'التحليل المتعمق', icon: Sparkles },
    { key: 'georadar', label: 'الرادار الجغرافي', icon: Globe },
    { key: 'longterm', label: 'المدى الطويل (5 سنوات)', icon: History },
  ] as const;

  return (
    <div className="min-h-screen bg-slate-50 font-['IBM_Plex_Sans_Arabic']" dir="rtl">

      {/* ── Header ── */}
      <div className="bg-gradient-to-l from-slate-900 via-blue-950 to-slate-900 text-white px-8 py-8">
        <div className="max-w-screen-2xl mx-auto">
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-blue-500/20 border border-blue-400/30 rounded-2xl flex items-center justify-center backdrop-blur">
                  <LayoutTemplate size={20} className="text-blue-300" />
                </div>
                <span className="text-blue-300 text-xs font-bold uppercase tracking-widest">ECharts Analytics Engine</span>
              </div>
              <h1 className="text-3xl font-black tracking-tight">لوحة التحليلات العقارية المتقدمة</h1>
              <p className="text-slate-400 text-sm mt-1">بيانات حقيقية من قاعدة بيانات MySQL — السوق السعودي 2024</p>
            </div>
            <div className="flex gap-2 items-center flex-wrap">
              <span className="bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-bold px-3 py-1.5 rounded-full">
                ✅ MySQL Connected
              </span>
              <span className="bg-blue-500/20 border border-blue-500/30 text-blue-300 text-xs font-bold px-3 py-1.5 rounded-full">
                {kpi.total_txn?.toLocaleString()} صفقة
              </span>
              <button className="flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all">
                <RefreshCw size={14} /> تحديث البيانات
              </button>
            </div>
          </div>

          {/* KPI Strip */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mt-6">
            {[
              { label: 'إجمالي السيولة', val: kpi.total_price_B?.toFixed(1) + ' مليار', icon: Banknote },
              { label: 'عدد الصفقات', val: kpi.total_txn?.toLocaleString(), icon: ClipboardList },
              { label: 'متوسط السعر', val: kpi.avg_price_M?.toFixed(2) + 'M ريال', icon: TrendingUp },
              { label: 'أعلى صفقة', val: kpi.max_price_M?.toFixed(1) + 'M ريال', icon: Award },
              { label: 'متوسط المساحة', val: kpi.avg_area?.toFixed(0) + ' م²', icon: Maximize },
              { label: 'سعر المتر', val: kpi.price_per_sqm?.toFixed(0) + ' ريال', icon: MapPin },
            ].map((k, i) => (
              <div key={i} className="bg-white/5 border border-white/10 rounded-2xl px-4 py-3 flex items-center gap-3 hover:bg-white/10 transition-colors">
                <k.icon size={20} className="text-blue-400" />
                <div>
                  <p className="text-white font-black text-sm">{k.val}</p>
                  <p className="text-slate-400 text-[10px] font-medium">{k.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Tab Nav ── */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-screen-2xl mx-auto px-8">
          <div className="flex gap-1">
            {tabs.map(t => (
              <button key={t.key} onClick={() => setActiveTab(t.key)}
                className={`flex items-center gap-2 px-5 py-4 text-sm font-bold border-b-2 transition-all ${
                  activeTab === t.key
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'
                }`}>
                <t.icon size={16} />
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Content ── */}
      <div className="max-w-screen-2xl mx-auto px-8 py-8">

        {/* ═══ TAB 1: OVERVIEW ════════════════════════════════ */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Row 1: Full-width Liquidity Chart */}
            <ChartCard
              title="مسار السيولة الربعي مع حجم الصفقات"
              icon={LineChart}
              subtitle="خط السيولة (مليار ريال) + أعمدة عدد الصفقات — محوران مستقلان"
              colSpan={2}
            >
              <ReactECharts option={liquidityOption} style={{ height: 320 }} notMerge />
            </ChartCard>

            {/* Row 2: Donut + Price Range Rose */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ChartCard title="توزيع تصنيفات العقارات" icon={Home} subtitle="الدونات حسب عدد الصفقات لكل نوع">
                <ReactECharts option={donutOption} style={{ height: 300 }} notMerge />
              </ChartCard>
              <ChartCard title="توزيع نطاقات الأسعار" icon={Banknote} subtitle="Rose / Nightingale — نسبة كل شريحة سعرية">
                <ReactECharts option={priceRangeOption} style={{ height: 300 }} notMerge />
              </ChartCard>
            </div>

            {/* Row 3: Avg Price Area + Top Cities */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ChartCard title="تطور متوسط سعر الصفقة ربعياً" icon={TrendingDown} subtitle="Area Chart — مليون ريال مع خط المتوسط السنوي">
                <ReactECharts option={avgPriceOption} style={{ height: 300 }} notMerge />
              </ChartCard>
              <ChartCard title="أعلى 10 مدن حسب السيولة" icon={Building2} subtitle="Horizontal Bars — المليار ريال">
                <ReactECharts option={cityOption} style={{ height: 300 }} notMerge />
              </ChartCard>
            </div>
          </div>
        )}

        {/* ═══ TAB 2: REGIONS ═════════════════════════════════ */}
        {activeTab === 'regions' && (
          <div className="space-y-8">
            {/* Region Horizontal Bar */}
            <ChartCard title="أعلى 8 مناطق حسب السيولة" icon={Map} subtitle="Bar أفقي — المليار ريال" colSpan={2}>
              <ReactECharts option={regionBarOption} style={{ height: 340 }} notMerge />
            </ChartCard>

            {/* Radar + Q Comparison */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ChartCard title="مقارنة أداء المناطق الكبرى" icon={Radar} subtitle="Radar Chart — 4 مؤشرات منسوبة لأعلى قيمة">
                <ReactECharts option={radarOption} style={{ height: 380 }} notMerge />
              </ChartCard>
              <ChartCard title="مقارنة Q1 مقابل Q4 حسب المنطقة" icon={BarChart} subtitle="Grouped Column — بداية السنة ونهايتها">
                <ReactECharts option={qCompOption} style={{ height: 380 }} notMerge />
              </ChartCard>
            </div>

            {/* Heatmap full width */}
            <ChartCard
              title="خريطة الحرارة: كثافة الصفقات (المنطقة × نوع العقار)"
              icon={Flame}
              subtitle="Heatmap — الأكثر تركيزاً يظهر بالأزرق الداكن"
              colSpan={2}
            >
              <ReactECharts option={heatmapOption} style={{ height: 360 }} notMerge />
            </ChartCard>
          </div>
        )}

        {/* ═══ TAB 3: ADVANCED ════════════════════════════════ */}
        {activeTab === 'advanced' && (
          <div className="space-y-8">
            {/* Scatter full width */}
            <ChartCard
              title="تحليل الارتباط: المساحة × السعر (300 عينة)"
              icon={Circle}
              subtitle="Bubble Scatter مقسّم حسب نوع العقار — حجم الدائرة يعكس قيمة الصفقة"
              colSpan={2}
            >
              <ReactECharts option={scatterOption} style={{ height: 420 }} notMerge />
            </ChartCard>

            {/* Insights Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {D.propertyTypes.slice(0, 3).map((pt: any, i: number) => (
                <div key={i} className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 flex flex-col gap-3 hover:shadow-lg transition-all">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black uppercase tracking-widest text-slate-400">{pt.name}</span>
                    <span className="text-xs font-bold px-2 py-1 rounded-full bg-blue-50 text-blue-600">{pt.pct.toFixed(1)}٪ من السيولة</span>
                  </div>
                  <p className="text-2xl font-black text-slate-900">{pt.total_B.toFixed(2)}<span className="text-sm font-bold text-slate-400 ms-1">مليار</span></p>
                  <div className="w-full bg-slate-100 rounded-full h-2">
                    <div className="h-2 rounded-full" style={{ width: pt.pct + '%', background: PALETTE[i] }} />
                  </div>
                  <p className="text-xs text-slate-400">{pt.count.toLocaleString()} صفقة · متوسط {pt.avg_M.toFixed(2)}M ريال</p>
                </div>
              ))}
            </div>

            {/* Summary Table */}
            <ChartCard title="ملخص تحليلي شامل للمناطق" icon={ClipboardList} subtitle="جدول مقارنة بكافة المؤشرات" colSpan={2}>
              <div className="overflow-x-auto mt-2">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-100">
                      {['المنطقة', 'السيولة (مليار)', 'عدد الصفقات', 'متوسط السعر (M)', 'متوسط المساحة (م²)'].map(h => (
                        <th key={h} className="text-right py-3 px-4 font-black text-slate-500 text-xs uppercase tracking-wide">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {D.regionMulti.regions.map((r: string, i: number) => (
                      <tr key={i} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                        <td className="py-3 px-4 font-bold text-slate-800 flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full inline-block" style={{ background: PALETTE[i] }} />
                          {r}
                        </td>
                        <td className="py-3 px-4 font-bold text-blue-600">{D.regionMulti.price_B[i]?.toFixed(2)}</td>
                        <td className="py-3 px-4 text-slate-600">{D.regionMulti.count[i]?.toLocaleString()}</td>
                        <td className="py-3 px-4 text-slate-600">{D.regionMulti.avg_price_M[i]?.toFixed(2)}</td>
                        <td className="py-3 px-4 text-slate-600">{D.regionMulti.avg_area_M[i]?.toFixed(1)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </ChartCard>
          </div>
        )}

        {/* ═══ TAB 4: LONG TERM ═══════════════════════════════ */}
        {activeTab === 'longterm' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Multi-Year Trend */}
            <ChartCard
              title="السيولة وحجم التداول عبر 5 سنوات (2020 - 2024)"
              icon={LineChart}
              subtitle="رسم بياني مركب (Line & Bar) لتتبع السياسة النقدية والنشاط"
              colSpan={2}
            >
              <ReactECharts option={multiYearOption} style={{ height: 360 }} notMerge />
            </ChartCard>

            {/* YoY Growth + Seasonality */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ChartCard title="معدل النمو السنوي (Year-over-Year)" icon={TrendingUp} subtitle="نسبة نمو أو تراجع السيولة مقارنة بالسنة السابقة">
                <ReactECharts option={yoyOption} style={{ height: 320 }} notMerge />
              </ChartCard>
              <ChartCard title="التركيز الموسمي عبر جميع السنوات" icon={PieChart} subtitle="الأرباع الأكثر سيولة تاريخياً (Seasonality)">
                <ReactECharts option={seasonalityOption} style={{ height: 320 }} notMerge />
              </ChartCard>
            </div>

            {/* Top Cities 5 Years */}
            <ChartCard title="أقوى المدن تأثيراً في سيولة الـ 5 سنوات" icon={Building2} subtitle="إجمالي مليارات الريالات مجمعة للـ Top 10" colSpan={2}>
              <ReactECharts option={topCities5Option} style={{ height: 340 }} notMerge />
            </ChartCard>

            {/* Heatmap Year x Quarter */}
            <ChartCard title="خريطة الحرارة الزمنية: ذروات السوق العقاري" icon={Flame} subtitle="تركيز السيولة (مليار) عبر التقاطع بين السنة والربع" colSpan={2}>
              <ReactECharts option={heatmapYQOption} style={{ height: 360 }} notMerge />
            </ChartCard>
          </div>
        )}
  
        {/* ═══ TAB 5: GEOGRAPHIC RADAR ════════════════════════ */}
        {activeTab === 'georadar' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 rounded-3xl overflow-hidden border border-slate-200">
            <MapDashboard />
          </div>
        )}

      </div>

      {/* ── Footer ── */}
      <div className="bg-slate-900 text-slate-400 text-center text-xs py-4 mt-8">
        البيانات مستخرجة من قاعدة بيانات MySQL · سجلات عقارية المملكة العربية السعودية 2020-2024 · ECharts 5
      </div>
    </div>
  );
};

export default DashboardTest;
