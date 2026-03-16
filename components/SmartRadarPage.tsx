import React, { useState } from 'react';
import { 
  Target, 
  Users, 
  Building2, 
  Map, 
  TrendingUp, 
  Activity,
  AlertCircle,
  Briefcase,
  Layers,
  BarChart4,
  ArrowUpRight,
  ArrowDownRight,
  Home,
  MapPin,
  Clock,
  PieChart as PieChartIcon,
  ShieldAlert,
  Zap
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  BarChart, Bar, Legend, LineChart, Line, ComposedChart, PieChart, Pie, Cell
} from 'recharts';

// --- MOCK DATA ---

const demandData = [
  { name: 'يناير', مكتملة: 4000, غير_مخدومة: 2400, الفجوة: 1600 },
  { name: 'فبراير', مكتملة: 3000, غير_مخدومة: 1398, الفجوة: 1000 },
  { name: 'مارس', مكتملة: 2000, غير_مخدومة: 9800, الفجوة: 7800 },
  { name: 'أبريل', مكتملة: 2780, غير_مخدومة: 3908, الفجوة: 1128 },
  { name: 'مايو', مكتملة: 1890, غير_مخدومة: 4800, الفجوة: 2910 },
  { name: 'يونيو', مكتملة: 2390, غير_مخدومة: 3800, الفجوة: 1410 },
  { name: 'يوليو', مكتملة: 3490, غير_مخدومة: 4300, الفجوة: 810 },
];

const popData = [
  { age: '18-24', male: 4000, female: 2400 },
  { age: '25-34', male: 3000, female: 1398 },
  { age: '35-44', male: 2000, female: 9800 },
  { age: '45-54', male: 2780, female: 3908 },
  { age: '55-64', male: 1890, female: 4800 },
  { age: '65+', male: 2390, female: 3800 },
];

const realEstateData = [
  { region: 'الرياض', مباعة: 4000, مستأجرة: 2400, مشاريع_جديدة: 12 },
  { region: 'جدة', مباعة: 3000, مستأجرة: 1398, مشاريع_جديدة: 8 },
  { region: 'الدمام', مباعة: 2000, مستأجرة: 9800, مشاريع_جديدة: 15 },
  { region: 'نيوم', مباعة: 2780, مستأجرة: 3908, مشاريع_جديدة: 22 },
  { region: 'مكة', مباعة: 1890, مستأجرة: 4800, مشاريع_جديدة: 5 },
];

const ecoRegionsData = [
  { name: 'الرياض', نمو: 8.5, استثمارات: 4000, شركات_جديدة: 2400 },
  { name: 'الشرقية', نمو: 6.2, استثمارات: 3000, شركات_جديدة: 1398 },
  { name: 'نيوم', نمو: 12.4, استثمارات: 2000, شركات_جديدة: 9800 },
  { name: 'جدة', نمو: 5.1, استثمارات: 2780, شركات_جديدة: 3908 },
];

const sectorData = [
  { name: 'التقنية', الإيرادات: 4000, وظائف: 2400, الاستثمار: 2400 },
  { name: 'السياحة', الإيرادات: 3000, وظائف: 1398, الاستثمار: 2210 },
  { name: 'الصناعة', الإيرادات: 2000, وظائف: 9800, الاستثمار: 2290 },
  { name: 'الصحة', الإيرادات: 2780, وظائف: 3908, الاستثمار: 2000 },
  { name: 'التعليم', الإيرادات: 1890, وظائف: 4800, الاستثمار: 2181 },
];

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

// --- SHARED COMPONENTS ---

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

// --- TAB SECTIONS ---

