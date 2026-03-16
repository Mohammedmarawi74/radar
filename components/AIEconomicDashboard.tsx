import React, { useState } from 'react';
import {
  TrendingUp, TrendingDown, Activity, Database, Users, FileText,
  RefreshCw, Calendar, Download, Cpu, Zap, Shield, AlertCircle,
  CheckCircle2, ArrowUpRight, ArrowDownRight, Info, Clock,
  BarChart3, PieChart, Layers, Target, Star, Lightbulb, Eye,
  Briefcase, Building2, Globe, Wallet, Oil, Home, GraduationCap,
  Plane, Heart, Smile, Frown, Minus, ChevronRight, Search, Filter,
  ExternalLink, Share2, Save, Printer, X, Copy
} from 'lucide-react';
import { useToast } from './Toast';

interface EconomicIndicator {
  id: string;
  name: string;
  value: string;
  change: string;
  isPositive: boolean;
  trend: number[];
}

interface SectorPerformance {
  sector: string;
  growth: number;
  activity: number;
  datasets: number;
  signals: number;
  color: string;
}

interface AIInsight {
  id: string;
  title: string;
  description: string;
  confidence: number;
  impact: 'high' | 'medium' | 'low';
  category: 'opportunity' | 'risk' | 'monitoring';
  icon: any;
}

interface EconomicEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  source: string;
  importance: 'high' | 'medium' | 'low';
  type: 'report' | 'indicator' | 'announcement' | 'policy';
}

interface EconomicNews {
  id: string;
  title: string;
  description: string;
  source: string;
  sourceLogo: string;
  publishedDate: string;
  link: string;
  category: 'economy' | 'markets' | 'energy' | 'policy' | 'technology' | 'general';
}

