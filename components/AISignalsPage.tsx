/**
 * ======================================
 * AI SIGNALS PAGE - صفحة الإشارات الذكية
 * ======================================
 * 
 * صفحة مدعومة بالكامل بالذكاء الاصطناعي
 * AI-powered signals and insights page
 */

import React, { useState } from 'react';
import {
    Sparkles,
    TrendingUp,
    TrendingDown,
    AlertTriangle,
    Eye,
    Brain,
    Zap,
    Target,
    Activity,
    BarChart3,
    LineChart,
    PieChart,
    MapPin,
    Clock,
    Shield,
    Info,
    ChevronRight,
    Lightbulb,
    Database,
    Cpu,
    CheckCircle2,
    AlertCircle,
    Flame,
    Layout
} from 'lucide-react';

// ============================================
// TYPES - الأنواع
// ============================================

type SignalType = 'opportunity' | 'watch' | 'risk';
type SignalCategory = 'comparison' | 'pattern' | 'heatmap' | 'trend' | 'anomaly';

interface AISignal {
    id: string;
    type: SignalType;
    category: SignalCategory;
    title: string;
    summary: string;
    impactScore: number; // 0-100
    confidenceLevel: number; // 0-100
    timestamp: string;
    dataSources: string[];
    explanation: {
        why: string;
        dataUsed: string[];
        assumptions: string[];
        limitations: string[];
    };
    insights: string[];
    relatedSectors?: string[];
    relatedRegions?: string[];
}

// ============================================
// MOCK DATA - بيانات تجريبية
// ============================================

