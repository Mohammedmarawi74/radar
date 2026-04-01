import React, { useState, useMemo, useEffect } from "react";
import {
  Calendar,
  Clock,
  FileText,
  Archive,
  BarChart3,
  Search,
  Filter,
  Plus,
  MoreVertical,
  Edit2,
  Copy,
  Trash2,
  Eye,
  CheckCircle,
  AlertCircle,
  XCircle,
  TrendingUp,
  TrendingDown,
  Sparkles,
  Lightbulb,
  ShieldAlert,
  History,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Bell,
  Repeat,
  Play,
  Pause,
  Save,
  Send,
  X,
  LayoutGrid,
  LayoutDashboard,
  List,
  Tag,
  User,
  MessageSquare,
  Share2,
  Zap,
  Target,
  Brain,
  FileCheck,
  AlertTriangle,
  ThumbsUp,
  MousePointerClick,
  EyeOff,
  CalendarDays,
  RefreshCw,
  Library,
  PieChart,
  Star,
  Activity,
  Users,
  ArrowUpRight,
  Check,
  Info,
  XOctagon,
} from "lucide-react";

interface ContentItem {
  id: string;
  title: string;
  type: "post" | "notification" | "campaign" | "template";
  status: "draft" | "scheduled" | "published" | "archived" | "review";
  author: string;
  authorAvatar?: string;
  createdAt: string;
  scheduledFor?: string;
  publishedAt?: string;
  content: string;
  category: string;
  tags: string[];
  metrics: {
    views?: number;
    clicks?: number;
    engagement?: number;
    comments?: number;
    conversions?: number;
  };
  aiFlags?: {
    duplicate?: boolean;
    inappropriate?: boolean;
    suggestions?: string[];
    engagementScore?: number;
    optimalTime?: string;
  };
  reviewHistory?: Array<{
    action: "approved" | "rejected" | "edited";
    reviewer: string;
    timestamp: string;
    notes?: string;
  }>;
}

