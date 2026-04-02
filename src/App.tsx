
import React, { useState, useEffect, useMemo } from 'react';
import { HashRouter as Router, Routes, Route, useLocation, useNavigate, useSearchParams, Link } from 'react-router-dom';
import { InvestmentSimulator } from './components/simulator/InvestmentSimulator';
import {
  LayoutDashboard,
  Calculator,
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
  Calendar,
  ListFilter,
  BarChart3,
  Lightbulb,
  GitCompare,
  Fingerprint,
  Download,
  Radio,
  Tags,
  FilePlus,
  Brush,
  Library,
  Microscope,
  GraduationCap,
  FileBarChart,
  Code,
  Users2,
  Settings2,
  ChevronUp,
  Target,
  Map as MapIcon,
  ChevronRight,
  Ghost,
  Building2,
  MapPin
} from 'lucide-react';
import SmartCityDuel from './components/SmartCityDuel';
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
} from './constants/constants';
import WidgetCard from './components/WidgetCard';
import TimelineCard from './components/TimelineCard';
import HomeFeed from './components/HomeFeed';
import DatasetContent from './components/DatasetContent';
import DecisionWizard from './components/DecisionWizard';
import UserProfile from './components/UserProfile';
import FollowersPage from './components/FollowersPage';
import AISignalsPage from './components/AISignalsPage';
import OfficialDashboardsPage from './components/OfficialDashboardsPage';
import DatasetExplorerPage from './components/DatasetExplorerPage';
// Removed OfficialPanelsPage import
import ExpertBuilderPage from './components/ExpertBuilderPage';
import FavoritesPage from './components/FavoritesPage';
import AIRadarDashboard from './components/AIRadarDashboard';
import SmartRadarPage from './components/SmartRadarPage';
import TimelinePage from './components/TimelinePage';
import MapDashboard from './components/MapDashboard';
import { ToastProvider } from './components/Toast';
import GuidedTours from './components/GuidedTours';
import HelpCenterPage from './components/HelpCenterPage';
import AdminNotificationsPage from './components/AdminNotificationsPage';
import SubscriptionsManagement from './components/admin/SubscriptionsManagement';
import AdminOverviewPage from './components/AdminOverviewPage';
import SmartComparisonsPage from './components/SmartComparisonsPage';
import DataSourcesPage from './components/DataSourcesPage';
import AIEconomicDashboard from './components/AIEconomicDashboard';
import AdvancedContentManagement from './components/AdvancedContentManagement';
import DashboardTest from './components/DashboardTest';
import CityAnalytics from './components/CityAnalytics';

// --- Safe Navigation Helper ---
interface NavItemProps {
  to: string;
  icon: React.ElementType;
  children: React.ReactNode;
  end?: boolean;
  className?: string;
  badge?: React.ReactNode;
  isCollapsed?: boolean;
  important?: boolean;
  id?: string;
  key?: React.Key;
}