const AI_SIGNALS: AISignal[] = [
    {
        id: 'sig_1',
        type: 'opportunity',
        category: 'comparison',
        title: 'نمو استثنائي في قطاع اللوجستيات - الرياض تتفوق على جدة بنسبة 45%',
        summary: 'تشير البيانات إلى نمو مستقر في قطاع اللوجستيات مدفوعًا بزيادة الإنفاق الحكومي وتحسن البنية التحتية، مع ارتفاع ملحوظ في عدد المشاريع الجديدة خلال الربع الأخير.',
        impactScore: 92,
        confidenceLevel: 88,
        timestamp: new Date().toISOString(),
        dataSources: ['وزارة النقل', 'الهيئة العامة للإحصاء', 'لوحات Dashboard الداخلية'],
        explanation: {
            why: 'تم رصد تسارع غير طبيعي في معدل نمو المشاريع اللوجستية في منطقة الرياض مقارنة بالفترات السابقة والمناطق الأخرى',
            dataUsed: [
                'عدد المشاريع الجديدة (Q4 2025)',
                'حجم الاستثمارات المعلنة',
                'معدلات النمو التاريخية (2020-2025)',
                'مقارنة جغرافية (الرياض vs جدة vs الدمام)'
            ],
            assumptions: [
                'استمرار الإنفاق الحكومي على البنية التحتية',
                'عدم حدوث تغييرات تنظيمية كبيرة',
                'استقرار الوضع الاقتصادي العام'
            ],
            limitations: [
                'البيانات تعتمد على المشاريع المعلنة فقط',
                'لا تشمل المشاريع الخاصة غير المفصح عنها',
                'التحليل يغطي فترة 6 أشهر فقط'
            ]
        },
        insights: [
            'الرياض شهدت إطلاق 127 مشروع لوجستي جديد في Q4 2025',
            'متوسط حجم الاستثمار للمشروع الواحد: 45 مليون ريال',
            'نمو بنسبة 67% مقارنة بنفس الفترة من العام الماضي',
            'التركيز الأكبر على مراكز التوزيع والمستودعات الذكية'
        ],
        relatedSectors: ['اللوجستيات', 'النقل', 'التجارة الإلكترونية'],
        relatedRegions: ['الرياض', 'جدة', 'الدمام']
    },
    {
        id: 'sig_2',
        type: 'watch',
        category: 'pattern',
        title: 'نمط تاريخي متكرر: السلوك الحالي يشبه ما حدث في 2018 قبل مرحلة نمو',
        summary: 'يظهر التحليل التاريخي تشابهًا كبيرًا بين الأنماط الاقتصادية الحالية وتلك التي سبقت فترة النمو القوي في 2018-2019، مما يشير إلى احتمالية تكرار السيناريو.',
        impactScore: 78,
        confidenceLevel: 72,
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        dataSources: ['البنك المركزي السعودي', 'بيانات تاريخية 2015-2025', 'مؤشرات KPI الزمنية'],
        explanation: {
            why: 'خوارزمية التعرف على الأنماط رصدت تطابقًا بنسبة 84% مع النمط الذي سبق فترة النمو في 2018',
            dataUsed: [
                'مؤشرات الاقتصاد الكلي (2015-2025)',
                'معدلات النمو القطاعية',
                'حجم السيولة في السوق',
                'معدلات الاستثمار الأجنبي المباشر'
            ],
            assumptions: [
                'الظروف الاقتصادية العالمية مستقرة نسبيًا',
                'عدم حدوث صدمات خارجية كبيرة',
                'استمرار السياسات الاقتصادية الحالية'
            ],
            limitations: [
                'التشابه التاريخي لا يضمن تكرار النتائج',
                'الظروف الحالية تختلف في بعض الجوانب عن 2018',
                'عوامل خارجية قد تؤثر على المسار'
            ]
        },
        insights: [
            'مؤشر التشابه: 84% مع نمط 2018',
            'المدة المتوقعة للنمو: 18-24 شهر (بناءً على النمط التاريخي)',
            'القطاعات الأكثر استفادة تاريخيًا: التقنية، العقار، الصناعة',
            'معدل النمو المتوقع: 5-7% سنويًا'
        ],
        relatedSectors: ['جميع القطاعات', 'الاقتصاد الكلي'],
        relatedRegions: ['المملكة - عام']
    },
    {
        id: 'sig_3',
        type: 'risk',
        category: 'anomaly',
        title: 'تباطؤ مفاجئ في معدل نمو السجلات التجارية - قطاع المطاعم',
        summary: 'رصد الذكاء الاصطناعي انخفاضًا غير متوقع بنسبة 23% في عدد السجلات التجارية الجديدة لقطاع المطاعم خلال الشهرين الماضيين، مما يتطلب مراقبة دقيقة.',
        impactScore: 65,
        confidenceLevel: 81,
        timestamp: new Date(Date.now() - 7200000).toISOString(),
        dataSources: ['وزارة التجارة', 'السجلات التجارية', 'بيانات لوحات Dashboard'],
        explanation: {
            why: 'انحراف كبير عن المتوسط المتحرك للأشهر الـ 12 الماضية، مع عدم وجود عوامل موسمية تفسر هذا الانخفاض',
            dataUsed: [
                'عدد السجلات التجارية الجديدة (شهريًا)',
                'المتوسط المتحرك (12 شهر)',
                'البيانات الموسمية التاريخية',
                'معدلات الإغلاق والتجديد'
            ],
            assumptions: [
                'البيانات المتاحة دقيقة وكاملة',
                'لا توجد تأخيرات في تسجيل البيانات',
                'العوامل الموسمية تم أخذها في الاعتبار'
            ],
            limitations: [
                'شهرين فقط من البيانات (فترة قصيرة)',
                'قد يكون تأخيرًا إداريًا وليس اتجاهًا حقيقيًا',
                'لا تتوفر بيانات عن أسباب عدم التسجيل'
            ]
        },
        insights: [
            'الانخفاض: -23% مقارنة بالمتوسط',
            'الفترة: نوفمبر - ديسمبر 2025',
            'المناطق الأكثر تأثرًا: الرياض (-31%)، جدة (-18%)',
            'قطاعات فرعية متأثرة: المطاعم السريعة، المقاهي'
        ],
        relatedSectors: ['المطاعم', 'الضيافة', 'التجزئة'],
        relatedRegions: ['الرياض', 'جدة', 'الدمام']
    }
];

// ============================================
// COMPONENTS - المكونات
// ============================================

/**
 * AI Badge - شارة الذكاء الاصطناعي
 */
const AIBadge: React.FC<{ className?: string }> = ({ className = '' }) => (
    <div className={`inline-flex items-center gap-1.5 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg ${className}`}>
        <Sparkles size={12} className="animate-pulse" />
        <span>مولد بالذكاء الاصطناعي</span>
    </div>
);

