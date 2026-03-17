import React, { useEffect } from 'react';
import { X, Settings, Building2, TrendingUp, Landmark, Rocket, Flame, Target, Coins, Zap } from 'lucide-react';
import { TabType, InvestmentInput, StartupInput, RealEstateInput } from '../types';
import { InputWithSlider } from './InputWithSlider';

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
    activeTab: TabType;

    inputs: InvestmentInput;
    onInputChange: (field: keyof InvestmentInput, value: number) => void;

    startupInputs: StartupInput;
    onStartupChange: (field: keyof StartupInput, value: number) => void;

    realEstateInputs: RealEstateInput;
    onRealEstateChange: (field: keyof RealEstateInput, value: number) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
    isOpen, onClose, activeTab,
    inputs, onInputChange,
    startupInputs, onStartupChange,
    realEstateInputs, onRealEstateChange
}) => {
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [onClose]);

    return (
        <>
            <div
                className={`fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-40 transition-opacity duration-300 md:hidden ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
                onClick={onClose}
            />

            <aside
                className={`fixed top-0 right-0 h-full bg-white/95 backdrop-blur-xl border-l border-slate-200 z-[1001] shadow-2xl transition-transform duration-300 ease-out w-full md:w-[24rem]
            ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
            >
                <div className="h-full flex flex-col">
                    <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-white/50">
                        <div>
                            <h1 className="font-black text-base text-slate-900 flex items-center gap-2">
                                <Settings className="w-4 h-4 text-indigo-600" /> إعدادات المحاكاة
                            </h1>
                            <p className="text-[10px] text-slate-400 font-medium mt-0.5">تحكم بجميع المتغيرات المؤثرة على النتائج</p>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-1.5 bg-slate-50 hover:bg-rose-50 hover:text-rose-600 text-slate-400 rounded-lg transition-all"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto px-5 py-4 space-y-6 pb-20">
                        {activeTab === 'general' && (
                            <div className="space-y-6 animate-fadeIn">
                                <InputGroup title="أساسيات المشروع" icon={<Building2 />}>
                                    <InputWithSlider label="رأس المال المطلوب" value={inputs.capital} min={50000} max={5000000} step={50000} unit="ر.س" onChange={(v) => onInputChange('capital', v)} />
                                    <InputWithSlider label="عمر المشروع" value={inputs.durationYears} min={1} max={25} step={1} unit="سنة" onChange={(v) => onInputChange('durationYears', v)} />
                                </InputGroup>

                                <InputGroup title="الأداء السنوي" icon={<TrendingUp />}>
                                    <InputWithSlider label="الإيرادات السنوية" value={inputs.annualRevenue} min={10000} max={2000000} step={10000} unit="ر.س" onChange={(v) => onInputChange('annualRevenue', v)} />
                                    <InputWithSlider label="التكاليف التشغيلية" value={inputs.annualOpCost} min={5000} max={1000000} step={5000} unit="ر.س" onChange={(v) => onInputChange('annualOpCost', v)} />
                                </InputGroup>

                                <InputGroup title="التمويل والسوق" icon={<Landmark />}>
                                    <InputWithSlider label="نسبة الدين" value={inputs.debtPercentage} min={0} max={100} step={5} unit="%" onChange={(v) => onInputChange('debtPercentage', v)} />
                                    <InputWithSlider label="سعر الفائدة" value={inputs.interestRate * 100} min={0} max={25} step={0.5} unit="%" onChange={(v) => onInputChange('interestRate', v / 100)} />
                                    <InputWithSlider label="نسبة الضرائب" value={inputs.taxRate} min={0} max={45} step={1} unit="%" onChange={(v) => onInputChange('taxRate', v)} />
                                    <InputWithSlider label="معدل التضخم" value={inputs.inflationRate} min={0} max={20} step={0.5} unit="%" onChange={(v) => onInputChange('inflationRate', v)} />
                                </InputGroup>
                            </div>
                        )}

                        {activeTab === 'startup' && (
                            <div className="space-y-6 animate-fadeIn">
                                <InputGroup title="جولة الاستثمار" icon={<Rocket />}>
                                    <InputWithSlider label="تقييم الشركة (Pre-money)" value={startupInputs.preMoneyValuation} min={1000000} max={100000000} step={500000} unit="ر.س" onChange={(v) => onStartupChange('preMoneyValuation', v)} />
                                    <InputWithSlider label="حجم الاستثمار" value={startupInputs.investmentAmount} min={100000} max={20000000} step={100000} unit="ر.س" onChange={(v) => onStartupChange('investmentAmount', v)} />
                                </InputGroup>

                                <InputGroup title="العمليات الشهرية" icon={<Flame />}>
                                    <InputWithSlider label="الحرق الشهري (Burn Rate)" value={startupInputs.monthlyBurnRate} min={10000} max={1000000} step={10000} unit="ر.س" onChange={(v) => onStartupChange('monthlyBurnRate', v)} />
                                    <InputWithSlider label="الإيراد الشهري" value={startupInputs.monthlyRevenue} min={0} max={500000} step={5000} unit="ر.س" onChange={(v) => onStartupChange('monthlyRevenue', v)} />
                                    <InputWithSlider label="النمو الشهري (MoM)" value={startupInputs.revenueGrowthMoM} min={0} max={100} step={1} unit="%" onChange={(v) => onStartupChange('revenueGrowthMoM', v)} />
                                    <InputWithSlider label="نسبة الفقد (Churn Rate)" value={startupInputs.churnRate} min={0} max={20} step={0.5} unit="%" onChange={(v) => onStartupChange('churnRate', v)} />
                                </InputGroup>

                                <InputGroup title="هدف التخارج" icon={<Target />}>
                                    <InputWithSlider label="التقييم المستهدف للبيع" value={startupInputs.exitTargetValuation} min={10000000} max={500000000} step={1000000} unit="ر.س" onChange={(v) => onStartupChange('exitTargetValuation', v)} />
                                </InputGroup>
                            </div>
                        )}

                        {activeTab === 'real_estate' && (
                            <div className="space-y-6 animate-fadeIn">
                                <InputGroup title="العقار والتطوير" icon={<Building2 />}>
                                    <InputWithSlider label="سعر الشراء" value={realEstateInputs.propertyPrice} min={500000} max={20000000} step={100000} unit="ر.س" onChange={(v) => onRealEstateChange('propertyPrice', v)} />
                                    <InputWithSlider label="تكلفة التطوير/الترميم" value={realEstateInputs.renovationCost} min={0} max={5000000} step={50000} unit="ر.س" onChange={(v) => onRealEstateChange('renovationCost', v)} />
                                    <InputWithSlider label="عدد الوحدات" value={realEstateInputs.unitsCount} min={1} max={100} step={1} unit="وحدة" onChange={(v) => onRealEstateChange('unitsCount', v)} />

                                    <div className="p-3 bg-indigo-50/50 rounded-xl border border-indigo-100/50 space-y-3">
                                        <h4 className="text-[10px] font-black text-indigo-500 uppercase tracking-wider flex items-center gap-2">
                                            <Landmark className="w-3 h-3" /> التكاليف الحكومية
                                        </h4>
                                        <InputWithSlider label="ضريبة التصرفات (RETT)" value={realEstateInputs.saudiRETT} min={0} max={10} step={1} unit="%" onChange={(v) => onRealEstateChange('saudiRETT', v)} />
                                        <InputWithSlider label="عمولة السعي" value={realEstateInputs.brokerageFee} min={0} max={5} step={0.5} unit="%" onChange={(v) => onRealEstateChange('brokerageFee', v)} />
                                    </div>
                                </InputGroup>

                                <InputGroup title="الدخل والمصاريف" icon={<Coins />}>
                                    <InputWithSlider label="متوسط الإيجار (للوحدة)" value={realEstateInputs.avgRentPerUnit} min={1000} max={50000} step={500} unit="ر.س" onChange={(v) => onRealEstateChange('avgRentPerUnit', v)} />
                                    <InputWithSlider label="نسبة الشغور" value={realEstateInputs.vacancyRate} min={0} max={50} step={1} unit="%" onChange={(v) => onRealEstateChange('vacancyRate', v)} />
                                    <InputWithSlider label="رسوم الإدارة" value={realEstateInputs.managementFeePercent} min={0} max={20} step={0.5} unit="%" onChange={(v) => onRealEstateChange('managementFeePercent', v)} />
                                    <InputWithSlider label="الصيانة السنوية" value={realEstateInputs.maintenanceCostAnnual} min={1000} max={500000} step={1000} unit="ر.س" onChange={(v) => onRealEstateChange('maintenanceCostAnnual', v)} />
                                </InputGroup>

                                <InputGroup title="التمويل" icon={<Landmark />}>
                                    <InputWithSlider label="نسبة القرض (LTV)" value={realEstateInputs.loanToValue} min={0} max={90} step={5} unit="%" onChange={(v) => onRealEstateChange('loanToValue', v)} />
                                    <InputWithSlider label="فائدة البنك" value={realEstateInputs.interestRate * 100} min={0} max={15} step={0.25} unit="%" onChange={(v) => onRealEstateChange('interestRate', v / 100)} />
                                    <InputWithSlider label="مدة القرض" value={realEstateInputs.loanTermYears} min={5} max={30} step={1} unit="سنة" onChange={(v) => onRealEstateChange('loanTermYears', v)} />
                                </InputGroup>

                                <div className="space-y-3 pt-4 mt-4 border-t border-slate-100 bg-rose-50/30 -mx-5 px-5 py-4">
                                    <h3 className="text-xs font-black text-rose-500 flex items-center gap-2 uppercase tracking-widest"><Zap className="w-3.5 h-3.5" /> محاكاة المخاطر</h3>
                                    <p className="text-[10px] text-slate-500 leading-relaxed mb-3">غيّر هذه القيم لترى تأثير الظروف السيئة على مشروعك</p>
                                    <InputWithSlider label="ارتفاع تكاليف البناء" value={realEstateInputs.constructionCostIncrease} min={0} max={100} step={5} unit="%" onChange={(v) => onRealEstateChange('constructionCostIncrease', v)} />
                                    <InputWithSlider label="تأخر التسليم" value={realEstateInputs.projectDelayMonths} min={0} max={36} step={1} unit="شهر" onChange={(v) => onRealEstateChange('projectDelayMonths', v)} />
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </aside>
        </>
    );
};

const InputGroup: React.FC<{ title: string; icon: React.ReactNode; children: React.ReactNode }> = ({ title, icon, children }) => (
    <div className="space-y-3">
        <h3 className="text-xs font-black text-slate-400 flex items-center gap-2 uppercase tracking-widest sticky top-0 bg-white/95 backdrop-blur-sm py-2 z-10 border-b border-transparent">
            {React.cloneElement(icon as React.ReactElement, { className: 'w-3.5 h-3.5' })} {title}
        </h3>
        <div className="grid grid-cols-1 gap-3">
            {children}
        </div>
    </div>
);
