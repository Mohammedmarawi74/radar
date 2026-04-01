import React, { useState } from 'react';
import {
   Users,
   Search,
   MapPin,
   Filter,
   UserPlus,
   Check,
   ChevronRight,
   UserCheck,
   Shield,
   BadgeCheck,
   Building2,
   TrendingUp,
   Award,
   Star,
   Globe,
   Briefcase,
   FileText,
   BarChart3,
   Landmark,
   ExternalLink,
   Info,
   SlidersHorizontal,
   Layers
} from 'lucide-react';

interface Entity {
   id: string;
   name: string;
   nameEn?: string;
   role: string;
   type: 'ministry' | 'authority' | 'expert' | 'analyst';
   location: string;
   avatar: string;
   coverImage?: string;
   isFollowing: boolean;
   isVerified: boolean;
   verificationLevel?: 'official' | 'verified' | 'none';
   stats: {
      followers: string;
      posts: number;
      datasets?: number;
   };
   specialties?: string[];
   description?: string;
   website?: string;
   establishedYear?: string;
   impact: 'critical' | 'high' | 'medium' | 'low';
}

const SAUDI_ENTITIES: Entity[] = [
   {
      id: 'gov_1',
      name: 'وزارة الاستثمار',
      nameEn: 'Ministry of Investment',
      role: 'جهة حكومية رسمية',
      type: 'ministry',
      location: 'الرياض، المملكة العربية السعودية',
      avatar: 'https://ui-avatars.com/api/?name=MISA&background=0D47A1&color=fff&size=200&bold=true',
      coverImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&h=400&fit=crop',
      isFollowing: true,
      isVerified: true,
      verificationLevel: 'official',
      stats: {
         followers: '245K',
         posts: 1240,
         datasets: 45
      },
      specialties: ['الاستثمار الأجنبي', 'التراخيص', 'الفرص الاستثمارية', 'المناطق الاقتصادية'],
      description: 'الجهة المسؤولة عن تنظيم وتطوير بيئة الاستثمار في المملكة وجذب الاستثمارات الأجنبية المباشرة',
      website: 'misa.gov.sa',
      establishedYear: '2020',
      impact: 'critical'
   },
   {
      id: 'gov_2',
      name: 'الهيئة العامة للإحصاء',
      nameEn: 'General Authority for Statistics',
      role: 'جهة حكومية رسمية',
      type: 'authority',
      location: 'الرياض، المملكة العربية السعودية',
      avatar: 'https://ui-avatars.com/api/?name=GASTAT&background=1B5E20&color=fff&size=200&bold=true',
      coverImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&h=400&fit=crop',
      isFollowing: true,
      isVerified: true,
      verificationLevel: 'official',
      stats: {
         followers: '189K',
         posts: 2850,
         datasets: 120
      },
      specialties: ['البيانات الإحصائية', 'المسوحات الوطنية', 'مؤشرات الاقتصاد', 'سوق العمل'],
      description: 'المصدر الرسمي للبيانات والإحصاءات الوطنية، توفر بيانات دقيقة وموثوقة لدعم اتخاذ القرار',
      website: 'stats.gov.sa',
      establishedYear: '1960',
      impact: 'critical'
   },
   {
      id: 'gov_3',
      name: 'البنك المركزي السعودي',
      nameEn: 'Saudi Central Bank (SAMA)',
      role: 'جهة حكومية رسمية',
      type: 'authority',
      location: 'الرياض، المملكة العربية السعودية',
      avatar: 'https://ui-avatars.com/api/?name=SAMA&background=B71C1C&color=fff&size=200&bold=true',
      coverImage: 'https://images.unsplash.com/photo-1541354329998-f4d9a9f9297f?w=1200&h=400&fit=crop',
      isFollowing: true,
      isVerified: true,
      verificationLevel: 'official',
      stats: {
         followers: '312K',
         posts: 980,
         datasets: 65
      },
      specialties: ['السياسة النقدية', 'الاستقرار المالي', 'الرقابة المصرفية', 'الاحتياطيات'],
      description: 'البنك المركزي للمملكة، المسؤول عن السياسة النقدية والرقابة على القطاع المصرفي والمالي',
      website: 'sama.gov.sa',
      establishedYear: '1952',
      impact: 'critical'
   },
   {
      id: 'gov_4',
      name: 'وزارة التجارة',
      nameEn: 'Ministry of Commerce',
      role: 'جهة حكومية رسمية',
      type: 'ministry',
      location: 'الرياض، المملكة العربية السعودية',
      avatar: 'https://ui-avatars.com/api/?name=MC&background=E65100&color=fff&size=200&bold=true',
      coverImage: 'https://images.unsplash.com/photo-1556740738-b6a63e27c4df?w=1200&h=400&fit=crop',
      isFollowing: false,
      isVerified: true,
      verificationLevel: 'official',
      stats: {
         followers: '156K',
         posts: 1560,
         datasets: 38
      },
      specialties: ['السجلات التجارية', 'حماية المستهلك', 'التجارة الإلكترونية', 'الملكية الفكرية'],
      description: 'تنظيم وتطوير الأنشطة التجارية وحماية حقوق المستهلكين وتعزيز بيئة الأعمال',
      website: 'mc.gov.sa',
      establishedYear: '1954',
      impact: 'high'
   },
   {
      id: 'gov_5',
      name: 'هيئة السوق المالية',
      nameEn: 'Capital Market Authority',
      role: 'جهة حكومية رسمية',
      type: 'authority',
      location: 'الرياض، المملكة العربية السعودية',
      avatar: 'https://ui-avatars.com/api/?name=CMA&background=4A148C&color=fff&size=200&bold=true',
      coverImage: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=1200&h=400&fit=crop',
      isFollowing: true,
      isVerified: true,
      verificationLevel: 'official',
      stats: {
         followers: '198K',
         posts: 1120,
         datasets: 52
      },
      specialties: ['سوق الأسهم', 'الشركات المدرجة', 'الإفصاحات', 'الرقابة المالية'],
      description: 'تنظيم وتطوير السوق المالية السعودية وحماية المستثمرين والمتعاملين',
      website: 'cma.org.sa',
      establishedYear: '2003',
      impact: 'critical'
   },
   {
      id: 'gov_6',
      name: 'وزارة الطاقة',
      nameEn: 'Ministry of Energy',
      role: 'جهة حكومية رسمية',
      type: 'ministry',
      location: 'الرياض، المملكة العربية السعودية',
      avatar: 'https://ui-avatars.com/api/?name=MOE&background=1B5E20&color=fff&size=200&bold=true',
      coverImage: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=1200&h=400&fit=crop',
      isFollowing: false,
      isVerified: true,
      verificationLevel: 'official',
      stats: {
         followers: '142K',
         posts: 890,
         datasets: 42
      },
      specialties: ['الطاقة المتجددة', 'النفط والغاز', 'الكهرباء', 'الاستدامة'],
      description: 'تنظيم قطاع الطاقة وتطوير مصادر الطاقة المتجددة وضمان أمن الإمداد',
      website: 'moenergy.gov.sa',
      establishedYear: '2019',
      impact: 'critical'
   },
   {
      id: 'expert_1',
      name: 'د. خالد بن فهد العثمان',
      nameEn: 'Dr. Khalid Al-Othman',
      role: 'خبير اقتصادي - محلل أسواق',
      type: 'expert',
      location: 'الرياض، المملكة العربية السعودية',
      avatar: 'https://i.pravatar.cc/200?u=khalid',
      isFollowing: true,
      isVerified: true,
      verificationLevel: 'verified',
      stats: {
         followers: '45.2K',
         posts: 1850
      },
      specialties: ['الاقتصاد الكلي', 'الأسواق المالية', 'رؤية 2030', 'التحليل الاستراتيجي'],
      description: 'خبير اقتصادي معتمد مع أكثر من 15 عاماً من الخبرة في تحليل الأسواق السعودية والخليجية',
      impact: 'high'
   },
   {
      id: 'expert_2',
      name: 'سارة المنصور',
      nameEn: 'Sarah Al-Mansour',
      role: 'محللة بيانات عقارية',
      type: 'analyst',
      location: 'جدة، المملكة العربية السعودية',
      avatar: 'https://i.pravatar.cc/200?u=sarah',
      isFollowing: false,
      isVerified: true,
      verificationLevel: 'verified',
      stats: {
         followers: '28.5K',
         posts: 920
      },
      specialties: ['السوق العقاري', 'تحليل البيانات', 'التقييم العقاري', 'الاستثمار العقاري'],
      description: 'متخصصة في تحليل بيانات السوق العقاري السعودي وتقديم رؤى استثمارية دقيقة',
      impact: 'high'
   },
   {
      id: 'expert_3',
      name: 'م. عبدالله الجارالله',
      nameEn: 'Eng. Abdullah Al-Jarallah',
      role: 'خبير سلاسل الإمداد واللوجستيات',
      type: 'expert',
      location: 'الدمام، المملكة العربية السعودية',
      avatar: 'https://i.pravatar.cc/200?u=abdullah',
      isFollowing: false,
      isVerified: true,
      verificationLevel: 'verified',
      stats: {
         followers: '32.8K',
         posts: 1240
      },
      specialties: ['سلاسل الإمداد', 'اللوجستيات', 'التجارة الدولية', 'الموانئ'],
      description: 'مهندس صناعي متخصص في تحسين سلاسل الإمداد وتطوير الحلول اللوجستية',
      impact: 'high'
   },
   {
      id: 'analyst_1',
      name: 'أحمد محمود الشهري',
      nameEn: 'Ahmed Al-Shehri',
      role: 'محلل تقني - أسواق المال',
      type: 'analyst',
      location: 'الرياض، المملكة العربية السعودية',
      avatar: 'https://i.pravatar.cc/200?u=ahmed',
      isFollowing: true,
      isVerified: false,
      verificationLevel: 'none',
      stats: {
         followers: '18.3K',
         posts: 2450
      },
      specialties: ['التحليل الفني', 'تاسي', 'العملات الرقمية', 'الأسهم'],
      description: 'محلل تقني متخصص في أسواق الأسهم السعودية والخليجية',
      impact: 'medium'
   }
];

