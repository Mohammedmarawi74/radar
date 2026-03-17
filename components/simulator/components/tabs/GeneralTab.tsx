import React from 'react';
import { InvestmentInput, SimulationResult, MonteCarloStats } from '../../types';
import { MetricsDashboard } from '../MetricsDashboard';
import { ChartsSection } from '../ChartsSection';
import { StressTestSection } from '../StressTestSection';
import { AiAnalysisSection } from '../AiAnalysisSection';

interface GeneralTabProps {
    inputs: InvestmentInput;
    results: SimulationResult;
    mcStats: MonteCarloStats;
    stressTest: SimulationResult;
    chartData: any[];
    aiInsights: string | null;
    isGeneratingAi: boolean;
    onGenerateAi: () => void;
}

export const GeneralTab: React.FC<GeneralTabProps> = ({
    inputs, results, mcStats, stressTest, chartData,
    aiInsights, isGeneratingAi, onGenerateAi
}) => {
    return (
        <div className="space-y-10 animate-fadeIn">
            <MetricsDashboard
                activeTab="general"
                results={results}
                mcStats={mcStats}
                startupResults={undefined as any}
                realEstateResults={undefined as any}
            />

            <AiAnalysisSection
                aiInsights={aiInsights}
                isGeneratingAi={isGeneratingAi}
                onGenerate={onGenerateAi}
                mcStats={mcStats}
            />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <ChartsSection activeTab="general" data={chartData} />

                <StressTestSection
                    description="تحليل الحساسية واختبار تحمل المشروع للمتغيرات السلبية."
                    idealValue={results.npv}
                    stressValue={stressTest.npv}
                    labelIdeal="السيناريو المتوقع"
                    labelStress="تحت ضغط الأزمة"
                />
            </div>
        </div>
    );
};
