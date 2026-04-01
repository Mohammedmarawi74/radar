import React from 'react';
import { Lightbulb, AlertCircle, CheckCircle } from 'lucide-react';
import { RealEstateResult, RealEstateInput } from '../types';

interface SaudiInsightsProps {
    input: RealEstateInput;
    result: RealEstateResult;
}

export const SaudiInsightsSection: React.FC<SaudiInsightsProps> = ({ input, result }) => {
    const insights = [];

    if (result.capRate < 5) {
        insights.push({
            type: 'warning',
            text: `العائد على العقار (${result.capRate.toFixed(1)}%) يعتبر منخفضاً مقارنة بمتوسط السوق في الرياض (6-8%). قد تحتاج لرفع الإيجارات أو تقليل سعر الشراء.`
        });
    } else if (result.capRate > 9) {
        insights.push({
            type: 'success',
            text: `عائد ممتاز! (${result.capRate.toFixed(1)}%) يتفوق على متوسط السوق. تأكد من واقعية افتراضات الشغور والصيانة.`
        });
    }

    if (input.loanToValue > 70) {
        insights.push({
            type: 'info',
            text: `نسبة التمويل ${input.loanToValue}% قد تتجاوز حدود التمويل العقاري للأفراد (غالباً 70% للعقار الثاني أو الاستثماري). تأكد من أهليتك الائتمانية.`
        });
    }

    if (input.hasWhiteLandTax) {
        insights.push({
            type: 'warning',
            text: `تم احتساب رسوم الأراضي البيضاء (2.5%). هذا يؤثر بشكل كبير على صافي الدخل السنوي. هل لديك خطة للتطوير السريع لتجنب الرسوم؟`
        });
    }

    if (input.constructionCostIncrease > 10) {
        insights.push({
            type: 'warning',
            text: `زيادة تكاليف البناء بنسبة ${input.constructionCostIncrease}% خفضت العائد بشكل ملحوظ. حاول تثبيت الأسعار مع المقاولين بعقود طويلة الأجل.`
        });
    }

    if (input.saudiRETT > 5) {
        insights.push({
            type: 'info',
            text: `انتبه: ضريبة التصرفات العقارية عادة 5%. أي زيادة عن ذلك قد تكون غير مستردة وتزيد من تكلفة الاستحواذ.`
        });
    }

    if (insights.length === 0) {
        insights.push({
            type: 'success',
            text: "الأرقام تبدو متوازنة ومنطقية حسب معايير السوق الحالية."
        });
    }

    return (
        <div className="bg-gradient-to-r from-emerald-50 to-teal-50 p-8 rounded-[2.5rem] border border-emerald-100 mt-8">
            <div className="flex items-center gap-3 mb-6">
                <Lightbulb className="w-6 h-6 text-emerald-600" />
                <h3 className="text-lg font-black text-slate-800">تحليلات السوق السعودي 🇸🇦</h3>
            </div>

            <div className="space-y-4">
                {insights.map((insight, idx) => (
                    <div key={idx} className="flex gap-4 items-start bg-white/60 p-4 rounded-2xl border border-emerald-100/50">
                        <div className="mt-1 shrink-0">
                            {insight.type === 'warning' && <AlertCircle className="w-5 h-5 text-amber-500" />}
                            {insight.type === 'success' && <CheckCircle className="w-5 h-5 text-emerald-500" />}
                            {insight.type === 'info' && <InfoIcon className="w-5 h-5 text-blue-500" />}
                        </div>
                        <p className="text-sm font-bold text-slate-700 leading-relaxed">
                            {insight.text}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
};

const InfoIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <circle cx="12" cy="12" r="10" />
        <path d="M12 16v-4" />
        <path d="M12 8h.01" />
    </svg>
);
