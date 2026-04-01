import React from 'react';
import { AlertTriangle, Info } from 'lucide-react';

interface StressTestSectionProps {
    description: string;
    idealValue: number;
    stressValue: number;
    labelIdeal?: string;
    labelStress?: string;
    unit?: string;
}

export const StressTestSection: React.FC<StressTestSectionProps> = ({
    description,
    idealValue,
    stressValue,
    labelIdeal = "السيناريو المتوقع / الأساسي",
    labelStress = "تحت ضغط الأزمة / الحالي",
    unit = "ر.س"
}) => {
    const percentage = idealValue !== 0 ? Math.max(10, Math.min(100, (stressValue / idealValue) * 100)) : 0;

    return (
        <div className="bg-white p-8 rounded-[3rem] shadow-sm border border-slate-100 flex flex-col">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-black text-slate-800 flex items-center gap-3">
                    <AlertTriangle className="w-6 h-6 text-rose-500" /> اختبار الضغط (Stress Test)
                </h3>
            </div>
            <p className="text-slate-500 font-medium mb-10 leading-relaxed">
                {description}
            </p>

            <div className="space-y-10 flex-1 flex flex-col justify-center">
                <div className="space-y-4">
                    <div className="flex justify-between items-center text-sm font-black">
                        <span className="text-slate-600">{labelIdeal}</span>
                        <span className="text-indigo-600 text-lg">+{idealValue.toLocaleString()} {unit}</span>
                    </div>
                    <div className="h-5 bg-slate-100 rounded-2xl overflow-hidden">
                        <div className="h-full bg-indigo-500 rounded-2xl transition-all duration-1000 shadow-[0_0_20px_rgba(99,102,241,0.3)]" style={{ width: '100%' }}></div>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="flex justify-between items-center text-sm font-black">
                        <span className="text-slate-600">{labelStress}</span>
                        <span className={stressValue > 0 ? 'text-emerald-600 text-lg' : 'text-rose-600 text-lg'}>
                            {stressValue.toLocaleString()} {unit}
                        </span>
                    </div>
                    <div className="h-5 bg-slate-100 rounded-2xl overflow-hidden">
                        <div
                            className={`h-full transition-all duration-1000 rounded-2xl ${stressValue > 0 ? 'bg-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.3)]' : 'bg-rose-500 shadow-[0_0_20px_rgba(244,63,94,0.3)]'}`}
                            style={{ width: `${percentage}%` }}
                        ></div>
                    </div>
                </div>
            </div>

            <div className="mt-10 p-6 bg-slate-50 rounded-[2rem] flex items-start gap-4 border border-slate-100">
                <Info className="w-6 h-6 text-indigo-400 shrink-0 mt-1" />
                <p className="text-xs text-slate-500 leading-relaxed font-medium">
                    هذا التحليل يساعدك على تحديد "نقطة التعادل" القصوى، وهو مفيد جداً للمستثمرين الذين يبحثون عن الأمان قبل العائد.
                </p>
            </div>
        </div>
    );
};
