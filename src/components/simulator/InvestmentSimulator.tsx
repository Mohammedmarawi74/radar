import React, { useState, useMemo, useEffect } from 'react';
import { Settings } from 'lucide-react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { GeneralTab } from './components/tabs/GeneralTab';
import { StartupTab } from './components/tabs/StartupTab';
import { RealEstateTab } from './components/tabs/RealEstateTab';
import { TabType, InvestmentInput, StartupInput, RealEstateInput } from './types';
import { runSimulation, runMonteCarlo, runStartupSimulation, runRealEstateSimulation } from './utils/finance';
import { getInvestmentInsights } from './services/geminiService';

export const InvestmentSimulator: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('general');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [aiInsights, setAiInsights] = useState<string | null>(null);
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(true);

  // 1. General Investment State
  const [inputs, setInputs] = useState<InvestmentInput>({
    capital: 500000,
    durationYears: 10,
    annualRevenue: 150000,
    annualOpCost: 40000,
    debtPercentage: 30,
    interestRate: 0.05,
    taxRate: 15,
    inflationRate: 2.5
  });

  // 2. Startup State
  const [startupInputs, setStartupInputs] = useState<StartupInput>({
    preMoneyValuation: 5000000,
    investmentAmount: 1000000,
    monthlyBurnRate: 150000,
    monthlyRevenue: 20000,
    revenueGrowthMoM: 15,
    exitTargetValuation: 50000000,
    churnRate: 3
  });

  // 3. Real Estate State
  const [realEstateInputs, setRealEstateInputs] = useState<RealEstateInput>({
    propertyPrice: 1200000,
    renovationCost: 150000,
    unitsCount: 4,
    avgRentPerUnit: 4500,
    vacancyRate: 5,
    managementFeePercent: 7,
    appreciationRate: 4,
    maintenanceCostAnnual: 12000,
    loanToValue: 70,
    interestRate: 0.055,
    loanTermYears: 20,
    selectedCity: 'riyadh',
    hasWhiteLandTax: false,
    saudiRETT: 5,
    brokerageFee: 2.5,
    holdingPeriod: 10,
    constructionCostIncrease: 0,
    projectDelayMonths: 0
  });

  // Calculations
  const results = useMemo(() => runSimulation(inputs), [inputs]);
  const stressTest = useMemo(() => runSimulation(inputs, 0.7, 1.2, 0.03), [inputs]);
  const mcStats = useMemo(() => runMonteCarlo(inputs), [inputs]);

  const startupResults = useMemo(() => runStartupSimulation(startupInputs), [startupInputs]);

  const realEstateResults = useMemo(() => runRealEstateSimulation(realEstateInputs), [realEstateInputs]);
  const baseRealEstateResults = useMemo(() => runRealEstateSimulation({
    ...realEstateInputs,
    constructionCostIncrease: 0,
    projectDelayMonths: 0
  }), [realEstateInputs]);

  const chartData = useMemo(() => {
    if (activeTab === 'startup') return startupResults.monthlyData;
    if (activeTab === 'real_estate') {
      return realEstateResults.propertyValueSeries.map((val, i) => ({
        year: i + 1,
        cum: val,
        cash: realEstateResults.annualCashFlows[i]
      }));
    }
    return results.cashFlows.slice(1).map((cf, i) => {
      const cum = results.cashFlows.slice(0, i + 2).reduce((a, b) => a + b, 0);
      return { year: i + 1, cash: cf, cum };
    });
  }, [activeTab, results, startupResults, realEstateResults]);

  const handleAiInsight = async () => {
    setIsGeneratingAi(true);
    const insights = await getInvestmentInsights(inputs, results, stressTest, mcStats);
    setAiInsights(insights);
    setIsGeneratingAi(false);
  };

  useEffect(() => {
    setAiInsights(null);
  }, [inputs, activeTab]);

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-10 md:py-16">
        <Header activeTab={activeTab} onTabChange={setActiveTab} />

        <main className="relative">
          {activeTab === 'general' && (
            <GeneralTab
              inputs={inputs}
              results={results}
              mcStats={mcStats}
              stressTest={stressTest}
              chartData={chartData}
              aiInsights={aiInsights}
              isGeneratingAi={isGeneratingAi}
              onGenerateAi={handleAiInsight}
            />
          )}

          {activeTab === 'startup' && (
            <StartupTab
              inputs={startupInputs}
              results={startupResults}
              mcStats={mcStats}
              chartData={chartData}
              aiInsights={aiInsights}
              isGeneratingAi={isGeneratingAi}
              onGenerateAi={handleAiInsight}
            />
          )}

          {activeTab === 'real_estate' && (
            <RealEstateTab
              inputs={realEstateInputs}
              results={realEstateResults}
              baseResults={baseRealEstateResults}
              mcStats={mcStats}
              chartData={chartData}
              aiInsights={aiInsights}
              isGeneratingAi={isGeneratingAi}
              onGenerateAi={handleAiInsight}
              onInputChange={(f, v) => setRealEstateInputs(prev => ({ ...prev, [f]: v }))}
            />
          )}

          <button
            onClick={() => setIsSidebarOpen(true)}
            className="fixed bottom-8 left-8 p-6 bg-indigo-600 text-white rounded-[2rem] shadow-2xl hover:bg-indigo-700 transition-all z-[1000] flex items-center gap-3 border-4 border-white transform hover:scale-105 active:scale-95 group"
          >
            <Settings className="w-6 h-6 group-hover:rotate-90 transition-transform duration-500" />
            <span className="font-black text-lg">تغيير الأرقام</span>
          </button>
        </main>

        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          activeTab={activeTab}
          inputs={inputs}
          onInputChange={(f, v) => setInputs(prev => ({ ...prev, [f]: v }))}
          startupInputs={startupInputs}
          onStartupChange={(f, v) => setStartupInputs(prev => ({ ...prev, [f]: v }))}
          realEstateInputs={realEstateInputs}
          onRealEstateChange={(f, v) => setRealEstateInputs(prev => ({ ...prev, [f]: v }))}
        />
      </div>
    </div>
  );
};
