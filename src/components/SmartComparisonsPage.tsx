import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
  LineChart, Line, AreaChart, Area, ComposedChart, Scatter
} from 'recharts';
import {
  GitCompare, ArrowUpRight, ArrowDownRight, Clock, MapPin, Briefcase,
  Search, Download, Bookmark, Sparkles, SlidersHorizontal, CheckCircle2, X,
  Settings2, Scale, Calendar, Plus, ChevronDown, Activity, Flame, TrendingUp, Info,
  ZoomIn, ZoomOut, Move, Maximize, Grid3X3, LineChart as LineChartIcon, BarChart3,
  Share2, FileText, Image as ImageIcon, FileSpreadsheet, Link2, Copy, Trash2, Edit3, Save,
  Globe, Zap, Star, Target
} from 'lucide-react';
import { useToast } from './Toast';

// --- Multi-dimensional Mock Data ---

// 1. Periods Data
const DATA_PERIODS = {
  kpis: [
    { title: 'كثافة الإشارات', current: '2,890', change: '+133%', isUp: true },
    { title: 'أحجام التداول (م)', current: '890.5', change: '+98%', isUp: true },
    { title: 'معدل النشاط العام', current: '82.4%', change: '+17%', isUp: true },
  ],
  chart: [
    { name: 'يناير', previous: 4000, current: 6000, predict: 7200 },
    { name: 'فبراير', previous: 3000, current: 5500, predict: 6100 },
    { name: 'مارس', previous: 2000, current: 8000, predict: 9400 },
    { name: 'أبريل', previous: 2780, current: 3908, predict: 4500 },
    { name: 'مايو', previous: 1890, current: 4800, predict: 5200 },
    { name: 'يونيو', previous: 2390, current: 3800, predict: 4100 },
  ],
  heatmapData: [
    { sector: 'البنوك', activity: 85, growth: 12, risk: 'منخفض' },
    { sector: 'التقنية', activity: 92, growth: 28, risk: 'متوسط' },
    { sector: 'الطاقة', activity: 78, growth: 8, risk: 'منخفض' },
    { sector: 'العقار', activity: 65, growth: 15, risk: 'مرتفع' },
    { sector: 'الاتصالات', activity: 71, growth: 10, risk: 'منخفض' },
    { sector: 'التجزئة', activity: 58, growth: 22, risk: 'متوسط' },
  ],
  trendData: [
    { month: 'يناير', value: 4000, trend: 4200, forecast: 4500 },
    { month: 'فبراير', value: 4500, trend: 4800, forecast: 5200 },
    { month: 'مارس', value: 5200, trend: 5500, forecast: 6000 },
    { month: 'أبريل', value: 5800, trend: 6200, forecast: 6800 },
    { month: 'مايو', value: 6500, trend: 7000, forecast: 7600 },
    { month: 'يونيو', value: 7200, trend: 7800, forecast: 8500 },
  ],
  table: [
    { id: 1, metric: 'عدد إشارات التداول', prev: '1,240', curr: '2,890', change: '+133%', isPositive: true },
    { id: 2, metric: 'أحجام التداول (بالملايين)', prev: '450', curr: '890', change: '+98%', isPositive: true },
    { id: 3, metric: 'معدل النشاط', prev: '65%', curr: '82%', change: '+17%', isPositive: true },
    { id: 4, metric: 'زمن الاستجابة (مللي ثانية)', prev: '120', curr: '145', change: '+20%', isPositive: false },
  ],
  legend: { prev: 'الفترة السابقة', curr: 'الفترة الحالية' },
  aiText: 'تشير البيانات المستخلصة إلى نمو استثنائي بنسبة 133% في الإشارات مقارنة بالفترة السابقة. الأداء الزمني يظهر تصاعداً ملحوظاً.'
};

// 2. Sectors Data
const DATA_SECTORS = {
  kpis: [
    { title: 'إشارات البنوك vs التقنية', current: '4,500', change: '+45%', isUp: true },
    { title: 'حجم السيولة المقارن (م)', current: '1,200', change: '-12%', isUp: false },
    { title: 'مؤشر التذبذب المتوقع', current: '%4.2', change: '+5%', isUp: false },
  ],
  chart: [
    { name: 'السيولة', previous: 7500, current: 5200, predict: 4800 },
    { name: 'التذبذب', previous: 3200, current: 6100, predict: 7500 },
    { name: 'نمو الأرباح', previous: 4800, current: 8900, predict: 10500 },
    { name: 'حجم العقود', previous: 6100, current: 3500, predict: 4200 },
    { name: 'أوامر الشراء', previous: 8900, current: 9200, predict: 11000 },
  ],
  heatmapData: [
    { sector: 'البنوك', activity: 88, growth: 15, risk: 'منخفض' },
    { sector: 'التقنية', activity: 95, growth: 32, risk: 'مرتفع' },
    { sector: 'البتروكيماويات', activity: 72, growth: 8, risk: 'متوسط' },
    { sector: 'الرعاية الصحية', activity: 81, growth: 25, risk: 'منخفض' },
    { sector: 'الإسكان', activity: 69, growth: 18, risk: 'متوسط' },
    { sector: 'النقل', activity: 63, growth: 20, risk: 'مرتفع' },
  ],
  trendData: [
    { month: 'يناير', value: 5000, trend: 5200, forecast: 5500 },
    { month: 'فبراير', value: 5400, trend: 5700, forecast: 6100 },
    { month: 'مارس', value: 5900, trend: 6300, forecast: 6800 },
    { month: 'أبريل', value: 6500, trend: 7000, forecast: 7600 },
    { month: 'مايو', value: 7200, trend: 7800, forecast: 8500 },
    { month: 'يونيو', value: 8000, trend: 8700, forecast: 9500 },
  ],
  table: [
    { id: 1, metric: 'العوائد التوزيعية', prev: '4.5%', curr: '2.1%', change: '-53%', isPositive: false },
    { id: 2, metric: 'مكرر الربحية', prev: '14.2', curr: '22.5', change: '+58%', isPositive: true },
    { id: 3, metric: 'عدد الصفقات الكبرى', prev: '320', curr: '510', change: '+59%', isPositive: true },
    { id: 4, metric: 'نسبة المخاطرة', prev: 'متوسطة', curr: 'عالية', change: 'صعود', isPositive: false },
  ],
  legend: { prev: 'قطاع البنوك', curr: 'قطاع التقنية' },
  aiText: 'يتفوق قطاع التقنية حالياً في النمو المباشر (مكرر الربحية)، بينما يحافظ قطاع البنوك على استقرار وثبات العوائد التوزيعية.'
};

// 3. Regions Data
const DATA_REGIONS = {
  kpis: [
    { title: 'إجمالي الاستثمار (مليار)', current: '12.4', change: '+23%', isUp: true },
    { title: 'تدفقات أجنبية', current: '8.2', change: '+41%', isUp: true },
    { title: 'تكلفة الفرصة المفقودة', current: '1.1', change: '-8%', isUp: true },
  ],
  chart: [
    { name: 'الربع الأول', previous: 300, current: 400, predict: 450 },
    { name: 'الربع الثاني', previous: 450, current: 380, predict: 410 },
    { name: 'الربع الثالث', previous: 500, current: 650, predict: 780 },
    { name: 'الربع الرابع', previous: 620, current: 890, predict: 1100 },
  ],
  heatmapData: [
    { sector: 'الرياض', activity: 92, growth: 25, risk: 'منخفض' },
    { sector: 'جدة', activity: 78, growth: 18, risk: 'متوسط' },
    { sector: 'الشرقية', activity: 85, growth: 22, risk: 'منخفض' },
    { sector: 'نيوم', activity: 96, growth: 45, risk: 'مرتفع' },
    { sector: 'القصيم', activity: 62, growth: 12, risk: 'منخفض' },
    { sector: 'عسير', activity: 58, growth: 15, risk: 'متوسط' },
  ],
  trendData: [
    { month: 'Q1', value: 350, trend: 370, forecast: 400 },
    { month: 'Q2', value: 420, trend: 450, forecast: 490 },
    { month: 'Q3', value: 580, trend: 620, forecast: 680 },
    { month: 'Q4', value: 750, trend: 800, forecast: 880 },
  ],
  table: [
    { id: 1, metric: 'قوة العملة (مؤشر)', prev: '102.5', curr: '98.4', change: '-4%', isPositive: false },
    { id: 2, metric: 'التضخم الأساسي', prev: '3.1%', curr: '2.5%', change: '-19%', isPositive: true },
    { id: 3, metric: 'ثقة المستهلك', prev: '85', curr: '92', change: '+8%', isPositive: true },
    { id: 4, metric: 'نمو الناتج المحلي', prev: '2.1%', curr: '3.4%', change: '+61%', isPositive: true },
  ],
  legend: { prev: 'السوق الأمريكي', curr: 'السوق السعودي' },
  aiText: 'يُظهر السوق المحلي (السعودي) متانة ملحوظة أمام ضغوط التضخم العالمية، متفوقاً في معدلات ثقة المستهلك ونمو الناتج المحلي الإجمالي مقارنة بالسوق الأمريكي.'
};

