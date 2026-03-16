import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useToast } from './Toast';
import { 
  Bell, Send, Mail, MessageSquare, Smartphone, Users, Globe, Clock, 
  CheckCircle2, AlertCircle, TrendingUp, Search, Plus, Trash2, 
  Filter, Eye, MoreVertical, Layout, Zap, Radio, Target, 
  ArrowUpRight, BarChart3, ShieldCheck, History, Calendar, 
  ChevronRight, RefreshCw, Layers, Edit3, Save, X, Info, Activity,
  Image as ImageIcon, UserPlus, Sliders, Play, Settings, ChevronDown, ListFilter,
  RotateCcw, CalendarDays, Repeat, MapPin, Check, Copy, Ghost, Download, 
  TrendingDown, PieChart, MousePointer2, FileText, Share2, Star, Bookmark,
  Shield, UserCheck, MessageCircle, AlertTriangle, Link as LinkIcon, Box, Monitor,
  Command, Cpu, Globe2, Sparkles, Navigation, LayoutTemplate
} from 'lucide-react';
import { 
  AreaChart as ReAreaChart, Area as ReArea, XAxis as ReXAxis, YAxis as ReYAxis, 
  CartesianGrid as ReCartesianGrid, Tooltip as ReTooltip, ResponsiveContainer as ReResponsiveContainer,
  BarChart as ReBarChart, Bar as ReBar
} from 'recharts';

// --- Types ---
type NotificationType = 'push' | 'in-app' | 'email' | 'sms';
type NotificationCategory = 'urgent' | 'informational' | 'promotional' | 'analytical' | 'system';
type Priority = 'critical' | 'high' | 'medium' | 'low';
type Status = 'delivered' | 'failed' | 'scheduled' | 'sending' | 'recurring' | 'resending' | 'draft';
type Placement = 'global_header' | 'sidebar_top' | 'dashboard_hero' | 'market_feed' | 'floating_toast';

interface IntegrationMapping {
  id: string;
  sourceModule: string;
  triggerEvent: string;
  targetPlacement: Placement;
  priorityOverride: Priority;
  isActive: boolean;
}

const INITIAL_INTEGRATIONS: IntegrationMapping[] = [
  { id: 'int-1', sourceModule: 'إشارات الذكاء الاصطناعي', triggerEvent: 'تذبذب عالي في السوق', targetPlacement: 'global_header', priorityOverride: 'critical', isActive: true },
  { id: 'int-2', sourceModule: 'مركز الدعم', triggerEvent: 'رد خبير جديد', targetPlacement: 'floating_toast', priorityOverride: 'high', isActive: true },
  { id: 'int-3', sourceModule: 'محرك المحفظة', triggerEvent: 'تجاوز حد الخسارة', targetPlacement: 'dashboard_hero', priorityOverride: 'high', isActive: true }
];

