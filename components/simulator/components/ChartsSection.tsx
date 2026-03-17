import React from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { Activity } from 'lucide-react';
import { TabType } from '../types';

interface ChartsSectionProps {
    activeTab: TabType;
    data: any[];
}

export const ChartsSection: React.FC<ChartsSectionProps> = ({ activeTab, data }) => {
    return (
        <div className="bg-white p-8 rounded-[3rem] shadow-sm border border-slate-100">
            <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-black text-slate-800 flex items-center gap-3">
                    <Activity className="w-6 h-6 text-indigo-500" /> مسار النمو المالي
                </h3>
                <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">التدفقات النقدية</div>
            </div>
            <div className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data}>
                        <defs>
                            <linearGradient id="colorMain" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1} />
                                <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                        <XAxis dataKey={activeTab === 'startup' ? "month" : "year"} axisLine={false} tickLine={false} tick={{ fill: '#94A3B8', fontSize: 11 }} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94A3B8', fontSize: 11 }} />
                        <Tooltip contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.1)' }} />
                        <Area type="monotone" dataKey={activeTab === 'startup' ? "cash" : "cum"} stroke="#6366f1" strokeWidth={5} fillOpacity={1} fill="url(#colorMain)" />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};
