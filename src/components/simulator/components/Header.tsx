import React from 'react';
import { Target, Rocket, Building2 } from 'lucide-react';
import { TabType } from '../types';

interface HeaderProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, onTabChange }) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
      <div className="space-y-2">
        <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight flex items-center gap-4">
          <span className="p-3 bg-indigo-600 rounded-3xl shadow-xl shadow-indigo-200">
            {activeTab === 'general' ? <Target className="w-8 h-8 text-white" /> : 
             activeTab === 'startup' ? <Rocket className="w-8 h-8 text-white" /> : 
             <Building2 className="w-8 h-8 text-white" />}
          </span>
          {activeTab === 'general' ? 'محاكي الاستثمار العام' : 
           activeTab === 'startup' ? 'محاكي الشركات الناشئة' : 
           'محاكي الاستثمار العقاري'}
        </h1>
        <p className="text-lg font-medium text-slate-500 max-w-2xl leading-relaxed">
          {activeTab === 'general' ? 'حلل جدوى مشروعك التجاري التقليدي وخطط لمستقبلك المالي بدقة.' : 
           activeTab === 'startup' ? 'حسابات المدرج النقدي، التقييم، وحصة المستثمرين لمشروعك التقني.' : 
           'محاكاة الدخل السعري، العوائد الإيجارية، وتأثير الضرائب والقروض على عقارك.'}
        </p>
      </div>
      
      <div className="flex bg-slate-100/50 p-2 rounded-[2rem] border border-slate-200 self-start md:self-center backdrop-blur-sm">
        <TabButton active={activeTab === 'general'} onClick={() => onTabChange('general')} icon={<Target className="w-4 h-4" />}>عام</TabButton>
        <TabButton active={activeTab === 'startup'} onClick={() => onTabChange('startup')} icon={<Rocket className="w-4 h-4" />}>ناشئ</TabButton>
        <TabButton active={activeTab === 'real_estate'} onClick={() => onTabChange('real_estate')} icon={<Building2 className="w-4 h-4" />}>عقار</TabButton>
      </div>
    </div>
  );
};

const TabButton: React.FC<{ active: boolean; onClick: () => void; icon: React.ReactNode; children: React.ReactNode }> = ({ active, onClick, icon, children }) => (
  <button 
    onClick={onClick}
    className={`flex items-center gap-2 px-6 py-3 rounded-[1.5rem] font-black text-sm transition-all duration-300 ${
      active ? 'bg-white text-indigo-600 shadow-xl shadow-indigo-950/5 scale-105' : 'text-slate-400 hover:text-slate-600'
    }`}
  >
    {icon} {children}
  </button>
);
