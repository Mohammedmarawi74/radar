
import React from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  Clock, 
  DollarSign, 
  Activity, 
  ShieldAlert,
  Zap
} from 'lucide-react';
import { ScenarioImpact } from './types';

export const SCENARIO_PRESETS: ScenarioImpact[] = [
  {
    id: 'base',
    name: 'السيناريو المرجعي (Base)',
    revenueChange: 1.0,
    costChange: 1.0,
    interestChange: 0,
    delayYears: 0,
    description: 'الأداء المتوقع بناءً على خطة العمل الحالية دون أي مفاجآت.'
  },
  {
    id: 'optimistic',
    name: 'توسع السوق (Optimistic)',
    revenueChange: 1.25,
    costChange: 0.95,
    interestChange: -0.01,
    delayYears: 0,
    description: 'زيادة الطلب وتحسن في كفاءة التكاليف مع انخفاض الفائدة.'
  },
  {
    id: 'recession',
    name: 'ركود اقتصادي (Recession)',
    revenueChange: 0.7,
    costChange: 1.1,
    interestChange: 0.03,
    delayYears: 1,
    description: 'انخفاض المبيعات، ارتفاع التكاليف التشغيلية وصدمة في أسعار الفائدة.'
  },
  {
    id: 'delayed',
    name: 'تأخر تشغيلي (Delayed)',
    revenueChange: 1.0,
    costChange: 1.15,
    interestChange: 0,
    delayYears: 2,
    description: 'تأخر بدء المشروع لمدة سنتين مع زيادة تكاليف التأسيس.'
  },
  {
    id: 'competition',
    name: 'دخول منافس قوي',
    revenueChange: 0.8,
    costChange: 1.2,
    interestChange: 0,
    delayYears: 0,
    description: 'انخفاض الحصة السوقية واضطرار لزيادة ميزانية التسويق.'
  }
];

export const ICONS = {
  Revenue: <TrendingUp className="w-5 h-5 text-emerald-500" />,
  Costs: <TrendingDown className="w-5 h-5 text-rose-500" />,
  Risk: <AlertTriangle className="w-5 h-5 text-amber-500" />,
  Time: <Clock className="w-5 h-5 text-blue-500" />,
  Profit: <DollarSign className="w-5 h-5 text-indigo-500" />,
  Simulation: <Activity className="w-5 h-5 text-purple-500" />,
  Stress: <ShieldAlert className="w-5 h-5 text-red-600" />,
  WhatIf: <Zap className="w-5 h-5 text-yellow-500" />,
};
