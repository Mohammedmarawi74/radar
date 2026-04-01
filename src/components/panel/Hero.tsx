import React from 'react';
import { ChevronLeft, Database, Clock, Shield, Eye } from 'lucide-react';

interface HeroProps {
  title: string;
  categoryLabel?: string;
}

const Hero: React.FC<HeroProps> = ({ title, categoryLabel = 'البيانات الإحصائية والاقتصادية' }) => {
  return (
    <div className="bg-gov-blue text-white pt-8 pb-12 relative overflow-hidden">
      {/* Background Decorative Pattern */}
      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
         <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1"/>
                </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Breadcrumb row is usually handled by App.tsx, but this is the Hero's internal one */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            {/* Title Area */}
            <div className="flex flex-col md:flex-row gap-6 items-start">
                <div className="bg-white/10 p-5 rounded-2xl backdrop-blur-md shadow-2xl border border-white/5">
                    <Database size={56} className="text-blue-300" />
                </div>
                <div>
                    <div className="flex items-center gap-2 mb-3">
                        <span className="bg-amber-500 text-white text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-wider">زاوية ذكية</span>
                        <span className="text-blue-200 text-xs font-bold">{categoryLabel}</span>
                    </div>
                    <h1 className="text-3xl md:text-5xl font-black mb-4 leading-tight tracking-tight">
                        {title}
                    </h1>
                    <div className="flex flex-wrap gap-6 text-sm text-blue-100">
                        <span className="bg-green-500 text-white px-3 py-1 rounded-full text-[10px] font-black">
                            • بيانات حية
                        </span>
                        <div className="flex items-center gap-4 opacity-80 font-bold">
                            <div className="flex items-center gap-2">
                                <Clock size={16} className="text-blue-300" />
                                <span>تحديث شهري</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Shield size={16} className="text-blue-300" />
                                <span>رخصة مفتوحة</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Area (Right side in RTL) */}
            <div className="hidden lg:flex items-center gap-8 bg-white/5 backdrop-blur-sm border border-white/10 p-6 rounded-[32px]">
                <div className="text-center border-l border-white/10 pl-8">
                    <div className="text-[10px] text-blue-200 font-bold uppercase mb-1">المشاهدات</div>
                    <div className="text-2xl font-black">2.8k</div>
                </div>
                <div className="text-center border-l border-white/10 pl-8">
                    <div className="text-[10px] text-blue-200 font-bold uppercase mb-1">التحميلات</div>
                    <div className="text-2xl font-black">840</div>
                </div>
                <div className="text-center">
                    <div className="text-[10px] text-blue-200 font-bold uppercase mb-1">التقييم</div>
                    <div className="text-2xl font-black">4.9</div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;