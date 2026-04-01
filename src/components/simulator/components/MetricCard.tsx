import React from 'react';

interface MetricCardProps {
    label: string;
    value: string;
    trend?: 'up' | 'down';
    invertTrend?: boolean;
    icon: React.ReactNode;
    subtitle: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
    label, value, trend, invertTrend, icon, subtitle
}) => {
    const isPositive = trend === 'up';
    const colorClass = invertTrend
        ? (isPositive ? 'text-rose-600' : 'text-emerald-600')
        : (isPositive ? 'text-emerald-600' : 'text-rose-600');

    return (
        <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all group flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
                <div className="p-4 bg-slate-50 rounded-[1.25rem] group-hover:bg-indigo-50 transition-colors">
                    {React.cloneElement(icon as React.ReactElement, { className: 'w-6 h-6 text-indigo-500' })}
                </div>
                {trend && (
                    <div className={`flex items-center gap-1 text-[10px] font-black uppercase tracking-widest ${colorClass}`}>
                        {isPositive ? '▲ ممتاز' : '▼ تنبيه'}
                    </div>
                )}
            </div>
            <div>
                <div className="text-2xl font-black text-slate-900 mb-1">{value}</div>
                <div className="text-sm font-bold text-slate-800">{label}</div>
                <div className="text-[10px] text-slate-400 font-bold mt-2 uppercase tracking-tight">{subtitle}</div>
            </div>
        </div>
    );
};