const AIEconomicDashboard = () => {
  const [dateRange, setDateRange] = useState('month');
  const [showAIAnalysis, setShowAIAnalysis] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [selectedSector, setSelectedSector] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'growth' | 'activity'>('growth');
  const [newsFilter, setNewsFilter] = useState<string>('all');
  const [newsSearch, setNewsSearch] = useState('');
  const [showNewsModal, setShowNewsModal] = useState(false);
  const [selectedNews, setSelectedNews] = useState<EconomicNews | null>(null);
  const [newsLastUpdated, setNewsLastUpdated] = useState(new Date());

  const { showToast } = useToast();

  // Mock RSS Economic News Data
  const economicNews: EconomicNews[] = [
    {
      id: 'n1',
      title: 'البنك المركزي السعودي يبقي على أسعار الفائدة دون تغيير',
      description: 'قرر البنك المركزي السعودي الإبقاء على سعر الريبو الأساسي عند 6.00% في اجتماعه الأخير، متماشياً مع توقعات المحللين وسط استقرار معدلات التضخم.',
      source: 'Reuters',
      sourceLogo: '📰',
      publishedDate: '2024-01-15T09:30:00',
      link: 'https://reuters.com',
      category: 'economy'
    },
    {
      id: 'n2',
      title: 'صندوق النقد الدولي يرفع توقعات نمو الاقتصاد السعودي',
      description: 'رفع صندوق النقد الدولي توقعاته لنمو الاقتصاد السعودي في 2024 إلى 3.2% مدفوعاً بالنمو القوي للقطاع غير النفطي والإصلاحات الهيكلية.',
      source: 'IMF',
      sourceLogo: '🏦',
      publishedDate: '2024-01-15T08:00:00',
      link: 'https://imf.org',
      category: 'economy'
    },
    {
      id: 'n3',
      title: 'أسعار النفط ترتفع 3% بعد بيانات المخزونات الأمريكية',
      description: 'ارتفعت أسعار النفط الخام بنسبة 3% بعد ظهور بيانات رسمية أمريكية انخفاضاً غير متوقع في مخزونات الخام الأسبوعية.',
      source: 'Bloomberg',
      sourceLogo: '📊',
      publishedDate: '2024-01-15T07:15:00',
      link: 'https://bloomberg.com',
      category: 'energy'
    },
    {
      id: 'n4',
      title: 'التضخم في منطقة اليورو يتباطأ إلى 2.4% في ديسمبر',
      description: 'تباطأ معدل التضخم السنوي في منطقة اليورو إلى 2.4% في ديسمبر من 2.9% في نوفمبر، مما يعزز آمال خفض أسعار الفائدة.',
      source: 'CNBC',
      sourceLogo: '📈',
      publishedDate: '2024-01-14T14:00:00',
      link: 'https://cnbc.com',
      category: 'markets'
    },
    {
      id: 'n5',
      title: 'السعودية تطلق مبادرة جديدة لجذب الاستثمارات التقنية',
      description: 'أطلقت وزارة الاستثمار السعودية مبادرة جديدة تهدف لجذب 100 مليار ريال من الاستثمارات الأجنبية في قطاع التقنية خلال 5 سنوات.',
      source: 'Arab News',
      sourceLogo: '📰',
      publishedDate: '2024-01-14T11:30:00',
      link: 'https://arabnews.com',
      category: 'technology'
    },
    {
      id: 'n6',
      title: 'البنك الدولي: الاقتصاد العالمي يتجنب الركود لكن النمو ضعيف',
      description: 'أعلن البنك الدولي أن الاقتصاد العالمي تجنب الركود لكن النمو يبقى ضعيفاً عند 2.9% في 2024 وسط تحديات جيوسياسية ومالية.',
      source: 'World Bank',
      sourceLogo: '🌍',
      publishedDate: '2024-01-14T10:00:00',
      link: 'https://worldbank.org',
      category: 'economy'
    },
    {
      id: 'n7',
      title: 'أسواق الأسهم الخليجية تسجل مكاسب جماعية في بداية الأسبوع',
      description: 'أغلقت أسواق الأسهم الخليجية على ارتفاع جماعي في تداولات اليوم بقيادة قطاعي البنوك والبتروكيماويات.',
      source: 'Al Arabiya',
      sourceLogo: '📺',
      publishedDate: '2024-01-14T09:00:00',
      link: 'https://alarabiya.net',
      category: 'markets'
    },
    {
      id: 'n8',
      title: 'أوبك+ تبقي على سياسة الإنتاج دون تغيير',
      description: 'قررت دول أوبك+ الإبقاء على مستويات الإنتاج الحالية دون تغيير في اجتماعها الأخير وسط استقرار أسعار النفط.',
      source: 'Reuters',
      sourceLogo: '📰',
      publishedDate: '2024-01-13T16:00:00',
      link: 'https://reuters.com',
      category: 'energy'
    },
    {
      id: 'n9',
      title: 'وزارة المالية تعلن عن فائض في الميزانية الربع سنوية',
      description: 'أعلنت وزارة المالية السعودية عن تحقيق فائض في الميزانية الربع سنوية بقيمة 12 مليار ريال مدفوعاً بارتفاع الإيرادات غير النفطية.',
      source: 'SPA',
      sourceLogo: '🇸🇦',
      publishedDate: '2024-01-13T13:00:00',
      link: 'https://spa.gov.sa',
      category: 'policy'
    },
    {
      id: 'n10',
      title: 'الذكاء الاصطناعي يساهم بـ 150 مليار دولار في الاقتصاد السعودي',
      description: 'تقرير جديد يتوقع أن يساهم الذكاء الاصطناعي بنحو 150 مليار دولار في الاقتصاد السعودي بحلول 2030 ضمن رؤية المملكة.',
      source: 'Forbes',
      sourceLogo: '💼',
      publishedDate: '2024-01-13T10:30:00',
      link: 'https://forbes.com',
      category: 'technology'
    }
  ];

  // Handler functions for news
  const handleNewsClick = (news: EconomicNews) => {
    setSelectedNews(news);
    setShowNewsModal(true);
  };

  const handleRefreshNews = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      setNewsLastUpdated(new Date());
      showToast('تم تحديث الأخبار بنجاح', 'success');
    }, 1000);
  };

  const getMinutesAgo = (date: Date) => {
    const now = new Date();
    const diff = Math.floor((now.getTime() - date.getTime()) / 60000);
    if (diff < 1) return 'الآن';
    if (diff < 60) return `منذ ${diff} دقيقة`;
    const hours = Math.floor(diff / 60);
    if (hours < 24) return `منذ ${hours} ساعة`;
    return `منذ ${Math.floor(hours / 24)} يوم`;
  };

  const getCategoryBadge = (category: string) => {
    const categories: { [key: string]: { label: string; color: string } } = {
      economy: { label: 'اقتصاد', color: 'bg-blue-50 text-blue-700' },
      markets: { label: 'أسواق', color: 'bg-emerald-50 text-emerald-700' },
      energy: { label: 'طاقة', color: 'bg-amber-50 text-amber-700' },
      policy: { label: 'سياسة', color: 'bg-purple-50 text-purple-700' },
      technology: { label: 'تقنية', color: 'bg-cyan-50 text-cyan-700' },
      general: { label: 'عام', color: 'bg-slate-50 text-slate-700' }
    };
    return categories[category] || categories.general;
  };

  const filteredNews = economicNews.filter(news => {
    const matchesFilter = newsFilter === 'all' || news.category === newsFilter;
    const matchesSearch = news.title.toLowerCase().includes(newsSearch.toLowerCase()) ||
                         news.description.toLowerCase().includes(newsSearch.toLowerCase());
    return matchesFilter && matchesSearch;
  }).slice(0, 10);

  // Functional Handlers
  const handleRefresh = () => {
    setIsRefreshing(true);
    // Simulate API call
    setTimeout(() => {
      setIsRefreshing(false);
      setLastUpdated(new Date());
      showToast('تم تحديث البيانات بنجاح', 'success');
    }, 1500);
  };

  const handleExport = (format: 'pdf' | 'excel' | 'csv') => {
    setShowExportModal(false);
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      const formats = { pdf: 'PDF', excel: 'Excel', csv: 'CSV' };
      showToast(`تم تصدير التقرير بصيغة ${formats[format]} بنجاح`, 'success');
    }, 2000);
  };

  const handleSaveView = () => {
    localStorage.setItem('economicDashboardView', JSON.stringify({
      dateRange,
      showAIAnalysis,
      sortBy,
      selectedSector
    }));
    setShowSaveModal(false);
    showToast('تم حفظ إعدادات العرض بنجاح', 'success');
  };

  const handleShare = (platform: string) => {
    setShowShareModal(false);
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent('لوحة الذكاء الاقتصادي - رادار المستثمر');
    
    const shareUrls: { [key: string]: string } = {
      twitter: `https://twitter.com/intent/tweet?url=${url}&text=${text}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
      whatsapp: `https://wa.me/?text=${text}%20${url}`,
      email: `mailto:?subject=${text}&body=${url}`
    };

    if (platform === 'copy') {
      navigator.clipboard.writeText(window.location.href);
      showToast('تم نسخ الرابط بنجاح', 'success');
    } else if (shareUrls[platform]) {
      window.open(shareUrls[platform], '_blank');
      showToast('جاري فتح المشاركة...', 'info');
    }
  };

  const handleSectorClick = (sector: string) => {
    setSelectedSector(sector === selectedSector ? null : sector);
    showToast(`عرض تفاصيل قطاع ${sector}`, 'info');
  };

  const handleExportQuick = () => {
    setShowExportModal(true);
  };

  const handleNavigateTo = (page: string) => {
    const routes: { [key: string]: string } = {
      'signals': '/signals',
      'sources': '/sources',
      'comparisons': '/comparisons',
      'dashboards': '/dashboards'
    };
    if (routes[page]) {
      window.location.href = routes[page];
    }
  };

  const handleLoadSavedView = () => {
    const saved = localStorage.getItem('economicDashboardView');
    if (saved) {
      const view = JSON.parse(saved);
      setDateRange(view.dateRange || 'month');
      setShowAIAnalysis(view.showAIAnalysis !== false);
      setSortBy(view.sortBy || 'growth');
      setSelectedSector(view.selectedSector || null);
      showToast('تم استعادة الإعدادات المحفوظة', 'success');
    } else {
      showToast('لا توجد إعدادات محفوظة', 'info');
    }
  };

  const handlePrint = () => {
    window.print();
    showToast('جاري تحضير الطباعة...', 'info');
  };

  // Mock Economic Indicators
  const economicIndicators: EconomicIndicator[] = [
    {
      id: '1',
      name: 'إجمالي مجموعات البيانات',
      value: '17,888',
      change: '+12.5%',
      isPositive: true,
      trend: [15000, 15500, 16200, 16800, 17200, 17888]
    },
    {
      id: '2',
      name: 'إشارات السوق النشطة',
      value: '7',
      change: '+3',
      isPositive: true,
      trend: [2, 3, 2, 4, 5, 7]
    },
    {
      id: '3',
      name: 'المستخدمون المسجلون',
      value: '13',
      change: '+2',
      isPositive: true,
      trend: [8, 9, 10, 11, 12, 13]
    },
    {
      id: '4',
      name: 'المحتوى المنشور',
      value: '55',
      change: '+18%',
      isPositive: true,
      trend: [35, 38, 42, 47, 51, 55]
    },
    {
      id: '5',
      name: 'مجموعات بيانات جديدة هذا الأسبوع',
      value: '24',
      change: '+8',
      isPositive: true,
      trend: [12, 15, 14, 18, 20, 24]
    },
    {
      id: '6',
      name: 'رؤى AI المُولدة',
      value: '142',
      change: '+28%',
      isPositive: true,
      trend: [98, 105, 115, 125, 135, 142]
    }
  ];

  // Mock Sector Performance
  const sectorPerformance: SectorPerformance[] = [
    { sector: 'الاقتصاد', growth: 15.2, activity: 92, datasets: 4520, signals: 45, color: 'bg-blue-500' },
    { sector: 'الطاقة', growth: 12.8, activity: 88, datasets: 1890, signals: 38, color: 'bg-amber-500' },
    { sector: 'العقار', growth: 10.5, activity: 85, datasets: 1560, signals: 32, color: 'bg-purple-500' },
    { sector: 'الاستثمار', growth: 18.3, activity: 90, datasets: 2340, signals: 41, color: 'bg-emerald-500' },
    { sector: 'العمل', growth: 8.7, activity: 78, datasets: 1729, signals: 28, color: 'bg-indigo-500' },
    { sector: 'المالية', growth: 14.1, activity: 86, datasets: 2100, signals: 35, color: 'bg-rose-500' },
    { sector: 'السياحة', growth: 22.5, activity: 82, datasets: 890, signals: 24, color: 'bg-cyan-500' },
    { sector: 'التعليم', growth: 6.3, activity: 72, datasets: 1200, signals: 18, color: 'bg-violet-500' }
  ];

  // Mock AI Insights
  const aiInsights: AIInsight[] = [
    {
      id: '1',
      title: 'قطاع السياحة يظهر نمواً استثنائياً',
      description: 'تحليل البيانات يشير إلى نمو بنسبة 22.5% في مؤشرات السياحة مع زيادة الطلب على الفنادق والفعاليات',
      confidence: 94,
      impact: 'high',
      category: 'opportunity',
      icon: TrendingUp
    },
    {
      id: '2',
      title: 'نقص في بيانات قطاع التعليم',
      description: 'قطاع التعليم يحتوي على 1729 مجموعة بيانات فقط، مما قد يؤثر على دقة التحليلات الاستثمارية',
      confidence: 87,
      impact: 'medium',
      category: 'risk',
      icon: AlertCircle
    },
    {
      id: '3',
      title: 'تكامل كامل مع البوابة الوطنية',
      description: 'تمت مزامنة جميع البيانات مع البوابة السعودية للبيانات المفتوحة بنجاح',
      confidence: 99,
      impact: 'high',
      category: 'opportunity',
      icon: CheckCircle2
    },
    {
      id: '4',
      title: 'تنوع البيانات عبر 51 قطاع',
      description: 'المنصة تغطي 51 قطاع اقتصادي مختلف مع تحديثات مستمرة',
      confidence: 96,
      impact: 'medium',
      category: 'monitoring',
      icon: Layers
    },
    {
      id: '5',
      title: 'ارتفاع مؤشرات الاستثمار الأجنبي',
      description: 'زيادة بنسبة 18% في تدفقات الاستثمار الأجنبي المباشر هذا الربع',
      confidence: 91,
      impact: 'high',
      category: 'opportunity',
      icon: Zap
    },
    {
      id: '6',
      title: '12 مجموعة بيانات غير نشطة',
      description: 'بعض مجموعات البيانات لم يتم تحديثها منذ أكثر من 6 أشهر وتحتاج للمراجعة',
      confidence: 85,
      impact: 'low',
      category: 'monitoring',
      icon: Info
    }
  ];

  // Mock Economic Events
  const economicEvents: EconomicEvent[] = [
    {
      id: '1',
      title: 'إصدار مؤشر أسعار المستهلك',
      date: '2024-01-20',
      time: '09:00',
      source: 'البنك المركزي السعودي',
      importance: 'high',
      type: 'indicator'
    },
    {
      id: '2',
      title: 'تقرير الاستثمار الأجنبي الربعي',
      date: '2024-01-22',
      time: '10:00',
      source: 'وزارة الاستثمار',
      importance: 'high',
      type: 'report'
    },
    {
      id: '3',
      title: 'إعلان سياسة النقد الجديدة',
      date: '2024-01-25',
      time: '14:00',
      source: 'البنك المركزي',
      importance: 'high',
      type: 'policy'
    },
    {
      id: '4',
      title: 'تحديث بيانات سوق العمل',
      date: '2024-01-28',
      time: '11:00',
      source: 'وزارة الموارد البشرية',
      importance: 'medium',
      type: 'indicator'
    },
    {
      id: '5',
      title: 'إطلاق مبادرة سياحية جديدة',
      date: '2024-01-30',
      time: '12:00',
      source: 'وزارة السياحة',
      importance: 'medium',
      type: 'announcement'
    }
  ];

  // Market Sentiment
  const marketSentiment = {
    state: 'bullish', // 'bullish' | 'neutral' | 'bearish'
    score: 72,
    label: 'إيجابي'
  };

  // Dataset Growth Data
  const datasetGrowth = [
    { month: 'أغسطس', count: 14500 },
    { month: 'سبتمبر', count: 15200 },
    { month: 'أكتوبر', count: 15900 },
    { month: 'نوفمبر', count: 16700 },
    { month: 'ديسمبر', count: 17400 },
    { month: 'يناير', count: 17888 }
  ];

  const getSentimentIcon = () => {
    if (marketSentiment.state === 'bullish') return Smile;
    if (marketSentiment.state === 'bearish') return Frown;
    return Minus;
  };

  const getSentimentColor = () => {
    if (marketSentiment.state === 'bullish') return 'text-emerald-500 bg-emerald-50';
    if (marketSentiment.state === 'bearish') return 'text-rose-500 bg-rose-50';
    return 'text-slate-500 bg-slate-50';
  };

  const getImpactColor = (impact: string) => {
    if (impact === 'high') return 'text-rose-600 bg-rose-50';
    if (impact === 'medium') return 'text-amber-600 bg-amber-50';
    return 'text-blue-600 bg-blue-50';
  };

  const getCategoryColor = (category: string) => {
    if (category === 'opportunity') return 'text-emerald-600 bg-emerald-50';
    if (category === 'risk') return 'text-rose-600 bg-rose-50';
    return 'text-blue-600 bg-blue-50';
  };

  const getImportanceColor = (importance: string) => {
    if (importance === 'high') return 'bg-rose-500';
    if (importance === 'medium') return 'bg-amber-500';
    return 'bg-blue-500';
  };

  const getTrendColor = (trend: number[]) => {
    const isUp = trend[trend.length - 1] > trend[0];
    return isUp ? 'text-emerald-500' : 'text-rose-500';
  };

  const MiniTrendChart = ({ data, color }: { data: number[]; color: string }) => {
    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min || 1;
    
    const points = data.map((value, index) => {
      const x = (index / (data.length - 1)) * 100;
      const y = 100 - ((value - min) / range) * 100;
      return `${x},${y}`;
    }).join(' ');

    return (
      <svg viewBox="0 0 100 100" className="w-24 h-12" preserveAspectRatio="none">
        <polyline
          points={points}
          fill="none"
          stroke={color}
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  };

  return (
    <div className="p-6 lg:p-10 font-sans max-w-[1920px] mx-auto animate-fadeIn" dir="rtl">
      
      {/* 1. Main Header (Hero Section) */}
      <header className="mb-8">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-blue-500/30">
              <Cpu size={32} />
            </div>
            <div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                ملخص الذكاء الاقتصادي AI
                <span className="px-3 py-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-[10px] font-black rounded-full">
                  BETA
                </span>
              </h1>
              <p className="text-sm font-bold text-slate-500 mt-1">
                نظرة شاملة على المؤشرات الاقتصادية ورؤى السوق المدعومة بالذكاء الاصطناعي
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Last Updated */}
            <div className="flex items-center gap-2 px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-600">
              <Clock size={16} className={isRefreshing ? 'animate-spin' : ''} />
              <span>آخر تحديث: {lastUpdated.toLocaleTimeString('ar-SA')}</span>
            </div>

            {/* Date Range */}
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-bold outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
            >
              <option value="week">آخر أسبوع</option>
              <option value="month">آخر شهر</option>
              <option value="quarter">آخر ربع سنة</option>
              <option value="year">آخر سنة</option>
              <option value="custom">نطاق مخصص</option>
            </select>

            {/* AI Analysis Toggle */}
            <button
              onClick={() => setShowAIAnalysis(!showAIAnalysis)}
              className={`flex items-center gap-2 px-4 py-3 border rounded-xl text-sm font-bold transition-colors ${
                showAIAnalysis ? 'bg-purple-50 border-purple-200 text-purple-700' : 'bg-white border-slate-200 text-slate-700'
              }`}
            >
              <Cpu size={18} />
              تحليل AI
            </button>

            {/* Save View */}
            <button
              onClick={() => setShowSaveModal(true)}
              className="flex items-center gap-2 px-4 py-3 bg-white border border-slate-200 text-slate-700 rounded-xl text-sm font-bold hover:bg-slate-50 transition-colors"
              title="حفظ العرض الحالي"
            >
              <Save size={18} />
              حفظ
            </button>

            {/* Share */}
            <button
              onClick={() => setShowShareModal(true)}
              className="flex items-center gap-2 px-4 py-3 bg-white border border-slate-200 text-slate-700 rounded-xl text-sm font-bold hover:bg-slate-50 transition-colors"
              title="مشاركة اللوحة"
            >
              <Share2 size={18} />
              مشاركة
            </button>

            {/* Export */}
            <button
              onClick={handleExportQuick}
              className="flex items-center gap-2 px-4 py-3 bg-white border border-slate-200 text-slate-700 rounded-xl text-sm font-bold hover:bg-slate-50 transition-colors"
            >
              <Download size={18} />
              تصدير
            </button>

            {/* Refresh */}
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="flex items-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/30 disabled:opacity-50"
            >
              <RefreshCw size={18} className={isRefreshing ? 'animate-spin' : ''} />
              تحديث
            </button>
          </div>
        </div>

        {/* Market Sentiment Indicator */}
        <div className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-sm font-bold text-slate-600">مؤشر السوق:</span>
          <div className={`flex items-center gap-2 px-4 py-2 rounded-xl ${getSentimentColor()}`}>
            {React.createElement(getSentimentIcon(), { size: 20 })}
            <span className="text-sm font-black">{marketSentiment.label}</span>
            <span className="text-xs font-bold opacity-70">({marketSentiment.score}%)</span>
          </div>
          <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-1000 ${
                marketSentiment.state === 'bullish' ? 'bg-emerald-500' :
                marketSentiment.state === 'bearish' ? 'bg-rose-500' :
                'bg-slate-400'
              }`}
              style={{ width: `${marketSentiment.score}%` }}
            ></div>
          </div>
        </div>
      </header>

      {/* 2. Global Economic Overview (Hero Metrics) */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {economicIndicators.map((indicator) => (
          <div key={indicator.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">{indicator.name}</p>
                <p className="text-3xl font-black text-slate-900">{indicator.value}</p>
              </div>
              <div className={`flex items-center gap-1 text-sm font-bold ${indicator.isPositive ? 'text-emerald-500' : 'text-rose-500'}`}>
                {indicator.isPositive ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                {indicator.change}
              </div>
            </div>
            <div className={`flex items-center justify-between ${getTrendColor(indicator.trend)}`}>
              <MiniTrendChart data={indicator.trend} color={indicator.isPositive ? '#10b981' : '#f43f5e'} />
              <span className="text-xs font-bold opacity-70">آخر 6 فترات</span>
            </div>
          </div>
        ))}
      </section>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* Main Content - 2 columns */}
        <div className="xl:col-span-2 space-y-8">
          
          {/* 3. Market Activity Snapshot */}
          <section className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-6 text-white shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <Activity size={24} />
                </div>
                <div>
                  <h2 className="text-lg font-black">ملخص نشاط السوق الأسبوعي</h2>
                  <p className="text-xs text-blue-100 font-bold">نظرة عامة على النشاط الاقتصادي هذا الأسبوع</p>
                </div>
              </div>
              <span className="px-3 py-1 bg-white/20 text-white text-[10px] font-black rounded-full">
                هذا الأسبوع
              </span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl">
                <p className="text-[9px] font-bold text-blue-100 uppercase mb-1">إشارات جديدة</p>
                <p className="text-2xl font-black">+7</p>
                <div className="flex items-center gap-1 mt-2 text-xs font-bold text-emerald-300">
                  <ArrowUpRight size={12} />
                  <span>نمو قوي</span>
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl">
                <p className="text-[9px] font-bold text-blue-100 uppercase mb-1">مجموعات بيانات</p>
                <p className="text-2xl font-black">+24</p>
                <div className="flex items-center gap-1 mt-2 text-xs font-bold text-emerald-300">
                  <ArrowUpRight size={12} />
                  <span>تحديث مستمر</span>
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl">
                <p className="text-[9px] font-bold text-blue-100 uppercase mb-1">تحليلات منشورة</p>
                <p className="text-2xl font-black">12</p>
                <div className="flex items-center gap-1 mt-2 text-xs font-bold text-blue-200">
                  <Minus size={12} />
                  <span>مستقر</span>
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl">
                <p className="text-[9px] font-bold text-blue-100 uppercase mb-1">مؤشر النشاط</p>
                <p className="text-2xl font-black">85%</p>
                <div className="flex items-center gap-1 mt-2 text-xs font-bold text-emerald-300">
                  <ArrowUpRight size={12} />
                  <span>+5%</span>
                </div>
              </div>
            </div>
          </section>

          {/* 4. Weekly Market Intelligence Summary */}
          {showAIAnalysis && (
            <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="bg-gradient-to-r from-purple-600 to-indigo-700 p-6 text-white">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                    <Cpu size={20} />
                  </div>
                  <div>
                    <h2 className="text-lg font-black">ملخص الذكاء السوقي الأسبوعي</h2>
                    <p className="text-xs text-purple-100 font-bold">تم التوليد تلقائياً بواسطة محرك الذكاء الاصطناعي</p>
                  </div>
                </div>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex items-start gap-3 p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                  <CheckCircle2 size={20} className="text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-bold text-emerald-900 mb-1">اكتشاف إشارات استثمارية جديدة</p>
                    <p className="text-xs text-emerald-700 leading-relaxed">
                      تم رصد 7 إشارات استثمارية واعدة في قطاعات السياحة والطاقة والاستثمار الأجنبي، مع مؤشرات نمو قوية تتجاوز التوقعات.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 bg-amber-50 rounded-xl border border-amber-100">
                  <AlertCircle size={20} className="text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-bold text-amber-900 mb-1">قطاعات بحاجة لمزيد من البيانات</p>
                    <p className="text-xs text-amber-700 leading-relaxed">
                      قطاع التعليم يحتوي على 1729 مجموعة بيانات فقط، مما قد يؤثر على دقة التحليلات الاستثمارية لهذا القطاع.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-xl border border-blue-100">
                  <Database size={20} className="text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-bold text-blue-900 mb-1">تحديثات من المصادر الرسمية</p>
                    <p className="text-xs text-blue-700 leading-relaxed">
                      تمت إضافة 24 مجموعة بيانات جديدة من البوابة السعودية للبيانات المفتوحة ووزارة الاستثمار والبنك المركزي.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 bg-purple-50 rounded-xl border border-purple-100">
                  <Layers size={20} className="text-purple-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-bold text-purple-900 mb-1">تنوع البيانات الاقتصادية</p>
                    <p className="text-xs text-purple-700 leading-relaxed">
                      المنصة تغطي الآن 51 قطاع اقتصادي مختلف مع تحديثات مستمرة من 8 مصادر بيانات رئيسية.
                    </p>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* 5. Sector Performance Monitor */}
          <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                  <BarChart3 size={20} />
                </div>
                <div>
                  <h2 className="text-lg font-black text-slate-900">مراقب أداء القطاعات</h2>
                  <p className="text-xs text-slate-500 font-bold">الأداء الأسبوعي للقطاعات الاقتصادية</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSortBy('growth')}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors ${
                    sortBy === 'growth'
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  حسب النمو
                </button>
                <button
                  onClick={() => setSortBy('activity')}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors ${
                    sortBy === 'activity'
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  حسب النشاط
                </button>
              </div>
            </div>

            <div className="space-y-4">
              {(sortBy === 'growth' 
                ? [...sectorPerformance].sort((a, b) => b.growth - a.growth)
                : [...sectorPerformance].sort((a, b) => b.activity - a.activity)
              ).map((sector, idx) => (
                <div 
                  key={idx} 
                  className={`group cursor-pointer transition-all ${
                    selectedSector === sector.sector ? 'bg-blue-50 border-blue-200' : 'hover:bg-slate-50'
                  }`}
                  onClick={() => handleSectorClick(sector.sector)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-8 ${sector.color} rounded-full`}></div>
                      <div>
                        <p className="text-sm font-black text-slate-900">{sector.sector}</p>
                        <p className="text-[10px] text-slate-500 font-bold">
                          {sector.datasets.toLocaleString('ar-SA')} مجموعة بيانات • {sector.signals} إشارة
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-left">
                        <p className="text-[9px] font-bold text-slate-400 uppercase">النمو</p>
                        <p className={`text-sm font-black ${sector.growth > 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                          {sector.growth > 0 ? '+' : ''}{sector.growth}%
                        </p>
                      </div>
                      <div className="text-left">
                        <p className="text-[9px] font-bold text-slate-400 uppercase">النشاط</p>
                        <p className="text-sm font-black text-slate-900">{sector.activity}%</p>
                      </div>
                      <ChevronRight size={16} className="text-slate-300 group-hover:text-blue-500 transition-colors" />
                    </div>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${sector.color} rounded-full transition-all duration-1000`}
                      style={{ width: `${sector.activity}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Economic Intelligence Feed */}
          <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                  <Globe size={20} />
                </div>
                <div>
                  <h2 className="text-lg font-black text-slate-900">نشرة الأخبار الاقتصادية</h2>
                  <p className="text-xs text-slate-500 font-bold">آخر التحديثات الاقتصادية من مصادر موثوقة عالمياً</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
                  <Clock size={12} />
                  آخر تحديث: {getMinutesAgo(newsLastUpdated)}
                </span>
                <button
                  onClick={handleRefreshNews}
                  disabled={isRefreshing}
                  className="p-2 hover:bg-slate-100 rounded-lg transition-colors disabled:opacity-50"
                  title="تحديث الأخبار"
                >
                  <RefreshCw size={16} className={isRefreshing ? 'animate-spin' : ''} />
                </button>
              </div>
            </div>

            {/* Search and Filter */}
            <div className="flex flex-wrap gap-3 mb-6">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input
                  type="text"
                  value={newsSearch}
                  onChange={(e) => setNewsSearch(e.target.value)}
                  placeholder="ابحث في الأخبار..."
                  className="w-full pl-4 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
                />
              </div>
              <select
                value={newsFilter}
                onChange={(e) => setNewsFilter(e.target.value)}
                className="px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold outline-none focus:border-blue-500 transition-all"
              >
                <option value="all">الكل</option>
                <option value="economy">اقتصاد</option>
                <option value="markets">أسواق</option>
                <option value="energy">طاقة</option>
                <option value="policy">سياسة</option>
                <option value="technology">تقنية</option>
              </select>
            </div>

            {/* News List */}
            <div className="space-y-3">
              {filteredNews.length > 0 ? (
                filteredNews.map((news) => (
                  <div
                    key={news.id}
                    onClick={() => handleNewsClick(news)}
                    className="group p-4 bg-slate-50 rounded-xl border border-slate-100 hover:border-blue-200 hover:bg-blue-50/50 transition-all cursor-pointer"
                  >
                    <div className="flex items-start gap-4">
                      <div className="text-2xl shrink-0">{news.sourceLogo}</div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className={`px-2 py-0.5 text-[9px] font-black rounded-full ${getCategoryBadge(news.category).color}`}>
                            {getCategoryBadge(news.category).label}
                          </span>
                          <span className="text-[10px] font-bold text-slate-500 flex items-center gap-1">
                            <span className="font-bold text-slate-700">{news.source}</span>
                            <span>•</span>
                            {getMinutesAgo(new Date(news.publishedDate))}
                          </span>
                        </div>
                        <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors mb-1 line-clamp-2">
                          {news.title}
                        </h3>
                        <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
                          {news.description}
                        </p>
                      </div>
                      <ChevronRight size={18} className="text-slate-300 group-hover:text-blue-500 transition-colors shrink-0" />
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12">
                  <Info size={40} className="mx-auto text-slate-300 mb-3" />
                  <p className="text-sm font-bold text-slate-500">لا توجد أخبار مطابقة</p>
                  <p className="text-xs text-slate-400 mt-1">جرب تغيير معايير البحث أو الفلترة</p>
                </div>
              )}
            </div>

            {/* View More Button */}
            {filteredNews.length >= 10 && (
              <div className="mt-6 text-center">
                <button className="px-6 py-3 bg-blue-50 text-blue-600 rounded-xl text-sm font-bold hover:bg-blue-100 transition-colors flex items-center gap-2 mx-auto">
                  عرض المزيد من التحديثات
                  <ChevronRight size={16} />
                </button>
              </div>
            )}
          </section>

          {/* 7. Economic Event Calendar */}
          <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600">
                  <Calendar size={20} />
                </div>
                <div>
                  <h2 className="text-lg font-black text-slate-900">التقويم الاقتصادي</h2>
                  <p className="text-xs text-slate-500 font-bold">الأحداث الاقتصادية القادمة</p>
                </div>
              </div>
              <button className="text-sm font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1">
                عرض الكل
                <ChevronRight size={16} />
              </button>
            </div>

            <div className="space-y-3">
              {economicEvents.map((event) => (
                <div key={event.id} className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100 hover:border-blue-200 transition-all">
                  <div className="text-center min-w-[60px]">
                    <p className="text-[9px] font-bold text-slate-500 uppercase">{event.date.split('-')[1]}/{event.date.split('-')[2]}</p>
                    <p className="text-lg font-black text-slate-900">{event.date.split('-')[2]}</p>
                  </div>
                  <div className={`w-1 h-12 ${getImportanceColor(event.importance)} rounded-full`}></div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-slate-900 mb-1">{event.title}</p>
                    <div className="flex items-center gap-3 text-xs text-slate-500">
                      <span>{event.time}</span>
                      <span>•</span>
                      <span>{event.source}</span>
                    </div>
                  </div>
                  <div className={`px-2.5 py-1 text-[9px] font-black rounded-full ${
                    event.type === 'report' ? 'bg-blue-50 text-blue-700' :
                    event.type === 'indicator' ? 'bg-emerald-50 text-emerald-700' :
                    event.type === 'policy' ? 'bg-purple-50 text-purple-700' :
                    'bg-amber-50 text-amber-700'
                  }`}>
                    {event.type === 'report' ? 'تقرير' :
                     event.type === 'indicator' ? 'مؤشر' :
                     event.type === 'policy' ? 'سياسة' : 'إعلان'}
                  </div>
                </div>
              ))}
            </div>
          </section>

        </div>

        {/* Sidebar - 1 column */}
        <div className="space-y-6">
          
          {/* 8. Data Ecosystem Health Monitor */}
          <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600">
                <Shield size={20} />
              </div>
              <div>
                <h2 className="text-lg font-black text-slate-900">صحة النظام البيئي</h2>
                <p className="text-xs text-slate-500 font-bold">مراقبة جودة البيانات</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                <span className="text-xs font-bold text-slate-600">حالة المزامنة</span>
                <span className="flex items-center gap-1 text-xs font-black text-emerald-600">
                  <CheckCircle2 size={14} />
                  نشط
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                <span className="text-xs font-bold text-slate-600">تردد التحديث</span>
                <span className="text-xs font-black text-slate-900">يومي</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                <span className="text-xs font-bold text-slate-600">موثوقية البيانات</span>
                <span className="text-xs font-black text-emerald-600">94%</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                <span className="text-xs font-bold text-slate-600">مجموعات قديمة</span>
                <span className="text-xs font-black text-amber-600">12</span>
              </div>
              <div className="pt-3 border-t border-slate-100">
                <div className="flex justify-between text-xs mb-2">
                  <span className="font-bold text-slate-600">أداء خط الأنابيب</span>
                  <span className="font-black text-emerald-600">98%</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: '98%' }}></div>
                </div>
              </div>
            </div>
          </section>

          {/* 10. Dataset Growth Tracker */}
          <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600">
                <TrendingUp size={20} />
              </div>
              <div>
                <h2 className="text-lg font-black text-slate-900">نمو مجموعات البيانات</h2>
                <p className="text-xs text-slate-500 font-bold">التوسع الشهري للقاعدة المعرفية</p>
              </div>
            </div>

            <div className="h-48">
              <svg viewBox="0 0 400 150" className="w-full h-full" preserveAspectRatio="none">
                {/* Grid lines */}
                {[0, 1, 2, 3, 4].map((i) => (
                  <line
                    key={i}
                    x1="0"
                    y1={i * 37.5}
                    x2="400"
                    y2={i * 37.5}
                    stroke="#e2e8f0"
                    strokeWidth="1"
                  />
                ))}
                
                {/* Area fill */}
                <path
                  d={`M0,150 L0,${150 - ((datasetGrowth[0].count - 14000) / 4000) * 150} ` +
                    datasetGrowth.map((d, i) => 
                      `L${(i / (datasetGrowth.length - 1)) * 400},${150 - ((d.count - 14000) / 4000) * 150}`
                    ).join(' ') +
                    ` L400,150 Z`}
                  fill="url(#gradient)"
                  opacity="0.3"
                />
                
                {/* Line */}
                <path
                  d={`M0,${150 - ((datasetGrowth[0].count - 14000) / 4000) * 150} ` +
                    datasetGrowth.map((d, i) => 
                      `L${(i / (datasetGrowth.length - 1)) * 400},${150 - ((d.count - 14000) / 4000) * 150}`
                    ).join(' ')}
                  fill="none"
                  stroke="#7c3aed"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                
                {/* Dots */}
                {datasetGrowth.map((d, i) => (
                  <circle
                    key={i}
                    cx={(i / (datasetGrowth.length - 1)) * 400}
                    cy={150 - ((d.count - 14000) / 4000) * 150}
                    r="4"
                    fill="#7c3aed"
                  />
                ))}
                
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#7c3aed" />
                    <stop offset="100%" stopColor="#7c3aed" stopOpacity="0" />
                  </linearGradient>
                </defs>
              </svg>
            </div>

            <div className="flex justify-between mt-3">
              {datasetGrowth.map((d, i) => (
                <div key={i} className="text-center">
                  <p className="text-[9px] font-bold text-slate-500">{d.month}</p>
                </div>
              ))}
            </div>
          </section>

          {/* 11. Smart Recommendations */}
          <section className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-100 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-amber-500 shadow-sm">
                <Star size={20} />
              </div>
              <div>
                <h2 className="text-lg font-black text-slate-900">توصيات ذكية</h2>
                <p className="text-xs text-slate-500 font-bold">اقتراحات مخصصة بناءً على نشاطك</p>
              </div>
            </div>

            <div className="space-y-3">
              {[
                { title: 'استكشف قطاع السياحة', desc: 'نمو 22.5% هذا الأسبوع', icon: TrendingUp, color: 'text-emerald-600', action: () => handleSectorClick('السياحة') },
                { title: 'راجع بيانات العقار', desc: '12 إشارة جديدة متاحة', icon: Eye, color: 'text-blue-600', action: () => handleNavigateTo('signals') },
                { title: 'قارن القطاعات', desc: 'أداة المقارنات الذكية', icon: Target, color: 'text-purple-600', action: () => handleNavigateTo('comparisons') }
              ].map((item, idx) => (
                <div
                  key={idx}
                  onClick={item.action}
                  className="bg-white p-3 rounded-xl border border-blue-100 hover:shadow-md transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${item.color} bg-opacity-10`}>
                      <item.icon size={16} className={item.color} />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-black text-slate-900 mb-0.5">{item.title}</p>
                      <p className="text-[9px] text-slate-500 font-bold">{item.desc}</p>
                    </div>
                    <ChevronRight size={16} className="text-slate-300 group-hover:text-blue-500 transition-colors" />
                  </div>
                </div>
              ))}
            </div>
          </section>

        </div>
      </div>

      {/* 15. Disclaimer Footer */}
      <footer className="mt-8 p-6 bg-slate-50 rounded-2xl border border-slate-200">
        <div className="flex items-start gap-3">
          <Info size={20} className="text-slate-400 shrink-0 mt-0.5" />
          <div>
            <p className="text-xs text-slate-600 leading-relaxed font-bold">
              <span className="font-black">تنبيه هام:</span> المعلومات والتحليلات المعروضة في هذه اللوحة يتم توليدها بواسطة الذكاء الاصطناعي ونماذج البيانات لأغراض إعلامية فقط.
              لا تشكل نصيحة مالية أو استثمارية. يجب على المستخدمين استشارة مستشارين ماليين مرخصين قبل اتخاذ أي قرارات استثمارية.
            </p>
          </div>
        </div>
      </footer>

      {/* Export Modal */}
      {showExportModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-slideUp">
            <div className="relative bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white">
              <button
                onClick={() => setShowExportModal(false)}
                className="absolute top-4 left-4 w-10 h-10 flex items-center justify-center bg-white/10 hover:bg-white/20 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
              <div className="flex items-center gap-3 mb-2">
                <div className="bg-white/20 p-2 rounded-lg">
                  <Download size={20} />
                </div>
                <h2 className="text-xl font-black">تصدير البيانات</h2>
              </div>
              <p className="text-blue-100 text-sm font-bold opacity-90">اختر صيغة التصدير المطلوبة</p>
            </div>

            <div className="p-6 space-y-3">
              <button
                onClick={() => handleExport('pdf')}
                className="w-full flex items-center gap-4 p-4 bg-slate-50 hover:bg-blue-50 border border-slate-200 rounded-xl transition-all group"
              >
                <div className="w-12 h-12 bg-red-100 text-red-600 rounded-xl flex items-center justify-center group-hover:bg-red-200 transition-colors">
                  <FileText size={24} />
                </div>
                <div className="text-right flex-1">
                  <p className="text-sm font-black text-slate-900">تصدير PDF</p>
                  <p className="text-xs text-slate-500 font-bold">تقرير كامل مع الرسوم البيانية</p>
                </div>
                <ChevronRight size={20} className="text-slate-400" />
              </button>

              <button
                onClick={() => handleExport('excel')}
                className="w-full flex items-center gap-4 p-4 bg-slate-50 hover:bg-emerald-50 border border-slate-200 rounded-xl transition-all group"
              >
                <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center group-hover:bg-emerald-200 transition-colors">
                  <Database size={24} />
                </div>
                <div className="text-right flex-1">
                  <p className="text-sm font-black text-slate-900">تصدير Excel</p>
                  <p className="text-xs text-slate-500 font-bold">بيانات خام في جداول</p>
                </div>
                <ChevronRight size={20} className="text-slate-400" />
              </button>

              <button
                onClick={() => handleExport('csv')}
                className="w-full flex items-center gap-4 p-4 bg-slate-50 hover:bg-blue-50 border border-slate-200 rounded-xl transition-all group"
              >
                <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                  <FileText size={24} />
                </div>
                <div className="text-right flex-1">
                  <p className="text-sm font-black text-slate-900">تصدير CSV</p>
                  <p className="text-xs text-slate-500 font-bold">ملف نصي بسيط</p>
                </div>
                <ChevronRight size={20} className="text-slate-400" />
              </button>

              <button
                onClick={handlePrint}
                className="w-full flex items-center gap-4 p-4 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl transition-all group"
              >
                <div className="w-12 h-12 bg-slate-200 text-slate-600 rounded-xl flex items-center justify-center group-hover:bg-slate-300 transition-colors">
                  <Printer size={24} />
                </div>
                <div className="text-right flex-1">
                  <p className="text-sm font-black text-slate-900">طباعة</p>
                  <p className="text-xs text-slate-500 font-bold">طباعة اللوحة مباشرة</p>
                </div>
                <ChevronRight size={20} className="text-slate-400" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Save View Modal */}
      {showSaveModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-slideUp">
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
                <h2 className="text-xl font-black">حفظ عرض اللوحة</h2>
              </div>
              <p className="text-blue-100 text-sm font-bold opacity-90">حفظ الإعدادات الحالية للاستخدام لاحقاً</p>
            </div>

            <div className="p-6 space-y-4">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                <p className="text-xs font-bold text-slate-500 mb-2">الإعدادات التي سيتم حفظها:</p>
                <ul className="space-y-1 text-sm">
                  <li className="flex items-center gap-2 text-slate-700">
                    <CheckCircle2 size={14} className="text-emerald-500" />
                    <span>نطاق التاريخ: <strong className="text-slate-900">{dateRange === 'week' ? 'أسبوع' : dateRange === 'month' ? 'شهر' : dateRange === 'quarter' ? 'ربع سنة' : 'سنة'}</strong></span>
                  </li>
                  <li className="flex items-center gap-2 text-slate-700">
                    <CheckCircle2 size={14} className="text-emerald-500" />
                    <span>تحليل AI: <strong className="text-slate-900">{showAIAnalysis ? 'مفعل' : 'معطل'}</strong></span>
                  </li>
                  <li className="flex items-center gap-2 text-slate-700">
                    <CheckCircle2 size={14} className="text-emerald-500" />
                    <span>الفرز حسب: <strong className="text-slate-900">{sortBy === 'growth' ? 'النمو' : 'النشاط'}</strong></span>
                  </li>
                </ul>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowSaveModal(false)}
                  className="flex-1 py-3 bg-slate-100 text-slate-700 rounded-xl text-sm font-bold hover:bg-slate-200 transition-colors"
                >
                  إلغاء
                </button>
                <button
                  onClick={handleSaveView}
                  className="flex-1 py-3 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                >
                  <Save size={18} />
                  حفظ
                </button>
              </div>

              <button
                onClick={handleLoadSavedView}
                className="w-full py-3 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-xl text-sm font-bold hover:bg-emerald-100 transition-colors"
              >
                استعادة الإعدادات المحفوظة
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-slideUp">
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
                <h2 className="text-xl font-black">مشاركة اللوحة</h2>
              </div>
              <p className="text-emerald-100 text-sm font-bold opacity-90">اختر طريقة المشاركة</p>
            </div>

            <div className="p-6 space-y-3">
              <button
                onClick={() => handleShare('twitter')}
                className="w-full flex items-center gap-4 p-4 bg-slate-50 hover:bg-blue-50 border border-slate-200 rounded-xl transition-all group"
              >
                <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center">
                  <Share2 size={24} />
                </div>
                <div className="text-right flex-1">
                  <p className="text-sm font-black text-slate-900">تويتر</p>
                  <p className="text-xs text-slate-500 font-bold">مشاركة على Twitter</p>
                </div>
                <ExternalLink size={20} className="text-slate-400" />
              </button>

              <button
                onClick={() => handleShare('linkedin')}
                className="w-full flex items-center gap-4 p-4 bg-slate-50 hover:bg-blue-50 border border-slate-200 rounded-xl transition-all group"
              >
                <div className="w-12 h-12 bg-blue-100 text-blue-800 rounded-xl flex items-center justify-center">
                  <Briefcase size={24} />
                </div>
                <div className="text-right flex-1">
                  <p className="text-sm font-black text-slate-900">لينكد إن</p>
                  <p className="text-xs text-slate-500 font-bold">مشاركة على LinkedIn</p>
                </div>
                <ExternalLink size={20} className="text-slate-400" />
              </button>

              <button
                onClick={() => handleShare('whatsapp')}
                className="w-full flex items-center gap-4 p-4 bg-slate-50 hover:bg-emerald-50 border border-slate-200 rounded-xl transition-all group"
              >
                <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center">
                  <Heart size={24} />
                </div>
                <div className="text-right flex-1">
                  <p className="text-sm font-black text-slate-900">واتساب</p>
                  <p className="text-xs text-slate-500 font-bold">إرسال عبر WhatsApp</p>
                </div>
                <ExternalLink size={20} className="text-slate-400" />
              </button>

              <button
                onClick={() => handleShare('copy')}
                className="w-full flex items-center gap-4 p-4 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl transition-all group"
              >
                <div className="w-12 h-12 bg-slate-200 text-slate-600 rounded-xl flex items-center justify-center">
                  <Target size={24} />
                </div>
                <div className="text-right flex-1">
                  <p className="text-sm font-black text-slate-900">نسخ الرابط</p>
                  <p className="text-xs text-slate-500 font-bold">نسخ URL للوحة</p>
                </div>
                <ExternalLink size={20} className="text-slate-400" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* News Detail Modal */}
      {showNewsModal && selectedNews && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn" onClick={() => setShowNewsModal(false)}>
          <div
            className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden animate-slideUp max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="relative bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white">
              <button
                onClick={() => setShowNewsModal(false)}
                className="absolute top-4 left-4 w-10 h-10 flex items-center justify-center bg-white/10 hover:bg-white/20 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
              <div className="flex items-center gap-3 mb-3">
                <div className="text-3xl">{selectedNews.sourceLogo}</div>
                <div>
                  <p className="text-sm font-bold text-blue-100">{selectedNews.source}</p>
                  <p className="text-xs text-blue-200 flex items-center gap-1">
                    <Clock size={12} />
                    {getMinutesAgo(new Date(selectedNews.publishedDate))}
                  </p>
                </div>
              </div>
              <span className={`inline-block px-3 py-1 text-[10px] font-black rounded-full ${getCategoryBadge(selectedNews.category).color}`}>
                {getCategoryBadge(selectedNews.category).label}
              </span>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* Title */}
              <div>
                <h2 className="text-xl font-black text-slate-900 leading-snug mb-3">
                  {selectedNews.title}
                </h2>
              </div>

              {/* Description */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                <p className="text-sm text-slate-700 leading-relaxed">
                  {selectedNews.description}
                </p>
              </div>

              {/* Meta Info */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
                  <p className="text-[9px] font-bold text-blue-500 uppercase mb-1">المصدر</p>
                  <p className="text-sm font-black text-slate-900 flex items-center gap-2">
                    <span className="text-xl">{selectedNews.sourceLogo}</span>
                    {selectedNews.source}
                  </p>
                </div>
                <div className="p-4 bg-purple-50 rounded-xl border border-purple-100">
                  <p className="text-[9px] font-bold text-purple-500 uppercase mb-1">تاريخ النشر</p>
                  <p className="text-sm font-black text-slate-900 flex items-center gap-2">
                    <Calendar size={16} className="text-purple-600" />
                    {new Date(selectedNews.publishedDate).toLocaleDateString('ar-SA', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4 border-t border-slate-100">
                <a
                  href={selectedNews.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-3 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                >
                  <ExternalLink size={18} />
                  قراءة المقال كاملاً
                </a>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(selectedNews.link);
                    showToast('تم نسخ رابط المقال', 'success');
                  }}
                  className="px-6 py-3 bg-white border border-slate-200 text-slate-700 rounded-xl text-sm font-bold hover:bg-slate-50 transition-colors flex items-center justify-center gap-2"
                >
                  <Copy size={18} />
                  نسخ الرابط
                </button>
              </div>

              {/* Disclaimer */}
              <div className="p-4 bg-amber-50 rounded-xl border border-amber-100">
                <div className="flex items-start gap-2">
                  <Info size={16} className="text-amber-600 shrink-0 mt-0.5" />
                  <p className="text-[10px] text-amber-800 leading-relaxed">
                    هذا الخبر تم تجميعه تلقائياً من مصادر خارجية. المحتوى والآراء المعروضة هي مسؤولية المصدر الأصلي ولا تعكس بالضرورة آراء المنصة.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default AIEconomicDashboard;
