import React, { useState, useMemo } from 'react';
import { FeedItem, FeedContentType, User } from '../types';
import FeedCard from './FeedCard';
import {
    Filter,
    LayoutGrid,
    FileText,
    BarChart2,
    Image,
    Video,
    TrendingUp,
    Search,
    Activity,
    Lightbulb,
    Scale,
    Sparkles,
    ChevronLeft,
    ChevronRight,
    ArrowDownUp,
    ListFilter,
    Layers,
    Newspaper,
    GraduationCap,
    MessageCircle,
    CheckSquare,
    X
} from 'lucide-react';

interface HomeFeedProps {
    feedItems: FeedItem[];
    user: User;
    onOpenWizard?: () => void;
}

const ITEMS_PER_PAGE = 25;

const HomeFeed: React.FC<HomeFeedProps> = ({ feedItems, user, onOpenWizard }) => {
    // --- STATE ---
    const [activeTab, setActiveTab] = useState('ALL');
    const [activeType, setActiveType] = useState<string | null>(null);
    const [sortBy, setSortBy] = useState<'LATEST' | 'POPULAR' | 'SAVED'>('LATEST');
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);

    // --- CONFIG ---
    const tabs = [
        { id: 'ALL', label: 'الكل', icon: LayoutGrid },
        { id: 'ANALYTIC', label: 'تحليلات', icon: Activity },
        { id: 'DATA', label: 'بيانات', icon: BarChart2 },
        { id: 'NEWS', label: 'أخبار', icon: Newspaper },
        { id: 'EDU', label: 'تعليمي', icon: GraduationCap },
    ];

    const typeFilters = [
        { id: FeedContentType.SIGNAL_ALERT, label: 'إشارات', icon: TrendingUp, cat: 'ANALYTIC' },
        { id: FeedContentType.MARKET_PULSE, label: 'حرارة السوق', icon: Activity, cat: 'ANALYTIC' },
        { id: FeedContentType.COMPARISON, label: 'مقارنات', icon: Scale, cat: 'ANALYTIC' },

        { id: FeedContentType.DASHBOARD, label: 'لوحات', icon: Layers, cat: 'DATA' },
        { id: FeedContentType.PORTFOLIO, label: 'محافظ', icon: BarChart2, cat: 'DATA' },
        { id: FeedContentType.FACT, label: 'حقائق', icon: Lightbulb, cat: 'DATA' },

        { id: FeedContentType.BREAKING_NEWS, label: 'عاجل', icon: Newspaper, cat: 'NEWS' },
        { id: FeedContentType.EVENT, label: 'أحداث', icon: Sparkles, cat: 'NEWS' },
        { id: FeedContentType.ARTICLE, label: 'مقالات', icon: FileText, cat: 'NEWS' },

        { id: FeedContentType.TERMINOLOGY, label: 'مصطلحات', icon: GraduationCap, cat: 'EDU' },
        { id: FeedContentType.EXPERT_INSIGHT, label: 'رؤى', icon: Lightbulb, cat: 'EDU' },
        { id: FeedContentType.Q_AND_A, label: 'سؤال وجواب', icon: MessageCircle, cat: 'EDU' },
        { id: FeedContentType.CHECKLIST, label: 'قوائم', icon: CheckSquare, cat: 'EDU' },
        { id: FeedContentType.POLL, label: 'تصويت', icon: ListFilter, cat: 'EDU' },
    ];

    // --- LOGIC ---
    const filteredItems = useMemo(() => {
        let items = feedItems;

        // 1. Tab Filter
        if (activeTab !== 'ALL') {
            const allowedTypes = typeFilters.filter(t => t.cat === activeTab).map(t => t.id);
            items = items.filter(item => allowedTypes.includes(item.contentType as any));
        }

        // 2. Exact Type Filter
        if (activeType) {
            items = items.filter(item => item.contentType === activeType);
        }

        // 3. Search
        if (searchQuery) {
            const q = searchQuery.toLowerCase();
            items = items.filter(item =>
                item.title.toLowerCase().includes(q) ||
                item.author.name.toLowerCase().includes(q) ||
                item.tags.some(tag => tag.toLowerCase().includes(q))
            );
        }

        // 4. Sort
        if (sortBy === 'POPULAR') {
            items = [...items].sort((a, b) => b.engagement.likes - a.engagement.likes);
        } else if (sortBy === 'SAVED') {
            items = [...items].sort((a, b) => b.engagement.saves - a.engagement.saves);
        } else {
            // Default LATEST
            items = [...items].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
        }

        return items;
    }, [feedItems, activeTab, activeType, searchQuery, sortBy]);

    // Pagination Calculation
    const totalItems = filteredItems.length;
    const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
    const displayedItems = filteredItems.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

    const handlePageChange = (p: number) => {
        setCurrentPage(p);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleTabChange = (tabId: string) => {
        setActiveTab(tabId);
        setActiveType(null); // Reset sub-filter
        setCurrentPage(1); // Reset page
    };

    const getVisibleChips = () => {
        if (activeTab === 'ALL') return typeFilters;
        return typeFilters.filter(t => t.cat === activeTab);
    };

    return (
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-4 lg:py-8">

            {/* Compact Hero Section */}
            <div className="mb-4 lg:mb-6">
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl md:rounded-2xl p-4 md:p-6 relative overflow-hidden shadow-lg shadow-blue-900/20">
                    <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>

                    <div className="relative z-10 flex flex-col md:flex-row items-center gap-4">
                        {/* Title Section */}
                        <div className="flex-1 text-right md:text-right">
                            <h1 className="text-lg md:text-2xl font-bold text-white mb-1 flex items-center gap-2 justify-end md:justify-start">
                                <Sparkles size={20} className="text-blue-200" />
                                مركز الاكتشاف
                            </h1>
                            <p className="text-xs md:text-sm text-blue-100 font-medium">
                                اكتشف التحليلات والبيانات الاستثمارية
                            </p>
                        </div>

                        {/* Search Bar - Inline */}
                        <div className="w-full md:w-96 relative group">
                            <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none group-focus-within:text-blue-600 transition-colors" size={16} />
                            <input
                                type="text"
                                placeholder="ابحث..."
                                className="w-full pl-3 pr-10 py-2 md:py-2.5 rounded-lg border-2 border-white/20 bg-white/90 backdrop-blur-sm shadow-sm focus:bg-white focus:ring-2 focus:ring-white/50 focus:border-white outline-none text-gray-900 text-sm font-medium transition-all placeholder:text-gray-500"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            {searchQuery && (
                                <button
                                    onClick={() => setSearchQuery('')}
                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500 transition-colors"
                                >
                                    <X size={14} />
                                </button>
                            )}
                        </div>

                        {/* AI Assistant Button - Compact */}
                        {onOpenWizard && !searchQuery && (
                            <button
                                onClick={onOpenWizard}
                                className="hidden md:flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white px-4 py-2.5 rounded-lg font-bold transition-all border border-white/20 hover:border-white/40"
                            >
                                <Sparkles size={16} className="text-blue-200" />
                                <span className="text-xs">مساعد AI</span>
                            </button>
                        )}
                    </div>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">

                {/* Main Feed Column */}
                <div className="flex-1 w-full max-w-full">

                    {/* --- POWERFUL FILTER BAR (Sticky) --- */}
                    <div className="sticky top-[60px] lg:top-[72px] z-30 transition-all duration-300">
                        <div className="bg-white/95 backdrop-blur-md shadow-lg border border-gray-100 rounded-xl md:rounded-2xl p-1.5 md:p-2 mb-4">

                            {/* Top Row: Tabs + Sort */}
                            <div className="flex items-center justify-between gap-2 mb-1.5 pb-1.5 border-b border-gray-100">
                                {/* Categories */}
                                <div className="flex bg-gray-100/50 p-1 rounded-lg md:rounded-xl overflow-x-auto no-scrollbar">
                                    {tabs.map(tab => (
                                        <button
                                            key={tab.id}
                                            onClick={() => handleTabChange(tab.id)}
                                            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] md:text-xs lg:text-sm font-bold transition-all whitespace-nowrap ${activeTab === tab.id
                                                ? 'bg-white text-blue-600 shadow-sm'
                                                : 'text-gray-500 hover:text-gray-900 hover:bg-gray-200/50'
                                                }`}
                                        >
                                            <tab.icon size={12} className="shrink-0" />
                                            <span>{tab.label}</span>
                                        </button>
                                    ))}
                                </div>

                                {/* Sort Actions */}
                                <div className="flex items-center gap-1 md:gap-2">
                                    <button
                                        onClick={() => setSortBy('LATEST')}
                                        className={`p-1.5 md:p-2 rounded-lg transition-all ${sortBy === 'LATEST' ? 'bg-blue-50 text-blue-600' : 'text-gray-400 hover:bg-gray-50'}`}
                                        title="الأحدث"
                                    >
                                        <ArrowDownUp size={14} className="md:w-4 md:h-4" />
                                    </button>
                                    <button
                                        onClick={() => setSortBy('POPULAR')}
                                        className={`p-1.5 md:p-2 rounded-lg transition-all ${sortBy === 'POPULAR' ? 'bg-orange-50 text-orange-600' : 'text-gray-400 hover:bg-gray-50'}`}
                                        title="الأكثر شعبية"
                                    >
                                        <TrendingUp size={14} className="md:w-4 md:h-4" />
                                    </button>
                                </div>
                            </div>

                            {/* Bottom Row: Type Chips */}
                            <div className="overflow-x-auto no-scrollbar pb-0.5">
                                <div className="flex items-center gap-1.5 md:gap-2 min-w-max px-0.5">
                                    <button
                                        onClick={() => setActiveType(null)}
                                        className={`px-3 py-1 rounded-full text-[10px] md:text-xs font-bold border transition-all ${!activeType
                                            ? 'bg-gray-800 text-white border-gray-800 shadow-sm'
                                            : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'
                                            }`}
                                    >
                                        الكل
                                    </button>
                                    {getVisibleChips().map(type => (
                                        <button
                                            key={type.id}
                                            onClick={() => {
                                                setActiveType(activeType === type.id ? null : type.id as any);
                                                setCurrentPage(1);
                                            }}
                                            className={`flex items-center gap-1 px-3 py-1 rounded-full text-[10px] md:text-xs font-bold border transition-all ${activeType === type.id
                                                ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/20'
                                                : 'bg-white text-gray-600 border-gray-200 hover:border-blue-300 hover:text-blue-600'
                                                }`}
                                        >
                                            <type.icon size={10} className="md:w-3 md:h-3" />
                                            {type.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Timeline Feed */}
                    <div className="space-y-4 md:space-y-6 pb-24 lg:pb-0 min-h-[600px]">
                        {displayedItems.length > 0 ? (
                            <>
                                {displayedItems.map(item => (
                                    <FeedCard key={item.id} item={item} />
                                ))}

                                {/* --- PAGINATION UI --- */}
                                <div className="mt-8 mb-10 bg-white border border-gray-200 rounded-2xl p-4 shadow-sm flex items-center justify-between">
                                    <div className="text-sm text-gray-500">
                                        عرض <span className="font-bold text-gray-900">{displayedItems.length}</span> من <span className="font-bold text-gray-900">{totalItems}</span>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                                            disabled={currentPage === 1}
                                            className="w-10 h-10 flex items-center justify-center rounded-xl border border-gray-200 hover:bg-gray-50 hover:border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                        >
                                            <ChevronRight size={18} />
                                        </button>

                                        {/* Page Numbers */}
                                        <div className="flex items-center gap-1 bg-gray-50 p-1 rounded-xl">
                                            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                                // Logic to show generic page numbers 1, 2, 3...
                                                // For simplicity in this mockup, we show 1..totalPages if minimal
                                                let p = i + 1;
                                                return (
                                                    <button
                                                        key={p}
                                                        onClick={() => handlePageChange(p)}
                                                        className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm font-bold transition-all ${currentPage === p
                                                            ? 'bg-white text-blue-600 shadow-sm border border-gray-200'
                                                            : 'text-gray-500 hover:text-gray-900'
                                                            }`}
                                                    >
                                                        {p}
                                                    </button>
                                                );
                                            })}
                                            {totalPages > 5 && <span className="px-2 text-gray-400">...</span>}
                                        </div>

                                        <button
                                            onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                                            disabled={currentPage === totalPages}
                                            className="w-10 h-10 flex items-center justify-center rounded-xl border border-gray-200 hover:bg-gray-50 hover:border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                        >
                                            <ChevronLeft size={18} />
                                        </button>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-200 mx-4 sm:mx-0">
                                <div className="inline-block p-4 bg-gray-50 rounded-full mb-3">
                                    <Search size={24} className="text-gray-400" />
                                </div>
                                <h3 className="font-bold text-gray-900 mb-1">لا توجد نتائج</h3>
                                <p className="text-gray-500 font-medium text-sm">حاول تغيير الفلاتر أو كلمات البحث</p>
                                <button
                                    onClick={() => { setActiveTab('ALL'); setActiveType(null); setSearchQuery(''); }}
                                    className="mt-4 text-blue-600 font-bold text-sm hover:underline"
                                >
                                    مسح كل الفلاتر
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Enhanced Right Sidebar */}
                <div className="hidden lg:block w-80 shrink-0 space-y-6 pt-2">
                    {/* User Profile Card */}
                    <div className="bg-gradient-to-br from-blue-600 to-purple-600 p-6 rounded-2xl shadow-xl text-white relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:bg-white/20 transition-all duration-700"></div>
                        <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:bg-white/20 transition-all duration-700"></div>

                        <div className="relative z-10">
                            <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm mx-auto mb-3 border-4 border-white/30 shadow-lg overflow-hidden relative">
                                <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-black/20 hidden group-hover:flex items-center justify-center backdrop-blur-[1px] cursor-pointer">
                                    <span className="text-[10px] font-bold uppercase tracking-wider">تعديل</span>
                                </div>
                            </div>
                            <h3 className="font-bold text-white text-center mb-1 text-lg">{user.name}</h3>
                            <p className="text-xs text-white/80 font-medium text-center mb-4 bg-white/10 inline-block px-3 py-1 rounded-full mx-auto">{user.role}</p>

                            {/* Quick Stats */}
                            <div className="grid grid-cols-3 gap-2 mt-6">
                                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-2 text-center border border-white/10 hover:bg-white/20 transition-colors cursor-pointer">
                                    <p className="text-xl font-black">12</p>
                                    <p className="text-[10px] text-white/70 font-bold uppercase">اشتراك</p>
                                </div>
                                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-2 text-center border border-white/10 hover:bg-white/20 transition-colors cursor-pointer">
                                    <p className="text-xl font-black">48</p>
                                    <p className="text-[10px] text-white/70 font-bold uppercase">محفوظ</p>
                                </div>
                                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-2 text-center border border-white/10 hover:bg-white/20 transition-colors cursor-pointer">
                                    <p className="text-xl font-black">156</p>
                                    <p className="text-[10px] text-white/70 font-bold uppercase">إعجاب</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Trending Topics Enhanced */}
                    <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm sticky top-24">
                        <h3 className="font-bold text-gray-900 mb-4 text-sm flex items-center gap-2">
                            <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center shadow-red-200 shadow-lg">
                                <TrendingUp size={16} className="text-white" />
                            </div>
                            المواضيع الرائجة
                        </h3>
                        <div className="space-y-3">
                            {[
                                { tag: '#رؤية_2030', count: '2.4K', trend: '+12%', color: 'blue' },
                                { tag: '#الطاقة_المتجددة', count: '1.8K', trend: '+8%', color: 'green' },
                                { tag: '#الذكاء_الاصطناعي', count: '3.1K', trend: '+24%', color: 'purple' },
                                { tag: '#التعدين', count: '892', trend: '+5%', color: 'amber' },
                                { tag: '#الاستثمار_الأجنبي', count: '1.2K', trend: '+15%', color: 'indigo' }
                            ].map((item, idx) => (
                                <button
                                    key={item.tag}
                                    onClick={() => setSearchQuery(item.tag.replace('#', ''))}
                                    className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 border border-transparent hover:border-gray-200 transition-all group"
                                >
                                    <div className="flex items-center gap-3">
                                        <span className="text-lg font-black text-gray-300 group-hover:text-blue-500 transition-colors w-6">
                                            {idx + 1}
                                        </span>
                                        <div className="text-right">
                                            <p className={`text-sm font-bold text-gray-800`}>
                                                {item.tag}
                                            </p>
                                            <p className="text-[10px] text-gray-400">{item.count} منشور</p>
                                        </div>
                                    </div>
                                    <span className="text-[10px] font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full border border-green-100">
                                        {item.trend}
                                    </span>
                                </button>
                            ))}
                        </div>
                        <button className="w-full mt-4 py-2 text-xs font-bold text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                            عرض المزيد من التحليلات
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomeFeed;