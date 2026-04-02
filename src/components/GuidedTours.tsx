import React, { useState, useRef, useEffect } from 'react';
import { 
  Compass, 
  ChevronDown, 
  CheckCircle2, 
  PlayCircle, 
  Search, 
  BarChart3, 
  Library, 
  Layout, 
  FilePlus, 
  ImageIcon, 
  Tags, 
  Zap, 
  History,
  Sparkles
} from 'lucide-react';
import { driver } from "driver.js";
import "driver.js/dist/driver.css";

interface TourItem {
  id: string;
  title: string;
  description: string;
  icon: any;
  steps: any[];
}

const TOURS: TourItem[] = [
  {
    id: 'overview',
    title: 'نظرة عامة على المنصة',
    description: 'تعرف على الخصائص الرئيسية للمنصة وكيفية التنقل.',
    icon: Sparkles,
    steps: [
      { element: '#sidebar-brand', popover: { title: 'هوية المنصة', description: 'مرحباً بك في رادار المستثمر، وجهتك الأولى للتحليل الاقتصادي الذكي.' } },
      { element: '#nav-home', popover: { title: 'الرئيسية', description: 'هنا تجد آخر التحديثات والمنشورات من مجتمع الخبراء.' } },
      { element: '#header-search', popover: { title: 'البحث الذكي', description: 'ابحث عن أي شيء في المنصة بسرعة وسهولة.' } },
      { element: '#user-profile-button', popover: { title: 'حسابك الشخصي', description: 'من هنا يمكنك الوصول للملف الشخصي والإعدادات الخاصة بك.' } },
    ]
  },
  {
    id: 'search',
    title: 'البحث الذكي',
    description: 'تعرف على كيفية استخدام محرك البحث الشامل.',
    icon: Search,
    steps: [
      { element: '#header-search', popover: { title: 'محرك البحث', description: 'اكتب الكلمات المفتاحية للبحث عن التقارير، المؤشرات، أو المستخدمين.' } },
    ]
  },
  {
    id: 'data',
    title: 'مستكشف البيانات',
    description: 'استكشف مجموعات البيانات المفتوحة في مختلف القطاعات.',
    icon: BarChart3,
    steps: [
      { element: '#nav-sources', popover: { title: 'مصادر البيانات', description: 'اطلع على جميع مصادر البيانات التي تدعم تحليلات المنصة.' } },
      { element: '#nav-stats', popover: { title: 'الإحصائيات', description: 'راقب أداء المنصة ونمو البيانات بشكل لحظي.' } },
    ]
  },
  {
    id: 'indicators',
    title: 'مكتبة المؤشرات',
    description: 'افهم المؤشرات التحليلية وكيفية الاستفادة منها.',
    icon: Library,
    steps: [
      { element: '#nav-indicators', popover: { title: 'مكتبة المؤشرات', description: 'تضم مئات المؤشرات الاقتصادية والمالية الجاهزة للاستخدام.' } },
    ]
  },
  {
    id: 'dashboards',
    title: 'لوحات البيانات',
    description: 'تعرف على كيفية بناء لوحات تحليلية مخصصة.',
    icon: Layout,
    steps: [
      { element: '#nav-all-dashboards', popover: { title: 'اللوحات الرسمية', description: 'لوحات معدة مسبقاً من قبل خبراء المنصة.' } },
      { element: '#nav-my-dashboards', popover: { title: 'لوحاتي الخاصة', description: 'المكان الذي تبني فيه اللوحات التي تهمك شخصياً.' } },
      { element: '#nav-builder', popover: { title: 'باني اللوحات', description: 'أداة احترافية لتصميم لوحاتك الخاصة بالسحب والإفلات.' } },
    ]
  },
  {
    id: 'create',
    title: 'إنشاء التحليلات',
    description: 'تعلم كيفية كتابة ونشر المحتوى التحليلي.',
    icon: FilePlus,
    steps: [
      { element: '#nav-create-post', popover: { title: 'إنشاء منشور', description: 'شارك رؤيتك التحليلية مع المجتمع من خلال أدوات النشر المتطورة.' } },
    ]
  },
  {
    id: 'media',
    title: 'مكتبة الوسائط',
    description: 'إدارة الصور والأصول المرئية الخاصة بك.',
    icon: ImageIcon,
    steps: [
      { element: '#nav-media', popover: { title: 'الوسائط', description: 'ارفع وأدر الصور التي تستخدمها في تقاريرك وتحليلاتك.' } },
    ]
  },
  {
    id: 'tags',
    title: 'الوسوم والتصنيفات',
    description: 'تنظيم واكتشاف المحتوى باستخدام الوسوم.',
    icon: Tags,
    steps: [
      { element: '#nav-tags', popover: { title: 'إدارة الوسوم', description: 'نظم محتواك باستخدام نظام وسوم ذكي يسهل عملية الوصول.' } },
    ]
  },
  {
    id: 'signals',
    title: 'إشارات السوق',
    description: 'فهم إشارات الاستثمار التحليلية المدعومة بالذكاء الاصطناعي.',
    icon: Zap,
    steps: [
      { element: '#nav-signals', popover: { title: 'إشارات السوق', description: 'راقب التغيرات الجوهرية في السوق من خلال تنبيهات الذكاء الاصطناعي.' } },
    ]
  },
  {
    id: 'activity',
    title: 'النشاط والتحديثات',
    description: 'تتبع تحديثات المنصة وسجل العمليات.',
    icon: History,
    steps: [
      { element: '#nav-admin-activity', popover: { title: 'سجل العمليات', description: 'سجل مفصل لكل ما يحدث في المنصة لضمان الشفافية والأمان.' } },
    ]
  }
];

