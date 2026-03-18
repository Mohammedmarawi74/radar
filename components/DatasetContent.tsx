
import React, { useState } from 'react';
import {
  FileText,
  Download,
  Eye,
  Clock,
  Database,
  Share2,
  MoreHorizontal,
  ChevronRight,
  Calendar,
  ShieldCheck,
  Tag,
  BarChart3,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  Zap,
  MapPin,
  Users,
  Building2,
  PieChart as PieChartIcon
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  ComposedChart,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import { Dataset, UserRole } from '../types';
import CommentsSection from './CommentsSection';
import ReviewsSection from './ReviewsSection';

interface DatasetContentProps {
  dataset: Dataset;
  onBack?: () => void;
  role?: UserRole;
}

// --- Metric Card Component (Same as SmartRadarPage) ---
const MetricCard = ({ title, value, change, isPositive, icon: Icon, subtitle }: any) => (
  <div className="bg-white p-6 rounded-[24px] border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300 group">
    <div className="flex justify-between items-start mb-4">
      <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
        <Icon size={24} strokeWidth={2} />
      </div>
      <div className={`flex items-center gap-1 text-sm font-bold px-2 py-1 rounded-lg ${isPositive ? 'text-emerald-600 bg-emerald-50' : 'text-rose-600 bg-rose-50'}`}>
        {isPositive ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
        <span>{Math.abs(change)}%</span>
      </div>
    </div>
    <div>
      <h3 className="text-slate-500 text-sm font-bold mb-1">{title}</h3>
      <div className="text-3xl font-black text-slate-900 tracking-tight">
        {value}
      </div>
      {subtitle && <p className="text-xs font-bold text-slate-400 mt-2">{subtitle}</p>}
    </div>
  </div>
);

// --- Dashboard Tab Content (Same style as SmartRadarPage) ---
const DashboardTab: React.FC<{ dataset: Dataset }> = ({ dataset }) => {
  // Mock data - will be replaced with real data based on dataset
  const performanceData = [
    { name: 'يناير', أداء: 4000, هدف: 2400, نمو: 1600 },
    { name: 'فبراير', أداء: 3000, هدف: 1398, نمو: 1000 },
    { name: 'مارس', أداء: 2000, هدف: 9800, نمو: 7800 },
    { name: 'أبريل', أداء: 2780, هدف: 3908, نمو: 1128 },
    { name: 'مايو', أداء: 1890, هدف: 4800, نمو: 2910 },
    { name: 'يونيو', أداء: 2390, هدف: 3800, نمو: 1410 },
  ];

  const distributionData = [
    { name: 'القطاع الأول', value: 400 },
    { name: 'القطاع الثاني', value: 300 },
    { name: 'القطاع الثالث', value: 300 },
    { name: 'القطاع الرابع', value: 200 },
  ];

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard 
          title="إجمالي الأداء" 
          value="24,592" 
          change={12.5} 
          isPositive={true} 
          icon={Activity} 
          subtitle="مقارنة بالشهر الماضي" 
        />
        <MetricCard 
          title="نسبة الإنجاز" 
          value="87%" 
          change={4.2} 
          isPositive={true} 
          icon={PieChartIcon} 
          subtitle="تجاوز المستهدف" 
        />
        <MetricCard 
          title="النمو السنوي" 
          value="+34%" 
          change={8.1} 
          isPositive={true} 
          icon={TrendingUp} 
          subtitle="أعلى من المتوسط" 
        />
        <MetricCard 
          title="الفرص المتاحة" 
          value="142" 
          change={2.3} 
          isPositive={false} 
          icon={Zap} 
          subtitle="تتطلب متابعة" 
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Performance Chart */}
        <div className="lg:col-span-2 bg-white rounded-[24px] p-6 border border-slate-100 shadow-sm">
          <h3 className="text-lg font-black text-slate-900 mb-6 flex items-center gap-2">
            <Activity className="text-blue-600" />
            أداء {dataset.name} عبر الزمن
          </h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={performanceData}>
                <defs>
                  <linearGradient id="colorPerformance" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dx={-10} />
                <Tooltip
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                />
                <Legend wrapperStyle={{ paddingTop: '20px' }} />
                <Area type="monotone" dataKey="أداء" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorPerformance)" />
                <Area type="monotone" dataKey="هدف" name="المستهدف" stroke="#10b981" strokeWidth={3} fillOpacity={0} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Distribution Chart */}
        <div className="bg-white rounded-[24px] p-6 border border-slate-100 shadow-sm">
          <h3 className="text-lg font-black text-slate-900 mb-6 flex items-center gap-2">
            <PieChartIcon className="text-blue-600" />
            التوزيع حسب القطاع
          </h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={distributionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {distributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }} />
                <Legend verticalAlign="bottom" height={36}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Additional Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard 
          title="جودة البيانات" 
          value="98.5%" 
          change={1.2} 
          isPositive={true} 
          icon={ShieldCheck} 
          subtitle="موثوقية عالية" 
        />
        <MetricCard 
          title="التحديثات" 
          value="24" 
          change={5.0} 
          isPositive={true} 
          icon={Calendar} 
          subtitle="هذا الشهر" 
        />
        <MetricCard 
          title="المستخدمون النشطون" 
          value="1,842" 
          change={15.3} 
          isPositive={true} 
          icon={Users} 
          subtitle="نمو مستمر" 
        />
        <MetricCard 
          title="التكاملات" 
          value="12" 
          change={0} 
          isPositive={true} 
          icon={Database} 
          subtitle="نظام متصل" 
        />
      </div>
    </div>
  );
};