// Top Performer Data for Blind Mode
const DATA_TOP_PERFORMER = {
  kpis: [
    { title: 'فرق الأداء عن محفظتك', current: '+42%', isUp: true },
    { title: 'مؤشر النمو الصافي', current: '94.2%', isUp: true },
    { title: 'عامل المخاطرة', current: 'منخفض', isUp: true },
  ],
  chart: [
    { name: '1', previous: 4000, current: 6000, predict: 7200 },
    { name: '2', previous: 3000, current: 5500, predict: 6800 },
    { name: '3', previous: 2000, current: 8000, predict: 8500 },
    { name: '4', previous: 2780, current: 3908, predict: 5100 },
    { name: '5', previous: 1890, current: 4800, predict: 5900 },
    { name: '6', previous: 2390, current: 3800, predict: 4500 },
  ],
  heatmapData: [
    { sector: 'الأداء الأفضل', activity: 98, growth: 42, risk: 'متوسط' },
    { sector: 'محفظتك', activity: 65, growth: 18, risk: 'منخفض' },
    { sector: 'متوسط السوق', activity: 72, growth: 22, risk: 'متوسط' },
    { sector: 'المؤشر العام', activity: 78, growth: 25, risk: 'منخفض' },
  ],
  trendData: [
    { month: '1', value: 4000, trend: 4500, forecast: 5000 },
    { month: '2', value: 4800, trend: 5400, forecast: 6000 },
    { month: '3', value: 5700, trend: 6400, forecast: 7200 },
    { month: '4', value: 6700, trend: 7500, forecast: 8500 },
    { month: '5', value: 7800, trend: 8700, forecast: 9900 },
    { month: '6', value: 9000, trend: 10000, forecast: 11500 },
  ],
  table: [
    { id: 1, metric: 'العائد المتوقع (30 يوم)', prev: '12%', curr: '42%', change: '+300%', isPositive: true, isAnomaly: true },
    { id: 2, metric: 'نسبة الاستحواذ المؤسسي', prev: '65%', curr: '91%', change: '+40%', isPositive: true },
  ],
  legend: { prev: 'محفظتك الحالية', curr: 'الأداء الأفضل في السوق' },
  aiText: 'محرك الرادار اكتشف انحرافاً إيجابياً ضخماً في قطاع معين يتجاوز أداء محفظتك بنسبة 42% حالياً.'
};

const SUGGESTED_COMPARISONS = [
  { id: 'sc1', title: 'البنوك vs التقنية', type: 'sector', icon: Briefcase },
  { id: 'sc2', title: 'أداء 2024 vs 2023', type: 'period', icon: Clock },
  { id: 'sc3', title: 'السوق السعودي vs الأمريكي', type: 'region', icon: MapPin },
];

// Enhanced Suggested Comparisons with details for each tab
const SECTOR_SUGGESTIONS = [
  {
    id: 'sector_1',
    title: 'البنوك vs التقنية',
    description: 'قارن بين قطاعي البنوك والتقنية لمعرفة الأفضل أداءً',
    icon: Briefcase,
    color: 'blue',
    popular: true,
    preset: { sectorPair: 'banks_tech' }
  },
  {
    id: 'sector_2',
    title: 'البتروكيماويات vs الاتصالات',
    description: 'مقارنة شاملة لقطاعي الطاقة والاتصالات',
    icon: Activity,
    color: 'orange',
    popular: true,
    preset: { sectorPair: 'petro_telecom' }
  },
  {
    id: 'sector_3',
    title: 'العقار vs الرعاية الصحية',
    description: 'تحليل قطاعي العقار والصحة للأداء والنمو',
    icon: TrendingUp,
    color: 'emerald',
    popular: false,
    preset: { sectorPair: 'real_health' }
  },
  {
    id: 'sector_4',
    title: 'التجزئة vs الصناعة',
    description: 'مقارنة قطاعي التجزئة والتصنيع الصناعي',
    icon: BarChart3,
    color: 'purple',
    popular: false,
    preset: { sectorPair: 'retail_industrial' }
  }
];

const PERIOD_SUGGESTIONS = [
  {
    id: 'period_1',
    title: 'الربع الحالي vs الربع السابق',
    description: 'مقارنة ربع سنوية قصيرة الأجل',
    icon: Clock,
    color: 'blue',
    popular: true,
    preset: { period: '3m' }
  },
  {
    id: 'period_2',
    title: 'الـ 6 أشهر الحالية',
    description: 'نصف سنوي شامل مع تنبؤات',
    icon: Calendar,
    color: 'indigo',
    popular: true,
    preset: { period: '6m' }
  },
  {
    id: 'period_3',
    title: 'العام الحالي vs العام السابق',
    description: 'مقارنة سنوية شاملة للأداء',
    icon: Calendar,
    color: 'emerald',
    popular: false,
    preset: { period: '1y' }
  },
  {
    id: 'period_4',
    title: 'نطاق مخصص',
    description: 'اختر الفترات الزمنية يدوياً',
    icon: Settings2,
    color: 'slate',
    popular: false,
    preset: { period: 'custom' }
  }
];

const REGION_SUGGESTIONS = [
  {
    id: 'region_1',
    title: 'السوق السعودي vs الأمريكي',
    description: 'مقارنة قوة السوق المحلي بالعالمي',
    icon: MapPin,
    color: 'blue',
    popular: true,
    preset: { regionPair: 'sa_us' }
  },
  {
    id: 'region_2',
    title: 'السوق المحلي vs الخليجي',
    description: 'مقارنة السعودية بأسواق الخليج',
    icon: Globe,
    color: 'indigo',
    popular: true,
    preset: { regionPair: 'local_gcc' }
  },
  {
    id: 'region_3',
    title: 'الأسواق الأوروبية vs الآسيوية',
    description: 'تحليل الأسواق العالمية الكبرى',
    icon: TrendingUp,
    color: 'emerald',
    popular: false,
    preset: { regionPair: 'eu_asia' }
  },
  {
    id: 'region_4',
    title: 'الأسواق الناشئة',
    description: 'مقارنة الأسواق الناشئة عالمياً',
    icon: Activity,
    color: 'orange',
    popular: false,
    preset: { regionPair: 'emerging' }
  }
];

