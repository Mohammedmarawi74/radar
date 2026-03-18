import React from 'react';
import {
  Activity,
  TrendingUp,
  Zap,
  ShieldCheck,
  Calendar,
  Users,
  Database,
  PieChart as PieChartIcon,
  ArrowUpRight,
  ArrowDownRight,
  BarChart3,
  MapPin,
  Building2
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
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';

interface DashboardTabProps {
  title?: string;
  agency?: string;
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

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

const DashboardTab: React.FC<DashboardTabProps> = ({ title = 'لوحة القيادة', agency = 'الهيئة العامة للإحصاء' }) => {
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

  const trendData = [
    { name: 'Q1', نمو: 6.5, استثمارات: 4000 },
    { name: 'Q2', نمو: 8.2, استثمارات: 3000 },
    { name: 'Q3', نمو: 5.8, استثمارات: 2000 },
    { name: 'Q4', نمو: 9.4, استثمارات: 2780 },
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="bg-gradient-to-l from-blue-600 to-indigo-700 rounded-[24px] p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full -ml-32 -mt-32"></div>
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mb-32"></div>
        <div className="relative z-10">
          <h2 className="text-2xl lg:text-3xl font-black mb-3 flex items-center gap-3">
            <Activity size={32} />
            {title}
          </h2>
          <p className="text-blue-100 text-sm font-bold opacity-90">{agency}</p>
        </div>
      </div>

      {/* Metric Cards - Row 1 */}
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

      {/* Charts Section - Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Performance Chart */}
        <div className="lg:col-span-2 bg-white rounded-[24px] p-6 border border-slate-100 shadow-sm">
          <h3 className="text-lg font-black text-slate-900 mb-6 flex items-center gap-2">
            <BarChart3 className="text-blue-600" />
            الأداء عبر الزمن
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

      {/* Metric Cards - Row 2 */}
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

      {/* Charts Section - Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Trend Chart */}
        <div className="bg-white rounded-[24px] p-6 border border-slate-100 shadow-sm">
          <h3 className="text-lg font-black text-slate-900 mb-6 flex items-center gap-2">
            <TrendingUp className="text-blue-600" />
            مؤشرات النمو والاستثمار
          </h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dx={-10} />
                <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dx={10} />
                <Tooltip
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                />
                <Legend wrapperStyle={{ paddingTop: '20px' }} />
                <Line yAxisId="left" type="monotone" dataKey="نمو" name="معدل النمو %" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4 }} />
                <Line yAxisId="right" type="monotone" dataKey="استثمارات" name="الاستثمارات" stroke="#10b981" strokeWidth={3} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bar Chart */}
        <div className="bg-white rounded-[24px] p-6 border border-slate-100 shadow-sm">
          <h3 className="text-lg font-black text-slate-900 mb-6 flex items-center gap-2">
            <Building2 className="text-blue-600" />
            الأداء حسب المنطقة
          </h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={[
                { name: 'الرياض', أداء: 4000 },
                { name: 'جدة', أداء: 3000 },
                { name: 'الدمام', أداء: 2000 },
                { name: 'مكة', أداء: 2780 },
                { name: 'نيوم', أداء: 1890 },
              ]}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dx={-10} />
                <Tooltip
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                />
                <Bar dataKey="أداء" fill="#3b82f6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardTab;
