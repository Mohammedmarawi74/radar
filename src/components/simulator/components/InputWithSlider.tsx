import React from 'react';

interface InputWithSliderProps {
    label: string;
    value: number;
    min: number;
    max: number;
    step: number;
    unit: string;
    onChange: (v: number) => void;
    description?: string;
}

export const InputWithSlider: React.FC<InputWithSliderProps> = ({
    label, value, min, max, step, unit, onChange, description
}) => (
    <div className="group bg-white rounded-lg p-2.5 border border-slate-100 hover:border-indigo-200 hover:shadow-sm transition-all duration-300">
        <div className="flex justify-between items-end mb-2.5">
            <div className="space-y-0.5">
                <label className="text-xs font-bold text-slate-700 block group-hover:text-indigo-700 transition-colors">
                    {label}
                </label>
                {description && <p className="text-[9px] text-slate-400 font-medium">{description}</p>}
            </div>
            <div className="flex items-center gap-1 bg-slate-50 px-2 py-1 rounded-md border border-slate-200 focus-within:border-indigo-500 focus-within:bg-white focus-within:ring-2 focus-within:ring-indigo-100 transition-all">
                <input
                    type="number"
                    value={value}
                    onChange={(e) => onChange(Number(e.target.value))}
                    className="w-16 text-right bg-transparent font-bold text-slate-900 focus:outline-none text-xs p-0 m-0"
                />
                <span className="text-[9px] font-bold text-slate-500 select-none">{unit}</span>
            </div>
        </div>
        <div className="relative w-full h-3 flex items-center isolate">
            <div className="absolute w-full h-1 bg-slate-100 rounded-full overflow-hidden z-0">
                <div
                    className="h-full bg-indigo-500"
                    style={{ width: `${Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100))}%` }}
                />
            </div>
            <input
                type="range"
                min={min} max={max} step={step}
                value={value}
                onChange={(e) => onChange(Number(e.target.value))}
                className="absolute w-full h-full opacity-0 cursor-pointer z-20"
            />
            <div
                className="absolute w-3 h-3 bg-white border border-indigo-600 rounded-full shadow-sm pointer-events-none z-10 box-border"
                style={{
                    insetInlineStart: `calc(${Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100))}% - 6px)`
                }}
            />
        </div>
    </div>
);
