import React, { useState, useMemo } from 'react';
import { Clock, Search, Filter, Calendar, TrendingUp, ChevronDown, Bookmark, Share2, Sparkles, AlertCircle, Info, Zap, Flame, LayoutDashboard, FileText, Bell, X } from 'lucide-react';
import { TimelineEvent, TimelineEventType } from '../types';
import TimelineCard from './TimelineCard';

interface TimelinePageProps {
  events: TimelineEvent[];
}

const TimelinePage: React.FC<TimelinePageProps> = ({ events }) => {
  const [filterType, setFilterType] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [impactFilter, setImpactFilter] = useState<'ALL' | 'HIGH'>('ALL');
  const [sourceFilter, setSourceFilter] = useState<string>('ALL');
  const [isSourceDropdownOpen, setIsSourceDropdownOpen] = useState(false);
  const [visibleCount, setVisibleCount] = useState(10);
  const [showWelcome, setShowWelcome] = useState(() => localStorage.getItem('hideTimelineWelcome') !== 'true');
  const [tourStep, setTourStep] = useState<number | null>(null);
  const [dateRange, setDateRange] = useState<string>('ALL');
  const [isDateDropdownOpen, setIsDateDropdownOpen] = useState(false);

  // Extract unique sources for filter
  const sources = useMemo(() => {
    const s = new Set(events.map(e => e.sourceName));
    return Array.from(s);
  }, [events]);

  const dismissWelcome = () => {
    setShowWelcome(false);
    localStorage.setItem('hideTimelineWelcome', 'true');
  };

  const startTour = () => {
    setTourStep(1);
    setShowWelcome(false);
  };

  const filteredEvents = useMemo(() => {
    return events.filter(e => {
      const matchesType = filterType === 'ALL' || e.type === filterType;
      const matchesSearch = e.title.includes(searchQuery) || e.summary.includes(searchQuery) || e.tags.some(t => t.includes(searchQuery));
      const matchesImpact = impactFilter === 'ALL' || e.impactScore > 70;
      const matchesSource = sourceFilter === 'ALL' || e.sourceName === sourceFilter;
      
      let matchesDate = true;
      if (dateRange !== 'ALL') {
        const eventDate = new Date(e.timestamp);
        const now = new Date();
        const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        
        if (dateRange === 'TODAY') {
          matchesDate = eventDate >= startOfToday;
        } else if (dateRange === 'WEEK') {
          const lastWeek = new Date(startOfToday);
          lastWeek.setDate(lastWeek.getDate() - 7);
          matchesDate = eventDate >= lastWeek;
        } else if (dateRange === 'MONTH') {
          const lastMonth = new Date(startOfToday);
          lastMonth.setMonth(lastMonth.getMonth() - 1);
          matchesDate = eventDate >= lastMonth;
        }
      }

      return matchesType && matchesSearch && matchesImpact && matchesSource && matchesDate;
    });
  }, [events, filterType, searchQuery, impactFilter, sourceFilter, dateRange]);

  // Grouping logic
  const groupedEvents = useMemo(() => {
    const groups: { [key: string]: TimelineEvent[] } = {};
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const lastWeek = new Date(today);
    lastWeek.setDate(lastWeek.getDate() - 7);

    filteredEvents.slice(0, visibleCount).forEach(event => {
      const date = new Date(event.timestamp);
      const isToday = date.toDateString() === today.toDateString();
      const isYesterday = date.toDateString() === yesterday.toDateString();
      
      let groupKey = '';
      if (isToday) {
        groupKey = 'اليوم';
      } else if (isYesterday) {
        groupKey = 'الأمس';
      } else {
        groupKey = date.toLocaleDateString('ar-SA', { day: 'numeric', month: 'long', year: 'numeric' });
      }

      if (!groups[groupKey]) groups[groupKey] = [];
      groups[groupKey].push(event);
    });

    return groups;
  }, [filteredEvents, visibleCount]);

  const filterOptions = [
    { id: 'ALL', label: 'الكل' },
    { id: TimelineEventType.NEW_DATA, label: 'بيانات' },
    { id: TimelineEventType.SIGNAL, label: 'إشارات' },
    { id: TimelineEventType.INSIGHT, label: 'رؤى' },
    { id: TimelineEventType.REVISION, label: 'تعديلات' },
  ];

  return (
    <div className="max-w-7xl mx-auto p-4 lg:p-8 space-y-8 animate-fadeIn relative">
      {/* Onboarding Tour Overlay */}
      {tourStep !== null && (
        <div className="fixed inset-0 z-[100] bg-slate-900/40 backdrop-blur-sm animate-fadeIn flex items-center justify-center p-6">
           <div className="bg-white rounded-[32px] shadow-2xl border border-slate-200 p-8 max-w-md w-full animate-scaleIn relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-2 bg-slate-100">
                 <div className="h-full bg-blue-600 transition-all duration-500" style={{ width: `${(tourStep / 3) * 100}%` }}></div>
              </div>

              <div className="flex flex-col items-center text-center space-y-4">
                 <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mb-2">
                    {tourStep === 1 && <Search size={32} />}
                    {tourStep === 2 && <Filter size={32} />}
                    {tourStep === 3 && <Zap size={32} />}
                 </div>
                 
                 <h3 className="text-xl font-black text-slate-900">
                    {tourStep === 1 && 'البحث السريع'}
                    {tourStep === 2 && 'أدوات التصفية المتقدمة'}
                    {tourStep === 3 && 'ماذا يعني هذا لي؟'}
                 </h3>
                 
                 <p className="text-sm font-bold text-slate-500 leading-relaxed">
                    {tourStep === 1 && 'ابحث عن أي حدث أو كلمة مفتاحية بسرعة وسهولة من خلال شريط البحث الذكي.'}
                    {tourStep === 2 && 'استخدم الفلاتر العلوية لاستعراض نوع البيانات المفضل لديك أو تحديد مصدر معين.'}
                    {tourStep === 3 && 'انقر على "قراءة المزيد" داخل أي بطاقة لتكتشف كيف يؤثر هذا التحديث على استثماراتك.'}
                 </p>

                 <div className="flex items-center gap-3 w-full pt-4">
                    {tourStep < 3 ? (
                       <button 
                         onClick={() => setTourStep(tourStep + 1)}
                         className="flex-1 py-4 bg-blue-600 text-white rounded-2xl font-black text-sm hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20"
                       >
                         التالي
                       </button>
                    ) : (
                       <button 
                         onClick={() => setTourStep(null)}
                         className="flex-1 py-4 bg-green-600 text-white rounded-2xl font-black text-sm hover:bg-green-700 transition-all shadow-lg shadow-green-500/20"
                       >
                         ابدأ الاستكشاف
                       </button>
                    )}
                 </div>
              </div>
           </div>
        </div>
      )}

      {/* Welcome Banner */}
      {showWelcome && (
        <div className="bg-white border-2 border-blue-100 rounded-[32px] p-6 lg:p-8 shadow-xl shadow-blue-500/5 relative overflow-hidden group">
           <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:scale-110 transition-transform duration-700">
              <Sparkles size={160} />
           </div>
           
           <button 
             onClick={dismissWelcome}
             className="absolute top-6 left-6 p-2 text-slate-400 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 rounded-xl transition-all"
           >
              <X size={20} />
           </button>

           <div className="flex flex-col lg:flex-row lg:items-center gap-8 relative z-10">
              <div className="w-20 h-20 bg-blue-600 rounded-[24px] shadow-lg shadow-blue-500/20 flex items-center justify-center shrink-0">
                 <Zap size={40} className="text-white fill-white/20" />
              </div>
              <div className="flex-1">
                 <h3 className="text-xl lg:text-2xl font-black text-slate-900 mb-2">مرحباً بك في سجل التغييرات! 👋</h3>
                 <p className="text-slate-500 font-bold text-base max-w-3xl leading-relaxed">
                    هنا نجمع لك أهم الأحداث الاقتصادية وتحديثات المنصة لحظة بلحظة لتبقى على اطلاع دائم بما يؤثر على استثماراتك. لا تفوت أي فرصة من خلال متابعة هذا السجل دورياً.
                 </p>
                 <div className="flex items-center gap-4 mt-6">
                    <button 
                      onClick={dismissWelcome}
                      className="px-6 py-3 bg-slate-900 text-white rounded-xl font-black text-sm hover:bg-black transition-all"
                    >
                      فهمت ذلك
                    </button>
                    <button 
                      onClick={startTour}
                      className="px-6 py-3 bg-white border border-slate-200 text-slate-600 hover:text-blue-600 hover:border-blue-500 rounded-xl font-black text-sm transition-all flex items-center gap-2"
                    >
                      <Sparkles size={16} />
                      ابدأ جولة تعريفية
                    </button>
                 </div>
              </div>
           </div>
        </div>
      )}

      {/* Enhanced Page Header Card - More Compact */}
      <header className="relative overflow-hidden bg-slate-900 rounded-[32px] p-6 lg:p-8 shadow-xl shadow-slate-900/10 mb-8">
        {/* Abstract background blobs */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-blue-600/10 rounded-full blur-[60px]" />
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-indigo-600/10 rounded-full blur-[60px]" />
        
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex-1 space-y-4 text-right">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 text-blue-400 rounded-full text-[9px] font-black uppercase tracking-widest backdrop-blur-md">
              <Clock size={12} className="animate-pulse" />
              التحديثات اللحظية
            </div>
            
            <h1 className="text-2xl lg:text-3xl font-black text-white tracking-tight">
              سجل التغييرات
            </h1>
            
            <p className="max-w-2xl text-sm text-slate-400 font-bold leading-relaxed">
              تتبع شامل لكل التحديثات الاقتصادية والإشارات السوقية لضمان البقاء في قلب الحدث وتوثيق كل حركة تغيير جوهرية.
            </p>
          </div>
          
          <div className="flex items-center gap-6 bg-white/5 p-4 rounded-2xl backdrop-blur-md border border-white/5">
            <div className="flex flex-col items-center px-2">
              <span className="text-white text-lg font-black">100+</span>
              <span className="text-[9px] text-slate-500 font-black uppercase">حدث/شهر</span>
            </div>
            <div className="w-px h-8 bg-white/10" />
            <div className="flex flex-col items-center px-2">
              <span className="text-white text-lg font-black">Live</span>
              <span className="text-[9px] text-slate-500 font-black uppercase">إشارات</span>
            </div>
            <div className="w-px h-8 bg-white/10" />
            <div className="flex flex-col items-center px-2">
              <span className="text-white text-lg font-black">100%</span>
              <span className="text-[9px] text-slate-500 font-black uppercase">دقة</span>
            </div>
          </div>
        </div>
      </header>

      {/* Advanced Filtering & Search Bar */}
      <div className={`bg-white p-2 rounded-[28px] shadow-sm border border-slate-200/60 sticky top-[72px] lg:top-[84px] z-40 transition-all duration-300 ${tourStep === 1 || tourStep === 2 ? 'ring-4 ring-blue-500 shadow-2xl z-[101]' : ''}`}>
        <div className="flex flex-col lg:flex-row gap-2">
          {/* Main Search & Filters Group */}
          <div className="flex-1 flex flex-col md:flex-row gap-2">
            {/* Search Input */}
            <div className={`relative flex-1 group ${tourStep === 1 ? 'z-[102]' : ''}`}>
              <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={18} />
              <input 
                type="text" 
                placeholder="ابحث في السجل..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-12 pr-12 pl-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold focus:bg-white focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all outline-none"
              />
            </div>

            {/* Segmented Control for Types */}
            <div className={`flex p-1 bg-slate-50 rounded-2xl border border-slate-200 overflow-x-auto no-scrollbar ${tourStep === 2 ? 'z-[102] ring-2 ring-blue-400' : ''}`}>
              {filterOptions.map(opt => (
                <button
                  key={opt.id}
                  onClick={() => setFilterType(opt.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-black transition-all whitespace-nowrap ${
                    filterType === opt.id 
                    ? 'bg-white text-blue-600 shadow-sm border border-slate-100' 
                    : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Impact Filter */}
            <button 
              onClick={() => setImpactFilter(prev => prev === 'ALL' ? 'HIGH' : 'ALL')}
              className={`h-12 px-4 rounded-2xl border flex items-center gap-2 transition-all font-black text-xs ${
                impactFilter === 'HIGH' 
                ? 'bg-orange-50 border-orange-200 text-orange-600 shadow-sm' 
                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Flame size={16} />
              تأثير مرتفع فقط
            </button>

            {/* Source Dropdown */}
            <div className="relative">
              <button 
                onClick={() => setIsSourceDropdownOpen(!isSourceDropdownOpen)}
                className={`h-12 px-4 rounded-2xl border flex items-center gap-2 transition-all font-black text-xs bg-white border-slate-200 text-slate-600 hover:bg-slate-50 min-w-[140px] justify-between ${isSourceDropdownOpen ? 'border-blue-500 ring-4 ring-blue-500/5' : ''}`}
              >
                <div className="flex items-center gap-2">
                  <Filter size={16} />
                  <span>{sourceFilter === 'ALL' ? 'حسب المصدر' : sourceFilter}</span>
                </div>
                <ChevronDown size={14} className={`transition-transform duration-300 ${isSourceDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {isSourceDropdownOpen && (
                <div className="absolute top-14 left-0 w-64 bg-white rounded-2xl shadow-xl border border-slate-200 p-2 z-50 animate-scaleIn origin-top-left">
                  <button 
                    onClick={() => { setSourceFilter('ALL'); setIsSourceDropdownOpen(false); }}
                    className="w-full text-right px-3 py-2.5 rounded-xl text-[13px] font-bold hover:bg-slate-50 transition-colors"
                  >
                    كل المصادر
                  </button>
                  {sources.map(s => (
                    <button 
                      key={s}
                      onClick={() => { setSourceFilter(s); setIsSourceDropdownOpen(false); }}
                      className={`w-full text-right px-3 py-2.5 rounded-xl text-[13px] font-bold hover:bg-slate-50 transition-colors ${sourceFilter === s ? 'text-blue-600 bg-blue-50/50' : 'text-slate-600'}`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Date Picker Button (Functional) */}
            <div className="relative">
              <button 
                onClick={() => setIsDateDropdownOpen(!isDateDropdownOpen)}
                className={`h-12 px-4 rounded-2xl border flex items-center gap-2 transition-all font-black text-xs min-w-[140px] justify-between ${
                  dateRange !== 'ALL' 
                  ? 'bg-blue-50 border-blue-200 text-blue-600 shadow-sm' 
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                } ${isDateDropdownOpen ? 'border-blue-500 ring-4 ring-blue-500/5' : ''}`}
              >
                <div className="flex items-center gap-2">
                  <Calendar size={16} />
                  <span>
                    {dateRange === 'ALL' && 'النطاق الزمني'}
                    {dateRange === 'TODAY' && 'اليوم'}
                    {dateRange === 'WEEK' && 'آخر 7 أيام'}
                    {dateRange === 'MONTH' && 'هذا الشهر'}
                  </span>
                </div>
                <ChevronDown size={14} className={`transition-transform duration-300 ${isDateDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {isDateDropdownOpen && (
                <div className="absolute top-14 left-0 w-56 bg-white rounded-2xl shadow-xl border border-slate-200 p-2 z-50 animate-scaleIn origin-top-left">
                  {[
                    { id: 'ALL', label: 'كل التواريخ' },
                    { id: 'TODAY', label: 'اليوم' },
                    { id: 'WEEK', label: 'آخر 7 أيام' },
                    { id: 'MONTH', label: 'هذا الشهر' },
                  ].map(opt => (
                    <button 
                      key={opt.id}
                      onClick={() => { setDateRange(opt.id); setIsDateDropdownOpen(false); }}
                      className={`w-full text-right px-3 py-2.5 rounded-xl text-[13px] font-bold hover:bg-slate-50 transition-colors ${dateRange === opt.id ? 'text-blue-600 bg-blue-50/50' : 'text-slate-600'}`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area: Grouped Events */}
      <div className="space-y-12 relative pb-20">
        {/* Timeline Hub Line */}
        <div className="absolute right-8 top-0 bottom-20 w-0.5 bg-gradient-to-b from-blue-200/50 via-slate-200/50 to-transparent hidden md:block"></div>

        {(Object.entries(groupedEvents) as [string, TimelineEvent[]][]).map(([groupName, groupEvents]) => (
          <div key={groupName} className="space-y-6 animate-fadeIn">
            <div className="flex items-center gap-4 sticky top-[160px] lg:top-[170px] z-30 py-2">
              <div className="p-2.5 bg-white border-2 border-slate-100 rounded-2xl shadow-sm z-10 shrink-0">
                 <Calendar size={16} className="text-blue-600" />
              </div>
              <h3 className="text-sm font-black text-slate-900 bg-white/50 backdrop-blur-md pr-4 py-1 rounded-lg">
                {groupName}
              </h3>
              <div className="h-px bg-slate-200 flex-1 opacity-50"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 lg:gap-6 pr-0 md:pr-14">
              {groupEvents.map(event => (
                <div key={event.id} className={`relative group/card-wrapper ${tourStep === 3 ? 'z-[102] ring-4 ring-blue-500 rounded-[28px]' : ''}`}>
                    <TimelineCard event={event} />
                </div>
              ))}
            </div>
          </div>
        ))}

        {filteredEvents.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-[32px] border border-dashed border-slate-200">
             <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                <Search size={32} className="text-slate-300" />
             </div>
             <h3 className="text-lg font-black text-slate-800">لا توجد نتائج</h3>
             <p className="text-slate-500 font-bold mt-1">حاول تغيير معايير البحث أو التصفية</p>
          </div>
        )}

        {/* Load More Section */}
        {visibleCount < filteredEvents.length && (
          <div className="flex justify-center mt-12 pb-10">
            <button 
              onClick={() => setVisibleCount(prev => prev + 10)}
              className="px-8 py-4 bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-md hover:border-blue-500 text-slate-600 hover:text-blue-600 font-black text-sm transition-all flex items-center gap-3"
            >
              عرض المزيد من السجلات
              <ChevronDown size={18} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TimelinePage;
