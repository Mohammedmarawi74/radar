
import { InvestmentInput, SimulationResult, StartupInput, StartupSimulationResult, RealEstateInput, RealEstateResult } from '../types';

export const calculateNPV = (cashFlows: number[], discountRate: number): number => {
  return cashFlows.reduce((acc, cf, t) => acc + cf / Math.pow(1 + discountRate, t), 0);
};

export const calculateIRR = (cashFlows: number[]): number => {
  let guest = 0.1;
  const maxIterations = 100;
  const precision = 0.0001;

  for (let i = 0; i < maxIterations; i++) {
    const npv = calculateNPV(cashFlows, guest);
    const npvDerivative = cashFlows.reduce((acc, cf, t) => acc - (t * cf) / Math.pow(1 + guest, t + 1), 0);
    const nextGuest = guest - npv / npvDerivative;

    if (Math.abs(nextGuest - guest) < precision) return nextGuest;
    guest = nextGuest;
  }
  return guest;
};

export const generateCashFlows = (input: InvestmentInput, multiplier: number = 1, costMultiplier: number = 1, interestShift: number = 0): number[] => {
  const { capital, durationYears, annualRevenue, annualOpCost, debtPercentage, interestRate, taxRate, inflationRate } = input;
  const cashFlows: number[] = [-capital];

  const debtAmount = capital * (debtPercentage / 100);
  const effectiveInterest = interestRate + interestShift;
  const annualInterestExpense = debtAmount * effectiveInterest;

  for (let t = 1; t <= durationYears; t++) {
    // Apply Inflation to both revenue and costs
    const inflationFactor = Math.pow(1 + (inflationRate / 100), t);
    const revenue = (annualRevenue * multiplier) * inflationFactor;
    const cost = (annualOpCost * costMultiplier) * inflationFactor;

    // Earnings Before Tax (EBT)
    const ebt = revenue - cost - annualInterestExpense;

    // Calculate Tax
    const tax = ebt > 0 ? ebt * (taxRate / 100) : 0;

    // Net Cash Flow
    const net = ebt - tax;
    cashFlows.push(net);
  }
  return cashFlows;
};

export const runSimulation = (input: InvestmentInput, revenueMult = 1, costMult = 1, intShift = 0): SimulationResult => {
  const cashFlows = generateCashFlows(input, revenueMult, costMult, intShift);
  const npv = calculateNPV(cashFlows, 0.1);
  const irr = calculateIRR(cashFlows);

  let payback = -1;
  let cumulative = -input.capital;
  for (let i = 1; i < cashFlows.length; i++) {
    cumulative += cashFlows[i];
    if (cumulative >= 0 && payback === -1) {
      payback = i;
      break;
    }
  }

  return {
    npv,
    irr,
    paybackPeriod: payback,
    totalProfit: cashFlows.reduce((a, b) => a + b, 0),
    cashFlows
  };
};

export const runStartupSimulation = (input: StartupInput): StartupSimulationResult => {
  const postMoney = input.preMoneyValuation + input.investmentAmount;
  const equityStake = (input.investmentAmount / postMoney) * 100;

  let currentCash = input.investmentAmount;
  let currentRevenue = input.monthlyRevenue;
  let runwayMonths = 0;
  const monthlyData = [];

  for (let m = 1; m <= 36; m++) {
    const netBurn = input.monthlyBurnRate - currentRevenue;
    currentCash -= netBurn;

    monthlyData.push({
      month: m,
      cash: Math.max(0, currentCash),
      revenue: currentRevenue,
      burn: input.monthlyBurnRate
    });

    if (currentCash > 0) runwayMonths++;

    // Adjust revenue by growth and churn
    currentRevenue = currentRevenue * (1 + (input.revenueGrowthMoM - input.churnRate) / 100);
  }

  const moic = input.exitTargetValuation / postMoney;
  const roi = (moic - 1) * 100;

  return {
    postMoneyValuation: postMoney,
    equityStake,
    runwayMonths,
    moic,
    roi,
    monthlyData
  };
};

export const runMonteCarlo = (input: InvestmentInput, iterations = 1000) => {
  const results: number[] = [];
  for (let i = 0; i < iterations; i++) {
    const revRand = 0.6 + Math.random() * 0.8;
    const costRand = 0.7 + Math.random() * 0.6;
    const intRand = (Math.random() - 0.5) * 0.08;

    const sim = runSimulation(input, revRand, costRand, intRand);
    results.push(sim.npv);
  }

  const lossCount = results.filter(v => v < 0).length;
  const targetCount = results.filter(v => v > input.capital * 0.5).length;

  const min = Math.min(...results);
  const max = Math.max(...results);
  const range = max - min;
  const binCount = 20;
  const binSize = range / binCount;

  const distribution = Array.from({ length: binCount }).map((_, i) => {
    const binStart = min + i * binSize;
    const binEnd = binStart + binSize;
    const count = results.filter(v => v >= binStart && v < binEnd).length;
    return {
      bin: `${Math.round(binStart / 1000)}k`,
      count
    };
  });

  return {
    meanNpv: results.reduce((a, b) => a + b, 0) / iterations,
    lossProbability: (lossCount / iterations) * 100,
    targetAchievementProb: (targetCount / iterations) * 100,
    distribution
  };
};