const AdvancedContentManagement = () => {
  const [activeTab, setActiveTab] = useState<
    "dashboard" | "schedule" | "review" | "library" | "analytics"
  >("dashboard");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedContent, setSelectedContent] = useState<ContentItem | null>(
    null,
  );
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [toasts, setToasts] = useState<
    Array<{ id: string; message: string; type: "success" | "error" | "info" }>
  >([]);
  const [isLoading, setIsLoading] = useState(true);

  // Simulate initial loading
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  // Toast helper
  const addToast = (
    message: string,
    type: "success" | "error" | "info" = "info",
  ) => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Mock Data
  const contentItems: ContentItem[] = useMemo(
    () => [
      {
        id: "1",
        title: "تحليل سوق التكنولوجيا الأسبوعي",
        type: "post",
        status: "scheduled",
        author: "أحمد محمد",
        authorAvatar: "https://i.pravatar.cc/150?u=1",
        createdAt: "2025-01-15",
        scheduledFor: "2025-01-20T10:00:00",
        content: "نظرة شاملة على أداء قطاع التكنولوجيا...",
        category: "تحليلات السوق",
        tags: ["تكنولوجيا", "أسبوعي", "تحليل"],
        metrics: { views: 0, clicks: 0, engagement: 0, comments: 0 },
        aiFlags: {
          engagementScore: 85,
          optimalTime: "10:00 AM",
          suggestions: ["أضف صورة توضيحية", "اختصر المقدمة"],
        },
      },
      {
        id: "2",
        title: "تنبيه: فرصة استثمارية في القطاع الصحي",
        type: "notification",
        status: "published",
        author: "سارة علي",
        authorAvatar: "https://i.pravatar.cc/150?u=2",
        createdAt: "2025-01-14",
        publishedAt: "2025-01-15T14:30:00",
        content: "تم رصد حركة سيولة استثنائية...",
        category: "تنبيهات",
        tags: ["صحة", "فرصة", "عاجل"],
        metrics: {
          views: 15420,
          clicks: 3240,
          engagement: 21.5,
          comments: 156,
          conversions: 890,
        },
        aiFlags: {
          engagementScore: 92,
          suggestions: [],
        },
        reviewHistory: [
          {
            action: "approved",
            reviewer: "محمد الخبير",
            timestamp: "2025-01-15T13:00:00",
            notes: "محتوى ممتاز",
          },
        ],
      },
      {
        id: "3",
        title: "حملة رمضان الاستثمارية 2025",
        type: "campaign",
        status: "draft",
        author: "فريق التسويق",
        createdAt: "2025-01-10",
        content: "حملة شاملة للترويج...",
        category: "حملات",
        tags: ["رمضان", "موسمي", "ترويج"],
        metrics: { views: 0, clicks: 0, engagement: 0, comments: 0 },
        aiFlags: {
          duplicate: false,
          engagementScore: 78,
          suggestions: ["أضف فيديو تعريفي", "حدد الجمهور المستهدف بدقة"],
        },
      },
      {
        id: "4",
        title: "قالب تقرير الأداء الشهري",
        type: "template",
        status: "archived",
        author: "أحمد محمد",
        createdAt: "2024-12-01",
        publishedAt: "2024-12-05T09:00:00",
        content: "نموذج موحد لتقارير الأداء...",
        category: "قوالب",
        tags: ["قالب", "شهري", "تقرير"],
        metrics: {
          views: 8920,
          clicks: 1240,
          engagement: 14.2,
          comments: 45,
          conversions: 320,
        },
        aiFlags: { engagementScore: 72 },
      },
      {
        id: "5",
        title: "مراجعة محتوى: تحليل العملات الرقمية",
        type: "post",
        status: "review",
        author: "خالد يوسف",
        authorAvatar: "https://i.pravatar.cc/150?u=3",
        createdAt: "2025-01-16",
        content: "تحليل شامل لسوق العملات...",
        category: "تحليلات السوق",
        tags: ["عملات رقمية", "بيتكوين", "تحليل"],
        metrics: { views: 0, clicks: 0, engagement: 0, comments: 0 },
        aiFlags: {
          inappropriate: false,
          duplicate: false,
          engagementScore: 88,
          suggestions: ["أضف مصادر للبيانات", "وضح المخاطر المحتملة"],
          optimalTime: "02:00 PM",
        },
      },
      {
        id: "6",
        title: "إشعار: صيانة النظام المجدولة",
        type: "notification",
        status: "scheduled",
        author: "فريق التقنية",
        createdAt: "2025-01-16",
        scheduledFor: "2025-01-22T03:00:00",
        content: "سيتم إجراء صيانة دورية...",
        category: "تنبيهات",
        tags: ["صيانة", "نظام", "إشعار"],
        metrics: { views: 0, clicks: 0, engagement: 0, comments: 0 },
        aiFlags: { engagementScore: 65 },
      },
    ],
    [],
  );

  // Filter content based on search and filters
  const filteredContent = useMemo(() => {
    return contentItems.filter((item) => {
      const matchesSearch =
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.content.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory =
        selectedCategory === "all" || item.category === selectedCategory;
      const matchesStatus =
        selectedStatus === "all" || item.status === selectedStatus;
      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [contentItems, searchQuery, selectedCategory, selectedStatus]);

  // Stats calculations
  const stats = useMemo(
    () => ({
      total: contentItems.length,
      draft: contentItems.filter((i) => i.status === "draft").length,
      scheduled: contentItems.filter((i) => i.status === "scheduled").length,
      published: contentItems.filter((i) => i.status === "published").length,
      archived: contentItems.filter((i) => i.status === "archived").length,
      review: contentItems.filter((i) => i.status === "review").length,
      avgEngagement:
        contentItems
          .filter((i) => i.metrics.engagement)
          .reduce((acc, i) => acc + (i.metrics.engagement || 0), 0) /
          contentItems.filter((i) => i.metrics.engagement).length || 0,
    }),
    [contentItems],
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "draft":
        return "bg-slate-100 text-slate-600 border-slate-200";
      case "scheduled":
        return "bg-blue-50 text-blue-600 border-blue-200";
      case "published":
        return "bg-emerald-50 text-emerald-600 border-emerald-200";
      case "archived":
        return "bg-amber-50 text-amber-600 border-amber-200";
      case "review":
        return "bg-purple-50 text-purple-600 border-purple-200";
      default:
        return "bg-gray-100 text-gray-600 border-gray-200";
    }
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      draft: "مسودة",
      scheduled: "مجدول",
      published: "منشور",
      archived: "مؤرشف",
      review: "مراجعة",
    };
    return labels[status] || status;
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "post":
        return FileText;
      case "notification":
        return Bell;
      case "campaign":
        return Zap;
      case "template":
        return LayoutGrid;
      default:
        return FileText;
    }
  };

  // Calendar helpers
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const days = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay();
    return { days, firstDay };
  };

  const getScheduledForDay = (day: number) => {
    const date = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      day,
    );
    const dateStr = date.toISOString().split("T")[0];
    return contentItems.filter(
      (item) =>
        item.status === "scheduled" && item.scheduledFor?.startsWith(dateStr),
    );
  };

  const renderDashboard = () => (
    <div className="space-y-8 animate-fadeIn">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="group relative bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-300 hover:-translate-y-1 overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-transparent rounded-full blur-2xl -mr-16 -mt-16 transition-all group-hover:scale-150"></div>
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-4">
              <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/30 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                <FileText size={24} />
              </div>
              <div className="flex items-center gap-1 text-xs font-black px-2.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-50 to-emerald-100 text-emerald-600 border border-emerald-200">
                <TrendingUp size={12} />
                +12%
              </div>
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">
                إجمالي المحتوى
              </p>
              <h2 className="text-3xl font-black text-slate-900">
                {stats.total}
              </h2>
              <p className="text-xs text-slate-400 mt-2 font-bold">
                <span className="text-emerald-500">+3</span> هذا الأسبوع
              </p>
            </div>
          </div>
        </div>

        <div className="group relative bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-2xl hover:shadow-amber-500/10 transition-all duration-300 hover:-translate-y-1 overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-amber-500/10 to-transparent rounded-full blur-2xl -mr-16 -mt-16 transition-all group-hover:scale-150"></div>
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-4">
              <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-600 text-white shadow-lg shadow-amber-500/30 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                <Clock size={24} />
              </div>
              <div className="flex items-center gap-1 text-xs font-black px-2.5 py-1.5 rounded-xl bg-gradient-to-r from-blue-50 to-blue-100 text-blue-600 border border-blue-200">
                <Repeat size={12} />
                {stats.scheduled}
              </div>
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">
                مجدول
              </p>
              <h2 className="text-3xl font-black text-slate-900">
                {stats.scheduled}
              </h2>
              <p className="text-xs text-slate-400 mt-2 font-bold">
                خلال {stats.scheduled > 0 ? "7" : "0"} أيام القادمة
              </p>
            </div>
          </div>
        </div>

        <div className="group relative bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-2xl hover:shadow-emerald-500/10 transition-all duration-300 hover:-translate-y-1 overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-emerald-500/10 to-transparent rounded-full blur-2xl -mr-16 -mt-16 transition-all group-hover:scale-150"></div>
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-4">
              <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-lg shadow-emerald-500/30 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                <CheckCircle size={24} />
              </div>
              <div className="flex items-center gap-1 text-xs font-black px-2.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-50 to-emerald-100 text-emerald-600 border border-emerald-200">
                <TrendingUp size={12} />
                +8%
              </div>
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">
                منشور
              </p>
              <h2 className="text-3xl font-black text-slate-900">
                {stats.published}
              </h2>
              <p className="text-xs text-slate-400 mt-2 font-bold">
                <span className="text-emerald-500">+{stats.published}</span> هذا
                الشهر
              </p>
            </div>
          </div>
        </div>

        <div className="group relative bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-2xl hover:shadow-purple-500/10 transition-all duration-300 hover:-translate-y-1 overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-500/10 to-transparent rounded-full blur-2xl -mr-16 -mt-16 transition-all group-hover:scale-150"></div>
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-4">
              <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 text-white shadow-lg shadow-purple-500/30 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                <Sparkles size={24} />
              </div>
              <div className="flex items-center gap-1 text-xs font-black px-2.5 py-1.5 rounded-xl bg-gradient-to-r from-purple-50 to-purple-100 text-purple-600 border border-purple-200">
                {stats.avgEngagement > 15 ? (
                  <TrendingUp size={12} />
                ) : (
                  <TrendingDown size={12} />
                )}
                {stats.avgEngagement.toFixed(1)}%
              </div>
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">
                متوسط التفاعل
              </p>
              <h2 className="text-3xl font-black text-slate-900">
                {stats.avgEngagement.toFixed(1)}%
              </h2>
              <p className="text-xs text-slate-400 mt-2 font-bold">
                {stats.avgEngagement > 15 ? (
                  <span className="text-emerald-500">أداء ممتاز</span>
                ) : (
                  <span className="text-amber-500">يحتاج تحسين</span>
                )}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* AI Insights Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 relative bg-gradient-to-br from-indigo-600 via-purple-700 to-pink-600 rounded-3xl p-8 text-white shadow-2xl shadow-purple-500/20 overflow-hidden group">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32 transition-all group-hover:scale-110 duration-700"></div>
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-pink-500/20 rounded-full blur-3xl -ml-32 -mb-32 transition-all group-hover:scale-110 duration-700"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg shadow-white/10 group-hover:rotate-12 transition-all duration-300">
                <Brain size={28} />
              </div>
              <div>
                <h3 className="text-xl font-black">رؤى الذكاء الاصطناعي</h3>
                <p className="text-xs text-indigo-200 font-bold uppercase tracking-wider">
                  AI-Powered Insights
                </p>
              </div>
              <div className="mr-auto flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-xl border border-white/10">
                <Activity size={14} className="text-emerald-300" />
                <span className="text-xs font-black">مباشر</span>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="group/card bg-white/10 backdrop-blur-sm rounded-2xl p-5 border border-white/10 hover:bg-white/15 hover:border-white/20 hover:scale-105 transition-all duration-300 cursor-pointer">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-amber-500/20 rounded-xl flex items-center justify-center group-hover/card:scale-110 transition-transform">
                    <Lightbulb size={20} className="text-amber-300" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-black mb-2">أفضل وقت للنشر</p>
                    <p className="text-xs text-indigo-100 leading-relaxed">
                      الساعة 10:00 صباحاً تحقق أعلى تفاعل في قطاع التكنولوجيا
                    </p>
                    <div className="mt-3 flex items-center gap-2 text-xs font-black text-amber-300">
                      <ArrowUpRight size={12} />
                      <span>+25% تفاعل</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="group/card bg-white/10 backdrop-blur-sm rounded-2xl p-5 border border-white/10 hover:bg-white/15 hover:border-white/20 hover:scale-105 transition-all duration-300 cursor-pointer">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-emerald-500/20 rounded-xl flex items-center justify-center group-hover/card:scale-110 transition-transform">
                    <Target size={20} className="text-emerald-300" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-black mb-2">توصية المحتوى</p>
                    <p className="text-xs text-indigo-100 leading-relaxed">
                      المحتوى المرئي يحقق تفاعل أعلى بنسبة 45%
                    </p>
                    <div className="mt-3 flex items-center gap-2 text-xs font-black text-emerald-300">
                      <Star size={12} />
                      <span>موصى به</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-2xl flex items-center justify-center">
                <AlertCircle size={20} className="text-purple-600" />
              </div>
              <h3 className="text-sm font-black text-slate-900">
                يحتاج مراجعة
              </h3>
            </div>
            <span className="text-xs font-black text-purple-600 bg-purple-50 px-3 py-1.5 rounded-xl border border-purple-100">
              {stats.review}
            </span>
          </div>
          <div className="space-y-3">
            {contentItems
              .filter((i) => i.status === "review")
              .slice(0, 3)
              .map((item) => (
                <div
                  key={item.id}
                  className="group/item p-4 bg-gradient-to-r from-purple-50/50 to-pink-50/50 rounded-2xl border border-purple-100 hover:border-purple-300 hover:shadow-md hover:shadow-purple-500/10 transition-all cursor-pointer"
                  onClick={() => setSelectedContent(item)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="text-sm font-bold text-slate-900 line-clamp-1 group-hover/item:text-purple-700 transition-colors">
                      {item.title}
                    </h4>
                    <span className="text-xs font-black text-purple-600 bg-purple-100 px-2 py-1 rounded-lg group-hover/item:scale-105 transition-transform">
                      مراجعة
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-slate-500">
                    <div className="flex items-center gap-1.5">
                      <div className="w-5 h-5 rounded-full bg-purple-100 flex items-center justify-center">
                        <User size={12} className="text-purple-600" />
                      </div>
                      <span>{item.author}</span>
                    </div>
                    <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                    <span className="flex items-center gap-1">
                      <Clock size={10} />
                      {item.createdAt}
                    </span>
                  </div>
                </div>
              ))}
            {stats.review === 0 && (
              <div className="text-center py-8">
                <CheckCircle
                  size={40}
                  className="mx-auto text-emerald-400 mb-3"
                />
                <p className="text-sm font-bold text-slate-500">
                  لا يوجد محتوى يحتاج مراجعة
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recent Content */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-lg transition-all duration-300">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-2xl flex items-center justify-center">
              <History size={20} className="text-blue-600" />
            </div>
            <h3 className="text-sm font-black text-slate-900">آخر المحتوى</h3>
          </div>
          <button
            onClick={() => setActiveTab("library")}
            className="text-xs font-black text-blue-600 hover:bg-blue-50 px-4 py-2 rounded-xl transition-all flex items-center gap-2"
          >
            عرض الكل
            <ChevronLeft size={14} />
          </button>
        </div>
        <div className="divide-y divide-slate-100">
          {contentItems.slice(0, 5).map((item) => {
            const TypeIcon = getTypeIcon(item.type);
            return (
              <div
                key={item.id}
                className="group/item p-4 hover:bg-gradient-to-r hover:from-slate-50 hover:to-blue-50/30 transition-all cursor-pointer"
                onClick={() => setSelectedContent(item)}
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`p-3 rounded-2xl ${getStatusColor(item.status)} group-hover/item:scale-110 group-hover/item:rotate-3 transition-all duration-300`}
                  >
                    <TypeIcon size={18} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-bold text-slate-900 truncate group-hover/item:text-blue-700 transition-colors">
                      {item.title}
                    </h4>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded-lg">
                        {item.category}
                      </span>
                      <span className="text-xs text-slate-300">•</span>
                      <span className="text-xs text-slate-500 flex items-center gap-1">
                        <Calendar size={10} />
                        {item.createdAt}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {item.aiFlags?.engagementScore && (
                      <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-gradient-to-r from-emerald-50 to-emerald-100 border border-emerald-200">
                        <TrendingUp size={10} className="text-emerald-600" />
                        <span className="text-xs font-black text-emerald-700">
                          {item.aiFlags.engagementScore}%
                        </span>
                      </div>
                    )}
                    <span
                      className={`text-xs font-black px-3 py-1.5 rounded-xl border ${getStatusColor(item.status)}`}
                    >
                      {getStatusLabel(item.status)}
                    </span>
                    <ChevronLeft
                      size={16}
                      className="text-slate-300 group-hover/item:text-blue-500 group-hover/item:translate-x-1 transition-all"
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  const renderSchedule = () => {
    const { days, firstDay } = getDaysInMonth(currentMonth);
    const monthNames = [
      "يناير",
      "فبراير",
      "مارس",
      "أبريل",
      "مايو",
      "يونيو",
      "يوليو",
      "أغسطس",
      "سبتمبر",
      "أكتوبر",
      "نوفمبر",
      "ديسمبر",
    ];

    return (
      <div className="space-y-6">
        {/* Calendar Header */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <button
                onClick={() =>
                  setCurrentMonth(
                    new Date(
                      currentMonth.setMonth(currentMonth.getMonth() - 1),
                    ),
                  )
                }
                className="p-2 hover:bg-slate-100 rounded-xl transition-all"
              >
                <ChevronRight size={20} />
              </button>
              <h2 className="text-lg font-black text-slate-900">
                {monthNames[currentMonth.getMonth()]}{" "}
                {currentMonth.getFullYear()}
              </h2>
              <button
                onClick={() =>
                  setCurrentMonth(
                    new Date(
                      currentMonth.setMonth(currentMonth.getMonth() + 1),
                    ),
                  )
                }
                className="p-2 hover:bg-slate-100 rounded-xl transition-all"
              >
                <ChevronLeft size={20} />
              </button>
            </div>
            <button
              onClick={() => setCurrentMonth(new Date())}
              className="text-xs font-black text-blue-600 hover:bg-blue-50 px-4 py-2 rounded-xl transition-all border border-blue-200"
            >
              اليوم
            </button>
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-2">
            {["أحد", "اثنين", "ثلاثاء", "أربعاء", "خميس", "جمعة", "سبت"].map(
              (day) => (
                <div
                  key={day}
                  className="text-center text-xs font-black text-slate-400 uppercase py-2"
                >
                  {day}
                </div>
              ),
            )}

            {Array.from({ length: firstDay }).map((_, i) => (
              <div key={`empty-${i}`} className="aspect-square" />
            ))}

            {Array.from({ length: days }).map((_, i) => {
              const day = i + 1;
              const scheduled = getScheduledForDay(day);
              const isToday =
                day === new Date().getDate() &&
                currentMonth.getMonth() === new Date().getMonth() &&
                currentMonth.getFullYear() === new Date().getFullYear();

              return (
                <div
                  key={day}
                  className={`aspect-square rounded-2xl border-2 p-2 transition-all hover:shadow-md cursor-pointer ${
                    isToday
                      ? "border-blue-500 bg-blue-50"
                      : "border-slate-100 hover:border-blue-200"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span
                      className={`text-sm font-black ${isToday ? "text-blue-600" : "text-slate-700"}`}
                    >
                      {day}
                    </span>
                    {scheduled.length > 0 && (
                      <span className="text-xs font-black text-blue-600 bg-blue-100 w-5 h-5 rounded-lg flex items-center justify-center">
                        {scheduled.length}
                      </span>
                    )}
                  </div>
                  <div className="space-y-1 overflow-y-auto max-h-20">
                    {scheduled.slice(0, 2).map((item) => (
                      <div
                        key={item.id}
                        className="text-[9px] font-bold bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded-md truncate"
                      >
                        {item.title.substring(0, 15)}...
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Upcoming Schedule */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100">
            <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
              <CalendarDays size={18} className="text-blue-500" />
              القادم من المحتوى المجدول
            </h3>
          </div>
          <div className="divide-y divide-slate-100">
            {contentItems
              .filter((i) => i.status === "scheduled")
              .map((item) => (
                <div
                  key={item.id}
                  className="p-4 hover:bg-slate-50 transition-all"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-2xl bg-blue-50 text-blue-600">
                      <Calendar size={18} />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-bold text-slate-900">
                        {item.title}
                      </h4>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-xs text-slate-500 flex items-center gap-1">
                          <Clock size={12} />
                          {item.scheduledFor &&
                            new Date(item.scheduledFor).toLocaleString("ar-SA")}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="p-2 hover:bg-slate-100 rounded-xl transition-all text-slate-400 hover:text-blue-600">
                        <Edit2 size={16} />
                      </button>
                      <button className="p-2 hover:bg-slate-100 rounded-xl transition-all text-slate-400 hover:text-amber-600">
                        <Pause size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    );
  };

  const renderReview = () => {
    const reviewItems = contentItems.filter((i) => i.status === "review");

    return (
      <div className="space-y-6">
        {/* AI Review Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-purple-600 to-indigo-700 rounded-3xl p-6 text-white shadow-xl">
            <div className="flex items-center gap-3 mb-4">
              <Brain size={24} className="text-purple-200" />
              <h3 className="text-sm font-black">تحليل الذكاء الاصطناعي</h3>
            </div>
            <p className="text-3xl font-black mb-2">{reviewItems.length}</p>
            <p className="text-xs text-purple-200">محتوى يحتاج مراجعة</p>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <ShieldAlert size={24} className="text-amber-500" />
              <h3 className="text-sm font-black text-slate-900">
                محتوى مشكوك فيه
              </h3>
            </div>
            <p className="text-3xl font-black text-slate-900 mb-2">0</p>
            <p className="text-xs text-slate-500">لا يوجد محتوى غير لائق</p>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <FileCheck size={24} className="text-emerald-500" />
              <h3 className="text-sm font-black text-slate-900">
                تمت المراجعة
              </h3>
            </div>
            <p className="text-3xl font-black text-slate-900 mb-2">24</p>
            <p className="text-xs text-slate-500">هذا الأسبوع</p>
          </div>
        </div>

        {/* Review Queue */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
              <AlertTriangle size={18} className="text-purple-500" />
              قائمة المراجعة
            </h3>
            <span className="text-xs font-black text-purple-600 bg-purple-50 px-3 py-1.5 rounded-xl">
              {reviewItems.length} عناصر
            </span>
          </div>
          <div className="divide-y divide-slate-100">
            {reviewItems.map((item) => (
              <div
                key={item.id}
                className="p-6 hover:bg-slate-50 transition-all"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="text-base font-black text-slate-900">
                        {item.title}
                      </h4>
                      {item.aiFlags?.engagementScore && (
                        <span
                          className={`text-xs font-black px-2 py-1 rounded-lg ${
                            item.aiFlags.engagementScore >= 80
                              ? "bg-emerald-50 text-emerald-600"
                              : "bg-amber-50 text-amber-600"
                          }`}
                        >
                          توقع التفاعل: {item.aiFlags.engagementScore}%
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-slate-600 mb-4 line-clamp-2">
                      {item.content}
                    </p>

                    {item.aiFlags?.suggestions &&
                      item.aiFlags.suggestions.length > 0 && (
                        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-4">
                          <div className="flex items-center gap-2 mb-2">
                            <Lightbulb size={16} className="text-amber-600" />
                            <span className="text-xs font-black text-amber-700">
                              اقتراحات الذكاء الاصطناعي
                            </span>
                          </div>
                          <ul className="space-y-1">
                            {item.aiFlags.suggestions.map((suggestion, idx) => (
                              <li
                                key={idx}
                                className="text-xs text-amber-700 flex items-center gap-2"
                              >
                                <span className="w-1 h-1 bg-amber-500 rounded-full"></span>
                                {suggestion}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                    <div className="flex items-center gap-4 text-xs text-slate-500">
                      <span className="flex items-center gap-1">
                        <User size={12} />
                        {item.author}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock size={12} />
                        {item.createdAt}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <button className="px-4 py-2 bg-emerald-500 text-white rounded-xl text-sm font-black hover:bg-emerald-600 transition-all flex items-center gap-2">
                      <CheckCircle size={16} />
                      موافقة
                    </button>
                    <button className="px-4 py-2 bg-rose-500 text-white rounded-xl text-sm font-black hover:bg-rose-600 transition-all flex items-center gap-2">
                      <XCircle size={16} />
                      رفض
                    </button>
                    <button className="px-4 py-2 bg-slate-100 text-slate-600 rounded-xl text-sm font-bold hover:bg-slate-200 transition-all flex items-center gap-2">
                      <Edit2 size={16} />
                      تعديل
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderLibrary = () => (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-white rounded-3xl border border-slate-200 p-4 shadow-sm">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex-1 min-w-64 relative">
            <Search
              size={18}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              placeholder="بحث في المحتوى..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pr-10 pl-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            />
          </div>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer"
          >
            <option value="all">جميع الفئات</option>
            <option value="تحليلات السوق">تحليلات السوق</option>
            <option value="تنبيهات">تنبيهات</option>
            <option value="حملات">حملات</option>
            <option value="قوالب">قوالب</option>
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer"
          >
            <option value="all">جميع الحالات</option>
            <option value="draft">مسودة</option>
            <option value="scheduled">مجدول</option>
            <option value="published">منشور</option>
            <option value="archived">مؤرشف</option>
            <option value="review">مراجعة</option>
          </select>

          <div className="flex items-center gap-2 border-r border-slate-200 pr-4 mr-auto">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2.5 rounded-xl transition-all ${viewMode === "grid" ? "bg-blue-50 text-blue-600" : "text-slate-400 hover:bg-slate-100"}`}
            >
              <LayoutGrid size={18} />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2.5 rounded-xl transition-all ${viewMode === "list" ? "bg-blue-50 text-blue-600" : "text-slate-400 hover:bg-slate-100"}`}
            >
              <List size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Content Grid/List */}
      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredContent.map((item) => {
            const TypeIcon = getTypeIcon(item.type);
            return (
              <div
                key={item.id}
                className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm hover:shadow-xl transition-all group cursor-pointer"
                onClick={() => setSelectedContent(item)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div
                    className={`p-3 rounded-2xl ${getStatusColor(item.status)}`}
                  >
                    <TypeIcon size={20} />
                  </div>
                  <button className="p-2 hover:bg-slate-100 rounded-xl transition-all opacity-0 group-hover:opacity-100">
                    <MoreVertical size={16} className="text-slate-400" />
                  </button>
                </div>

                <h3 className="text-sm font-black text-slate-900 mb-2 line-clamp-2">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-500 mb-4 line-clamp-2">
                  {item.content}
                </p>

                <div className="flex items-center gap-2 mb-4 flex-wrap">
                  {item.tags.slice(0, 3).map((tag, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] font-black text-slate-500 bg-slate-100 px-2 py-1 rounded-lg"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                  <div className="flex items-center gap-2">
                    {item.authorAvatar && (
                      <img
                        src={item.authorAvatar}
                        alt={item.author}
                        className="w-6 h-6 rounded-full"
                      />
                    )}
                    <span className="text-xs font-bold text-slate-500">
                      {item.author}
                    </span>
                  </div>
                  <span
                    className={`text-xs font-black px-2 py-1 rounded-lg border ${getStatusColor(item.status)}`}
                  >
                    {getStatusLabel(item.status)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="divide-y divide-slate-100">
            {filteredContent.map((item) => {
              const TypeIcon = getTypeIcon(item.type);
              return (
                <div
                  key={item.id}
                  className="p-4 hover:bg-slate-50 transition-all cursor-pointer"
                  onClick={() => setSelectedContent(item)}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`p-3 rounded-2xl ${getStatusColor(item.status)}`}
                    >
                      <TypeIcon size={18} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-bold text-slate-900 truncate">
                        {item.title}
                      </h4>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-xs text-slate-500">
                          {item.category}
                        </span>
                        <span className="text-xs text-slate-300">•</span>
                        <span className="text-xs text-slate-500">
                          {item.createdAt}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {item.metrics.views && (
                        <span className="text-xs font-bold text-slate-500 flex items-center gap-1">
                          <Eye size={12} />
                          {item.metrics.views.toLocaleString()}
                        </span>
                      )}
                      <span
                        className={`text-xs font-black px-3 py-1.5 rounded-xl border ${getStatusColor(item.status)}`}
                      >
                        {getStatusLabel(item.status)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );

  const renderAnalytics = () => (
    <div className="space-y-8">
      {/* Performance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-2xl bg-blue-50 text-blue-600">
              <Eye size={20} />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase">
                إجمالي المشاهدات
              </p>
              <p className="text-2xl font-black text-slate-900">24,360</p>
            </div>
          </div>
          <div className="flex items-center gap-1 text-xs font-black text-emerald-600">
            <TrendingUp size={12} />
            +18.2% من الشهر الماضي
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-2xl bg-purple-50 text-purple-600">
              <MousePointerClick size={20} />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase">
                إجمالي النقرات
              </p>
              <p className="text-2xl font-black text-slate-900">4,520</p>
            </div>
          </div>
          <div className="flex items-center gap-1 text-xs font-black text-emerald-600">
            <TrendingUp size={12} />
            +12.5% من الشهر الماضي
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-2xl bg-amber-50 text-amber-600">
              <MessageSquare size={20} />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase">
                التعليقات
              </p>
              <p className="text-2xl font-black text-slate-900">892</p>
            </div>
          </div>
          <div className="flex items-center gap-1 text-xs font-black text-rose-600">
            <TrendingDown size={12} />
            -3.2% من الشهر الماضي
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-2xl bg-emerald-50 text-emerald-600">
              <Target size={20} />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase">
                معدل التحويل
              </p>
              <p className="text-2xl font-black text-slate-900">18.5%</p>
            </div>
          </div>
          <div className="flex items-center gap-1 text-xs font-black text-emerald-600">
            <TrendingUp size={12} />
            +5.8% من الشهر الماضي
          </div>
        </div>
      </div>

      {/* Charts Placeholder */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
          <h3 className="text-sm font-black text-slate-900 mb-6 flex items-center gap-2">
            <BarChart3 size={18} className="text-blue-500" />
            اتجاه التفاعل خلال الوقت
          </h3>
          <div className="h-64 bg-gradient-to-b from-blue-50 to-white rounded-2xl flex items-center justify-center border-2 border-dashed border-blue-200">
            <div className="text-center">
              <BarChart3 size={48} className="text-blue-300 mx-auto mb-3" />
              <p className="text-sm font-bold text-slate-400">
                مخطط التفاعل الزمني
              </p>
              <p className="text-xs text-slate-400 mt-1">
                سيتم عرض البيانات هنا
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
          <h3 className="text-sm font-black text-slate-900 mb-6 flex items-center gap-2">
            <PieChart size={18} className="text-purple-500" />
            توزيع المحتوى حسب النوع
          </h3>
          <div className="h-64 bg-gradient-to-b from-purple-50 to-white rounded-2xl flex items-center justify-center border-2 border-dashed border-purple-200">
            <div className="text-center">
              <PieChart size={48} className="text-purple-300 mx-auto mb-3" />
              <p className="text-sm font-bold text-slate-400">
                مخطط توزيع المحتوى
              </p>
              <p className="text-xs text-slate-400 mt-1">
                سيتم عرض البيانات هنا
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Top Performing Content */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100">
          <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
            <TrendingUp size={18} className="text-emerald-500" />
            أفضل المحتوى أداءً
          </h3>
        </div>
        <div className="divide-y divide-slate-100">
          {contentItems
            .filter((i) => i.metrics.views && i.metrics.views > 0)
            .sort((a, b) => (b.metrics.views || 0) - (a.metrics.views || 0))
            .slice(0, 5)
            .map((item, idx) => (
              <div
                key={item.id}
                className="p-4 hover:bg-slate-50 transition-all"
              >
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-center text-sm font-black">
                    {idx + 1}
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-bold text-slate-900">
                      {item.title}
                    </h4>
                    <div className="flex items-center gap-4 mt-1">
                      <span className="text-xs text-slate-500 flex items-center gap-1">
                        <Eye size={12} />
                        {item.metrics.views?.toLocaleString()} مشاهدة
                      </span>
                      <span className="text-xs text-slate-500 flex items-center gap-1">
                        <MousePointerClick size={12} />
                        {item.metrics.clicks?.toLocaleString()} نقرة
                      </span>
                      <span className="text-xs font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-lg">
                        {item.metrics.engagement}% تفاعل
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );

  // Content Detail Modal
  const renderContentModal = () => {
    if (!selectedContent) return null;
    const TypeIcon = getTypeIcon(selectedContent.type);

    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200] flex items-center justify-center p-4 animate-fadeIn">
        <div className="bg-white rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl animate-scaleIn relative">
          {/* Modal Header with Gradient */}
          <div className="relative bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-6">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
            <div className="relative z-10 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div
                  className={`p-3 rounded-2xl bg-white/20 backdrop-blur-sm text-white shadow-lg`}
                >
                  <TypeIcon size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-black text-white">
                    {selectedContent.title}
                  </h2>
                  <div className="flex items-center gap-2 mt-1">
                    <span
                      className={`text-xs font-black px-2 py-0.5 rounded-lg border bg-white/20 backdrop-blur-sm text-white ${getStatusColor(selectedContent.status)}`}
                    >
                      {getStatusLabel(selectedContent.status)}
                    </span>
                    <span className="text-xs text-white/80 font-bold">
                      {selectedContent.category}
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setSelectedContent(null)}
                className="p-2 hover:bg-white/20 rounded-xl transition-all text-white"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                {/* Content Preview */}
                <div className="group bg-gradient-to-br from-slate-50 to-blue-50/30 rounded-2xl p-6 border border-slate-200 hover:border-blue-300 hover:shadow-lg hover:shadow-blue-500/5 transition-all duration-300">
                  <h3 className="text-sm font-black text-slate-900 mb-4 flex items-center gap-2">
                    <Eye size={16} className="text-blue-500" />
                    معاينة المحتوى
                  </h3>
                  <p className="text-sm text-slate-700 leading-relaxed">
                    {selectedContent.content}
                  </p>
                </div>

                {/* Tags */}
                <div>
                  <h3 className="text-sm font-black text-slate-900 mb-3 flex items-center gap-2">
                    <Tag size={16} className="text-slate-400" />
                    الوسوم
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedContent.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="group/tag text-xs font-bold text-slate-600 bg-slate-100 px-3 py-1.5 rounded-xl hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 border border-transparent transition-all cursor-pointer"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* AI Suggestions */}
                {selectedContent.aiFlags?.suggestions &&
                  selectedContent.aiFlags.suggestions.length > 0 && (
                    <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <Lightbulb size={20} className="text-amber-600" />
                        <h3 className="text-sm font-black text-amber-800">
                          اقتراحات الذكاء الاصطناعي
                        </h3>
                      </div>
                      <ul className="space-y-2">
                        {selectedContent.aiFlags.suggestions.map(
                          (suggestion, idx) => (
                            <li
                              key={idx}
                              className="text-sm text-amber-800 flex items-start gap-2"
                            >
                              <span className="w-1.5 h-1.5 bg-amber-500 rounded-full mt-1.5 shrink-0"></span>
                              {suggestion}
                            </li>
                          ),
                        )}
                      </ul>
                    </div>
                  )}
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Author Info */}
                <div className="group bg-white border border-slate-200 rounded-2xl p-4 hover:border-purple-300 hover:shadow-lg hover:shadow-purple-500/5 transition-all duration-300">
                  <h3 className="text-sm font-black text-slate-900 mb-4 flex items-center gap-2">
                    <User size={16} className="text-purple-500" />
                    المؤلف
                  </h3>
                  <div className="flex items-center gap-3">
                    {selectedContent.authorAvatar && (
                      <img
                        src={selectedContent.authorAvatar}
                        alt={selectedContent.author}
                        className="w-12 h-12 rounded-full border-2 border-purple-200 group-hover:border-purple-400 transition-all"
                      />
                    )}
                    <div>
                      <p className="text-sm font-bold text-slate-900">
                        {selectedContent.author}
                      </p>
                      <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                        <Calendar size={10} />
                        {selectedContent.createdAt}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Metrics */}
                {selectedContent.metrics.views &&
                  selectedContent.metrics.views > 0 && (
                    <div className="bg-white border border-slate-200 rounded-2xl p-4 hover:border-emerald-300 hover:shadow-lg hover:shadow-emerald-500/5 transition-all duration-300">
                      <h3 className="text-sm font-black text-slate-900 mb-4 flex items-center gap-2">
                        <BarChart3 size={16} className="text-emerald-500" />
                        الأداء
                      </h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 hover:bg-blue-50 transition-all">
                          <span className="text-xs text-slate-500 flex items-center gap-2">
                            <Eye size={14} className="text-blue-500" />
                            المشاهدات
                          </span>
                          <span className="text-sm font-black text-slate-900">
                            {selectedContent.metrics.views?.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 hover:bg-purple-50 transition-all">
                          <span className="text-xs text-slate-500 flex items-center gap-2">
                            <MousePointerClick
                              size={14}
                              className="text-purple-500"
                            />
                            النقرات
                          </span>
                          <span className="text-sm font-black text-slate-900">
                            {selectedContent.metrics.clicks?.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 hover:bg-emerald-50 transition-all">
                          <span className="text-xs text-slate-500 flex items-center gap-2">
                            <ThumbsUp size={14} className="text-emerald-500" />
                            التفاعل
                          </span>
                          <span className="text-sm font-black text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">
                            {selectedContent.metrics.engagement}%
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                {/* Actions */}
                <div className="space-y-2">
                  <button
                    onClick={() =>
                      addToast("تم تعديل المحتوى بنجاح", "success")
                    }
                    className="w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl text-sm font-black hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-300 flex items-center justify-center gap-2 hover:-translate-y-0.5"
                  >
                    <Edit2 size={16} />
                    تعديل
                  </button>
                  <button
                    onClick={() => addToast("تم نسخ المحتوى", "info")}
                    className="w-full px-4 py-2.5 bg-slate-100 text-slate-700 rounded-xl text-sm font-bold hover:bg-slate-200 transition-all flex items-center justify-center gap-2"
                  >
                    <Copy size={16} />
                    نسخ
                  </button>
                  {selectedContent.status !== "archived" && (
                    <button
                      onClick={() => addToast("تمت أرشفة المحتوى", "info")}
                      className="w-full px-4 py-2.5 bg-amber-50 text-amber-700 rounded-xl text-sm font-bold hover:bg-amber-100 transition-all flex items-center justify-center gap-2"
                    >
                      <Archive size={16} />
                      أرشفة
                    </button>
                  )}
                  <button
                    onClick={() => addToast("هل أنت متأكد من الحذف؟", "error")}
                    className="w-full px-4 py-2.5 bg-rose-50 text-rose-700 rounded-xl text-sm font-bold hover:bg-rose-100 transition-all flex items-center justify-center gap-2"
                  >
                    <Trash2 size={16} />
                    حذف
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 lg:p-10" dir="rtl">
      {/* Loading State */}
      {isLoading && (
        <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-[300] flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
            <p className="text-sm font-black text-slate-600">جاري التحميل...</p>
          </div>
        </div>
      )}

      {/* Toast Notifications */}
      <div className="fixed bottom-6 left-6 z-[300] space-y-3">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`flex items-center gap-3 px-4 py-3 rounded-2xl shadow-2xl animate-slideIn ${
              toast.type === "success"
                ? "bg-emerald-600 text-white"
                : toast.type === "error"
                  ? "bg-rose-600 text-white"
                  : "bg-slate-800 text-white"
            }`}
          >
            {toast.type === "success" && <CheckCircle size={18} />}
            {toast.type === "error" && <AlertCircle size={18} />}
            {toast.type === "info" && <Info size={18} />}
            <span className="text-sm font-bold">{toast.message}</span>
            <button
              onClick={() => removeToast(toast.id)}
              className="mr-2 hover:bg-white/20 rounded-lg p-1 transition-all"
            >
              <X size={14} />
            </button>
          </div>
        ))}
      </div>

      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 relative overflow-hidden bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-3xl p-8 shadow-2xl shadow-blue-500/20">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-pink-500/20 rounded-full blur-3xl -ml-32 -mb-32"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
              <FileCheck size={24} className="text-white" />
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight">
              إدارة المحتوى المتقدم
            </h1>
          </div>
          <p className="text-sm text-white/80 font-bold mt-1">
            المركز الموحد لإنشاء وجدولة ومراجعة وتحليل المحتوى
          </p>
        </div>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="relative group px-6 py-3 bg-white text-blue-600 rounded-2xl text-sm font-black shadow-xl hover:shadow-2xl hover:shadow-white/30 transition-all duration-300 hover:-translate-y-1 flex items-center gap-2 w-fit overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-indigo-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <Plus
            size={18}
            className="relative z-10 group-hover:rotate-90 transition-transform duration-300"
          />
          <span className="relative z-10">إنشاء محتوى جديد</span>
        </button>
      </header>

      {/* Tabs */}
      <div className="flex items-center gap-2 mb-8 bg-white p-2.5 rounded-2xl border border-slate-200 shadow-md shadow-slate-200/50 w-fit">
        <button
          onClick={() => setActiveTab("dashboard")}
          className={`relative px-5 py-3 rounded-xl text-sm font-black transition-all duration-300 ${
            activeTab === "dashboard"
              ? "text-white"
              : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          {activeTab === "dashboard" && (
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl shadow-lg shadow-blue-500/30"></div>
          )}
          <span className="relative z-10 flex items-center gap-2">
            <LayoutDashboard size={16} />
            نظرة عامة
          </span>
        </button>
        <button
          onClick={() => setActiveTab("schedule")}
          className={`relative px-5 py-3 rounded-xl text-sm font-black transition-all duration-300 ${
            activeTab === "schedule"
              ? "text-white"
              : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          {activeTab === "schedule" && (
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl shadow-lg shadow-blue-500/30"></div>
          )}
          <span className="relative z-10 flex items-center gap-2">
            <Calendar size={16} />
            الجدولة
          </span>
        </button>
        <button
          onClick={() => setActiveTab("review")}
          className={`relative px-5 py-3 rounded-xl text-sm font-black transition-all duration-300 ${
            activeTab === "review"
              ? "text-white"
              : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          {activeTab === "review" && (
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl shadow-lg shadow-blue-500/30"></div>
          )}
          <span className="relative z-10 flex items-center gap-2">
            <FileCheck size={16} />
            المراجعة
            {stats.review > 0 && (
              <span className="bg-white/20 px-2 py-0.5 rounded-lg text-xs animate-pulse">
                {stats.review}
              </span>
            )}
          </span>
        </button>
        <button
          onClick={() => setActiveTab("library")}
          className={`relative px-5 py-3 rounded-xl text-sm font-black transition-all duration-300 ${
            activeTab === "library"
              ? "text-white"
              : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          {activeTab === "library" && (
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl shadow-lg shadow-blue-500/30"></div>
          )}
          <span className="relative z-10 flex items-center gap-2">
            <Library size={16} />
            المكتبة
          </span>
        </button>
        <button
          onClick={() => setActiveTab("analytics")}
          className={`relative px-5 py-3 rounded-xl text-sm font-black transition-all duration-300 ${
            activeTab === "analytics"
              ? "text-white"
              : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          {activeTab === "analytics" && (
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl shadow-lg shadow-blue-500/30"></div>
          )}
          <span className="relative z-10 flex items-center gap-2">
            <BarChart3 size={16} />
            التحليلات
          </span>
        </button>
      </div>

      {/* Content */}
      <main>
        {activeTab === "dashboard" && renderDashboard()}
        {activeTab === "schedule" && renderSchedule()}
        {activeTab === "review" && renderReview()}
        {activeTab === "library" && renderLibrary()}
        {activeTab === "analytics" && renderAnalytics()}
      </main>

      {/* Modals */}
      {renderContentModal()}

      {/* Create Content Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200] flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl animate-scaleIn overflow-hidden">
            {/* Modal Header */}
            <div className="relative bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-6">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
              <div className="relative z-10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                    <Plus size={24} className="text-white" />
                  </div>
                  <h2 className="text-xl font-black text-white">
                    إنشاء محتوى جديد
                  </h2>
                </div>
                <button
                  onClick={() => setIsCreateModalOpen(false)}
                  className="p-2 hover:bg-white/20 rounded-xl transition-all text-white"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  نوع المحتوى
                </label>
                <div className="grid grid-cols-4 gap-3">
                  {["post", "notification", "campaign", "template"].map(
                    (type) => (
                      <button
                        key={type}
                        className="group p-4 border-2 border-slate-200 rounded-2xl hover:border-blue-500 hover:bg-gradient-to-br hover:from-blue-50 hover:to-indigo-50 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-blue-500/20"
                      >
                        {type === "post" && (
                          <FileText
                            size={24}
                            className="mx-auto mb-2 text-slate-400 group-hover:text-blue-600 transition-colors"
                          />
                        )}
                        {type === "notification" && (
                          <Bell
                            size={24}
                            className="mx-auto mb-2 text-slate-400 group-hover:text-blue-600 transition-colors"
                          />
                        )}
                        {type === "campaign" && (
                          <Zap
                            size={24}
                            className="mx-auto mb-2 text-slate-400 group-hover:text-blue-600 transition-colors"
                          />
                        )}
                        {type === "template" && (
                          <LayoutGrid
                            size={24}
                            className="mx-auto mb-2 text-slate-400 group-hover:text-blue-600 transition-colors"
                          />
                        )}
                        <span className="text-xs font-bold text-slate-600 group-hover:text-blue-700 transition-colors">
                          {type === "post" && "منشور"}
                          {type === "notification" && "تنبيه"}
                          {type === "campaign" && "حملة"}
                          {type === "template" && "قالب"}
                        </span>
                      </button>
                    ),
                  )}
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                  <Edit2 size={14} className="text-slate-400" />
                  العنوان
                </label>
                <input
                  type="text"
                  placeholder="أدخل العنوان..."
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl text-sm font-bold focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all hover:border-slate-300"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                  <FileText size={14} className="text-slate-400" />
                  المحتوى
                </label>
                <textarea
                  rows={6}
                  placeholder="أكتب المحتوى..."
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl text-sm font-bold focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none transition-all hover:border-slate-300"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                    <Filter size={14} className="text-slate-400" />
                    الفئة
                  </label>
                  <select className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl text-sm font-bold focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer transition-all hover:border-slate-300">
                    <option>اختر الفئة...</option>
                    <option>تحليلات السوق</option>
                    <option>تنبيهات</option>
                    <option>حملات</option>
                    <option>قوالب</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                    <CheckCircle size={14} className="text-slate-400" />
                    الحالة
                  </label>
                  <select className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl text-sm font-bold focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer transition-all hover:border-slate-300">
                    <option>مسودة</option>
                    <option>مجدول</option>
                    <option>منشور</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="px-6 py-3 bg-slate-100 text-slate-700 rounded-xl text-sm font-bold hover:bg-slate-200 hover:shadow-md transition-all duration-300"
              >
                إلغاء
              </button>
              <button
                onClick={() => {
                  addToast("تم إنشاء المحتوى بنجاح", "success");
                  setIsCreateModalOpen(false);
                }}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl text-sm font-black hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-300 hover:-translate-y-0.5"
              >
                إنشاء المحتوى
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdvancedContentManagement;

// Add CSS animations
const style = document.createElement("style");
style.textContent = `
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  
  @keyframes scaleIn {
    from { 
      opacity: 0;
      transform: scale(0.95);
    }
    to { 
      opacity: 1;
      transform: scale(1);
    }
  }
  
  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateX(100%);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }
  
  .animate-fadeIn {
    animation: fadeIn 0.2s ease-out;
  }
  
  .animate-scaleIn {
    animation: scaleIn 0.3s ease-out;
  }
  
  .animate-slideIn {
    animation: slideIn 0.3s ease-out;
  }
`;
if (
  typeof document !== "undefined" &&
  !document.getElementById("content-mgmt-styles")
) {
  style.id = "content-mgmt-styles";
  document.head.appendChild(style);
}
