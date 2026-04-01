import React, { useState } from 'react';
import { Plus, Minus } from 'lucide-react';

interface InteractiveSliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit: string;
  onChange: (v: number) => void;
  icon?: React.ReactNode;
  color?: 'indigo' | 'emerald' | 'rose' | 'amber' | 'blue';
  tooltip?: string;
  description?: string;
  showQuickActions?: boolean;
}

export const InteractiveSlider: React.FC<InteractiveSliderProps> = ({
  label,
  value,
  min,
  max,
  step,
  unit,
  onChange,
  icon,
  color = 'indigo',
  tooltip,
  description,
  showQuickActions = true
}) => {
  const percentage = Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100));

  const colorClasses = {
    indigo: 'from-indigo-500 to-purple-500',
    emerald: 'from-emerald-500 to-teal-500',
    rose: 'from-rose-500 to-red-500',
    amber: 'from-amber-500 to-orange-500',
    blue: 'from-blue-500 to-cyan-500'
  };

  const handleIncrement = () => onChange(Math.min(max, value + step));
  const handleDecrement = () => onChange(Math.max(min, value - step));

  return (
    <div className="group bg-white rounded-2xl p-5 border border-slate-100 hover:border-slate-200 hover:shadow-lg transition-all duration-300">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3 flex-1">
          {icon && (
            <div className="p-2.5 bg-slate-50 rounded-xl text-slate-400 group-hover:text-slate-600 transition-colors">
              {React.cloneElement(icon as React.ReactElement, { className: 'w-5 h-5' })}
            </div>
          )}
          <div className="flex-1">
            <label className="text-sm font-bold text-slate-700 group-hover:text-slate-900 transition-colors">
              {label}
            </label>
            {description && (
              <p className="text-[10px] text-slate-400 font-medium mt-0.5 leading-relaxed">{description}</p>
            )}
          </div>
        </div>

        {/* Value Display */}
        <div className="flex items-center gap-2 bg-gradient-to-l from-slate-50 to-white px-4 py-2.5 rounded-xl border border-slate-200 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-100 transition-all">
          <input
            type="number"
            value={value}
            onChange={(e) => onChange(Number(e.target.value))}
            className="w-24 text-right bg-transparent font-black text-slate-900 focus:outline-none text-sm p-0 m-0"
          />
          <span className="text-xs font-bold text-slate-500 select-none">{unit}</span>
        </div>
      </div>

      {/* Slider Track */}
      <div className="relative w-full h-12 flex items-center isolate mb-3">
        {/* Background Track */}
        <div className="absolute w-full h-2 bg-slate-100 rounded-full z-0"></div>

        {/* Active Track */}
        <div
          className={`absolute h-2 bg-gradient-to-r ${colorClasses[color]} rounded-full z-0 transition-all duration-300`}
          style={{ width: `${percentage}%` }}
        ></div>

        {/* Invisible Range Input */}
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="absolute w-full h-full opacity-0 cursor-pointer z-20"
        />

        {/* Thumb */}
        <div
          className={`absolute w-5 h-5 bg-white border-2 border-slate-300 rounded-full shadow-md pointer-events-none z-10 transition-all duration-150 group-hover:scale-125 group-hover:border-indigo-600`}
          style={{
            insetInlineStart: `calc(${percentage}% - 10px)`
          }}
        />

        {/* Pulse Effect */}
        <div
          className={`absolute w-5 h-5 bg-gradient-to-r ${colorClasses[color]} rounded-full opacity-20 animate-ping pointer-events-none z-0`}
          style={{
            insetInlineStart: `calc(${percentage}% - 10px)`
          }}
        />
      </div>

      {/* Min/Max Labels */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-[9px] font-bold text-slate-400">{min.toLocaleString()} {unit}</span>
        <span className="text-[9px] font-bold text-slate-400">{max.toLocaleString()} {unit}</span>
      </div>

      {/* Quick Actions */}
      {showQuickActions && (
        <div className="flex items-center gap-2 pt-3 border-t border-slate-100">
          <button
            onClick={handleDecrement}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-slate-50 hover:bg-slate-100 rounded-xl text-slate-600 hover:text-slate-800 transition-all font-bold text-sm"
          >
            <Minus size={16} />
            إنقاص
          </button>
          <button
            onClick={handleIncrement}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-indigo-50 hover:bg-indigo-100 rounded-xl text-indigo-600 hover:text-indigo-800 transition-all font-bold text-sm"
          >
            <Plus size={16} />
            زيادة
          </button>
        </div>
      )}
    </div>
  );
};

interface QuickPresetProps {
  label: string;
  value: number;
  isSelected: boolean;
  onClick: () => void;
  icon?: React.ReactNode;
}

export const QuickPreset: React.FC<QuickPresetProps> = ({
  label,
  value,
  isSelected,
  onClick,
  icon
}) => {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-3 px-4 py-3 rounded-2xl border-2 transition-all duration-300 ${
        isSelected
          ? 'border-indigo-600 bg-indigo-50 text-indigo-700 shadow-md shadow-indigo-200/50'
          : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50'
      }`}
    >
      {icon && React.cloneElement(icon as React.ReactElement, { className: 'w-5 h-5' })}
      <div className="text-right">
        <p className="text-sm font-black">{label}</p>
        <p className="text-[10px] font-bold opacity-75">{value.toLocaleString()}</p>
      </div>
    </button>
  );
};