const AdminNotificationsPage = () => {
  const { showToast } = useToast();
  const [searchParams] = useSearchParams();
  const tabParam = searchParams.get('tab') || 'integrations';
  
  const [integrations, setIntegrations] = useState<IntegrationMapping[]>(INITIAL_INTEGRATIONS);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCampaignModalOpen, setIsCampaignModalOpen] = useState(false);
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [isHighVolatilityMode, setIsHighVolatilityMode] = useState(false);
  const [optimizationProgress, setOptimizationProgress] = useState(0);
  const [showOptimizeTooltip, setShowOptimizeTooltip] = useState(false);
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    sourceModule: 'إشارات الذكاء الاصطناعي (AI Signals)',
    triggerEvent: '',
    placement: 'dashboard_hero' as Placement,
    priority: 'medium' as Priority,
    path: ''
  });

  const handleOpenModal = (int?: IntegrationMapping) => {
    if (int) {
      setEditingId(int.id);
      setFormData({
        sourceModule: int.sourceModule,
        triggerEvent: int.triggerEvent,
        placement: int.targetPlacement,
        priority: int.priorityOverride,
        path: ''
      });
    } else {
      setEditingId(null);
      setFormData({
        sourceModule: 'إشارات الذكاء الاصطناعي (AI Signals)',
        triggerEvent: '',
        placement: 'dashboard_hero',
        priority: 'medium',
        path: ''
      });
    }
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (!formData.triggerEvent) {
      showToast('الرجاء إدخال اسم الحدث المسبب للتنبيه', 'error');
      return;
    }

    if (editingId) {
      setIntegrations(prev => prev.map(item => 
        item.id === editingId 
          ? { ...item, sourceModule: formData.sourceModule, triggerEvent: formData.triggerEvent, targetPlacement: formData.placement, priorityOverride: formData.priority }
          : item
      ));
      showToast('تم تحديث إعدادات الربط بنجاح', 'success');
    } else {
      const newInt: IntegrationMapping = {
        id: `int-${Date.now()}`,
        sourceModule: formData.sourceModule,
        triggerEvent: formData.triggerEvent,
        targetPlacement: formData.placement,
        priorityOverride: formData.priority,
        isActive: true
      };
      setIntegrations(prev => [newInt, ...prev]);
      showToast('تم إضافة ربط برمجي جديد بنجاح', 'success');
    }
    setIsModalOpen(false);
  };

  const handleSendCampaign = () => {
    showToast('جاري تحضير الجمهور المستهدف...', 'info');
    setTimeout(() => {
       showToast('تم إرسال الحملة لـ 15,420 مستخدم بنجاح!', 'success');
       setIsCampaignModalOpen(false);
    }, 2000);
  };

  const handleSaveTemplate = () => {
    showToast('تم حفظ قالب الإشعار المخصص', 'success');
    setIsTemplateModalOpen(false);
  };

  const handleToggleActive = (id: string) => {
    setIntegrations(prev => prev.map(item => 
      item.id === id ? { ...item, isActive: !item.isActive } : item
    ));
    showToast('تم تغيير حالة التزامن', 'info');
  };

  const handleDelete = (id: string) => {
    setIntegrations(prev => prev.filter(item => item.id !== id));
    showToast('تم حذف الربط بنجاح', 'success');
  };

  const handleOptimize = () => {
    setIsOptimizing(true);
    setOptimizationProgress(10);
    showToast('جاري تحليل سلوك المستخدمين لتحسين مواقع الظهور...', 'info');
    
    const intervals = [30, 65, 85, 100];
    intervals.forEach((step, idx) => {
      setTimeout(() => {
        setOptimizationProgress(step);
        if (step === 100) {
          setIsOptimizing(false);
          showToast('تم تحسين مواقع الظهور بنجاح! تم تقليل التداخل بنسبة 24%', 'success');
        }
      }, (idx + 1) * 800);
    });
  };

  const getHeaderText = () => {
    switch(tabParam) {
      case 'templates': return 'قوالب الإشعارات';
      case 'analytics': return 'الإحصائيات والتقارير';
      case 'audit': return 'سجل العمليات';
      default: return 'لوحة التحكم بالتنبيهات';
    }
  };

  const getPageInfo = () => {
    switch(tabParam) {
      case 'templates': return {
        desc: 'مركز تصميم وتخصيص محتوى الإشعارات؛ يمكنك هنا تعديل القوالب القياسية أو إنشاء نماذج جديدة تتناسب مع هوية علامتك التجارية.',
        icon: <LayoutTemplate size={18} className="text-amber-500" />
      };
      case 'analytics': return {
        desc: 'نظرة شمولية على أداء الإشعارات؛ تحليل سلوك المستخدمين ونسبة التفاعل لمساعدتك في اتخاذ قرارات مبنية على بيانات حقيقية.',
        icon: <Target size={18} className="text-blue-500" />
      };
      case 'audit': return {
        desc: 'سجل الرقابة الكامل لكافة النشاطات الإدارية والبرمجية داخل نظام التنبيهات لضمان أعلى مستويات الأمان والمتابعة.',
        icon: <History size={18} className="text-zinc-400" />
      };
      default: return {
        desc: 'هنا يمكنك ربط أحداث النظام البرمجية بقنوات البث المختلفة وتحديد أولوياتها لضمان وصول التنبيهات لمكانها الصحيح.',
        icon: <Box size={18} className="text-blue-500" />
      };
    }
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 p-6 lg:p-10 font-sans select-none" dir="rtl">
      
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 animate-fadeIn">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 bg-white rounded-[28px] flex items-center justify-center shadow-2xl shadow-blue-500/10 border border-white/5">
             <Command className="text-black" size={32} />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight">{getHeaderText()}</h1>
            <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-[0.2em] mt-1">
              {tabParam === 'integrations' ? 'Automation & Logic Controller' : 'System Management Interface'}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="hidden xl:flex items-center gap-3 px-5 py-3 bg-zinc-900 shadow-xl rounded-2xl border border-zinc-800">
             <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
             <span className="text-[10px] font-black uppercase text-zinc-400">حالة النظام: متزامن</span>
          </div>
          <button onClick={() => setIsCampaignModalOpen(true)} className="px-8 py-4 bg-amber-500 text-black rounded-2xl text-[11px] font-black shadow-lg shadow-amber-500/20 hover:bg-amber-400 transition-all flex items-center gap-2">
            <Plus size={18} strokeWidth={3} /> حملة موجهة ذكية
          </button>
        </div>
      </header>

      <main className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        <div className="lg:col-span-8 space-y-10">
           
           {/* Tab Introduction Description */}
           <div className="bg-zinc-900/20 border-l-4 border-zinc-800 p-6 rounded-2xl animate-fadeIn shadow-sm">
              <div className="flex items-start gap-4">
                 <div className="mt-1">{getPageInfo().icon}</div>
                 <p className="text-[11px] font-bold text-zinc-400 leading-relaxed">
                    {getPageInfo().desc}
                 </p>
              </div>
           </div>
           
           {tabParam === 'integrations' && (
             <div className="space-y-8 animate-fadeIn">
                <div className="bg-zinc-900/40 border border-zinc-800 rounded-[48px] p-10 space-y-8 shadow-2xl relative">
                   <div className="flex items-center justify-between">
                      <div 
                        className="flex items-center gap-4 cursor-help group/title relative"
                        onMouseEnter={() => setActiveTooltip('mapping')}
                        onMouseLeave={() => setActiveTooltip(null)}
                      >
                         <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-500 shadow-inner group-hover/title:bg-blue-500/20 transition-all"><Box size={24} /></div>
                         <div>
                            <h3 className="text-lg font-black group-hover/title:text-blue-400 transition-colors">خارطة ربط الوحدات (Module Mapping)</h3>
                            <p className="text-[10px] text-zinc-500 font-bold uppercase mt-1">تكوين قنوات البث التلقائي لكل خدمة</p>
                         </div>

                         {activeTooltip === 'mapping' && (
                            <div className="absolute top-full right-0 mt-4 w-80 p-6 bg-zinc-950 border border-blue-500/30 rounded-[32px] shadow-2xl z-[100] animate-fadeIn">
                               <p className="text-[10px] font-bold text-zinc-400 leading-relaxed text-right">
                                  يقوم هذا النظام بربط الأحداث البرمجية (مثل تغير السعر أو فتح تذكرة دعم) بواجهة الإشعارات، مما يضمن وصول المعلومة الصحيحة للمكان الصحيح تلقائياً.
                               </p>
                            </div>
                         )}
                      </div>
                      <button onClick={() => handleOpenModal()} className="px-5 py-2.5 bg-zinc-800 border border-zinc-700 rounded-xl text-[10px] font-black text-zinc-300 hover:text-white transition-all shadow-lg">+ إضافة ربط جديد</button>
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
                      {integrations.map(int => (
                        <div key={int.id} className="p-8 bg-zinc-950 rounded-[40px] border border-zinc-800 hover:border-blue-500/30 transition-all group relative overflow-hidden shadow-xl">
                           <div className="flex justify-between items-start mb-6">
                              <div className="space-y-1">
                                 <span className="text-[9px] font-black text-blue-500 uppercase tracking-widest">{int.sourceModule}</span>
                                 <h4 className="text-sm font-black tracking-tight">{int.triggerEvent}</h4>
                              </div>
                              <button 
                                onClick={() => handleToggleActive(int.id)}
                                className={`w-3 h-3 rounded-full transition-all duration-500 ${int.isActive ? 'bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.7)]' : 'bg-zinc-800'}`}
                                title={int.isActive ? "إيقاف مؤقت" : "تفعيل"}
                              />
                           </div>
                           
                           <div className="flex items-center justify-between py-4 border-t border-zinc-800/50">
                              <div className="flex items-center gap-2 text-zinc-400">
                                 <Monitor size={14} />
                                 <span className="text-[10px] font-bold uppercase tracking-tighter">{int.targetPlacement.replace('_', ' ')}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                 <Zap size={14} className={int.priorityOverride === 'critical' ? 'text-rose-500' : 'text-amber-500'} />
                                 <span className="text-[10px] font-black uppercase text-zinc-500">{int.priorityOverride}</span>
                              </div>
                           </div>
                           
                           <div className="flex gap-2 pt-4">
                              <button onClick={() => handleOpenModal(int)} className="flex-1 py-3 bg-zinc-900 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-zinc-800 transition-all border border-transparent hover:border-zinc-700">تخصيص الربط</button>
                              <button onClick={() => handleOpenModal(int)} className="p-3 bg-zinc-900 rounded-xl hover:bg-zinc-800 transition-all border border-transparent hover:border-zinc-700"><Edit3 size={14} className="text-zinc-500" /></button>
                              <button onClick={() => handleDelete(int.id)} className="p-3 bg-zinc-900 rounded-xl hover:bg-rose-500/10 hover:text-rose-500 transition-all text-zinc-600 border border-transparent hover:border-rose-500/20"><Trash2 size={14} /></button>
                           </div>
                        </div>
                      ))}
                   </div>
                </div>

                <div 
                  className="bg-gradient-to-br from-indigo-900/10 to-zinc-950 border border-indigo-500/20 rounded-[48px] p-10 space-y-6 shadow-2xl relative cursor-help"
                  onMouseEnter={() => setActiveTooltip('sync')}
                  onMouseLeave={() => setActiveTooltip(null)}
                >
                   <h3 className="text-lg font-black flex items-center gap-3"><RefreshCw size={20} className="text-indigo-500" /> مصفوفة التزامن (Sync Matrix)</h3>
                   
                   {activeTooltip === 'sync' && (
                      <div className="absolute bottom-full right-10 mb-6 w-80 p-6 bg-zinc-950 border border-indigo-500/30 rounded-[32px] shadow-2xl z-50 animate-fadeIn">
                         <h4 className="text-[11px] font-black text-indigo-400 mb-2 uppercase tracking-tighter">تقنية التزامن الفوري</h4>
                         <p className="text-[10px] font-bold text-zinc-400 leading-relaxed text-right">
                            نظام WebSockets متطور يضمن تحديث واجهة كافة المستخدمين حول العالم في أقل من 150 ملي ثانية بمجرد صدور الإشارة من المصدر.
                         </p>
                      </div>
                   )}

                   <div className="space-y-4">
                      <div className="p-5 bg-zinc-900/50 rounded-3xl border border-zinc-800 flex items-center justify-between hover:bg-zinc-900/80 transition-all">
                         <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-indigo-500/20 rounded-xl flex items-center justify-center text-indigo-500"><Globe2 size={20} /></div>
                            <div className="space-y-1">
                               <p className="text-xs font-black">انتشار التنبيهات العالمي (Global Propagation)</p>
                               <p className="text-[10px] text-zinc-500 font-bold">تحديث كافة واجهات المستخدم في أقل من 150ms</p>
                            </div>
                         </div>
                         <div className="px-4 py-2 bg-emerald-500/10 text-emerald-500 rounded-lg text-[10px] font-black uppercase tracking-widest animate-pulse">نشط</div>
                      </div>
                   </div>
                </div>
             </div>
           )}

           {tabParam === 'templates' && (
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-fadeIn">
                <div onClick={() => setIsTemplateModalOpen(true)} className="aspect-[4/3] bg-zinc-900/30 border border-dashed border-zinc-800 rounded-[48px] flex flex-col items-center justify-center text-zinc-600 hover:text-white hover:border-amber-500/30 transition-all cursor-pointer group shadow-inner">
                   <div className="w-20 h-20 bg-zinc-800 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-amber-500 group-hover:text-black transition-all shadow-2xl">
                      <Plus size={40} />
                   </div>
                   <h4 className="text-lg font-black">قالب إخطار جديد</h4>
                   <p className="text-[10px] text-zinc-500 font-bold mt-2 uppercase">Custom Styles & Dynamic Paths</p>
                </div>
                
                <div className="bg-zinc-900/40 border border-zinc-800 rounded-[48px] p-10 space-y-6 group border-r-8 border-r-blue-600/50 shadow-xl hover:shadow-blue-500/5 transition-all">
                   <div className="flex justify-between items-start">
                      <div className="p-3 bg-zinc-800 rounded-2xl text-zinc-100"><LayoutTemplate size={20} /></div>
                      <div className="px-3 py-1 bg-blue-600 shadow-xl shadow-blue-600/20 rounded-full text-[8px] font-black uppercase tracking-widest">Default Template</div>
                   </div>
                   <div className="space-y-2 pt-2">
                      <h4 className="text-xl font-black">نموذج الإشعار القياسي</h4>
                      <p className="text-xs text-zinc-600 font-medium leading-relaxed">القالب الموحد لجميع إشعارات النظام البرمجية.</p>
                   </div>
                   <button onClick={() => setIsTemplateModalOpen(true)} className="w-full py-4 bg-zinc-800 rounded-2xl text-[10px] font-black uppercase hover:bg-zinc-700 transition-all">تخصيص القالب</button>
                </div>
             </div>
           )}

           {tabParam === 'analytics' && (
             <div className="space-y-8 animate-fadeIn">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                   {[
                     { label: 'إجمالي المشاهدات', value: '842.5K', trend: '+12%', icon: Eye, color: 'text-blue-500' },
                     { label: 'نسبة النقر (CTR)', value: '3.82%', trend: '+0.5%', icon: Target, color: 'text-amber-500' },
                     { label: 'التفاعل الإيجابي', value: '94%', trend: '+2%', icon: Star, color: 'text-emerald-500' }
                   ].map((stat, i) => (
                     <div key={i} className="bg-zinc-900/40 border border-zinc-800 p-8 rounded-[32px] space-y-4">
                        <div className="flex justify-between items-start">
                           <div className={`p-3 rounded-2xl bg-zinc-800 ${stat.color}`}><stat.icon size={20} /></div>
                           <span className="text-[10px] font-black text-emerald-500">{stat.trend}</span>
                        </div>
                        <div>
                           <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">{stat.label}</p>
                           <h4 className="text-2xl font-black mt-1">{stat.value}</h4>
                        </div>
                     </div>
                   ))}
                </div>

                <div className="bg-zinc-900/40 border border-zinc-800 p-10 rounded-[48px] space-y-10 shadow-2xl">
                   <div className="flex items-center justify-between">
                      <div 
                        className="space-y-1 group/h-title relative cursor-help"
                        onMouseEnter={() => setActiveTooltip('heatmap-main')}
                        onMouseLeave={() => setActiveTooltip(null)}
                      >
                         <h3 className="text-lg font-black italic group-hover/h-title:text-rose-500 transition-colors">خريطة التفاعل الحرارية (Engagement Heatmap)</h3>
                         <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">تمركز تفاعل المستخدمين عبر واجهات النظام</p>

                         {activeTooltip === 'heatmap-main' && (
                            <div className="absolute top-full right-0 mt-4 w-80 p-6 bg-zinc-950 border border-rose-500/30 rounded-[32px] shadow-2xl z-50 animate-fadeIn pointer-events-none">
                               <h4 className="text-[11px] font-black text-rose-500 mb-2 uppercase">تحليل النطاق البصري</h4>
                               <p className="text-[10px] font-bold text-zinc-400 leading-relaxed text-right">
                                  تستخدم هذه الخريطة بيانات تتبع النقرات الحية لتحديد "المناطق الساخنة" في الواجهة، مما يساعدك على اختيار أفضل المواقع الجغرافية للإشعارات لضمان أعلى نسبة مشاهدة دون تشتيت.
                               </p>
                               <div className="absolute -top-2 right-10 w-4 h-4 bg-zinc-950 border-l border-t border-rose-500/30 rotate-45"></div>
                            </div>
                         )}
                      </div>
                      <div className="flex items-center gap-2 px-4 py-2 bg-zinc-950 border border-zinc-800 rounded-xl">
                         <div className="w-2 h-2 rounded-full bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.6)]"></div>
                         <span className="text-[9px] font-black text-zinc-400">كثافة عالية</span>
                      </div>
                   </div>

                   <div className="relative aspect-[16/8] bg-zinc-950 rounded-[40px] border border-zinc-800 overflow-hidden group/heatmap">
                      {/* Mock UI Background */}
                      <div className="absolute inset-0 opacity-20 pointer-events-none p-10 flex gap-4">
                         <div className="w-48 h-full bg-zinc-800 rounded-2xl"></div>
                         <div className="flex-1 space-y-4">
                            <div className="h-20 bg-zinc-800 rounded-2xl"></div>
                            <div className="grid grid-cols-3 gap-4 h-64">
                               <div className="bg-zinc-800 rounded-2xl"></div>
                               <div className="bg-zinc-800 rounded-2xl"></div>
                               <div className="bg-zinc-800 rounded-2xl"></div>
                            </div>
                         </div>
                      </div>

                      {/* Heat Spots */}
                      {[
                        { id: 'heat-1', top: '15%', left: '45%', size: 'w-24 h-24', color: 'bg-rose-500', intensity: '88%', label: 'مركز التنبيهات العلوي', desc: 'أعلى منطقة تفاعل عند صدور إشارات التداول الحية.' },
                        { id: 'heat-2', top: '40%', left: '20%', size: 'w-16 h-16', color: 'bg-amber-500', intensity: '64%', label: 'شريط التنقل الجانبي', desc: 'تفاعل متوسط مرتبط بالوصول السريع لقوائم المراقبة.' },
                        { id: 'heat-3', top: '60%', left: '70%', size: 'w-32 h-32', color: 'bg-rose-600', intensity: '94%', label: 'تدفق بيانات السوق', desc: 'المنطقة الأكثر حيوية؛ يتفاعل المستخدمون هنا مع الإشعارات المدمجة بالأسعار.' },
                        { id: 'heat-4', top: '80%', left: '15%', size: 'w-12 h-12', color: 'bg-blue-500', intensity: '32%', label: 'زاوية الدعم الفني', desc: 'تفاعل منخفض، يقتصر على إشعارات الردود الإدارية.' }
                      ].map((spot) => (
                        <div 
                          key={spot.id}
                          className={`absolute ${spot.top} ${spot.left} -translate-x-1/2 -translate-y-1/2 ${spot.size} ${spot.color} rounded-full opacity-40 blur-2xl cursor-help hover:opacity-80 transition-all hover:scale-125 group/spot`}
                          onMouseEnter={() => setActiveTooltip(spot.id)}
                          onMouseLeave={() => setActiveTooltip(null)}
                        >
                           {activeTooltip === spot.id && (
                             <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 w-56 p-5 bg-zinc-950 border border-white/10 rounded-3xl shadow-2xl z-50 animate-scaleIn pointer-events-none">
                                <h4 className="text-[10px] font-black text-white mb-2 uppercase">{spot.label}</h4>
                                <div className="flex items-center justify-between mb-3 pb-2 border-b border-white/5">
                                   <span className="text-[9px] font-bold text-zinc-500">كثافة النقرات</span>
                                   <span className="text-[10px] font-black text-rose-500">{spot.intensity}</span>
                                </div>
                                <p className="text-[9px] font-medium text-zinc-400 leading-relaxed text-right">{spot.desc}</p>
                             </div>
                           )}
                        </div>
                      ))}

                      {/* Instructions */}
                      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 px-6 py-2 bg-zinc-900/80 backdrop-blur-md rounded-full border border-zinc-800 text-[9px] font-black text-zinc-500 uppercase tracking-widest opacity-0 group-hover/heatmap:opacity-100 transition-opacity">
                         مرر الماوس فوق بؤر الحرارة لرؤية تفاصيل الأداء
                      </div>
                   </div>
                </div>

                <div className="bg-zinc-900/40 border border-zinc-800 p-10 rounded-[48px] space-y-8">
                   <div className="flex items-center justify-between">
                      <div 
                        className="space-y-1 group/engagement-title relative cursor-help"
                        onMouseEnter={() => setActiveTooltip('engagement-chart')}
                        onMouseLeave={() => setActiveTooltip(null)}
                      >
                         <h3 className="text-lg font-black italic group-hover/engagement-title:text-blue-500 transition-colors">وتيرة الإرسال والتفاعل (Send vs Engagement)</h3>
                         <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">مقارنة بين عدد الإشعارات المرسلة ونسبة استجابة الجمهور</p>

                         {activeTooltip === 'engagement-chart' && (
                            <div className="absolute top-full right-0 mt-4 w-80 p-6 bg-zinc-950 border border-blue-500/30 rounded-[32px] shadow-2xl z-50 animate-fadeIn pointer-events-none">
                               <h4 className="text-[11px] font-black text-blue-500 mb-2 uppercase">تحليل الكفاءة (Efficiency Analysis)</h4>
                               <p className="text-[10px] font-bold text-zinc-400 leading-relaxed text-right">
                                  يقيس هذا الرسم البياني الفجوة بين حجم الإرسال وتفاعل المستخدمين الحقيقي. المناطق التي تتقارب فيها الخطوط تشير إلى جودة توقيت وسياق مرتفعتين.
                               </p>
                               <div className="absolute -top-2 right-10 w-4 h-4 bg-zinc-950 border-l border-t border-blue-500/30 rotate-45"></div>
                            </div>
                         )}
                      </div>
                   </div>
                   <div className="h-[300px] w-full">
                      <ReResponsiveContainer width="100%" height="100%">
                         <ReAreaChart data={[
                           { name: 'Sat', sent: 4000, ctr: 2400 },
                           { name: 'Sun', sent: 3000, ctr: 1398 },
                           { name: 'Mon', sent: 2000, ctr: 9800 },
                           { name: 'Tue', sent: 2780, ctr: 3908 },
                           { name: 'Wed', sent: 1890, ctr: 4800 },
                           { name: 'Thu', sent: 2390, ctr: 3800 },
                           { name: 'Fri', sent: 3490, ctr: 4300 },
                         ]}>
                            <defs>
                               <linearGradient id="colorSent" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                               </linearGradient>
                            </defs>
                            <ReCartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
                            <ReXAxis dataKey="name" stroke="#6b7280" fontSize={10} axisLine={false} tickLine={false} />
                            <ReYAxis stroke="#6b7280" fontSize={10} axisLine={false} tickLine={false} />
                            <ReTooltip contentStyle={{ backgroundColor: '#111827', borderColor: '#374151', borderRadius: '12px' }} />
                            <ReArea type="monotone" dataKey="sent" stroke="#3b82f6" fillOpacity={1} fill="url(#colorSent)" strokeWidth={3} />
                            <ReArea type="monotone" dataKey="ctr" stroke="#f59e0b" fillOpacity={0} strokeWidth={2} />
                         </ReAreaChart>
                      </ReResponsiveContainer>
                   </div>
                </div>
             </div>
           )}

           {tabParam === 'audit' && (
             <div className="bg-zinc-900/40 border border-zinc-800 rounded-[48px] overflow-hidden shadow-2xl animate-fadeIn">
                <table className="w-full text-right border-collapse">
                   <thead>
                      <tr className="bg-zinc-800/50 text-zinc-500 text-[10px] font-black uppercase tracking-widest">
                         <th className="p-6">العملية</th>
                         <th className="p-6">الوحدة</th>
                         <th className="p-6">التاريخ</th>
                         <th className="p-6">الحالة</th>
                         <th className="p-6">النتيجة</th>
                      </tr>
                   </thead>
                   <tbody className="text-xs font-bold divide-y divide-zinc-800">
                      {[
                        { op: 'برمجة ربط جديد', mod: 'AI Signals', date: '2024-03-16 10:45', status: 'Success', result: 'int-482' },
                        { op: 'تغيير قالب الإرسال', mod: 'Support', date: '2024-03-16 09:12', status: 'Success', result: 'v2.1' },
                        { op: 'تحسين ذكي للسياق', mod: 'System', date: '2024-03-15 22:30', status: 'Success', result: '+24% Eff' },
                        { op: 'حذف ربط قديم', mod: 'Portfolio', date: '2024-03-15 18:15', status: 'Success', result: 'int-109' }
                      ].map((row, i) => (
                        <tr key={i} className="hover:bg-zinc-800 transition-all cursor-pointer">
                           <td className="p-6 text-zinc-100">{row.op}</td>
                           <td className="p-6 text-blue-500">{row.mod}</td>
                           <td className="p-6 text-zinc-500">{row.date}</td>
                           <td className="p-6"><span className="px-3 py-1 bg-emerald-500/10 text-emerald-500 rounded-lg text-[9px]">Completed</span></td>
                           <td className="p-6 font-black">{row.result}</td>
                        </tr>
                      ))}
                   </tbody>
                </table>
             </div>
           )}
        </div>

        <aside className="lg:col-span-4 space-y-10 animate-fadeIn">
           <div 
              className="bg-zinc-900/50 border border-zinc-800 rounded-[32px] p-8 space-y-8 shadow-2xl relative"
              onMouseEnter={() => setActiveTooltip('channels')}
              onMouseLeave={() => setActiveTooltip(null)}
            >
              <h3 className="text-sm font-black flex items-center gap-3"><Monitor size={16} className="text-amber-500" /> قنوات الظهور الحية</h3>
              
              {activeTooltip === 'channels' && (
                  <div className="absolute top-10 left-full ml-6 w-64 p-6 bg-zinc-950 border border-amber-500/30 rounded-[32px] shadow-2xl z-50 animate-fadeIn">
                     <p className="text-[10px] font-bold text-zinc-400 leading-relaxed text-right">
                        تتبع الموضع الجغرافي والبرمجي لكل إشعار نشط حالياً على شاشات المستخدمين.
                     </p>
                     <div className="absolute top-1/2 -left-2 -translate-y-1/2 w-4 h-4 bg-zinc-950 border-l border-b border-amber-500/30 rotate-45"></div>
                  </div>
              )}

              <div className="space-y-4">
                 {[
                   { label: 'Global Header', count: 1, active: true, desc: 'تنبيهات ثابتة تظهر في أعلى واجهة النظام لجميع المستخدمين.' },
                   { label: 'Dashboard Top', count: 3, active: true, desc: 'رسائل مخصصة تظهر في الجزء العلوي من لوحة التحكم الشخصية.' },
                   { label: 'Market Feed', count: 8, active: false, desc: 'إشعارات لحظية مدمجة ضمن تدفق بيانات السوق والأسعار.' },
                   { label: 'Floating Toast', count: 2, active: true, desc: 'رسائل منبثقة ذكية تظهر في الزوايا لتنبيهات العمليات السريعة.' }
                 ].map((p, i) => (
                   <div 
                     key={i} 
                     className="flex items-center justify-between p-5 bg-zinc-950 rounded-2xl border border-zinc-800/50 group hover:border-amber-500/20 transition-all shadow-sm relative cursor-help"
                     onMouseEnter={() => setActiveTooltip(`channel-${i}`)}
                     onMouseLeave={() => setActiveTooltip(null)}
                   >
                      <div className="flex items-center gap-3">
                         <div className={`w-2 h-2 rounded-full ${p.active ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-zinc-800'}`}></div>
                         <span className="text-[10px] font-black tracking-tight">{p.label}</span>
                      </div>
                      <span className="text-[9px] font-black opacity-30 group-hover:opacity-100 transition-opacity">{p.count} Active</span>

                      {activeTooltip === `channel-${i}` && (
                        <div className="absolute left-full ml-4 bottom-0 w-56 p-4 bg-zinc-950 border border-amber-500/20 rounded-2xl shadow-2xl z-50 animate-fadeIn backdrop-blur-xl">
                           <p className="text-[9px] font-bold text-zinc-400 leading-relaxed text-right">{p.desc}</p>
                           <div className="absolute top-1/2 -left-2 -translate-y-1/2 w-3 h-3 bg-zinc-950 border-l border-b border-amber-500/20 rotate-45"></div>
                        </div>
                      )}
                   </div>
                 ))}
              </div>
           </div>

           <div className="bg-gradient-to-br from-blue-900/20 to-zinc-950 border border-blue-500/20 rounded-[44px] p-10 space-y-6 relative group shadow-2xl">
              <h3 className="text-xl font-black italic flex items-center gap-3 text-blue-400"><Sparkles size={20} /> تحسين السياق</h3>
              <p className="text-[11px] font-bold text-zinc-400 leading-relaxed uppercase tracking-widest leading-loose">
                 نظام الترابط السياقي نشط. يتم توجيه المستخدم برمجياً لأكثر محتوى صلة داخل النظام.
              </p>
              <div className="pt-4 space-y-4 relative">
                  <div className={`w-full h-1 bg-zinc-800 rounded-full overflow-hidden transition-all duration-500 ${isOptimizing ? 'opacity-100' : 'opacity-0'}`}>
                     <div className="h-full bg-blue-500 transition-all duration-300" style={{ width: `${optimizationProgress}%` }}></div>
                  </div>
                  
                  {showOptimizeTooltip && (
                    <div className="absolute bottom-full left-0 right-0 mb-6 p-6 bg-zinc-950 border border-blue-500/30 rounded-[32px] shadow-2xl animate-fadeIn z-50">
                       <div className="space-y-4 text-right">
                          <h4 className="text-[11px] font-black text-blue-400 uppercase tracking-widest flex items-center justify-end gap-2">
                             كيف يعمل المحرك الذكي؟ <Zap size={14} />
                          </h4>
                          <div className="space-y-3">
                             <div className="text-[10px] leading-relaxed">
                                <span className="text-zinc-100 font-bold ml-1">• توجيه سياقي:</span> 
                                ربط التنبيه بأدق محتوى صلة داخل النظام بدلاً من الصفحات العامة.
                             </div>
                             <div className="text-[10px] leading-relaxed">
                                <span className="text-zinc-100 font-bold ml-1">• منع الإجهاد:</span> 
                                تقليل التكرار المزعج وترتيب الإشعارات حسب الأهمية القصوى.
                             </div>
                             <div className="text-[10px] leading-relaxed">
                                <span className="text-zinc-100 font-bold ml-1">• تحسين المواقع:</span> 
                                اختيار أفضل زاوية للظهور لا تحجب أدوات العمل الحيوية.
                             </div>
                          </div>
                       </div>
                       <div className="absolute top-full left-1/2 -translate-x-1/2 w-4 h-4 bg-zinc-950 border-r border-b border-blue-500/30 rotate-45 -mt-2"></div>
                    </div>
                  )}

                  <button 
                    disabled={isOptimizing}
                    onClick={handleOptimize}
                    onMouseEnter={() => setShowOptimizeTooltip(true)}
                    onMouseLeave={() => setShowOptimizeTooltip(false)}
                    className={`w-full py-4 ${isOptimizing ? 'bg-zinc-800 text-zinc-600 grayscale cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-500 shadow-xl shadow-blue-500/20'} rounded-2xl text-[10px] font-black uppercase transition-all flex items-center justify-center gap-3 relative overflow-hidden`}
                  >
                    {isOptimizing ? <RefreshCw size={14} className="animate-spin" /> : <TrendingUp size={14} />}
                    {isOptimizing ? `Optimizing... ${optimizationProgress}%` : 'Optimize Intelligence'}
                  </button>
               </div>
           </div>

           <div 
              className={`p-10 ${isHighVolatilityMode ? 'bg-rose-950/20 border-rose-500/30' : 'bg-zinc-950 border-zinc-800'} border rounded-[48px] space-y-8 shadow-2xl transition-all duration-700 relative group/volatility cursor-help`}
              onMouseEnter={() => setActiveTooltip('volatility')}
              onMouseLeave={() => setActiveTooltip(null)}
            >
              <div className="flex items-center justify-between">
                 <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-xl ${isHighVolatilityMode ? 'bg-rose-500 text-black animate-pulse' : 'bg-zinc-900 text-zinc-500'}`}>
                       <AlertTriangle size={18} />
                    </div>
                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em]">وضع التقلب العالي</h3>
                 </div>
                 <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsHighVolatilityMode(!isHighVolatilityMode);
                    showToast(isHighVolatilityMode ? 'تم تفعيل كافة الإشعارات' : 'تم تفعيل وضع التركيز؛ تم إيقاف الإعلانات', isHighVolatilityMode ? 'info' : 'warning');
                  }}
                  className={`w-14 h-7 rounded-full relative transition-all duration-500 ${isHighVolatilityMode ? 'bg-rose-500' : 'bg-zinc-800'} z-20`}
                 >
                    <div className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-all duration-500 ${isHighVolatilityMode ? 'left-8 shadow-lg' : 'left-1'}`}></div>
                 </button>
              </div>

              <div className="space-y-4">
                 <p className="text-[10px] text-zinc-500 font-bold leading-relaxed">
                    {isHighVolatilityMode 
                      ? "وضع التركيز نشط حالياً؛ يتم حجب كافة المشتتات." 
                      : "فلترة ذكية للإشعارات أثناء حركة السوق السريعة."}
                 </p>
                 <div className={`w-full py-4 border border-dashed rounded-2xl flex items-center justify-center gap-2 ${isHighVolatilityMode ? 'border-rose-500/40 text-rose-500' : 'border-zinc-800 text-zinc-700'}`}>
                    <ShieldCheck size={14} />
                    <span className="text-[9px] font-black uppercase">Volatility Guard Active</span>
                 </div>
              </div>

              {/* Redesigned Side Tooltip */}
              {activeTooltip === 'volatility' && (
                  <div className="absolute top-0 left-full ml-6 w-64 p-6 bg-zinc-950 border border-rose-500/30 rounded-[32px] shadow-2xl z-50 animate-fadeIn pointer-events-none">
                     <h4 className="text-[11px] font-black text-rose-500 mb-2 uppercase">حماية التركيز</h4>
                     <p className="text-[10px] font-bold text-zinc-400 leading-relaxed text-right">
                        يقوم المحرك بحجب الإشعارات غير الضرورية تلقائياً ليمنحك صفاءً ذهنياً كاملاً أثناء تقلبات الأسعار المفاجئة.
                     </p>
                     <div className="absolute top-1/2 -left-2 -translate-y-1/2 w-4 h-4 bg-zinc-950 border-l border-b border-rose-500/30 rotate-45"></div>
                  </div>
              )}
           </div>

           <div 
              className="p-10 bg-zinc-950 border border-zinc-800 rounded-[48px] space-y-6 shadow-xl relative cursor-help group/ai"
              onMouseEnter={() => setActiveTooltip('ai')}
              onMouseLeave={() => setActiveTooltip(null)}
            >
              <div className="flex items-center gap-3 text-emerald-500">
                 <div className="w-8 h-8 bg-emerald-500/10 rounded-lg flex items-center justify-center">
                    <Activity size={18} />
                 </div>
                 <h3 className="text-[10px] font-black uppercase tracking-[0.3em]">AI Engine Status</h3>
              </div>
              <p className="text-[10px] text-zinc-500 font-medium leading-relaxed">المحرك يحلل المسارات تلقائياً لتفادي إزعاج المستخدم وتحسين تجربة التداول.</p>

              {/* Redesigned Side Tooltip for AI Engine */}
              {activeTooltip === 'ai' && (
                  <div className="absolute top-0 left-full ml-6 w-64 p-6 bg-zinc-950 border border-emerald-500/30 rounded-[32px] shadow-2xl z-50 animate-fadeIn pointer-events-none">
                     <div className="flex items-center gap-2 mb-3">
                        <Cpu size={16} className="text-emerald-500" />
                        <h4 className="text-[11px] font-black text-emerald-500 uppercase">التحليل السلوكي</h4>
                     </div>
                     <p className="text-[10px] font-bold text-zinc-400 leading-relaxed text-right">
                        يراقب سرعة التمرير وحركة الماوس لضمان بقاء الواجهة هادئة أثناء لحظات التركيز العالي في السوق.
                     </p>
                     <div className="absolute top-1/2 -left-2 -translate-y-1/2 w-4 h-4 bg-zinc-950 border-l border-b border-emerald-500/30 rotate-45"></div>
                  </div>
              )}
           </div>
        </aside>
      </main>

      {/* --- MASTER INTEGRATION MODAL --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-6 lg:p-12">
           <div className="absolute inset-0 bg-[#070708]/90 backdrop-blur-xl animate-fadeIn" onClick={() => setIsModalOpen(false)}></div>
           <div className="relative w-full max-w-2xl bg-[#0c0c0e] rounded-[48px] border border-white/5 shadow-2xl overflow-hidden flex flex-col animate-scaleIn shadow-[0_0_100px_rgba(0,0,0,0.5)]">
              
              <header className="p-8 bg-zinc-950/30 flex items-center justify-between border-b border-white/5">
                 <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-500">
                       <Plus size={20} />
                    </div>
                    <div>
                       <h2 className="text-lg font-black italic ltr">{editingId ? 'Edit Mapping Logic' : 'Integrate New Unit'}</h2>
                       <p className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest mt-1">Logic Binding Configuration</p>
                    </div>
                 </div>
                 <button onClick={() => setIsModalOpen(false)} className="w-10 h-10 bg-zinc-900 rounded-xl flex items-center justify-center text-zinc-500 hover:text-white transition-all"><X size={20} /></button>
              </header>

              <div className="flex-1 overflow-y-auto p-10 space-y-10 custom-scrollbar">
                 <div className="space-y-8 text-right">
                    
                    {/* Event Binding Section */}
                    <div className="space-y-4">
                       <div className="flex items-center justify-between">
                          <span className="text-[9px] font-black text-rose-500 uppercase px-2 py-0.5 bg-rose-500/10 rounded-md">Required</span>
                          <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">اسم الحدث المحفز (Trigger Event)</label>
                       </div>
                       <div className="relative group">
                          <input 
                            value={formData.triggerEvent} 
                            onChange={e => setFormData({...formData, triggerEvent: e.target.value})} 
                            type="text" 
                            placeholder="مثال: High Volatility Signal" 
                            className="w-full bg-zinc-950 border border-zinc-800/50 rounded-2xl p-5 text-sm font-bold outline-none focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/5 transition-all text-right group-hover:border-zinc-700 placeholder:text-zinc-700"
                          />
                          <Activity size={16} className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-700 group-focus-within:text-blue-500 transition-colors" />
                       </div>
                    </div>

                    {/* Placement Selection */}
                    <div className="space-y-4">
                       <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">موقع الظهور المستهدف (Destination)</label>
                       <div className="grid grid-cols-2 gap-4">
                          {[
                            { id: 'global_header', label: 'Header', icon: <Monitor size={14} />, desc: 'أعلى النظام' },
                            { id: 'sidebar_top', label: 'Sidebar', icon: <ListFilter size={14} />, desc: 'القائمة الجانبية' },
                            { id: 'dashboard_hero', label: 'Dashboard', icon: <Layout size={14} />, desc: 'لوحة التحكم' },
                            { id: 'floating_toast', label: 'Toast', icon: <Bell size={14} />, desc: 'تنبيه عائم' }
                          ].map(pos => (
                            <button 
                              key={pos.id} 
                              onClick={() => setFormData({...formData, placement: pos.id as any})} 
                              className={`p-4 rounded-2xl border flex flex-col items-center gap-2 transition-all duration-300 relative group ${formData.placement === pos.id ? 'bg-blue-600 border-blue-500 text-white shadow-xl shadow-blue-500/20' : 'bg-zinc-950 border-zinc-800 text-zinc-500 hover:border-zinc-700'}`}
                            >
                               <div className={`${formData.placement === pos.id ? 'text-white' : 'text-zinc-400 group-hover:text-blue-400'} transition-colors`}>{pos.icon}</div>
                               <span className="text-[10px] font-black uppercase">{pos.label}</span>
                               <span className="text-[8px] font-bold opacity-40">{pos.desc}</span>
                               {formData.placement === pos.id && <div className="absolute top-2 right-2 w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>}
                            </button>
                          ))}
                       </div>
                    </div>

                    {/* Priority Override */}
                    <div className="space-y-4 pt-4">
                       <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">أولوية المعالجة (Override Priority)</label>
                       <div className="flex gap-4">
                          {['low', 'medium', 'high', 'critical'].map(p => (
                            <button 
                              key={p}
                              onClick={() => setFormData({...formData, priority: p as any})}
                              className={`flex-1 py-3 rounded-xl text-[9px] font-black uppercase tracking-tighter border transition-all ${formData.priority === p ? 'bg-zinc-100 border-white text-black shadow-lg' : 'bg-zinc-900 border-zinc-800 text-zinc-600 hover:bg-zinc-800'}`}
                            >
                               {p}
                            </button>
                          ))}
                       </div>
                    </div>

                    <div className="bg-blue-500/5 border border-blue-500/10 rounded-3xl p-6 flex items-center justify-between">
                       <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center text-blue-400 shadow-inner">
                             <Sparkles size={16} />
                          </div>
                          <div className="text-right">
                             <h4 className="text-[10px] font-black text-blue-400">نظام الترابط الذكي فعال</h4>
                             <p className="text-[8px] font-bold text-zinc-500">سيتم ربط المنطق تلقائياً بكافة وحدات النظام.</p>
                          </div>
                       </div>
                       <Zap size={14} className="text-blue-500/20 animate-pulse" />
                    </div>
                 </div>
              </div>

              <footer className="p-8 bg-zinc-950/50 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
                 <p className="text-[9px] font-bold text-zinc-600 text-center md:text-right">الرجاء التأكد من صحة اسم الحدث برمجياً قبل الحفظ.</p>
                 <div className="flex gap-4 w-full md:w-auto">
                    <button onClick={() => setIsModalOpen(false)} className="flex-1 md:flex-none px-8 py-4 bg-zinc-900 text-zinc-500 rounded-2xl text-[10px] font-black uppercase hover:bg-zinc-800 transition-all border border-transparent hover:border-zinc-800">إلغاء</button>
                    <button onClick={handleSave} className="flex-1 md:flex-none px-10 py-4 bg-white text-black rounded-2xl text-[10px] font-black uppercase shadow-2xl hover:scale-105 transition-all">حفظ وتفعيل المنطق</button>
                 </div>
              </footer>
           </div>
        </div>
      )}

      {/* --- CAMPAIGN MODAL --- */}
      {isCampaignModalOpen && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4">
           <div className="absolute inset-0 bg-black/95 backdrop-blur-3xl animate-fadeIn" onClick={() => setIsCampaignModalOpen(false)}></div>
           <div className="relative w-full max-w-4xl bg-[#0c0c0e] rounded-[48px] border border-white/5 shadow-2xl p-12 space-y-10 animate-scaleIn">
              <div className="flex justify-between items-center">
                 <h2 className="text-2xl font-black italic">إطلاق حملة ذكية (Hyper-Targeted)</h2>
                 <button onClick={() => setIsCampaignModalOpen(false)} className="p-3 bg-zinc-900 border border-zinc-800 rounded-2xl text-zinc-500 hover:text-white transition-all"><X size={24} /></button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10 text-right">
                 <div className="space-y-6">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">عنوان الحملة (Internal)</label>
                       <input type="text" placeholder="نشرة التكنولوجيا الأسبوعية" className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl p-5 text-xs font-bold outline-none border-transparent focus:border-amber-500/50 text-right" />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">الجمهور المستهدف (Audience)</label>
                       <select className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl p-5 text-xs font-black outline-none text-right">
                          <option>كافة المستخدمين النشطين</option>
                          <option>كبار المستثمرين (Premium)</option>
                          <option>المستخدمين الجدد (أول 30 يوم)</option>
                          <option>المتداولين الخامدين (30+ يوم)</option>
                       </select>
                    </div>
                 </div>
                 <div className="space-y-6">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">قنوات التوزيع (Channels)</label>
                       <div className="flex gap-2">
                          {[Bell, Mail, MessageSquare, Smartphone].map((Icon, i) => (
                             <button key={i} className="flex-1 p-5 bg-zinc-900 border border-zinc-800 rounded-2xl flex items-center justify-center hover:bg-zinc-800 hover:border-amber-500/30 transition-all"><Icon size={20} /></button>
                          ))}
                       </div>
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">الجدولة الزمنية (Schedule)</label>
                       <button className="w-full bg-zinc-800 border-2 border-amber-500/20 p-5 rounded-2xl text-xs font-black text-amber-500 flex items-center justify-center gap-3">
                          <Clock size={18} /> إرسال فوري الآن
                       </button>
                    </div>
                 </div>
              </div>
              <div className="pt-8 border-t border-zinc-800 flex justify-end gap-4">
                 <button onClick={handleSendCampaign} className="px-14 py-5 bg-white text-black rounded-[32px] text-[11px] font-black uppercase tracking-widest shadow-2xl hover:bg-zinc-200 transition-all flex items-center gap-3">
                    <Send size={18} /> إطلاق الحملة البرمجية
                 </button>
              </div>
           </div>
        </div>
      )}

      {/* --- TEMPLATE MODAL --- */}
      {isTemplateModalOpen && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4">
           <div className="absolute inset-0 bg-black/95 backdrop-blur-3xl animate-fadeIn" onClick={() => setIsTemplateModalOpen(false)}></div>
           <div className="relative w-full max-w-2xl bg-[#0c0c0e] rounded-[48px] border border-white/5 shadow-2xl p-12 space-y-10 animate-scaleIn text-center">
              <div className="w-20 h-20 bg-blue-600/10 rounded-full flex items-center justify-center text-blue-500 mx-auto"><LayoutTemplate size={40} /></div>
              <div className="space-y-4 text-center">
                 <h2 className="text-2xl font-black italic">محرر القوالب المرئي (Beta)</h2>
                 <p className="text-zinc-500 text-sm font-medium leading-relaxed">أنت الآن تقوم بتخصيص المظهر العام للتنبيهات الصادرة عن النظام.</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                 <button className="p-6 bg-zinc-900 border border-zinc-800 rounded-3xl text-sm font-black hover:border-blue-500 transition-all">تغيير الأيقونات</button>
                 <button className="p-6 bg-zinc-900 border border-zinc-800 rounded-3xl text-sm font-black hover:border-blue-500 transition-all">تغيير الألوان</button>
              </div>
              <div className="pt-8 border-t border-zinc-800 flex justify-center gap-4">
                 <button onClick={() => setIsTemplateModalOpen(false)} className="px-12 py-5 bg-zinc-900 text-zinc-500 rounded-3xl text-[11px] font-black uppercase">إلغاء</button>
                 <button onClick={handleSaveTemplate} className="px-14 py-5 bg-blue-600 text-white rounded-3xl text-[11px] font-black uppercase shadow-2xl">حفظ التغييرات</button>
              </div>
           </div>
        </div>
      )}

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 5px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #27272a; border-radius: 20px; border: 2px solid transparent; background-clip: content-box; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fadeIn { animation: fadeIn 0.6s cubic-bezier(0.22, 1, 0.36, 1) forwards; }
        @keyframes scaleIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
        .animate-scaleIn { animation: scaleIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
      `}</style>
    </div>
  );
};

export default AdminNotificationsPage;
