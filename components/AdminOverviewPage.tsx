import React from 'react';
import { 
  Users, Activity, Zap, TrendingUp, BarChart3, ShieldCheck, 
  ArrowUpRight, ArrowDownRight, Users2, Clock, Globe, 
  LayoutDashboard, Server, ShieldAlert, Cpu
} from 'lucide-react';

const AdminOverviewPage = () => {
  const stats = [
    { label: 'إجمالي المستخدمين', value: '24,510', change: '+12%', isUp: true, icon: Users2, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { label: 'المستخدمين النشطين', value: '3,842', change: '+5%', isUp: true, icon: Activity, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    { label: 'إجمالي الإشارات اليوم', value: '154', change: '-2%', isUp: false, icon: Zap, color: 'text-amber-500', bg: 'bg-amber-500/10' },
    { label: 'وقت استجابة النظام', value: '124ms', change: 'Optimized', isUp: true, icon: Clock, color: 'text-purple-500', bg: 'bg-purple-500/10' },
  ];

  return (
    <div className="min-h-screen bg-[#fafafa] text-slate-900 p-6 lg:p-10 font-sans" dir="rtl">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900">نظرة عامة على الإدارة</h1>
          <p className="text-sm text-slate-500 font-bold mt-1">مرحباً بك مجدداً في مركز التحكم الرئيسي للمنصة</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-5 py-2.5 bg-white border border-slate-200 rounded-xl shadow-sm flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
            <span className="text-[10px] font-black uppercase text-slate-400">حالة النظام: متصل - مستقر</span>
          </div>
        </div>
      </header>

      <main className="space-y-10">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, idx) => (
            <div key={idx} className="bg-white p-6 rounded-[32px] border border-slate-200 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all group">
              <div className="flex justify-between items-start mb-4">
                <div className={`p-4 rounded-2xl ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform`}>
                  <stat.icon size={24} />
                </div>
                <div className={`flex items-center gap-1 text-[10px] font-black px-2 py-1 rounded-lg ${stat.isUp ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                  {stat.isUp ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                  {stat.change}
                </div>
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
                <h2 className="text-3xl font-black text-slate-900 tracking-tight">{stat.value}</h2>
              </div>
            </div>
          ))}
        </div>

        {/* Content Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Main Chart Area Placeholder */}
          <div className="lg:col-span-8 bg-white rounded-[40px] border border-slate-200 p-10 h-[500px] shadow-sm flex flex-col justify-center items-center text-center">
             <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center text-slate-200 mb-6">
                <BarChart3 size={40} />
             </div>
             <h3 className="text-xl font-black text-slate-900 mb-2">مخطط النشاط العام</h3>
             <p className="text-sm text-slate-400 font-medium max-w-sm">سيتم عرض بيانات النمو والتفاعل اليومي هنا بشكل حي ومفصل.</p>
          </div>

          {/* Sidebar Area */}
          <div className="lg:col-span-4 space-y-10">
             {/* Security Center */}
             <div className="bg-slate-950 rounded-[40px] p-8 text-white shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/20 rounded-full blur-3xl -mr-16 -mt-16"></div>
                <div className="relative z-10">
                   <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-white"><ShieldCheck size={20} /></div>
                      <div>
                         <h4 className="text-sm font-black">مركز الحماية</h4>
                         <p className="text-[10px] text-slate-400 font-bold uppercase">Security & Access</p>
                      </div>
                   </div>
                   <div className="space-y-4">
                      <div className="p-4 bg-white/5 rounded-2xl border border-white/5 flex items-center justify-between group-hover:border-white/20 transition-all">
                         <span className="text-xs font-bold">تسجيلات الدخول</span>
                         <span className="text-xs font-black">84 محاولة</span>
                      </div>
                      <div className="p-4 bg-white/5 rounded-2xl border border-white/5 flex items-center justify-between group-hover:border-white/20 transition-all">
                         <span className="text-xs font-bold">تحديثات الأمان</span>
                         <span className="text-[10px] font-black uppercase text-emerald-400">Up to date</span>
                      </div>
                   </div>
                </div>
             </div>

             {/* Server Health */}
             <div className="bg-white rounded-[40px] border border-slate-200 p-8 space-y-6">
                <h3 className="text-sm font-black flex items-center gap-3 text-slate-900"><Server size={18} className="text-blue-500" /> كفاءة الخادم</h3>
                <div className="space-y-6">
                   <div className="space-y-2">
                      <div className="flex justify-between text-[10px] font-black uppercase text-slate-400 tracking-widest">
                         <span>CPU Usage</span>
                         <span className="text-slate-900">42%</span>
                      </div>
                      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                         <div className="h-full bg-blue-500 rounded-full w-[42%]"></div>
                      </div>
                   </div>
                   <div className="space-y-2">
                      <div className="flex justify-between text-[10px] font-black uppercase text-slate-400 tracking-widest">
                         <span>Memory Usage</span>
                         <span className="text-slate-900">68%</span>
                      </div>
                      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                         <div className="h-full bg-indigo-500 rounded-full w-[68%]"></div>
                      </div>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminOverviewPage;
