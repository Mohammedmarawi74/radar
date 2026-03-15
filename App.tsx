
import React, { useState, useEffect, useMemo } from 'react';
import { HashRouter as Router, Routes, Route, useLocation, useNavigate, useSearchParams, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  PieChart,
  Settings,
  Database,
  ShieldCheck,
  LogOut,
  Bell,
  Search,
  Plus,
  X,
  User as UserIcon,
  Activity,
  Globe,
  Link as LinkIcon,
  Star,
  ChevronDown,
  ChevronLeft,
  Clock,
  Filter,
  Zap,
  TrendingUp,
  Home,
  Compass,
  Command,
  Menu,
  Sparkles,
  Users,
  FileText,
  BarChart,
  Layers,
  Shield,
  Eye,
  Archive,
  Cpu,
  CheckSquare,
  Share2,
  Lock,
  MessageSquare,
  Bookmark,
  TrendingDown,
  Monitor,
  Layout,
  Briefcase,
  PenTool,
  Trello,
  Settings as SettingsIcon,
  History,
  ExternalLink,
  BookOpen,
  Palette,
  Image as ImageIcon,
  ClipboardList,
  Terminal,
  ShieldAlert,
  Server,
  LayoutTemplate,
  CreditCard,
  HelpCircle,
  Moon,
  Sun,
  CheckCircle2,
  AlertCircle,
  Info,
  Calendar
} from 'lucide-react';
import {
  UserRole,
  User,
  Dashboard,
  Widget,
  Dataset,
  RefreshLog,
  ChartType,
  TimelineEvent,
  TimelineEventType
} from './types';
import {
  CURRENT_USER,
  DATASETS,
  INITIAL_DASHBOARDS,
  REFRESH_LOGS,
  WIDGETS,
  TIMELINE_EVENTS,
  FEED_ITEMS
} from './constants';
import WidgetCard from './components/WidgetCard';
import TimelineCard from './components/TimelineCard';
import HomeFeed from './components/HomeFeed';
import DatasetContent from './components/DatasetContent';
import DecisionWizard from './components/DecisionWizard';
import UserProfile from './components/UserProfile';
import FollowersPage from './components/FollowersPage';
import AISignalsPage from './components/AISignalsPage';
import OfficialDashboardsPage from './components/OfficialDashboardsPage';
import ExpertBuilderPage from './components/ExpertBuilderPage';
import FavoritesPage from './components/FavoritesPage';
import AIRadarDashboard from './components/AIRadarDashboard';

// --- Safe Navigation Helper ---
interface NavItemProps {
  to: string;
  icon: React.ElementType;
  children: React.ReactNode;
  end?: boolean;
  className?: string;
  badge?: React.ReactNode;
  isCollapsed?: boolean;
  key?: React.Key;
}

const NavItem = ({ to, icon: Icon, children, end = false, className = '', badge = null, isCollapsed = false }: NavItemProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isActive = end ? location.pathname === to : location.pathname.startsWith(to) && (to === '/' ? location.pathname === '/' : true);

  const baseClass = `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group cursor-pointer select-none`;
  const activeClass = `bg-blue-600 text-white shadow-lg shadow-blue-900/40`;
  const inactiveClass = `hover:bg-slate-800 text-slate-400 hover:text-white`;

  return (
    <Link
      to={to}
      className={`${baseClass} ${isActive ? activeClass : inactiveClass} ${className} ${isCollapsed ? 'justify-center px-0' : ''}`}
      title={isCollapsed && typeof children === 'string' ? children : ''}
    >
      {Icon && <Icon size={20} className={`shrink-0 transition-transform duration-200 ${isActive ? "fill-white text-white" : ""} ${isCollapsed ? "group-hover:scale-110" : ""}`} />}
      {!isCollapsed && <span className="truncate">{children}</span>}
      {!isCollapsed && badge}
    </Link>
  );
};

// --- Mobile Bottom Navigation ---
const MobileBottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isPathActive = (path: string, end: boolean = false) => {
    if (end) return location.pathname === path;
    return location.pathname.startsWith(path);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 pb-[env(safe-area-inset-bottom,20px)] bg-white/95 backdrop-blur-lg border-t border-gray-200 z-50 lg:hidden flex justify-around items-start pt-3 px-2 shadow-[0_-4px_20px_-5px_rgba(0,0,0,0.05)] transition-all">
      <Link
        to="/"
        className={`flex flex-col items-center justify-center w-full space-y-1 cursor-pointer active:scale-90 transition-transform duration-200 ${isPathActive('/', true) ? 'text-blue-600' : 'text-gray-400'}`}
      >
        <Compass size={24} strokeWidth={isPathActive('/', true) ? 2.5 : 2} />
        <span className="text-[10px] font-bold">الرئيسية</span>
      </Link>

      <Link
        to="/signals"
        className={`flex flex-col items-center justify-center w-full space-y-1 cursor-pointer active:scale-90 transition-transform duration-200 ${isPathActive('/signals') ? 'text-blue-600' : 'text-gray-400'}`}
      >
        <Zap size={24} strokeWidth={isPathActive('/signals') ? 2.5 : 2} />
        <span className="text-[10px] font-bold">إشارات</span>
      </Link>

      <Link to="/my-dashboards" className="relative -top-8 cursor-pointer active:scale-90 transition-transform duration-200 group">
        <div className="flex items-center justify-center w-14 h-14 bg-blue-600 text-white rounded-full shadow-lg shadow-blue-500/40 border-[4px] border-slate-50 group-hover:bg-blue-700">
          <Plus size={28} />
        </div>
      </Link>

      <Link
        to="/dashboards"
        className={`flex flex-col items-center justify-center w-full space-y-1 cursor-pointer active:scale-90 transition-transform duration-200 ${isPathActive('/dashboards') ? 'text-blue-600' : 'text-gray-400'}`}
      >
        <LayoutDashboard size={24} strokeWidth={isPathActive('/dashboards') ? 2.5 : 2} />
        <span className="text-[10px] font-bold">اللوحات</span>
      </Link>

      <Link
        to="/timeline"
        className={`flex flex-col items-center justify-center w-full space-y-1 cursor-pointer active:scale-90 transition-transform duration-200 ${isPathActive('/timeline') ? 'text-blue-600' : 'text-gray-400'}`}
      >
        <Clock size={24} strokeWidth={isPathActive('/timeline') ? 2.5 : 2} />
        <span className="text-[10px] font-bold">السجل</span>
      </Link>
    </div>
  );
};