const UnservedDemandTab = () => (
  <div className="space-y-6 animate-fadeIn">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <MetricCard title="إجمالي الطلب غير المخدوم" value="24,592" change={12.5} isPositive={false} icon={Target} subtitle="مقارنة بالشهر الماضي" />
      <MetricCard title="النسبة من إجمالي الطلبات" value="38%" change={4.2} isPositive={false} icon={PieChartIcon} subtitle="نقص في التغطية" />
      <MetricCard title="القطاع الأكثر تضرراً" value="قطاع التجزئة" change={8.1} isPositive={false} icon={AlertCircle} subtitle="نقص في المعروض بنسبة 45%" />
      <MetricCard title="متوسط وقت الانتظار" value="14 يوم" change={2.3} isPositive={true} icon={Clock} subtitle="تحسن طفيف عن السابق" />
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 bg-white rounded-[24px] p-6 border border-slate-100 shadow-sm">
        <h3 className="text-lg font-black text-slate-900 mb-6 flex items-center gap-2">
          <Activity className="text-blue-600" />
          حجم الطلب المكتمل مقابل غير المخدوم
        </h3>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={demandData}>
              <defs>
                <linearGradient id="colorMktabla" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorGherMakhdoma" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dx={-10} />
              <RechartsTooltip 
                contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
              />
              <Legend wrapperStyle={{ paddingTop: '20px' }} />
              <Area type="monotone" dataKey="مكتملة" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorMktabla)" />
              <Area type="monotone" dataKey="غير_مخدومة" name="غير مخدومة" stroke="#ef4444" strokeWidth={3} fillOpacity={1} fill="url(#colorGherMakhdoma)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white rounded-[24px] p-6 border border-slate-100 shadow-sm">
        <h3 className="text-lg font-black text-slate-900 mb-6 flex items-center gap-2">
          <Target className="text-blue-600" />
          توزيع النقص حسب الخدمة
        </h3>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={[
                  { name: 'توصيل طلبات', value: 400 },
                  { name: 'خدمات صحية', value: 300 },
                  { name: 'صيانة منزلية', value: 300 },
                  { name: 'استشارات قانونية', value: 200 }
                ]}
                cx="50%"
                cy="50%"
                innerRadius={70}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {[
                  { name: 'توصيل طلبات', value: 400 },
                  { name: 'خدمات صحية', value: 300 },
                  { name: 'صيانة منزلية', value: 300 },
                  { name: 'استشارات قانونية', value: 200 }
                ].map((entry, index) => (
                  <Cell key={`cell-${entry.name}-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <RechartsTooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }} />
              <Legend verticalAlign="bottom" height={36}/>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  </div>
);

const PopulationTab = () => (
  <div className="space-y-6 animate-fadeIn">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <MetricCard title="إجمالي السكان التجاريين" value="4.2M" change={5.4} isPositive={true} icon={Users} subtitle="نطاق الاستهداف الرئيسي" />
      <MetricCard title="نمو الأسر المستهلكة" value="+12%" change={12.0} isPositive={true} icon={Home} subtitle="خلال العام الحالي" />
      <MetricCard title="الفئة الأكثر إنفاقاً" value="25-34 عام" change={3.1} isPositive={true} icon={TrendingUp} subtitle="تشكل 40% من قوة الاستهلاك" />
      <MetricCard title="حجم القوى العاملة الجديدة" value="184K" change={8.5} isPositive={true} icon={Briefcase} subtitle="وظائف جديدة تم إضافتها" />
    </div>

    <div className="bg-white rounded-[24px] p-6 border border-slate-100 shadow-sm">
      <h3 className="text-lg font-black text-slate-900 mb-6 flex items-center gap-2">
        <Users className="text-blue-600" />
        التوزيع الديموغرافي للتركيبة السكانية التجارية
      </h3>
      <div className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={popData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
            <XAxis dataKey="age" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
            <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dx={-10} />
            <RechartsTooltip cursor={{fill: 'transparent'}} contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }} />
            <Legend wrapperStyle={{ paddingTop: '20px' }} />
            <Bar dataKey="male" name="ذكور" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={30} />
            <Bar dataKey="female" name="إناث" fill="#ec4899" radius={[4, 4, 0, 0]} barSize={30} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  </div>
);

const RealEstateTab = () => (
  <div className="space-y-6 animate-fadeIn">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <MetricCard title="الرخص الإنشائية الجديدة" value="1,842" change={18.5} isPositive={true} icon={Building2} subtitle="نمو قياسي هذا الربع" />
      <MetricCard title="متوسط قيمة العقار التجاري" value="2.4M SAR" change={5.2} isPositive={true} icon={TrendingUp} subtitle="ارتفاع في المناطق الصاعدة" />
      <MetricCard title="نسبة الإشغال" value="88%" change={1.5} isPositive={true} icon={PieChartIcon} subtitle="تحسن ملحوظ في المكاتب" />
      <MetricCard title="مشاريع تطوير كبرى" value="14" change={0} isPositive={true} icon={MapPin} subtitle="قيد التنفيذ حالياً" />
    </div>

    <div className="bg-white rounded-[24px] p-6 border border-slate-100 shadow-sm">
      <h3 className="text-lg font-black text-slate-900 mb-6 flex items-center gap-2">
        <Building2 className="text-blue-600" />
        مؤشرات العرض والطلب والمشاريع حسب المنطقة
      </h3>
      <div className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={realEstateData}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
            <XAxis dataKey="region" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
            <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dx={-10} />
            <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dx={10} />
            <RechartsTooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }} />
            <Legend wrapperStyle={{ paddingTop: '20px' }} />
            <Bar yAxisId="left" dataKey="مباعة" name="وحدات مباعة" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={20} />
            <Bar yAxisId="left" dataKey="مستأجرة" name="وحدات مستأجرة" fill="#10b981" radius={[4, 4, 0, 0]} barSize={20} />
            <Line yAxisId="right" type="monotone" dataKey="مشاريع_جديدة" name="مشاريع جديدة" stroke="#f59e0b" strokeWidth={4} dot={{ r: 6, fill: '#f59e0b', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 8 }} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  </div>
);

const EconomicRegionsTab = () => (
  <div className="space-y-6 animate-fadeIn">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <MetricCard title="حجم الاستثمارات الجديدة" value="45B SAR" change={22.4} isPositive={true} icon={Zap} subtitle="تدفقات أجنبية ومحلية" />
      <MetricCard title="شركات مسجلة حديثاً" value="3,210" change={15.0} isPositive={true} icon={Briefcase} subtitle="خلال الربع الماضي" />
      <MetricCard title="مستوى الخدمات اللوجستية" value="92/100" change={4.5} isPositive={true} icon={Layers} subtitle="مؤشر أداء متقدم" />
      <MetricCard title="مشاريع البنية التحتية" value="128" change={10.2} isPositive={true} icon={Map} subtitle="قيد التطوير والإنشاء" />
    </div>

    <div className="bg-white rounded-[24px] p-6 border border-slate-100 shadow-sm">
      <h3 className="text-lg font-black text-slate-900 mb-6 flex items-center gap-2">
        <Map className="text-blue-600" />
        مؤشرات النمو والتأسيس في المناطق الصاعدة
      </h3>
      <div className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={ecoRegionsData}>
             <defs>
                <linearGradient id="colorInvest" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                </linearGradient>
              </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
            <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dx={-10} />
            <RechartsTooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }} />
            <Legend wrapperStyle={{ paddingTop: '20px' }} />
            <Area type="monotone" dataKey="استثمارات" name="الاستثمارات (بالملايين)" stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#colorInvest)" />
            <Line type="monotone" dataKey="شركات_جديدة" name="الشركات الجديدة" stroke="#f59e0b" strokeWidth={3} dot={{ r: 4 }} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  </div>
);


const FastSectorsTab = () => (
  <div className="space-y-6 animate-fadeIn">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <MetricCard title="أعلى قطاع نمواً" value="التقنية والذكاء الاصطناعي" change={34.2} isPositive={true} icon={TrendingUp} subtitle="نمو مركب سنوي" />
      <MetricCard title="أكبر فجوة عرض/طلب" value="الخدمات اللوجستية المتقدمة" change={45.0} isPositive={false} icon={AlertCircle} subtitle="فرصة استثمارية هائلة" />
      <MetricCard title="الوظائف المستحدثة" value="45,000" change={18.0} isPositive={true} icon={Users} subtitle="في القطاعات الناشئة" />
      <MetricCard title="مؤشر الثبات الاستثماري" value="8.4/10" change={2.1} isPositive={true} icon={ShieldAlert} subtitle="تقييم المخاطر إيجابي" />
    </div>

    <div className="bg-white rounded-[24px] p-6 border border-slate-100 shadow-sm">
      <h3 className="text-lg font-black text-slate-900 mb-6 flex items-center gap-2">
        <BarChart4 className="text-blue-600" />
        مقارنة الإيرادات وتدفقات الاستثمار للقطاعات الأسرع نمواً
      </h3>
      <div className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={sectorData} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#e2e8f0" />
            <XAxis type="number" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
            <YAxis type="category" dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#1e293b', fontSize: 13, fontWeight: 'bold'}} dx={-15} />
            <RechartsTooltip cursor={{fill: 'transparent'}} contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }} />
            <Legend wrapperStyle={{ paddingTop: '20px' }} />
            <Bar dataKey="الإيرادات" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={15} />
            <Bar dataKey="الاستثمار" fill="#10b981" radius={[0, 4, 4, 0]} barSize={15} />
            <Bar dataKey="وظائف" fill="#f59e0b" radius={[0, 4, 4, 0]} barSize={15} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  </div>
);

// --- MAIN PAGE COMPONENT ---

export default function SmartRadarPage() {
  const [activeTab, setActiveTab] = useState(0);

  const tabs = [
    { id: 0, label: 'الطلب غير المخدوم', icon: Target },
    { id: 1, label: 'النمو السكاني التجاري', icon: Users },
    { id: 2, label: 'الفرص العقارية', icon: Building2 },
    { id: 3, label: 'المناطق الاقتصادية الصاعدة', icon: Map },
    { id: 4, label: 'القطاعات الأسرع نموًا', icon: TrendingUp },
  ];

  const renderContent = () => {
    switch(activeTab) {
      case 0: return <UnservedDemandTab />;
      case 1: return <PopulationTab />;
      case 2: return <RealEstateTab />;
      case 3: return <EconomicRegionsTab />;
      case 4: return <FastSectorsTab />;
      default: return <UnservedDemandTab />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4 lg:p-8 min-h-screen pb-24">
      {/* Header */}
      <div className="mb-8 relative z-10">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl -z-10 -mt-20 -mr-20"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-600/10 rounded-full blur-3xl -z-10 -mb-20 -ml-20"></div>

        <h2 className="text-3xl lg:text-4xl font-black text-slate-900 tracking-tight flex items-center gap-3">
          <div className="p-3 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl shadow-lg shadow-blue-500/20 text-white">
            <Activity size={32} />
          </div>
          لوحات الرادار الذكية
        </h2>
        <p className="text-lg text-slate-500 mt-4 leading-relaxed max-w-3xl font-medium">
          مستكشف البيانات المتقدم للرؤى الاقتصادية وفرص السوق مدعوم بتحليلات ذكية لحظية لتسريع اتخاذ القرار.
        </p>
      </div>

      {/* Modern Tabs */}
      <div className="mb-8 overflow-x-auto no-scrollbar pb-2">
        <div className="flex items-center gap-2 bg-white/50 backdrop-blur-xl p-2 rounded-2xl shadow-sm border border-slate-200/60 w-max">
          {tabs.map(tab => {
            const isActive = activeTab === tab.id;
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-bold transition-all duration-300 whitespace-nowrap ${
                  isActive 
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20' 
                  : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
                }`}
              >
                <Icon size={18} className={isActive ? 'animate-pulse' : ''} />
                {tab.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Tab Content */}
      <div className="relative">
        {renderContent()}
      </div>
    </div>
  );
}