/**
 * Signal Type Badge - شارة نوع الإشارة
 */
const SignalTypeBadge: React.FC<{ type: SignalType }> = ({ type }) => {
    const config = {
        opportunity: {
            icon: TrendingUp,
            label: 'فرصة',
            color: 'bg-green-100 text-green-700 border-green-200',
            iconColor: 'text-green-600'
        },
        watch: {
            icon: Eye,
            label: 'مراقبة',
            color: 'bg-yellow-100 text-yellow-700 border-yellow-200',
            iconColor: 'text-yellow-600'
        },
        risk: {
            icon: AlertTriangle,
            label: 'مخاطرة',
            color: 'bg-red-100 text-red-700 border-red-200',
            iconColor: 'text-red-600'
        }
    };

    const { icon: Icon, label, color, iconColor } = config[type];

    return (
        <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold border ${color}`}>
            <Icon size={14} className={iconColor} />
            <span>{label}</span>
        </div>
    );
};

/**
 * Confidence Meter - مقياس الثقة
 */
const ConfidenceMeter: React.FC<{ level: number }> = ({ level }) => {
    return (
        <div className="flex items-center gap-2">
            <div className="flex-1 h-1 bg-gray-100 rounded-full overflow-hidden">
                <div
                    className={`h-full bg-blue-500 transition-all duration-500`}
                    style={{ width: `${level}%` }}
                />
            </div>
            <span className="text-[10px] font-black text-gray-400 whitespace-nowrap">{level}% ثقة</span>
        </div>
    );
};

/**
 * Impact Score - درجة التأثير
 */
const ImpactScore: React.FC<{ score: number }> = ({ score }) => {
    const getColor = () => {
        if (score >= 80) return 'bg-rose-500 text-white';
        if (score >= 60) return 'bg-orange-500 text-white';
        return 'bg-amber-500 text-white';
    };

    return (
        <div className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider ${getColor()} shadow-sm`}>
            {score} Impact
        </div>
    );
};

/**
 * Signal Card - بطاقة الإشارة
 */