const EntityCard = ({ entity, toggleFollow }: { entity: Entity, toggleFollow: (id: string) => void, key?: React.Key }) => {
   const [showDetails, setShowDetails] = useState(false);

   return (
      <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm hover:shadow-md transition-all duration-300 p-5 group flex flex-col h-full">
         <div className="flex items-start gap-4">
            {/* Logo/Avatar */}
            <div className="relative shrink-0">
               <div className={`w-14 h-14 rounded-xl overflow-hidden shadow-sm transition-transform group-hover:scale-105 duration-300 ${entity.verificationLevel === 'official' ? 'ring-2 ring-blue-500/20' : 'ring-2 ring-slate-100'}`}>
                  <img src={entity.avatar} alt={entity.name} className="w-full h-full object-cover" />
               </div>
               {entity.isVerified && (
                  <div className={`absolute -bottom-1 -left-1 ${entity.verificationLevel === 'official' ? 'bg-blue-600' : 'bg-green-600'} text-white p-1 rounded-lg border-2 border-white shadow-sm`}>
                     {entity.verificationLevel === 'official' ? <Shield size={10} className="fill-white" /> : <BadgeCheck size={10} className="fill-white" />}
                  </div>
               )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
               <div className="flex items-center gap-1.5 mb-1">
                  <h3 className="text-sm font-black text-slate-900 truncate group-hover:text-blue-600 transition-colors">
                     {entity.name}
                  </h3>
                  {entity.isVerified && <BadgeCheck size={14} className="text-blue-500 shrink-0" />}
               </div>
               <p className="text-[11px] font-bold text-slate-400 truncate mb-2">{entity.role}</p>
               
               {/* 1-line Truncated Description */}
               <p className="text-[11px] text-slate-500 font-medium line-clamp-1 mb-3">
                  {entity.description}
               </p>
            </div>

            {/* Follow Button */}
            <button
               onClick={() => toggleFollow(entity.id)}
               className={`shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-all ${entity.isFollowing
                     ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
                     : 'bg-slate-50 border border-slate-200 text-slate-400 hover:text-blue-600 hover:border-blue-200'
                  }`}
            >
               {entity.isFollowing ? <Check size={14} strokeWidth={3} /> : <UserPlus size={14} />}
            </button>
         </div>

         {/* Secondary Content Bar */}
         <div className="mt-auto pt-4 flex items-center justify-between border-t border-slate-50">
            <div className="flex items-center gap-4">
               <div className="flex items-center gap-1.5">
                  <Users size={12} className="text-slate-300" />
                  <span className="text-[10px] font-bold text-slate-500">{entity.stats.followers}</span>
               </div>
               <div className="flex items-center gap-1.5">
                  <FileText size={12} className="text-slate-300" />
                  <span className="text-[10px] font-bold text-slate-500">{entity.stats.posts}</span>
               </div>
            </div>
            
            <button 
               onClick={() => setShowDetails(!showDetails)}
               className="text-[10px] font-black text-blue-600 hover:underline flex items-center gap-1"
            >
               {showDetails ? 'أقل' : 'التفاصيل'}
               <ChevronRight size={10} className={`transition-transform ${showDetails ? 'rotate-90' : ''}`} />
            </button>
         </div>

         {/* Revealable Details */}
         {showDetails && (
            <div className="mt-4 p-3 bg-slate-50 rounded-xl space-y-3 animate-fadeIn">
               <div className="flex flex-wrap gap-1.5">
                  {entity.specialties?.map((s, i) => (
                     <span key={i} className="text-[9px] font-bold bg-white text-slate-500 px-2 py-0.5 rounded-md border border-slate-100">{s}</span>
                  ))}
               </div>
               <div className="flex items-center justify-between text-[10px] font-bold text-slate-400">
                  <span className="flex items-center gap-1"><MapPin size={10} /> {entity.location.split('،')[0]}</span>
                  {entity.website && <span className="flex items-center gap-1"><Globe size={10} /> {entity.website}</span>}
               </div>
            </div>
         )}
      </div>
   );
};

const FollowersPage = () => {
   const [entities, setEntities] = useState<Entity[]>(SAUDI_ENTITIES);
   const [searchQuery, setSearchQuery] = useState('');
   const [activeFilter, setActiveFilter] = useState<'all' | 'following' | 'official' | 'experts'>('all');
   const [typeFilter, setTypeFilter] = useState<string>('all');

   const toggleFollow = (id: string) => {
      setEntities(prev => prev.map(e =>
         e.id === id ? { ...e, isFollowing: !e.isFollowing } : e
      ));
   };

   const filteredEntities = entities.filter(entity => {
      const matchesSearch =
         entity.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
         entity.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
         (entity.nameEn?.toLowerCase().includes(searchQuery.toLowerCase())) ||
         (entity.specialties?.some(s => s.toLowerCase().includes(searchQuery.toLowerCase())));

      const matchesActiveFilter =
         activeFilter === 'all' ? true :
            activeFilter === 'following' ? entity.isFollowing :
               activeFilter === 'official' ? (entity.type === 'ministry' || entity.type === 'authority') :
                  activeFilter === 'experts' ? (entity.type === 'expert' || entity.type === 'analyst') :
                     true;

      const matchesTypeFilter =
         typeFilter === 'all' ? true : entity.type === typeFilter;

      return matchesSearch && matchesActiveFilter && matchesTypeFilter;
   });

   const stats = {
      total: entities.length,
      following: entities.filter(e => e.isFollowing).length,
      official: entities.filter(e => e.type === 'ministry' || e.type === 'authority').length,
      experts: entities.filter(e => e.type === 'expert' || e.type === 'analyst').length
   };

   return (
      <div className="max-w-7xl mx-auto p-4 lg:p-8 animate-fadeIn space-y-8">
         
         {/* --- Compact Header --- */}
         <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-200">
            <div className="space-y-1">
               <h1 className="text-2xl lg:text-3xl font-black text-slate-900 flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
                     <Users size={20} />
                  </div>
                  المجتمع والخبراء
               </h1>
               <p className="text-sm font-medium text-slate-500">دليل الجهات الرسمية والمحللين الاستراتيجيين في المملكة</p>
            </div>
            
            <div className="flex flex-wrap items-center gap-3">
               {[
                  { l: 'إجمالي الجهات', v: stats.total, c: 'bg-slate-100 text-slate-600' },
                  { l: 'أتابعها', v: stats.following, c: 'bg-emerald-50 text-emerald-700' },
                  { l: 'جهات رسمية', v: stats.official, c: 'bg-blue-50 text-blue-700' },
                  { l: 'خبراء', v: stats.experts, c: 'bg-purple-50 text-purple-700' },
               ].map((s, i) => (
                  <div key={i} className={`px-4 py-2 rounded-xl text-[11px] font-black flex items-center gap-2 border border-transparent shadow-sm ${s.c}`}>
                     <span className="opacity-60">{s.l}</span>
                     <span>{s.v}</span>
                  </div>
               ))}
            </div>
         </div>

         <div className="flex flex-col lg:flex-row gap-8 items-start">
            {/* --- Sticky Sidebar Sidebar --- */}
            <aside className="w-full lg:w-72 shrink-0 lg:sticky lg:top-24 space-y-6">
               <div className="bg-white rounded-3xl border border-slate-200/60 p-6 shadow-sm space-y-6">
                  <div className="space-y-4">
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                        <Search size={14} className="text-blue-500" /> محرك البحث
                     </label>
                     <div className="relative">
                        <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                        <input
                           type="text"
                           placeholder="ابحث هنا..."
                           value={searchQuery}
                           onChange={(e) => setSearchQuery(e.target.value)}
                           className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 pr-10 pl-4 text-xs font-bold focus:bg-white focus:border-blue-500 outline-none transition-all"
                        />
                     </div>
                  </div>

                  <div className="space-y-4">
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                        <Filter size={14} className="text-blue-500" /> التصنيف الرئيسي
                     </label>
                     <div className="flex flex-col gap-1.5">
                        {[
                           { id: 'all', l: 'الكل', i: Layers, count: stats.total },
                           { id: 'following', l: 'أتابعها', i: UserCheck, count: stats.following },
                           { id: 'official', l: 'جهات رسمية', i: Shield, count: stats.official },
                           { id: 'experts', l: 'خبراء ومحللون', i: Award, count: stats.experts }
                        ].map(f => (
                           <button
                              key={f.id}
                              onClick={() => setActiveFilter(f.id as any)}
                              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs font-black transition-all ${activeFilter === f.id ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/10' : 'text-slate-500 hover:bg-slate-50'}`}
                           >
                              <div className="flex items-center gap-3">
                                 <f.i size={16} className={activeFilter === f.id ? 'text-white' : 'text-slate-300'} />
                                 <span>{f.l}</span>
                              </div>
                              <span className={`text-[10px] px-1.5 rounded-md ${activeFilter === f.id ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-400'}`}>{f.count}</span>
                           </button>
                        ))}
                     </div>
                  </div>

                  <div className="space-y-4 pt-4 border-t border-slate-50">
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                        <SlidersHorizontal size={14} className="text-blue-500" /> نوع الجهة
                     </label>
                     <select
                        value={typeFilter}
                        onChange={(e) => setTypeFilter(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-xs font-bold text-slate-600 focus:bg-white focus:border-blue-500 outline-none transition-all cursor-pointer"
                     >
                        <option value="all">جميع القطاعات</option>
                        <option value="ministry">وزارات استراتيجية</option>
                        <option value="authority">هيئات وطنية</option>
                        <option value="expert">خبراء مستقلون</option>
                        <option value="analyst">محللون ماليون</option>
                     </select>
                  </div>
               </div>

               <div className="p-6 bg-blue-600 rounded-3xl text-white shadow-xl shadow-blue-600/20 relative overflow-hidden group">
                  <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
                  <div className="relative z-10 space-y-2">
                     <h4 className="text-sm font-black">هل أنت خبير؟</h4>
                     <p className="text-[11px] font-medium opacity-80 leading-relaxed">انضم إلى قائمة الخبراء الموثقين في رادار لتصل تحليلاتك إلى آلاف المستثمرين.</p>
                     <button className="pt-2 text-[11px] font-black underline flex items-center gap-1">تقديم طلب توثيق <ExternalLink size={10} /></button>
                  </div>
               </div>
            </aside>

            {/* --- Main Content Area --- */}
            <div className="flex-1 space-y-6">
               <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                     <h2 className="text-sm font-black text-slate-900">المستودع الرقمي</h2>
                     <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-md font-black">{filteredEntities.length} عنصر مفلتر</span>
                  </div>
                  <div className="flex items-center gap-2">
                     <button className="p-2 text-slate-400 hover:text-blue-600 transition-all"><SlidersHorizontal size={14} /></button>
                  </div>
               </div>

               {filteredEntities.length === 0 ? (
                  <div className="py-32 text-center bg-white rounded-[40px] border border-slate-200/60 shadow-sm animate-fadeIn">
                     <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Search size={32} className="text-slate-200" />
                     </div>
                     <h3 className="text-lg font-black text-slate-900 mb-1">لا توجد نتائج مطابقة</h3>
                     <p className="text-xs text-slate-400 font-medium">حاول تعديل كلمات البحث أو الفلاتر المختارة</p>
                  </div>
               ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-5">
                     {filteredEntities.map(entity => (
                        <EntityCard key={entity.id} entity={entity} toggleFollow={toggleFollow} />
                     ))}
                  </div>
               )}
            </div>
         </div>

         <style>{`
            .no-scrollbar::-webkit-scrollbar { display: none; }
            .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
            @keyframes fadeIn {
               from { opacity: 0; transform: translateY(10px); }
               to { opacity: 1; transform: translateY(0); }
            }
            .animate-fadeIn {
               animation: fadeIn 0.4s ease-out forwards;
            }
         `}</style>
      </div>
   );
};

export default FollowersPage;