const DatasetContent: React.FC<DatasetContentProps> = ({ dataset, onBack, role }) => {
  const [activeTab, setActiveTab] = useState('overview');
  
  const canViewComments = role === UserRole.ADMIN || role === UserRole.EDITOR || role === UserRole.CONTENT_MANAGER || role === UserRole.SUPER_ADMIN || role === UserRole.CURBTRON;

  const activityData = [
    { name: 'يناير', views: 400, downloads: 240 },
    { name: 'فبراير', views: 300, downloads: 139 },
    { name: 'مارس', views: 200, downloads: 980 },
    { name: 'أبريل', views: 278, downloads: 390 },
    { name: 'مايو', views: 189, downloads: 480 },
    { name: 'يونيو', views: 239, downloads: 380 },
  ];

  return (
    <div className="max-w-7xl mx-auto p-4 lg:p-8 animate-fadeIn overflow-x-hidden">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6 font-medium">
        <span className="hover:text-blue-600 cursor-pointer" onClick={onBack}>قاعدة البيانات</span>
        <ChevronRight size={14} className="rotate-180" />
        <span className="text-gray-900 truncate">{dataset.name}</span>
      </nav>

      {/* Hero Section */}
      <div className="bg-white rounded-3xl p-6 lg:p-10 border border-gray-100 shadow-sm mb-8 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 to-indigo-600"></div>
        <div className="flex flex-col lg:flex-row gap-8 justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-4">
              <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                {dataset.agency}
              </span>
              <span className={`w-2 h-2 rounded-full ${dataset.status === 'active' ? 'bg-green-500' : 'bg-amber-500'} animate-pulse`}></span>
              <span className="text-xs font-bold text-gray-400">محدثة: {dataset.lastUpdated}</span>
            </div>
            <h1 className="text-2xl lg:text-4xl font-black text-gray-900 mb-4 leading-tight">
              {dataset.name}
            </h1>
            <p className="text-gray-500 text-base leading-relaxed max-w-3xl">
              تقدم هذه المجموعة تفاصيل شاملة ودقيقة حول {dataset.name} في المملكة العربية السعودية، تم تجميعها وتدقيقها بالتعاون مع {dataset.agency} لضمان أعلى معايير الشفافية.
            </p>
            
            <div className="flex flex-wrap gap-2 mt-6">
              {['رؤية 2030', 'اقتصاد', 'بيانات مفتوحة'].map(tag => (
                <span key={tag} className="flex items-center gap-1.5 bg-gray-50 text-gray-500 px-3 py-1.5 rounded-lg text-xs font-bold border border-gray-100">
                  <Tag size={12} /> {tag}
                </span>
              ))}
            </div>
          </div>

          <div className="flex flex-row lg:flex-col gap-3 justify-center">
            <button className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20 active:scale-95">
              <Download size={18} /> تحميل البيانات
            </button>
            <button className="flex items-center gap-2 bg-white border border-gray-200 text-gray-700 px-6 py-3 rounded-xl font-bold hover:bg-gray-50 transition-all active:scale-95">
              <Share2 size={18} /> مشاركة
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content (66%) */}
        <div className="lg:col-span-2 space-y-8">
          {/* Tabs */}
          <div className="flex border-b border-gray-200 sticky top-[72px] bg-slate-50/80 backdrop-blur-md z-10 pt-2 h-14 items-end">
            {[
                { id: 'overview', label: 'نظرة عامة', icon: FileText },
                { id: 'dashboard', label: 'لوحة القيادة', icon: BarChart3 },
                { id: 'analytics', label: 'نشاط البيانات', icon: BarChart3 },
                { id: 'dictonary', label: 'قاموس البيانات', icon: Database }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-3 flex items-center gap-2 text-sm font-bold border-b-2 transition-all ${activeTab === tab.id ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
              >
                <tab.icon size={16} />
                {tab.label}
              </button>
            ))}
          </div>

          {activeTab === 'overview' && (
            <div className="animate-fadeIn space-y-8">
              {/* Metadata Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm text-center">
                  <Eye className="mx-auto text-blue-500 mb-2" size={20} />
                  <p className="text-xl font-black text-gray-900">12,450</p>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">مشاهدة</p>
                </div>
                <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm text-center">
                  <Download className="mx-auto text-indigo-500 mb-2" size={20} />
                  <p className="text-xl font-black text-gray-900">3,120</p>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">تحميل</p>
                </div>
                <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm text-center">
                  <Clock className="mx-auto text-amber-500 mb-2" size={20} />
                  <p className="text-xl font-black text-gray-900">فصلي</p>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">تكرار التحديث</p>
                </div>
                <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm text-center">
                  <ShieldCheck className="mx-auto text-green-500 mb-2" size={20} />
                  <p className="text-xl font-black text-gray-900">موثق</p>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">الحالة</p>
                </div>
              </div>

              {/* Descriptions & Details */}
              <div className="bg-white rounded-2xl p-6 lg:p-8 border border-gray-100 shadow-sm">
                <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                    <FileText size={20} className="text-blue-600" />
                    تفاصيل المجموعة
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                    <div className="space-y-4">
                        <div className="flex justify-between border-b border-gray-50 pb-3">
                            <span className="text-sm text-gray-500">اسم الناشر</span>
                            <span className="text-sm font-bold text-gray-900">{dataset.agency}</span>
                        </div>
                        <div className="flex justify-between border-b border-gray-50 pb-3">
                            <span className="text-sm text-gray-500">تاريخ النشر</span>
                            <span className="text-sm font-bold text-gray-900">2024-01-15</span>
                        </div>
                        <div className="flex justify-between border-b border-gray-50 pb-3">
                            <span className="text-sm text-gray-500">اخر تحديث</span>
                            <span className="text-sm font-bold text-gray-900">{dataset.lastUpdated}</span>
                        </div>
                    </div>
                    <div className="space-y-4">
                        <div className="flex justify-between border-b border-gray-50 pb-3">
                            <span className="text-sm text-gray-500">رخصة البيانات</span>
                            <span className="text-sm font-bold text-blue-600 cursor-pointer hover:underline">المشاع الإبداعي (CC)</span>
                        </div>
                        <div className="flex justify-between border-b border-gray-50 pb-3">
                            <span className="text-sm text-gray-500">الصيغ المتاحة</span>
                            <div className="flex gap-1">
                                {['CSV', 'JSON', 'XLSX'].map(f => (
                                    <span key={f} className="text-[10px] font-bold bg-gray-100 px-1.5 py-0.5 rounded text-gray-600">{f}</span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
              </div>

              {canViewComments && (
                  <>
                    <CommentsSection />
                    <ReviewsSection />
                  </>
              )}
              
              {!canViewComments && (
                  <div className="bg-gray-50 p-6 rounded-2xl border border-dashed border-gray-200 text-center">
                      <p className="text-gray-500 text-sm">قسم النقاش متاح فقط للأدوار الإشرافية والتحليلية المتقدمة.</p>
                  </div>
              )}
            </div>
          )}

          {activeTab === 'dashboard' && (
            <div className="animate-fadeIn">
              <DashboardTab dataset={dataset} />
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="animate-fadeIn space-y-6">
              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                    <BarChart3 size={20} className="text-blue-600" />
                    مؤشرات التفاعل (آخر 6 شهور)
                </h3>
                <div className="h-[350px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={activityData}>
                            <defs>
                                <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b'}} dy={10} />
                            <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b'}} />
                            <Tooltip 
                                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                            />
                            <Area type="monotone" dataKey="views" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorViews)" name="المشاهدات" />
                            <Area type="monotone" dataKey="downloads" stroke="#6366f1" strokeWidth={3} fillOpacity={0} name="التحميلات" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar (33%) */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm sticky top-[80px]">
            <h4 className="font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Download size={18} className="text-blue-600" />
                تحميل الموارد
            </h4>
            <div className="space-y-3">
                {[
                    { type: 'CSV', size: '2.4 MB', color: 'bg-green-50 text-green-700' },
                    { type: 'JSON', size: '1.8 MB', color: 'bg-amber-50 text-amber-700' },
                    { type: 'XLSX', size: '4.2 MB', color: 'bg-blue-50 text-blue-700' }
                ].map(res => (
                    <div key={res.type} className="flex items-center justify-between p-3 rounded-xl border border-gray-50 hover:border-gray-200 transition-all group cursor-pointer">
                        <div className="flex items-center gap-3">
                            <span className={`w-10 h-10 ${res.color} rounded-lg flex items-center justify-center font-bold text-xs`}>{res.type}</span>
                            <div>
                                <p className="text-sm font-bold text-gray-800 tracking-wider">DATASET_{res.type}</p>
                                <p className="text-[10px] text-gray-400 font-medium">{res.size}</p>
                            </div>
                        </div>
                        <Download size={16} className="text-gray-300 group-hover:text-blue-600 transition-colors" />
                    </div>
                ))}
            </div>

            <hr className="my-6 border-gray-100" />

            <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Calendar size={18} className="text-blue-600" />
                سجل الإصدارات
            </h4>
            <div className="space-y-4">
                <div className="relative pr-4 border-r border-gray-100 space-y-4">
                    <div className="relative">
                        <div className="absolute -right-[1.35rem] top-1.5 w-3 h-3 bg-blue-600 rounded-full border-2 border-white"></div>
                        <p className="text-xs font-bold text-gray-800">إصدار 2.1 (الحالي)</p>
                        <p className="text-[10px] text-gray-500 mt-0.5">تحديث بيانات الربع الأول 2025</p>
                    </div>
                    <div className="relative opacity-60">
                         <div className="absolute -right-[1.35rem] top-1.5 w-3 h-3 bg-gray-300 rounded-full border-2 border-white"></div>
                        <p className="text-xs font-bold text-gray-800">إصدار 2.0</p>
                        <p className="text-[10px] text-gray-500 mt-0.5">تعديل المنهجية الإحصائية</p>
                    </div>
                </div>
            </div>
            
            <button className="w-full mt-6 py-3 bg-gray-50 text-gray-600 rounded-xl text-xs font-bold hover:bg-gray-100 transition-all border border-gray-100">
                مشاهدة التوثيق التقني (API)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DatasetContent;
