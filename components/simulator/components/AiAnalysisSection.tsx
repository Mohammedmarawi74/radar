import React from 'react';
import { BrainCircuit, Activity, RefreshCw, Zap } from 'lucide-react';
import { MonteCarloStats } from '../types';

interface AiAnalysisSectionProps {
    aiInsights: string | null;
    isGeneratingAi: boolean;
    onGenerate: () => void;
    mcStats: MonteCarloStats;
}

export const AiAnalysisSection: React.FC<AiAnalysisSectionProps> = ({
    aiInsights, isGeneratingAi, onGenerate, mcStats
}) => {
    return (
        <div className="bg-gradient-to-br from-indigo-900 via-indigo-800 to-slate-900 rounded-[3rem] p-8 md:p-12 text-white shadow-2xl relative overflow-hidden group">
            <div className="absolute -top-24 -left-24 w-96 h-96 bg-indigo-500/10 rounded-full blur-[100px] group-hover:bg-indigo-500/20 transition-all duration-700"></div>
            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-xl border border-white/20">
                            <BrainCircuit className="w-7 h-7 text-indigo-300" />
                        </div>
                        <span className="text-sm font-black uppercase tracking-widest text-indigo-300">تحليل الذكاء الاصطناعي الفوري</span>
                    </div>
                    <h3 className="text-3xl md:text-4xl font-black leading-tight tracking-tight">ما هو القرار الصحيح لهذا المشروع؟</h3>
                    <div className="bg-white/5 border border-white/10 p-6 rounded-[2.5rem] backdrop-blur-3xl">
                        {aiInsights ? (
                            <div className="prose prose-invert max-w-none text-indigo-50/90 leading-relaxed">
                                {aiInsights.split('\n').map((line, i) => <p key={i} className="mb-4 text-base font-medium">{line}</p>)}
                            </div>
                        ) : (
                            <div className="text-center py-6 space-y-4">
                                <Activity className="w-12 h-12 text-indigo-400 mx-auto animate-pulse" />
                                <p className="text-indigo-200/60 text-sm font-medium">الأرقام جاهزة.. اضغط على الزر لنقوم بتشغيل المحرك الذكي</p>
                            </div>
                        )}
                    </div>
                    <button
                        onClick={onGenerate}
                        disabled={isGeneratingAi}
                        className="flex items-center gap-4 px-8 py-4 bg-indigo-500 hover:bg-indigo-400 text-white font-black rounded-3xl transition-all shadow-2xl shadow-indigo-950/50 disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-1 active:scale-95"
                    >
                        {isGeneratingAi ? <RefreshCw className="animate-spin w-6 h-6" /> : <Zap className="w-6 h-6" />}
                        {isGeneratingAi ? "جاري معالجة البيانات..." : "توليد التقرير الاستراتيجي"}
                    </button>
                </div>
                <div className="hidden lg:flex flex-col gap-6">
                    <div className="bg-white/5 p-6 rounded-3xl border border-white/10 backdrop-blur-md">
                        <div className="text-xs text-indigo-300 font-bold mb-2 uppercase">مؤشر المخاطر</div>
                        <div className="text-3xl font-black">{mcStats.lossProbability < 10 ? 'منخفض جداً' : mcStats.lossProbability < 25 ? 'متوسط' : 'مرتفع'}</div>
                    </div>
                    <div className="bg-white/5 p-6 rounded-3xl border border-white/10 backdrop-blur-md">
                        <div className="text-xs text-indigo-300 font-bold mb-2 uppercase">متوسط الربح المحتمل</div>
                        <div className="text-3xl font-black">{Math.round(mcStats.meanNpv).toLocaleString()} <span className="text-sm">ر.س</span></div>
                    </div>
                </div>
            </div>
        </div>
    );
};