const SmartComparisonsPage = () => {
  const [activeTab, setActiveTab] = useState<'periods'|'sectors'|'regions'>('periods');
  const [activePeriod, setActivePeriod] = useState('6m');
  const [activeSectorPair, setActiveSectorPair] = useState('banks_tech');
  const [activeRegionPair, setActiveRegionPair] = useState('sa_us');
  const [isComparing, setIsComparing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [chartView, setChartView] = useState('aggregated');
  const [isExporting, setIsExporting] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isBlindMode, setIsBlindMode] = useState(false);
  const [showPrediction, setShowPrediction] = useState(false);
  const [isPredicting, setIsPredicting] = useState(false);

  // Advanced Features State
  const [selectedMetrics, setSelectedMetrics] = useState(['trading_signals', 'volume']);
  const [weights, setWeights] = useState({ signals: 50, volume: 30, activity: 20 });
  const [customRange, setCustomRange] = useState({ start: '', end: '' });
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [activeSmartFilter, setActiveSmartFilter] = useState('none');
  const [showKPIExplanation, setShowKPIExplanation] = useState<number | null>(null);

  // Enhanced Visualization State
  const [chartType, setChartType] = useState<'bar'|'line'|'area'|'composed'>('bar');
  const [xAxisMetric, setXAxisMetric] = useState('name');
  const [yAxisMetric, setYAxisMetric] = useState('current');
  const [showZoomControls, setShowZoomControls] = useState(true);
  const [chartZoom, setChartZoom] = useState({ x: [0, 1], y: [0, 1] });
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [showTrendLines, setShowTrendLines] = useState(false);
  const [activeTooltipData, setActiveTooltipData] = useState<any>(null);
  const [heatmapMetric, setHeatmapMetric] = useState<'activity'|'growth'|'risk'>('activity');

  // Save & Share Features State
  const [savedComparisons, setSavedComparisons] = useState<any[]>([]);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [showSavedList, setShowSavedList] = useState(false);
  const [comparisonName, setComparisonName] = useState('');
  const [comparisonDescription, setComparisonDescription] = useState('');
  const [exportFormat, setExportFormat] = useState<'pdf'|'excel'|'image'>('pdf');
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareLink, setShareLink] = useState('');
  const [sharePermissions, setSharePermissions] = useState<'view'|'edit'>('view');

  const { showToast } = useToast();
  const chartRef = useRef<HTMLDivElement>(null);

  // Load saved comparisons on mount
  useEffect(() => {
    const saved = localStorage.getItem('savedComparisons');
    if (saved) {
      try {
        setSavedComparisons(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to load saved comparisons:', e);
      }
    }
  }, []);

  // Save & Share Handler Functions
  const handleSaveComparison = () => {
    if (!comparisonName.trim()) {
      showToast('الرجاء إدخال اسم للمقارنة', 'error');
      return;
    }

    const newComparison = {
      id: Date.now().toString(),
      name: comparisonName,
      description: comparisonDescription,
      tab: activeTab,
      period: activePeriod,
      sectorPair: activeSectorPair,
      regionPair: activeRegionPair,
      chartType,
      showHeatmap,
      showTrendLines,
      showPrediction,
      heatmapMetric,
      createdAt: new Date().toISOString(),
      data: activeData,
    };

    const updated = [...savedComparisons, newComparison];
    setSavedComparisons(updated);
    localStorage.setItem('savedComparisons', JSON.stringify(updated));
    
    setShowSaveModal(false);
    setComparisonName('');
    setComparisonDescription('');
    showToast('تم حفظ المقارنة بنجاح', 'success');
  };

  const handleDeleteComparison = (id: string) => {
    const updated = savedComparisons.filter(c => c.id !== id);
    setSavedComparisons(updated);
    localStorage.setItem('savedComparisons', JSON.stringify(updated));
    showToast('تم حذف المقارنة', 'success');
  };

  const handleLoadComparison = (comparison: any) => {
    setActiveTab(comparison.tab);
    setActivePeriod(comparison.period);
    setActiveSectorPair(comparison.sectorPair);
    setActiveRegionPair(comparison.regionPair);
    setChartType(comparison.chartType);
    setShowHeatmap(comparison.showHeatmap);
    setShowTrendLines(comparison.showTrendLines);
    setShowPrediction(comparison.showPrediction);
    setHeatmapMetric(comparison.heatmapMetric);
    setShowSavedList(false);
    showToast('تم تحميل المقارنة بنجاح', 'success');
  };

  const handleExport = async (format?: 'pdf'|'excel'|'image') => {
    const exportFmt = format || exportFormat;
    if (isExporting) return;
    
    setIsExporting(true);
    
    // Simulate export process
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    let message = '';
    switch(exportFmt) {
      case 'pdf':
        message = 'تم تصدير التقرير بصيغة PDF بنجاح';
        break;
      case 'excel':
        message = 'تم تصدير البيانات بصيغة Excel بنجاح';
        break;
      case 'image':
        message = 'تم حفظ الصورة بدقة عالية بنجاح';
        break;
    }
    
    setIsExporting(false);
    showToast(message, 'success');
  };

  const handleShare = () => {
    const shareUrl = `${window.location.origin}/compare/${activeTab}/${Date.now().toString(36)}`;
    setShareLink(shareUrl);
    setShowShareModal(true);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareLink);
    showToast('تم نسخ الرابط بنجاح', 'success');
  };

  const handleQuickSuggestion = (type: string, preset: any) => {
    if (type === 'period') {
      setActivePeriod(preset.period);
    } else if (type === 'sector') {
      setActiveSectorPair(preset.sectorPair);
    } else if (type === 'region') {
      setActiveRegionPair(preset.regionPair);
    }
    handleCompare();
    showToast('جاري توليد المقارنة...', 'success');
  };

  const handleCompare = () => {
    if (isComparing) return;
    setIsComparing(true);
    setTimeout(() => {
      setIsComparing(false);
      showToast('تم تحديث بيانات المقارنة بنجاح وعرض النتائج', 'success');
    }, 1000);
  };

  const handleAction = (actionName: string) => {
    // Action handler placeholder (no active notifications)
  };

  const handleSuggestionClick = (type: string, id: string) => {
    if (type === 'period') {
      setActiveTab('periods');
      setActivePeriod('1y');
    } else if (type === 'sector') {
      setActiveTab('sectors');
      setActiveSectorPair('banks_tech');
    } else {
      setActiveTab('regions');
      setActiveRegionPair('sa_us');
    }
    handleCompare();
  };

  // Enhanced Visualization Helper Functions
  const getHeatmapColor = (value: number, metric: string) => {
    if (metric === 'risk') {
      return value >= 80 ? '#f43f5e' : value >= 50 ? '#f59e0b' : '#10b981';
    }
    const intensity = Math.min(value / 100, 1);
    if (intensity > 0.8) return `rgba(59, 130, 246, ${0.9})`;
    if (intensity > 0.6) return `rgba(59, 130, 246, ${0.7})`;
    if (intensity > 0.4) return `rgba(59, 130, 246, ${0.5})`;
    if (intensity > 0.2) return `rgba(59, 130, 246, ${0.3})`;
    return `rgba(59, 130, 246, ${0.1})`;
  };

  const getRiskLevelColor = (risk: string) => {
    switch(risk) {
      case 'منخفض': return '#10b981';
      case 'متوسط': return '#f59e0b';
      case 'مرتفع': return '#f43f5e';
      default: return '#64748b';
    }
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900 border border-slate-700 rounded-xl p-4 shadow-2xl animate-fadeIn">
          <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">{label}</p>
          <div className="space-y-2">
            {payload.map((entry: any, index: number) => (
              <div key={index} className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }}></div>
                  <span className="text-xs font-bold text-slate-300">{entry.name}</span>
                </div>
                <span className="text-sm font-black text-white" style={{ color: entry.color }}>
                  {typeof entry.value === 'number' ? entry.value.toLocaleString('ar-SA') : entry.value}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-3 pt-3 border-t border-slate-700">
            <div className="flex items-center gap-2 text-[10px] text-slate-400">
              <Activity size={12} />
              <span>التفاصيل الدقيقة للبيانات</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  const HeatmapComponent = ({ data, metric }: { data: any[], metric: string }) => {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 p-4">
        {data.map((item, idx) => (
          <div
            key={idx}
            className="relative rounded-xl p-4 transition-all duration-300 hover:scale-105 hover:shadow-lg cursor-pointer group"
            style={{ backgroundColor: getHeatmapColor(item[metric], metric) }}
          >
            <div className="text-[10px] font-bold text-white/80 uppercase tracking-widest mb-1">
              {item.sector}
            </div>
            <div className="text-2xl font-black text-white mb-1">
              {metric === 'activity' ? `${item.activity}%` : metric === 'growth' ? `${item.growth}%` : item.risk}
            </div>
            {metric !== 'risk' && (
              <div className="text-[9px] font-bold text-white/60">
                النمو: {item.growth}%
              </div>
            )}
            {metric === 'risk' && (
              <div className={`inline-block px-2 py-0.5 rounded-full text-[8px] font-black text-white ${
                item.risk === 'منخفض' ? 'bg-emerald-500/30' :
                item.risk === 'متوسط' ? 'bg-amber-500/30' : 'bg-rose-500/30'
              }`}>
                {item.risk}
              </div>
            )}
            
            {/* Hover overlay with more details */}
            <div className="absolute inset-0 bg-slate-900/90 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col items-center justify-center p-3">
              <div className="text-xs font-black text-white mb-2">{item.sector}</div>
              <div className="space-y-1 text-[9px] text-slate-300">
                <div className="flex justify-between gap-3">
                  <span>النشاط:</span>
                  <span className="font-bold">{item.activity}%</span>
                </div>
                <div className="flex justify-between gap-3">
                  <span>النمو:</span>
                  <span className="font-bold">{item.growth}%</span>
                </div>
                <div className="flex justify-between gap-3">
                  <span>المخاطرة:</span>
                  <span className="font-bold" style={{ color: getRiskLevelColor(item.risk) }}>{item.risk}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const TrendLinesComponent = ({ data }: { data: any[] }) => {
    return (
      <div className="h-[350px] w-full" dir="ltr">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <defs>
              <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="forecastGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
            <XAxis 
              dataKey="month" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#64748b', fontSize: 12, fontWeight: 700 }} 
              dy={10} 
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#64748b', fontSize: 12, fontWeight: 700 }} 
              dx={-10} 
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', fontWeight: 'bold', paddingTop: '20px' }} />
            <Area 
              type="monotone" 
              dataKey="value" 
              name="القيمة الفعلية" 
              stroke="#3b82f6" 
              strokeWidth={3}
              fill="url(#trendGradient)" 
            />
            <Line 
              type="monotone" 
              dataKey="trend" 
              name="خط الاتجاه" 
              stroke="#6366f1" 
              strokeWidth={2} 
              strokeDasharray="5 5"
              dot={false}
            />
            <Line 
              type="monotone" 
              dataKey="forecast" 
              name="التنبؤ المستقبلي" 
              stroke="#10b981" 
              strokeWidth={2} 
              strokeDasharray="3 3"
              dot={{ fill: '#10b981', r: 4 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    );
  };

  // Determine active data based on tab
  const getActiveData = () => {
    if (isBlindMode) return DATA_TOP_PERFORMER;
    if (activeTab === 'sectors') return DATA_SECTORS;
    if (activeTab === 'regions') return DATA_REGIONS;
    return DATA_PERIODS;
  };

  const activeData = getActiveData();

  // Filter table data based on search query
  const filteredTable = activeData.table.filter(row => 
    row.metric.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Render left sidebar menus based on tab
  const renderLeftSideSettings = () => {
    if (activeTab === 'periods') {
      return (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm animate-fadeIn">
          <h3 className="text-sm font-black text-slate-900 mb-4 flex items-center gap-2">
            <Clock size={16} className="text-slate-400" /> اختيار الفترات الزمنية
          </h3>
          <div className="space-y-3">
            {[
              { id: '6m', label: 'الـ 6 أشهر الحالية vs السابقة' },
              { id: '3m', label: 'الربع الحالي vs الربع السابق' },
              { id: '1y', label: 'العام الحالي vs العام السابق' },
            ].map(item => (
              <button
                key={item.id}
                onClick={() => setActivePeriod(item.id)}
                className={`w-full flex items-center justify-between p-4 rounded-xl border text-sm font-bold transition-all ${
                  activePeriod === item.id
                    ? 'bg-blue-50 border-blue-200 text-blue-700 ring-1 ring-blue-500'
                    : 'bg-white border-slate-200 text-slate-600 hover:border-blue-300'
                }`}
              >
                {item.label}
                {activePeriod === item.id && <CheckCircle2 size={16} className="text-blue-600" />}
              </button>
            ))}
            
            {/* Custom Range Option */}
            <div className="pt-2 border-t border-slate-100">
              <button 
                onClick={() => setActivePeriod('custom')}
                className={`w-full flex items-center justify-between p-4 rounded-xl border text-sm font-bold transition-all ${
                  activePeriod === 'custom'
                    ? 'bg-blue-50 border-blue-200 text-blue-700 ring-1 ring-blue-500'
                    : 'bg-white border-slate-200 text-slate-600 hover:border-blue-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Calendar size={16} /> نطاق مخصص...
                </div>
                {activePeriod === 'custom' && <CheckCircle2 size={16} className="text-blue-600" />}
              </button>
              
              {activePeriod === 'custom' && (
                <div className="mt-4 grid grid-cols-1 gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200 animate-slideDown">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">من تاريخ</label>
                    <input 
                      type="date" 
                      value={customRange.start}
                      onChange={(e) => setCustomRange({...customRange, start: e.target.value})}
                      className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs font-bold outline-none focus:border-blue-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">إلى تاريخ</label>
                    <input 
                      type="date" 
                      value={customRange.end}
                      onChange={(e) => setCustomRange({...customRange, end: e.target.value})}
                      className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs font-bold outline-none focus:border-blue-500"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      );
    } else if (activeTab === 'sectors') {
      return (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm animate-fadeIn">
          <h3 className="text-sm font-black text-slate-900 mb-4 flex items-center gap-2">
            <Briefcase size={16} className="text-slate-400" /> مقارنة قطاعية
          </h3>
          <div className="space-y-3">
            {[
              { id: 'banks_tech', label: 'قطاع البنوك vs التقنية' },
              { id: 'petro_telecom', label: 'البتروكيماويات vs الاتصالات' },
              { id: 'real_health', label: 'العقارات vs الرعاية الصحية' },
            ].map(item => (
              <button
                key={item.id}
                onClick={() => setActiveSectorPair(item.id)}
                className={`w-full flex items-center justify-between p-4 rounded-xl border text-[13px] font-bold transition-all ${
                  activeSectorPair === item.id
                    ? 'bg-blue-50 border-blue-200 text-blue-700 ring-1 ring-blue-500'
                    : 'bg-white border-slate-200 text-slate-600 hover:border-blue-300'
                }`}
              >
                {item.label}
                {activeSectorPair === item.id && <CheckCircle2 size={16} className="text-blue-600" />}
              </button>
            ))}
          </div>
        </div>
      );
    } else {
      return (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm animate-fadeIn">
          <h3 className="text-sm font-black text-slate-900 mb-4 flex items-center gap-2">
            <MapPin size={16} className="text-slate-400" /> مقارنة جغرافية/أسواق
          </h3>
          <div className="space-y-3">
            {[
              { id: 'sa_us', label: 'السوق السعودي vs الأمريكي' },
              { id: 'local_gcc', label: 'السوق المحلي vs الخليجي' },
              { id: 'eu_asia', label: 'الأسواق الأوروبية vs الآسيوية' },
            ].map(item => (
              <button
                key={item.id}
                onClick={() => setActiveRegionPair(item.id)}
                className={`w-full flex items-center justify-between p-4 rounded-xl border text-[13px] font-bold transition-all ${
                  activeRegionPair === item.id
                    ? 'bg-blue-50 border-blue-200 text-blue-700 ring-1 ring-blue-500'
                    : 'bg-white border-slate-200 text-slate-600 hover:border-blue-300'
                }`}
              >
                {item.label}
                {activeRegionPair === item.id && <CheckCircle2 size={16} className="text-blue-600" />}
              </button>
            ))}
          </div>
        </div>
      );
    }
  };

  return (
    <div className="p-6 lg:p-10 font-sans max-w-[1600px] mx-auto animate-fadeIn" dir="rtl">
      {/* 1. Main Page Title & Header Actions */}
      <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-10">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-500/30">
              <GitCompare size={24} />
            </div>
            <div>
              <h1 className="text-2xl lg:text-3xl font-black text-slate-900 tracking-tight">المقارنات الذكية</h1>
              <p className="text-sm font-bold text-slate-500 mt-1 uppercase tracking-widest">قارن بين القطاعات، الفترات، والمناطق بذكاء ودقة</p>
            </div>
          </div>
        </div>

        {/* Interactive Tools */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative group">
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={18} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث ضمن المقارنات..."
              className="pl-4 pr-12 py-3 bg-white border border-slate-200 rounded-xl text-sm font-bold outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all w-64 shadow-sm"
            />
          </div>
          
          {/* Save Comparison Button */}
          <button
            onClick={() => setShowSaveModal(true)}
            className="flex items-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/30"
          >
            <Save size={18} />
            حفظ
          </button>

          {/* Saved Comparisons List */}
          <div className="relative">
            <button
              onClick={() => setShowSavedList(!showSavedList)}
              className={`flex items-center gap-2 px-4 py-3 border rounded-xl text-sm font-bold transition-colors shadow-sm relative ${
                showSavedList ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              <FileText size={18} />
              المحفوظات
              {savedComparisons.length > 0 && (
                <span className="absolute -top-2 -right-2 w-5 h-5 bg-blue-600 text-white text-[9px] font-black rounded-full flex items-center justify-center">
                  {savedComparisons.length}
                </span>
              )}
            </button>
            
            {/* Saved Comparisons Dropdown */}
            {showSavedList && (
              <div className="absolute top-full mt-2 left-0 w-80 bg-white border border-slate-100 rounded-2xl shadow-2xl z-[60] overflow-hidden animate-fadeIn">
                <div className="p-4 border-b border-slate-100 bg-slate-50">
                  <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                    <FileText size={16} className="text-blue-600" />
                    المقارنات المحفوظة
                  </h3>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {savedComparisons.length === 0 ? (
                    <div className="p-8 text-center">
                      <FileText size={40} className="mx-auto text-slate-300 mb-2" />
                      <p className="text-sm font-bold text-slate-500">لا توجد مقارنات محفوظة</p>
                      <p className="text-xs text-slate-400 mt-1">احفظ مقارنتك الأولى للوصول إليها لاحقاً</p>
                    </div>
                  ) : (
                    savedComparisons.map(comp => (
                      <div key={comp.id} className="p-3 border-b border-slate-100 hover:bg-slate-50 transition-colors group">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <h4 className="text-sm font-bold text-slate-900">{comp.name}</h4>
                            <p className="text-[10px] text-slate-500 mt-0.5">{comp.description || 'بدون وصف'}</p>
                            <div className="flex items-center gap-2 mt-2">
                              <span className="text-[9px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-bold">
                                {comp.tab === 'periods' ? 'فترات' : comp.tab === 'sectors' ? 'قطاعات' : 'مناطق'}
                              </span>
                              <span className="text-[9px] text-slate-400">
                                {new Date(comp.createdAt).toLocaleDateString('ar-SA')}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleLoadComparison(comp)}
                              className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                              title="تحميل"
                            >
                              <Download size={14} />
                            </button>
                            <button
                              onClick={() => handleDeleteComparison(comp.id)}
                              className="p-1.5 text-rose-600 hover:bg-rose-50 rounded transition-colors"
                              title="حذف"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Export Dropdown */}
          <div className="relative group">
            <button
              disabled={isExporting}
              className="flex items-center gap-2 px-4 py-3 bg-white border border-slate-200 text-slate-700 rounded-xl text-sm font-bold hover:bg-slate-50 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isExporting ? (
                <span className="animate-pulse flex items-center gap-2">
                  <Download size={18} className="animate-bounce" /> جاري التصدير...
                </span>
              ) : (
                <>
                  <Download size={18} />
                  تصدير
                </>
              )}
            </button>
            
            {/* Export Options Dropdown */}
            <div className="absolute top-full mt-2 left-0 w-48 bg-white border border-slate-100 rounded-2xl shadow-2xl z-[60] overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all animate-fadeIn">
              <div className="p-2">
                <button
                  onClick={() => handleExport('pdf')}
                  disabled={isExporting}
                  className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-bold rounded-xl hover:bg-slate-50 transition-colors disabled:opacity-50"
                >
                  <FileText size={16} className="text-rose-600" />
                  تصدير PDF
                </button>
                <button
                  onClick={() => handleExport('excel')}
                  disabled={isExporting}
                  className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-bold rounded-xl hover:bg-slate-50 transition-colors disabled:opacity-50"
                >
                  <FileSpreadsheet size={16} className="text-emerald-600" />
                  تصدير Excel
                </button>
                <button
                  onClick={() => handleExport('image')}
                  disabled={isExporting}
                  className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-bold rounded-xl hover:bg-slate-50 transition-colors disabled:opacity-50"
                >
                  <ImageIcon size={16} className="text-blue-600" />
                  حفظ كصورة
                </button>
              </div>
            </div>
          </div>

          {/* Share Button */}
          <button
            onClick={handleShare}
            className="flex items-center gap-2 px-4 py-3 bg-white border border-slate-200 text-slate-700 rounded-xl text-sm font-bold hover:bg-slate-50 transition-colors shadow-sm"
          >
            <Share2 size={18} />
            مشاركة
          </button>

          <button
            onClick={() => setIsBookmarked(!isBookmarked)}
            className={`w-12 h-12 flex items-center justify-center border rounded-xl transition-all shadow-sm ${
              isBookmarked ? 'bg-amber-50 border-amber-200 text-amber-500 shadow-inner' : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            <Bookmark size={18} className={isBookmarked ? 'fill-current' : ''} />
          </button>
        </div>
      </header>

      {/* 2. Tabs for Comparison Type */}
      <div className="flex items-center gap-2 border-b border-slate-200 mb-8 overflow-x-auto pb-px">
        {[
          { id: 'sectors', label: 'مقارنة القطاعات', icon: Briefcase },
          { id: 'periods', label: 'مقارنة الفترات الزمنية', icon: Clock },
          { id: 'regions', label: 'مقارنة المناطق', icon: MapPin },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => {
              if (activeTab === tab.id) return;
              setActiveTab(tab.id as any);
            }}
            className={`flex items-center gap-2 px-6 py-4 text-sm font-bold transition-all relative whitespace-nowrap ${
              activeTab === tab.id 
                ? 'text-blue-600' 
                : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50 rounded-t-xl'
            }`}
          >
            <tab.icon size={18} />
            {tab.label}
            {activeTab === tab.id && (
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-600 rounded-t-full shadow-[0_-2px_8px_rgba(37,99,235,0.4)]"></div>
            )}
          </button>
        ))}
      </div>

      {/* Quick Suggestions Cards - Prominent Section */}
      <div className="mb-8 animate-fadeIn">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-500/30">
              <Zap size={20} className="animate-pulse" />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-900">مقارنات مقترحة</h2>
              <p className="text-xs text-slate-500 font-bold mt-0.5">اختر مقارنة جاهزة وابدأ التحليل فوراً</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Star size={16} className="text-amber-500 fill-amber-500" />
            <span className="text-xs font-black text-slate-600">الأكثر استخداماً</span>
          </div>
        </div>

        {/* Suggestions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {activeTab === 'sectors' && SECTOR_SUGGESTIONS.map((suggestion) => (
            <button
              key={suggestion.id}
              onClick={() => handleQuickSuggestion('sector', suggestion.preset)}
              className={`relative p-5 rounded-2xl border-2 text-right transition-all duration-300 hover:shadow-xl hover:scale-[1.02] group ${
                suggestion.popular 
                  ? 'bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200 shadow-md' 
                  : 'bg-white border-slate-200 hover:border-blue-300'
              }`}
            >
              {suggestion.popular && (
                <div className="absolute -top-3 -right-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[9px] font-black px-2.5 py-1 rounded-full shadow-lg flex items-center gap-1">
                  <Star size={10} className="fill-white" />
                  شائع
                </div>
              )}
              <div className="flex items-start gap-3 mb-3">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  suggestion.color === 'blue' ? 'bg-blue-100 text-blue-600' :
                  suggestion.color === 'orange' ? 'bg-orange-100 text-orange-600' :
                  suggestion.color === 'emerald' ? 'bg-emerald-100 text-emerald-600' :
                  suggestion.color === 'indigo' ? 'bg-indigo-100 text-indigo-600' :
                  suggestion.color === 'purple' ? 'bg-purple-100 text-purple-600' :
                  'bg-slate-100 text-slate-600'
                }`}>
                  <suggestion.icon size={24} />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-black text-slate-900 mb-1 group-hover:text-blue-600 transition-colors">
                    {suggestion.title}
                  </h3>
                  <p className="text-[10px] text-slate-500 font-bold leading-relaxed">
                    {suggestion.description}
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <Target size={12} className="text-slate-400" />
                  <span className="text-[9px] font-bold text-slate-500">مقارنة جاهزة</span>
                </div>
                <div className="flex items-center gap-1.5 text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-[10px] font-black">توليد</span>
                  <Zap size={14} className="animate-pulse" />
                </div>
              </div>
            </button>
          ))}

          {activeTab === 'periods' && PERIOD_SUGGESTIONS.map((suggestion) => (
            <button
              key={suggestion.id}
              onClick={() => handleQuickSuggestion('period', suggestion.preset)}
              className={`relative p-5 rounded-2xl border-2 text-right transition-all duration-300 hover:shadow-xl hover:scale-[1.02] group ${
                suggestion.popular 
                  ? 'bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200 shadow-md' 
                  : 'bg-white border-slate-200 hover:border-blue-300'
              }`}
            >
              {suggestion.popular && (
                <div className="absolute -top-3 -right-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[9px] font-black px-2.5 py-1 rounded-full shadow-lg flex items-center gap-1">
                  <Star size={10} className="fill-white" />
                  شائع
                </div>
              )}
              <div className="flex items-start gap-3 mb-3">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  suggestion.color === 'blue' ? 'bg-blue-100 text-blue-600' :
                  suggestion.color === 'orange' ? 'bg-orange-100 text-orange-600' :
                  suggestion.color === 'emerald' ? 'bg-emerald-100 text-emerald-600' :
                  suggestion.color === 'indigo' ? 'bg-indigo-100 text-indigo-600' :
                  suggestion.color === 'purple' ? 'bg-purple-100 text-purple-600' :
                  'bg-slate-100 text-slate-600'
                }`}>
                  <suggestion.icon size={24} />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-black text-slate-900 mb-1 group-hover:text-blue-600 transition-colors">
                    {suggestion.title}
                  </h3>
                  <p className="text-[10px] text-slate-500 font-bold leading-relaxed">
                    {suggestion.description}
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <Target size={12} className="text-slate-400" />
                  <span className="text-[9px] font-bold text-slate-500">مقارنة جاهزة</span>
                </div>
                <div className="flex items-center gap-1.5 text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-[10px] font-black">توليد</span>
                  <Zap size={14} className="animate-pulse" />
                </div>
              </div>
            </button>
          ))}

          {activeTab === 'regions' && REGION_SUGGESTIONS.map((suggestion) => (
            <button
              key={suggestion.id}
              onClick={() => handleQuickSuggestion('region', suggestion.preset)}
              className={`relative p-5 rounded-2xl border-2 text-right transition-all duration-300 hover:shadow-xl hover:scale-[1.02] group ${
                suggestion.popular 
                  ? 'bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200 shadow-md' 
                  : 'bg-white border-slate-200 hover:border-blue-300'
              }`}
            >
              {suggestion.popular && (
                <div className="absolute -top-3 -right-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[9px] font-black px-2.5 py-1 rounded-full shadow-lg flex items-center gap-1">
                  <Star size={10} className="fill-white" />
                  شائع
                </div>
              )}
              <div className="flex items-start gap-3 mb-3">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  suggestion.color === 'blue' ? 'bg-blue-100 text-blue-600' :
                  suggestion.color === 'orange' ? 'bg-orange-100 text-orange-600' :
                  suggestion.color === 'emerald' ? 'bg-emerald-100 text-emerald-600' :
                  suggestion.color === 'indigo' ? 'bg-indigo-100 text-indigo-600' :
                  suggestion.color === 'purple' ? 'bg-purple-100 text-purple-600' :
                  'bg-slate-100 text-slate-600'
                }`}>
                  <suggestion.icon size={24} />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-black text-slate-900 mb-1 group-hover:text-blue-600 transition-colors">
                    {suggestion.title}
                  </h3>
                  <p className="text-[10px] text-slate-500 font-bold leading-relaxed">
                    {suggestion.description}
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <Target size={12} className="text-slate-400" />
                  <span className="text-[9px] font-bold text-slate-500">مقارنة جاهزة</span>
                </div>
                <div className="flex items-center gap-1.5 text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-[10px] font-black">توليد</span>
                  <Zap size={14} className="animate-pulse" />
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
        
        {/* Left Sidebar Layout for Settings & AI */}
        <div className="xl:col-span-1 space-y-6">
          
          {/* 1. mode switcher - Blind Mode */}
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 border border-slate-700 shadow-xl overflow-hidden relative group">
            <div className="absolute -right-4 -top-4 w-20 h-20 bg-blue-500/10 rounded-full blur-2xl group-hover:bg-blue-500/20 transition-all"></div>
            <h3 className="text-xs font-black text-blue-400 uppercase tracking-widest mb-4">وضع المقارنة العمياء</h3>
            <p className="text-[10px] text-slate-400 font-bold mb-4 leading-relaxed">قارن محفظتك تلقائياً ضد "الوحش" (أفضل أداء في السوق) واكتشف الفجوات فوراً.</p>
            <button 
              onClick={() => {
                setIsBlindMode(!isBlindMode);
                handleCompare();
              }}
              className={`w-full py-3 rounded-xl text-xs font-black transition-all border ${
                isBlindMode 
                ? 'bg-blue-600 text-white border-blue-500 shadow-lg shadow-blue-500/20' 
                : 'bg-transparent text-slate-300 border-slate-600 hover:border-blue-500 active:scale-95'
              }`}
            >
              {isBlindMode ? 'تعطيل الوضع الأعمى' : 'تفعيل المقارنة ضد الأفضل'}
            </button>
          </div>
          
          {/* Dynamic Selection List based on activeTab */}
          {!isBlindMode && renderLeftSideSettings()}

          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col items-center justify-center text-center">
             <button 
                onClick={handleCompare}
                className={`w-full py-4 rounded-xl text-sm font-black text-white hover:bg-blue-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-500/30 ${
                  isComparing ? 'bg-blue-400 cursor-not-allowed scale-95' : 'bg-blue-600 active:scale-95'
                }`}
              >
                <GitCompare size={18} className={isComparing ? 'animate-spin' : ''} />
                {isComparing ? 'جاري محاكاة واستخراج التحليل...' : 'تأكيد التفاصيل والمقارنة'}
              </button>
             <p className="text-[10px] text-slate-400 font-bold mt-4 tracking-widest uppercase">يتم سحب البيانات حياً من المحرك</p>
          </div>

          {/* AI Insights Panel */}
          <div className={`bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-6 shadow-xl relative overflow-hidden transition-opacity duration-1000 ${isComparing ? 'opacity-50' : 'opacity-100'}`}>
            <div className="absolute top-0 left-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -ml-10 -mt-10 animate-pulse"></div>
            <div className="relative z-10 text-white">
              <h3 className="text-sm font-black flex items-center gap-2 mb-4">
                <Sparkles size={18} className="text-amber-300" />
                تحليل الذكاء الراداري
              </h3>
              <p className="text-[11px] font-bold leading-relaxed opacity-90 mb-5 text-justify min-h-[60px]">
                {activeData.aiText}
              </p>
              <button 
                onClick={() => setIsModalOpen(true)} 
                className="text-[10px] font-black uppercase tracking-wider bg-white/20 hover:bg-white/30 px-4 py-3 rounded-lg transition-colors w-full border border-white/10"
              >
                استعراض التقرير المفصل
              </button>
            </div>
          </div>

          {/* Advanced Tools Section */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <button 
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="w-full p-6 flex items-center justify-between hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
                  <Settings2 size={20} />
                </div>
                <div className="text-right">
                  <h3 className="text-sm font-black text-slate-900">أدوات مقارنة متقدمة</h3>
                  <p className="text-[10px] text-slate-400 font-bold">تخصيص الأوزان والمقاييس</p>
                </div>
              </div>
              <ChevronDown size={20} className={`text-slate-400 transition-transform ${showAdvanced ? 'rotate-180' : ''}`} />
            </button>
            
            {showAdvanced && (
              <div className="p-6 border-t border-slate-100 space-y-6 animate-slideDown">
                {/* Multi-metric Selection */}
                <div className="space-y-3">
                  <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <Activity size={14} /> المقاييس النشطة (Multi)
                  </h4>
                  <div className="grid grid-cols-1 gap-2">
                    {[
                      { id: 'trading_signals', label: 'إشارات التداول' },
                      { id: 'volume', label: 'حجم السيولة' },
                      { id: 'activity', label: 'معدل النشاط' },
                    ].map(metric => (
                      <button 
                        key={metric.id}
                        onClick={() => {
                          if (selectedMetrics.includes(metric.id)) {
                            setSelectedMetrics(selectedMetrics.filter(m => m !== metric.id));
                          } else {
                            setSelectedMetrics([...selectedMetrics, metric.id]);
                          }
                        }}
                        className={`flex items-center justify-between p-3 rounded-xl border text-[11px] font-bold transition-all ${
                          selectedMetrics.includes(metric.id)
                            ? 'bg-blue-50 border-blue-200 text-blue-700'
                            : 'bg-white border-slate-100 text-slate-500'
                        }`}
                      >
                        {metric.label}
                        <Plus size={14} className={selectedMetrics.includes(metric.id) ? 'rotate-45' : ''} />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Weighted Metrics Slider */}
                <div className="space-y-4">
                  <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <Scale size={14} /> توزيع الأوزان (Smart Weight)
                  </h4>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-[10px] font-bold">
                        <span className="text-slate-500">الإشارات</span>
                        <span className="text-blue-600">{weights.signals}%</span>
                      </div>
                      <input 
                        type="range" min="0" max="100" value={weights.signals} 
                        onChange={(e) => setWeights({...weights, signals: parseInt(e.target.value)})}
                        className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600" 
                      />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-[10px] font-bold">
                        <span className="text-slate-500">السيولة</span>
                        <span className="text-blue-600">{weights.volume}%</span>
                      </div>
                      <input 
                        type="range" min="0" max="100" value={weights.volume} 
                        onChange={(e) => setWeights({...weights, volume: parseInt(e.target.value)})}
                        className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600" 
                      />
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-amber-50 rounded-xl border border-amber-100 flex items-start gap-3">
                  <Sparkles size={16} className="text-amber-500 mt-0.5 shrink-0" />
                  <p className="text-[10px] text-amber-800 font-bold leading-relaxed">
                    يتم احتساب "المؤشر المركب الذكي" بناءً على أوزانك المخصصة ليعطيك رؤية أدق لمخاطر محفظتك.
                  </p>
                </div>
              </div>
            )}
          </div>
          
          {/* Suggested Comparisons */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hidden md:block">
            <h3 className="text-sm font-black text-slate-900 mb-4">اقتراحات المحرك</h3>
            <div className="space-y-3">
              {SUGGESTED_COMPARISONS.map(suggestion => (
                <button 
                  key={suggestion.id} 
                  onClick={() => handleSuggestionClick(suggestion.type, suggestion.id)}
                  className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-blue-50 border border-transparent hover:border-blue-100 transition-all text-right group relative"
                >
                  <div className="w-10 h-10 bg-slate-50 rounded-lg flex items-center justify-center text-slate-400 group-hover:bg-white group-hover:text-blue-600 group-hover:shadow-sm transition-all">
                    <suggestion.icon size={16} />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-800">{suggestion.title}</h4>
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{suggestion.type}</span>
                      <span className="bg-blue-600 text-[8px] text-white px-1.5 py-0.5 rounded-full font-black animate-pulse opacity-0 group-hover:opacity-100 transition-opacity">AI Suggested</span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Right Content Area */}
        <div className={`xl:col-span-3 space-y-8 transition-opacity duration-700 ${isComparing ? 'opacity-30 pointer-events-none' : 'opacity-100'}`}>
          
          {/* KPI Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {activeData.kpis.map((kpi, idx) => (
              <div
                key={idx}
                className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 relative group cursor-pointer"
                onMouseEnter={() => setShowKPIExplanation(idx)}
                onMouseLeave={() => setShowKPIExplanation(null)}
              >
                <div className={`absolute top-0 right-0 w-1 h-full transition-colors ${kpi.isUp ? 'bg-emerald-500' : 'bg-rose-500'}`}></div>
                
                {/* Header with Info Icon */}
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">{kpi.title}</h3>
                  <div className="p-1.5 bg-slate-50 text-slate-400 rounded-lg group-hover:bg-blue-50 group-hover:text-blue-500 transition-colors">
                    <Info size={14} />
                  </div>
                </div>
                
                {/* Main Value */}
                <div className="flex items-end gap-3">
                  <span className="text-3xl font-black text-slate-900">{kpi.current}</span>
                  <div className={`flex items-center gap-1 text-sm font-bold mb-1 ${kpi.isUp ? 'text-emerald-500' : 'text-rose-500'}`}>
                    {kpi.isUp ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                    {kpi.change}
                  </div>
                </div>

                {/* Progress indicator */}
                <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden mt-3">
                  <div 
                    className={`h-full rounded-full transition-all duration-500 ${kpi.isUp ? 'bg-emerald-500' : 'bg-rose-500'}`}
                    style={{ width: kpi.isUp ? '85%' : '65%' }}
                  ></div>
                </div>

                {/* AI Explanation Tooltip - Appears ABOVE the card */}
                {showKPIExplanation === idx && (
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-[280px] bg-slate-900 border border-slate-700 rounded-2xl p-4 shadow-2xl z-50 animate-fadeIn">
                    {/* Arrow pointing down to card */}
                    <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-slate-900"></div>
                    
                    {/* Tooltip Content */}
                    <div className="relative">
                      <div className="flex items-center gap-2 text-blue-400 text-[9px] font-black mb-2 tracking-widest uppercase">
                        <Sparkles size={10} className="animate-pulse" /> رادار يشرح لك
                      </div>
                      <p className="text-[11px] text-slate-200 font-bold leading-relaxed text-right">
                        {kpi.title.includes('كثافة') 
                          ? 'يعود هذا التغير لزيادة تدفق الإشارات النشطة بنسبة ملحوظة وارتفاع معدل النشاط في هذا القطاع.'
                          : kpi.title.includes('أحجام')
                          ? 'السيولة المتدفقة زادت بشكل كبير نتيجة دخول مؤسسات استثمارية كبرى للسوق.'
                          : 'مؤشر النشاط العام يعكس قوة الزخم السعري وانتشار الإشارات الإيجابية.'
                        }
                      </p>
                      <div className="mt-2 pt-2 border-t border-slate-700 flex items-center justify-between">
                        <span className="text-[8px] text-slate-400 font-bold">موثوقية التحليل</span>
                        <div className="flex items-center gap-1.5">
                          <div className="w-12 h-1 bg-slate-700 rounded-full overflow-hidden">
                            <div className="w-[92%] h-full bg-blue-500 rounded-full"></div>
                          </div>
                          <span className="text-[8px] text-blue-400 font-black">92%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Visual Comparison Section - Enhanced Data Visualization */}
          <div className="bg-white rounded-2xl p-6 lg:p-8 border border-slate-200 shadow-sm">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div>
                <h2 className="text-lg font-black text-slate-900">
                  الأداء المقارن
                  <span className="text-sm font-medium text-slate-500 mx-2">
                    ({activeData.legend.prev} vs {activeData.legend.curr})
                  </span>
                </h2>
                <p className="text-xs text-slate-500 mt-1 font-medium">تمثيل بياني يوضح الفجوات والتداخلات بناءً على النطاق الجغرافي، الزمني أو القطاعي.</p>
              </div>
              
              {/* Enhanced Visualization Controls */}
              <div className="flex flex-wrap items-center gap-2 p-1.5 bg-slate-100 rounded-xl shrink-0">
                {/* Chart Type Selector */}
                <div className="flex items-center gap-1 p-1 bg-white rounded-lg border border-slate-200">
                  <button
                    onClick={() => setChartType('bar')}
                    className={`p-2 rounded-md transition-all ${chartType === 'bar' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-100'}`}
                    title="رسم بياني شريطي"
                  >
                    <BarChart3 size={16} />
                  </button>
                  <button
                    onClick={() => setChartType('line')}
                    className={`p-2 rounded-md transition-all ${chartType === 'line' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-100'}`}
                    title="رسم بياني خطي"
                  >
                    <LineChartIcon size={16} />
                  </button>
                  <button
                    onClick={() => setChartType('area')}
                    className={`p-2 rounded-md transition-all ${chartType === 'area' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-100'}`}
                    title="رسم بياني مساحي"
                  >
                    <Activity size={16} />
                  </button>
                </div>

                {/* View Mode */}
                <div className="flex items-center gap-1 p-1 bg-white rounded-lg border border-slate-200">
                  <button
                    onClick={() => setChartView('aggregated')}
                    className={`px-3 py-1.5 text-[10px] font-bold rounded-md shadow-sm transition-all ${chartView === 'aggregated' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-100'}`}
                  >
                    تجميعي
                  </button>
                  <button
                    onClick={() => setChartView('detailed')}
                    className={`px-3 py-1.5 text-[10px] font-bold rounded-md shadow-sm transition-all ${chartView === 'detailed' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-100'}`}
                  >
                    تفصيلي
                  </button>
                </div>

                {/* Heatmap Toggle */}
                <button
                  onClick={() => setShowHeatmap(!showHeatmap)}
                  className={`p-2 rounded-lg transition-all border ${showHeatmap ? 'bg-orange-50 border-orange-200 text-orange-600' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                  title="خريطة الحرارة"
                >
                  <Grid3X3 size={16} />
                </button>

                {/* Trend Lines Toggle */}
                <button
                  onClick={() => setShowTrendLines(!showTrendLines)}
                  className={`p-2 rounded-lg transition-all border ${showTrendLines ? 'bg-indigo-50 border-indigo-200 text-indigo-600' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                  title="خطوط الاتجاه"
                >
                  <TrendingUp size={16} />
                </button>

                {/* Prediction Toggle */}
                <button
                  onClick={() => {
                    if (showPrediction) {
                      setShowPrediction(false);
                      return;
                    }
                    setIsPredicting(true);
                    setTimeout(() => {
                      setIsPredicting(false);
                      setShowPrediction(true);
                    }, 1500);
                  }}
                  disabled={isPredicting}
                  className={`px-3 py-1.5 text-[10px] font-bold rounded-lg transition-all flex items-center gap-1 border ${showPrediction ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'} disabled:opacity-50`}
                >
                  <Sparkles size={14} className={isPredicting || showPrediction ? 'animate-pulse' : ''} />
                  تنبؤ
                </button>
              </div>
            </div>

            {/* Heatmap View */}
            {showHeatmap && (
              <div className="mb-8 animate-slideDown">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                    <Grid3X3 size={16} className="text-orange-500" />
                    خريطة الحرارة - {heatmapMetric === 'activity' ? 'النشاط' : heatmapMetric === 'growth' ? 'النمو' : 'المخاطرة'}
                  </h3>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-slate-500">المقياس:</span>
                    <select
                      value={heatmapMetric}
                      onChange={(e) => setHeatmapMetric(e.target.value as any)}
                      className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold outline-none focus:border-blue-500"
                    >
                      <option value="activity">النشاط</option>
                      <option value="growth">النمو</option>
                      <option value="risk">المخاطرة</option>
                    </select>
                  </div>
                </div>
                <HeatmapComponent data={activeData.heatmapData || []} metric={heatmapMetric} />
              </div>
            )}

            {/* Trend Lines View */}
            {showTrendLines && (
              <div className="mb-8 animate-slideDown">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                    <TrendingUp size={16} className="text-indigo-500" />
                    خطوط الاتجاه والتنبؤ
                  </h3>
                  <div className="flex items-center gap-2 text-[10px]">
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-0.5 bg-blue-500"></div>
                      <span className="text-slate-600 font-bold">الفعلي</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-0.5 bg-indigo-500" style={{ borderStyle: 'dashed' }}></div>
                      <span className="text-slate-600 font-bold">الاتجاه</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-0.5 bg-emerald-500" style={{ borderStyle: 'dotted' }}></div>
                      <span className="text-slate-600 font-bold">التنبؤ</span>
                    </div>
                  </div>
                </div>
                <TrendLinesComponent data={activeData.trendData || []} />
              </div>
            )}

            {/* Main Chart */}
            <div className="h-[400px] w-full" dir="ltr">
              <ResponsiveContainer width="100%" height="100%">
                {chartType === 'bar' ? (
                  <BarChart
                    data={
                      chartView === 'aggregated'
                      ? [{
                          name: 'الإجمالي التجميعي',
                          previous: (activeData.chart as any).reduce((acc: number, curr: any) => acc + curr.previous, 0),
                          current: (activeData.chart as any).reduce((acc: number, curr: any) => acc + curr.current, 0),
                          predict: (activeData.chart as any).reduce((acc: number, curr: any) => acc + (curr.predict || 0), 0),
                        }]
                      : activeData.chart
                    }
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12, fontWeight: 700}} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12, fontWeight: 700}} dx={-10} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', fontWeight: 'bold', paddingTop: '20px' }} />
                    <Bar dataKey="previous" name={activeData.legend.prev} fill="#94a3b8" radius={[8, 8, 0, 0]} maxBarSize={chartView === 'aggregated' ? 80 : 40} />
                    <Bar dataKey="current" name={activeData.legend.curr} fill={activeData.kpis[0].isUp ? '#10b981' : '#f43f5e'} radius={[8, 8, 0, 0]} maxBarSize={chartView === 'aggregated' ? 80 : 40} />
                    {showPrediction && (
                      <Bar dataKey="predict" name="التوقع المستقبلي (AI)" fill="#6366f1" radius={[8, 8, 0, 0]} maxBarSize={40} strokeDasharray="5 5" fillOpacity={0.6} />
                    )}
                  </BarChart>
                ) : chartType === 'line' ? (
                  <LineChart
                    data={
                      chartView === 'aggregated'
                      ? [{
                          name: 'الإجمالي التجميعي',
                          previous: (activeData.chart as any).reduce((acc: number, curr: any) => acc + curr.previous, 0),
                          current: (activeData.chart as any).reduce((acc: number, curr: any) => acc + curr.current, 0),
                          predict: (activeData.chart as any).reduce((acc: number, curr: any) => acc + (curr.predict || 0), 0),
                        }]
                      : activeData.chart
                    }
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12, fontWeight: 700}} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12, fontWeight: 700}} dx={-10} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', fontWeight: 'bold', paddingTop: '20px' }} />
                    <Line type="monotone" dataKey="previous" name={activeData.legend.prev} stroke="#94a3b8" strokeWidth={3} dot={{ r: 5 }} activeDot={{ r: 8 }} />
                    <Line type="monotone" dataKey="current" name={activeData.legend.curr} stroke={activeData.kpis[0].isUp ? '#10b981' : '#f43f5e'} strokeWidth={3} dot={{ r: 5 }} activeDot={{ r: 8 }} />
                    {showPrediction && (
                      <Line type="monotone" dataKey="predict" name="التوقع المستقبلي (AI)" stroke="#6366f1" strokeWidth={2} strokeDasharray="5 5" dot={{ r: 4 }} />
                    )}
                  </LineChart>
                ) : chartType === 'area' ? (
                  <AreaChart
                    data={
                      chartView === 'aggregated'
                      ? [{
                          name: 'الإجمالي التجميعي',
                          previous: (activeData.chart as any).reduce((acc: number, curr: any) => acc + curr.previous, 0),
                          current: (activeData.chart as any).reduce((acc: number, curr: any) => acc + curr.current, 0),
                          predict: (activeData.chart as any).reduce((acc: number, curr: any) => acc + (curr.predict || 0), 0),
                        }]
                      : activeData.chart
                    }
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <defs>
                      <linearGradient id="colorPrevious" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#94a3b8" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#94a3b8" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorCurrent" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={activeData.kpis[0].isUp ? '#10b981' : '#f43f5e'} stopOpacity={0.8}/>
                        <stop offset="95%" stopColor={activeData.kpis[0].isUp ? '#10b981' : '#f43f5e'} stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12, fontWeight: 700}} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12, fontWeight: 700}} dx={-10} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', fontWeight: 'bold', paddingTop: '20px' }} />
                    <Area type="monotone" dataKey="previous" name={activeData.legend.prev} stroke="#94a3b8" fillOpacity={1} fill="url(#colorPrevious)" />
                    <Area type="monotone" dataKey="current" name={activeData.legend.curr} stroke={activeData.kpis[0].isUp ? '#10b981' : '#f43f5e'} fillOpacity={1} fill="url(#colorCurrent)" />
                  </AreaChart>
                ) : (
                  <ComposedChart
                    data={
                      chartView === 'aggregated'
                      ? [{
                          name: 'الإجمالي التجميعي',
                          previous: (activeData.chart as any).reduce((acc: number, curr: any) => acc + curr.previous, 0),
                          current: (activeData.chart as any).reduce((acc: number, curr: any) => acc + curr.current, 0),
                          predict: (activeData.chart as any).reduce((acc: number, curr: any) => acc + (curr.predict || 0), 0),
                        }]
                      : activeData.chart
                    }
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12, fontWeight: 700}} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12, fontWeight: 700}} dx={-10} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', fontWeight: 'bold', paddingTop: '20px' }} />
                    <Bar dataKey="previous" name={activeData.legend.prev} fill="#94a3b8" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="current" name={activeData.legend.curr} fill={activeData.kpis[0].isUp ? '#10b981' : '#f43f5e'} radius={[4, 4, 0, 0]} />
                    <Line type="monotone" dataKey="current" name="اتجاه الأداء" stroke="#6366f1" strokeWidth={3} dot={false} />
                  </ComposedChart>
                )}
              </ResponsiveContainer>
            </div>

            {/* Zoom Controls */}
            {showZoomControls && (
              <div className="flex items-center justify-end gap-2 mt-4 pt-4 border-t border-slate-100">
                <button
                  onClick={() => setChartZoom(prev => ({ ...prev, x: [Math.max(0, prev.x[0] - 0.1), Math.max(0.1, prev.x[1] - 0.1)] }))}
                  className="p-2 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors"
                  title="تصغير"
                >
                  <ZoomOut size={16} className="text-slate-600" />
                </button>
                <button
                  onClick={() => setChartZoom({ x: [0, 1], y: [0, 1] })}
                  className="px-3 py-2 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors text-xs font-bold"
                >
                  إعادة ضبط
                </button>
                <button
                  onClick={() => setChartZoom(prev => ({ ...prev, x: [Math.min(0.9, prev.x[0] + 0.1), Math.min(1, prev.x[1] + 0.1)] }))}
                  className="p-2 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors"
                  title="تكبير"
                >
                  <ZoomIn size={16} className="text-slate-600" />
                </button>
              </div>
            )}
          </div>

          {/* Detailed Comparison Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-200 flex justify-between items-center bg-slate-50/50">
              <h2 className="text-lg font-black text-slate-900">المصفوفة التفصيلية (Detailed Matrix)</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-right">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-4 text-xs font-black text-slate-600 uppercase tracking-widest whitespace-nowrap">مقياس المقارنة الرئيسي</th>
                    <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">{activeData.legend.prev}</th>
                    <th className="px-6 py-4 text-xs font-black text-slate-600 uppercase tracking-widest whitespace-nowrap">{activeData.legend.curr}</th>
                    <th className="px-6 py-4 text-xs font-black text-slate-600 uppercase tracking-widest whitespace-nowrap">نسبة التغير (أثر الأداء)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredTable.length > 0 ? filteredTable.map((row) => (
                    <tr key={row.id} className="hover:bg-slate-50 transition-colors group">
                      <td className="px-6 py-4 text-sm font-bold text-slate-900 whitespace-nowrap flex items-center gap-3">
                        {row.metric}
                        {(row as any).isAnomaly && (
                          <span className="flex h-2 w-2 relative">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm font-bold text-slate-400 whitespace-nowrap">{row.prev}</td>
                      <td className="px-6 py-4 text-sm font-black text-slate-900 whitespace-nowrap flex items-center gap-2">
                        {row.curr}
                        {(row as any).isAnomaly && <span className="text-[9px] bg-rose-600 text-white px-1.5 py-0.5 rounded animate-pulse font-black uppercase">Anomaly</span>}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className={`inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-black w-24 border ${
                          row.isPositive 
                            ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
                            : 'bg-rose-50 text-rose-600 border-rose-100'
                        }`}>
                          {row.isPositive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                          {row.change}
                        </div>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan={4} className="px-6 py-12 text-center text-slate-500 font-bold text-sm">لا توجد نتائج مطابقة للبحث</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </div>

      {/* Save Comparison Modal */}
      {showSaveModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-slideUp">
            <div className="relative bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white">
              <button
                onClick={() => setShowSaveModal(false)}
                className="absolute top-4 left-4 w-10 h-10 flex items-center justify-center bg-white/10 hover:bg-white/20 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
              <div className="flex items-center gap-3 mb-2">
                <div className="bg-white/20 p-2 rounded-lg">
                  <Save size={20} />
                </div>
                <h2 className="text-xl font-black">حفظ المقارنة</h2>
              </div>
              <p className="text-blue-100 text-sm font-bold opacity-90">احفظ إعدادات المقارنة الحالية للوصول إليها لاحقاً</p>
            </div>

            <div className="p-6 space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-black text-slate-700 flex items-center gap-2">
                  <Edit3 size={16} className="text-blue-600" />
                  اسم المقارنة
                </label>
                <input
                  type="text"
                  value={comparisonName}
                  onChange={(e) => setComparisonName(e.target.value)}
                  placeholder="مثال: مقارنة البنوك vs التقنية 2024"
                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-bold outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-black text-slate-700 flex items-center gap-2">
                  <FileText size={16} className="text-indigo-600" />
                  وصف المقارنة (اختياري)
                </label>
                <textarea
                  value={comparisonDescription}
                  onChange={(e) => setComparisonDescription(e.target.value)}
                  placeholder="أضف وصفاً مختصراً للمقارنة..."
                  rows={3}
                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-bold outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all resize-none"
                />
              </div>

              {/* Comparison Summary */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-3">ملخص الإعدادات</h4>
                <div className="flex flex-wrap gap-2">
                  <span className="px-2.5 py-1 bg-blue-100 text-blue-700 text-[10px] font-bold rounded-full">
                    {activeTab === 'periods' ? 'مقارنة فترات' : activeTab === 'sectors' ? 'مقارنة قطاعات' : 'مقارنة مناطق'}
                  </span>
                  <span className="px-2.5 py-1 bg-emerald-100 text-emerald-700 text-[10px] font-bold rounded-full">
                    {chartType === 'bar' ? 'رسم شريطي' : chartType === 'line' ? 'رسم خطي' : chartType === 'area' ? 'رسم مساحي' : 'رسم مركب'}
                  </span>
                  {showHeatmap && (
                    <span className="px-2.5 py-1 bg-orange-100 text-orange-700 text-[10px] font-bold rounded-full">
                      خريطة حرارة مفعلة
                    </span>
                  )}
                  {showTrendLines && (
                    <span className="px-2.5 py-1 bg-indigo-100 text-indigo-700 text-[10px] font-bold rounded-full">
                      خطوط اتجاه
                    </span>
                  )}
                  {showPrediction && (
                    <span className="px-2.5 py-1 bg-purple-100 text-purple-700 text-[10px] font-bold rounded-full">
                      تنبؤات AI
                    </span>
                  )}
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowSaveModal(false)}
                  className="flex-1 py-3 bg-slate-100 text-slate-700 rounded-xl text-sm font-bold hover:bg-slate-200 transition-colors"
                >
                  إلغاء
                </button>
                <button
                  onClick={handleSaveComparison}
                  className="flex-1 py-3 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2"
                >
                  <Save size={16} />
                  حفظ المقارنة
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Share Comparison Modal */}
      {showShareModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-slideUp">
            <div className="relative bg-gradient-to-r from-emerald-600 to-teal-700 p-6 text-white">
              <button
                onClick={() => setShowShareModal(false)}
                className="absolute top-4 left-4 w-10 h-10 flex items-center justify-center bg-white/10 hover:bg-white/20 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
              <div className="flex items-center gap-3 mb-2">
                <div className="bg-white/20 p-2 rounded-lg">
                  <Share2 size={20} />
                </div>
                <h2 className="text-xl font-black">مشاركة المقارنة</h2>
              </div>
              <p className="text-emerald-100 text-sm font-bold opacity-90">انسخ الرابط وشاركه مع فريقك أو عملائك</p>
            </div>

            <div className="p-6 space-y-5">
              {/* Share Link */}
              <div className="space-y-2">
                <label className="text-sm font-black text-slate-700 flex items-center gap-2">
                  <Link2 size={16} className="text-emerald-600" />
                  رابط المشاركة
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={shareLink}
                    readOnly
                    className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono font-bold outline-none text-slate-600"
                  />
                  <button
                    onClick={handleCopyLink}
                    className="px-4 py-3 bg-emerald-600 text-white rounded-xl text-sm font-bold hover:bg-emerald-700 transition-colors flex items-center gap-2"
                  >
                    <Copy size={18} />
                    نسخ
                  </button>
                </div>
              </div>

              {/* Permissions */}
              <div className="space-y-3">
                <label className="text-sm font-black text-slate-700 flex items-center gap-2">
                  <Settings2 size={16} className="text-indigo-600" />
                  صلاحيات الوصول
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setSharePermissions('view')}
                    className={`p-4 rounded-xl border-2 transition-all text-right ${
                      sharePermissions === 'view'
                        ? 'border-emerald-500 bg-emerald-50'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                        sharePermissions === 'view' ? 'border-emerald-500 bg-emerald-500' : 'border-slate-300'
                      }`}>
                        {sharePermissions === 'view' && <CheckCircle2 size={12} className="text-white" />}
                      </div>
                      <span className={`text-sm font-bold ${sharePermissions === 'view' ? 'text-emerald-700' : 'text-slate-600'}`}>
                        عرض فقط
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-500 pr-6">يمكنه مشاهدة المقارنة فقط</p>
                  </button>
                  <button
                    onClick={() => setSharePermissions('edit')}
                    className={`p-4 rounded-xl border-2 transition-all text-right ${
                      sharePermissions === 'edit'
                        ? 'border-indigo-500 bg-indigo-50'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                        sharePermissions === 'edit' ? 'border-indigo-500 bg-indigo-500' : 'border-slate-300'
                      }`}>
                        {sharePermissions === 'edit' && <CheckCircle2 size={12} className="text-white" />}
                      </div>
                      <span className={`text-sm font-bold ${sharePermissions === 'edit' ? 'text-indigo-700' : 'text-slate-600'}`}>
                        عرض وتعديل
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-500 pr-6">يمكنه التعديل على الإعدادات</p>
                  </button>
                </div>
              </div>

              {/* Quick Share Options */}
              <div className="space-y-3 pt-4 border-t border-slate-100">
                <label className="text-sm font-black text-slate-700">مشاركة سريعة عبر</label>
                <div className="grid grid-cols-3 gap-3">
                  <button className="p-3 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-xl transition-colors flex flex-col items-center gap-2">
                    <Share2 size={20} />
                    <span className="text-[10px] font-bold">رابط مباشر</span>
                  </button>
                  <button className="p-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 rounded-xl transition-colors flex flex-col items-center gap-2">
                    <Copy size={20} />
                    <span className="text-[10px] font-bold">نسخ الرابط</span>
                  </button>
                  <button className="p-3 bg-purple-50 hover:bg-purple-100 text-purple-600 rounded-xl transition-colors flex flex-col items-center gap-2">
                    <Download size={20} />
                    <span className="text-[10px] font-bold">تصدير ومشاركة</span>
                  </button>
                </div>
              </div>

              <button
                onClick={() => setShowShareModal(false)}
                className="w-full py-3 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-slate-800 transition-colors shadow-lg"
              >
                إغلاق
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modern AI Report Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden animate-slideUp">
            <div className="relative bg-gradient-to-r from-blue-600 to-indigo-700 p-8 text-white">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="absolute top-6 left-6 w-10 h-10 flex items-center justify-center bg-white/10 hover:bg-white/20 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
              <div className="flex items-center gap-4 mb-2">
                <div className="bg-amber-400 p-2 rounded-lg text-slate-900">
                  <Sparkles size={20} />
                </div>
                <h2 className="text-xl font-black">التقرير التحليلي المعمق</h2>
              </div>
              <p className="text-blue-100 text-sm font-bold opacity-80">مدعوم بمحرك رادار للذكاء الاصطناعي</p>
            </div>
            
            <div className="p-8 space-y-6">
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="text-center flex-1">
                  <span className="block text-[10px] font-bold text-slate-400 uppercase mb-1">الطرف الأول</span>
                  <span className="text-sm font-black text-slate-700">{activeData.legend.prev}</span>
                </div>
                <div className="px-4 text-blue-500">
                  <GitCompare size={20} />
                </div>
                <div className="text-center flex-1">
                  <span className="block text-[10px] font-bold text-slate-400 uppercase mb-1">الطرف الثاني</span>
                  <span className="text-sm font-black text-slate-900">{activeData.legend.curr}</span>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                  <div className="w-1.5 h-6 bg-blue-500 rounded-full"></div>
                  الاستنتاج الاستراتيجي
                </h3>
                <div className="p-6 bg-blue-50/50 rounded-2xl border border-blue-100 leading-relaxed text-slate-700 font-bold text-sm">
                  {activeData.aiText}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest">توصية النظام</h4>
                  <div className="p-4 bg-emerald-50 text-emerald-700 rounded-xl text-xs font-bold border border-emerald-100 shadow-sm flex items-center gap-2">
                    <CheckCircle2 size={16} /> بناء مراكز في القطاع المتفوق
                  </div>
                </div>
                <div className="space-y-2">
                  <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest">مستوى الموثوقية</h4>
                  <div className="h-10 bg-slate-100 rounded-xl overflow-hidden relative border border-slate-200 shadow-inner">
                    <div className="absolute inset-y-0 right-0 bg-blue-500 w-[92%] flex items-center justify-center text-[10px] text-white font-black">92%</div>
                  </div>
                </div>
              </div>

              <button 
                onClick={() => setIsModalOpen(false)}
                className="w-full py-4 bg-slate-900 text-white rounded-2xl text-sm font-black hover:bg-slate-800 transition-all shadow-lg shadow-slate-200 mt-4 active:scale-[0.98]"
              >
                إغلاق التقرير
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SmartComparisonsPage;