export const runRealEstateSimulation = (input: RealEstateInput): RealEstateResult => {
  const rettCost = input.propertyPrice * (input.saudiRETT / 100);
  const brokerageCost = input.propertyPrice * (input.brokerageFee / 100);
  const totalConstructionCost = input.renovationCost * (1 + input.constructionCostIncrease / 100);
  const totalAcquisitionCost = input.propertyPrice + rettCost + brokerageCost + totalConstructionCost;
  const assetValue = input.propertyPrice + totalConstructionCost;
  const loanAmount = assetValue * (input.loanToValue / 100);
  const initialEquity = totalAcquisitionCost - loanAmount;
  const initialInvestment = initialEquity;

  const monthlyRate = input.interestRate / 12;
  const totalPayments = input.loanTermYears * 12;
  const monthlyMortgage = monthlyRate === 0 ? loanAmount / totalPayments :
    (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, totalPayments)) / (Math.pow(1 + monthlyRate, totalPayments) - 1);
  const annualDebtService = monthlyMortgage * 12;

  const annualCashFlows: number[] = [];
  const propertyValueSeries: number[] = [];
  let currentPropertyValue = input.propertyPrice + input.renovationCost;
  const delayYears = input.projectDelayMonths / 12;

  for (let year = 1; year <= input.holdingPeriod; year++) {
    let activeMonths = 12;
    if (year <= Math.ceil(delayYears)) {
      const delayInThisYear = Math.min(12, Math.max(0, input.projectDelayMonths - (year - 1) * 12));
      activeMonths = 12 - delayInThisYear;
    }

    const gpi = input.unitsCount * input.avgRentPerUnit * 12;
    const growthFactor = Math.pow(1 + input.appreciationRate / 100, year - 1);
    const adjustedGpi = gpi * growthFactor * (activeMonths / 12);
    const vacancyLoss = adjustedGpi * (input.vacancyRate / 100);
    const egi = adjustedGpi - vacancyLoss;
    const managementFee = egi * (input.managementFeePercent / 100);
    const maintenance = input.maintenanceCostAnnual * growthFactor * (activeMonths / 12);
    const whiteLandTax = input.hasWhiteLandTax ? (input.propertyPrice * 0.025) : 0;
    const noi = egi - managementFee - maintenance - whiteLandTax;
    const cashFlowBeforeTax = noi - annualDebtService;

    annualCashFlows.push(cashFlowBeforeTax);
    currentPropertyValue = currentPropertyValue * (1 + input.appreciationRate / 100);
    propertyValueSeries.push(currentPropertyValue);
  }

  const finalYear = input.holdingPeriod;
  const salePrice = propertyValueSeries[finalYear - 1];
  const p = finalYear * 12;
  const remainingBalance = monthlyRate === 0 ? Math.max(0, loanAmount - monthlyMortgage * p) :
    (loanAmount * (Math.pow(1 + monthlyRate, totalPayments) - Math.pow(1 + monthlyRate, p))) / (Math.pow(1 + monthlyRate, totalPayments) - 1);
  const netSaleProceeds = salePrice - remainingBalance;

  if (annualCashFlows.length > 0) {
    annualCashFlows[annualCashFlows.length - 1] += netSaleProceeds;
  }

  const allFlows = [-initialInvestment, ...annualCashFlows];
  const irr = calculateIRR(allFlows);
  const npv = calculateNPV(allFlows, 0.1);
  const totalOperatingCashFlow = annualCashFlows.reduce((a, b) => a + b, 0) - netSaleProceeds;
  const avgAnnualCashFlow = totalOperatingCashFlow / input.holdingPeriod;
  const cashOnCash = initialInvestment > 0 ? (avgAnnualCashFlow / initialInvestment) * 100 : 0;
  const y1NOI = (input.unitsCount * input.avgRentPerUnit * 12 * (1 - input.vacancyRate / 100)) - (input.maintenanceCostAnnual);
  const capRate = (y1NOI / totalAcquisitionCost) * 100;
  const totalPos = allFlows.filter(x => x > 0).reduce((a, b) => a + b, 0);
  const totalNeg = Math.abs(allFlows.filter(x => x < 0).reduce((a, b) => a + b, 0));
  const calcEquityMultiple = totalNeg > 0 ? totalPos / totalNeg : 0;

  return {
    npv,
    irr,
    cashOnCash,
    capRate,
    totalEquityMultiple: calcEquityMultiple,
    annualCashFlows,
    cashFlows: allFlows,
    propertyValueSeries,
    occupancyRate: (100 - input.vacancyRate)
  };
};
