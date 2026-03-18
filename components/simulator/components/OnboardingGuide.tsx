import React, { useState } from 'react';
import { HelpCircle, Lightbulb, TrendingUp, Shield, Zap } from 'lucide-react';

interface OnboardingGuideProps {
  activeTab: 'general' | 'startup' | 'real_estate';
}

export const OnboardingGuide: React.FC<OnboardingGuideProps> = ({ activeTab }) => {
  const [isDismissed, setIsDismissed] = useState(false);

  if (isDismissed) return null;

  const guides = {
    general: {
      title: 'دليل الاستثمار العام',
      steps: [
        { icon: TrendingUp, text: 'حدد رأس المال الأولي للمشروع' },
        { icon: Shield, text: 'أدخل الإيرادات والتكاليف المتوقعة' },
        { icon: Zap, text: 'راجع النتائج والتحليلات الذكية' }
      ]
    },
    startup: {
      title: 'دليل الشركات الناشئة',
      steps: [
        { icon: TrendingUp, text: 'حدد تقييم الشركة قبل الاستثمار' },
        { icon: Shield, text: 'أدخل معدل الحرق والإيرادات الشهرية' },
        { icon: Zap, text: 'اكتشف المدرج النقدي وحصة المستثمر' }
      ]
    },
    real_estate: {
      title: 'دليل الاستثمار العقاري',
      steps: [
        { icon: TrendingUp, text: 'حدد سعر العقار وتكاليف التطوير' },
        { icon: Shield, text: 'أدخل الدخل الإيجاري والمصاريف' },
        { icon: Zap, text: 'حلل العوائد والتأثيرات الضريبية' }
      ]
    }
  };

  const guide = guides[activeTab];

  return (
    <div className="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 rounded-[2rem] p-6 border border-indigo-100 shadow-sm mb-8">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-white rounded-2xl shadow-md">
            <Lightbulb className="w-6 h-6 text-amber-500" />
          </div>
          <div>
            <h3 className="text-lg font-black text-slate-900">{guide.title}</h3>
            <p className="text-sm text-slate-500 font-medium">3 خطوات بسيطة للبدء</p>
          </div>
        </div>
        <button
          onClick={() => setIsDismissed(true)}
          className="p-2 bg-white/50 hover:bg-white rounded-xl text-slate-400 hover:text-slate-600 transition-all"
        >
          <HelpCircle size={18} />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {guide.steps.map((step, idx) => {
          const Icon = step.icon;
          return (
            <div key={idx} className="flex items-center gap-3 bg-white/80 backdrop-blur-sm px-4 py-3 rounded-2xl border border-white/50">
              <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl text-white font-black text-sm">
                {idx + 1}
              </div>
              <Icon className="w-5 h-5 text-indigo-600" />
              <p className="text-sm font-bold text-slate-700">{step.text}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
