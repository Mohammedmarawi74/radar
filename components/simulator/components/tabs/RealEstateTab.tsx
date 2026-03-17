import React, { useState } from 'react';
import { RealEstateInput, RealEstateResult, MonteCarloStats } from '../../types';
import { MetricsDashboard } from '../MetricsDashboard';
import { ChartsSection } from '../ChartsSection';
import { StressTestSection } from '../StressTestSection';
import { AiAnalysisSection } from '../AiAnalysisSection';
import { SaudiInsightsSection } from '../SaudiInsightsSection';
import { LeafletMap, LocationData } from '../LeafletMap';
import { MapPin, ArrowDown, Calculator, Navigation, MapPinned, X, CheckCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { InputWithSlider } from '../InputWithSlider';

interface RealEstateTabProps {
    inputs: RealEstateInput;
    results: RealEstateResult;
    baseResults: RealEstateResult;
    mcStats: MonteCarloStats;
    chartData: any[];
    aiInsights: string | null;
    isGeneratingAi: boolean;
    onGenerateAi: () => void;
}

interface ExtendedRealEstateTabProps extends RealEstateTabProps {
    onInputChange?: (field: keyof RealEstateInput, value: any) => void;
}

export const RealEstateTab: React.FC<ExtendedRealEstateTabProps> = ({
    inputs, results, baseResults, mcStats, chartData,
    aiInsights, isGeneratingAi, onGenerateAi, onInputChange
}) => {
    const handleChange = onInputChange || ((f, v) => console.log(f, v));
    const [selectedLocation, setSelectedLocation] = useState<LocationData | null>(null);
    const [isMapExpanded, setIsMapExpanded] = useState(true);

    const handleCitySelect = (cityId: string, cityName: string, lat: number, lng: number) => {
        handleChange('selectedCity', cityId);
        setSelectedLocation({
            lat,
            lng,
            displayName: cityName,
            city: cityName
        });
    };

    const handleLocationSelect = (location: LocationData) => {
        setSelectedLocation(location);
    };

    const clearLocation = (e: React.MouseEvent) => {
        e.stopPropagation(); 
        setSelectedLocation(null);
    };

    return (
        <div className="space-y-6 animate-fadeIn pb-12">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                <div className="lg:col-span-12 bg-white rounded-2xl border border-slate-200 overflow-hidden transition-all duration-300">
                    <div
                        onClick={() => setIsMapExpanded(!isMapExpanded)}
                        className="flex items-center justify-between p-4 cursor-pointer hover:bg-slate-50 transition-colors"
                    >
                        <div className="flex items-center gap-3">
                            <div className="bg-indigo-50 p-2 rounded-lg"><MapPin className="w-5 h-5 text-indigo-600" /></div>
                            <div className="flex flex-col">
                                <h2 className="text-lg font-bold text-slate-800">أين يقع عقارك القادم؟</h2>
                                {!isMapExpanded && selectedLocation && (
                                    <div className="flex items-center gap-2 text-xs text-indigo-600 font-medium mt-1 animate-fadeIn">
                                        <CheckCircle className="w-3 h-3" />
                                        تم اختيار: {selectedLocation.neighborhood || selectedLocation.city}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            {isMapExpanded && (
                                <div className="hidden lg:flex items-center gap-2 text-[10px] text-slate-400 bg-white px-2.5 py-1 rounded-full border border-slate-100 shadow-sm mr-4">
                                    <Navigation className="w-3 h-3" />
                                    <span>استخدم القائمة الجانبية لتعديل بيانات المشروع</span>
                                </div>
                            )}
                            <button className="text-slate-400 hover:text-indigo-600 transition-colors">
                                {isMapExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>

                    {isMapExpanded && (
                        <div className="p-4 pt-0 border-t border-slate-100 animate-fadeIn">
                            <div className="mb-4" /> 
                            <LeafletMap
                                selectedCity={inputs.selectedCity || 'riyadh'}
                                onSelectCity={handleCitySelect}
                                onSelectLocation={handleLocationSelect}
                            />

                            {selectedLocation && (
                                <div className="bg-slate-50 p-4 rounded-xl border border-indigo-100 shadow-sm relative overflow-hidden mt-4">
                                    <button
                                        onClick={clearLocation}
                                        className="absolute top-3 left-3 p-1 bg-white hover:bg-rose-50 hover:text-rose-500 rounded-lg transition-all border border-slate-200 z-10"
                                    >
                                        <X className="w-3.5 h-3.5" />
                                    </button>

                                    <div className="relative">
                                        <div className="flex items-center gap-3 mb-3">
                                            <div className="bg-indigo-600 p-2 rounded-lg shadow-sm shadow-indigo-200">
                                                <MapPinned className="w-4 h-4 text-white" />
                                            </div>
                                            <div>
                                                <div className="text-[10px] text-indigo-500 font-bold uppercase tracking-wider">الموقع المحدد</div>
                                                <div className="text-base font-bold text-slate-900">
                                                    {selectedLocation.neighborhood || selectedLocation.city || selectedLocation.displayName.split(',')[0]}
                                                </div>
                                            </div>
                                            <CheckCircle className="w-5 h-5 text-emerald-500 mr-auto" />
                                        </div>

                                        <div className="grid grid-cols-2 gap-2 mt-2">
                                            {selectedLocation.city && (
                                                <div className="bg-white p-2.5 rounded-lg border border-slate-200/60">
                                                    <div className="text-[9px] text-slate-400 font-bold uppercase">المدينة</div>
                                                    <div className="text-xs font-bold text-slate-700">{selectedLocation.city}</div>
                                                </div>
                                            )}
                                            {selectedLocation.neighborhood && (
                                                <div className="bg-white p-2.5 rounded-lg border border-slate-200/60">
                                                    <div className="text-[9px] text-slate-400 font-bold uppercase">الحي</div>
                                                    <div className="text-xs font-bold text-slate-700">{selectedLocation.neighborhood}</div>
                                                </div>
                                            )}
                                            {selectedLocation.street && (
                                                <div className="bg-white p-2.5 rounded-lg border border-slate-200/60 col-span-2">
                                                    <div className="text-[9px] text-slate-400 font-bold uppercase">الشارع</div>
                                                    <div className="text-xs font-bold text-slate-700 truncate">{selectedLocation.street}</div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                <div className="lg:hidden col-span-1 lg:col-span-12 space-y-4">
                    <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-lg shadow-slate-100">
                        <div className="flex items-center gap-2 mb-4 border-b border-slate-50 pb-3">
                            <div className="bg-emerald-50 p-1.5 rounded-lg"><Calculator className="w-4 h-4 text-emerald-600" /></div>
                            <h2 className="text-base font-bold text-slate-800">بيانات المشروع</h2>
                        </div>

                        <div className="space-y-4">
                            <InputWithSlider
                                label="قيمة العقار"
                                value={inputs.propertyPrice}
                                min={200000} max={10000000} step={50000} unit="ر.س"
                                onChange={(v) => handleChange('propertyPrice', v)}
                            />
                            <div className="grid grid-cols-2 gap-3">
                                <InputWithSlider
                                    label="عدد الوحدات"
                                    value={inputs.unitsCount}
                                    min={1} max={50} step={1} unit="وحدة"
                                    onChange={(v) => handleChange('unitsCount', v)}
                                />
                                <InputWithSlider
                                    label="متوسط الإيجار"
                                    value={inputs.avgRentPerUnit}
                                    min={5000} max={200000} step={1000} unit="ر.س"
                                    onChange={(v) => handleChange('avgRentPerUnit', v)}
                                />
                            </div>

                            <div className="pt-3 border-t border-slate-100 flex gap-3">
                                <div className="flex-1 bg-slate-50 p-2.5 rounded-xl text-center">
                                    <div className="text-[10px] text-slate-400 font-bold mb-0.5">الدفعة الأولى</div>
                                    <div className="text-sm font-black text-slate-900">
                                        {Math.round(inputs.propertyPrice * (1 - inputs.loanToValue / 100)).toLocaleString()}
                                    </div>
                                </div>
                                <div className="flex-1 bg-slate-50 p-2.5 rounded-xl text-center">
                                    <div className="text-[10px] text-slate-400 font-bold mb-0.5">القرض المطلوب</div>
                                    <div className="text-sm font-black text-slate-900">
                                        {Math.round(inputs.propertyPrice * (inputs.loanToValue / 100)).toLocaleString()}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex justify-center py-2">
                <div className="bg-white px-4 py-1.5 rounded-full shadow-sm border border-slate-100 text-slate-400 font-bold text-xs flex items-center gap-2">
                    <ArrowDown className="w-3 h-3 animate-bounce" /> نتائج التحليل
                </div>
            </div>

            <div className="bg-slate-50 rounded-3xl p-4 lg:p-8 space-y-8 border border-slate-200/60">
                <MetricsDashboard
                    activeTab="real_estate"
                    results={undefined as any}
                    mcStats={mcStats}
                    startupResults={undefined as any}
                    realEstateResults={results}
                />

                <div className="max-w-5xl mx-auto">
                    <AiAnalysisSection
                        aiInsights={aiInsights}
                        isGeneratingAi={isGeneratingAi}
                        onGenerate={onGenerateAi}
                        mcStats={mcStats}
                    />
                </div>

                <SaudiInsightsSection input={inputs} result={results} />

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <ChartsSection activeTab="real_estate" data={chartData} />
                    <StressTestSection
                        description="ماذا لو تأخر المشروع أو زادت التكاليف؟"
                        idealValue={baseResults.npv}
                        stressValue={results.npv}
                        labelIdeal="الوضع الطبيعي"
                        labelStress="السيناريو الحالي"
                    />
                </div>
            </div>
        </div>
    );
};
