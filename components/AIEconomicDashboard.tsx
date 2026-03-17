import React, { useState, useEffect, useCallback } from 'react';
import {
  Globe, Clock, RefreshCw, Search, ChevronRight, X, Calendar, ExternalLink, Copy, Info,
  TrendingUp, DollarSign, Zap, Building2, Briefcase, AlertCircle, Newspaper, Languages,
  Bookmark, BookmarkCheck, Sparkles, CheckCircle2
} from 'lucide-react';
import { useToast } from './Toast';
import { fetchSaudiEconomicNews, RSSNewsItem } from '../services/rssService';

const AIEconomicDashboard = () => {
  const [newsList, setNewsList] = useState<RSSNewsItem[]>(() => {
    const saved = localStorage.getItem('economic_news_cache');
    return saved ? JSON.parse(saved) : [];
  });
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(() => {
    return !localStorage.getItem('economic_news_cache');
  });

  const [newsFilter, setNewsFilter] = useState<string>('all');
  const [newsSearch, setNewsSearch] = useState('');
  const [showNewsModal, setShowNewsModal] = useState(false);
  const [selectedNews, setSelectedNews] = useState<RSSNewsItem | null>(null);
  const [newsLastUpdated, setNewsLastUpdated] = useState<Date>(() => {
    const saved = localStorage.getItem('economic_news_last_updated');
    return saved ? new Date(saved) : new Date();
  });

  const [visibleCount, setVisibleCount] = useState(6);
  const [savedNewsIds, setSavedNewsIds] = useState<Set<string>>(new Set());

  const { showToast } = useToast();

  const categories = [
    { id: 'all', label: 'الكل', icon: Globe },
    { id: 'saved', label: 'المحفوظة', icon: Bookmark },
    { id: 'economy', label: 'اقتصاد كلي', icon: TrendingUp },
    { id: 'finance', label: 'مالية واستثمار', icon: DollarSign },
    { id: 'energy', label: 'طاقة وتعدين', icon: Zap },
    { id: 'government', label: 'أخبار حكومية', icon: Building2 },
    { id: 'investment', label: 'فرص استثمارية', icon: Briefcase },
  ];

  const toggleSaveNews = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const newSaved = new Set(savedNewsIds);
    if (newSaved.has(id)) {
      newSaved.delete(id);
      showToast('تم إزالة الخبر من المحفوظات', 'info');
    } else {
      newSaved.add(id);
      showToast('تم حفظ الخبر للرجوع إليه لاحقاً', 'success');
    }
    setSavedNewsIds(newSaved);
  };

  const handleRefreshNews = useCallback(async (isSilent = false) => {
    if (!isSilent) setIsRefreshing(true);
    try {
      const freshNews = await fetchSaudiEconomicNews();
      if (freshNews && freshNews.length > 0) {
        setNewsList(freshNews);
        localStorage.setItem('economic_news_cache', JSON.stringify(freshNews));
        localStorage.setItem('economic_news_last_updated', new Date().toISOString());
        setNewsLastUpdated(new Date());
        if (!isSilent) showToast('تم تحديث الأخبار بنجاح', 'success');
      } else if (!isSilent) {
        showToast('لم يتم العثور على أخبار جديدة حالياً', 'info');
      }
    } catch (error) {
      if (!isSilent) showToast('فشل في تحديث الأخبار', 'error');
    } finally {
      if (!isSilent) setIsRefreshing(false);
      setIsInitialLoading(false);
    }
  }, [showToast]);

  // Initial fetch and set interval for every 15 minutes
  useEffect(() => {
    handleRefreshNews(true);
    const interval = setInterval(() => {
      handleRefreshNews(true);
    }, 15 * 60 * 1000); // 15 minutes

    return () => clearInterval(interval);
  }, [handleRefreshNews]);

  // Handler functions for news
  const handleNewsClick = (news: RSSNewsItem) => {
    setSelectedNews(news);
    setShowNewsModal(true);
  };

  const handleLoadMore = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setVisibleCount(prev => prev + 4);
      setIsRefreshing(false);
    }, 600);
  };

  const getMinutesAgo = (date: Date) => {
    const now = new Date();
    const diff = Math.floor((now.getTime() - date.getTime()) / 60000);
    if (diff < 1) return 'الآن';
    if (diff < 60) return `منذ ${diff} دقيقة`;
    if (diff < 1440) return `منذ ${Math.floor(diff / 60)} ساعة`;
    return `منذ ${Math.floor(diff / 1440)} يوم`;
  };

  const getCategoryTheme = (category: string) => {
    const themes: { [key: string]: { label: string; color: string; icon: any } } = {
      economy: { label: 'اقتصاد كلي', color: 'bg-blue-50 text-blue-700', icon: TrendingUp },
      finance: { label: 'مالية واستثمار', color: 'bg-emerald-50 text-emerald-700', icon: DollarSign },
      energy: { label: 'طاقة وتعدين', color: 'bg-amber-50 text-amber-700', icon: Zap },
      government: { label: 'أخبار حكومية', color: 'bg-purple-50 text-purple-700', icon: Building2 },
      investment: { label: 'فرص استثمارية', color: 'bg-cyan-50 text-cyan-700', icon: Briefcase },
      general: { label: 'عام', color: 'bg-slate-50 text-slate-700', icon: Newspaper }
    };
    return themes[category] || themes.general;
  };

  const filteredNews = newsList.filter(news => {
    const matchesFilter = newsFilter === 'all' 
      ? true 
      : newsFilter === 'saved' 
        ? savedNewsIds.has(news.id)
        : news.category === newsFilter;
    const matchesSearch = news.title.toLowerCase().includes(newsSearch.toLowerCase()) ||
                         news.description.toLowerCase().includes(newsSearch.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const displayedNews = filteredNews.slice(0, visibleCount);

  return (
    <div className="p-6 lg:p-10 font-sans max-w-5xl mx-auto animate-fadeIn" dir="rtl">
      
      {/* Enhanced Page Header Card - More Compact */}
      <header className="relative overflow-hidden bg-slate-900 rounded-[32px] p-6 lg:p-8 shadow-xl shadow-slate-900/10 mb-8">
        {/* Abstract background blobs */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-blue-600/10 rounded-full blur-[60px]" />
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-indigo-600/10 rounded-full blur-[60px]" />
        
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6 text-right">
          <div className="flex-1 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 text-blue-400 rounded-full text-[9px] font-black uppercase tracking-widest backdrop-blur-md">
              <Globe size={12} className="animate-pulse" />
              مرصد رادار الاقتصادي
            </div>
            
            <h1 className="text-2xl lg:text-3xl font-black text-white tracking-tight">
              الملخص الاقتصادي
            </h1>
            
            <p className="max-w-xl text-sm text-slate-400 font-bold leading-relaxed">
              نافذتكم المباشرة على نبض الاقتصاد العالمي وكافة التحركات المالية وتوجهات السوق من مصادر موثوقة.
            </p>
          </div>
          
          <div className="flex items-center gap-6 bg-white/5 p-4 rounded-2xl backdrop-blur-md border border-white/5">
            <div className="flex flex-col items-center px-2">
              <span className="text-white text-lg font-black">10+</span>
              <span className="text-[9px] text-slate-500 font-black uppercase">مصدر عالمي</span>
            </div>
            <div className="w-px h-8 bg-white/10" />
            <div className="flex flex-col items-center px-2">
              <span className="text-white text-lg font-black">24h</span>
              <span className="text-[9px] text-slate-500 font-black uppercase">تحديث</span>
            </div>
            <div className="w-px h-8 bg-white/10" />
            <div className="flex flex-col items-center px-2">
              <span className="text-white text-lg font-black">AI</span>
              <span className="text-[9px] text-slate-500 font-black uppercase">تنقية</span>
            </div>
          </div>
        </div>
      </header>

      {/* Economic Intelligence Feed Only */}
      <section className="bg-white rounded-[32px] border border-slate-200 shadow-xl shadow-slate-200/50 p-8 lg:p-12 overflow-hidden">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-10">
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-blue-500/20">
              <Globe size={28} />
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">نشرة الأخبار الاقتصادية</h2>
              <p className="text-sm text-slate-500 font-bold mt-1">آخر التحديثات الاقتصادية من مصادر موثوقة عالمياً</p>
            </div>
          </div>
          <div className="flex items-center gap-4 bg-slate-50 p-2 rounded-2xl border border-slate-100">
            <span className="text-[11px] font-black text-slate-400 flex items-center gap-2 px-2">
              <Clock size={14} className="text-blue-500" />
              آخر تحديث: {getMinutesAgo(newsLastUpdated)}
            </span>
            <button
              onClick={handleRefreshNews}
              disabled={isRefreshing}
              className="p-2.5 bg-white hover:bg-blue-50 text-slate-400 hover:text-blue-600 border border-slate-200 rounded-xl transition-all shadow-sm disabled:opacity-50"
              title="تحديث الأخبار"
            >
              <RefreshCw size={18} className={isRefreshing ? 'animate-spin' : ''} />
            </button>
          </div>
        </div>

        {/* AI Daily Brief Card */}
        <div className="mb-10 p-6 bg-gradient-to-br from-blue-600/5 to-indigo-600/5 border border-blue-100 rounded-[32px] relative overflow-hidden">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-blue-600 shadow-sm border border-blue-50">
              <Sparkles size={24} />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-black text-slate-900 mb-3 flex items-center gap-2">
                الملخص الذكي لآخر 24 ساعة
                <span className="text-[10px] bg-blue-600 text-white px-2 py-0.5 rounded-full font-black animate-pulse">AI Analysis</span>
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3 text-sm text-slate-700 font-bold">
                  <CheckCircle2 size={18} className="text-emerald-500 shrink-0 mt-0.5" />
                  استقرار في مؤشرات التضخم يدفع المركزي السعودي للحفاظ على أسعار الفائدة الحالية.
                </li>
                <li className="flex items-start gap-3 text-sm text-slate-700 font-bold">
                  <CheckCircle2 size={18} className="text-emerald-500 shrink-0 mt-0.5" />
                  زخم قوي في استثمارات القطاع غير النفطي تزامناً مع إطلاق مبادرات تقنية جديدة.
                </li>
                <li className="flex items-start gap-3 text-sm text-slate-700 font-bold">
                  <CheckCircle2 size={18} className="text-emerald-500 shrink-0 mt-0.5" />
                  تحسن ملحوظ في ميزان المدفوعات مدفوعاً بزيادة الصادرات الخدمية والسياحية.
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Professional Search and Filter Tabs */}
        <div className="space-y-6 mb-10">
          <div className="relative group">
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={20} />
            <input
              type="text"
              value={newsSearch}
              onChange={(e) => setNewsSearch(e.target.value)}
              placeholder="ابحث في الأخبار الاقتصادية..."
              className="w-full pl-6 pr-12 py-4 bg-slate-50 border border-slate-200 rounded-[24px] text-sm font-bold outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 focus:bg-white transition-all shadow-sm"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  setNewsFilter(cat.id);
                  setVisibleCount(6);
                }}
                className={`flex items-center gap-2 px-5 py-3 rounded-full text-xs font-black transition-all border ${
                  newsFilter === cat.id
                    ? 'bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-500/30'
                    : 'bg-white text-slate-600 border-slate-200 hover:border-blue-300 hover:bg-blue-50'
                }`}
              >
                <cat.icon size={14} />
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* News List */}
        <div className="space-y-4">
          {isInitialLoading && newsList.length === 0 ? (
            <div className="text-center py-20 bg-blue-50/30 rounded-[40px] border border-dashed border-blue-200 animate-pulse">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                <RefreshCw size={32} className="text-blue-500 animate-spin" />
              </div>
              <p className="text-lg font-black text-slate-900">جاري جلب آخر الأخبار الاقتصادية...</p>
              <p className="text-sm text-slate-400 font-bold mt-2">نتصل الآن بالمصادر العالمية لتزويدك بأحدث البيانات</p>
            </div>
          ) : displayedNews.length > 0 ? (
            displayedNews.map((news) => (
              <div
                key={news.id}
                onClick={() => handleNewsClick(news)}
                className="group p-6 bg-white rounded-[24px] border border-slate-100 hover:border-blue-200 hover:bg-blue-50/30 hover:shadow-xl hover:shadow-blue-500/5 transition-all cursor-pointer relative overflow-hidden"
              >
                <div className="flex items-start gap-6">
                  <div className="w-16 h-16 bg-blue-50/50 rounded-2xl flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform shadow-inner border border-blue-100/50">
                    {React.createElement(getCategoryTheme(news.category).icon, { size: 32 })}
                  </div>
                  <div className="flex-1 text-right">
                    <div className="flex flex-wrap items-center gap-3 mb-3">
                      {news.isUrgent && (
                        <span className="px-3 py-1 text-[10px] font-black rounded-full uppercase tracking-wider bg-red-100 text-red-600 animate-pulse border border-red-200 shadow-sm flex items-center gap-1.5">
                          <AlertCircle size={10} />
                          عاجل
                        </span>
                      )}
                      <span className={`flex items-center gap-1.5 px-3 py-1 text-[10px] font-black rounded-full uppercase tracking-wider ${getCategoryTheme(news.category).color}`}>
                        {React.createElement(getCategoryTheme(news.category).icon, { size: 12 })}
                        {getCategoryTheme(news.category).label}
                      </span>
                      <button 
                        onClick={(e) => toggleSaveNews(e, news.id)}
                        className={`mr-auto p-2 rounded-xl transition-all ${
                          savedNewsIds.has(news.id) 
                            ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' 
                            : 'bg-slate-100 text-slate-400 hover:text-blue-600 hover:bg-blue-50'
                        }`}
                      >
                        {savedNewsIds.has(news.id) ? <BookmarkCheck size={18} /> : <Bookmark size={18} />}
                      </button>
                    </div>
                    <span className="text-[11px] font-bold text-slate-400 flex items-center gap-2">
                        <span className="font-black text-slate-900 bg-slate-100 px-2 py-0.5 rounded-lg">{news.source}</span>
                        <span>•</span>
                        {getMinutesAgo(new Date(news.publishedDate))}
                      </span>
                    <h3 className="text-[17px] font-black text-slate-900 group-hover:text-blue-600 transition-colors mb-2 leading-tight">
                      {news.title}
                    </h3>
                    <p className="text-sm text-slate-500 font-medium leading-relaxed line-clamp-2">
                      {news.description}
                    </p>
                  </div>
                  <div className="self-center p-2 bg-slate-50 rounded-full group-hover:bg-blue-600 group-hover:text-white transition-all">
                    <ChevronRight size={20} />
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-20 bg-slate-50 rounded-[40px] border border-dashed border-slate-200">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                <Search size={32} className="text-slate-200" />
              </div>
              <p className="text-lg font-black text-slate-900">لا توجد أخبار مطابقة</p>
              <p className="text-sm text-slate-400 font-bold mt-2">جرب تغيير معايير البحث أو اختيار تصنيف آخر</p>
            </div>
          )}
        </div>

        {/* View More Button */}
        {filteredNews.length > visibleCount && (
          <div className="mt-10 text-center">
            <button 
              onClick={handleLoadMore}
              className="px-10 py-4 bg-slate-900 text-white rounded-[20px] text-sm font-black hover:bg-blue-600 transition-all shadow-xl shadow-slate-900/10 active:scale-95 flex items-center gap-3 mx-auto disabled:opacity-50"
              disabled={isRefreshing}
            >
              {isRefreshing ? 'جاري التحميل...' : 'عرض المزيد من التحديثات'}
              <ChevronRight size={18} className={isRefreshing ? 'animate-spin' : ''} />
            </button>
          </div>
        )}
      </section>

      {/* Premium News Detail Modal */}
      {showNewsModal && selectedNews && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md animate-fadeIn" 
          onClick={() => setShowNewsModal(false)}
        >
          <div
            className="bg-white rounded-[40px] shadow-2xl w-full max-w-3xl overflow-hidden animate-scaleIn max-h-[90vh] flex flex-col border border-white/20"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Improved Header with Image Placeholder/Background */}
            <div className="relative h-48 lg:h-64 shrink-0 overflow-hidden bg-slate-900">
               {selectedNews.media ? (
                 <img 
                   src={selectedNews.media} 
                   alt={selectedNews.title} 
                   className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700"
                 />
               ) : (
                 <div className="w-full h-full bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800 opacity-80" />
               )}
               
               <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />
               
               {/* Categories & Actions in Header */}
               <div className="absolute top-6 left-6 right-6 flex justify-between items-start">
                  <button
                    onClick={() => setShowNewsModal(false)}
                    className="w-10 h-10 flex items-center justify-center bg-white/10 hover:bg-white/20 text-white rounded-full transition-all backdrop-blur-md border border-white/20"
                  >
                    <X size={20} />
                  </button>
                  <div className="flex gap-2">
                    <span className={`px-4 py-1.5 text-[10px] font-black rounded-xl uppercase tracking-wider backdrop-blur-md border border-white/20 text-white ${getCategoryTheme(selectedNews.category).color.replace('bg-', 'bg-').replace('text-', 'text-white')}`}>
                      {getCategoryTheme(selectedNews.category).label}
                    </span>
                    {selectedNews.isUrgent && (
                      <span className="px-4 py-1.5 text-[10px] font-black rounded-xl bg-red-500 text-white animate-pulse">
                        عاجل
                      </span>
                    )}
                  </div>
               </div>

               {/* Title in Header Area */}
               <div className="absolute bottom-6 left-6 right-6">
                  <div className="flex items-center gap-3 text-blue-400 mb-2">
                     <span className="bg-blue-500/20 text-blue-300 px-3 py-1 rounded-lg text-[11px] font-black border border-blue-500/30 backdrop-blur-sm">
                       {selectedNews.source}
                     </span>
                     <span className="text-white/60 text-[11px] font-bold flex items-center gap-1">
                        <Clock size={12} />
                        {getMinutesAgo(new Date(selectedNews.publishedDate))}
                     </span>
                  </div>
                  <h2 className="text-xl lg:text-2xl font-black text-white leading-tight line-clamp-2">
                    {selectedNews.title}
                  </h2>
               </div>
            </div>

            {/* Scrollable Body */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-6 lg:p-10 space-y-8 bg-slate-50/30">
              
              {/* Description Section */}
              <div className="space-y-4">
                 <div className="flex items-center gap-2 text-slate-400">
                    <Newspaper size={18} />
                    <span className="text-[11px] font-black uppercase tracking-widest">محتوى الخبر</span>
                 </div>
                 <p className="text-base lg:text-lg text-slate-800 leading-relaxed font-medium">
                   {selectedNews.description}
                 </p>
              </div>

              {/* AI Market Pulse Section (Unique Branding) */}
              <div className="bg-gradient-to-br from-indigo-50 to-blue-50 border border-indigo-100 rounded-[32px] p-6 relative overflow-hidden group">
                  <div className="absolute -top-10 -right-10 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl group-hover:bg-indigo-500/10 transition-colors" />
                  <div className="flex items-start gap-4 relative z-10">
                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-indigo-600 shadow-sm border border-indigo-50 shrink-0">
                      <Sparkles size={24} className="animate-pulse" />
                    </div>
                    <div>
                      <h3 className="text-sm font-black text-slate-900 mb-2 flex items-center gap-2">
                        رؤية رادار الذكية (AI Pulse)
                      </h3>
                      <p className="text-xs text-slate-600 leading-relaxed font-bold">
                        بناءً على هذا الخبر، يتوقع محرك الذكاء الاصطناعي استقراراً نسبياً في تداولات القطاع المرتبط خلال الجلسة القادمة مع مراقبة تدفقات السيولة الأجنبية. ينصح بمتابعة التقارير الربعية للشركات القيادية ذات الصلة.
                      </p>
                    </div>
                  </div>
              </div>

              {/* Detailed Meta Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="p-5 bg-white rounded-3xl border border-slate-100 shadow-sm flex flex-col gap-1">
                  <span className="text-[10px] text-slate-400 font-black uppercase">المصدر</span>
                  <span className="text-sm font-black text-slate-900">{selectedNews.source}</span>
                </div>
                <div className="p-5 bg-white rounded-3xl border border-slate-100 shadow-sm flex flex-col gap-1">
                  <span className="text-[10px] text-slate-400 font-black uppercase">التصنيف</span>
                  <span className="text-sm font-black text-slate-900">{getCategoryTheme(selectedNews.category).label}</span>
                </div>
                <div className="p-5 bg-white rounded-3xl border border-slate-100 shadow-sm flex flex-col gap-1 col-span-2 lg:col-span-1">
                  <span className="text-[10px] text-slate-400 font-black uppercase">التاريخ</span>
                  <span className="text-sm font-black text-slate-900">
                    {new Date(selectedNews.publishedDate).toLocaleDateString('ar-SA', { day: 'numeric', month: 'long' })}
                  </span>
                </div>
              </div>
            </div>

            {/* Footer Actions - Fixed at Bottom */}
            <div className="shrink-0 p-6 lg:p-8 bg-white border-t border-slate-100 flex flex-col sm:flex-row gap-4">
              <a
                href={selectedNews.link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 h-14 bg-slate-900 hover:bg-blue-600 text-white rounded-2xl text-sm font-black transition-all shadow-xl shadow-slate-900/10 flex items-center justify-center gap-3 active:scale-95 translate-y-0 hover:-translate-y-1"
              >
                <ExternalLink size={20} />
                زيارة المصدر
              </a>
              <div className="flex gap-4">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(selectedNews.link);
                    showToast('تم نسخ الرابط بنجاح', 'success');
                  }}
                  className="w-14 h-14 bg-slate-50 border border-slate-200 text-slate-600 hover:text-blue-600 hover:bg-blue-50 hover:border-blue-200 rounded-2xl transition-all flex items-center justify-center group"
                  title="نسخ الرابط"
                >
                  <Copy size={20} className="group-hover:scale-110 transition-transform" />
                </button>
                <button
                  onClick={() => {
                    showToast('تمت إضافة الخبر للمفضلة', 'success');
                  }}
                  className="w-14 h-14 bg-slate-50 border border-slate-200 text-slate-600 hover:text-amber-500 hover:bg-amber-50 hover:border-amber-200 rounded-2xl transition-all flex items-center justify-center group"
                  title="حفظ للأرشيف"
                >
                  <Bookmark size={20} className="group-hover:scale-110 transition-transform" />
                </button>
              </div>
            </div>

            {/* AI Source Tag */}
            <div className="bg-slate-50 py-3 px-8 flex items-center justify-between border-t border-slate-100">
               <div className="flex items-center gap-2 text-[10px] text-slate-400 font-bold italic">
                 <Info size={12} />
                 محلل آلياً عبر خدمة رادار الذكية
               </div>
               <div className="flex items-center gap-1">
                 <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                 <span className="text-[10px] text-slate-500 font-black">LIVE</span>
               </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default AIEconomicDashboard;
