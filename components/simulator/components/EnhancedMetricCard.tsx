import React from 'react';
import { TrendingUp, TrendingDown, Activity, Zap, Shield, Star } from 'lucide-react';

interface MetricCardProps {
  label: string;
  value: string;
  trend?: 'up' | 'down' | 'neutral';
  icon?: React.ReactNode;
  subtitle?: string;
  highlight?: boolean;
  color?: 'indigo' | 'emerald' | 'rose' | 'amber' | 'blue';
}

export const EnhancedMetricCard: React.FC<MetricCardProps> = ({
  label,
  value,
  trend,
  icon,
  subtitle,
  highlight = false,
  color = 'indigo'
}) => {
  const colorClasses = {
    indigo: {
      bg: 'bg-indigo-50',
      bgHighlight: 'bg-gradient-to-br from-indigo-600 to-purple-600',
      text: 'text-indigo-600',
      textHighlight: 'text-white',
      border: 'border-indigo-100',
      shadow: 'shadow-indigo-200/50'
    },
    emerald: {
      bg: 'bg-emerald-50',
      bgHighlight: 'bg-gradient-to-br from-emerald-600 to-teal-600',
      text: 'text-emerald-600',
      textHighlight: 'text-white',
      border: 'border-emerald-100',
      shadow: 'shadow-emerald-200/50'
    },
    rose: {
      bg: 'bg-rose-50',
      bgHighlight: 'bg-gradient-to-br from-rose-600 to-orange-600',
      text: 'text-rose-600',
      textHighlight: 'text-white',
      border: 'border-rose-100',
      shadow: 'shadow-rose-200/50'
    },
    amber: {
      bg: 'bg-amber-50',
      bgHighlight: 'bg-gradient-to-br from-amber-600 to-orange-600',
      text: 'text-amber-600',
      textHighlight: 'text-white',
      border: 'border-amber-100',
      shadow: 'shadow-amber-200/50'
    },
    blue: {
      bg: 'bg-blue-50',
      bgHighlight: 'bg-gradient-to-br from-blue-600 to-cyan-600',
      text: 'text-blue-600',
      textHighlight: 'text-white',
      border: 'border-blue-100',
      shadow: 'shadow-blue-200/50'
    }
  };

  const colors = colorClasses[color];

  return (
    <div
      className={`group relative overflow-hidden rounded-[2rem] p-6 transition-all duration-500 hover:scale-105 ${
        highlight
          ? `${colors.bgHighlight} text-white shadow-2xl ${colors.shadow}`
          : `bg-white border ${colors.border} shadow-sm hover:shadow-xl hover:shadow-${color}-200/30`
      }`}
    >
      {/* Background Pattern */}
      <div className="absolute top-0 right-0 w-32 h-32 opacity-5">
        <div className={`w-full h-full rounded-full bg-gradient-to-br ${colors.bgHighlight} blur-2xl`}></div>
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className={`p-3 rounded-2xl ${highlight ? 'bg-white/20' : colors.bg}`}>
            {icon ? (
              React.cloneElement(icon as React.ReactElement, {
                className: `w-6 h-6 ${highlight ? colors.textHighlight : colors.text}`
              })
            ) : (
              <Activity className={`w-6 h-6 ${highlight ? colors.textHighlight : colors.text}`} />
            )}
          </div>

          {trend && (
            <div
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl ${
                highlight
                  ? 'bg-white/20'
                  : trend === 'up'
                  ? 'bg-emerald-50 text-emerald-600'
                  : trend === 'down'
                  ? 'bg-rose-50 text-rose-600'
                  : 'bg-slate-50 text-slate-600'
              }`}
            >
              {trend === 'up' ? (
                <TrendingUp className="w-4 h-4" />
              ) : trend === 'down' ? (
                <TrendingDown className="w-4 h-4" />
              ) : (
                <Activity className="w-4 h-4" />
              )}
              <span className="text-xs font-black">{trend === 'up' ? 'ممتاز' : trend === 'down' ? 'تحذير' : 'عادي'}</span>
            </div>
          )}
        </div>

        {/* Value */}
        <div className="mb-2">
          <p className={`text-3xl lg:text-4xl font-black tracking-tight ${highlight ? 'text-white' : 'text-slate-900'}`}>
            {value}
          </p>
        </div>

        {/* Label */}
        <p className={`text-sm font-bold mb-1 ${highlight ? 'text-white/80' : 'text-slate-500'}`}>
          {label}
        </p>

        {/* Subtitle */}
        {subtitle && (
          <p className={`text-xs ${highlight ? 'text-white/60' : 'text-slate-400'} font-medium`}>
            {subtitle}
          </p>
        )}
      </div>

      {/* Hover Effect */}
      <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none ${highlight ? 'bg-white/5' : 'bg-gradient-to-br from-transparent via-white/50 to-transparent'}`}></div>
    </div>
  );
};
