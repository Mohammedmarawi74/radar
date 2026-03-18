import React from 'react';
import { Info, TrendingUp, Shield, AlertCircle, CheckCircle } from 'lucide-react';

interface TooltipProps {
  content: string;
  children: React.ReactNode;
}

export const InfoTooltip: React.FC<TooltipProps> = ({ content, children }) => {
  const [isVisible, setIsVisible] = React.useState(false);

  return (
    <div className="relative inline-block">
      <div
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        className="cursor-help"
      >
        {children}
      </div>
      {isVisible && (
        <div className="absolute bottom-full right-0 mb-2 w-64 p-3 bg-slate-900 text-white text-xs rounded-xl shadow-xl z-50 animate-fadeIn">
          <p className="leading-relaxed">{content}</p>
          <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-slate-900"></div>
        </div>
      )}
    </div>
  );
};

interface SmartSummaryProps {
  verdict: 'excellent' | 'good' | 'caution' | 'high-risk';
  title: string;
  description: string;
  keyMetrics: Array<{ label: string; value: string; status: 'positive' | 'neutral' | 'negative' }>;
  onExpand?: () => void;
}

export const SmartSummary: React.FC<SmartSummaryProps> = ({
  verdict,
  title,
  description,
  keyMetrics,
  onExpand
}) => {
  const verdictConfig = {
    excellent: {
      color: 'from-emerald-600 to-teal-600',
      bg: 'bg-emerald-50',
      border: 'border-emerald-200',
      icon: CheckCircle,
      textColor: 'text-emerald-600'
    },
    good: {
      color: 'from-blue-600 to-indigo-600',
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      icon: CheckCircle,
      textColor: 'text-blue-600'
    },
    caution: {
      color: 'from-amber-600 to-orange-600',
      bg: 'bg-amber-50',
      border: 'border-amber-200',
      icon: AlertCircle,
      textColor: 'text-amber-600'
    },
    'high-risk': {
      color: 'from-rose-600 to-red-600',
      bg: 'bg-rose-50',
      border: 'border-rose-200',
      icon: AlertCircle,
      textColor: 'text-rose-600'
    }
  };

  const config = verdictConfig[verdict];
  const Icon = config.icon;

  return (
    <div className={`rounded-[2rem] border-2 ${config.border} ${config.bg} overflow-hidden`}>
      {/* Header */}
      <div className={`bg-gradient-to-l ${config.color} p-6 text-white`}>
        <div className="flex items-center gap-4">
          <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm">
            <Icon className="w-8 h-8" />
          </div>
          <div className="flex-1">
            <h3 className="text-2xl font-black mb-1">{title}</h3>
            <p className="text-sm text-white/90 font-medium">{description}</p>
          </div>
          {onExpand && (
            <button
              onClick={onExpand}
              className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-xl text-sm font-bold transition-all backdrop-blur-sm"
            >
              عرض التقرير الكامل
            </button>
          )}
        </div>
      </div>

      {/* Key Metrics */}
      <div className="p-6 bg-white">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {keyMetrics.map((metric, idx) => {
            const statusColor =
              metric.status === 'positive'
                ? 'text-emerald-600 bg-emerald-50'
                : metric.status === 'negative'
                ? 'text-rose-600 bg-rose-50'
                : 'text-slate-600 bg-slate-50';

            return (
              <div
                key={idx}
                className={`p-4 rounded-2xl ${statusColor} flex flex-col items-center justify-center text-center`}
              >
                <p className="text-[10px] font-bold uppercase tracking-wider mb-2">{metric.label}</p>
                <p className="text-2xl font-black">{metric.value}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

interface InputSectionProps {
  title: string;
  icon: React.ReactNode;
  description?: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

export const InputSection: React.FC<InputSectionProps> = ({
  title,
  icon,
  description,
  children,
  defaultOpen = true
}) => {
  const [isOpen, setIsOpen] = React.useState(defaultOpen);

  return (
    <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-5 flex items-center justify-between bg-gradient-to-l from-slate-50 to-white hover:bg-slate-100 transition-all"
      >
        <div className="flex items-center gap-4">
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl">{icon}</div>
          <div className="text-right">
            <h4 className="text-lg font-black text-slate-900">{title}</h4>
            {description && <p className="text-sm text-slate-500 font-medium mt-0.5">{description}</p>}
          </div>
        </div>
        <div
          className={`w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center transition-transform duration-300 ${
            isOpen ? 'rotate-180' : ''
          }`}
        >
          <TrendingUp className="w-4 h-4 text-slate-400 rotate-90" />
        </div>
      </button>
      {isOpen && <div className="p-6 space-y-4 animate-fadeIn">{children}</div>}
    </div>
  );
};

interface KPICardProps {
  label: string;
  value: string;
  trend?: number;
  status: 'positive' | 'neutral' | 'negative';
  icon: React.ReactNode;
  tooltip?: string;
  highlight?: boolean;
}

export const EnhancedKPICard: React.FC<KPICardProps> = ({
  label,
  value,
  trend,
  status,
  icon,
  tooltip,
  highlight = false
}) => {
  const statusConfig = {
    positive: {
      bg: 'bg-emerald-50',
      text: 'text-emerald-600',
      border: 'border-emerald-200'
    },
    neutral: {
      bg: 'bg-slate-50',
      text: 'text-slate-600',
      border: 'border-slate-200'
    },
    negative: {
      bg: 'bg-rose-50',
      text: 'text-rose-600',
      border: 'border-rose-200'
    }
  };

  const config = statusConfig[status];

  return (
    <div
      className={`relative p-6 rounded-[2rem] border-2 ${config.border} ${
        highlight ? 'bg-gradient-to-br from-white to-slate-50 shadow-lg shadow-slate-200/50' : config.bg
      } transition-all duration-300 hover:scale-105 hover:shadow-xl`}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-2xl ${config.bg}`}>
          {React.cloneElement(icon as React.ReactElement, {
            className: `w-6 h-6 ${config.text}`
          })}
        </div>
        {tooltip && (
          <InfoTooltip content={tooltip}>
            <Info className="w-5 h-5 text-slate-400 hover:text-slate-600 transition-colors" />
          </InfoTooltip>
        )}
      </div>

      {/* Value */}
      <div className="mb-2">
        <p className={`text-3xl lg:text-4xl font-black ${config.text} tracking-tight`}>{value}</p>
      </div>

      {/* Label */}
      <p className="text-sm font-bold text-slate-600 mb-2">{label}</p>

      {/* Trend */}
      {trend !== undefined && (
        <div
          className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-black ${
            trend >= 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
          }`}
        >
          <TrendingUp className={`w-3.5 h-3.5 ${trend < 0 ? 'rotate-180' : ''}`} />
          {Math.abs(trend)}%
        </div>
      )}
    </div>
  );
};
