import React, { useState, useEffect, useCallback } from 'react';
import {
  Globe, Clock, RefreshCw, Search, ChevronRight, X, Calendar, ExternalLink, Copy, Info,
  TrendingUp, DollarSign, Zap, Building2, Briefcase, AlertCircle, Newspaper
} from 'lucide-react';
import { useToast } from './Toast';
import { fetchSaudiEconomicNews, RSSNewsItem } from '../services/rssService';

const AIEconomicDashboard = () => {
  const [newsList, setNewsList] = useState<RSSNewsItem[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [newsFilter, setNewsFilter] = useState<string>('all');
  const [newsSearch, setNewsSearch] = useState('');
  const [showNewsModal, setShowNewsModal] = useState(false);
  const [selectedNews, setSelectedNews] = useState<RSSNewsItem | null>(null);
  const [newsLastUpdated, setNewsLastUpdated] = useState(new Date());
  const [visibleCount, setVisibleCount] = useState(6);

  const { showToast } = useToast();

  const categories = [
    { id: 'all', label: 'الكل', icon: Globe },
    { id: 'economy', label: 'اقتصاد كلي', icon: TrendingUp },
    { id: 'finance', label: 'مالية واستثمار', icon: DollarSign },
    { id: 'energy', label: 'طاقة وتعدين', icon: Zap },
    { id: 'government', label: 'أخبار حكومية', icon: Building2 },
    { id: 'investment', label: 'فرص استثمارية', icon: Briefcase },
  ];

  const handleRefreshNews = useCallback(async (isSilent = false) => {
    if (!isSilent) setIsRefreshing(true);
    try {
      const freshNews = await fetchSaudiEconomicNews();
      setNewsList(freshNews);
      setNewsLastUpdated(new Date());
      if (!isSilent) showToast('تم تحديث الأخبار بنجاح', 'success');
    } catch (error) {
      if (!isSilent) showToast('فشل في تحديث الأخبار', 'error');
    } finally {
      if (!isSilent) setIsRefreshing(false);
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
    const matchesFilter = newsFilter === 'all' || news.category === newsFilter;
    const matchesSearch = news.title.toLowerCase().includes(newsSearch.toLowerCase()) ||
                         news.description.toLowerCase().includes(newsSearch.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const displayedNews = filteredNews.slice(0, visibleCount);

  return (
    <div className="p-6 lg:p-10 font-sans max-w-5xl mx-auto animate-fadeIn" dir="rtl">
      
      {/* Enhanced Page Header Card */}
      <header className="mb-10 relative overflow-hidden bg-slate-900 rounded-[40px] p-10 lg:p-12 shadow-2xl shadow-slate-900/20">
        {/* Abstract background blobs for premium feel */}
        <div className="absolute -top-24 -left-24 w-64 h-64 bg-blue-600/20 rounded-full blur-[80px]" />
        <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-indigo-600/20 rounded-full blur-[80px]" />
        
        <div className="relative z-10 flex flex-col items-center text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 text-blue-400 rounded-full text-[10px] font-black uppercase tracking-[0.2em] backdrop-blur-md shadow-inner">
            <Globe size={14} className="animate-pulse" />
            مرصد رادار الاقتصادي
          </div>
          
          <h1 className="text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
            الملخص الاقتصادي
          </h1>
          
          <div className="max-w-3xl border-t border-white/5 pt-6">
            <p className="text-base lg:text-lg text-slate-400 font-bold leading-relaxed">
              نافذتكم المباشرة على نبض الاقتصاد العالمي؛ حيث نقوم بجمع وتحليل أهم الأخبار والتحديثات من المصادر الموثوقة لنضع بين أيديكم رؤية شاملة تساعدكم في فهم التحركات المالية وتوجهات السوق.
            </p>
          </div>
          
          <div className="flex items-center gap-8 pt-2">
            <div className="flex flex-col items-center">
              <span className="text-white text-xl font-black">10+</span>
              <span className="text-[10px] text-slate-500 font-black uppercase">مصدر عالمي</span>
            </div>
            <div className="w-px h-8 bg-white/10" />
            <div className="flex flex-col items-center">
              <span className="text-white text-xl font-black">24h</span>
              <span className="text-[10px] text-slate-500 font-black uppercase">تحديث مستمر</span>
            </div>
            <div className="w-px h-8 bg-white/10" />
            <div className="flex flex-col items-center">
              <span className="text-white text-xl font-black">AI</span>
              <span className="text-[10px] text-slate-500 font-black uppercase">تنقية دقيقة</span>
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
          {displayedNews.length > 0 ? (
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
                      <span className="text-[11px] font-bold text-slate-400 flex items-center gap-2">
                        <span className="font-black text-slate-900 bg-slate-100 px-2 py-0.5 rounded-lg">{news.source}</span>
                        <span>•</span>
                        {getMinutesAgo(new Date(news.publishedDate))}
                      </span>
                    </div>
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

      {/* News Detail Modal */}
      {showNewsModal && selectedNews && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn" onClick={() => setShowNewsModal(false)}>
          <div
            className="bg-white rounded-[40px] shadow-2xl w-full max-w-2xl overflow-hidden animate-slideUp max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="relative bg-gradient-to-r from-blue-600 to-indigo-700 p-8 lg:p-10 text-white">
              <button
                onClick={() => setShowNewsModal(false)}
                className="absolute top-6 left-6 w-12 h-12 flex items-center justify-center bg-white/10 hover:bg-white/20 rounded-full transition-all backdrop-blur-md"
              >
                <X size={24} />
              </button>
              <div className="flex items-center gap-5 mb-6">
                <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center text-white backdrop-blur-md border border-white/10">
                  {React.createElement(getCategoryTheme(selectedNews.category).icon, { size: 36 })}
                </div>
                <div>
                  <p className="text-lg font-black text-blue-50">{selectedNews.source}</p>
                  <p className="text-xs text-blue-200 flex items-center gap-2 mt-1">
                    <Clock size={14} />
                    {getMinutesAgo(new Date(selectedNews.publishedDate))}
                  </p>
                </div>
              </div>
              <span className={`flex items-center gap-2 px-4 py-1.5 text-[11px] font-black rounded-full uppercase tracking-wider ${getCategoryTheme(selectedNews.category).color} border border-white/10 shadow-lg shadow-black/5`}>
                {React.createElement(getCategoryTheme(selectedNews.category).icon, { size: 14 })}
                {getCategoryTheme(selectedNews.category).label}
              </span>
            </div>

            {/* Modal Content */}
            <div className="p-8 lg:p-10 space-y-8">
              {/* Media if available */}
              {selectedNews.media && (
                <div className="w-full rounded-[32px] overflow-hidden border border-slate-100 shadow-sm mb-4">
                  <img src={selectedNews.media} alt="News media" className="w-full h-auto object-cover max-h-[350px]" />
                </div>
              )}
              {/* Title */}
              <div>
                <h2 className="text-2xl font-black text-slate-900 leading-tight">
                  {selectedNews.title}
                </h2>
              </div>

              {/* Description */}
              <div className="p-6 bg-slate-50 rounded-[32px] border border-slate-100 shadow-inner">
                <p className="text-base text-slate-700 leading-relaxed font-medium">
                  {selectedNews.description}
                </p>
              </div>

              {/* Meta Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-6 bg-blue-50 rounded-[28px] border border-blue-100/50">
                  <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-2">المصدر الأساسي</p>
                  <p className="text-base font-black text-slate-900 flex items-center gap-3">
                    <span className="bg-white p-2 rounded-lg shadow-sm text-blue-600">
                      {React.createElement(getCategoryTheme(selectedNews.category).icon, { size: 24 })}
                    </span>
                    {selectedNews.source}
                  </p>
                </div>
                <div className="p-6 bg-purple-50 rounded-[28px] border border-purple-100/50">
                  <p className="text-[10px] font-black text-purple-500 uppercase tracking-widest mb-2">تاريخ النشر</p>
                  <p className="text-base font-black text-slate-900 flex items-center gap-3">
                    <div className="p-2 bg-white rounded-lg shadow-sm">
                      <Calendar size={20} className="text-purple-600" />
                    </div>
                    {new Date(selectedNews.publishedDate).toLocaleDateString('ar-SA', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-4 pt-6">
                <a
                  href={selectedNews.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-4 bg-blue-600 text-white rounded-[20px] text-sm font-black hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/20 flex items-center justify-center gap-3"
                >
                  <ExternalLink size={20} />
                  قراءة المقال كاملاً
                </a>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(selectedNews.link);
                    showToast('تم نسخ رابط المقال بنجاح', 'success');
                  }}
                  className="px-8 py-4 bg-white border border-slate-200 text-slate-600 rounded-[20px] text-sm font-black hover:bg-slate-50 hover:text-blue-600 transition-all flex items-center justify-center gap-3"
                >
                  <Copy size={20} />
                  نسخ الرابط
                </button>
              </div>

              {/* Disclaimer */}
              <div className="p-5 bg-amber-50 rounded-[24px] border border-amber-100/50">
                <div className="flex items-start gap-3">
                  <Info size={18} className="text-amber-600 shrink-0 mt-0.5" />
                  <p className="text-[11px] text-amber-800 font-bold leading-relaxed">
                    تم تجميع هذا المحتوى آلياً من مصادر موثوقة عالمياً عبر خدمة RSS. المنصة لا تتحمل مسؤولية دقة المعلومات أو الآراء الواردة في المصدر الأصلي.
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
