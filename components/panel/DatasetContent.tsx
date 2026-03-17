import React, { useState } from 'react';
import { 
  ChevronDown, 
  ChevronUp, 
  Eye, 
  Download, 
  Star, 
  Database,
  FileText,
  Share2,
  BarChart3,
  Layers,
  Archive,
  Terminal,
  Calendar,
  Globe,
  Tag as TagIcon
} from 'lucide-react';
import ActivityChart from './ActivityChart';

interface DatasetContentProps {
  description?: string;
  sources?: string[];
  fields?: { label: string; key: string; type: string }[];
  datasets?: { name: string; description: string; source: string; lastUpdated: string; coverage: string }[];
  publisher?: string;
}

const AccordionItem: React.FC<{
  title: string;
  icon: React.ElementType;
  isOpen: boolean;
  onClick: () => void;
  children: React.ReactNode;
}> = ({ title, icon: Icon, isOpen, onClick, children }) => (
  <div className="border border-gray-200 rounded-xl mb-4 overflow-hidden bg-white shadow-sm hover:border-gov-light transition-all">
    <button
      onClick={onClick}
      className={`w-full flex items-center justify-between p-5 transition-colors ${isOpen ? 'bg-gov-blue text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
    >
      <div className="flex items-center gap-3 text-right">
        <Icon size={20} className={isOpen ? 'text-white' : 'text-gov-blue'} />
        <span className="font-bold">{title}</span>
      </div>
      {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} className="text-gray-400" />}
    </button>
    {isOpen && (
      <div className="p-6 bg-white border-t border-gray-100 animate-fadeIn text-right" dir="rtl">
        {children}
      </div>
    )}
  </div>
);

const DatasetContent: React.FC<DatasetContentProps> = ({ 
  description, 
  sources = [], 
  fields = [], 
  datasets = [],
  publisher = 'الهيئة العامة للإحصاء'
}) => {
  const [openAccordions, setOpenAccordions] = useState<Record<string, boolean>>({
    publisher: true,
    meta: false,
    sources: false,
    api: false
  });

  const toggleAccordion = (key: string) => {
    setOpenAccordions(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const defaultDescription = "توفر هذه المجموعة من البيانات رؤى استراتيجية شاملة حول القطاع الاقتصادي المختار، مما يدعم صناع القرار والمحللين في فهم اتجاهات السوق السعودي.";

  return (
    <div className="space-y-8 pb-10 text-right" dir="rtl">
      
      {/* About Section */}
      <section className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gov-blue/5 rounded-full -mr-16 -mt-16"></div>
        <h2 className="text-2xl font-black text-gov-blue mb-6 flex items-center gap-3 relative z-10">
          <FileText size={28} />
          عن مجموعة البيانات
        </h2>
        <div className="prose prose-lg text-gray-600 leading-relaxed max-w-none relative z-10">
          <p className="text-sm font-bold leading-relaxed text-gray-700">
            {description || defaultDescription}
          </p>
        </div>
      </section>

      {/* Structured Info Section */}
      <section>
        <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <Database size={22} className="text-gov-blue" />
            التفاصيل والمعلومات التقنية المدمجة
        </h2>
        
        <div className="space-y-2">
            {/* Publisher Info */}
            <AccordionItem 
                title="الناشر والتبعات" 
                icon={Share2}
                isOpen={openAccordions.publisher} 
                onClick={() => toggleAccordion('publisher')}
            >
                <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-3 border-b border-gray-50 last:border-0">
                        <span className="text-gray-500 text-sm">الناشر الأساسي</span>
                        <span className="font-bold text-gray-800 text-base">{publisher}</span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-3 border-b border-gray-50 last:border-0">
                        <span className="text-gray-500 text-sm">الجهات المشاركة</span>
                        <span className="font-bold text-gray-800 text-base">
                            {sources.length > 0 ? sources.join('، ') : 'وزارة التجارة، والجهات ذات العلاقة'}
                        </span>
                    </div>
                </div>
            </AccordionItem>

            {/* Technical Metadata */}
            <AccordionItem 
                title="البيانات الوصفية (Metadata)" 
                icon={Calendar} 
                isOpen={openAccordions.meta} 
                onClick={() => toggleAccordion('meta')}
            >
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-2">
                    {fields.length > 0 ? fields.map((field, idx) => (
                      <div key={idx} className="flex justify-between items-center py-3 border-b border-gray-50">
                          <span className="text-gray-500 text-sm">{field.label}</span>
                          <span className="font-bold text-slate-700 bg-slate-50 px-2 py-1 rounded text-[10px]">{field.type === 'metric' ? 'مؤشر رقمي' : field.type === 'table' ? 'جدول بيانات' : 'رسم بياني'}</span>
                      </div>
                    )) : (
                      <p className="text-gray-400 text-sm italic">لا توجد حقول محددة حالياً</p>
                    )}
                 </div>
            </AccordionItem>

            {/* Sources & Classifications */}
            <AccordionItem 
                title="المصادر والتصنيفات الموضوعية" 
                icon={Archive}
                isOpen={openAccordions.sources} 
                onClick={() => toggleAccordion('sources')}
            >
                <div className="space-y-6">
                    <div className="grid grid-cols-1 gap-4">
                        <div className="p-4 rounded-xl bg-blue-50 border border-blue-100">
                           <h4 className="text-sm font-bold text-blue-800 mb-3 flex items-center gap-2">
                               <Download size={16} /> ملفات المصدر (Datasets)
                           </h4>
                           <div className="space-y-3">
                               {datasets.length > 0 ? datasets.map((ds, idx) => (
                                   <div key={idx} className="flex items-center justify-between bg-white p-4 rounded-xl border border-blue-200 shadow-sm">
                                       <div className="flex flex-col gap-1">
                                          <span className="text-gray-900 font-black text-sm">{ds.name}</span>
                                          <span className="text-[10px] text-gray-500 font-bold">{ds.source} • {ds.lastUpdated}</span>
                                       </div>
                                       <button className="bg-gov-blue text-white px-4 py-2 rounded-lg text-xs font-black hover:bg-gov-light transition-all shadow-sm">تحميل البيانات</button>
                                   </div>
                               )) : (
                                 <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-blue-200">
                                     <span className="text-gray-400 text-xs text-center w-full">لا توجد ملفات حالياً</span>
                                 </div>
                               )}
                           </div>
                        </div>
                    </div>
                </div>
            </AccordionItem>

            {/* API */}
            <AccordionItem 
                title="الوصول المباشر (REST API)" 
                icon={Terminal}
                isOpen={openAccordions.api} 
                onClick={() => toggleAccordion('api')}
            >
                 <div className="space-y-4">
                    <p className="text-sm text-gray-600">يمكن للمطورين استهلاك هذه البيانات برمجياً لضمان التحديث التلقائي في تطبيقاتهم.</p>
                    <div className="bg-slate-900 rounded-xl p-5 overflow-x-auto border border-slate-800 shadow-inner">
                        <pre className="text-blue-400 text-[11px] font-mono leading-relaxed" dir="ltr">
{`// استدعاء البيانات المجمعة
GET https://api.radar.gov.sa/v1/data-angles/dynamic-query
x-api-key: {YOUR_API_KEY}
Accept: application/json`}
                        </pre>
                    </div>
                 </div>
            </AccordionItem>
        </div>
      </section>

      {/* Activity Section */}
      <section className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
        <h2 className="text-xl font-bold text-gray-800 mb-8 border-b border-gray-100 pb-4 flex items-center gap-3">
             <BarChart3 size={24} className="text-gov-blue" />
             مؤشرات الاستخدام والتفاعل
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="flex items-center gap-5 p-5 bg-blue-50/50 rounded-2xl border border-blue-50">
                <div className="bg-white p-4 rounded-xl shadow-sm text-blue-600">
                    <Eye size={28} />
                </div>
                <div>
                    <div className="text-3xl font-black text-gray-800 leading-none mb-1 text-left">2,840</div>
                    <div className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">المشاهدات</div>
                </div>
            </div>
             <div className="flex items-center gap-5 p-5 bg-gov-light/10 rounded-2xl border border-gov-light/5">
                <div className="bg-white p-4 rounded-xl shadow-sm text-gov-blue">
                    <Download size={28} />
                </div>
                <div>
                    <div className="text-3xl font-black text-gray-800 leading-none mb-1 text-left">840</div>
                    <div className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">التنزيلات</div>
                </div>
            </div>
             <div className="flex items-center gap-5 p-5 bg-amber-50 rounded-2xl border border-amber-100">
                <div className="bg-white p-4 rounded-xl shadow-sm text-amber-500">
                    <Star size={28} />
                </div>
                <div>
                    <div className="text-3xl font-black text-gray-800 leading-none mb-1 text-left">4.9</div>
                    <div className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">التقييم العام</div>
                </div>
            </div>
        </div>

        <div className="h-[320px] w-full">
            <ActivityChart />
        </div>
      </section>

      {/* Rating Section */}
      <section className="bg-gradient-to-l from-gov-blue to-blue-900 rounded-3xl p-8 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
         <div className="absolute top-0 left-0 w-64 h-64 bg-white/5 rounded-full -ml-32 -mt-32"></div>
         <div className="text-center md:text-right relative z-10">
            <h3 className="text-2xl font-black mb-2 tracking-tight">كيف كانت تجربتك مع هذه البيانات؟</h3>
            <p className="text-blue-100 text-sm opacity-90 font-bold">رأيك يساهم في بناء مستقبل البيانات المفتوحة في المملكة لعام 2030</p>
         </div>
         <div className="flex gap-2 relative z-10">
             {[1, 2, 3, 4, 5].map((star) => (
                 <button key={star} className="text-blue-200/40 hover:text-amber-400 transition-all hover:scale-125 focus:scale-125 focus:text-amber-400">
                     <Star size={36} fill="currentColor" />
                 </button>
             ))}
         </div>
         <button className="bg-white text-gov-blue px-10 py-4 rounded-2xl font-black hover:bg-gov-light hover:text-white transition-all shadow-xl active:scale-95 relative z-10">
             إرسال التقييم
         </button>
      </section>

    </div>
  );
};

export default DatasetContent;