import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  Search, 
  ChevronLeft, 
  ChevronDown, 
  BookOpen, 
  User, 
  CreditCard, 
  Zap, 
  Database, 
  Layout, 
  MessageSquare, 
  History, 
  HelpCircle, 
  ArrowRight,
  ExternalLink,
  ThumbsUp,
  ThumbsDown,
  Mail,
  Bug,
  Plus,
  Send,
  CheckCircle2,
  Clock,
  Sparkles,
  Library,
  Pin,
  FileText,
  X, Bot, ShieldCheck, Headphones
} from 'lucide-react';

// --- Types ---
interface Article {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  tags: string[];
  views: number;
  helpfulCount: number;
  lastUpdated: string;
}

interface Section {
  id: string;
  title: string;
  icon: any;
  subsections: { id: string; title: string }[];
}

// --- Mock Data ---
const HELP_SECTIONS: Section[] = [
  {
    id: 'getting-started',
    title: 'البداية والتعريف',
    icon: BookOpen,
    subsections: [
      { id: 'intro', title: 'مقدمة عن المنصة' },
      { id: 'setup', title: 'إنشاء الحساب وتفعيله' },
      { id: 'quickstart', title: 'دليل البدء السريع' },
      { id: 'tutorials', title: 'دروس الفيديو التعليمية' }
    ]
  },
  {
    id: 'account',
    title: 'الحساب والاشتراكات',
    icon: User,
    subsections: [
      { id: 'profile', title: 'إدارة الملف الشخصي' },
      { id: 'billing', title: 'الخطط والفوترة' },
      { id: 'security', title: 'الأمان والخصوصية' },
      { id: 'notifications', title: 'إدارة التنبيهات' }
    ]
  },
  {
    id: 'features',
    title: 'خصائص المنصة',
    icon: Zap,
    subsections: [
      { id: 'tours', title: 'الجولات التعريفية' },
      { id: 'data-explorer', title: 'مستكشف البيانات' },
      { id: 'dashboards', title: 'لوحات التحكم' },
      { id: 'ai-workspace', title: 'بيئة الذكاء الاصطناعي' },
      { id: 'media', title: 'مكتبة الوسائط' }
    ]
  },
  {
    id: 'troubleshooting',
    title: 'حل المشكلات',
    icon: Bug,
    subsections: [
      { id: 'common-errors', title: 'أخطاء شائعة' },
      { id: 'data-issues', title: 'مشاكل البيانات' },
      { id: 'login-issues', title: 'مشاكل الدخول' }
    ]
  },
  {
    id: 'updates',
    title: 'تحديثات المنصة',
    icon: History,
    subsections: [
      { id: 'release-notes', title: 'ملاحظات الإصدار' },
      { id: 'changelog', title: 'سجل التغييرات' }
    ]
  }
];

