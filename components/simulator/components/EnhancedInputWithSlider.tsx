import React, { useState } from 'react';
import { Info, Plus, Minus } from 'lucide-react';

interface InputWithSliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit: string;
  onChange: (v: number) => void;
  description?: string;
  icon?: React.ReactNode;
  color?: 'indigo' | 'emerald' | 'rose' | 'amber' | 'blue';
}

export const EnhancedInputWithSlider: React.FC<InputWithSliderProps> = ({
  label,
  value,
  min,
  max,
  step,
  unit,
  onChange,
  description,
  icon,
  color = 'indigo'
}) => {
  const [showTooltip, setShowTooltip] = useState(false);

  const colorClasses = {
    indigo: 'accent-indigo-600',
    emerald: 'accent-emerald-600',
    rose: 'accent-rose-600',
    amber: 'accent-amber-600',
    blue: 'accent-blue-600'
  };

  const percentage = Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100));

  const handleIncrement = () => {
    onChange(Math.min(max, value + step));
  };

  const handleDecrement = () => {
    onChange(Math.max(min, value - step));
  };

  return (
    <div className="group bg-white rounded-2xl p-4 border border-slate-100 hover:border-slate-200 hover:shadow-lg hover:shadow-slate-200/50 transition-all duration-300">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2 flex-1">
          {icon && (
            <div className="p-2 bg-slate-50 rounded-lg text-slate-400 group-hover:text-slate-600 transition-colors">
              {React.cloneElement(icon as React.ReactElement, { className: 'w-4 h-4' })}
            </div>
          )}
          <div className="space-y-0.5 flex-1">
            <label className="text-sm font-bold text-slate-700 group-hover:text-slate-900 transition-colors">
              {label}
            </label>
            {description && (
              <p className="text-[10px] text-slate-400 font-medium leading-relaxed">{description}</p>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex items-center gap-1">
          <button
            onClick={handleDecrement}
            className="p-1.5 bg-slate-50 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600 transition-all"
            aria-label="إنقاص"
          >
            <Minus size={14} />
          </button>
          <button
            onClick={handleIncrement}
            className="p-1.5 bg-slate-50 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600 transition-all"
            aria-label="زيادة"
          >
            <Plus size={14} />
          </button>
        </div>
      </div>

      {/* Value Input */}
      <div className="flex items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-2 bg-slate-50 px-3 py-2 rounded-xl border border-slate-200 focus-within:border-indigo-500 focus-within:bg-white focus-within:ring-2 focus-within:ring-indigo-100 transition-all">
          <input
            type="number"
            value={value}
            onChange={(e) => onChange(Number(e.target.value))}
            className="w-20 text-right bg-transparent font-black text-slate-900 focus:outline-none text-sm p-0 m-0"
          />
          <span className="text-xs font-bold text-slate-500 select-none">{unit}</span>
        </div>

        {/* Progress Indicator */}
        <div className="flex-1 flex items-center gap-2">
          <div className="relative w-full h-2 bg-slate-100 rounded-full overflow-hidden">
            <div
              className={`h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-300`}
              style={{ width: `${percentage}%` }}
            />
          </div>
          <span className="text-[10px] font-bold text-slate-400 w-8 text-left">{Math.round(percentage)}%</span>
        </div>
      </div>

      {/* Slider */}
      <div className="relative w-full h-8 flex items-center isolate">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className={`absolute w-full h-full opacity-0 cursor-pointer z-20 ${colorClasses[color]}`}
        />
        <div
          className="absolute w-4 h-4 bg-white border-2 border-indigo-600 rounded-full shadow-md pointer-events-none z-10 transition-transform duration-150 group-hover:scale-125"
          style={{
            insetInlineStart: `calc(${percentage}% - 8px)`
          }}
        />
        <div className="absolute w-full h-1.5 bg-slate-100 rounded-full z-0" />
      </div>

      {/* Min/Max Labels */}
      <div className="flex items-center justify-between mt-2">
        <span className="text-[9px] font-bold text-slate-400">{min.toLocaleString()} {unit}</span>
        <span className="text-[9px] font-bold text-slate-400">{max.toLocaleString()} {unit}</span>
      </div>
    </div>
  );
};