// --- NavGroup Helper ---
const NavGroup = ({ title, open, onToggle, children, isCollapsed }: { title: string, open: boolean, onToggle: () => void, children: React.ReactNode, isCollapsed: boolean }) => (
  <div className="mb-2">
    {!isCollapsed && (
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-3 py-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-all mb-1 group"
      >
        <span className="text-[10px] font-bold uppercase tracking-widest group-hover:text-blue-400 transition-colors">{title}</span>
        <ChevronDown size={14} className={`transition-transform duration-300 text-slate-600 group-hover:text-slate-400 ${open ? 'rotate-180' : ''}`} />
      </button>
    )}
    <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isCollapsed ? 'max-h-none opacity-100' : (open ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0')}`}>
      <div className={`space-y-0.5 ${isCollapsed ? 'flex flex-col items-center gap-1.5' : ''}`}>
        {children}
      </div>
    </div>
  </div>
);

// --- Sidebar Component (DYNAMIC RBAC) ---
const Sidebar = ({ role, dashboards, isCollapsed, onToggle }: { role: UserRole, dashboards: Dashboard[], isCollapsed: boolean, onToggle: () => void }) => {
  // Helper for role checks
  const isAtLeast = (target: UserRole) => {
    const hierarchy = [
      UserRole.STANDARD,
      UserRole.ANALYST,
      UserRole.EXPERT,
      UserRole.WRITER,
      UserRole.DESIGNER,
      UserRole.CONTENT_MANAGER,
      UserRole.EDITOR,
      UserRole.ADMIN,
      UserRole.SUPER_ADMIN,
      UserRole.CURBTRON
    ];
    return hierarchy.indexOf(role) >= hierarchy.indexOf(target);
  };

  const isAdmin = isAtLeast(UserRole.ADMIN);
  const isExpert = isAtLeast(UserRole.EXPERT);
  const isAnalyst = isAtLeast(UserRole.ANALYST);
  const isEditor = isAtLeast(UserRole.EDITOR);
  const isWriter = isAtLeast(UserRole.EXPERT);
  const isDesigner = role === UserRole.DESIGNER || isAtLeast(UserRole.ADMIN);
  const isContentManager = role === UserRole.CONTENT_MANAGER || isAtLeast(UserRole.SUPER_ADMIN);
  const isSuperAdmin = isAtLeast(UserRole.SUPER_ADMIN);
  const isCurbTron = role === UserRole.CURBTRON;

  // State for collapsible sections
  const [sections, setSections] = useState({
    discovery: true,
    data: true,
    workspace: true,
    apps: false,
    authoring: true,
    creative: true,
    editorial: true,
    admin: true
  });

  const toggleSection = (key: keyof typeof sections) => {
    setSections(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <aside className={`${isCollapsed ? 'w-20' : 'w-64'} bg-slate-900 text-white h-screen fixed inset-y-0 right-0 hidden lg:flex flex-col shadow-2xl z-[100] overflow-hidden border-l border-slate-800 transition-all duration-300 ease-in-out`}>
      {/* Brand & Toggle */}
      <div className={`p-4 border-b border-slate-800 flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'} bg-slate-950/20 shrink-0 relative group/brand`}>
        {!isCollapsed && (
          <div className="flex items-center gap-3 animate-fadeIn">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Activity size={24} className="text-white" />
            </div>
            <div>
              <h1 className="font-black text-lg tracking-tight leading-none bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">رادار المستثمر</h1>
              <p className="text-[10px] text-blue-400 font-bold uppercase tracking-widest mt-1 opacity-80 underline decoration-blue-500/30 underline-offset-4">Investor Radar</p>
            </div>
          </div>
        )}
        
        <button 
          onClick={onToggle}
          className={`p-2 rounded-xl bg-slate-800/50 hover:bg-blue-600 text-slate-400 hover:text-white transition-all duration-300 border border-slate-700/50 ${isCollapsed ? '' : 'ml-0'}`}
          title={isCollapsed ? "توسيع القائمة" : "طي القائمة"}
        >
          {isCollapsed ? <ChevronLeft size={18} className="rotate-180" /> : <ChevronLeft size={18} />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-3 custom-scrollbar">

        <NavGroup title="المحور الرئيسي" open={sections.discovery} onToggle={() => toggleSection('discovery')} isCollapsed={isCollapsed}>
          <NavItem to="/" icon={Compass} end isCollapsed={isCollapsed}>مركز الاكتشاف</NavItem>
          <NavItem to="/ai-dashboard" icon={Cpu} isCollapsed={isCollapsed}>لوحة الذكاء</NavItem>
          <NavItem to="/signals" icon={Zap} isCollapsed={isCollapsed}>إشارات السوق</NavItem>
          <NavItem to="/timeline" icon={Clock} isCollapsed={isCollapsed}>سجل التغييرات</NavItem>
          <NavItem to="/followers" icon={Users} isCollapsed={isCollapsed}>المجتمع</NavItem>
        </NavGroup>

        <div className="my-2 border-t border-slate-800/40 mx-2"></div>

        <NavGroup title="البيانات والتحليل" open={sections.data} onToggle={() => toggleSection('data')} isCollapsed={isCollapsed}>
          <NavItem to="/dashboards" icon={LayoutDashboard} isCollapsed={isCollapsed}>كل اللوحات</NavItem>
          {isExpert && (
            <NavItem to="/expert-studio" icon={LayoutTemplate} isCollapsed={isCollapsed} className="text-amber-400 hover:text-amber-300 shadow-amber-500/10 hover:shadow-amber-500/20">استوديو الخبراء</NavItem>
          )}
          {isAnalyst && (
            <>
              <NavItem to="/builder" icon={PieChart} isCollapsed={isCollapsed}>بناء اللوحات</NavItem>
              <NavItem to="/queries" icon={Search} isCollapsed={isCollapsed}>المسح البياني</NavItem>
            </>
          )}
        </NavGroup>

        <div className="my-2 border-t border-slate-800/40 mx-2"></div>

        <NavGroup title="مساحتي" open={sections.workspace} onToggle={() => toggleSection('workspace')} isCollapsed={isCollapsed}>
          <NavItem to="/favorites" icon={Bookmark} isCollapsed={isCollapsed}>مفضلتي</NavItem>
          <NavItem to="/my-dashboards" icon={Star} isCollapsed={isCollapsed}>لوحاتي الخاصة</NavItem>
          {!isCollapsed && dashboards.filter(d => d.type === 'user').map(d => (
            <NavItem key={d.id} to={`/my-dashboards?id=${d.id}`} icon={Layout} isCollapsed={isCollapsed} className="pl-8 opacity-70 scale-95 border-l border-slate-700 ml-4">{d.name}</NavItem>
          ))}
        </NavGroup>

        <NavGroup title="التطبيقات" open={sections.apps} onToggle={() => toggleSection('apps')} isCollapsed={isCollapsed}>
          <NavItem to="/profile" icon={UserIcon} isCollapsed={isCollapsed}>ملف المستخدم</NavItem>
          {/* Mock Sub-profiles */}
          {!isCollapsed && (
            <div className="pl-8 flex flex-col gap-1 mt-1 border-l border-slate-700 ml-4 pb-2">
              <div className="text-[11px] text-slate-500 hover:text-white cursor-pointer transition-colors">Personal Profile</div>
              <div className="text-[11px] text-slate-500 hover:text-white cursor-pointer transition-colors">Team Dashboard</div>
            </div>
          )}
        </NavGroup>

        {/* Specialized Roles Groups */}
        {(isWriter || isDesigner || isContentManager || isAdmin) && (
          <div className="my-2 border-t border-slate-800/40 mx-2"></div>
        )}

        {isWriter && (
          <NavGroup title="Authoring Center" open={sections.authoring} onToggle={() => toggleSection('authoring')} isCollapsed={isCollapsed}>
            <NavItem to="/writer/create" icon={PenTool} isCollapsed={isCollapsed}>إنشاء منشور</NavItem>
            <NavItem to="/writer/drafts" icon={BookOpen} isCollapsed={isCollapsed}>مسوداتي</NavItem>
            <NavItem to="/writer/research" icon={Database} isCollapsed={isCollapsed}>المراجع</NavItem>
          </NavGroup>
        )}

        {isDesigner && (
          <NavGroup title="Creative Studio" open={sections.creative} onToggle={() => toggleSection('creative')} isCollapsed={isCollapsed}>
            <NavItem to="/designer/assets" icon={ImageIcon} isCollapsed={isCollapsed}>Asset Manager</NavItem>
            <NavItem to="/designer/upload" icon={Palette} isCollapsed={isCollapsed}>رفع تصاميم</NavItem>
          </NavGroup>
        )}

        {isContentManager && (
          <NavGroup title="Editorial Desk" open={sections.editorial} onToggle={() => toggleSection('editorial')} isCollapsed={isCollapsed}>
            <NavItem to="/editorial/approvals" icon={ClipboardList} isCollapsed={isCollapsed}>مراجعة المحتوى</NavItem>
            <NavItem to="/editorial/schedule" icon={Clock} isCollapsed={isCollapsed}>جدولة المنشورات</NavItem>
          </NavGroup>
        )}

        {isAdmin && (
          <NavGroup title="System Admin" open={sections.admin} onToggle={() => toggleSection('admin')} isCollapsed={isCollapsed}>
            <NavItem to="/admin" icon={Shield} isCollapsed={isCollapsed}>لوحة التحكم</NavItem>
            <NavItem to="/admin/datasets" icon={Database} isCollapsed={isCollapsed}>قواعد البيانات</NavItem>
            {isSuperAdmin && <NavItem to="/super/users" icon={Users} isCollapsed={isCollapsed}>المستخدمين</NavItem>}
            {isCurbTron && <NavItem to="/curbtron/core" icon={Cpu} isCollapsed={isCollapsed}>CurbTron Nexus</NavItem>}
          </NavGroup>
        )}

      </nav>

      {/* Footer */}
      <div className={`p-4 border-t border-slate-800 bg-slate-950/30 backdrop-blur-sm shrink-0 flex ${isCollapsed ? 'justify-center' : ''}`}>
        <button className="flex items-center gap-3 px-3 py-2.5 text-red-400 hover:text-white hover:bg-red-500/10 rounded-lg w-full text-sm font-medium transition-colors border border-transparent hover:border-red-500/20 group">
          <LogOut size={20} className="shrink-0 group-hover:-translate-x-1 transition-transform" />
          {!isCollapsed && <span>تسجيل الخروج</span>}
        </button>
      </div>
    </aside>
  );
};

// --- Topbar Component ---
const MOCK_NOTIFICATIONS = [
  {
    id: 1,
    title: "تنبيه ذكاء اصطناعي",
    desc: "تم اكتشاف حركة غير اعتيادية في أسهم قطاع التكنولوجيا.",
    time: "منذ 5 دقائق",
    type: 'ai',
    unread: true,
    icon: Sparkles,
    color: 'text-blue-500',
    bg: 'bg-blue-50'
  },
  {
    id: 2,
    title: "تقرير سوق جديد",
    desc: "نشر الخبير محمد تقريراً جديداً حول العملات الرقمية.",
    time: "منذ ساعة",
    type: 'expert',
    unread: true,
    icon: LayoutTemplate,
    color: 'text-amber-500',
    bg: 'bg-amber-50'
  },
  {
    id: 3,
    title: "تعديل في القواعد",
    desc: "تم تحديث شروط الاستخدام والخصوصية للمنصة.",
    time: "منذ 3 ساعات",
    type: 'system',
    unread: false,
    icon: ShieldCheck,
    color: 'text-green-500',
    bg: 'bg-green-50'
  },
  {
    id: 4,
    title: "موعد لوحة البيانات",
    desc: "تذكير: موعد تحديث بيانات لوحة التحكم غداً الساعة 9 صباحاً.",
    time: "منذ يوم",
    type: 'event',
    unread: false,
    icon: Clock,
    color: 'text-slate-500',
    bg: 'bg-slate-50'
  }
];

const Topbar = ({ user, onRoleChange, onOpenWizard }: { user: User, onRoleChange: (r: UserRole) => void, onOpenWizard: () => void }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
  
  const menuRef = React.useRef<HTMLDivElement>(null);
  const notificationsRef = React.useRef<HTMLDivElement>(null);
  const location = useLocation();

  const unreadCount = notifications.filter(n => n.unread).length;

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (menuRef.current && !menuRef.current.contains(target)) {
        setIsMenuOpen(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(target)) {
        setIsNotificationsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, unread: false })));
  };

  const getPageInfo = (pathname: string) => {
    if (pathname === '/') return { title: 'مركز الاكتشاف', section: 'الرئيسية' };
    if (pathname.includes('/dashboards')) return { title: 'اللوحات الرسمية', section: 'البيانات' };
    if (pathname.includes('/my-dashboards')) return { title: 'مساحة العمل الخاصة', section: 'لوحاتي' };
    if (pathname.includes('/ai-dashboard')) return { title: 'لوحة الذكاء الاصطناعي', section: 'الذكاء الاصطناعي' };
    if (pathname.includes('/signals')) return { title: 'إشارات السوق', section: 'الذكاء الاصطناعي' };
    if (pathname.includes('/timeline')) return { title: 'سجل التغييرات', section: 'المتابعة' };
    if (pathname.includes('/followers')) return { title: 'اكتشاف المتابعين', section: 'المجتمع' };
    if (pathname.includes('/admin')) return { title: 'إدارة النظام', section: 'Admin' };
    if (pathname.includes('/dataset')) return { title: 'تفاصيل البيانات', section: 'الستكشاف' };
    if (pathname.includes('/builder')) return { title: 'Dashboard Builder', section: 'تحليل' };
    if (pathname.includes('/queries')) return { title: 'الاستعلامات', section: 'تحليل' };
    if (pathname.includes('/profile')) return { title: 'ملف المستخدم', section: 'التطبيقات' };
    return { title: 'لوحة التحكم', section: 'رادار' };
  };

  const { title, section } = getPageInfo(location.pathname);

  const MenuItem = ({ icon: Icon, label, danger = false }: { icon: any, label: string, danger?: boolean }) => (
    <div className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all cursor-pointer group/item ${danger ? 'hover:bg-red-50 text-red-500 hover:text-red-600' : 'hover:bg-slate-50 text-slate-600 hover:text-blue-600'}`}>
      <div className={`p-2 rounded-lg transition-colors ${danger ? 'bg-red-50 group-hover/item:bg-red-100' : 'bg-slate-100 group-hover/item:bg-blue-50'}`}>
        <Icon size={16} className={danger ? 'text-red-500' : 'text-slate-500 group-hover/item:text-blue-600'} />
      </div>
      <span className="text-sm font-bold tracking-tight">{label}</span>
    </div>
  );

  return (
    <header className="h-[72px] lg:h-[84px] sticky top-0 z-[90] w-full bg-white/80 backdrop-blur-xl border-b border-slate-200/60 transition-all duration-300">
      <div className="px-6 lg:px-12 h-full flex items-center justify-between gap-8">

        {/* --- Section 1: Page Context (Breadcrumbs) --- */}
        <div className="flex items-center gap-6 min-w-[200px]">
          {/* Mobile Logo Only */}
          <div className="lg:hidden group cursor-pointer">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <Activity size={22} className="text-white" />
            </div>
          </div>

          <div className="hidden sm:flex flex-col gap-0.5">
            <div className="flex items-center gap-2 text-[11px] font-black text-slate-400 uppercase tracking-[0.1em]">
              <Home size={12} className="mb-0.5" />
              <span>{section}</span>
              <ChevronLeft size={10} className="text-slate-300" />
            </div>
            <h2 className="text-xl font-black text-slate-900 tracking-tight leading-tight">
              {title}
            </h2>
          </div>
        </div>

        {/* --- Section 2: Centered Global Search --- */}
        <div className="flex-1 max-w-2xl hidden md:block group">
          <div className="relative">
            <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
              <Search className="w-4.5 h-4.5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
            </div>
            <input
              type="text"
              className="block w-full py-3 pr-12 pl-16 text-sm text-slate-900 bg-slate-100/50 border border-slate-200/50 rounded-[18px] focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 focus:bg-white transition-all placeholder-slate-400 shadow-sm hover:border-slate-300"
              placeholder="ابحث عن أي شيء في المنصة... (تقارير، مستخدمين، بيانات)"
            />
            <div className="absolute inset-y-0 left-0 flex items-center pl-4">
              <div className="flex items-center gap-1.5 px-2 py-1 bg-white border border-slate-200 rounded-lg shadow-sm">
                <Command size={11} className="text-slate-400" />
                <span className="text-[10px] font-black text-slate-400 tracking-wider">K</span>
              </div>
            </div>
          </div>
        </div>

        {/* --- Section 3: User Actions & Profile --- */}
        <div className="flex items-center gap-4 lg:gap-8">
          
          <div className="flex items-center bg-slate-100/50 p-1.5 rounded-2xl border border-slate-200/30">
            {/* Notifications */}
            <div className="relative" ref={notificationsRef}>
              <button 
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                className={`p-2.5 rounded-xl transition-all ${isNotificationsOpen ? 'bg-white text-blue-600 shadow-sm border-slate-200' : 'text-slate-500 hover:text-blue-600 hover:bg-white'}`}
              >
                <Bell size={20} className={isNotificationsOpen ? '' : 'group-hover:animate-swing'} />
                {unreadCount > 0 && (
                  <span className="absolute top-2 right-2 w-4 h-4 bg-red-600 border-2 border-white rounded-full flex items-center justify-center text-[9px] font-black text-white">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notifications Panel */}
              {isNotificationsOpen && (
                <div className="absolute left-[-20px] lg:left-0 mt-5 w-[340px] lg:w-[400px] bg-white rounded-[28px] shadow-[0_30px_70px_-15px_rgba(0,0,0,0.15)] border border-slate-200 overflow-hidden animate-scaleIn origin-top-left z-[110]">
                  <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                    <h3 className="text-sm font-black text-slate-900">مركز الإشعارات</h3>
                    <button onClick={markAllAsRead} className="text-[11px] font-bold text-blue-600 hover:bg-blue-50 px-2 py-1 rounded-lg transition-all">تحديد الكل كقروء</button>
                  </div>
                  <div className="max-h-[420px] overflow-y-auto custom-scrollbar">
                    {notifications.map((n) => (
                      <div key={n.id} className={`p-4 hover:bg-slate-50 transition-all cursor-pointer flex gap-4 ${n.unread ? 'bg-blue-50/20' : ''}`}>
                        <div className={`w-11 h-11 ${n.bg} rounded-xl flex items-center justify-center shrink-0 border border-white`}><n.icon size={18} className={n.color} /></div>
                        <div className="flex-1 text-right">
                          <div className="flex items-center justify-between mb-0.5">
                            <h4 className="text-[13px] font-black text-slate-900 truncate">{n.title}</h4>
                            <span className="text-[9px] font-bold text-slate-400">{n.time}</span>
                          </div>
                          <p className="text-[11px] font-bold text-slate-500 leading-relaxed line-clamp-1">{n.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="p-3 bg-slate-50/50 border-t border-slate-100 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest cursor-pointer hover:text-blue-600 transition-colors">عرض جميع التنبيهات</div>
                </div>
              )}
            </div>

            <div className="w-px h-6 bg-slate-200 mx-1 opacity-50"></div>

            {/* Help/Settings Quick Icon */}
            <button className="p-2.5 text-slate-500 hover:text-blue-600 hover:bg-white rounded-xl transition-all">
              <HelpCircle size={20} />
            </button>
          </div>

          {/* User Profile Hook */}
          <div className="relative" ref={menuRef}>
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="flex items-center gap-3 p-1.5 hover:bg-white rounded-2xl transition-all border border-transparent hover:border-slate-100 hover:shadow-lg hover:shadow-slate-100/50"
            >
              <div className="relative">
                <img src={user.avatar} alt="User" className="w-10 h-10 rounded-xl border-2 border-white shadow-md object-cover" />
                <div className="absolute -bottom-1 -left-1 w-4 h-4 bg-green-500 border-4 border-white rounded-full"></div>
              </div>
              <ChevronDown size={14} className={`text-slate-400 transition-transform duration-300 ${isMenuOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu */}
            {isMenuOpen && (
              <div className="absolute left-0 mt-3 w-72 bg-white rounded-[28px] shadow-[0_30px_70px_-15px_rgba(0,0,0,0.15)] border border-slate-200 p-2 animate-scaleIn origin-top-left z-[110]">
                <div className="p-4 bg-slate-50 rounded-[22px] mb-2 flex items-center gap-4">
                  <img src={user.avatar} alt="User" className="w-12 h-12 rounded-2xl border-2 border-white shadow-md object-cover" />
                  <div className="text-right flex-1 min-w-0">
                    <p className="text-sm font-black text-slate-900 truncate">{user.name}</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{user.role}</p>
                  </div>
                </div>
                <div className="space-y-0.5">
                  <MenuItem icon={UserIcon} label="الملف الشخصي" />
                  <MenuItem icon={Settings} label="الإعدادات" />
                  <MenuItem icon={Bookmark} label="مفضلتي" />
                  <div className="h-px bg-slate-100 mx-3 my-2"></div>
                  <MenuItem icon={LogOut} label="تسجيل الخروج" danger />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};



// --- Page: User Dashboards ---
const MyDashboards = ({
  dashboards,
  widgets,
  currentUser,
  onCreate,
  onAddWidget,
  onAddExternalWidget,
  onRemoveWidget
}: {
  dashboards: Dashboard[],
  widgets: Widget[],
  currentUser: User,
  onCreate: (name: string) => void,
  onAddWidget: (dashId: string, widgetId: string) => void,
  onAddExternalWidget: (dashId: string, idOrUrl: string, title?: string, desc?: string) => void,
  onRemoveWidget: (dashId: string, widgetId: string) => void
}) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const paramId = searchParams.get('id');

  const initialId = (paramId && dashboards.find(d => d.id === paramId)) ? paramId : dashboards[0]?.id || '';
  const [activeTab, setActiveTab] = useState(initialId);

  const [isModalOpen, setModalOpen] = useState(false);
  const [newDashName, setNewDashName] = useState('');
  const [isWidgetLibraryOpen, setWidgetLibraryOpen] = useState(false);

  const [externalInput, setExternalInput] = useState('');
  const [externalTitle, setExternalTitle] = useState('');
  const [externalDesc, setExternalDesc] = useState('');
  const [externalError, setExternalError] = useState('');

  const activeDashboard = dashboards.find(d => d.id === activeTab);
  const canAddUrl = currentUser.role === UserRole.ADMIN || currentUser.role === UserRole.EXPERT || currentUser.role === UserRole.ANALYST;

  useEffect(() => {
    if (paramId && dashboards.some(d => d.id === paramId)) {
      setActiveTab(paramId);
    } else if (!activeDashboard && dashboards.length > 0) {
      setActiveTab(dashboards[0].id);
    }
  }, [paramId, dashboards, activeDashboard]);

  const handleTabChange = (id: string) => {
    setActiveTab(id);
    setSearchParams({ id });
  }

  const handleExternalSubmit = () => {
    setExternalError('');
    if (!externalInput) {
      setExternalError('الرجاء إدخال المعرف أو الرابط');
      return;
    }

    const isUrl = externalInput.startsWith('http');

    if (isUrl && !canAddUrl) {
      setExternalError('عذراً، إضافة روابط خارجية غير متاح لصلاحياتك الحالية.');
      return;
    }

    if (isUrl && !externalTitle) {
      setExternalError('الرجاء تحديد عنوان للمؤشر الخارجي');
      return;
    }

    if (activeDashboard) {
      onAddExternalWidget(activeDashboard.id, externalInput, externalTitle, externalDesc);
      setExternalInput('');
      setExternalTitle('');
      setExternalDesc('');
      setWidgetLibraryOpen(false);
    }
  };

  if (dashboards.length === 0) {
    return (
      <div className="p-8 flex flex-col items-center justify-center h-[80vh]">
        <div className="bg-blue-50 p-6 rounded-full mb-4">
          <PieChart size={48} className="text-blue-500" />
        </div>
        <h2 className="text-xl font-bold text-gray-900">ليس لديك أي لوحات خاصة</h2>
        <p className="text-gray-500 mt-2 mb-6 text-center max-w-md">قم بإنشاء لوحة خاصة بك وقم بإضافة المؤشرات التي تهمك لمتابعتها بشكل دوري.</p>
        <button
          onClick={() => setModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl shadow-lg shadow-blue-500/30 flex items-center gap-2 transition-all"
        >
          <Plus size={20} />
          إنشاء لوحة جديدة
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto p-4 lg:p-8">
      <div className="flex justify-between items-start mb-6 lg:mb-8">
        <div>
          <h2 className="text-xl lg:text-2xl font-bold text-gray-900">لوحاتي</h2>
          <p className="text-sm text-gray-500 mt-1">تخصيص البيانات حسب اهتماماتك</p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 flex items-center gap-2 shadow-sm font-medium transition-colors text-sm"
        >
          <Plus size={18} />
          لوحة جديدة
        </button>
      </div>

      <div className="flex border-b border-gray-200 mb-6 overflow-x-auto gap-1 no-scrollbar">
        {dashboards.map(d => (
          <button
            key={d.id}
            onClick={() => handleTabChange(d.id)}
            className={`px-6 py-3 text-sm font-medium border-b-2 transition-all whitespace-nowrap hover:bg-gray-50 rounded-t-lg ${activeTab === d.id ? 'border-blue-600 text-blue-600 bg-blue-50/50' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
          >
            {d.name}
          </button>
        ))}
      </div>

      {activeDashboard && (
        <>
          <div className="mb-6 flex justify-end">
            <button
              onClick={() => setWidgetLibraryOpen(true)}
              className="flex items-center gap-2 text-sm text-blue-600 hover:bg-blue-50 px-3 py-2 rounded-lg transition-colors font-medium border border-blue-100 w-full md:w-auto justify-center"
            >
              <Plus size={16} /> إضافة Widget للوحة
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6 min-h-[300px] pb-4">
            {activeDashboard.widgets.length === 0 ? (
              <div className="col-span-full border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center p-12 text-gray-400 bg-gray-50/50">
                <Plus size={40} className="mb-2 opacity-50" />
                <p>هذه اللوحة فارغة. أضف بعض البيانات!</p>
              </div>
            ) : (
              activeDashboard.widgets.map(widgetId => {
                const widget = widgets.find(w => w.id === widgetId);
                return widget ? (
                  <WidgetCard
                    key={widget.id}
                    widget={widget}
                    role={currentUser.role}
                    isCustomDashboard={true}
                    onRemove={() => onRemoveWidget(activeDashboard.id, widget.id)}
                  />
                ) : null;
              })
            )}
          </div>
        </>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl animate-scaleIn">
            <h3 className="text-lg font-bold mb-4">إنشاء لوحة جديدة</h3>
            <input
              autoFocus
              type="text"
              value={newDashName}
              onChange={(e) => setNewDashName(e.target.value)}
              placeholder="اسم اللوحة"
              className="w-full border border-gray-300 rounded-lg p-3 mb-6 focus:ring-2 focus:ring-blue-500 outline-none"
            />
            <div className="flex justify-end gap-3">
              <button onClick={() => setModalOpen(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">إلغاء</button>
              <button
                onClick={() => {
                  if (newDashName) {
                    onCreate(newDashName);
                    setNewDashName('');
                    setModalOpen(false);
                  }
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                إنشاء
              </button>
            </div>
          </div>
        </div>
      )}

      {isWidgetLibraryOpen && activeDashboard && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-4xl h-[85vh] flex flex-col shadow-2xl animate-scaleIn">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <div>
                <h3 className="text-xl font-bold text-gray-800">مكتبة المؤشرات</h3>
                <p className="text-sm text-gray-500">اختر المؤشرات لإضافتها إلى "{activeDashboard.name}"</p>
              </div>
              <button onClick={() => setWidgetLibraryOpen(false)} className="p-2 hover:bg-gray-100 rounded-full"><X size={20} /></button>
            </div>

            <div className="p-6 overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 flex-1 content-start">
              {widgets.filter(w => !activeDashboard.widgets.includes(w.id) && w.type !== ChartType.EXTERNAL).map(widget => (
                <div key={widget.id} className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm hover:border-blue-400 transition-all flex justify-between items-center h-24">
                  <div>
                    <h4 className="font-bold text-gray-800 line-clamp-1">{widget.title}</h4>
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded mt-2 inline-block">{widget.category}</span>
                  </div>
                  <button
                    onClick={() => {
                      onAddWidget(activeDashboard.id, widget.id);
                      setWidgetLibraryOpen(false);
                    }}
                    className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full shadow-lg shadow-blue-500/30"
                  >
                    <Plus size={20} />
                  </button>
                </div>
              ))}
            </div>

            <div className="p-6 border-t border-gray-100 bg-gray-50 rounded-b-2xl">
              <button onClick={() => setWidgetLibraryOpen(false)} className="w-full bg-gray-100 p-2 rounded text-gray-600 hover:bg-gray-200">إغلاق</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// --- Page: Market Signals ---
const SignalsPage = ({ events }: { events: TimelineEvent[] }) => {
  const signalEvents = events.filter(e => e.type === TimelineEventType.SIGNAL || e.type === TimelineEventType.INSIGHT);
  const featured = signalEvents.find(e => e.impactScore > 75) || signalEvents[0];
  const list = signalEvents.filter(e => e.id !== featured?.id);

  return (
    <div className="max-w-7xl mx-auto p-4 lg:p-8">
      <div className="mb-6 lg:mb-8">
        <h2 className="text-xl lg:text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Zap className="text-amber-500" fill="currentColor" />
          إشارات السوق الذكية
        </h2>
        <p className="text-sm lg:text-base text-gray-500 mt-1">تحليل فوري لأهم الفرص والمخاطر في السوق</p>
      </div>

      {featured && (
        <div className="mb-6 bg-slate-900 rounded-xl md:rounded-2xl p-4 md:p-6 text-white shadow-lg relative overflow-hidden group cursor-pointer transition-transform hover:scale-[1.01]">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl -mr-32 -mt-32"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <span className="bg-amber-500 text-slate-900 text-xs font-bold px-2 py-1 rounded-md">
                FEATURED SIGNAL
              </span>
              <span className="text-slate-400 text-xs flex items-center gap-1">
                <Clock size={12} /> {new Date(featured.timestamp).toLocaleDateString('ar-SA')}
              </span>
            </div>
            <h3 className="text-2xl lg:text-3xl font-bold mb-4 leading-snug">{featured.title}</h3>
            <p className="text-slate-300 text-base lg:text-lg mb-6 max-w-3xl leading-relaxed opacity-90 line-clamp-3 lg:line-clamp-none">{featured.summary}</p>
            <div className="flex items-center gap-6 border-t border-slate-700/50 pt-6">
              <div>
                <p className="text-[10px] text-slate-400 uppercase tracking-widest">الأثر</p>
                <div className="flex items-center gap-1">
                  <span className="text-xs font-bold text-amber-500">{featured.impactScore}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 lg:gap-6 pb-4">
        {list.map(ev => (
          <TimelineCard key={ev.id} event={ev} />
        ))}
      </div>
    </div>
  )
}

// --- Page: Timeline ---
const TimelinePage = ({ events }: { events: TimelineEvent[] }) => {
  const [filterType, setFilterType] = useState<string>('ALL');

  const filteredEvents = useMemo(() => {
    if (filterType === 'ALL') return events;
    return events.filter(e => e.type === filterType);
  }, [events, filterType]);

  const filterOptions = [
    { id: 'ALL', label: 'الكل' },
    { id: TimelineEventType.NEW_DATA, label: 'بيانات' },
    { id: TimelineEventType.SIGNAL, label: 'إشارات' },
    { id: TimelineEventType.INSIGHT, label: 'رؤى' },
    { id: TimelineEventType.REVISION, label: 'تعديلات' },
  ];

  return (
    <div className="max-w-7xl mx-auto p-4 lg:p-8">
      <div className="mb-6 lg:mb-8">
        <h2 className="text-xl lg:text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
          <Clock className="text-blue-600" />
          سجل التغييرات
        </h2>
        <p className="text-sm lg:text-base text-gray-500 mt-2 lg:text-lg">
          تابع آخر التحديثات والإشارات الاقتصادية لحظة بلحظة.
        </p>
      </div>

      <div className="flex overflow-x-auto no-scrollbar pb-2 items-center gap-2 mb-6 lg:mb-8 bg-white p-2 rounded-xl shadow-sm border border-gray-100 lg:w-fit sticky top-[60px] lg:top-[72px] z-30 mx-[-16px] px-4 lg:static lg:mx-0 lg:px-2">
        {filterOptions.map(opt => (
          <button
            key={opt.id}
            onClick={() => setFilterType(opt.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${filterType === opt.id
              ? 'bg-slate-800 text-white shadow-md'
              : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 border border-gray-200 lg:border-none'
              }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      <div className="space-y-4 lg:space-y-6 relative before:absolute before:inset-0 before:mr-6 before:-ml-px before:w-0.5 before:bg-gradient-to-b before:from-gray-200 before:to-transparent before:hidden md:before:block pb-4">
        {filteredEvents.map((event) => (
          <div key={event.id} className="relative animate-fadeIn">
            <TimelineCard event={event} />
          </div>
        ))}
      </div>
    </div>
  );
};

// --- Main App Component ---
const App = () => {
  const [currentUser, setCurrentUser] = useState(CURRENT_USER);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => {
    const saved = localStorage.getItem('sidebarCollapsed');
    return saved === 'true';
  });

  const [userDashboards, setUserDashboards] = useState<Dashboard[]>(() => {
    const saved = localStorage.getItem('userDashboards');
    return saved ? JSON.parse(saved) : INITIAL_DASHBOARDS.filter(d => d.type === 'user');
  });

  useEffect(() => {
    localStorage.setItem('sidebarCollapsed', String(isSidebarCollapsed));
  }, [isSidebarCollapsed]);
  const [allWidgets, setAllWidgets] = useState<Widget[]>(WIDGETS);
  const [isWizardOpen, setIsWizardOpen] = useState(false);

  const navigate = useNavigate();
  const officialDashboards = INITIAL_DASHBOARDS.filter(d => d.type === 'official');
  const allDashboards = [...officialDashboards, ...userDashboards];

  useEffect(() => {
    localStorage.setItem('userDashboards', JSON.stringify(userDashboards));
  }, [userDashboards]);

  const handleCreateDashboard = (name: string) => {
    const newDash: Dashboard = {
      id: `udb-${Date.now()}`,
      name: name,
      type: 'user',
      widgets: [],
      ownerId: currentUser.id
    };
    setUserDashboards([...userDashboards, newDash]);
  };

  const handleAddWidget = (dashId: string, widgetId: string) => {
    setUserDashboards(prev => prev.map(d => {
      if (d.id === dashId && !d.widgets.includes(widgetId)) {
        return { ...d, widgets: [...d.widgets, widgetId] };
      }
      return d;
    }));
  };

  const handleAddExternalWidget = (dashId: string, idOrUrl: string, title?: string, desc?: string) => {
    const existingWidget = allWidgets.find(w => w.id === idOrUrl);
    if (existingWidget) {
      handleAddWidget(dashId, existingWidget.id);
      return;
    }
    if (idOrUrl.startsWith('http')) {
      const newWidget: Widget = {
        id: `ext-${Date.now()}`,
        title: title || 'مؤشر خارجي',
        type: ChartType.EXTERNAL,
        datasetId: 'external',
        category: 'External',
        tags: ['Custom', 'Metabase'],
        lastRefresh: new Date().toISOString().split('T')[0],
        description: desc || 'بيانات مستوردة من مصدر خارجي',
        data: [],
        embedUrl: idOrUrl
      };
      setAllWidgets(prev => [...prev, newWidget]);
      handleAddWidget(dashId, newWidget.id);
    }
  };

  const handleRemoveWidget = (dashId: string, widgetId: string) => {
    setUserDashboards(prev => prev.map(d => {
      if (d.id === dashId) {
        return { ...d, widgets: d.widgets.filter(w => w !== widgetId) };
      }
      return d;
    }));
  };

  const handleRoleChange = (role: UserRole) => {
    setCurrentUser({ ...currentUser, role });
  };

  const handlePublishDashboard = (name: string, desc: string, widgetIds: string[]) => {
    const newDash: Dashboard = {
      id: `odb_new_${Date.now()}`,
      name: name,
      type: 'official', // Staged as official/public
      widgets: widgetIds,
      ownerId: currentUser.id,
      description: desc,
      isPublic: true
    };
    // In a real app, this would send to API. Here we just add to userDashboards for demo
    // or ideally to OFFICIAL_DASHBOARDS but that is a constant. 
    // We will add to userDashboards but treat it visually as "Published"
    setUserDashboards([...userDashboards, newDash]);
    alert(`تم نشر اللوحة "${name}" بنجاح! يمكن للجمهور الآن رؤيتها.`);
  };

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans overflow-x-hidden" dir="rtl">
      <Sidebar 
        role={currentUser.role} 
        dashboards={allDashboards} 
        isCollapsed={isSidebarCollapsed}
        onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />

      {/* Main Layout Adjustments for Mobile and Collapsible Sidebar */}
      <main className={`flex-1 transition-all duration-300 pb-24 lg:pb-0 ${isSidebarCollapsed ? 'lg:mr-20' : 'lg:mr-64'} min-w-0`}>
        <Topbar
          user={currentUser}
          onRoleChange={handleRoleChange}
          onOpenWizard={() => setIsWizardOpen(true)}
        />
        <div className="animate-fadeIn">
          <Routes>
            <Route path="/" element={<HomeFeed feedItems={FEED_ITEMS} user={currentUser} onOpenWizard={() => setIsWizardOpen(true)} />} />
            <Route path="/ai-dashboard" element={<AIRadarDashboard />} />
            <Route path="/dashboards" element={<OfficialDashboardsPage dashboards={officialDashboards} widgets={allWidgets} userRole={currentUser.role} />} />
            <Route path="/signals" element={<AISignalsPage />} />
            <Route path="/timeline" element={<TimelinePage events={TIMELINE_EVENTS} />} />
            <Route path="/followers" element={<FollowersPage />} />
            <Route path="/profile" element={<UserProfile />} />
            <Route path="/favorites" element={<FavoritesPage />} />

            {/* Expert Studio */}
            <Route path="/expert-studio" element={
              <ExpertBuilderPage allWidgets={allWidgets} onPublishDashboard={handlePublishDashboard} />
            } />

            <Route path="/my-dashboards" element={
              <MyDashboards
                dashboards={userDashboards}
                widgets={allWidgets}
                currentUser={currentUser}
                onCreate={handleCreateDashboard}
                onAddWidget={handleAddWidget}
                onAddExternalWidget={handleAddExternalWidget}
                onRemoveWidget={handleRemoveWidget}
              />
            } />
            <Route path="/dataset/:id" element={<DatasetContent dataset={DATASETS[0]} onBack={() => navigate('/')} role={currentUser.role} />} />
            {/* New Routes */}
            <Route path="/builder" element={<div className="p-10 text-center text-gray-400">Dashboard Builder (Analyst+)</div>} />
            <Route path="/queries" element={<div className="p-10 text-center text-gray-400">SQL/Visual Queries (Analyst+)</div>} />
            <Route path="/analysis" element={<div className="p-10 text-center text-gray-400">Data Analysis Tools (Analyst+)</div>} />
            <Route path="/verification" element={<div className="p-10 text-center text-gray-400">Data Verification (Expert+)</div>} />
            <Route path="/admin" element={<div className="p-10 text-center text-gray-400">Admin Dashboard</div>} />

            <Route path="*" element={<div className="p-10 text-center text-gray-400">جاري العمل على هذه الصفحة...</div>} />
          </Routes>
        </div>
      </main>

      <DecisionWizard isOpen={isWizardOpen} onClose={() => setIsWizardOpen(false)} />
      <MobileBottomNav />
    </div>
  );
};

const RootApp = () => (
  <Router>
    <App />
  </Router>
)

export default RootApp;