const ARTICLES: Article[] = [
  {
    id: 'intro-platform',
    title: 'مقدمة عن منصة رادار المستثمر',
    excerpt: 'تعرف على رؤية المنصة وكيف تدمج بين البيانات الاقتصادية الضخمة والذكاء الاصطناعي لدعم قراراتك الاستثمارية.',
    content: `منصة رادار المستثمر هي الأداة المتكاملة الأولى في المطقة التي تجمع بين رصد البيانات الاقتصادية اللحظية وتحليلها باستخدام تقنيات الذكاء الاصطناعي المتقدمة. 

تهدف المنصة إلى تمكين المستثمرين والأكاديميين وصناع القرار من الوصول إلى:
1. **إشارات السوق اللحظية**: تنبيهات فورية حول التغيرات الجوهرية في المؤشرات الكلية والجزئية.
2. **لوحات الرادار الذكية**: واجهات تفاعلية مخصصة لمراقبة قطاعات محددة (عقارات، طاقة، تكنولوجيا).
3. **بيئة الذكاء الاصطناعي**: أدوات لتوليد تقارير تحليلية تلقائية بناءً على أحدث البيانات المتوفرة.

نحن نعتمد على أكثر من 50 مصدر بيانات رسمي لضمان دقة المعلومة وسرعة وصولها إليك.`,
    category: 'intro',
    tags: ['دليل', 'نظرة عامة'],
    views: 4500,
    helpfulCount: 320,
    lastUpdated: '2024-03-15'
  },
  {
    id: 'account-setup',
    title: 'دليل إنشاء الحساب وتفعيل العضوية',
    excerpt: 'خطوات مفصلة لإنشاء حسابك الأول، وتفعيل ميزة التحقق الثنائي (2FA) لضمان أمان بياناتك الاستثمارية.',
    content: `لبدء رحلتك الاستثمارية مع رادار، اتبع الخطوات التالية:
1. **التسجيل**: انقر على زر "ابدأ الآن" في الصفحة الرئيسية وأدخل بريدك الإلكتروني.
2. **تأكيد البريد**: ستصلك رسالة تحتوي على رمز تفعيل مكون من 6 أرقام، قم بإدخاله في الصفحة المخصصة.
3. **تخصيص الملف**: اختر اهتماماتك الاستثمارية (مثل: الأسهم الخليجية، أسواق الطاقة، الاستدامة) ليقوم النظام بتخصيص صفحة "الخلاصة" لك.

**ملاحظة هامة:** ينصح بشدة بتفعيل "التحقق الثنائي" من خلال إعدادات الحساب لزيادة مستوى الأمان.`,
    category: 'setup',
    tags: ['أمان', 'حساب'],
    views: 2800,
    helpfulCount: 195,
    lastUpdated: '2024-03-14'
  },
  {
    id: 'quick-start',
    title: 'دليل البدء السريع (أول 5 دقائق)',
    excerpt: 'لا تضيع وقتك. تعلم كيف تصل إلى أهم 3 أدوات في المنصة فور دخولك للمرة الأولى.',
    content: `عند دخولك للمنصة لأول مرة، ننصحك بالقيام بالآتي:
1. **تصفح إشارات السوق**: انتقل إلى "إشارات السوق" لرؤية ما يكتشفه الذكاء الاصطناعي حالياً من فرص ومخاطر.
2. **استكشاف اللوحات**: ابحث عن لوحات الرادار الجاهزة للقطاعات التي تهمك.
3. **البحث الذكي**: استخدم شريط البحث بالأعلى (أو اختصار K + Cmd) للبحث عن أي مؤشر اقتصادي (مثل: GDP، التضخم).

يمكنك الوصول لهذه الأدوات مباشرة من شريط التنقل العلوي أو القائمة الجانبية.`,
    category: 'quickstart',
    tags: ['البداية', 'تدريب'],
    views: 3100,
    helpfulCount: 245,
    lastUpdated: '2024-03-16'
  },
  {
    id: 'ai-workspace-guide',
    title: 'كيفية استخدام بيئة الذكاء الاصطناعي',
    excerpt: 'تعلم كيف تطلب من الذكاء الاصطناعي كتابة تقارير مخصصة، أو شرح التغيرات المعقدة في البيانات.',
    content: `بيئة الذكاء الاصطناعي في رادار ليست مجرد "شات بوكس"، بل هي محلل بيانات متكامل.
- **توليد التقارير**: يمكنك اختيار مجموعة بيانات والنقر على "تحليل بالذكاء الاصطناعي" للحصول على ملخص تنفيذي.
- **التوقعات**: استخدم أداة "التنبؤ" لرؤية المسارات المحتملة للمؤشرات بناءً على الأنماط التاريخية.
- **شرح المصطلحات**: أي مصطلح معقد في المنصة يمكنك النقر عليه ليقوم الذكاء الاصطناعي بشرحه بتبسيط شديد.

تذكر أن مخرجات الذكاء الاصطناعي هي أدوات مساعدة ويجب دائماً مراجعتها من قبل مختصين قبل اتخاذ القرارات النهائية.`,
    category: 'ai-workspace',
    tags: ['ذكاء اصطناعي', 'تقارير'],
    views: 1900,
    helpfulCount: 140,
    lastUpdated: '2024-03-13'
  },
  {
    id: 'billing-plans',
    title: 'نظرة عامة على باقات الاشتراك والفوترة',
    excerpt: 'اعرف الفرق بين الباقة المجانية، الاحترافية، وباقة الخبراء، وكيفية ترقية حسابك.',
    content: `نقدم ثلاث باقات رئيسية لتناسب احتياجاتك:
1. **الباقة الأساسية (مجانية)**: تتيح لك الوصول للبيانات العامة و3 لوحات رادار فقط.
2. **الباقة الاحترافية (Pro)**: وصول كامل لجميع المؤشرات، تنبيهات لحظية عبر البريد، وبناء عدد غير محدود من اللوحات.
3. **باقة الخبراء (Enterprise)**: ميزات الذكاء الاصطناعي المتقدمة، دعم فني VIP، وإمكانية تصدير البيانات بصيغ احترافية (JSON, Excel).

يمكنك إدارة اشتراكك وتنزيل الفواتير مباشرة من "إعدادات الحساب > الفوترة".`,
    category: 'billing',
    tags: ['اشتراك', 'دفع'],
    views: 1500,
    helpfulCount: 88,
    lastUpdated: '2024-03-11'
  },
  {
    id: 'custom-dashboards',
    title: 'دليل تخصيص لوحات البيانات',
    excerpt: 'كيفية إنشاء لوحة بيانات من الصفر وإضافة الأدوات (Widgets) والرسوم البيانية.',
    content: `لوحات البيانات هي قلب المنصة. لتخصيص لوحتك:
1. اذهب إلى "باني اللوحات" من القائمة الجانبية.
2. اختر "لوحة جديدة" وقم بتسميتها.
3. استخدم "مكتبة الأدوات" لسحب الرسوم البيانية (Charts) التي تهمك وإسقاطها في اللوحة.
4. يمكنك تغيير ترتيب الأدوات أو حجمها لتناسب شاشتك.

تأكد من حفظ التغييرات لتتمكن من الوصول للوحة من أي جهاز آخر.`,
    category: 'dashboards',
    tags: ['لوحات', 'أدوات'],
    views: 2200,
    helpfulCount: 160,
    lastUpdated: '2024-03-09'
  },
  {
    id: 'market-signals-guide',
    title: 'فهم إشارات وتنبيهات السوق',
    excerpt: 'كيف يكتشف النظام الفرص الاستثمارية؟ وما هي أنواع الإشارات التي ستصلك؟',
    content: `تعتمد إشارات السوق على خوارزميات ترصد التغيرات الشاذة (Anomalies) في البيانات.
- **إشارات النمو**: عندما يتجاوز مؤشر معين معدلات نموه التاريخية بشكل مفاجئ.
- **تنبيهات المخاطر**: عند رصد هبوط حاد أو تقلبات غير اعتيادية في قطاع محدد.
- **إشارات السيولة**: تتبع حركة التدفقات المالية الكبرى.

يمكنك ضبط "حساسية التنبيهات" من الإعدادات لاستلام الإشعارات التي تهمك فقط.`,
    category: 'signals',
    tags: ['إشارات', 'تنبيهات'],
    views: 1800,
    helpfulCount: 110,
    lastUpdated: '2024-03-12'
  },
  {
    id: 'video-tutorials-main',
    title: 'دروس الفيديو التعليمية',
    excerpt: 'سلسلة من الفيديوهات القصيرة التي تشرح كل ركن في المنصة خطوة بخطوة.',
    content: `إذا كنت تفضل التعلم المرئي، فقد أعددنا لك مكتبة من الفيديوهات:
1. **جولة في المنصة (3 دقائق)**: نظرة سريعة على الواجهة.
2. **كيف تحلل البيانات (5 دقائق)**: استخدام أدوات التحليل المتقدمة.
3. **الذكاء الاصطناعي للمستثمرين (7 دقائق)**: أسرار استخدام AI Workspace.

يمكنك العثور على هذه الفيديوهات مدمجة داخل المقالات ذات الصلة أو في قناتنا الرسمية على يوتيوب.`,
    category: 'tutorials',
    tags: ['فيديو', 'تعليم'],
    views: 5200,
    helpfulCount: 410,
    lastUpdated: '2024-03-16'
  },
  {
    id: 'profile-management',
    title: 'إدارة ملفك الشخصي وإعداداتك',
    excerpt: 'كيفية تحديث معلوماتك الأساسية، تغيير الصورة الشخصية، وربط حسابات التواصل.',
    content: `ملفك الشخصي هو هويتك في مجتمع رادار. لتعديله:
1. انقر على صورتك في أعلى الصفحة واختر "الملف الشخصي".
2. يمكنك تغيير الاسم، الوصف التعريفي (Bio)، والروابط المهنية.
3. تأكد من الحفاظ على معلوماتك محدثة ليتسنى للخبراء الآخرين التواصل معك بشكل فعال.

يمكنك أيضاً رؤية تاريخ نشاطك والمنشورات التي قمت بالتفاعل معها من نفس الصفحة.`,
    category: 'profile',
    tags: ['بروفايل', 'إعدادات'],
    views: 1200,
    helpfulCount: 75,
    lastUpdated: '2024-03-05'
  },
  {
    id: 'security-privacy',
    title: 'الأمان وخصوصية البيانات',
    excerpt: 'كيف نحمي بياناتك الاستثمارية؟ وما هي خيارات الخصوصية المتوفرة لك؟',
    content: `نحن نأخذ أمان بياناتك على محمل الجد.
- **التشفير**: يتم تشفير جميع البيانات الحساسة باستخدام معايير AES-256.
- **الخصوصية**: يمكنك جعل لوحات البيانات الخاصة بك "خاصة" تماماً أو مشاركتها مع أشخاص محددين فقط عبر رابط سري.
- **التحكم بالبيانات**: يمكنك في أي وقت طلب تصدير كافة بياناتك أو حذف حسابك نهائياً من قسم الأمان.`,
    category: 'security',
    tags: ['أمان', 'خصوصية'],
    views: 950,
    helpfulCount: 62,
    lastUpdated: '2024-03-08'
  },
  {
    id: 'data-explorer-tutorial',
    title: 'استخدام مستكشف البيانات المتقدم',
    excerpt: 'تعلم كيف تبحث في قواعد البيانات الضخمة للمنصة وتستخرج المعلومات التي تحتاجها.',
    content: `مستكشف البيانات هو الأداة الأقوى لإجراء البحوث.
1. استخدم الفلاتر الجانبية لتضييق البحث حسب القطاع أو الدولة أو الفترة الزمنية.
2. يمكنك مقارنة مجموعتي بيانات معاً لرؤية الترابط (Correlation) بينهما.
3. يوفر المستكشف إمكانية عرض البيانات كجدول أو رسم بياني أو خريطة حرارية (Heatmap).

بمجرد العثور على ما تبحث عنه، يمكنك حفظ النتائج في "مفضلتي" للرجوع إليها لاحقاً.`,
    category: 'data-explorer',
    tags: ['بيانات', 'بحث'],
    views: 2600,
    helpfulCount: 185,
    lastUpdated: '2024-03-14'
  },
  {
    id: 'guided-tours-guide',
    title: 'كيفية الاستفادة من الجولات التعريفية',
    excerpt: 'تعرف على كيفية تشغيل الجولات التفاعلية التي تشرح لك وظائف المنصة خطوة بخطوة.',
    content: `الجولات التعريفية هي دليلك الحي داخل المنصة. 
- **التشغيل**: انقر على زر "الجولات التعريفية" في الهيدر العلوي.
- **الاختيار**: اختر الجولة التي تهمك (مثل "البحث الذكي" أو "لوحات التحكم").
- **التفاعل**: سيقوم النظام بتظليل العناصر وشرحها لك. يمكنك الانتقال للتالي أو إنهاء الجولة في أي وقت.

تذكر أن إكمال الجولة يضع علامة صح بجانبها في القائمة لتساعدك على تتبع تقدمك التعليمي.`,
    category: 'tours',
    tags: ['جولات', 'تعليم'],
    views: 3400,
    helpfulCount: 280,
    lastUpdated: '2024-03-16'
  },
  {
    id: 'media-library-guide',
    title: 'إدارة مكتبة الوسائط الخاصة بك',
    excerpt: 'تعلم كيف ترفع الصور والفيديوهات وتستخدمها في تقاريرك ومنشوراتك.',
    content: `مكتبة الوسائط هي المستودع المركزي لجميع ملفاتك.
- **الرفع**: اسحب الملفات وأسقطها في منطقة الرفع المخصصة.
- **التنظيم**: استخدم المجلدات والوسوم (Tags) لتنظيم ملفاتك لسهولة الوصول إليها لاحقاً.
- **الاستخدام**: يمكنك إدراج أي صورة أو فيديو من المكتبة مباشرة داخل بيئة العمل أو عند إنشاء منشور جديد.

ندعم معظم الصيغ الشائعة (PNG, JPG, MP4, PDF) بحد أقصى 50 ميجابايت للملف الواحد.`,
    category: 'media',
    tags: ['وسائط', 'تنظيم'],
    views: 1100,
    helpfulCount: 55,
    lastUpdated: '2024-03-07'
  },
  {
    id: 'common-errors-list',
    title: 'قائمة بأهم الأخطاء الشائعة وحلها',
    excerpt: 'هل واجهت رسالة خطأ مفاجئة؟ ابحث عن رمز الخطأ هنا لتعرف الحل فوراً.',
    content: `إليك بعض الأخطاء الشائعة وكيفية التعامل معها:
1. **خطأ 401 (غير مصرح)**: يرجى تسجيل الخروج ثم الدخول مرة أخرى لتجديد جلسة العمل.
2. **خطأ في تحميل الرسم البياني**: تأكد من استقرار اتصال الإنترنت لديك أو حاول تحديث الصفحة.
3. **تجاوز حد الاستخدام**: إذا كنت تستخدم الباقة المجانية، قد تكون وصلت للحد الأقصى لطلبات الذكاء الاصطناعي اليومية.

إذا استمرت المشكلة، يرجى تزويدنا برمز الخطأ عبر الدعم الفني.`,
    category: 'common-errors',
    tags: ['أخطاء', 'حل'],
    views: 4300,
    helpfulCount: 310,
    lastUpdated: '2024-03-15'
  },
  {
    id: 'data-inconsistency',
    title: 'التعامل مع تعارض أو نقص البيانات',
    excerpt: 'ماذا تفعل إذا لاحظت فرقاً بين أرقام المنصة والمصادر الرسمية الأخرى؟',
    content: `نحن نسعى دائماً لتكون بياناتنا مطابقة للمصادر الرسمية بنسبة 100%. 
في حال لاحظت أي اختلاف:
- **وقت التحديث**: قد يكون هناك فارق زمني بسيط في مزامنة البيانات اللحظية.
- **المنهجية**: تأكد من أنك تقارن نفس المؤشر وبنفس العملة أو المعايير.
- **نقص البيانات**: بعض المؤشرات القديمة قد لا تتوفر لبعض الدول في قواعد البيانات التاريخية.

يمكنك دائماً الإبلاغ عن "نقص بيانات" عبر زر البلاغات في صفحة المؤشر نفسه.`,
    category: 'data-issues',
    tags: ['بيانات', 'دقة'],
    views: 1400,
    helpfulCount: 92,
    lastUpdated: '2024-03-12'
  },
  {
    id: 'login-problems',
    title: 'مشاكل تسجيل الدخول واستعادة الحساب',
    excerpt: 'فقدت الوصول لحسابك؟ أو لم يصلك رمز التفعيل؟ إليك الحل.',
    content: `إذا واجهت صعوبة في الدخول:
1. **نسيان كلمة المرور**: استخدم رابط "نسيت كلمة المرور" وسنرسل لك رابط إعادة تعيين لبريدك.
2. **عدم وصول الرمز**: تفحص مجلد الرسائل غير المرغوب فيها (Spam) أو انتظر دقيقتين قبل طلب رمز جديد.
3. **الحساب معطل**: قد يتم تعطيل الحساب لأسباب أمنية إذا تم رصد محاولات دخول مشبوهة.

في حال لم تنجح هذه الخطوات، تواصل معنا عبر البريد support@radar.io`,
    category: 'login-issues',
    tags: ['دخول', 'حساب'],
    views: 3200,
    helpfulCount: 215,
    lastUpdated: '2024-03-14'
  },
  {
    id: 'latest-release-notes',
    title: 'ملاحظات الإصدار v2.4.0',
    excerpt: 'تعرف على الميزات الجديدة التي أضفناها في التحديث الأخير للمنصة.',
    content: `يسعدنا الإعلان عن إطلاق النسخة الجديدة التي تشمل:
- **محرك بحث أسرع بنسبة 40%**: تحسينات جذرية في سرعة استرجاع البيانات.
- **دعم الرسوم البيانية ثلاثية الأبعاد**: لرؤية أعمق لترابطات السوق.
- **تكامل مع Slack**: لاستلام التنبيهات مباشرة في قنوات فريق عملك.

تم أيضاً إصلاح أكثر من 20 ثغرة تقنية وتحسين استقرار تطبيق الهاتف.`,
    category: 'release-notes',
    tags: ['تحديث', 'إصدار'],
    views: 8900,
    helpfulCount: 650,
    lastUpdated: '2024-03-16'
  },
  {
    id: 'full-changelog',
    title: 'سجل التغييرات الكامل',
    excerpt: 'قائمة زمنية بكافة التحديثات، التحسينات، والإصلاحات التي مرت بها المنصة.',
    content: `نحن نؤمن بالشفافية المطلقة. يمكنك هنا تتبع تطور المنصة:
- **مارس 2024**: إطلاق بيئة الذكاء الاصطناعي Workspace.
- **فبراير 2024**: تحسين دقة بيانات الأسواق الناشئة.
- **يناير 2024**: إطلاق نظام الجولات التعريفية التفاعلي.

يمكنك الضغط على أي شهر لرؤية التفاصيل التقنية الدقيقة لكل تحديث.`,
    category: 'changelog',
    tags: ['سجل', 'تاريخ'],
    views: 2400,
    helpfulCount: 130,
    lastUpdated: '2024-03-10'
  },
  {
    id: 'notifications-guide',
    title: 'إدارة التنبيهات والإشعارات',
    excerpt: 'كيف تضبط تفضيلاتك لتصلك المعلومات التي تهمك فقط وفي الوقت المناسب.',
    content: `لا تدع الضجيج يشتتك. خصص تنبيهاتك:
- **تنبيهات البريد**: للملخصات اليومية والأسبوعية.
- **إشعارات المتصفح**: للإشارات اللحظية والتحركات العنيفة في السوق.
- **مستوى الأولوية**: يمكنك اختيار استقبال التنبيهات "عالية التأثير" فقط.

يمكنك ضبط هذه الخيارات من خلال "إعدادات الحساب > الإشعارات".`,
    category: 'notifications',
    tags: ['تنبيهات', 'إشعارات'],
    views: 1750,
    helpfulCount: 115,
    lastUpdated: '2024-03-09'
  }
];

const HelpCenterPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [activeTab, setActiveTab ] = useState<'kb' | 'support' | 'tickets'>('kb');
  const [openSections, setOpenSections] = useState<string[]>(['getting-started', 'features']);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatStep, setChatStep] = useState<'welcome' | 'chatting'>('welcome');
  const [messages, setMessages] = useState<{role: 'bot' | 'user', text: string}[]>([
    { role: 'bot', text: 'مرحباً بك! أنا مساعد رادار الذكي. كيف يمكنني مساعدتك اليوم؟' }
  ]);
  const [newMessage, setNewMessage] = useState('');
  const contentRef = useRef<HTMLDivElement>(null);

  // Scroll to content area when state changes
  useEffect(() => {
    if (contentRef.current) {
      const yOffset = -100; // Account for any fixed header if necessary
      const y = contentRef.current.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  }, [activeCategory, selectedArticle, activeTab]);

  const toggleSection = (id: string) => {
    setOpenSections(prev => 
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  const filteredArticles = useMemo(() => {
    return ARTICLES.filter(a => {
      const matchesSearch = a.title.includes(searchQuery) || a.excerpt.includes(searchQuery);
      const matchesCategory = !activeCategory || a.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, activeCategory]);

  return (
    <div className="max-w-7xl mx-auto p-4 lg:p-10 min-h-screen animate-fadeIn" dir="rtl">
      
      {/* Header with search */}
      <div className="bg-gradient-to-br from-slate-900 to-blue-900 rounded-[32px] p-6 lg:p-10 mb-6 relative overflow-hidden shadow-2xl shadow-blue-900/20">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 rounded-full -ml-32 -mb-32 blur-3xl"></div>
        
        <div className="relative z-10 text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 backdrop-blur-md rounded-xl text-blue-200 text-[10px] font-black uppercase tracking-widest border border-white/5">
            <HelpCircle size={14} />
            مركز المساعدة والدعم
          </div>
          <h1 className="text-2xl lg:text-3xl font-black text-white leading-tight">كيف يمكننا مساعدتك اليوم؟</h1>
          <p className="text-blue-100/60 font-bold text-sm lg:text-base">
            ابحث في مئات المقالات التعليمية أو تواصل مع فريق الدعم الفني مباشرة.
          </p>
          
          <div className="relative group max-w-2xl mx-auto">
             <div className="absolute inset-y-0 right-5 flex items-center pointer-events-none">
                <Search className="text-slate-400 group-focus-within:text-blue-400 transition-colors" size={20} />
             </div>
             <input 
                type="text" 
                placeholder="ابحث عن حلول، أدوات، أو دروس تعليمية..."
                className="w-full h-14 pr-14 pl-6 bg-white rounded-2xl shadow-2xl border-none outline-none text-slate-900 font-bold text-sm focus:ring-4 focus:ring-blue-500/10 transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
             />
          </div>
        </div>
      </div>

      <div ref={contentRef} className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Sidebar Navigation */}
        <aside className="lg:col-span-3 space-y-4">
           <div className="bg-white rounded-[32px] border border-slate-100 shadow-xl shadow-slate-900/5 p-4 sticky top-24">
              <div className="space-y-2">
                {HELP_SECTIONS.map((section) => (
                  <div key={section.id} className="overflow-hidden">
                    <button 
                      onClick={() => toggleSection(section.id)}
                      className={`w-full flex items-center justify-between p-3.5 rounded-2xl transition-all ${
                        openSections.includes(section.id) ? 'bg-blue-50/50 text-blue-600' : 'text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                         <section.icon size={18} />
                         <span className="text-sm font-black">{section.title}</span>
                      </div>
                      <ChevronDown size={14} className={`transition-transform duration-300 ${openSections.includes(section.id) ? 'rotate-180' : ''}`} />
                    </button>
                    
                    {openSections.includes(section.id) && (
                      <div className="pr-10 py-2 space-y-1 animate-slideUp">
                        {section.subsections.map(sub => (
                          <button 
                            key={sub.id}
                            onClick={() => { setActiveCategory(sub.id); setActiveTab('kb'); setSelectedArticle(null); }}
                            className={`w-full text-right py-2 text-xs font-bold transition-all ${
                              activeCategory === sub.id ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'
                            }`}
                          >
                            {sub.title}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="h-px bg-slate-50 my-6"></div>

              <div className="space-y-2">
                 <button 
                    onClick={() => setActiveTab('support')}
                    className={`w-full flex items-center gap-3 p-3.5 rounded-2xl transition-all ${
                      activeTab === 'support' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' : 'text-slate-600 hover:bg-slate-50'
                    }`}
                 >
                    <MessageSquare size={18} />
                    <span className="text-sm font-black">الدعم المباشر</span>
                 </button>
                 <button 
                    onClick={() => setActiveTab('tickets')}
                    className={`w-full flex items-center gap-3 p-3.5 rounded-2xl transition-all ${
                      activeTab === 'tickets' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' : 'text-slate-600 hover:bg-slate-50'
                    }`}
                 >
                    <Bug size={18} />
                    <span className="text-sm font-black">بلاغات المشاكل</span>
                 </button>
              </div>
           </div>

           {/* Priority Support Card */}
           <div className="p-6 bg-gradient-to-br from-indigo-900 to-blue-900 rounded-[32px] text-white relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-32 h-32 bg-white/10 rounded-full -ml-16 -mt-16 blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
              <h4 className="font-black text-sm mb-2 relative z-10">خدمة عملاء VIP</h4>
              <p className="text-[10px] text-blue-100/60 leading-relaxed mb-4 relative z-10">للمشتركين في الباقات المتقدمة، نضمن الرد خلال 30 دقيقة.</p>
              <button className="w-full py-3 bg-white/10 hover:bg-white/20 rounded-xl text-[10px] font-black uppercase tracking-widest backdrop-blur-md border border-white/10 transition-all relative z-10">اتصل بمدير حسابك</button>
           </div>
        </aside>

        {/* Content Area */}
        <main className="lg:col-span-9">
           
           {/* KB View */}
           {activeTab === 'kb' && !selectedArticle && (
             <div className="space-y-8 animate-fadeIn">
                <div className="flex items-center justify-between">
                   <div>
                      <h2 className="text-xl font-black text-slate-900">أشهر المقالات</h2>
                      <p className="text-xs text-slate-400 font-bold mt-1">المقالات الأكثر طلباً من قبل المستخدمين الجدد</p>
                   </div>
                   <div className="flex gap-2">
                      <button 
                        onClick={() => setViewMode('grid')}
                        className={`p-2.5 rounded-xl transition-all border ${
                          viewMode === 'grid' 
                            ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20 border-blue-600' 
                            : 'bg-slate-50 text-slate-400 hover:text-blue-600 border-slate-100'
                        }`}
                      >
                         <Layout size={18} />
                      </button>
                      <button 
                        onClick={() => setViewMode('list')}
                        className={`p-2.5 rounded-xl transition-all border ${
                          viewMode === 'list' 
                            ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20 border-blue-600' 
                            : 'bg-slate-50 text-slate-400 hover:text-blue-600 border-slate-100'
                        }`}
                      >
                         <FileText size={18} />
                      </button>
                   </div>
                </div>

                <div className={viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 gap-6" : "space-y-4"}>
                   {filteredArticles.map(article => (
                     <button 
                        key={article.id}
                        onClick={() => setSelectedArticle(article)}
                        className={`w-full bg-white border border-slate-100 rounded-[32px] hover:shadow-2xl hover:shadow-blue-900/5 transition-all text-right group border-b-4 border-b-transparent hover:border-b-blue-500 overflow-hidden flex ${
                          viewMode === 'grid' ? 'flex-col p-6 h-[320px]' : 'flex-row items-center p-5 h-32 gap-6'
                        }`}
                     >
                        {/* Icon/Category Section */}
                        <div className={`shrink-0 flex items-center justify-center rounded-2xl bg-blue-50 text-blue-600 transition-transform group-hover:scale-110 ${
                          viewMode === 'grid' ? 'w-12 h-12 mb-4' : 'w-16 h-16'
                        }`}>
                           <BookOpen size={viewMode === 'grid' ? 24 : 32} />
                        </div>
                        
                        {/* Content Section */}
                        <div className="flex-1 min-w-0 flex flex-col justify-center">
                           <div className="flex items-center gap-2 mb-1">
                              <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest">{article.category}</span>
                              {viewMode === 'list' && <span className="w-1 h-1 rounded-full bg-slate-200"></span>}
                              {viewMode === 'list' && (
                                <span className="text-[10px] font-bold text-slate-400">
                                  تاريخ التحديث: {article.lastUpdated}
                                </span>
                              )}
                           </div>
                           
                           <h3 className="text-base lg:text-lg font-black text-slate-900 mb-1 group-hover:text-blue-600 transition-colors truncate">
                              {article.title}
                           </h3>
                           <p className={`text-xs text-slate-500 font-bold leading-relaxed ${viewMode === 'grid' ? 'line-clamp-4' : 'line-clamp-2'}`}>
                              {article.excerpt}
                           </p>
                           
                           {viewMode === 'grid' && (
                             <div className="flex items-center justify-between pt-4 mt-auto border-t border-slate-50 w-full">
                                <div className="flex items-center gap-2">
                                   <Clock size={14} className="text-slate-300" />
                                   <span className="text-[10px] font-bold text-slate-400">{article.lastUpdated}</span>
                                </div>
                                <ArrowRight size={18} className="text-blue-500 -rotate-180 group-hover:-translate-x-2 transition-transform" />
                             </div>
                           )}
                        </div>

                        {/* Stats/Actions (List View Only) */}
                        {viewMode === 'list' && (
                          <div className="hidden md:flex items-center gap-8 pr-8 border-r border-slate-50 shrink-0 h-12">
                             <div className="text-center min-w-[60px]">
                                <div className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">المشاهدات</div>
                                <div className="text-sm font-black text-slate-900">{article.views}</div>
                             </div>
                             <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center text-blue-500 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm">
                                <ArrowRight size={22} className="-rotate-180" />
                             </div>
                          </div>
                        )}
                     </button>
                   ))}
                </div>

                {/* Popular Categories Grid */}
                <div className="pt-10">
                   <h2 className="text-xl font-black text-slate-900 mb-6">استكشف حسب التصنيف</h2>
                   <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {['النماذج المالية', 'الاشتراكات', 'الذكاء الاصطناعي', 'الأمان', 'التنبيهات', 'لوحات البيانات', 'API', 'التصدير'].map(cat => (
                        <button key={cat} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:border-blue-200 hover:bg-white transition-all text-xs font-black text-slate-600 hover:text-blue-600 shadow-sm">
                           {cat}
                        </button>
                      ))}
                   </div>
                </div>
             </div>
           )}

           {/* Article Detail View */}
           {activeTab === 'kb' && selectedArticle && (
             <div className="bg-white rounded-[40px] border border-slate-100 shadow-2xl shadow-slate-900/5 overflow-hidden animate-slideUp">
                <div className="p-6 lg:p-10 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
                   <button 
                     onClick={() => setSelectedArticle(null)}
                     className="flex items-center gap-2 text-slate-500 hover:text-blue-600 transition-all font-black text-sm"
                   >
                     <ChevronLeft size={20} className="rotate-180" />
                     العودة للمقالات
                   </button>
                   <div className="flex gap-3">
                      <button className="p-3 rounded-2xl bg-white text-slate-400 hover:text-blue-600 shadow-sm border border-slate-100 transition-all">
                         <Pin size={18} />
                      </button>
                      <button className="p-3 rounded-2xl bg-white text-slate-400 hover:text-blue-600 shadow-sm border border-slate-100 transition-all">
                         <Plus size={18} />
                      </button>
                   </div>
                </div>

                <div className="p-8 lg:p-12 space-y-8">
                   <div className="space-y-4">
                      <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-[10px] font-black uppercase tracking-widest">
                         <Sparkles size={14} />
                         مقال تعليمي مميز
                      </div>
                      <h1 className="text-3xl lg:text-4xl font-black text-slate-900 leading-tight">{selectedArticle.title}</h1>
                      <div className="flex flex-wrap items-center gap-6 text-slate-400 font-bold text-xs uppercase tracking-tight">
                         <span className="flex items-center gap-1.5"><User size={14} /> فريق رادار</span>
                         <span className="flex items-center gap-1.5"><Clock size={14} /> 5 دقائق قراءة</span>
                         <span className="flex items-center gap-1.5 text-blue-500"><CheckCircle2 size={14} /> تم التحقق بوسطة خبير</span>
                      </div>
                   </div>

                   <div className="prose prose-slate max-w-none">
                      <p className="text-lg text-slate-600 leading-relaxed font-bold mb-6">
                        {selectedArticle.excerpt}
                      </p>
                      <div className="p-8 bg-slate-50 rounded-[32px] border border-slate-100 mb-8 font-medium text-slate-700 leading-[1.8] space-y-4">
                         {selectedArticle.content}
                         <p>بشكل عام، تهدف المنصة إلى تزويد المستثمرين بأدق الأدوات التحصيلية الممكنة من خلال دمج مصادر البيانات الرسمية مع خوارزميات الذكاء الاصطناعي الخاصة بنا.</p>
                         <div className="bg-white p-6 rounded-2xl border border-blue-100 border-r-4 border-r-blue-500">
                             <h4 className="font-black text-blue-600 mb-2">نصيحة ذهبية:</h4>
                             <p className="text-sm font-bold text-slate-600">يمكنك دائماً العودة إلى سجل التغييرات لمتابعة أي تحديثات قد تمت على مجموعات البيانات التي تتابعها.</p>
                         </div>
                      </div>
                   </div>

                   {/* Helpful Feedback Section */}
                   <div className="pt-10 border-t border-slate-50">
                      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                         <div>
                            <h4 className="font-black text-slate-900">هل كان هذا المقال مفيداً؟</h4>
                            <p className="text-xs text-slate-400 font-bold mt-1">تساعدنا تقييماتكم في تحسين جودة المحتوى التعليمي.</p>
                         </div>
                         <div className="flex gap-3">
                            <button className="flex items-center gap-3 px-6 py-3 bg-emerald-50 text-emerald-600 rounded-xl hover:bg-emerald-100 transition-all font-black text-xs">
                               <ThumbsUp size={16} />
                               نعم، شكراً!
                            </button>
                            <button className="flex items-center gap-3 px-6 py-3 bg-rose-50 text-rose-600 rounded-xl hover:bg-rose-100 transition-all font-black text-xs">
                               <ThumbsDown size={16} />
                               ليس تماماً
                            </button>
                         </div>
                      </div>
                   </div>
                </div>

                <div className="p-8 bg-blue-600 text-white flex flex-col md:flex-row items-center justify-between gap-6">
                   <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center">
                         <MessageSquare size={24} />
                      </div>
                      <div>
                         <h4 className="font-black text-sm">لم تجد ضالتك؟</h4>
                         <p className="text-[10px] text-blue-100 font-bold">تحدث مع أحد خبراء المنصة الآن للحصول على مساعدة مخصصة.</p>
                      </div>
                   </div>
                   <button 
                     onClick={() => { setIsChatOpen(true); setChatStep('welcome'); }}
                     className="px-8 py-3 bg-white text-blue-600 rounded-xl font-black text-sm hover:shadow-xl transition-all"
                   >
                     تحدث معنا الآن
                   </button>
                </div>
             </div>
           )}

           {/* Support / Contact View */}
           {activeTab === 'support' && (
             <div className="animate-fadeIn space-y-8">
                <div className="bg-white rounded-[40px] border border-slate-100 p-10 shadow-xl shadow-slate-900/5">
                   <div className="text-center mb-12">
                      <div className="w-20 h-20 bg-indigo-50 text-indigo-600 rounded-[28px] flex items-center justify-center mx-auto mb-6 shadow-xl shadow-indigo-500/10">
                         <Mail size={32} />
                      </div>
                      <h2 className="text-2xl font-black text-slate-900">تواصل مع الدعم الفني</h2>
                      <p className="text-slate-400 font-bold mt-2">اترك رسالتك وسنقوم بالرد عليك في غضون 24 ساعة.</p>
                   </div>

                   <form className="space-y-6 max-w-2xl mx-auto">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                         <div className="space-y-2">
                            <label className="text-xs font-black text-slate-800 uppercase tracking-widest mr-2">الاسم الكامل</label>
                            <input type="text" className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-sm font-bold focus:bg-white focus:ring-4 focus:ring-blue-500/5 transition-all outline-none" placeholder="محمد مرعاوي" />
                         </div>
                         <div className="space-y-2">
                            <label className="text-xs font-black text-slate-800 uppercase tracking-widest mr-2">موضوع الرسالة</label>
                            <select className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-sm font-bold focus:bg-white appearance-none outline-none">
                               <option>مشكلة تقنية</option>
                               <option>بوابات الدفع</option>
                               <option>استفسار عن البيانات</option>
                               <option>أخرى</option>
                            </select>
                         </div>
                      </div>
                      <div className="space-y-2">
                         <label className="text-xs font-black text-slate-800 uppercase tracking-widest mr-2">وصف المشكلة</label>
                         <textarea rows={5} className="w-full bg-slate-50 border border-slate-100 rounded-[24px] px-5 py-5 text-sm font-bold focus:bg-white focus:ring-4 focus:ring-blue-500/5 transition-all outline-none resize-none" placeholder="اكتب تفاصيل سؤالك هنا..."></textarea>
                      </div>
                      <button className="w-full py-5 bg-indigo-600 text-white rounded-[22px] font-black text-sm shadow-2xl shadow-indigo-600/20 hover:bg-indigo-700 transition-all flex items-center justify-center gap-3">
                         <Send size={18} />
                         إرسال الرسالة الآن
                      </button>
                   </form>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                   <div className="p-8 bg-white border border-slate-100 rounded-[35px] text-center space-y-4">
                      <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto"><Mail size={24}/></div>
                      <h4 className="font-black text-slate-900 uppercase tracking-tight">البريد الإلكتروني</h4>
                      <p className="text-[11px] font-bold text-slate-400 leading-relaxed">راسلنا مباشرة على بريد الدعم الرسمي</p>
                      <p className="text-sm font-black text-blue-600">support@radar.io</p>
                   </div>
                   <div className="p-8 bg-white border border-slate-100 rounded-[35px] text-center space-y-4 shadow-xl shadow-blue-500/5 hover:-translate-y-1 transition-all">
                       <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto"><MessageSquare size={24}/></div>
                       <h4 className="font-black text-slate-900 uppercase tracking-tight">المحادثة الفورية</h4>
                       <p className="text-[11px] font-bold text-slate-400 leading-relaxed">متاح طوال أيام الأسبوع للباقات الاحترافية</p>
                       <button 
                         onClick={() => { setIsChatOpen(true); setChatStep('welcome'); }}
                         className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl text-[10px] font-black hover:bg-indigo-700 transition-all shadow-md"
                       >
                         ابدأ الدردشة الآن
                       </button>
                    </div>
                   <div className="p-8 bg-white border border-slate-100 rounded-[35px] text-center space-y-4">
                      <div className="w-14 h-14 bg-slate-50 text-slate-600 rounded-2xl flex items-center justify-center mx-auto"><ExternalLink size={24}/></div>
                      <h4 className="font-black text-slate-900 uppercase tracking-tight">قنوات التواصل</h4>
                      <p className="text-[11px] font-bold text-slate-400 leading-relaxed">تابعنا للحصول على تحديثات سريعة</p>
                      <div className="flex justify-center gap-3 text-slate-400">
                         <Zap size={18} className="hover:text-blue-500 transition-colors" />
                         <Layout size={18} className="hover:text-blue-500 transition-colors" />
                         <Database size={18} className="hover:text-blue-500 transition-colors" />
                      </div>
                   </div>
                </div>
             </div>
           )}

           {/* Tickets View */}
           {activeTab === 'tickets' && (
             <div className="animate-fadeIn space-y-8">
                <div className="bg-white rounded-[40px] border border-slate-100 shadow-xl shadow-slate-900/5 p-8 lg:p-10">
                   <div className="flex items-center justify-between mb-10">
                      <div>
                         <h2 className="text-xl font-black text-slate-900">تذكريات الدعم الفني</h2>
                         <p className="text-xs text-slate-400 font-bold mt-1">تتبع حالة بلاغاتك ومقترحاتك المقدمة للفريق</p>
                      </div>
                      <button className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-black text-xs shadow-lg shadow-blue-500/20 hover:bg-blue-700 transition-all">
                         <Plus size={16} />
                         بلاغ جديد
                      </button>
                   </div>

                   <div className="space-y-4">
                      {[1, 2, 3].map(i => (
                        <div key={i} className="p-6 bg-slate-50 border border-slate-100 rounded-[28px] flex flex-col md:flex-row items-center justify-between gap-6 group hover:bg-white hover:border-blue-200 transition-all">
                           <div className="flex items-center gap-5">
                              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 border border-white shadow-sm ${i === 1 ? 'bg-amber-100 text-amber-600' : 'bg-emerald-100 text-emerald-600'}`}>
                                 {i === 1 ? <Clock size={24}/> : <CheckCircle2 size={24}/>}
                              </div>
                              <div className="text-right">
                                 <h4 className="text-sm font-black text-slate-900 flex items-center gap-2">
                                    {i === 1 ? 'مشكلة في مطابقة بيانات قطاع التجزئة' : 'اقتراح إضافة مؤشر نمو الصادرات'}
                                    <span className="text-[9px] font-bold text-slate-300 uppercase">#TRK-240{i}</span>
                                 </h4>
                                 <p className="text-[11px] font-bold text-slate-400 mt-1 line-clamp-1">تم إرسال هذا الطلب في 12 مارس 2024 بواسطة الإدارة الفنية...</p>
                              </div>
                           </div>
                           <div className="flex items-center gap-6 w-full md:w-auto">
                              <div className="flex flex-col items-center gap-1 shrink-0">
                                 <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">الأولوية</span>
                                 <span className={`px-2 py-0.5 rounded-lg text-[10px] font-black ${i === 1 ? 'bg-rose-50 text-rose-600' : 'bg-blue-50 text-blue-600'}`}>
                                    {i === 1 ? 'عالية جداً' : 'عادية'}
                                 </span>
                              </div>
                              <div className="flex flex-col items-center gap-1 shrink-0">
                                 <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">الحالة</span>
                                 <span className={`px-2 py-0.5 rounded-lg text-[10px] font-black ${i === 1 ? 'bg-amber-100 text-amber-600' : 'bg-emerald-100 text-emerald-600'}`}>
                                    {i === 1 ? 'قيد المراجعة' : 'تم التنفيذ'}
                                 </span>
                              </div>
                              <button className="p-3 bg-white border border-slate-100 text-slate-400 rounded-xl group-hover:text-blue-600 transition-all shadow-sm">
                                 <ChevronLeft size={18} className="rotate-180" />
                              </button>
                           </div>
                        </div>
                      ))}
                   </div>
                </div>
             </div>
           )}
        </main>
      </div>

      {/* Modern Live Chat Modal */}
      {isChatOpen && (
        <div className="fixed inset-0 z-[1000] flex items-end justify-end p-6 pointer-events-none">
           <div className="w-full max-w-[420px] h-[600px] bg-white rounded-[32px] shadow-2xl border border-slate-100 flex flex-col pointer-events-auto animate-slideUp overflow-hidden">
              {/* Chat Header */}
              <div className="bg-gradient-to-r from-blue-700 to-indigo-800 p-6 text-white shrink-0 relative">
                 <button 
                   onClick={() => setIsChatOpen(false)}
                   className="absolute top-6 left-6 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-all"
                 >
                    <X size={16} />
                 </button>
                 <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/10">
                       <Bot size={24} className="text-white" />
                    </div>
                    <div>
                       <h4 className="font-black text-base">مساعد رادار الذكي</h4>
                       <div className="flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                          <span className="text-[10px] text-blue-100 font-bold uppercase tracking-tight">متصل الآن</span>
                       </div>
                    </div>
                 </div>
              </div>

              {chatStep === 'welcome' ? (
                <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-6 animate-fadeIn">
                   <div className="w-20 h-20 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                      <ShieldCheck size={40} />
                   </div>
                   <div>
                      <h3 className="text-xl font-black text-slate-900">كيف يمكننا مساعدتك؟</h3>
                      <p className="text-sm text-slate-500 font-bold mt-2 leading-relaxed">فريقنا متاح دائماً للإجابة على استفساراتك المعقدة وحل المشكلات التقنية.</p>
                   </div>
                   <div className="w-full space-y-3 pt-4">
                      <button 
                        onClick={() => setChatStep('chatting')}
                        className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black text-sm shadow-xl shadow-blue-500/20 hover:bg-blue-700 transition-all flex items-center justify-center gap-2"
                      >
                         <MessageSquare size={18} />
                         بدء محادثة مباشرة
                      </button>
                      <button className="w-full py-4 bg-slate-50 text-slate-600 rounded-2xl font-black text-sm border border-slate-100 hover:bg-slate-100 transition-all">
                         استعراض الأسئلة الأكثر شيوعاً
                      </button>
                   </div>
                </div>
              ) : (
                <>
                  {/* Messages Area */}
                  <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar bg-slate-50/30">
                     {messages.map((msg, i) => (
                       <div key={i} className={`flex ${msg.role === 'user' ? 'justify-start' : 'justify-end'}`}>
                          <div className={`max-w-[80%] p-4 rounded-2xl text-sm font-bold shadow-sm ${
                            msg.role === 'user' 
                              ? 'bg-blue-600 text-white rounded-tr-none' 
                              : 'bg-white border border-slate-100 text-slate-800 rounded-tl-none'
                          }`}>
                             {msg.text}
                          </div>
                       </div>
                     ))}
                  </div>

                  {/* Input Area */}
                  <div className="p-4 bg-white border-t border-slate-100">
                     <div className="relative">
                        <textarea 
                           className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-12 pr-4 py-3 text-sm font-bold focus:bg-white focus:ring-4 focus:ring-blue-500/5 transition-all outline-none resize-none"
                           placeholder="اكتب رسالتك هنا..."
                           rows={2}
                           value={newMessage}
                           onChange={(e) => setNewMessage(e.target.value)}
                           onKeyDown={(e) => {
                             if(e.key === 'Enter' && !e.shiftKey) {
                               e.preventDefault();
                               if(newMessage.trim()) {
                                 setMessages([...messages, { role: 'user', text: newMessage }]);
                                 setNewMessage('');
                                 // Simple mock bot response
                                 setTimeout(() => {
                                   setMessages(prev => [...prev, { role: 'bot', text: 'شكراً لتواصلك! جاري تحويلك لأحد خبرائنا في قسم الاستثمار...' }]);
                                 }, 1000);
                               }
                             }
                           }}
                        />
                        <button 
                          className="absolute bottom-2 left-2 w-10 h-10 bg-blue-600 text-white rounded-xl flex items-center justify-center hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20"
                          onClick={() => {
                            if(newMessage.trim()) {
                              setMessages([...messages, { role: 'user', text: newMessage }]);
                              setNewMessage('');
                              setTimeout(() => {
                                setMessages(prev => [...prev, { role: 'bot', text: 'شكراً لتواصلك! جاري تحويلك لأحد خبرائنا في قسم الاستثمار...' }]);
                              }, 1000);
                            }
                          }}
                        >
                           <Send size={18} className="translate-x-0.5" />
                        </button>
                     </div>
                     <p className="text-[9px] text-slate-400 font-bold text-center mt-3">
                        من خلال البدء، أنت توافق على <span className="text-blue-500 underline">شروط خدمة</span> رادار.
                     </p>
                  </div>
                </>
              )}
           </div>
        </div>
      )}
    </div>
  );
};

export default HelpCenterPage;
