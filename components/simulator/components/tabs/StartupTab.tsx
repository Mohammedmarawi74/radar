import React from 'react';
import { StartupInput, StartupSimulationResult, MonteCarloStats } from '../../types';
import { MetricsDashboard } from '../MetricsDashboard';
import { ChartsSection } from '../ChartsSection';
import { StressTestSection } from '../StressTestSection';
import { AiAnalysisSection } from '../AiAnalysisSection';

interface StartupTabProps {
    inputs: StartupInput;
    results: StartupSimulationResult;
    mcStats: MonteCarloStats;
    chartData: any[];
    aiInsights: string | null;
    isGeneratingAi: boolean;
    onGenerateAi: () => void;
}

export const StartupTab: React.FC<StartupTabProps> = ({
    inputs, results, mcStats, chartData,
    aiInsights, isGeneratingAi, onGenerateAi
}) => {
    return (
        <div className="space-y-10 animate-fadeIn">
            <MetricsDashboard
                activeTab="startup"
                results={undefined as any}
                mcStats={mcStats}
                startupResults={results}
                realEstateResults={undefined as any}
            />

            <AiAnalysisSection
                aiInsights={aiInsights}
                isGeneratingAi={isGeneratingAi}
                onGenerate={onGenerateAi}
                mcStats={mcStats}
            />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <ChartsSection activeTab="startup" data={chartData} />

                <StressTestSection
                    description="مقارنة التقييم الحالي بالتقييم المتوقع عند التخارج (أو سيناريوهات أخرى)."
                    idealValue={results.postMoneyValuation}
                    stressValue={results.postMoneyValuation} 
                    labelIdeal="التقييم المتوقع"
                    labelStress="التقييم الحالي"
                    unit="ر.س"
                />
            </div>
        </div>
    );
};
