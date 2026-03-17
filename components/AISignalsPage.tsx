/**
 * ======================================
 * AI SIGNALS PAGE - صفحة الإشارات الذكية
 * ======================================
 * 
 * صفحة مدعومة بالكامل بالذكاء الاصطناعي
 * AI-powered signals and insights page
 */

import React, { useState, useEffect } from 'react';
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
    Layout,
    X
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
// MOCK DATA - البيانات التجريبية
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
        id: 'sig_4',
        type: 'opportunity',
        category: 'trend',
        title: 'طفرة في الاستثمار بالذكاء الاصطناعي التوليدي داخل نيوم',
        summary: 'رصد تدفقات مالية ضخمة تتوجه نحو الشركات الناشئة في مجال الذكاء الاصطناعي المستقرة في نيوم، بمعدل نمو شهري يصل إلى 15%.',
        impactScore: 95,
        confidenceLevel: 91,
        timestamp: new Date().toISOString(),
        dataSources: ['نيوم تيك', 'وزارة الاستثمار', 'تقارير الصفقات الخاصة'],
        explanation: {
            why: 'إطلاق صندوق دعم الابتكار الجديد أدى إلى قفزة في التراخيص التقنية وتأسيس مكاتب إقليمية لشركات عالمية.',
            dataUsed: ['تراخيص MISA', 'قيمة صفقات VCs', 'طلبات التوظيف التقني'],
            assumptions: ['استقرار البرنامج الزمني لمشاريع نيوم', 'استمرار الحوافز الضريبية'],
            limitations: ['تركز الاستثمارات في 3 قطاعات فرعية فقط', 'ندرة الخبرات المحلية المتخصصة حالياً']
        },
        insights: [
            'نمو بنسبة 200% في عدد مكاتب شركات الذكاء الاصطناعي الإقليمية.',
            'توقعات بخلق 5000 وظيفة تقنية عالية التخصص بحلول نهاية 2026.',
            'تركز 40% من النشاط في مجال الروبوتات والمدن الذكية.'
        ],
        relatedSectors: ['التقنية', 'الذكاء الاصطناعي', 'الابتكار'],
        relatedRegions: ['نيوم', 'تبوك']
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
        id: 'sig_5',
        type: 'watch',
        category: 'heatmap',
        title: 'تغير جذري في خارطة التوسع العقاري بالمنطقة الغربية',
        summary: 'رصد تزايد الطلب على العقارات التجارية في المدن الثانوية المحيطة بجدة (مثل رابغ وخليص) نتيجة اكتمال مشاريع الربط السككي.',
        impactScore: 72,
        confidenceLevel: 84,
        timestamp: new Date(Date.now() - 43200000).toISOString(),
        dataSources: ['سجل الأراضي', 'بيانات سار (SAR)', 'المخطط الشامل للمدن'],
        explanation: {
            why: 'سهولة الوصول من وإلى جدة قللت الضغط السكني داخل المركز وخلقت مراكز لوجستية جديدة.',
            dataUsed: ['قيم الصفقات في رابغ (+18%)', 'حركات المسافرين اليومية', 'تراخيص البناء الجديدة'],
            assumptions: ['استقرار أسعار الوقود والكهرباء'],
            limitations: ['البيانات لا تشمل الأراضي غير المطورة حالياً']
        },
        insights: [
            'رابغ تسجل أعلى قيمة صفقات للعقارات الصناعية في تاريخها خلال شهر.',
            'زيادة بنسبة 35% في طلبات إيصال الخدمات للمدن الجديدة.',
            'تحول استثماري ملحوظ من جدة نحو المحاور الشمالية.'
        ],
        relatedSectors: ['العقار', 'النقل والخدمات اللوجستية'],
        relatedRegions: ['جدة', 'رابغ', 'المنطقة الغربية']
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
                'العوامل موسمية تم أخذها في الاعتبار'
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
    },
    {
        id: 'sig_6',
        type: 'risk',
        category: 'trend',
        title: 'تذبذب سلاسل الإمداد العالمية وتأثيرها على المواد الإنشائية',
        summary: 'تحذير من نقص محتمل في مواد البناء المتخصصة وتأخر وصول الشحنات نتيجة التوترات في خطوط الملاحة الدولية، مما قد يرفع التكاليف بنسبة 8%.',
        impactScore: 88,
        confidenceLevel: 85,
        timestamp: new Date(Date.now() - 172800000).toISOString(),
        dataSources: ['بيانات الموانئ العالمية', 'عقود التوريد الآجلة', 'نشرات الأسعار العالمية'],
        explanation: {
            why: 'زيادة مدة الشحن البحري بنسبة 12 يومًا مقارنة بالمتوسط السنوي أدت لتراكم الطلبات.',
            dataUsed: ['مؤشر حاويات الموانئ', 'بيانات الاعتمادات المستندية لاستيراد المعادن'],
            assumptions: ['استمرار الاضطرابات الملاحية لمدة 3 أشهر على الأقل'],
            limitations: ['لا يشمل المواد المصنعة محلياً بنسبة 100%']
        },
        insights: [
            'ارتفاع أسعار الحديد المستورد بنسبة 4.5% في أسبوعين.',
            'شركات المقاولات الكبرى تبدأ في تفعيل خطط المخزون الاستراتيجي.',
            'توقعات بتباطؤ تسليم بعض مشاريع الأبراج في الرياض وجدة.'
        ],
        relatedSectors: ['المقاولات والإنشاءات', 'سلاسل الإمداد'],
        relatedRegions: ['المملكة - عام']
    },
    {
        id: 'sig_7',
        type: 'opportunity',
        category: 'pattern',
        title: 'تزايد زخم طروحات الـ IPO في سوق تاسي للعام القادم',
        summary: 'تحليل سلوك الشركات العائلية الكبرى يشير إلى جاهزية 12 شركة جديدة للاكتتاب العام خلال الـ 15 شهراً القادمة، خاصة في قطاعات الرعاية الصحية والتعليم.',
        impactScore: 82,
        confidenceLevel: 75,
        timestamp: new Date(Date.now() - 259200000).toISOString(),
        dataSources: ['إعلانات تداول', 'بيانات هيئة السوق المالية', 'تحليلات البنوك الاستثمارية'],
        explanation: {
            why: 'تحسن مستويات السيولة والرغبة في تعزيز الحوكمة دفعت الشركات نحو الأسواق المالية.',
            dataUsed: ['ملفات طلبات الإدراج تحت المراجعة', 'نمو الأرباح المجمعة للقطاعات المذكورة (+14%)'],
            assumptions: ['استقرار مؤشر تاسي فوق حاجز الـ 12,000 نقطة'],
            limitations: ['عوامل الاقتصاد الكلي قد تؤدي لتأجيل بعض الطروحات']
        },
        insights: [
            'قطاع التعليم يسجل أعلى رغبة في الإدراج لتمويل التوسعات الجديدة.',
            'شركات التقنية المالية (FinTech) تدخل خط المنافسة بقوة لأول مرة.',
            'توقعات بجذب سيولة أجنبية جديدة بقيمة 3 مليار دولار.'
        ],
        relatedSectors: ['السوق المالي', 'البنوك والتمويل'],
        relatedRegions: ['تداول']
    },
    {
        id: 'sig_8',
        type: 'watch',
        category: 'heatmap',
        title: 'تسارع وتيرة مشاريع الطاقة المتجددة في الشمال والشمال الغربي',
        summary: 'رصد تزايد كثافة المشاريع المتعلقة بالطاقة الشمسية وطاقة الرياح في مناطق الجوف والوجه نتيجة اكتمال المرحلة التجريبية بنجاح باهر.',
        impactScore: 76,
        confidenceLevel: 89,
        timestamp: new Date(Date.now() - 345600000).toISOString(),
        dataSources: ['تقارير وزارة الطاقة', 'صور الأقمار الاصطناعية للمواقع', 'مناقصات شركة الكهرباء السعودية'],
        explanation: {
            why: 'انخفاض تكلفة إنتاج الكيلوواط في هذه المناطق لأدنى مستوى عالمي محققاً جدوى اقتصادية قياسية.',
            dataUsed: ['بيانات إنتاج المحطات القائمة', 'عدد تراخيص التوليد الجديدة'],
            assumptions: ['بدء تشغيل شبكات الربط الجديدة في الموعد المحدد'],
            limitations: ['التحديات التقنية المتعلقة بالتخزين الطويل للكهرباء']
        },
        insights: [
            'الجوف تستعد لتكون مركزاً عالمياً لإنتاج الطاقة الشمسية.',
            'اكتمال تركيب 450 توربين رياح جديد بنهاية الربع الأول.',
            'توفير 15% من التكاليف التشغيلية للمصانع القريبة من هذه الحقول.'
        ],
        relatedSectors: ['الطاقة والمرافق', 'الصناعة'],
        relatedRegions: ['الجوف', 'تبوك', 'الوجه']
    },
    {
        id: 'sig_9',
        type: 'opportunity',
        category: 'trend',
        title: 'ثروات التعدين: قفزة في استكشاف الذهب والنحاس بالدرع العربي',
        summary: 'تشير بيانات المسح الجيولوجي الأخيرة إلى وجود احتياطات ضخمة غير مكتشفة في منطقة الدرع العربي، مع اهتمام عالمي متزايد بالاستثمار في قطاع التعدين السعودي.',
        impactScore: 89,
        confidenceLevel: 82,
        timestamp: new Date(Date.now() - 86400000).toISOString(),
        dataSources: ['وزارة الصناعة والثروة المعدنية', 'هيئة المساحة الجيولوجية'],
        explanation: {
            why: 'توفر تقنيات استكشاف جديدة وكشف بيانات جيولوجية دقيقة لأول مرة بطريقة رقمية.',
            dataUsed: ['خرائط المسح المغناطيسي', 'تراخيص الاستكشاف الجديدة (+25%)'],
            assumptions: ['ثبات أسعار المعادن العالمية المستهدفة'],
            limitations: ['الحاجة لاستثمارات ضخمة في البنية التحتية للمناجم']
        },
        insights: [
            'توقعات بزيادة مساهمة التعدين في الناتج المحلي إلى 240 مليار ريال.',
            'اكتشاف 4 مواقع واعدة جداً في منطقة مكة المكرمة والمدينة المنورة.',
            'ارتفاع طلبات الشركات العالمية بنسبة 40% خلال الربع الأخير.'
        ],
        relatedSectors: ['التعدين', 'الصناعة', 'المواد الأساسية'],
        relatedRegions: ['مكة المكرمة', 'المدينة المنورة', 'الدرع العربي']
    },
    {
        id: 'sig_10',
        type: 'opportunity',
        category: 'heatmap',
        title: 'طفرة السياحة الفاخرة: البحر الأحمر يغير موازين الإنفاق السياحي',
        summary: 'رصد زيادة غير مسبوقة في متوسط إنفاق السائح اليومي في جهات البحر الأحمر وأمالا، متجاوزاً المتوسطات الإقليمية بنسبة 60%.',
        impactScore: 91,
        confidenceLevel: 87,
        timestamp: new Date(Date.now() - 172800000).toISOString(),
        dataSources: ['وزارة السياحة', 'بيانات البنوك المحلية (نقاط البيع)', 'شركة البحر الأحمر الدولية'],
        explanation: {
            why: 'افتتاح المنتجعات العالمية وبدء استقبال الرحلات المباشرة لمطار البحر الأحمر الدولي.',
            dataUsed: ['حجم معاملات POS في المنتجعات', 'نسب الإشغال الفعلي (85%+)'],
            assumptions: ['استمرار نمو حركة الطيران الدولي للمنطقة'],
            limitations: ['الموسمية قد تؤثر على البيانات في فترات الصيف']
        },
        insights: [
            'متوسط إقامة السائح ارتفع إلى 5.5 ليالٍ مقارنة بـ 3.2 سابقاً.',
            '65% من السياح هم من الفئات ذات الملاءة المالية العالية جداً.',
            'نمو قطاع الخدمات المساندة (تأجير يخوت، طيران خاص) بنسبة 120%.'
        ],
        relatedSectors: ['السياحة', 'الفندقة والضيافة', 'الترفيه'],
        relatedRegions: ['منطقة البحر الأحمر', 'تبوك', 'أمالا']
    },
    {
        id: 'sig_11',
        type: 'watch',
        category: 'trend',
        title: 'التحول الرقمي: تسارع تبني الخدمات المالية المفتوحة (Open Banking)',
        summary: 'رصد تزايد مضاعف في عدد الربط التقني بين البنوك التقليدية وشركات الفينتك، مما يمهد لثورة في الخدمات التمويلية الشخصية.',
        impactScore: 78,
        confidenceLevel: 93,
        timestamp: new Date(Date.now() - 432000000).toISOString(),
        dataSources: ['البنك المركزي السعودي (ساما)', 'اتحاد الفينتك السعودي'],
        explanation: {
            why: 'دخول اللوائح الجديدة حيز التنفيذ وتحفز الشركات على ابتكار منتجات مبنية على البيانات.',
            dataUsed: ['عدد استدعاءات الـ API البنكية', 'حجم القروض المصغرة الممنوحة آلياً'],
            assumptions: ['ثقة المستخدمين في مشاركة البيانات المالية'],
            limitations: ['تحديات الأمن السيبراني قد تبطئ سرعة التبني']
        },
        insights: [
            'انخفاض وقت الموافقة على القروض الشخصية من 3 أيام إلى 5 دقائق.',
            'ظهور 15 منصة جديدة لإدارة الثروات الشخصية في 6 أشهر.',
            'توقعات بوصول قيمة سوق الفينتك السعودي إلى 12 مليار ريال بحلول 2027.'
        ],
        relatedSectors: ['التقنية المالية', 'البنوك', 'التقنية'],
        relatedRegions: ['المملكة - عام']
    },
    {
        id: 'sig_12',
        type: 'risk',
        category: 'anomaly',
        title: 'ضغوط تضخمية مؤقتة في قطاع الخدمات التعليمية الخاصة',
        summary: 'تحليل تكاليف التشغيل للمدارس الخاصة يظهر ارتفاعاً حاداً في بنود الرواتب والتقنيات، مما قد يؤدي لرفع الرسوم بنسبة 10% العام القادم.',
        impactScore: 84,
        confidenceLevel: 79,
        timestamp: new Date(Date.now() - 604800000).toISOString(),
        dataSources: ['تقارير مالية لشركات تعليمية مدرجة', 'بيانات سوق العمل'],
        explanation: {
            why: 'ارتفاع الطلب على الكوادر التعليمية المتخصصة وزيادة تكاليف الأنظمة الرقمية المطلوبة.',
            dataUsed: ['مؤشر رواتب المعلمين', 'تكاليف تراخيص البرمجيات التعليمية'],
            assumptions: ['استمرار توجه الأسر نحو التعليم النوعي رغم التكلفة'],
            limitations: ['التدخلات التنظيمية لضبط الأسعار قد تحد من الارتفاع']
        },
        insights: [
            'نقص في تخصصات (الذكاء الاصطناعي، العلوم المتقدمة) بالمدارس.',
            'زيادة الاستثمارات في بناء المجمعات التعليمية المتعثرة سابقاً.',
            'ارتفاع تكلفة استقطاب المعلمين الدوليين بنسبة 15%.'
        ],
        relatedSectors: ['التعليم', 'الرعاية والخدمات الاجتماعية'],
        relatedRegions: ['الرياض', 'جدة', 'الخبر']
    },
    {
        id: 'sig_13',
        type: 'opportunity',
        category: 'pattern',
        title: 'ازدهار قطاع التصنيع المتقدم - تقنية الطباعة ثلاثية الأبعاد',
        summary: 'رصد نمط نمو في المصانع التي تتبنى تقنيات الثورة الصناعية الرابعة، خاصة في إنتاج قطع الغيار محلياً للصناعات العسكرية والنفطية.',
        impactScore: 82,
        confidenceLevel: 76,
        timestamp: new Date(Date.now() - 259200000).toISOString(),
        dataSources: ['البرنامج الوطني لتطوير التجمعات الصناعية', 'مودن (MODON)'],
        explanation: {
            why: 'مبادرات توطين الصناعة (اصنع في السعودية) دفعت الشركات لتبني حلول إنتاج مرنة وسريعة.',
            dataUsed: ['عدد المصانع الذكية المسجلة', 'حجم الاستيراد لآلات الطباعة المعدنية'],
            assumptions: ['استمرار الدعم التمويلي لصندوق التنمية الصناعية'],
            limitations: ['الحاجة لتطوير معايير الجودة والمواصفات المحلية']
        },
        insights: [
            'انخفاض وقت استلام قطع الغيار الحرجة بنسبة 70%.',
            'توفير 20% من تكاليف سلاسل الإمداد في قطاع النفط والغاز.',
            'تأسيس أول مجمع متخصص للتصنيع المضاف بالمنطقة الشرقية.'
        ],
        relatedSectors: ['الصناعة', 'التقنية', 'الدفاع'],
        relatedRegions: ['الدمام', 'الجبيل', 'الخفجي']
    },
    {
        id: 'sig_14',
        type: 'watch',
        category: 'trend',
        title: 'نمو قطاع التجارة الإلكترونية العابرة للحدود',
        summary: 'رصد زيادة في حجم الشحنات الواردة لصالح المتاجر المحلية التي تستخدم الرياض كمركز إقليمي للتوزيع نحو الشرق الأوسط.',
        impactScore: 75,
        confidenceLevel: 88,
        timestamp: new Date(Date.now() - 345600000).toISOString(),
        dataSources: ['هيئة الزكاة والضريبة والجمارك', 'البريد السعودي (سبل)'],
        explanation: {
            why: 'تحسين الإجراءات الجمركية وتدشين المناطق اللوجستية المتكاملة في مطار الرياض.',
            dataUsed: ['عدد البيانات الجمركية (شحنات صغيرة)', 'متوسط زمن التخليص'],
            assumptions: ['استقرار قوانين التجارة الإلكترونية الإقليمية'],
            limitations: ['قوة المنافسة من المنصات العالمية الكبرى']
        },
        insights: [
            'الرياض تصبح الوجهة الأولى للمخازن المركزية لشركات التقنية.',
            'زيادة بنسبة 45% في سعة التخزين المبردة المتاحة.',
            'نمو شركات التوصيل "الميل الأخير" بنسبة 30% سنوياً.'
        ],
        relatedSectors: ['التجارة الإلكترونية', 'اللوجستيات', 'البيع بالتجزئة'],
        relatedRegions: ['الرياض', 'جدة', 'الشرقية']
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
    const [showWelcome, setShowWelcome] = useState(() => localStorage.getItem('hideAISignalsWelcome') !== 'true');

    const dismissWelcome = () => {
        setShowWelcome(false);
        localStorage.setItem('hideAISignalsWelcome', 'true');
    };


    const filteredSignals = filter === 'all'
        ? AI_SIGNALS
        : AI_SIGNALS.filter(s => s.type === filter);

    return (
        <div className="max-w-7xl mx-auto space-y-8 p-4 lg:p-8">
            {/* Welcome Banner - Narrower & Optimized */}
            {showWelcome && (
                <div className="bg-white border-2 border-purple-100 rounded-[32px] p-6 lg:p-8 shadow-xl shadow-purple-500/5 relative overflow-hidden group max-w-4xl">
                    <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:scale-110 transition-transform duration-700">
                        <Sparkles size={160} />
                    </div>
                    
                    <button 
                        onClick={dismissWelcome}
                        className="absolute top-6 left-6 p-2 text-slate-400 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 rounded-xl transition-all"
                    >
                        <X size={20} />
                    </button>

                    <div className="flex flex-col lg:flex-row lg:items-center gap-8 relative z-10">
                        <div className="w-20 h-20 bg-purple-600 rounded-[24px] shadow-lg shadow-purple-500/20 flex items-center justify-center shrink-0">
                            <Brain size={40} className="text-white fill-white/20" />
                        </div>
                        <div className="flex-1">
                            <h3 className="text-xl lg:text-2xl font-black text-slate-900 mb-2">مرحباً بك في إشارات السوق الذكية! ✨</h3>
                            <p className="text-slate-500 font-bold text-base max-w-2xl leading-relaxed">
                                هنا نستخدم قوة الذكاء الاصطناعي لتحليل ملايين نقاط البيانات واكتشاف الفرص الاستثمارية والأنماط السوقية الاستباقية التي تساعدك على اتخاذ قرارات مدروسة.
                            </p>
                            <div className="flex items-center gap-4 mt-6">
                                <button 
                                    onClick={dismissWelcome}
                                    className="px-6 py-3 bg-slate-900 text-white rounded-xl font-black text-sm hover:bg-black transition-all"
                                >
                                    فهمت ذلك
                                </button>
                                <button 
                                    className="px-6 py-3 bg-white border border-slate-200 text-slate-600 hover:text-purple-600 hover:border-purple-500 rounded-xl font-black text-sm transition-all flex items-center gap-2"
                                >
                                    <Sparkles size={16} />
                                    اكتشف المزيد
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Enhanced Page Header Card - Premium & Compact */}
            <header className="relative overflow-hidden bg-slate-900 rounded-[32px] p-6 lg:p-8 shadow-xl shadow-slate-900/10 mb-8 mt-4">

                {/* Abstract background blobs */}
                <div className="absolute -top-24 -left-24 w-48 h-48 bg-purple-600/10 rounded-full blur-[60px]" />
                <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-blue-600/10 rounded-full blur-[60px]" />
                
                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex-1 space-y-4 text-right">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 text-purple-400 rounded-full text-[9px] font-black uppercase tracking-widest backdrop-blur-md">
                            <Sparkles size={12} className="animate-pulse" />
                            الذكاء الاستباقي
                        </div>
                        
                        <h1 className="text-2xl lg:text-3xl font-black text-white tracking-tight">
                            إشارات السوق الذكية
                        </h1>
                        
                        <p className="max-w-2xl text-sm text-slate-400 font-bold leading-relaxed">
                            بوصلتكم الذكية لاكتشاف الفرص الاستثمارية الناشئة والتحركات السعرية غير الاعتيادية. نعتمد على الذكاء الاصطناعي لرصد الأنماط المالية بدقة عالية لاتخاذ قرارات استباقية.
                        </p>
                    </div>
                    
                    <div className="flex items-center gap-6 bg-white/5 p-4 rounded-2xl backdrop-blur-md border border-white/5">
                        <div className="flex flex-col items-center px-2">
                            <span className="text-white text-lg font-black">50+</span>
                            <span className="text-[9px] text-slate-500 font-black uppercase">إشارة/يوم</span>
                        </div>
                        <div className="w-px h-8 bg-white/10" />
                        <div className="flex flex-col items-center px-2">
                            <span className="text-white text-lg font-black">95%</span>
                            <span className="text-[9px] text-slate-500 font-black uppercase">دقة التحليل</span>
                        </div>
                        <div className="w-px h-8 bg-white/10" />
                        <div className="flex flex-col items-center px-2">
                            <span className="text-white text-lg font-black">24/7</span>
                            <span className="text-[9px] text-slate-500 font-black uppercase">رصد آلي</span>
                        </div>
                    </div>
                </div>
            </header>

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