const GuidedTours = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [completedTours, setCompletedTours] = useState<string[]>([]);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem('completedTours');
    if (saved) {
      setCompletedTours(JSON.parse(saved));
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const startTour = (tour: TourItem) => {
    setIsOpen(false);
    
    const driverObj = driver({
      showProgress: true,
      animate: true,
      allowClose: true,
      overlayColor: 'rgba(0, 0, 0, 0.7)',
      stagePadding: 5,
      nextBtnText: 'التالي',
      prevBtnText: 'السابق',
      doneBtnText: 'إنهاء الجولة',
      steps: tour.steps.map((step, idx) => ({
        ...step,
        popover: {
          ...step.popover,
          side: "bottom",
          align: "start",
          title: `خطوة ${idx + 1} من ${tour.steps.length}: ${step.popover.title}`
        }
      })),
      onDeselected: (element, step, { config, state }) => {
        // Handle tour completion
        if (state.activeIndex === tour.steps.length - 1) {
          markAsCompleted(tour.id);
        }
      },
      onDestroyed: (element, step, { config, state }) => {
          // If we reached the end, mark as completed
          if (state.activeIndex === tour.steps.length - 1) {
              markAsCompleted(tour.id);
          }
      }
    });

    driverObj.drive();
  };

  const markAsCompleted = (id: string) => {
    setCompletedTours(prev => {
      if (prev.includes(id)) return prev;
      const next = [...prev, id];
      localStorage.setItem('completedTours', JSON.stringify(next));
      return next;
    });
  };

  return (
    <div className="relative" ref={menuRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all font-black text-[10px] border ${
          isOpen 
          ? 'bg-blue-600 text-white border-blue-500 shadow-lg shadow-blue-500/20' 
          : 'bg-white text-slate-600 border-slate-200 hover:border-blue-500 hover:text-blue-600 shadow-sm'
        }`}
      >
        <Compass size={13} className={isOpen ? 'animate-spin' : ''} />
        <span>الجولات</span>
        <ChevronDown size={11} className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute left-0 mt-3 w-80 bg-white rounded-[28px] shadow-[0_30px_70px_-15px_rgba(0,0,0,0.15)] border border-slate-200 overflow-hidden animate-scaleIn origin-top-left z-[200]">
          <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
             <h3 className="text-sm font-black text-slate-900">اختر جولة تعليمية</h3>
             <div className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-lg">
                تم إكمال {completedTours.length} من {TOURS.length}
             </div>
          </div>
          
          <div className="max-h-[450px] overflow-y-auto custom-scrollbar p-2">
            {TOURS.map((tour) => (
              <button
                key={tour.id}
                onClick={() => startTour(tour)}
                className="w-full flex items-start gap-4 p-4 rounded-2xl hover:bg-blue-50/50 transition-all text-right group"
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${
                  completedTours.includes(tour.id) 
                  ? 'bg-emerald-50 border-emerald-100 text-emerald-600' 
                  : 'bg-slate-50 border-slate-100 text-slate-400 group-hover:bg-blue-100 group-hover:border-blue-200 group-hover:text-blue-600'
                }`}>
                  <tour.icon size={20} />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <h4 className={`text-[13px] font-black group-hover:text-blue-600 transition-colors ${
                      completedTours.includes(tour.id) ? 'text-slate-900' : 'text-slate-700'
                    }`}>
                      {tour.title}
                    </h4>
                    {completedTours.includes(tour.id) && (
                      <CheckCircle2 size={14} className="text-emerald-500" />
                    )}
                  </div>
                  <p className="text-[11px] font-bold text-slate-400 leading-relaxed line-clamp-2">
                    {tour.description}
                  </p>
                </div>
                
                <div className="opacity-0 group-hover:opacity-100 self-center transition-opacity">
                  <PlayCircle size={18} className="text-blue-600" />
                </div>
              </button>
            ))}
          </div>
          
          <div className="p-4 bg-slate-50/50 border-t border-slate-100 text-center">
             <p className="text-[10px] font-bold text-slate-400">هل تحتاج للمساعدة؟ تواصل مع الدعم الفني</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default GuidedTours;
