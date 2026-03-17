import { 
  Compass, 
  Users, 
  Home, 
  MapPin, 
  TrendingUp, 
  PieChart, 
  Target, 
  CreditCard, 
  Activity, 
  Truck,
  LucideIcon 
} from 'lucide-react';

export interface DataField {
  label: string;
  key: string;
  type: 'metric' | 'table' | 'chart';
}

export interface Dataset {
  name: string;
  description: string;
  source: string;
  lastUpdated: string;
  coverage: string;
  dataType: string;
}

export interface DataAngle {
  id: string;
  title: string;
  description: string;
  shortDescription: string;
  icon: LucideIcon;
  badge?: string;
  explanation: string;
  insightSummary: string;
  sources: string[];
  fields: DataField[];
  datasets: Dataset[];
  color: string;
}

export const DATA_ANGLES: DataAngle[] = [
  {
    id: 'unserved-demand',
    title: 'الطلب غير الملبى',
    shortDescription: 'تحديد المناطق التي يتجاوز فيها الطلب العرض المتاح.',
    description: 'تحليل الفجوات بين احتياجات المستهلكين والخدمات المتوفرة حالياً لاكتشاف الفرص الاستثمارية الكامنة.',
    icon: Compass,
    badge: 'فرصة عالية',
    color: 'blue',
    explanation: 'تساعد هذه الزاوية المستثمرين على فهم الفجوات في السوق السعودي من خلال مقارنة حجم الطلب الفعلي بالطلبات المكتملة.',
    insightSummary: 'أكثر من 25% من طلبات الخدمات اللوجستية في المناطق الواعدة لا تزال غير ملباة بشكل كامل.',
    sources: ['وزارة التجارة', 'وزارة الشؤون البلدية والقروية والإسكان'],
    fields: [
      { label: 'حجم الطلب لكل منطقة', key: 'demand_volume', type: 'metric' },
      { label: 'الطلبات المكتملة مقابل غير الملباة', key: 'completed_vs_unserved', type: 'chart' },
      { label: 'تاريخ الطلب', key: 'request_date', type: 'metric' },
      { label: 'القطاع التجاري', key: 'business_sector', type: 'table' },
      { label: 'نوع المنتج/الخدمة', key: 'product_service_type', type: 'table' },
      { label: 'إحصائيات فجوة التغطية', key: 'coverage_gap', type: 'chart' },
      { label: 'مؤشرات النمو', key: 'growth_indicators', type: 'metric' }
    ],
    datasets: [
      {
        name: 'قاعدة بيانات الطلبات التجارية الموحدة',
        description: 'سجل شامل لطلبات الخدمات والمنتجات عبر المنصات الحكومية.',
        source: 'وزارة التجارة',
        lastUpdated: '2026-03-10',
        coverage: 'جميع مناطق المملكة',
        dataType: 'Statistical'
      }
    ]
  },
  {
    id: 'comm-pop-growth',
    title: 'النمو السكاني التجاري',
    shortDescription: 'تتبع الكثافة السكانية والنمو السنوي للمجتمعات التجارية.',
    description: 'رصد التحولات الديموغرافية ومعدلات النمو السكاني في المناطق الاقتصادية لتحديد مراكز الاستهلاك المستقبلية.',
    icon: Users,
    badge: 'نمو سريع',
    color: 'green',
    explanation: 'توفر هذه الرؤية تحليلاً لديموغرافية المستهلكين وتركيبتهم العمرية في المدن السعودية الكبرى.',
    insightSummary: 'تشهد المناطق المحيطة بمشاريع الرؤية الكبرى نمواً سكانياً تجارياً يتجاوز 15% سنوياً.',
    sources: ['الهيئة العامة للإحصاء', 'وزارة الموارد البشرية'],
    fields: [
      { label: 'السكان حسب العمر والجنس والمنطقة', key: 'pop_age_gender_region', type: 'table' },
      { label: 'حجم السكان التجاري', key: 'comm_pop_size', type: 'metric' },
      { label: 'معدلات النمو السنوية', key: 'annual_growth_rates', type: 'chart' },
      { label: 'سكان المدن/المناطق الاقتصادية', key: 'city_econ_zone_pop', type: 'table' },
      { label: 'عدد الأسر', key: 'household_count', type: 'metric' },
      { label: 'بيانات سوق العمل', key: 'labor_market_data', type: 'chart' }
    ],
    datasets: [
      {
        name: 'تعداد السعودية الرقمي 2024-2025',
        description: 'بيانات ديموغرافية تفصيلية محدثة تعتمد على التحول الرقمي.',
        source: 'الهيئة العامة للإحصاء',
        lastUpdated: '2026-01-15',
        coverage: 'المستوي الوطني والمناطق',
        dataType: 'Transactional'
      }
    ]
  },
  {
    id: 'real-estate-opps',
    title: 'الفرص العقارية',
    shortDescription: 'اكتشاف النقاط العقارية الساخنة بناءً على العرض والطلب.',
    description: 'تحليل تصاريح البناء، قيم الصفقات، وتوزيعات الأراضي لتحديد أفضل المناطق للاستثمار العقاري.',
    icon: Home,
    badge: 'قيمة عالية',
    color: 'amber',
    explanation: 'تركز هذه الزاوية على حركة السوق العقاري السعودي من خلال ربط التراخيص بالصفقات الفعلية.',
    insightSummary: 'هناك طلب متزايد على المساحات المكتبية في شمال الرياض يتجاوز المعروض الحالي بنسبة 12%.',
    sources: ['وزارة الإسكان', 'وزارة الشؤون البلدية والقروية والإسكان', 'وزارة التجارة'],
    fields: [
      { label: 'تصاريح البناء', key: 'construction_permits', type: 'metric' },
      { label: 'العقارات المباعة/المؤجرة', key: 'sold_rented_properties', type: 'table' },
      { label: 'قيم العقارات', key: 'property_values', type: 'chart' },
      { label: 'توزيع الأراضي حسب النشاط', key: 'land_dist_activity', type: 'table' },
      { label: 'مؤشرات العرض مقابل الطلب', key: 'supply_demand_indicators', type: 'metric' },
      { label: 'مشاريع التطوير الجديدة', key: 'new_dev_projects', type: 'chart' }
    ],
    datasets: [
      {
        name: 'مؤشر الصفقات العقارية اليومي',
        description: 'بيانات حية للصفقات العقارية المسجلة في وزارة العدل.',
        source: 'وزارة العدل',
        lastUpdated: 'مباشر',
        coverage: 'المناطق والمدن',
        dataType: 'Transactional'
      }
    ]
  },
  {
    id: 'emerging-regions',
    title: 'المناطق الاقتصادية الناشئة',
    shortDescription: 'تحديد المناطق ذات الاستثمارات الحكومية المكثفة والنمو في البنية التحتية.',
    description: 'رصد المناطق التي تشهد تدفقات استثمارية عالية ومشاريع بنية تحتية جديدة لضمان السبق في الموقع.',
    icon: MapPin,
    badge: 'رؤية 2030',
    color: 'indigo',
    explanation: 'تتبع هذه الرؤية توزيع المشاريع الاستثمارية والشركات الجديدة المسجلة في المناطق الاقتصادية الخاصة.',
    insightSummary: 'المنطقة الشرقية سجلت أعلى معدل لنمو الشركات اللوجستية الجديدة هذا الربع بفضل التسهيلات الجديدة.',
    sources: ['وزارة الاستثمار', 'وزارة النقل', 'وزارة الاقتصاد والتخطيط'],
    fields: [
      { label: 'مؤشرات النمو الإقليمي', key: 'regional_growth_indicators', type: 'chart' },
      { label: 'عدد المشاريع الاستثمارية', key: 'investment_projects_count', type: 'metric' },
      { label: 'حجم الاستثمار', key: 'investment_volume', type: 'metric' },
      { label: 'الشركات المسجلة حديثاً', key: 'newly_registered_companies', type: 'table' },
      { label: 'بيانات البنية التحتية', key: 'infrastructure_data', type: 'table' },
      { label: 'الأداء اللوجستي', key: 'logistics_performance', type: 'chart' }
    ],
    datasets: [
      {
        name: 'خارطة المشاريع الكبرى (Giga Projects)',
        description: 'بيانات تقدم العمل والاستثمارات في مشاريع مثل نيوم، البحر الأحمر، والقدية.',
        source: 'وزارة الاستثمار',
        lastUpdated: '2026-02-28',
        coverage: 'المناطق المستهدفة',
        dataType: 'Project Metadata'
      }
    ]
  },
  {
    id: 'fastest-growing-sectors',
    title: 'القطاعات الأسرع نمواً',
    shortDescription: 'مراقبة القطاعات ذات النمو المرتفع في الإيرادات والتوظيف.',
    description: 'تحديد المجالات التجارية التي تشهد تسارعاً في تكوين الثروات وخلق وظائف جديدة بما يتماشى مع زخم السوق.',
    icon: TrendingUp,
    badge: 'زخم عالٍ',
    color: 'emerald',
    explanation: 'تحليل أداء القطاعات التجارية السعودية بناءً على نمو الإيرادات السنوي وعدد المنشآت الجديدة.',
    insightSummary: 'قطاع التقنية المالية (FinTech) يواصل تصدر المشهد بمعدل نمو إيرادات بلغ 40% على أساس سنوي.',
    sources: ['وزارة التجارة', 'الهيئة العامة للإحصاء'],
    fields: [
      { label: 'نمو الإيرادات حسب القطاع', key: 'revenue_growth_sector', type: 'chart' },
      { label: 'عدد الشركات', key: 'companies_count', type: 'metric' },
      { label: 'الوظائف الجديدة المستحدثة', key: 'new_jobs_created', type: 'table' },
      { label: 'مؤشرات الطلب', key: 'demand_indicators', type: 'metric' },
      { label: 'نسب الاستثمار', key: 'investment_ratios', type: 'metric' },
      { label: 'فجوات العرض والطلب', key: 'supply_demand_gaps', type: 'chart' }
    ],
    datasets: [
      {
        name: 'مؤشر المنشآت الصغيرة والمتوسطة المحدث',
        description: 'بيانات حيوية المنشآت في مختلف القطاعات الاقتصادية.',
        source: 'وزارة التجارة',
        lastUpdated: '2026-03-01',
        coverage: 'جميع القطاعات',
        dataType: 'Statistical'
      }
    ]
  },
  {
    id: 'saturated-sectors',
    title: 'القطاعات المتشبعة',
    shortDescription: 'أداء المنافسة وتوزيع حصص السوق لتجنب التشبع.',
    description: 'تقييم شدة المنافسة وتوزيع الحصص السوقية لتجنب القطاعات ذات هوامش الربح المنخفضة أو التنافس المحموم.',
    icon: PieChart,
    badge: 'تحليل المخاطر',
    color: 'rose',
    explanation: 'تنبيه المستثمرين من القطاعات التي وصل فيها عدد الموردين إلى نقطة التشبع مقارنة بحجم الطلب.',
    insightSummary: 'قطاع التجزئة التقليدي في المدن الرئيسية بدأ يشهد تباطؤاً في التوسع لصالح التجارة الإلكترونية.',
    sources: ['وزارة التجارة', 'الهيئة العامة للإحصاء'],
    fields: [
      { label: 'عدد الشركات لكل قطاع', key: 'companies_per_sector', type: 'table' },
      { label: 'توزيع حصة السوق', key: 'market_share_dist', type: 'chart' },
      { label: 'كثافة المنافسة', key: 'competition_intensity', type: 'metric' },
      { label: 'نسبة العرض إلى الطلب', key: 'supply_demand_ratio', type: 'metric' },
      { label: 'بيانات التسعير', key: 'pricing_data', type: 'table' }
    ],
    datasets: [
      {
        name: 'قاعدة بيانات المنافسة ومنع الاحتكار',
        description: 'تحليل تركز السوق وحصص الشركات الكبرى والمتوسطة.',
        source: 'الهيئة العامة للمنافسة',
        lastUpdated: '2025-12-20',
        coverage: 'القطاعات الرئيسية',
        dataType: 'Statistical'
      }
    ]
  },
  {
    id: 'market-gaps',
    title: 'فجوات السوق',
    shortDescription: 'اكتشاف الاحتياجات غير الملباة وفرص التوسع الإقليمي.',
    description: 'تحديد الفئات المفتقدة لخدمات محددة واكتشاف الثغرات في سلاسل الإمداد المحلية.',
    icon: Target,
    badge: 'فرصة نادرة',
    color: 'purple',
    explanation: 'تعتمد هذه الرؤية على تقنيات الذكاء الاصطناعي لربط بيانات الاستيراد بالإنتاج المحلي لتحديد الفجوات.',
    insightSummary: 'هناك فجوة بنسبة 35% في تصنيع المكونات الدقيقة للأنظمة الأمنية داخل المملكة.',
    sources: ['وزارة التجارة', 'الهيئة العامة للإحصاء'],
    fields: [
      { label: 'حجم الطلب غير الملبى', key: 'unmet_demand_size', type: 'metric' },
      { label: 'العملاء المحتملون', key: 'potential_customers', type: 'table' },
      { label: 'المناطق عالية الطلب', key: 'high_demand_regions', type: 'chart' },
      { label: 'الأعمال/الخدمات الحالية', key: 'existing_businesses', type: 'table' },
      { label: 'مؤشرات فرص التوسع', key: 'expansion_opportunity_indicators', type: 'metric' }
    ],
    datasets: [
      {
        name: 'تقرير الفجوات الاقتصادية السنوي',
        description: 'دراسة تحليلية للفجوات بين الاستيراد والاستهلاك المحلي.',
        source: 'وزارة الاقتصاد والتخطيط',
        lastUpdated: '2025-11-15',
        coverage: 'القطاع الصناعي والتجاري',
        dataType: 'Analytical'
      }
    ]
  },
  {
    id: 'consumer-spending',
    title: 'القوة الشرائية للمستهلك',
    shortDescription: 'تحليل عادات الإنفاق ومتوسط قيمة المعاملات.',
    description: 'دراسة بيانات المبيعات والمعاملات لفهم القدرة الشرائية للمستهدفين وتوزيع الإنفاق حسب القطاعات.',
    icon: CreditCard,
    badge: 'ذكاء مالي',
    color: 'cyan',
    explanation: 'توفر هذه الزاوية بيانات دقيقة عن متوسط إنفاق الأسرة والفرد السعودي في مختلف التصنيفات.',
    insightSummary: 'ارتفاع الإنفاق على الترفيه والسياحة الداخلية بنسبة 20% خلال العطلات الفصلية الماضية.',
    sources: ['وزارة التجارة', 'الهيئة العامة للإحصاء', 'وزارة المالية'],
    fields: [
      { label: 'بيانات المبيعات', key: 'sales_data', type: 'chart' },
      { label: 'المستهلكون النشطون', key: 'active_consumers', type: 'metric' },
      { label: 'متوسط الإنفاق لكل مستخدم', key: 'avg_spending_user', type: 'metric' },
      { label: 'توزيع الإنفاق حسب القطاع', key: 'spending_breakdown_sector', type: 'table' },
      { label: 'بيانات الفواتير الإلكترونية والمعاملات', key: 'e_invoice_tx_data', type: 'table' }
    ],
    datasets: [
      {
        name: 'مؤشرات نقاط البيع (POS) الأسبوعية',
        description: 'بيانات العمليات المنفذة عبر بطاقات الصرف الآلي والائتمان.',
        source: 'البنك المركزي السعودي (SAMA)',
        lastUpdated: 'مباشر',
        coverage: 'المملكة والقطاعات',
        dataType: 'Transactional'
      }
    ]
  },
  {
    id: 'consumer-behavior',
    title: 'سلوك المستهلك',
    shortDescription: 'فهم تفضيلات الشراء والتوجهات الديموغرافية.',
    description: 'تحليل تفضيلات المستهلكين وأنماط الشراء بناءً على البيانات الديموغرافية لتحسين ملاءمة المنتجات للسوق.',
    icon: Activity,
    badge: 'تحليل عميق',
    color: 'orange',
    explanation: 'دراسة العوامل النفسية والاجتماعية التي تؤثر على قرارات الشراء لدى المواطنين والمقيمين.',
    insightSummary: 'المستهلكون الصغار (Generation Z) يفضلون الشراء من العلامات التجارية التي تدعم الاستدامة.',
    sources: ['وزارة التجارة', 'الهيئة العامة للإحصاء'],
    fields: [
      { label: 'تفضيلات المستهلكين', key: 'consumer_preferences', type: 'table' },
      { label: 'المعاملات حسب الفئة الديموغرافية', key: 'tx_per_demographic', type: 'chart' },
      { label: 'توجهات الشراء', key: 'purchase_trends', type: 'metric' },
      { label: 'رضا العملاء', key: 'customer_satisfaction', type: 'metric' },
      { label: 'بيانات سلوك البحث', key: 'search_behavior_data', type: 'table' }
    ],
    datasets: [
      {
        name: 'استطلاع ثقة المستهلك ربع السنوي',
        description: 'بيانات حول توقعات وتوجهات المستهلكين المستقبلية.',
        source: 'الهيئة العامة للإحصاء',
        lastUpdated: '2026-02-10',
        coverage: 'المستوي الوطني',
        dataType: 'Survey Data'
      }
    ]
  },
  {
    id: 'infra-logistics',
    title: 'البنية التحتية واللوجستيات',
    shortDescription: 'أداء النقل والمراكز اللوجستية وتوسع الشبكات.',
    description: 'تحليل كفاءة الموانئ، توفر المستودعات، وأداء سلاسل الإمداد لدعم التوسع الاستراتيجي.',
    icon: Truck,
    badge: 'رابط أساسي',
    color: 'slate',
    explanation: 'مراقبة جاهزية البنية التحتية السعودية لدعم التجارة العالمية والمحلية.',
    insightSummary: 'تحسن زمن مناولة الحاويات في ميناء جدة الإسلامي بنسبة 18% بفضل الأتمتة الجديدة.',
    sources: ['الهيئة العامة للموانئ (موانئ)', 'هيئة النقل العام'],
    fields: [
      { label: 'حركة الموانئ والإنتاجية', key: 'port_throughput', type: 'chart' },
      { label: 'إشغال المستودعات', key: 'warehouse_occupancy', type: 'metric' },
      { label: 'مؤشرات تكلفة الخدمات اللوجستية', key: 'logistics_cost_index', type: 'metric' },
      { label: 'حجم الشحن الجوي والبري', key: 'freight_volume', type: 'table' }
    ],
    datasets: [
      {
        name: 'مؤشر أداء الخدمات اللوجستية (LPI)',
        description: 'تصنيف المملكة وأدائها في التيسير التجاري واللوجستي.',
        source: 'هيئة النقل',
        lastUpdated: '2025-10-01',
        coverage: 'المعابر والموانئ',
        dataType: 'Statistical'
      }
    ]
  }
];