const NavItem = ({ to, icon: Icon, children, end = false, className = '', badge = null, isCollapsed = false, important = false, id }: NavItemProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isActive = useMemo(() => {
    const currentFull = location.pathname + location.search;
    if (end) return currentFull === to;
    
    // Exact match for routes with tabs
    if (to.includes('?')) {
      return currentFull === to;
    }
    
    // Pathprefix match for standard routes
    return location.pathname.startsWith(to) && (to === '/' ? location.pathname === '/' : true);
  }, [location.pathname, location.search, to, end]);

  if (isCollapsed && !important) return null;

  const baseClass = `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium font-['IBM_Plex_Sans_Arabic'] transition-all duration-200 group cursor-pointer select-none`;
  const activeClass = `bg-blue-600 text-white shadow-lg shadow-blue-900/40`;
  const inactiveClass = `hover:bg-slate-800 text-slate-400 hover:text-white`;

  return (
    <Link
      to={to}
      id={id}
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
const NavGroup = ({ 
  title, 
  open, 
  onToggle, 
  children, 
  isCollapsed, 
  icon: Icon 
}: { 
  title: string, 
  open: boolean, 
  onToggle: () => void, 
  children: React.ReactNode, 
  isCollapsed: boolean,
  icon?: any
}) => {
  // Check if any child is an 'important' NavItem
  const hasImportantChildren = React.Children.toArray(children).some(
    (child: any) => child?.props?.important === true
  );

  if (isCollapsed && !hasImportantChildren) return null;

  return (
    <div className="mb-1">
      {!isCollapsed ? (
        <button
          onClick={onToggle}
          className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all group ${open ? 'bg-slate-800/40' : 'hover:bg-slate-800/30'}`}
        >
          <div className="flex items-center gap-2.5">
            {Icon && <Icon size={16} className={`transition-colors ${open ? 'text-blue-400' : 'text-slate-500'}`} />}
            <span className={`text-[11px] font-black font-['IBM_Plex_Sans_Arabic'] uppercase tracking-wider transition-colors ${open ? 'text-blue-400' : 'text-slate-400 group-hover:text-slate-200'}`}>{title}</span>
          </div>
          <ChevronDown 
            size={14} 
            className={`transition-all duration-300 text-slate-600 group-hover:text-slate-400 ${open ? 'rotate-180 text-blue-400' : ''}`} 
          />
        </button>
      ) : (
        <div className="h-px bg-slate-800/20 my-4 mx-4"></div>
      )}
      <div className={`overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] ${isCollapsed ? 'max-h-none opacity-100' : (open ? 'max-h-[1000px] opacity-100 mt-1' : 'max-h-0 opacity-0')}`}>
        <div className={`space-y-0.5 ${isCollapsed ? 'flex flex-col items-center gap-1.5' : 'pr-2'}`}>
          {children}
        </div>
      </div>
    </div>
  );
};

// --- Sidebar Component (DYNAMIC RBAC) ---
const Sidebar = ({ role, dashboards, isCollapsed, onToggle }: { 
  role: UserRole, 
  dashboards: Dashboard[], 
  isCollapsed: boolean, 
  onToggle: () => void
}) => {
  const location = useLocation();
  const isAdminPath = location.pathname.startsWith('/admin') ||
                      location.pathname.startsWith('/ai-dashboard') ||
                      location.pathname.startsWith('/data-review') ||
                      location.pathname.startsWith('/reports') ||
                      location.pathname.startsWith('/metadata') ||
                      location.pathname.startsWith('/advanced-content') ||
                      ['/editorial', '/campaigns', '/moderation', '/tags', '/media', '/create-post', '/my-posts', '/design-studio'].some(p => location.pathname.startsWith(p));

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
    overview: true,
    data: true,
    content: true,
    tools: true,
    admin: true,
    notifications: true,
    cities: false
  });

  const toggleSection = (key: keyof typeof sections) => {
    setSections(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <aside 
      style={{ fontFamily: "'IBM Plex Sans Arabic', sans-serif" }}
      className={`${isCollapsed ? 'w-20' : 'w-[280px]'} ${isAdminPath ? 'bg-[#09090b] border-l-amber-500/30' : 'bg-slate-950 border-l-slate-800/50'} text-white h-screen fixed inset-y-0 right-0 hidden lg:flex flex-col shadow-2xl z-[100] overflow-hidden border-l transition-all duration-500 ease-in-out`}>
      {/* Brand & Toggle */}
      <div id="sidebar-brand" className={`p-4 px-5 border-b border-white/5 flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'} ${isAdminPath ? 'bg-zinc-950/50' : 'bg-slate-950'} shrink-0 relative group/brand transition-colors duration-500`}>
        {!isCollapsed && (
          <div className="flex items-center gap-2 animate-fadeIn text-right">
            <div className={`w-8 h-8 ${isAdminPath ? 'bg-gradient-to-br from-amber-500 to-orange-700 shadow-amber-500/20' : 'bg-gradient-to-br from-blue-600 to-indigo-700 shadow-blue-500/20'} rounded-lg flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-500`}>
              <Activity size={18} className="text-white" />
            </div>
            <div>
              <h1 className="font-black text-[15px] tracking-tight leading-none bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">رادار المستثمر</h1>
              <p className={`text-[8px] ${isAdminPath ? 'text-amber-500' : 'text-blue-500'} font-extrabold uppercase tracking-widest mt-1 opacity-80 transition-colors duration-500`}>
                {isAdminPath ? 'ADMIN' : 'RADAR'}
              </p>
            </div>
          </div>
        )}
        
        <button 
          onClick={onToggle}
          className={`p-1.5 rounded-lg border transition-all duration-300 ${isAdminPath ? 'bg-zinc-900 border-zinc-800 text-amber-500 hover:bg-amber-500 hover:text-white hover:border-amber-400' : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white hover:bg-blue-600 hover:border-blue-500'}`}
          title={isCollapsed ? "توسيع القائمة" : "طي القائمة"}
        >
          <ChevronLeft size={16} className={`transition-transform duration-300 ${isCollapsed ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-4 custom-scrollbar space-y-2">

        {!isAdminPath ? (
          <>
            {/* --- Standard Mode: Dashboard & Overview --- */}
            <NavGroup title="المحور الرئيسي" open={sections.overview} onToggle={() => toggleSection('overview')} isCollapsed={isCollapsed} icon={LayoutDashboard}>
              <NavItem id="nav-home" to="/" icon={Home} end isCollapsed={isCollapsed} important>الصفحة الرئيسية</NavItem>
              <NavItem id="nav-signals" to="/signals" icon={Zap} isCollapsed={isCollapsed} important>إشارات السوق</NavItem>
              <NavItem id="nav-radar" to="/smart-radar" icon={Target} isCollapsed={isCollapsed} important>أدوات التحليل الذكي</NavItem>
              <NavItem id="nav-simulator" to="/simulator" icon={Calculator} isCollapsed={isCollapsed} important>محاكي الاستثمار</NavItem>
              <NavItem id="nav-dashboard-test" to="/dashboard-test" icon={Monitor} isCollapsed={isCollapsed} important>لوحة اختبار البيانات</NavItem>
              <NavItem id="nav-timeline" to="/timeline" icon={Clock} isCollapsed={isCollapsed}>سجل التغييرات</NavItem>
              <NavItem id="nav-followers" to="/followers" icon={Users} isCollapsed={isCollapsed}>المجتمع</NavItem>
            </NavGroup>

            <NavGroup title="تحليل المدن الاستثماري" open={sections.cities} onToggle={() => toggleSection('cities')} isCollapsed={isCollapsed} icon={Building2}>
              <NavItem to="/city-duel" icon={GitCompare} isCollapsed={isCollapsed} important>مواجهة المدن الذكية</NavItem>
              <div className="h-px bg-slate-800/20 mx-4 my-1"></div>
              {["الرياض", "جدة", "بريدة", "مكة المكرمة", "المدينة المنورة", "الدمام", "حائل", "الهفوف", "الخبر", "حفر الباطن", "الطائف", "الخرج", "تبوك", "عرعر", "أبها", "نجران", "خميس مشيط", "عنيزة", "المزاحمية", "جيزان", "الدوادمي", "سكاكا", "الجبيل", "بقعاء", "القطيف"].map(city => (
                <NavItem key={city} to={`/city/${city}`} icon={MapPin} isCollapsed={isCollapsed}>{city}</NavItem>
              ))}
            </NavGroup>

            <div className="h-px bg-slate-800/50 mx-2 my-2"></div>

            {/* --- Standard Mode: Data & Analytics --- */}
            <NavGroup title="البيانات والتحليل" open={sections.data} onToggle={() => toggleSection('data')} isCollapsed={isCollapsed} icon={BarChart3}>
              <NavItem id="nav-smart-radar" to="/dashboards?tab=smart" icon={Sparkles} isCollapsed={isCollapsed} important>لوحات الرادار الذكية</NavItem>
              <NavItem id="nav-official-radar" to="/dashboards?tab=official" icon={LayoutTemplate} isCollapsed={isCollapsed}>لوحات الرادار الرسمية</NavItem>
              <NavItem id="nav-my-dashboards" to="/my-dashboards" icon={Layout} isCollapsed={isCollapsed}>لوحاتي الخاصة</NavItem>
              <NavItem id="nav-sector-boards" to="/sector-boards" icon={ListFilter} isCollapsed={isCollapsed}>لوحات حسب القطاع</NavItem>
              <NavItem id="nav-industry" to="/industry" icon={Briefcase} isCollapsed={isCollapsed}>الصناعة</NavItem>
              <NavItem id="nav-recommendations" to="/recommendations" icon={Lightbulb} isCollapsed={isCollapsed}>التوصيات الذكية</NavItem>
              <NavItem id="nav-comparisons" to="/comparisons" icon={GitCompare} isCollapsed={isCollapsed}>المقارنات الذكية</NavItem>
              <NavItem id="nav-patterns" to="/patterns" icon={Fingerprint} isCollapsed={isCollapsed}>اكتشاف الأنماط</NavItem>
              <NavItem id="nav-sources" to="/sources" icon={Database} isCollapsed={isCollapsed}>مصادر البيانات</NavItem>
              <NavItem id="nav-economic" to="/economic-dashboard" icon={TrendingUp} isCollapsed={isCollapsed}>الملخص الاقتصادي</NavItem>
              <NavItem id="nav-stats" to="/stats" icon={TrendingUp} isCollapsed={isCollapsed}>إحصائيات المنصة</NavItem>
              <NavItem id="nav-export" to="/export" icon={Download} isCollapsed={isCollapsed}>تصدير البيانات</NavItem>
            </NavGroup>

            {/* --- Standard Mode: Build Tools --- */}
            <NavGroup title="أدوات البناء" open={sections.tools} onToggle={() => toggleSection('tools')} isCollapsed={isCollapsed} icon={Settings}>
              <NavItem id="nav-builder" to="/builder" icon={PieChart} isCollapsed={isCollapsed}>بناء اللوحات</NavItem>
              <NavItem id="nav-indicators" to="/indicators" icon={Library} isCollapsed={isCollapsed}>مكتبة المؤشرات</NavItem>
              <NavItem id="nav-survey" to="/survey" icon={Microscope} isCollapsed={isCollapsed}>المسح البياني</NavItem>
              <NavItem id="nav-expert-studio" to="/expert-studio" icon={GraduationCap} isCollapsed={isCollapsed}>استوديو الخبراء</NavItem>
              <NavItem id="nav-help" to="/help" icon={HelpCircle} isCollapsed={isCollapsed}>مركز المساعدة</NavItem>
            </NavGroup>
          </>
        ) : (
          <>
            {/* --- Admin Mode: Content Management --- */}
            <NavGroup title="إدارة المحتوى" open={sections.content} onToggle={() => toggleSection('content')} isCollapsed={isCollapsed} icon={FileText}>
              <NavItem id="nav-advanced-content" to="/advanced-content" icon={Layers} isCollapsed={isCollapsed} important>إدارة المحتوى المتقدم</NavItem>
              <NavItem id="nav-review" to="/editorial/review" icon={Eye} isCollapsed={isCollapsed}>مراجعة المحتوى</NavItem>
              <NavItem id="nav-campaigns" to="/campaigns" icon={Radio} isCollapsed={isCollapsed}>الحملات التفاعلية</NavItem>
              <NavItem id="nav-moderation" to="/moderation" icon={MessageSquare} isCollapsed={isCollapsed}>إشراف التعليقات</NavItem>
              <NavItem id="nav-tags" to="/tags" icon={Tags} isCollapsed={isCollapsed}>إدارة الوسوم</NavItem>
              <NavItem id="nav-media" to="/media" icon={ImageIcon} isCollapsed={isCollapsed}>مكتبة الوسائط</NavItem>
              <NavItem id="nav-create-post" to="/create-post" icon={FilePlus} isCollapsed={isCollapsed} important>إنشاء منشور</NavItem>
              <NavItem id="nav-my-posts" to="/my-posts" icon={FileText} isCollapsed={isCollapsed}>منشوراتي</NavItem>
              <NavItem id="nav-design-studio" to="/design-studio" icon={Brush} isCollapsed={isCollapsed}>استوديو التصميم</NavItem>
            </NavGroup>

            {isAdmin && (
              <>
                <div className="h-px bg-slate-800/50 mx-2 my-2"></div>
                
                {/* --- Admin Mode: Notification Management (New) --- */}
                <NavGroup title="إدارة الإشعارات" open={sections.notifications} onToggle={() => toggleSection('notifications')} isCollapsed={isCollapsed} icon={Bell}>
                  <NavItem id="nav-admin-notifications" to="/admin/notifications?tab=integrations" icon={Bell} isCollapsed={isCollapsed} important>لوحة التحكم بالتنبيهات</NavItem>
                  <NavItem id="nav-notification-templates" to="/admin/notifications?tab=templates" icon={LayoutTemplate} isCollapsed={isCollapsed}>قوالب الإشعارات</NavItem>
                  <NavItem id="nav-notification-analytics" to="/admin/notifications?tab=analytics" icon={BarChart3} isCollapsed={isCollapsed}>الإحصائيات والتقارير</NavItem>
                  <NavItem id="nav-notification-audit" to="/admin/notifications?tab=audit" icon={History} isCollapsed={isCollapsed}>سجل العمليات</NavItem>
                </NavGroup>

                <div className="h-px bg-slate-800/20 mx-3 my-2"></div>

                {/* --- Admin Mode: Admin Sections --- */}
                <NavGroup title="الإدارة العامة" open={sections.admin} onToggle={() => toggleSection('admin')} isCollapsed={isCollapsed} icon={ShieldAlert}>
                  <NavItem id="nav-admin" to="/admin" icon={LayoutDashboard} isCollapsed={isCollapsed} important>لوحة التحكم الإدارية</NavItem>
                  <NavItem id="nav-ai-dashboard" to="/ai-dashboard" icon={Cpu} isCollapsed={isCollapsed} important>لوحة الذكاء</NavItem>
                  <NavItem id="nav-admin-users" to="/admin/users" icon={Users2} isCollapsed={isCollapsed} important>إدارة المستخدمين</NavItem>
                  <NavItem id="nav-admin-subscriptions" to="/admin/subscriptions" icon={CreditCard} isCollapsed={isCollapsed} important>الاشتراكات والترخيص</NavItem>
                  <NavItem id="nav-admin-activity" to="/admin/activity" icon={History} isCollapsed={isCollapsed}>سجل العمليات</NavItem>
                  <NavItem id="nav-admin-settings" to="/admin/settings" icon={Settings2} isCollapsed={isCollapsed}>إعدادات النظام</NavItem>
                  <div className="h-px bg-slate-800/20 mx-3 my-2"></div>
                  <NavItem to="/data-review" icon={Shield} isCollapsed={isCollapsed}>مراجعة البيانات</NavItem>
                  <NavItem to="/reports" icon={FileBarChart} isCollapsed={isCollapsed}>التقارير المخصصة</NavItem>
                  <NavItem to="/metadata" icon={Code} isCollapsed={isCollapsed}>البيانات الوصفية</NavItem>
                </NavGroup>
              </>
            )}
          </>
        )}
      </nav>

      {/* Footer: Admin Mode Toggle instead of Logout */}
      <div className={`p-4 border-t border-slate-800 bg-slate-950/30 shrink-0 flex ${isCollapsed ? 'justify-center' : ''}`}>
        <Link 
          to={isAdminPath ? "/" : "/admin"}
          className={`${isCollapsed ? 'w-12 h-12 justify-center px-0' : 'w-full px-4'} flex items-center gap-0 lg:gap-3 py-3 rounded-xl transition-all font-bold text-sm ${isAdminPath ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/20' : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700'}`}
          title={isCollapsed ? (isAdminPath ? 'العودة للمنصة' : 'لوحة التحكم') : ''}
        >
          <div className={`p-1.5 rounded-lg ${isAdminPath ? 'bg-amber-400' : 'bg-slate-700'} flex items-center justify-center shrink-0`}>
            {isAdminPath ? <Activity size={18} /> : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
                <path d="M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            )}
          </div>
          {!isCollapsed && (
            <span className="truncate mr-3">{isAdminPath ? 'العودة للمنصة' : 'لوحة التحكم'}</span>
          )}
        </Link>
      </div>
    </aside>
  );
};

// --- Topbar Component ---
const MOCK_NOTIFICATIONS = [
  {
    id: 1,
    title: "فرصة تقنية عاجلة",
    desc: "تم اكتشاف حركة سيولة استثنائية في أسهم قطاع التكنولوجيا (AAPL, MSFT) تشير لانفجار سعري وشيك.",
    time: "متوفر الآن",
    type: 'ai',
    priority: 'critical',
    unread: true,
    path: '/signals',
    icon: Sparkles,
    color: 'text-rose-500',
    bg: 'bg-rose-50'
  },
  {
    id: 2,
    title: "تقرير سوق جديد",
    desc: "نشر الخبير محمد تقريراً جديداً حول العملات الرقمية وتحليل البيتكوين للمرحلة القادمة.",
    time: "منذ ساعة",
    type: 'expert',
    priority: 'high',
    unread: true,
    path: '/expert-studio',
    icon: LayoutTemplate,
    color: 'text-blue-500',
    bg: 'bg-blue-50'
  },
  {
    id: 3,
    title: "تحديث أمني للنظام",
    desc: "سيتم إجراء صيانة دورية لمنصة التداول غداً في الساعة 3 صباحاً بتوقيت مكة المكرمة.",
    time: "منذ 3 ساعات",
    type: 'system',
    priority: 'medium',
    unread: false,
    path: '/timeline',
    icon: ShieldCheck,
    color: 'text-emerald-500',
    bg: 'bg-emerald-50'
  },
  {
    id: 4,
    title: "مؤتمر المستثمرين السنوي",
    desc: "لا تفوت فرصة الحضور الافتراضي لمؤتمر رادار المستثمر السنوي لمناقشة مستقبل السوق السعودي.",
    time: "منذ 5 ساعات",
    type: 'event',
    priority: 'medium',
    unread: false,
    path: '/followers',
    icon: Calendar,
    color: 'text-amber-500',
    bg: 'bg-amber-50'
  },
  {
    id: 5,
    title: "تحليل سيولة استثنائي",
    desc: "تحذير: تم رصد خروج سيولة كبيرة من قطاع البنوك قد يؤثر على المؤشر العام في الجلسات القادمة.",
    time: "منذ 8 ساعات",
    type: 'analysis',
    priority: 'critical',
    unread: true,
    path: '/smart-radar',
    icon: Activity,
    color: 'text-purple-500',
    bg: 'bg-purple-50'
  }
];

// --- Breadcrumbs Component ---
const Breadcrumbs = () => {
  const location = useLocation();
  const path = location.pathname;

  const getBreadcrumbs = (pathname: string) => {
    const crumbs = [{ label: 'الرئيسية', path: '/', icon: Home }];
    
    if (pathname === '/') return crumbs;

    if (pathname.includes('/ai-dashboard')) {
      crumbs.push({ label: 'لوحة التحكم', path: '/admin', icon: LayoutDashboard });
      crumbs.push({ label: 'لوحة الذكاء', path: '', icon: Sparkles });
    } else if (pathname.includes('/smart-radar')) {
      crumbs.push({ label: 'المحور الرئيسي', path: '', icon: Target });
      crumbs.push({ label: 'لوحات الرادار الذكية', path: '', icon: Target });
    } else if (pathname.includes('/signals')) {
      crumbs.push({ label: 'الذكاء الاصطناعي', path: '/ai-dashboard', icon: Sparkles });
      crumbs.push({ label: 'إشارات السوق', path: '', icon: Activity });
    } else if (pathname.includes('/dashboards')) {
      crumbs.push({ label: 'البيانات', path: '/dashboards', icon: Layers });
      crumbs.push({ label: 'اللوحات الرسمية', path: '', icon: LayoutTemplate });
    } else if (pathname.includes('/timeline')) {
      crumbs.push({ label: 'المتابعة', path: '/timeline', icon: Clock });
      crumbs.push({ label: 'سجل التغييرات', path: '', icon: Activity });
    } else if (pathname.includes('/followers')) {
      crumbs.push({ label: 'المجتمع', path: '/followers', icon: UserIcon });
      crumbs.push({ label: 'المتابعيـن', path: '', icon: UserIcon });
    } else if (pathname.includes('/profile')) {
      crumbs.push({ label: 'المستخدم', path: '/profile', icon: UserIcon });
      crumbs.push({ label: 'الملف الشخصي', path: '', icon: UserIcon });
    } else if (pathname.includes('/favorites')) {
      crumbs.push({ label: 'المستخدم', path: '', icon: UserIcon });
      crumbs.push({ label: 'المفضلة', path: '', icon: Bookmark });
    } else if (pathname.includes('/admin')) {
      crumbs.push({ label: 'لوحة التحكم الإدارية', path: '/admin', icon: ShieldAlert });
      if (pathname === '/admin/notifications') {
        crumbs.push({ label: 'إدارة التنبيهات', path: '', icon: Bell });
      }
    } else if (pathname.includes('/advanced-content')) {
      crumbs.push({ label: 'لوحة التحكم الإدارية', path: '/admin', icon: ShieldAlert });
      crumbs.push({ label: 'إدارة المحتوى المتقدم', path: '', icon: Layers });
    } else if (pathname.includes('/simulator')) {
      crumbs.push({ label: 'المحور الرئيسي', path: '', icon: Target });
      crumbs.push({ label: 'محاكي الاستثمار', path: '', icon: Calculator });
    } else {
      crumbs.push({ label: 'لوحة التحكم', path: '', icon: LayoutTemplate });
    }

    return crumbs;
  };

  const crumbs = getBreadcrumbs(path);

  return (
    <div className="flex items-center gap-1.5 px-2">
      {crumbs.map((crumb, idx) => (
        <div key={idx} className="flex items-center gap-1 group whitespace-nowrap">
          {idx > 0 && <ChevronLeft size={8} className="text-slate-300 mx-0.5" />}
          
          {crumb.path ? (
            <Link 
              to={crumb.path}
              className="flex items-center gap-1 text-slate-500 hover:text-blue-600 transition-all text-[9px] font-bold"
            >
              <crumb.icon size={10} className="text-slate-400 group-hover:text-blue-500 transition-colors" />
              <span>{crumb.label}</span>
            </Link>
          ) : (
            <div className="flex items-center gap-1 text-slate-900 text-[9px] font-black">
              <crumb.icon size={10} className="text-blue-600" />
              <span>{crumb.label}</span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

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

  const MenuItem = ({ icon: Icon, label, to, danger = false }: { icon: any, label: string, to?: string, danger?: boolean }) => {
    const content = (
      <div className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all cursor-pointer group/item ${danger ? 'hover:bg-red-50 text-red-500 hover:text-red-600' : 'hover:bg-slate-50 text-slate-600 hover:text-blue-600'}`}>
        <div className={`p-2 rounded-lg transition-colors ${danger ? 'bg-red-50 group-hover/item:bg-red-100' : 'bg-slate-100 group-hover/item:bg-blue-50'}`}>
          <Icon size={16} className={danger ? 'text-red-500' : 'text-slate-500 group-hover/item:text-blue-600'} />
        </div>
        <span className="text-sm font-bold tracking-tight">{label}</span>
      </div>
    );

    if (to) {
      return (
        <Link to={to} onClick={() => setIsMenuOpen(false)} className="block no-underline">
          {content}
        </Link>
      );
    }

    return content;
  };

  return (
    <header className="h-[44px] lg:h-[37px] sticky top-0 z-[90] w-full bg-white/80 backdrop-blur-xl border-b border-slate-200/60 transition-all duration-300">
      <div className="px-6 lg:px-12 h-full flex items-center justify-between gap-4 pt-1.5">

        {/* --- Section 1: Logo (Mobile) --- */}
        <div className="flex items-center gap-4">
          {/* Mobile Logo Only */}
          <div className="lg:hidden group cursor-pointer">
            <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <Activity size={16} className="text-white" />
            </div>
          </div>
          
          <div className="hidden lg:block shrink-0">
            <h1 className="text-xs font-black text-slate-900 tracking-tight">رادار المستثمر</h1>
          </div>
        </div>

        {/* --- Section 2: Breadcrumbs & Search --- */}
        <div className="flex-1 flex items-center gap-2 max-w-4xl hidden md:flex">
          {/* Integrated Breadcrumbs */}
          <Breadcrumbs />

          {/* Search Box */}
          <div className="flex-1 group">
            <div className="relative">
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                <Search className="w-3 h-3 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
              </div>
              <input
                id="header-search"
                type="text"
                className="block w-full h-8 pr-8 pl-10 text-[9px] text-slate-900 bg-slate-100/50 border border-slate-200/50 rounded-lg focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 focus:bg-white transition-all placeholder-slate-400 shadow-sm hover:border-slate-300"
                placeholder="ابحث..."
              />
            </div>
          </div>

          <GuidedTours />
        </div>

        {/* --- Section 3: User Actions & Profile --- */}
        <div className="flex items-center gap-3 lg:gap-4">
          
          <div className="flex items-center bg-slate-100/50 p-1 rounded-xl border border-slate-200/30">
            {/* Favorites */}
            <Link to="/favorites"
              className="p-1 text-slate-500 hover:text-blue-600 hover:bg-white rounded-md transition-all"
              title="مفضلتي"
            >
              <Bookmark size={13} />
            </Link>

            <div className="w-px h-3 bg-slate-200 mx-1 opacity-50"></div>

            {/* Notifications */}
            <div className="relative" ref={notificationsRef}>
              <button 
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                className={`p-1 rounded-md transition-all ${isNotificationsOpen ? 'bg-white text-blue-600 shadow-sm border-slate-200' : 'text-slate-500 hover:text-blue-600 hover:bg-white'}`}
              >
                <Bell size={13} className={isNotificationsOpen ? '' : 'group-hover:animate-swing'} />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-600 border border-white rounded-full flex items-center justify-center text-[6px] font-black text-white">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notifications Panel */}
              {isNotificationsOpen && (
                <div className="absolute left-0 lg:left-0 mt-5 w-[360px] lg:w-[420px] bg-white rounded-[32px] shadow-[0_40px_80px_-15px_rgba(0,0,0,0.18)] border border-slate-200 overflow-hidden animate-scaleIn origin-top-left z-[110]">
                  <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-white relative">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-slate-900 rounded-2xl flex items-center justify-center text-white shadow-lg"><Bell size={20} /></div>
                      <div>
                        <h3 className="text-sm font-black text-slate-900">مركز التنبيهات الذكي</h3>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Investor Radar Notifications</p>
                      </div>
                    </div>
                    <button onClick={markAllAsRead} className="text-[11px] font-black text-blue-600 hover:bg-blue-50 px-3 py-1.5 rounded-xl transition-all border border-blue-50 hover:border-blue-100 shadow-sm shadow-blue-500/5">تحديد الكل كقروء</button>
                  </div>
                  <div className="max-h-[460px] overflow-y-auto custom-scrollbar bg-slate-50/30">
                    {notifications.length > 0 ? notifications.map((n) => (
                      <Link 
                        to={n.path || '#'} 
                        key={n.id} 
                        onClick={() => setIsNotificationsOpen(false)}
                        className={`p-5 m-2 mb-3 rounded-3xl border transition-all flex gap-4 relative overflow-hidden group/item ${n.unread ? 'bg-white border-blue-200 shadow-xl shadow-blue-500/5' : 'bg-white/50 border-slate-100 opacity-80'}`}
                      >
                        {/* Status Pulse for Unread */}
                        {n.unread && (
                          <div className="absolute top-4 left-4">
                            <span className="relative flex h-2 w-2">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                            </span>
                          </div>
                        )}

                        <div className={`w-14 h-14 ${n.bg} rounded-2xl flex items-center justify-center shrink-0 border-2 border-white shadow-sm transition-transform group-hover/item:scale-110`}>
                          <n.icon size={22} className={n.color} />
                        </div>
                        <div className="flex-1 text-right">
                          <div className="flex items-center justify-between mb-1">
                            <h4 className={`text-[13px] font-black ${n.unread ? 'text-slate-900' : 'text-slate-600'} transition-colors`}>{n.title}</h4>
                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tight">{n.time}</span>
                          </div>
                          <p className="text-[11px] font-medium text-slate-500 leading-relaxed mb-3 line-clamp-2">{n.desc}</p>
                          
                          <div className="flex items-center justify-between">
                            <span className={`px-2 py-0.5 rounded-md text-[8px] font-black uppercase ${n.priority === 'critical' ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/20' : 'bg-slate-100 text-slate-500'}`}>
                              {n.priority || 'Normal'}
                            </span>
                            <div className="flex items-center gap-1 text-[10px] font-black text-blue-600 group-hover/item:translate-x-[-4px] transition-transform">
                               <span>استكشف الآن</span>
                               <ChevronRight size={14} className="rotate-180" />
                            </div>
                          </div>
                        </div>
                      </Link>
                    )) : (
                      <div className="p-20 text-center space-y-4">
                         <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-300"><Ghost size={32} /></div>
                         <p className="text-xs font-black text-slate-400 uppercase">لا توجد تنبيهات جديدة حالياً</p>
                      </div>
                    )}
                  </div>
                  <Link to="/timeline" onClick={() => setIsNotificationsOpen(false)} className="p-4 bg-white border-t border-slate-100 text-center text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] cursor-pointer hover:text-blue-600 hover:bg-slate-50 transition-all flex items-center justify-center gap-2">
                    <History size={14} /> عرض جميع التنبيهات في السجل
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* User Profile Hook */}
          <div className="relative" ref={menuRef}>
            <button 
              id="user-profile-button"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="flex items-center gap-1 p-0.5 hover:bg-white rounded-lg transition-all border border-transparent hover:border-slate-100"
            >
              <div className="relative">
                <img src={user.avatar} alt="User" className="w-[22px] h-[22px] rounded border border-white shadow-sm object-cover" />
                <div className="absolute -bottom-0.5 -left-0.5 w-1.5 h-1.5 bg-green-500 border border-white rounded-full"></div>
              </div>
              <ChevronDown size={10} className={`text-slate-400 transition-transform duration-300 ${isMenuOpen ? 'rotate-180' : ''}`} />
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
                  <MenuItem icon={UserIcon} label="الملف الشخصي" to="/profile" />
                  <MenuItem icon={Settings} label="الإعدادات" to="/profile?tab=settings" />
                  <MenuItem icon={CreditCard} label="الاشتراكات" />
                  <MenuItem icon={HelpCircle} label="الدعم الفني" to="/help" />
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
      <main className={`flex-1 transition-all duration-300 pb-24 lg:pb-0 ${isSidebarCollapsed ? 'lg:mr-20' : 'lg:mr-[280px]'} min-w-0`}>
        <Topbar
          user={currentUser}
          onRoleChange={handleRoleChange}
          onOpenWizard={() => setIsWizardOpen(true)}
        />
        <div className="animate-fadeIn">
          <Routes>
            <Route path="/" element={<HomeFeed feedItems={FEED_ITEMS} user={currentUser} onOpenWizard={() => setIsWizardOpen(true)} />} />
            <Route path="/ai-dashboard" element={<AIRadarDashboard />} />
            <Route path="/smart-radar" element={<SmartRadarPage />} />
            <Route path="/simulator" element={<InvestmentSimulator />} />
            <Route path="/dashboards" element={<OfficialDashboardsPage dashboards={officialDashboards} widgets={allWidgets} userRole={currentUser.role} />} />
            <Route path="/dataset-explorer/:angleId" element={<DatasetExplorerPage />} />
            {/* Removed official-panels route */}
            <Route path="/signals" element={<AISignalsPage />} />
            <Route path="/timeline" element={<TimelinePage events={TIMELINE_EVENTS} />} />
            <Route path="/dashboard-test" element={<DashboardTest />} />
            <Route path="/city/:cityName" element={<CityAnalytics />} />
            <Route path="/city-duel" element={<SmartCityDuel />} />
            <Route path="/help" element={<HelpCenterPage />} />
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
            <Route path="/comparisons" element={<SmartComparisonsPage />} />
            <Route path="/sources" element={<DataSourcesPage />} />
            <Route path="/economic-dashboard" element={<AIEconomicDashboard />} />
            <Route path="/verification" element={<div className="p-10 text-center text-gray-400">Data Verification (Expert+)</div>} />
            <Route path="/admin" element={<AdminOverviewPage />} />
            <Route path="/admin/notifications" element={<AdminNotificationsPage />} />
            <Route path="/admin/subscriptions" element={<SubscriptionsManagement />} />
            <Route path="/advanced-content" element={<AdvancedContentManagement />} />

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
    <ToastProvider>
      <App />
    </ToastProvider>
  </Router>
)

export default RootApp;