const SignalCard: React.FC<{ signal: AISignal; onClick: () => void }> = ({ signal, onClick }) => {
    return (
        <div
            onClick={onClick}
            className="bg-white rounded-2xl border border-gray-100 p-4 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] hover:border-blue-200 transition-all duration-300 cursor-pointer group"
        >
            <div className="flex flex-col h-full">
                {/* Header: Title & Impact */}
                <div className="flex items-start justify-between gap-3 mb-2.5">
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1.5">
                            <SignalTypeBadge type={signal.type} />
                            <ImpactScore score={signal.impactScore} />
                        </div>
                        <h3 className="text-sm md:text-base font-black text-gray-900 leading-snug group-hover:text-blue-600 transition-colors line-clamp-2">
                            {signal.title}
                        </h3>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center shrink-0 border border-gray-100 group-hover:bg-blue-50 group-hover:border-blue-100 transition-colors">
                        <Zap size={18} className="text-gray-300 group-hover:text-blue-500" />
                    </div>
                </div>

                <p className="text-[11px] md:text-xs text-gray-500 leading-relaxed line-clamp-2 mb-4">
                    {signal.summary}
                </p>

                {/* Insights - Scannable */}
                <div className="space-y-1.5 mb-4 bg-gray-50/50 p-2.5 rounded-xl border border-gray-100/50">
                    {signal.insights.slice(0, 2).map((insight, idx) => (
                        <div key={idx} className="flex items-start gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-blue-500/30 mt-1.5 shrink-0" />
                            <span className="text-[10px] font-bold text-gray-600 line-clamp-1">{insight}</span>
                        </div>
                    ))}
                </div>

                {/* Meta & Footer */}
                <div className="mt-auto pt-3 border-t border-gray-50 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <ConfidenceMeter level={signal.confidenceLevel} />
                    </div>
                    <div className="flex items-center gap-1.5 text-[9px] font-black text-gray-400 uppercase tracking-widest">
                        <Clock size={10} />
                        <span>{new Date(signal.timestamp).toLocaleDateString('ar-SA')}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

/**
 * Signal Detail Modal - نافذة تفاصيل الإشارة
 */
const SignalDetailModal: React.FC<{ signal: AISignal; onClose: () => void }> = ({ signal, onClose }) => {
    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
            <div className="bg-white rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl animate-scaleIn">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-8 text-white">
                    <div className="flex items-start justify-between gap-4 mb-4">
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-4">
                                <SignalTypeBadge type={signal.type} />
                                <AIBadge className="bg-white/20 backdrop-blur-sm" />
                            </div>
                            <h2 className="text-2xl font-black leading-tight mb-2">
                                {signal.title}
                            </h2>
                            <p className="text-blue-100 text-sm">
                                {signal.summary}
                            </p>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-white/20 rounded-full transition-colors"
                        >
                            <ChevronRight size={24} className="rotate-90" />
                        </button>
                    </div>

                    {/* Metrics */}
                    <div className="grid grid-cols-2 gap-4 mt-6">
                        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                            <p className="text-blue-100 text-xs font-medium mb-1">درجة التأثير</p>
                            <p className="text-3xl font-black">{signal.impactScore}%</p>
                        </div>
                        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                            <p className="text-blue-100 text-xs font-medium mb-1">مستوى الثقة</p>
                            <p className="text-3xl font-black">{signal.confidenceLevel}%</p>
                        </div>
                    </div>
                </div>

                {/* Body */}
                <div className="p-8 overflow-y-auto max-h-[calc(90vh-300px)] space-y-6">
                    {/* Explanation */}
                    <div className="bg-purple-50 border border-purple-200 rounded-2xl p-6">
                        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <Brain size={20} className="text-purple-600" />
                            التفسير الذكي
                        </h3>

                        <div className="space-y-4">
                            <div>
                                <p className="text-sm font-bold text-gray-700 mb-2">لماذا ظهرت هذه الإشارة؟</p>
                                <p className="text-sm text-gray-600 leading-relaxed">{signal.explanation.why}</p>
                            </div>

                            <div>
                                <p className="text-sm font-bold text-gray-700 mb-2">البيانات المستخدمة:</p>
                                <ul className="space-y-1">
                                    {signal.explanation.dataUsed.map((data, idx) => (
                                        <li key={idx} className="text-sm text-gray-600 flex items-start gap-2">
                                            <Database size={14} className="text-blue-500 mt-0.5 shrink-0" />
                                            <span>{data}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div>
                                <p className="text-sm font-bold text-gray-700 mb-2">الافتراضات:</p>
                                <ul className="space-y-1">
                                    {signal.explanation.assumptions.map((assumption, idx) => (
                                        <li key={idx} className="text-sm text-gray-600 flex items-start gap-2">
                                            <Info size={14} className="text-yellow-500 mt-0.5 shrink-0" />
                                            <span>{assumption}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div>
                                <p className="text-sm font-bold text-gray-700 mb-2">حدود التحليل:</p>
                                <ul className="space-y-1">
                                    {signal.explanation.limitations.map((limitation, idx) => (
                                        <li key={idx} className="text-sm text-gray-600 flex items-start gap-2">
                                            <AlertCircle size={14} className="text-orange-500 mt-0.5 shrink-0" />
                                            <span>{limitation}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Insights */}
                    <div>
                        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <Lightbulb size={20} className="text-yellow-500" />
                            الرؤى الرئيسية
                        </h3>
                        <div className="grid gap-3">
                            {signal.insights.map((insight, idx) => (
                                <div key={idx} className="bg-gray-50 border border-gray-200 rounded-xl p-4 flex items-start gap-3">
                                    <CheckCircle2 size={18} className="text-green-500 shrink-0 mt-0.5" />
                                    <p className="text-sm text-gray-700">{insight}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Data Sources */}
                    <div>
                        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <Shield size={20} className="text-blue-600" />
                            مصادر البيانات الموثوقة
                        </h3>
                        <div className="flex flex-wrap gap-2">
                            {signal.dataSources.map((source, idx) => (
                                <span
                                    key={idx}
                                    className="bg-blue-50 text-blue-700 px-4 py-2 rounded-lg text-sm font-medium border border-blue-200 flex items-center gap-2"
                                >
                                    <Database size={14} />
                                    {source}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// ============================================
// MAIN COMPONENT - المكون الرئيسي
// ============================================

const AISignalsPage: React.FC = () => {
    const [selectedSignal, setSelectedSignal] = useState<AISignal | null>(null);
    const [filter, setFilter] = useState<'all' | SignalType>('all');

    const filteredSignals = filter === 'all'
        ? AI_SIGNALS
        : AI_SIGNALS.filter(s => s.type === filter);

    return (
        <div className="min-h-screen bg-[#f8fafc] p-4 lg:p-6 animate-fadeIn">
            {/* Sleek Minimal Header */}
            <div className="max-w-7xl mx-auto mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4 py-4 px-1">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <Sparkles size={20} className="text-blue-600" />
                        <h1 className="text-2xl font-black text-slate-900 tracking-tight">إشارات السوق الذكية</h1>
                        <span className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded-md text-[10px] font-black uppercase tracking-widest border border-blue-100 shadow-sm">AI Powered</span>
                    </div>
                    <p className="text-slate-500 text-sm font-medium">تحليل فوري وذكي لأهم الفرص والمخاطر في السوق.</p>
                </div>

                {/* Minimal Micro-Badges */}
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5 bg-white px-2.5 py-1.5 rounded-xl border border-slate-200 shadow-sm">
                        <Target size={14} className="text-blue-500" />
                        <span className="text-[10px] font-black text-slate-700">دقة 70%+</span>
                    </div>
                    <div className="flex items-center gap-1.5 bg-white px-2.5 py-1.5 rounded-xl border border-slate-200 shadow-sm">
                        <Activity size={14} className="text-emerald-500" />
                        <span className="text-[10px] font-black text-slate-700">بيانات حية</span>
                    </div>
                </div>
            </div>

            {/* Tabs & Navigation */}
            <div className="max-w-7xl mx-auto mb-6">
                <div className="inline-flex bg-white p-1 rounded-xl border border-slate-200 shadow-sm">
                    {[
                        { id: 'all', label: 'الكل', color: 'text-slate-900', bg: 'bg-slate-100', icon: Layout },
                        { id: 'opportunity', label: 'فرص', color: 'text-emerald-600', bg: 'bg-emerald-50', icon: TrendingUp },
                        { id: 'watch', label: 'مراقبة', color: 'text-amber-600', bg: 'bg-amber-50', icon: Eye },
                        { id: 'risk', label: 'مخاطر', color: 'text-rose-600', bg: 'bg-rose-50', icon: AlertTriangle }
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setFilter(tab.id as any)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-black transition-all duration-200 ${
                                filter === tab.id 
                                ? `${tab.bg} ${tab.color} shadow-sm border border-black/5` 
                                : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'
                            }`}
                        >
                            <tab.icon size={14} />
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Signals Grid */}
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
                {filteredSignals.map(signal => (
                    <SignalCard
                        key={signal.id}
                        signal={signal}
                        onClick={() => setSelectedSignal(signal)}
                    />
                ))}
            </div>

            {/* AI Disclaimer */}
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-2xl p-6">
                <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center shrink-0">
                        <Cpu size={24} className="text-purple-600" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-gray-900 mb-2">حول الذكاء الاصطناعي</h3>
                        <p className="text-sm text-gray-600 leading-relaxed mb-3">
                            جميع الإشارات والتحليلات في هذه الصفحة مولدة بالكامل بواسطة الذكاء الاصطناعي بناءً على مصادر بيانات موثوقة فقط.
                            يتم توضيح مصادر البيانات، الافتراضات، وحدود كل تحليل بشكل شفاف.
                        </p>
                        <div className="flex flex-wrap gap-2">
                            <span className="bg-white text-purple-700 px-3 py-1 rounded-lg text-xs font-bold border border-purple-200">
                                بيانات حكومية موثوقة
                            </span>
                            <span className="bg-white text-blue-700 px-3 py-1 rounded-lg text-xs font-bold border border-blue-200">
                                تفسير شفاف
                            </span>
                            <span className="bg-white text-green-700 px-3 py-1 rounded-lg text-xs font-bold border border-green-200">
                                تحديث مستمر
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Detail Modal */}
            {selectedSignal && (
                <SignalDetailModal
                    signal={selectedSignal}
                    onClose={() => setSelectedSignal(null)}
                />
            )}
        </div>
    );
};

export default AISignalsPage;
