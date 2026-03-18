import React from 'react';
import {
  Wallet,
  Percent,
  Target,
  ShieldCheck,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Info,
  BarChart3,
  Zap
} from 'lucide-react';
import { SimulationResult, MonteCarloStats } from '../../types';
import { EnhancedKPICard, SmartSummary, InputSection, InfoTooltip } from '../ui/SmartComponents';
import { InteractiveSlider, QuickPreset } from '../ui/InteractiveSlider';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';

interface GeneralTabEnhancedProps {
  inputs: any;
  results: SimulationResult;
  mcStats: MonteCarloStats;
  stressTest: SimulationResult;
  chartData: any[];
  onInputChange: (field: string, value: number) => void;
}

export const GeneralTabEnhanced: React.FC<GeneralTabEnhancedProps> = ({
  inputs,
  results,
  mcStats,
  stressTest,
  chartData,
  onInputChange
}) => {
  // Determine verdict based on NPV and IRR
  const getVerdict = () => {
    if (results.npv > 1000000 && results.irr > 0.20) return 'excellent';
    if (results.npv > 0 && results.irr > 0.12) return 'good';
    if (results.npv > -500000 && results.irr > 0.05) return 'caution';
    return 'high-risk';
  };

  const verdict = getVerdict();

  const verdictText = {
    excellent: {
      title: '✅ استثمار ممتاز',
      description: 'المشروع يحقق عوائد استثنائية مع مخاطر منخفضة'
    },
    good: {
      title: '✅ استثمار جيد',
      description: 'المشروع مجدٍ اقتصادياً ويستحق الدراسة'
    },
    caution: {
      title: '⚠️ توخي الحذر',
      description: 'المشروع هامشي ويحتاج لتحليل أعمق'
    },
    'high-risk': {
      title: '🚫 مخاطر عالية',
      description: 'المشروع غير مجدٍ في ظل الظروف الحالية'
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Top Section: Split Screen */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* RIGHT: Input Parameters (4 columns) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-indigo-100 text-indigo-600 rounded-2xl">
              <Target className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-black text-slate-900">مدخلات المشروع</h3>
              <p className="text-sm text-slate-500 font-medium">عدّل الأرقام وشاهد النتائج فوراً</p>
            </div>
          </div>

          {/* Basic Info Section */}
          <InputSection
            title="أساسيات المشروع"
            icon={<Wallet className="w-5 h-5" />}
            description="رأس المال ومدة المشروع"
          >
            <InteractiveSlider
              label="رأس المال"
              value={inputs.capital}
              min={50000}
              max={5000000}
              step={50000}
              unit="ر.س"
              onChange={(v) => onInputChange('capital', v)}
              icon={<Wallet className="w-5 h-5" />}
              color="indigo"
              description="المبلغ المطلوب لبدء المشروع"
            />
            <InteractiveSlider
              label="مدة المشروع"
              value={inputs.durationYears}
              min={1}
              max={25}
              step={1}
              unit="سنة"
              onChange={(v) => onInputChange('durationYears', v)}
              icon={<Target className="w-5 h-5" />}
              color="blue"
              description="الفترة الزمنية للدراسة"
            />
          </InputSection>

          {/* Financials Section */}
          <InputSection
            title="الأداء المالي"
            icon={<TrendingUp className="w-5 h-5" />}
            description="الإيرادات والتكاليف المتوقعة"
          >
            <InteractiveSlider
              label="الإيرادات السنوية"
              value={inputs.annualRevenue}
              min={10000}
              max={2000000}
              step={10000}
              unit="ر.س"
              onChange={(v) => onInputChange('annualRevenue', v)}
              icon={<TrendingUp className="w-5 h-5" />}
              color="emerald"
              description="متوسط الدخل السنوي المتوقع"
            />
            <InteractiveSlider
              label="التكاليف التشغيلية"
              value={inputs.annualOpCost}
              min={5000}
              max={1000000}
              step={5000}
              unit="ر.س"
              onChange={(v) => onInputChange('annualOpCost', v)}
              icon={<BarChart3 className="w-5 h-5" />}
              color="rose"
              description="مصروفات التشغيل السنوية"
            />
          </InputSection>

          {/* Funding Section */}
          <InputSection
            title="التمويل والضرائب"
            icon={<ShieldCheck className="w-5 h-5" />}
            description="نسبة الدين والفائدة والضرائب"
          >
            <InteractiveSlider
              label="نسبة الدين"
              value={inputs.debtPercentage}
              min={0}
              max={100}
              step={5}
              unit="%"
              onChange={(v) => onInputChange('debtPercentage', v)}
              icon={<Percent className="w-5 h-5" />}
              color="amber"
              description="نسبة التمويل بالديون"
            />
            <InteractiveSlider
              label="سعر الفائدة"
              value={inputs.interestRate * 100}
              min={0}
              max={25}
              step={0.5}
              unit="%"
              onChange={(v) => onInputChange('interestRate', v / 100)}
              icon={<TrendingUp className="w-5 h-5" />}
              color="amber"
              description="الفائدة السنوية على القروض"
            />
          </InputSection>
        </div>

        {/* LEFT: Results & KPIs (8 columns) */}
        <div className="lg:col-span-8 space-y-6">
          {/* AI Smart Summary - Auto-generated */}
          <SmartSummary
            verdict={verdict}
            title={verdictText[verdict].title}
            description={verdictText[verdict].description}
            keyMetrics={[
              {
                label: 'صافي القيمة الحالية',
                value: `${Math.round(results.npv).toLocaleString()} ر.س`,
                status: results.npv > 0 ? 'positive' : 'negative'
              },
              {
                label: 'العائد الداخلي',
                value: `${(results.irr * 100).toFixed(1)}%`,
                status: results.irr > 0.12 ? 'positive' : results.irr > 0.05 ? 'neutral' : 'negative'
              },
              {
                label: 'احتمالية الخسارة',
                value: `${mcStats.lossProbability.toFixed(1)}%`,
                status: mcStats.lossProbability < 15 ? 'positive' : 'negative'
              }
            ]}
          />

          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <EnhancedKPICard
              label="صافي القيمة الحالية"
              value={`${Math.round(results.npv).toLocaleString()} ر.س`}
              trend={12.5}
              status={results.npv > 0 ? 'positive' : 'negative'}
              icon={<Wallet className="w-6 h-6" />}
              tooltip="القيمة الحالية للتدفقات النقدية المستقبلية مطروحاً منها الاستثمار الأولي"
              highlight={results.npv > 0}
            />
            <EnhancedKPICard
              label="العائد الداخلي (IRR)"
              value={`${(results.irr * 100).toFixed(1)}%`}
              trend={results.irr * 100 - 10}
              status={results.irr > 0.12 ? 'positive' : results.irr > 0.05 ? 'neutral' : 'negative'}
              icon={<Percent className="w-6 h-6" />}
              tooltip="معدل العائد السنوي المتوقع من المشروع"
            />
            <EnhancedKPICard
              label="فترة الاسترداد"
              value={`${results.paybackPeriod.toFixed(1)} سنة`}
              status={results.paybackPeriod < 5 ? 'positive' : results.paybackPeriod < 10 ? 'neutral' : 'negative'}
              icon={<Target className="w-6 h-6" />}
              tooltip="الوقت اللازم لاستعادة رأس المال المستثمر"
            />
            <EnhancedKPICard
              label="احتمالية الخسارة"
              value={`${mcStats.lossProbability.toFixed(1)}%`}
              trend={-mcStats.lossProbability}
              status={mcStats.lossProbability < 15 ? 'positive' : 'negative'}
              icon={<ShieldCheck className="w-6 h-6" />}
              tooltip="احتمالية خسارة المال بناءً على 1000 سيناريو محاكى"
              highlight={mcStats.lossProbability < 15}
            />
          </div>

          {/* Cash Flow Chart */}
          <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
                  <BarChart3 className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-lg font-black text-slate-900">التدفقات النقدية المتوقعة</h4>
                  <p className="text-sm text-slate-500 font-medium">تطور الأداء المالي عبر السنوات</p>
                </div>
              </div>
              <InfoTooltip content="الرسم البياني يوضح التدفقات النقدية التراكمية المتوقعة طوال عمر المشروع">
                <Info className="w-5 h-5 text-slate-400 hover:text-slate-600 cursor-help" />
              </InfoTooltip>
            </div>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorCash" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis
                    dataKey="year"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#64748b', fontSize: 12 }}
                    dy={10}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#64748b', fontSize: 12 }}
                    dx={-10}
                    tickFormatter={(value) => `${(value / 1000).toFixed(0)}K`}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: '16px',
                      border: 'none',
                      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                    }}
                    formatter={(value: number) => [`${value.toLocaleString()} ر.س`, 'التدفق النقدي']}
                  />
                  <Area
                    type="monotone"
                    dataKey="cum"
                    stroke="#10b981"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorCash)"
                    name="التدفق التراكمي"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* Stress Test Section */}
      <div className="bg-gradient-to-br from-rose-50 via-orange-50 to-amber-50 rounded-[2rem] border-2 border-rose-200 p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-rose-100 text-rose-600 rounded-2xl">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-black text-slate-900">اختبار الضغط وتحليل الحساسية</h3>
            <p className="text-sm text-slate-500 font-medium">
              كيف سيؤثر تدهور الظروف على مشروعك؟
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Scenario Cards */}
          <div className="space-y-4">
            <div className="bg-white rounded-2xl p-5 border border-emerald-200 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle className="w-5 h-5 text-emerald-600" />
                <h4 className="font-black text-slate-900">السيناريو المتفائل</h4>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-slate-500">الإيرادات +30%</span>
                  <span className="text-sm font-bold text-emerald-600">
                    {(results.npv * 1.3).toLocaleString()} ر.س
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-slate-500">التكاليف -20%</span>
                  <span className="text-sm font-bold text-emerald-600">
                    {((results.irr + 0.05) * 100).toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <Target className="w-5 h-5 text-slate-600" />
                <h4 className="font-black text-slate-900">السيناريو الأساسي</h4>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-slate-500">NPV الحالي</span>
                  <span className="text-sm font-bold text-slate-700">
                    {Math.round(results.npv).toLocaleString()} ر.س
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-slate-500">IRR الحالي</span>
                  <span className="text-sm font-bold text-slate-700">
                    {(results.irr * 100).toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-rose-200 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <AlertCircle className="w-5 h-5 text-rose-600" />
                <h4 className="font-black text-slate-900">السيناريو المتشائم</h4>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-slate-500">الإيرادات -30%</span>
                  <span className="text-sm font-bold text-rose-600">
                    {(stressTest.npv).toLocaleString()} ر.س
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-slate-500">التكاليف +40%</span>
                  <span className="text-sm font-bold text-rose-600">
                    {((results.irr - 0.08) * 100).toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Stress Test Chart */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200">
            <h4 className="font-black text-slate-900 mb-4 flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-500" />
              مقارنة السيناريوهات
            </h4>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={[
                    { name: 'متفائل', value: results.npv * 1.3 },
                    { name: 'أساسي', value: results.npv },
                    { name: 'متشائم', value: stressTest.npv }
                  ]}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#64748b', fontSize: 12 }}
                    dy={10}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#64748b', fontSize: 12 }}
                    dx={-10}
                    tickFormatter={(value) => `${(value / 1000).toFixed(0)}K`}
                  />
                  <Tooltip
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                    formatter={(value: number) => [`${Math.round(value).toLocaleString()} ر.س`, 'NPV']}
                  />
                  <Bar
                    dataKey="value"
                    fill="#6366f1"
                    radius={[8, 8, 0, 0]}
                    label={({ value }) => `${(value / 1000).toFixed(0)}K`}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
