import React, { useState, useMemo } from 'react';
import {
  Database, Search, Filter, Plus, RefreshCw, Eye, BarChart3, Download,
  TrendingUp, AlertCircle, CheckCircle2, Clock, Calendar, Layers,
  Zap, Activity, Shield, Star, ArrowUpRight, ArrowDownRight, Info,
  ChevronRight, Globe, Building2, Landmark, Droplet, Home, GraduationCap,
  Plane, Wallet, PieChart, Target, Link2, Cpu, FileText, Table, GitCompare, Library
} from 'lucide-react';

interface DataSource {
  id: string;
  name: string;
  description: string;
  sector: string;
  lastUpdated: string;
  size: string;
  indicators: number;
  aiUsage: boolean;
  relevanceScore: number;
  freshnessScore: number;
  reliabilityScore: number;
  completenessScore: number;
  updateFrequency: string;
  source: string;
  coveragePeriod: string;
  signalsCount: number;
  reportsCount: number;
  comparisonsCount: number;
  chartsCount: number;
  status: 'active' | 'inactive' | 'error';
}

interface DataProvider {
  id: string;
  name: string;
  datasetsCount: number;
  lastUpdate: string;
  reliabilityScore: number;
  freshnessScore: number;
  icon: any;
  color: string;
}

const DataSourcesPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSector, setSelectedSector] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedDataset, setSelectedDataset] = useState<DataSource | null>(null);
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  // Mock Data Providers
  const dataProviders: DataProvider[] = [
    {
      id: 'p1',
      name: 'البوابة السعودية للبيانات المفتوحة',
      datasetsCount: 4520,
      lastUpdate: 'منذ 2 ساعة',
      reliabilityScore: 98,
      freshnessScore: 95,
      icon: Globe,
      color: 'blue'
    },
    {
      id: 'p2',
      name: 'وزارة الاقتصاد والتخطيط',
      datasetsCount: 2340,
      lastUpdate: 'منذ 5 ساعات',
      reliabilityScore: 96,
      freshnessScore: 92,
      icon: Building2,
      color: 'emerald'
    },
    {
      id: 'p3',
      name: 'هيئة بيانات الطاقة',
      datasetsCount: 1890,
      lastUpdate: 'منذ 1 يوم',
      reliabilityScore: 94,
      freshnessScore: 88,
      icon: Droplet,
      color: 'amber'
    },
    {
      id: 'p4',
      name: 'السوق المالية (تداول)',
      datasetsCount: 3200,
      lastUpdate: 'مباشر',
      reliabilityScore: 99,
      freshnessScore: 99,
      icon: TrendingUp,
      color: 'green'
    },
    {
      id: 'p5',
      name: 'الهيئة العامة للعقار',
      datasetsCount: 1560,
      lastUpdate: 'منذ 3 ساعات',
      reliabilityScore: 93,
      freshnessScore: 90,
      icon: Home,
      color: 'purple'
    },
    {
      id: 'p6',
      name: 'وزارة التعليم',
      datasetsCount: 1729,
      lastUpdate: 'منذ أسبوع',
      reliabilityScore: 89,
      freshnessScore: 75,
      icon: GraduationCap,
      color: 'indigo'
    },
    {
      id: 'p7',
      name: 'وزارة السياحة',
      datasetsCount: 890,
      lastUpdate: 'منذ يومين',
      reliabilityScore: 91,
      freshnessScore: 82,
      icon: Plane,
      color: 'cyan'
    },
    {
      id: 'p8',
      name: 'وزارة المالية',
      datasetsCount: 2100,
      lastUpdate: 'منذ 4 ساعات',
      reliabilityScore: 97,
      freshnessScore: 94,
      icon: Wallet,
      color: 'rose'
    }
  ];

  // Mock Datasets
  const datasets: DataSource[] = [
    {
      id: 'd1',
      name: 'مؤشرات الناتج المحلي الإجمالي 2024',
      description: 'بيانات شاملة للناتج المحلي الإجمالي بالأسعار الثابتة والجارية حسب القطاعات الاقتصادية',
      sector: 'الاقتصاد',
      lastUpdated: '2024-01-15',
      size: '24 MB',
      indicators: 156,
      aiUsage: true,
      relevanceScore: 98,
      freshnessScore: 95,
      reliabilityScore: 97,
      completenessScore: 94,
      updateFrequency: 'ربع سنوي',
      source: 'الهيئة العامة للإحصاء',
      coveragePeriod: '2010-2024',
      signalsCount: 45,
      reportsCount: 23,
      comparisonsCount: 12,
      chartsCount: 89,
      status: 'active'
    },
    {
      id: 'd2',
      name: 'بيانات الاستثمار الأجنبي المباشر',
      description: 'إحصائيات تفصيلية للاستثمارات الأجنبية المباشرة حسب القطاع والجنسية',
      sector: 'الاستثمار',
      lastUpdated: '2024-01-10',
      size: '18 MB',
      indicators: 98,
      aiUsage: true,
      relevanceScore: 95,
      freshnessScore: 92,
      reliabilityScore: 96,
      completenessScore: 91,
      updateFrequency: 'شهري',
      source: 'وزارة الاستثمار',
      coveragePeriod: '2015-2024',
      signalsCount: 38,
      reportsCount: 19,
      comparisonsCount: 8,
      chartsCount: 67,
      status: 'active'
    },
    {
      id: 'd3',
      name: 'مؤشرات سوق العمل والتوظيف',
      description: 'بيانات معدلات التوظيف والبطالة حسب القطاع والمنطقة',
      sector: 'العمل',
      lastUpdated: '2024-01-12',
      size: '32 MB',
      indicators: 234,
      aiUsage: true,
      relevanceScore: 92,
      freshnessScore: 88,
      reliabilityScore: 94,
      completenessScore: 96,
      updateFrequency: 'ربع سنوي',
      source: 'وزارة الموارد البشرية',
      coveragePeriod: '2018-2024',
      signalsCount: 52,
      reportsCount: 31,
      comparisonsCount: 15,
      chartsCount: 102,
      status: 'active'
    },
    {
      id: 'd4',
      name: 'أسعار العقار والصفقات السكنية',
      description: 'سجل شامل لصفقات العقار السكني والتجاري في جميع المناطق',
      sector: 'العقار',
      lastUpdated: '2024-01-14',
      size: '45 MB',
      indicators: 189,
      aiUsage: true,
      relevanceScore: 96,
      freshnessScore: 94,
      reliabilityScore: 93,
      completenessScore: 92,
      updateFrequency: 'أسبوعي',
      source: 'الهيئة العامة للعقار',
      coveragePeriod: '2020-2024',
      signalsCount: 67,
      reportsCount: 28,
      comparisonsCount: 19,
      chartsCount: 134,
      status: 'active'
    },
    {
      id: 'd5',
      name: 'إنتاج واستهلاك الطاقة',
      description: 'بيانات تفصيلية لإنتاج النفط والغاز والاستهلاك المحلي',
      sector: 'الطاقة',
      lastUpdated: '2024-01-08',
      size: '28 MB',
      indicators: 145,
      aiUsage: true,
      relevanceScore: 94,
      freshnessScore: 90,
      reliabilityScore: 98,
      completenessScore: 95,
      updateFrequency: 'شهري',
      source: 'وزارة الطاقة',
      coveragePeriod: '2012-2024',
      signalsCount: 41,
      reportsCount: 22,
      comparisonsCount: 11,
      chartsCount: 78,
      status: 'active'
    },
    {
      id: 'd6',
      name: 'مؤشرات التضخم والأسعار',
      description: 'الأرقام القياسية لأسعار المستهلك والتضخم الأساسي',
      sector: 'الاقتصاد',
      lastUpdated: '2024-01-13',
      size: '15 MB',
      indicators: 87,
      aiUsage: true,
      relevanceScore: 97,
      freshnessScore: 96,
      reliabilityScore: 95,
      completenessScore: 93,
      updateFrequency: 'شهري',
      source: 'البنك المركزي السعودي',
      coveragePeriod: '2016-2024',
      signalsCount: 56,
      reportsCount: 34,
      comparisonsCount: 14,
      chartsCount: 91,
      status: 'active'
    },
    {
      id: 'd7',
      name: 'بيانات السياحة والفعاليات',
      description: 'إحصائيات أعداد السياح والفعاليات السياحية والموسمية',
      sector: 'السياحة',
      lastUpdated: '2024-01-05',
      size: '22 MB',
      indicators: 112,
      aiUsage: false,
      relevanceScore: 78,
      freshnessScore: 75,
      reliabilityScore: 88,
      completenessScore: 82,
      updateFrequency: 'ربع سنوي',
      source: 'وزارة السياحة',
      coveragePeriod: '2019-2024',
      signalsCount: 12,
      reportsCount: 8,
      comparisonsCount: 5,
      chartsCount: 34,
      status: 'active'
    },
    {
      id: 'd8',
      name: 'الميزانية العامة والإنفاق الحكومي',
      description: 'بيانات الميزانية العامة والإيرادات والمصروفات الحكومية',
      sector: 'المالية',
      lastUpdated: '2024-01-11',
      size: '35 MB',
      indicators: 178,
      aiUsage: true,
      relevanceScore: 93,
      freshnessScore: 91,
      reliabilityScore: 97,
      completenessScore: 94,
      updateFrequency: 'ربع سنوي',
      source: 'وزارة المالية',
      coveragePeriod: '2017-2024',
      signalsCount: 34,
      reportsCount: 26,
      comparisonsCount: 9,
      chartsCount: 72,
      status: 'active'
    }
  ];

  // Sector Coverage Data
  const sectorCoverage = [
    { sector: 'الاقتصاد', count: 4520, color: 'bg-blue-500' },
    { sector: 'الطاقة', count: 1890, color: 'bg-amber-500' },
    { sector: 'العقار', count: 1560, color: 'bg-purple-500' },
    { sector: 'الاستثمار', count: 2340, color: 'bg-emerald-500' },
    { sector: 'العمل', count: 1729, color: 'bg-indigo-500' },
    { sector: 'المالية', count: 2100, color: 'bg-rose-500' },
    { sector: 'السياحة', count: 890, color: 'bg-cyan-500' },
    { sector: 'التعليم', count: 1200, color: 'bg-violet-500' }
  ];

  // AI Intelligence Insights
  const aiInsights = [
    {
      type: 'success',
      title: 'قطاع الاقتصاد يحتوي على 4,520 مجموعة بيانات',
      description: 'أعلى تغطية بيانات بين جميع القطاعات',
      icon: CheckCircle2
    },
    {
      type: 'warning',
      title: 'قطاع السياحة يحتاج لمزيد من البيانات',
      description: 'قد يؤثر على دقة التحليلات الاستثمارية السياحية',
      icon: AlertCircle
    },
    {
      type: 'info',
      title: 'قطاع الطاقة يظهر تردد تحديث عالي',
      description: '88% من البيانات يتم تحديثها شهرياً',
      icon: Activity
    },
    {
      type: 'error',
      title: '12 مجموعة بيانات غير نشطة',
      description: 'لم يتم تحديثها منذ أكثر من 6 أشهر',
      icon: AlertCircle
    }
  ];

  // Filter datasets
  const filteredDatasets = useMemo(() => {
    return datasets.filter(dataset => {
      const matchesSearch = dataset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           dataset.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesSector = selectedSector === 'all' || dataset.sector === selectedSector;
      return matchesSearch && matchesSector;
    });
  }, [searchQuery, selectedSector]);

  // Calculate stats
  const totalDatasets = datasets.reduce((acc, d) => acc + d.indicators, 0);
  const activeSources = dataProviders.length;
  const aiSignalsGenerated = datasets.reduce((acc, d) => acc + d.signalsCount, 0);
  const avgHealthScore = Math.round(
    datasets.reduce((acc, d) => acc + d.reliabilityScore, 0) / datasets.length
  );

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-emerald-500';
    if (score >= 75) return 'text-blue-500';
    if (score >= 60) return 'text-amber-500';
    return 'text-rose-500';
  };

  const getScoreBg = (score: number) => {
    if (score >= 90) return 'bg-emerald-500';
    if (score >= 75) return 'bg-blue-500';
    if (score >= 60) return 'bg-amber-500';
    return 'bg-rose-500';
  };

  return (
    <div className="p-6 lg:p-10 font-sans max-w-[1800px] mx-auto animate-fadeIn" dir="rtl">
      
      {/* 1. Page Header */}
      <header className="mb-8">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-6">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
              <Database size={32} className="text-blue-600" />
              مصادر البيانات الذكية
            </h1>
            <p className="text-sm font-bold text-slate-500 mt-2 leading-relaxed">
              استكشف جميع مجموعات البيانات التي تدعم تحليلات المنصة وإشاراتها ورؤاها السوقية
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Search */}
            <div className="relative group">
              <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={18} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ابحث عن مجموعة بيانات..."
                className="pl-4 pr-12 py-3 bg-white border border-slate-200 rounded-xl text-sm font-bold outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all w-72 shadow-sm"
              />
            </div>

            {/* Filters */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-3 border rounded-xl text-sm font-bold transition-colors shadow-sm ${
                showFilters ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              <Filter size={18} />
              تصفية
            </button>

            {/* Add New (Admin) */}
            <button className="flex items-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/30">
              <Plus size={18} />
              إضافة مصدر
            </button>

            {/* Refresh */}
            <button className="flex items-center gap-2 px-4 py-3 bg-white border border-slate-200 text-slate-700 rounded-xl text-sm font-bold hover:bg-slate-50 transition-colors shadow-sm">
              <RefreshCw size={18} />
              تحديث البيانات
            </button>
          </div>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm animate-slideDown mb-6">
            <div className="flex items-center gap-4">
              <span className="text-sm font-black text-slate-700">القطاع:</span>
              <div className="flex flex-wrap gap-2">
                {['all', 'الاقتصاد', 'الطاقة', 'العقار', 'الاستثمار', 'العمل', 'المالية', 'السياحة'].map(sector => (
                  <button
                    key={sector}
                    onClick={() => setSelectedSector(sector)}
                    className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${
                      selectedSector === sector
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {sector === 'all' ? 'الكل' : sector}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </header>

      {/* 2. Global Data Summary (Hero Stats) */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
              <Database size={24} />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">إجمالي مجموعات البيانات</p>
              <p className="text-3xl font-black text-slate-900 mt-1">{totalDatasets.toLocaleString('ar-SA')}</p>
            </div>
          </div>
          <div className="flex items-center gap-1 text-emerald-500 text-sm font-bold">
            <ArrowUpRight size={16} />
            <span>+12% هذا الشهر</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600">
              <Activity size={24} />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">مصادر البيانات النشطة</p>
              <p className="text-3xl font-black text-slate-900 mt-1">{activeSources}</p>
            </div>
          </div>
          <div className="flex items-center gap-1 text-emerald-500 text-sm font-bold">
            <CheckCircle2 size={16} />
            <span>جميعها متصلة</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600">
              <Zap size={24} />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">إشارات AI المُولدة</p>
              <p className="text-3xl font-black text-slate-900 mt-1">{aiSignalsGenerated.toLocaleString('ar-SA')}</p>
            </div>
          </div>
          <div className="flex items-center gap-1 text-emerald-500 text-sm font-bold">
            <ArrowUpRight size={16} />
            <span>+28% هذا الأسبوع</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600">
              <Shield size={24} />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">درجة موثوقية البيانات</p>
              <p className="text-3xl font-black text-slate-900 mt-1">{avgHealthScore}%</p>
            </div>
          </div>
          <div className="flex items-center gap-1 text-emerald-500 text-sm font-bold">
            <ArrowUpRight size={16} />
            <span>+3% تحسن</span>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* Main Content - 2 columns */}
        <div className="xl:col-span-2 space-y-8">
          
          {/* 3. Dataset Source Explorer */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <Building2 size={20} className="text-blue-600" />
                مستكشف مصادر البيانات
              </h2>
              <button className="text-sm font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1">
                عرض الكل
                <ChevronRight size={16} />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {dataProviders.map((provider) => (
                <div
                  key={provider.id}
                  className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer group"
                >
                  <div className="flex items-start gap-3 mb-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      provider.color === 'blue' ? 'bg-blue-50 text-blue-600' :
                      provider.color === 'emerald' ? 'bg-emerald-50 text-emerald-600' :
                      provider.color === 'amber' ? 'bg-amber-50 text-amber-600' :
                      provider.color === 'green' ? 'bg-green-50 text-green-600' :
                      provider.color === 'purple' ? 'bg-purple-50 text-purple-600' :
                      provider.color === 'indigo' ? 'bg-indigo-50 text-indigo-600' :
                      provider.color === 'cyan' ? 'bg-cyan-50 text-cyan-600' :
                      'bg-rose-50 text-rose-600'
                    }`}>
                      <provider.icon size={24} />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-sm font-black text-slate-900 group-hover:text-blue-600 transition-colors">
                        {provider.name}
                      </h3>
                      <p className="text-xs text-slate-500 font-bold mt-1">
                        {provider.datasetsCount.toLocaleString('ar-SA')} مجموعة بيانات
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="text-center">
                        <p className="text-[9px] font-bold text-slate-400 uppercase">الموثوقية</p>
                        <p className={`text-sm font-black ${getScoreColor(provider.reliabilityScore)}`}>
                          {provider.reliabilityScore}%
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-[9px] font-bold text-slate-400 uppercase">التحديث</p>
                        <p className={`text-sm font-black ${getScoreColor(provider.freshnessScore)}`}>
                          {provider.freshnessScore}%
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-slate-400 text-xs font-bold">
                      <Clock size={14} />
                      {provider.lastUpdate}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* 4. Dataset Library (Main Section) */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <Library size={20} className="text-blue-600" />
                مكتبة مجموعات البيانات
              </h2>
              <span className="text-sm font-bold text-slate-500">
                {filteredDatasets.length} مجموعة بيانات
              </span>
            </div>

            <div className="space-y-3">
              {filteredDatasets.map((dataset) => (
                <div
                  key={dataset.id}
                  className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-sm font-black text-slate-900">{dataset.name}</h3>
                        {dataset.aiUsage && (
                          <span className="px-2 py-0.5 bg-purple-50 text-purple-600 text-[9px] font-black rounded-full flex items-center gap-1">
                            <Cpu size={10} />
                            AI
                          </span>
                        )}
                        <span className={`px-2 py-0.5 text-[9px] font-black rounded-full ${
                          dataset.status === 'active' ? 'bg-emerald-50 text-emerald-600' :
                          dataset.status === 'inactive' ? 'bg-slate-50 text-slate-600' :
                          'bg-rose-50 text-rose-600'
                        }`}>
                          {dataset.status === 'active' ? 'نشط' : dataset.status === 'inactive' ? 'غير نشط' : 'خطأ'}
                        </span>
                      </div>

                      <p className="text-xs text-slate-500 font-bold leading-relaxed mb-3">
                        {dataset.description}
                      </p>

                      <div className="flex items-center gap-4 mb-3">
                        <span className="px-2.5 py-1 bg-blue-50 text-blue-700 text-[10px] font-bold rounded-lg">
                          {dataset.sector}
                        </span>
                        <span className="flex items-center gap-1 text-[10px] font-bold text-slate-500">
                          <Calendar size={12} />
                          آخر تحديث: {dataset.lastUpdated}
                        </span>
                        <span className="flex items-center gap-1 text-[10px] font-bold text-slate-500">
                          <Table size={12} />
                          {dataset.size}
                        </span>
                        <span className="flex items-center gap-1 text-[10px] font-bold text-slate-500">
                          <BarChart3 size={12} />
                          {dataset.indicators} مؤشر
                        </span>
                      </div>

                      {/* Quality Indicators */}
                      <div className="flex items-center gap-4 mb-4">
                        <div className="flex-1">
                          <div className="flex justify-between text-[9px] font-bold mb-1">
                            <span className="text-slate-500">الحداثة</span>
                            <span className={getScoreColor(dataset.freshnessScore)}>{dataset.freshnessScore}%</span>
                          </div>
                          <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <div className={`h-full ${getScoreBg(dataset.freshnessScore)} rounded-full`} style={{ width: `${dataset.freshnessScore}%` }}></div>
                          </div>
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between text-[9px] font-bold mb-1">
                            <span className="text-slate-500">الموثوقية</span>
                            <span className={getScoreColor(dataset.reliabilityScore)}>{dataset.reliabilityScore}%</span>
                          </div>
                          <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <div className={`h-full ${getScoreBg(dataset.reliabilityScore)} rounded-full`} style={{ width: `${dataset.reliabilityScore}%` }}></div>
                          </div>
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between text-[9px] font-bold mb-1">
                            <span className="text-slate-500">الاكتمال</span>
                            <span className={getScoreColor(dataset.completenessScore)}>{dataset.completenessScore}%</span>
                          </div>
                          <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <div className={`h-full ${getScoreBg(dataset.completenessScore)} rounded-full`} style={{ width: `${dataset.completenessScore}%` }}></div>
                          </div>
                        </div>
                      </div>

                      {/* Integration Stats */}
                      <div className="flex items-center gap-4 pt-3 border-t border-slate-100">
                        <div className="flex items-center gap-1 text-[10px] font-bold text-slate-500">
                          <Zap size={12} className="text-purple-500" />
                          {dataset.signalsCount} إشارة
                        </div>
                        <div className="flex items-center gap-1 text-[10px] font-bold text-slate-500">
                          <FileText size={12} className="text-blue-500" />
                          {dataset.reportsCount} تقرير
                        </div>
                        <div className="flex items-center gap-1 text-[10px] font-bold text-slate-500">
                          <GitCompare size={12} className="text-emerald-500" />
                          {dataset.comparisonsCount} مقارنة
                        </div>
                        <div className="flex items-center gap-1 text-[10px] font-bold text-slate-500">
                          <PieChart size={12} className="text-amber-500" />
                          {dataset.chartsCount} رسم
                        </div>
                        <div className="flex-1"></div>
                        <span className="text-[10px] font-black text-slate-400">
                          درجة الأهمية: <span className={getScoreColor(dataset.relevanceScore)}>{dataset.relevanceScore}%</span>
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-2">
                      <button
                        onClick={() => {
                          setSelectedDataset(dataset);
                          setShowPreviewModal(true);
                        }}
                        className="px-4 py-2 bg-blue-50 text-blue-600 text-sm font-bold rounded-lg hover:bg-blue-100 transition-colors flex items-center gap-2"
                      >
                        <Eye size={16} />
                        معاينة
                      </button>
                      <button className="px-4 py-2 bg-white border border-slate-200 text-slate-700 text-sm font-bold rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-2">
                        <BarChart3 size={16} />
                        تحليلات
                      </button>
                      <button className="px-4 py-2 bg-white border border-slate-200 text-slate-700 text-sm font-bold rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-2">
                        <Download size={16} />
                        تحميل
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

        </div>

        {/* Sidebar - 1 column */}
        <div className="space-y-6">
          
          {/* 5. Sector Coverage Map */}
          <section className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="text-sm font-black text-slate-900 mb-4 flex items-center gap-2">
              <Layers size={18} className="text-blue-600" />
              تغطية القطاعات
            </h3>
            <div className="space-y-3">
              {sectorCoverage.map((item, idx) => (
                <div key={`${item.sector}-${idx}`} className="flex items-center gap-3">
                  <div className={`w-2 h-8 ${item.color} rounded-full`}></div>
                  <div className="flex-1">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="font-bold text-slate-700">{item.sector}</span>
                      <span className="font-black text-slate-900">{item.count.toLocaleString('ar-SA')}</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className={`h-full ${item.color} rounded-full`} style={{ width: `${(item.count / 4520) * 100}%` }}></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* 6. AI Data Intelligence Panel */}
          <section className="bg-gradient-to-br from-slate-900 to-slate-800 p-6 rounded-2xl shadow-xl">
            <h3 className="text-sm font-black text-white mb-4 flex items-center gap-2">
              <Cpu size={18} className="text-blue-400" />
              الذكاء الاصطناعي للبيانات
            </h3>
            <div className="space-y-4">
              {aiInsights.map((insight, idx) => (
                <div key={`${insight.type}-${idx}`} className="bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/10">
                  <div className="flex items-start gap-3">
                    <insight.icon size={18} className={`shrink-0 mt-0.5 ${
                      insight.type === 'success' ? 'text-emerald-400' :
                      insight.type === 'warning' ? 'text-amber-400' :
                      insight.type === 'info' ? 'text-blue-400' :
                      'text-rose-400'
                    }`} />
                    <div>
                      <p className="text-xs font-bold text-white mb-1">{insight.title}</p>
                      <p className="text-[10px] text-slate-300 leading-relaxed">{insight.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* 11. Data Sync Monitor */}
          <section className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="text-sm font-black text-slate-900 mb-4 flex items-center gap-2">
              <RefreshCw size={18} className="text-emerald-600" />
              مراقبة مزامنة البيانات
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-600">آخر مزامنة</span>
                <span className="text-xs font-black text-emerald-600">منذ 12 دقيقة</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-600">سرعة المزامنة</span>
                <span className="text-xs font-black text-blue-600">2.3 ثانية</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-600">أخطاء المزامنة</span>
                <span className="text-xs font-black text-emerald-600">0</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-600">تحديثات قيد الانتظار</span>
                <span className="text-xs font-black text-amber-600">3</span>
              </div>
              <div className="pt-3 border-t border-slate-100">
                <div className="flex justify-between text-xs mb-2">
                  <span className="font-bold text-slate-600">صحة خط الأنابيب</span>
                  <span className="font-black text-emerald-600">98%</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: '98%' }}></div>
                </div>
              </div>
            </div>
          </section>

          {/* 12. Dataset Usage Analytics */}
          <section className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="text-sm font-black text-slate-900 mb-4 flex items-center gap-2">
              <Target size={18} className="text-purple-600" />
              الأكثر استخداماً
            </h3>
            <div className="space-y-3">
              {[
                { name: 'مؤشرات الناتج المحلي', usage: 892, color: 'bg-blue-500' },
                { name: 'أسعار العقار', usage: 756, color: 'bg-purple-500' },
                { name: 'الاستثمار الأجنبي', usage: 634, color: 'bg-emerald-500' },
                { name: 'مؤشرات التضخم', usage: 521, color: 'bg-amber-500' }
              ].map((item, idx) => (
                <div key={`${item.name}-${idx}`} className="flex items-center gap-3">
                  <div className={`w-1.5 h-8 ${item.color} rounded-full`}></div>
                  <div className="flex-1">
                    <p className="text-xs font-bold text-slate-700 mb-1">{item.name}</p>
                    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className={`h-full ${item.color} rounded-full`} style={{ width: `${(item.usage / 892) * 100}%` }}></div>
                    </div>
                  </div>
                  <span className="text-xs font-black text-slate-900">{item.usage}</span>
                </div>
              ))}
            </div>
          </section>

          {/* 13. Recommended Datasets */}
          <section className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-2xl border border-blue-100">
            <h3 className="text-sm font-black text-slate-900 mb-4 flex items-center gap-2">
              <Star size={18} className="text-amber-500" />
              مجموعات مقترحة
            </h3>
            <div className="space-y-3">
              {[
                { name: 'بيانات التعدين', sector: 'الطاقة', score: 94 },
                { name: 'الإحصاءات السكانية', sector: 'العمل', score: 91 },
                { name: 'مؤشرات التجزئة', sector: 'الاقتصاد', score: 88 }
              ].map((item, idx) => (
                <div key={`${item.name}-${idx}`} className="bg-white p-3 rounded-xl border border-blue-100 hover:shadow-md transition-all cursor-pointer">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-xs font-black text-slate-900">{item.name}</p>
                    <span className="text-[9px] font-black text-blue-600">{item.score}%</span>
                  </div>
                  <span className="text-[9px] font-bold text-slate-500">{item.sector}</span>
                </div>
              ))}
            </div>
          </section>

        </div>
      </div>

      {/* 7. Dataset Preview Modal */}
      {showPreviewModal && selectedDataset && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl overflow-hidden animate-slideUp max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="relative bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white">
              <button
                onClick={() => setShowPreviewModal(false)}
                className="absolute top-6 left-6 w-10 h-10 flex items-center justify-center bg-white/10 hover:bg-white/20 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
              <div className="flex items-center gap-3 mb-2">
                <div className="bg-white/20 p-2 rounded-lg">
                  <Database size={20} />
                </div>
                <h2 className="text-xl font-black">معاينة مجموعة البيانات</h2>
              </div>
              <p className="text-blue-100 text-sm font-bold opacity-90">{selectedDataset.name}</p>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* Description */}
              <div>
                <h3 className="text-sm font-black text-slate-900 mb-2">الوصف</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{selectedDataset.description}</p>
              </div>

              {/* Meta Info Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 bg-slate-50 rounded-xl">
                  <p className="text-[9px] font-bold text-slate-500 uppercase mb-1">المصدر</p>
                  <p className="text-sm font-black text-slate-900">{selectedDataset.source}</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl">
                  <p className="text-[9px] font-bold text-slate-500 uppercase mb-1">فترة التغطية</p>
                  <p className="text-sm font-black text-slate-900">{selectedDataset.coveragePeriod}</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl">
                  <p className="text-[9px] font-bold text-slate-500 uppercase mb-1">تردد التحديث</p>
                  <p className="text-sm font-black text-slate-900">{selectedDataset.updateFrequency}</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl">
                  <p className="text-[9px] font-bold text-slate-500 uppercase mb-1">الحجم</p>
                  <p className="text-sm font-black text-slate-900">{selectedDataset.size}</p>
                </div>
              </div>

              {/* Data Preview Table */}
              <div>
                <h3 className="text-sm font-black text-slate-900 mb-3 flex items-center gap-2">
                  <Table size={16} className="text-blue-600" />
                  معاينة البيانات (أول 5 صفوف)
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-right text-sm">
                    <thead className="bg-slate-50 border-b border-slate-200">
                      <tr>
                        <th className="px-4 py-3 text-xs font-black text-slate-600">السنة</th>
                        <th className="px-4 py-3 text-xs font-black text-slate-600">القيمة</th>
                        <th className="px-4 py-3 text-xs font-black text-slate-600">التغير %</th>
                        <th className="px-4 py-3 text-xs font-black text-slate-600">المؤشر</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {[1, 2, 3, 4, 5].map((row) => (
                        <tr key={`row-${row}`} className="hover:bg-slate-50">
                          <td className="px-4 py-3 font-bold text-slate-900">{2020 + row}</td>
                          <td className="px-4 py-3 font-bold text-slate-700">{(Math.random() * 1000).toFixed(2)}</td>
                          <td className={`px-4 py-3 font-black ${Math.random() > 0.5 ? 'text-emerald-600' : 'text-rose-600'}`}>
                            {Math.random() > 0.5 ? '+' : '-'}{(Math.random() * 10).toFixed(1)}%
                          </td>
                          <td className="px-4 py-3">
                            <span className="px-2 py-1 bg-blue-50 text-blue-700 text-[10px] font-bold rounded">مؤشر {row}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Quality Scores */}
              <div>
                <h3 className="text-sm font-black text-slate-900 mb-3">مقاييس جودة البيانات</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-slate-50 rounded-xl">
                    <div className="relative w-20 h-20 mx-auto mb-2">
                      <svg className="w-20 h-20 transform -rotate-90">
                        <circle cx="40" cy="40" r="32" stroke="#e2e8f0" strokeWidth="8" fill="none" />
                        <circle cx="40" cy="40" r="32" stroke="#10b981" strokeWidth="8" fill="none" strokeDasharray={`${(selectedDataset.freshnessScore / 100) * 201} 201`} />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className={`text-lg font-black ${getScoreColor(selectedDataset.freshnessScore)}`}>{selectedDataset.freshnessScore}%</span>
                      </div>
                    </div>
                    <p className="text-[9px] font-bold text-slate-500 uppercase">الحداثة</p>
                  </div>
                  <div className="text-center p-4 bg-slate-50 rounded-xl">
                    <div className="relative w-20 h-20 mx-auto mb-2">
                      <svg className="w-20 h-20 transform -rotate-90">
                        <circle cx="40" cy="40" r="32" stroke="#e2e8f0" strokeWidth="8" fill="none" />
                        <circle cx="40" cy="40" r="32" stroke="#3b82f6" strokeWidth="8" fill="none" strokeDasharray={`${(selectedDataset.reliabilityScore / 100) * 201} 201`} />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className={`text-lg font-black ${getScoreColor(selectedDataset.reliabilityScore)}`}>{selectedDataset.reliabilityScore}%</span>
                      </div>
                    </div>
                    <p className="text-[9px] font-bold text-slate-500 uppercase">الموثوقية</p>
                  </div>
                  <div className="text-center p-4 bg-slate-50 rounded-xl">
                    <div className="relative w-20 h-20 mx-auto mb-2">
                      <svg className="w-20 h-20 transform -rotate-90">
                        <circle cx="40" cy="40" r="32" stroke="#e2e8f0" strokeWidth="8" fill="none" />
                        <circle cx="40" cy="40" r="32" stroke="#f59e0b" strokeWidth="8" fill="none" strokeDasharray={`${(selectedDataset.completenessScore / 100) * 201} 201`} />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className={`text-lg font-black ${getScoreColor(selectedDataset.completenessScore)}`}>{selectedDataset.completenessScore}%</span>
                      </div>
                    </div>
                    <p className="text-[9px] font-bold text-slate-500 uppercase">الاكتمال</p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4 border-t border-slate-200">
                <button className="flex-1 py-3 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
                  <BarChart3 size={18} />
                  فتح التحليلات الكاملة
                </button>
                <button className="flex-1 py-3 bg-white border border-slate-200 text-slate-700 rounded-xl text-sm font-bold hover:bg-slate-50 transition-colors flex items-center justify-center gap-2">
                  <Download size={18} />
                  تحميل البيانات
                </button>
                <button className="px-6 py-3 bg-slate-100 text-slate-700 rounded-xl text-sm font-bold hover:bg-slate-200 transition-colors">
                  إغلاق
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default DataSourcesPage;
