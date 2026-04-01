import React from 'react';
import { Target, Rocket, Building2, Sparkles, TrendingUp, ShieldCheck } from 'lucide-react';
import { TabType } from '../types';

interface HeaderProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, onTabChange }) => {
  const tabs = [
    {
      id: 'general' as TabType,
      label: 'استثمار عام',
      icon: Target,
      title: 'محاكي الاستثمار العام',
      description: 'حلل جدوى مشروعك التجاري التقليدي وخطط لمستقبلك المالي بدقة متناهية',
      color: 'indigo',
      gradient: 'from-indigo-600 to-purple-600'
    },
    {
      id: 'startup' as TabType,
      label: 'شركات ناشئة',
      icon: Rocket,
      title: 'محاكي الشركات الناشئة',
      description: 'حسابات المدرج النقدي، التقييم، وحصة المستثمرين لمشروعك التقني',
      color: 'rose',
      gradient: 'from-rose-600 to-orange-600'
    },
    {
      id: 'real_estate' as TabType,
      label: 'عقارات',
      icon: Building2,
      title: 'محاكي الاستثمار العقاري',
      description: 'محاكاة الدخل السعري، العوائد الإيجارية، وتأثير الضرائب والقروض على عقارك',
      color: 'emerald',
      gradient: 'from-emerald-600 to-teal-600'
    }
  ];

  const activeTabData = tabs.find(t => t.id === activeTab) || tabs[0];
  const ActiveIcon = activeTabData.icon;

  return (
    <div className="relative mb-12 overflow-hidden">
      {/* Background Gradient */}
      <div className={`absolute inset-0 bg-gradient-to-br ${activeTabData.gradient} opacity-5 rounded-[3rem] -m-8`}></div>
      
      <div className="relative flex flex-col lg:flex-row lg:items-end justify-between gap-8">
        {/* Title Section */}
        <div className="space-y-4 flex-1">
          {/* Badge */}
          <div className="flex items-center gap-2">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-gradient-to-r ${activeTabData.gradient} text-white shadow-lg`}>
              <Sparkles size={12} />
              محاكي ذكي
            </span>
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-600">
              <ShieldCheck size={12} />
              مدعوم بالذكاء الاصطناعي
            </span>
          </div>

          {/* Main Title */}
          <div className="flex items-center gap-4">
            <div className={`p-4 bg-gradient-to-br ${activeTabData.gradient} rounded-3xl shadow-2xl shadow-${activeTabData.color}-200`}>
              <ActiveIcon className="w-10 h-10 text-white" />
            </div>
            <div>
              <h1 className="text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">
                {activeTabData.title}
              </h1>
              <p className="text-base font-medium text-slate-500 mt-1 leading-relaxed">
                {activeTabData.description}
              </p>
            </div>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-white p-2 rounded-[2rem] border border-slate-200 shadow-lg shadow-slate-200/50 self-start lg:self-center backdrop-blur-sm">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`relative flex items-center gap-2.5 px-5 py-3.5 rounded-[1.5rem] font-black text-sm transition-all duration-300 ${
                  isActive
                    ? `bg-gradient-to-r ${tab.gradient} text-white shadow-xl scale-105`
                    : 'text-slate-400 hover:text-slate-700 hover:bg-slate-50'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'animate-pulse' : ''}`} />
                <span className="whitespace-nowrap">{tab.label}</span>
                {isActive && (
                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-white rounded-full"></div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Quick Stats Bar */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="flex items-center gap-3 bg-white/80 backdrop-blur-sm px-4 py-3 rounded-2xl border border-slate-200/60">
          <div className={`p-2.5 rounded-xl bg-gradient-to-br ${activeTabData.gradient} bg-opacity-10`}>
            <TrendingUp className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">نوع التحليل</p>
            <p className="text-sm font-black text-slate-900">تدفقات نقدية متوقعة</p>
          </div>
        </div>
        <div className="flex items-center gap-3 bg-white/80 backdrop-blur-sm px-4 py-3 rounded-2xl border border-slate-200/60">
          <div className={`p-2.5 rounded-xl bg-gradient-to-br ${activeTabData.gradient} bg-opacity-10`}>
            <ShieldCheck className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">دقة المحاكاة</p>
            <p className="text-sm font-black text-slate-900">1000+ سيناريو</p>
          </div>
        </div>
        <div className="flex items-center gap-3 bg-white/80 backdrop-blur-sm px-4 py-3 rounded-2xl border border-slate-200/60">
          <div className={`p-2.5 rounded-xl bg-gradient-to-br ${activeTabData.gradient} bg-opacity-10`}>
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">الذكاء الاصطناعي</p>
            <p className="text-sm font-black text-slate-900">تحليلات فورية</p>
          </div>
        </div>
      </div>
    </div>
  );
};
