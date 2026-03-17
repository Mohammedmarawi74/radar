import React from 'react';
import { Wallet, Percent, Target, ShieldCheck, Flame, PieChart as PieIcon, Zap, Landmark, Coins, Building2 } from 'lucide-react';
import { TabType, SimulationResult, MonteCarloStats, StartupSimulationResult, RealEstateResult } from '../types';
import { MetricCard } from './MetricCard';

interface MetricsDashboardProps {
    activeTab: TabType;
    results: SimulationResult;
    mcStats: MonteCarloStats;
    startupResults: StartupSimulationResult;
    realEstateResults: RealEstateResult;
}

export const MetricsDashboard: React.FC<MetricsDashboardProps> = ({
    activeTab, results, mcStats, startupResults, realEstateResults
}) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {activeTab === 'general' && (
                <>
                    <MetricCard label="صافي القيمة الحالية (NPV)" value={`${Math.round(results.npv).toLocaleString()} ر.س`} trend={results.npv > 0 ? 'up' : 'down'} icon={<Wallet />} subtitle="القيمة الفعلية للأرباح اليوم" />
                    <MetricCard label="قوة العائد (IRR)" value={`${(results.irr * 100).toFixed(2)}%`} trend={results.irr > 0.12 ? 'up' : 'down'} icon={<Percent />} subtitle="العائد السنوي المركب" />
                    <MetricCard label="فترة الاسترداد" value={`${results.paybackPeriod} سنوات`} icon={<Target />} subtitle="الوقت لاستعادة رأس المال" />
                    <MetricCard label="احتمالية الخسارة" value={`${mcStats.lossProbability.toFixed(1)}%`} trend={mcStats.lossProbability < 15 ? 'up' : 'down'} icon={<ShieldCheck />} subtitle="بناءً على 1000 سيناريو" invertTrend />
                </>
            )}

            {activeTab === 'startup' && (
                <>
                    <MetricCard label="المدرج النقدي (Runway)" value={`${startupResults.runwayMonths} شهر`} trend={startupResults.runwayMonths > 18 ? 'up' : 'down'} icon={<Flame />} subtitle="قبل نفاذ السيولة" />
                    <MetricCard label="حصة المستثمر" value={`${startupResults.equityStake.toFixed(1)}%`} icon={<PieIcon />} subtitle="ملكيتك في الكاب تابل" />
                    <MetricCard label="مضاعف الربح (MOIC)" value={`${startupResults.moic.toFixed(1)}x`} trend={startupResults.moic > 5 ? 'up' : 'down'} icon={<Zap />} subtitle="توقع العائد عند التخارج" />
                    <MetricCard label="التقييم بعد الاستثمار" value={`${(startupResults.postMoneyValuation / 1000000).toFixed(1)}M`} icon={<Landmark />} subtitle="القيمة السوقية الجديدة" />
                </>
            )}

            {activeTab === 'real_estate' && (
                <>
                    <MetricCard label="صافي القيمة الحالية (NPV)" value={`${Math.round(realEstateResults.npv).toLocaleString()} ر.س`} trend={realEstateResults.npv > 0 ? 'up' : 'down'} icon={<Wallet />} subtitle="القيمة الفعلية" />
                    <MetricCard label="العائد الداخلي (IRR)" value={`${(realEstateResults.irr * 100).toFixed(2)}%`} trend={realEstateResults.irr > 0.10 ? 'up' : 'down'} icon={<Percent />} subtitle="العائد السنوي" />
                    <MetricCard label="الكاش على الكاش (CoC)" value={`${realEstateResults.cashOnCash.toFixed(2)}%`} trend={realEstateResults.cashOnCash > 8 ? 'up' : 'down'} icon={<Coins />} subtitle="العائد النقدي السنوي" />
                    <MetricCard label="معدل الإشغال" value={`${realEstateResults.occupancyRate.toFixed(1)}%`} trend={realEstateResults.occupancyRate > 90 ? 'up' : 'down'} icon={<Building2 />} subtitle="بعد خصم الشواغر" />
                </>
            )}
        </div>
    );
};
