
export interface InvestmentInput {
  capital: number;
  durationYears: number;
  annualRevenue: number;
  annualOpCost: number;
  debtPercentage: number;
  interestRate: number;
  taxRate: number;
  inflationRate: number;
}

export interface StartupInput {
  preMoneyValuation: number;
  investmentAmount: number;
  monthlyBurnRate: number;
  monthlyRevenue: number;
  revenueGrowthMoM: number;
  exitTargetValuation: number;
  churnRate: number;
}

export interface RealEstateInput {
  propertyPrice: number;
  renovationCost: number;
  unitsCount: number;
  avgRentPerUnit: number;
  vacancyRate: number;
  managementFeePercent: number; // New: Management fee as % of collected rent
  appreciationRate: number;
  maintenanceCostAnnual: number;
  loanToValue: number; // LTV %
  interestRate: number;
  loanTermYears: number;

  // Market Context
  selectedCity: string; // e.g., 'riyadh', 'jeddah', 'dammam'

  // Saudi Market Specifics
  hasWhiteLandTax: boolean; //رسوم الأراضي البيضاء
  saudiRETT: number; // ضريبة التصرفات العقارية (Default 5%)
  brokerageFee: number; // السعي (Default 2.5%)

  holdingPeriod: number; // Years to hold before selling

  // "What If" Scenarios
  constructionCostIncrease: number; // %
  projectDelayMonths: number;
}

export interface StartupSimulationResult {
  postMoneyValuation: number;
  equityStake: number;
  runwayMonths: number;
  moic: number;
  roi: number;
  monthlyData: { month: number; cash: number; revenue: number; burn: number }[];
}

export interface RealEstateResult {
  npv: number;
  irr: number;
  cashOnCash: number;
  capRate: number;
  totalEquityMultiple: number;
  annualCashFlows: number[];
  cashFlows: number[]; // Full 0-N flows
  propertyValueSeries: number[];
  occupancyRate: number;
}

export type TabType = 'general' | 'startup' | 'real_estate';

export enum ScenarioType {
  BASE = 'BASE',
  OPTIMISTIC = 'OPTIMISTIC',
  PESSIMISTIC = 'PESSIMISTIC',
  RECESSION = 'RECESSION',
  HYPER_INFLATION = 'HYPER_INFLATION',
  DELAYED_START = 'DELAYED_START'
}

export interface ScenarioImpact {
  id: string;
  name: string;
  revenueChange: number;
  costChange: number;
  interestChange: number;
  delayYears: number;
  description: string;
}

export interface SimulationResult {
  npv: number;
  irr: number;
  paybackPeriod: number;
  totalProfit: number;
  cashFlows: number[];
}

export interface MonteCarloStats {
  meanNpv: number;
  lossProbability: number;
  targetAchievementProb: number;
  distribution: { bin: string; count: number }[];
}
