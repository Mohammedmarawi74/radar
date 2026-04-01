import React, { useState, useEffect } from 'react';
import { 
  User, 
  Mail, 
  MapPin, 
  Phone, 
  Briefcase, 
  Globe, 
  Linkedin, 
  Twitter, 
  Instagram, 
  Settings, 
  ShieldCheck, 
  Bell, 
  Camera, 
  CheckCircle2, 
  AlertCircle, 
  Info, 
  ChevronRight,
  Save,
  Edit3,
  ExternalLink,
  ChevronLeft,
  Sparkles,
  Lock,
  Users,
  Plus,
  MessageSquare,
  LayoutGrid,
  Eye,
  Trash2
} from 'lucide-react';

// --- Types ---
interface UserData {
  fullName: string;
  role: string;
  email: string;
  phone: string;
  location: string;
  bio: string;
  professionalSector: string;
  experienceYears: number;
  skills: string[];
  social: {
    linkedin: string;
    twitter: string;
    instagram: string;
  };
  notifications: boolean;
  twoFactor: boolean;
}

// --- Dummy Data ---
const FOLLOWERS = [
  { id: '1', name: 'أحمد القحطاني', role: 'محلل مالي', avatar: 'https://i.pravatar.cc/150?u=1', online: true },
  { id: '2', name: 'سارة محمد', role: 'خبيرة استثمار', avatar: 'https://i.pravatar.cc/150?u=2', online: false },
  { id: '3', name: 'خالد ممدوح', role: 'اقتصادي', avatar: 'https://i.pravatar.cc/150?u=3', online: true },
  { id: '4', name: 'ليلى العتيبي', role: 'مديرة محافظ', avatar: 'https://i.pravatar.cc/150?u=4', online: true },
  { id: '5', name: 'عمر ياسين', role: 'مستشار قانوني', avatar: 'https://i.pravatar.cc/150?u=5', online: false },
  { id: '6', name: 'منى ابراهيم', role: 'محللة بيانات', avatar: 'https://i.pravatar.cc/150?u=6', online: true },
];

const MY_POSTS = [
  { id: '1', title: 'تحليل استباقي لحركة البيتكوين وتوقعات الربع القادم لعام 2024', category: 'تحليلات', date: 'منذ يومين', reads: '2.5k', image: 'https://images.unsplash.com/photo-1621761191319-c6fb62004040?auto=format&fit=crop&q=80&w=800' },
  { id: '2', title: 'دليل شامل لاحتراف التداول في الأسهم السعودية: رؤية الراجحي للنمو', category: 'تعليمي', date: 'منذ أسبوع', reads: '4.8k', image: 'https://images.unsplash.com/photo-1633151241910-188b20199708?auto=format&fit=crop&q=80&w=800' },
  { id: '3', title: 'آخر مستجدات الفيدرالي الأمريكي وتأثيرها المباشر على قيمة الصكوك', category: 'أخبار', date: 'منذ 10 أيام', reads: '1.3k', image: 'https://images.unsplash.com/photo-1579532562116-3343360ecb96?auto=format&fit=crop&q=80&w=800' }
];

const UserProfile = () => {
  const [activeTab, setActiveTab] = useState('personal');
  const [isEditing, setIsEditing] = useState<string | null>(null);
  
  // Field-specific status for inline feedback
  const [fieldStatus, setFieldStatus] = useState<Record<string, { type: 'success' | 'error' | null, message: string }>>({});

  // Handle tab from URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tab = params.get('tab');
    if (tab && ['personal', 'professional', 'social', 'settings', 'followers', 'posts'].includes(tab)) {
      setActiveTab(tab);
    }
  }, []);

  const [showToast, setShowToast] = useState<{show: boolean, message: string, type: 'success' | 'error'}>({
    show: false,
    message: '',
    type: 'success'
  });

  const [formData, setFormData] = useState<UserData>({
    fullName: 'محمد مرعاوي',
    role: 'كبير محللين ماليين',
    email: 'mohammed@radar-investor.com',
    phone: '0501234567',
    location: 'الرياض، المملكة العربية السعودية',
    bio: 'خبير في تحليل الأسواق المالية والعملات الرقمية، أمتلك خبرة واسعة في بناء النماذج المالية المتقدمة وتقديم الاستشارات الاستراتيجية.',
    professionalSector: 'الاستثمار والمالية',
    experienceYears: 12,
    skills: ['التحليل الفني', 'إدارة المخاطر', 'العملات الرقمية', 'النماذج الاقتصادية'],
    social: {
      linkedin: 'linkedin.com/in/mohammed',
      twitter: 'twitter.com/mohammed_radar',
      instagram: 'instagram.com/marawi_74'
    },
    notifications: true,
    twoFactor: true
  });

  // Handle Toast
  useEffect(() => {
    if (showToast.show) {
      const timer = setTimeout(() => setShowToast({ ...showToast, show: false }), 3000);
      return () => clearTimeout(timer);
    }
  }, [showToast.show]);

  const validateField = (name: string, value: string) => {
    let status: 'success' | 'error' | null = null;
    let message = '';

    if (name === 'fullName') {
      const hasSpecialChars = /[!@#$%^&*(),.?":{}|<>]/.test(value);
      if (!value.trim()) {
        status = 'error';
        message = 'اسم المستخدم لا يمكن أن يكون فارغاً';
      } else if (hasSpecialChars) {
        status = 'error';
        message = 'الاسم لا يجب أن يحتوي على رموز خاصة';
      } else {
        status = 'success';
        message = 'الاسم المختار صالح';
      }
    }

    if (name === 'phone') {
      const isValid = /^0\d{9}$/.test(value);
      if (!isValid) {
        status = 'error';
        message = 'يجب أن يتكون من 10 أرقام ويبدأ بـ 0';
      } else {
        status = 'success';
        message = 'رقم الهاتف صالح';
      }
    }

    if (name === 'email') {
      const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
      if (!isValid) {
        status = 'error';
        message = 'البريد الإلكتروني غير صالح، يرجى المحاولة مرة أخرى.';
      } else {
        status = 'success';
        message = 'البريد الإلكتروني صالح';
      }
    }

    setFieldStatus(prev => ({ ...prev, [name]: { type: status, message } }));
    return status === 'success';
  };

  const handleSave = (section: string) => {
    if (section === 'personal') {
      const isNameValid = validateField('fullName', formData.fullName);
      const isPhoneValid = validateField('phone', formData.phone);
      const isEmailValid = validateField('email', formData.email);

      if (!isNameValid || !isPhoneValid || !isEmailValid) {
        setShowToast({ show: true, message: 'يرجى تصحيح الأخطاء في الحقول', type: 'error' });
        return;
      }
    }

    setShowToast({ show: true, message: 'تم حفظ التغييرات بنجاح!', type: 'success' });
    setIsEditing(null);
    // Keep the success messages under fields for a bit
    setTimeout(() => setFieldStatus({}), 3000);
  };

  const notify = (msg: string, type: 'success' | 'error' = 'success') => {
    setShowToast({ show: true, message: msg, type });
  };

  // --- Components ---
  const SidebarItem = ({ id, icon: Icon, label, badge }: { id: string, icon: any, label: string, badge?: string }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 group ${
        activeTab === id 
        ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' 
        : 'hover:bg-blue-50 text-slate-500 hover:text-blue-600'
      }`}
    >
      <Icon size={20} className={activeTab === id ? 'animate-pulse' : 'group-hover:scale-110 transition-transform'} />
      <span className="font-bold text-sm tracking-tight flex-1 text-right">{label}</span>
      {badge && (
        <span className={`text-[10px] font-black px-2 py-0.5 rounded-lg ${activeTab === id ? 'bg-white/20 text-white' : 'bg-blue-50 text-blue-600'}`}>
            {badge}
        </span>
      )}
      {activeTab === id && <ChevronLeft size={16} className="mr-auto" />}
    </button>
  );

  const FormLabel = ({ children, tooltip }: { children: React.ReactNode, tooltip?: string }) => (
    <div className="flex items-center gap-2 mb-2">
      <label className="text-xs font-black text-slate-800 uppercase tracking-wider">{children}</label>
      {tooltip && (
        <div className="group relative">
          <Info size={14} className="text-slate-300 cursor-help" />
          <div className="absolute bottom-full right-0 mb-2 w-48 p-2 bg-slate-800 text-white text-[10px] rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 leading-relaxed font-bold">
            {tooltip}
          </div>
        </div>
      )}
    </div>
  );

  const InlineStatus = ({ name }: { name: string }) => {
    const status = fieldStatus[name];
    if (!status || !status.type) return null;
    return (
      <div className={`text-[10px] font-bold mt-2 flex items-center gap-1 animate-fadeIn ${status.type === 'success' ? 'text-emerald-500' : 'text-red-500'}`}>
        {status.type === 'success' ? <CheckCircle2 size={12} /> : <AlertCircle size={12} />}
        {status.message}
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto p-4 lg:p-10 min-h-screen bg-slate-50/30" dir="rtl">
      
      {/* Dynamic Success/Error Toast */}
      {showToast.show && (
        <div className={`fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl border transition-all animate-bounceIn ${
          showToast.type === 'success' ? 'bg-emerald-50 border-emerald-100 text-emerald-700' : 'bg-red-50 border-red-100 text-red-700'
        }`}>
          {showToast.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
          <span className="font-black text-sm">{showToast.message}</span>
        </div>
      )}

      {/* Main Header Card */}
      <div className="bg-white rounded-[40px] shadow-2xl shadow-blue-900/5 border border-slate-100 p-8 mb-10 overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-500"></div>
        <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
          {/* Avatar Section */}
          <div className="relative group">
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-[35px] border-4 border-white shadow-2xl overflow-hidden bg-slate-100 transition-transform duration-500 group-hover:scale-[1.02]">
              <img 
                src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80" 
                alt="Profile" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center cursor-pointer">
                <Camera size={32} className="text-white mb-2" />
                <span className="text-[10px] text-white font-bold">تغيير الصورة</span>
              </div>
            </div>
            {/* Online Status */}
            <div className="absolute -bottom-2 -left-2 w-10 h-10 bg-emerald-500 border-4 border-white rounded-2xl flex items-center justify-center shadow-lg">
                <div className="w-3 h-3 bg-white rounded-full animate-ping"></div>
            </div>
          </div>

          <div className="text-center md:text-right flex-1">
            <div className="flex flex-col md:flex-row md:items-center gap-3 mb-3">
                <h1 className="text-3xl font-black text-slate-900">{formData.fullName}</h1>
                <div className="flex items-center gap-2 bg-blue-50 text-blue-600 px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-widest border border-blue-100 w-fit mx-auto md:mx-0">
                    <Sparkles size={14} />
                    {formData.role}
                </div>
            </div>
            <div className="flex flex-wrap justify-center md:justify-start gap-5 text-slate-500 font-bold text-sm">
                <div className="flex items-center gap-2">
                    <MapPin size={16} className="text-blue-500" />
                    {formData.location}
                </div>
                <div className="flex items-center gap-2">
                    <Mail size={16} className="text-blue-500" />
                    {formData.email}
                </div>
                <div className="flex items-center gap-2">
                    <Phone size={16} className="text-blue-500" />
                    {formData.phone}
                </div>
            </div>
          </div>

          <div className="flex gap-3">
             <button 
                onClick={() => notify("تم نسخ رابط الملف الشخصي")}
                className="p-4 rounded-2xl bg-slate-50 text-slate-400 hover:bg-blue-600 hover:text-white transition-all duration-300"
             >
                <Globe size={20} />
             </button>
             <button 
                className="px-8 py-4 rounded-2xl bg-slate-800 text-white font-black text-sm hover:bg-slate-900 transition-all shadow-xl shadow-slate-900/10 flex items-center gap-3"
             >
                تحميل السيرة الذاتية
                <ChevronLeft size={18} />
             </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Sidebar Navigation */}
        <div className="lg:col-span-3 space-y-3">
           <SidebarItem id="personal" icon={User} label="البيانات الشخصية" />
           <SidebarItem id="professional" icon={Briefcase} label="السجل المهني" />
           <SidebarItem id="posts" icon={LayoutGrid} label="منشوراتي" badge="12" />
           <SidebarItem id="followers" icon={Users} label="المتابعون" badge="3.5k" />
           <SidebarItem id="social" icon={Linkedin} label="التواصل الاجتماعي" />
           <SidebarItem id="settings" icon={Settings} label="إعدادات الحساب" />
           
           <div className="mt-8 p-6 bg-gradient-to-br from-indigo-900 to-blue-900 rounded-[30px] text-white relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
                <h4 className="font-black text-sm mb-2 relative z-10">مركز المساعدة</h4>
                <p className="text-[10px] text-blue-100/60 leading-relaxed mb-4 relative z-10">هل تواجه مشكلة في تعديل بياناتك؟ تواصل مع الدعم الفني مباشرة.</p>
                <button className="w-full py-3 bg-white/10 hover:bg-white/20 rounded-xl text-[10px] font-black uppercase tracking-widest backdrop-blur-md border border-white/10 transition-all relative z-10">اتصل بنا الآن</button>
           </div>
        </div>

        {/* Content Area */}
        <div className="lg:col-span-9">
            <div className="bg-white rounded-[40px] shadow-2xl shadow-blue-900/5 border border-slate-100 p-8 md:p-10 min-h-[500px] transition-all duration-500">
                
                {/* --- Personal Section --- */}
                {activeTab === 'personal' && (
                    <div className="animate-fadeIn">
                        <div className="flex items-center justify-between mb-10 pb-6 border-b border-slate-50">
                            <div>
                                <h2 className="text-xl font-black text-slate-900">البيانات الشخصية</h2>
                                <p className="text-xs text-slate-400 font-bold mt-1">إدارة معلوماتك الأساسية وسيرتك الذاتية</p>
                            </div>
                            <button 
                                onClick={() => setIsEditing(isEditing === 'personal' ? null : 'personal')}
                                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-black text-xs transition-all ${
                                    isEditing === 'personal' 
                                    ? 'bg-red-50 text-red-600 hover:bg-red-100' 
                                    : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
                                }`}
                            >
                                {isEditing === 'personal' ? 'إلغاء التعديل' : 'تعديل البيانات'}
                                <Edit3 size={16} />
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                            <div>
                                <FormLabel tooltip="الاسم الكامل كما يظهر في المنصة">الاسم الكامل</FormLabel>
                                <input 
                                    type="text" 
                                    disabled={isEditing !== 'personal'}
                                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-sm font-bold text-slate-700 focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all disabled:opacity-60"
                                    value={formData.fullName}
                                    onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                                    onBlur={(e) => validateField('fullName', e.target.value)}
                                />
                                <InlineStatus name="fullName" />
                            </div>
                            <div>
                                <FormLabel tooltip="المسمى الوظيفي الحالي">المجال المهني</FormLabel>
                                <input 
                                    type="text" 
                                    disabled={isEditing !== 'personal'}
                                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-sm font-bold text-slate-700 focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all disabled:opacity-60"
                                    value={formData.role}
                                    onChange={(e) => setFormData({...formData, role: e.target.value})}
                                />
                            </div>
                            <div>
                                <FormLabel tooltip="يجب أن يكون بريداً إلكترونياً صالحاً لتلقي الإشعارات">البريد الإلكتروني</FormLabel>
                                <div className="relative">
                                    <input 
                                        type="email" 
                                        disabled={isEditing !== 'personal'}
                                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 pr-12 text-sm font-bold text-slate-700 focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all disabled:opacity-60"
                                        value={formData.email}
                                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                                        onBlur={(e) => validateField('email', e.target.value)}
                                    />
                                    <Mail className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                                </div>
                                {isEditing === 'personal' && (
                                    <button className="text-[10px] text-blue-600 hover:underline mt-2 font-bold flex items-center gap-1">
                                        <ExternalLink size={10} />
                                        تحديث البريد الإلكتروني الرسمي
                                    </button>
                                )}
                                <InlineStatus name="email" />
                            </div>
                            <div>
                                <FormLabel tooltip="رقم الهاتف للتواصل الرسمي">رقم الهاتف</FormLabel>
                                <div className="relative">
                                    <input 
                                        type="text" 
                                        disabled={isEditing !== 'personal'}
                                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 pr-12 text-sm font-bold text-slate-700 focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all disabled:opacity-60 text-left"
                                        dir="ltr"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                                        onBlur={(e) => validateField('phone', e.target.value)}
                                    />
                                    <Phone className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                                </div>
                                <InlineStatus name="phone" />
                            </div>
                        </div>

                        <div>
                            <FormLabel tooltip="نبذة تعريفية سريعة عنك وعن شغفك المهني">النبذة التعريفية</FormLabel>
                            <textarea 
                                rows={4}
                                disabled={isEditing !== 'personal'}
                                className="w-full bg-slate-50 border border-slate-100 rounded-[24px] px-5 py-5 text-sm font-bold text-slate-700 focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all disabled:opacity-60 leading-relaxed resize-none"
                                value={formData.bio}
                                onChange={(e) => setFormData({...formData, bio: e.target.value})}
                            ></textarea>
                        </div>

                        {isEditing === 'personal' && (
                            <button 
                                onClick={() => handleSave('personal')}
                                className="mt-10 w-full py-5 rounded-[22px] bg-blue-600 text-white font-black text-sm hover:bg-blue-700 shadow-2xl shadow-blue-600/20 active:scale-95 transition-all flex items-center justify-center gap-3 animate-slideUp"
                            >
                                <Save size={20} />
                                حفظ التغييرات الشخصية
                            </button>
                        )}
                    </div>
                )}

                {/* --- Professional Section --- */}
                {activeTab === 'professional' && (
                    <div className="animate-fadeIn">
                        <div className="flex items-center justify-between mb-10 pb-6 border-b border-slate-50">
                            <div>
                                <h2 className="text-xl font-black text-slate-900">السجل المهني</h2>
                                <p className="text-xs text-slate-400 font-bold mt-1">عرض وتعديل خبراتك ومهاراتك التقنية</p>
                            </div>
                            <button 
                                onClick={() => setIsEditing(isEditing === 'professional' ? null : 'professional')}
                                className="flex items-center gap-2 px-6 py-3 bg-blue-50 text-blue-600 rounded-xl font-black text-xs hover:bg-blue-100 transition-all"
                            >
                                {isEditing === 'professional' ? 'إلغاء' : 'تعديل السجل'}
                                <Edit3 size={16} />
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                            <div>
                                <FormLabel>القطاع الحالي</FormLabel>
                                <select 
                                    disabled={isEditing !== 'professional'}
                                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-sm font-bold text-slate-700 focus:bg-white outline-none transition-all appearance-none"
                                    value={formData.professionalSector}
                                    onChange={(e) => setFormData({...formData, professionalSector: e.target.value})}
                                >
                                    <option>الاستثمار والمالية</option>
                                    <option>التكنولوجيا والبرمجة</option>
                                    <option>العقارات</option>
                                    <option>الطاقة والصناعة</option>
                                </select>
                            </div>
                            <div>
                                <FormLabel>سنوات الخبرة</FormLabel>
                                <input 
                                    type="number" 
                                    disabled={isEditing !== 'professional'}
                                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-sm font-bold text-slate-700 focus:bg-white outline-none transition-all"
                                    value={formData.experienceYears}
                                    onChange={(e) => setFormData({...formData, experienceYears: parseInt(e.target.value)})}
                                />
                            </div>
                        </div>

                        <div className="mb-10">
                            <FormLabel>المهارات الأساسية</FormLabel>
                            <div className="flex flex-wrap gap-3 mt-3">
                                {formData.skills.map((skill, i) => (
                                    <div key={i} className="flex items-center gap-2 bg-slate-50 border border-slate-100 px-4 py-2 rounded-xl text-xs font-bold text-slate-600 group hover:border-blue-200 hover:text-blue-600 transition-all">
                                        {skill}
                                        {isEditing === 'professional' && <button className="text-red-400 hover:text-red-600">×</button>}
                                    </div>
                                ))}
                                {isEditing === 'professional' && (
                                    <button className="px-4 py-2 border border-dashed border-slate-200 rounded-xl text-xs font-bold text-slate-400 hover:border-blue-400 hover:text-blue-500 transition-all">
                                        + إضافة مهارة
                                    </button>
                                )}
                            </div>
                        </div>

                        {isEditing === 'professional' && (
                            <button 
                                onClick={() => handleSave('professional')}
                                className="w-full py-5 rounded-[22px] bg-blue-600 text-white font-black text-sm hover:bg-blue-700 shadow-2xl shadow-blue-600/20 active:scale-95 transition-all flex items-center justify-center gap-3"
                            >
                                <Save size={20} />
                                تحديث السجل المهني
                            </button>
                        )}
                    </div>
                )}

                {/* --- My Posts Section --- */}
                {activeTab === 'posts' && (
                    <div className="animate-fadeIn">
                        <div className="flex items-center justify-between mb-10 pb-6 border-b border-slate-50">
                            <div>
                                <h2 className="text-xl font-black text-slate-900">منشوراتي</h2>
                                <p className="text-xs text-slate-400 font-bold mt-1">إدارة وتحليل أداء محتواك المنشور</p>
                            </div>
                            <button className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-black text-xs hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20">
                                <Plus size={16} />
                                نشر موضوع جديد
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {MY_POSTS.map((post) => (
                                <div key={post.id} className="group bg-white border border-slate-100 rounded-[35px] overflow-hidden hover:shadow-[0_20px_50px_rgba(37,99,235,0.08)] transition-all duration-700 cursor-pointer">
                                    <div className="aspect-[16/10] relative overflow-hidden bg-slate-200">
                                        <div className="absolute inset-0 bg-blue-600/5 transition-opacity group-hover:opacity-0 z-10"></div>
                                        <img 
                                            src={post.image} 
                                            alt={post.title} 
                                            className="w-full h-full object-cover transform transition-transform duration-1000 group-hover:scale-110" 
                                            onError={(e) => {
                                                (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800';
                                            }}
                                        />
                                        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-xl px-4 py-2 rounded-2xl text-[10px] font-black text-blue-600 uppercase tracking-widest shadow-xl border border-white/50 z-20">
                                            {post.category}
                                        </div>
                                        <div className="absolute bottom-4 left-4 flex items-center gap-2 z-20">
                                            <div className="bg-slate-900/40 backdrop-blur-md px-3 py-1.5 rounded-xl flex items-center gap-1.5 text-[9px] font-bold text-white border border-white/10">
                                                <Eye size={10} />
                                                {post.reads}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="p-7">
                                        <div className="text-[10px] font-bold text-slate-400 mb-2 uppercase tracking-tight flex items-center gap-2">
                                            <span className="w-1 h-1 bg-blue-500 rounded-full"></span>
                                            {post.date}
                                        </div>
                                        <h3 className="text-base font-black text-slate-900 mb-8 leading-[1.6] group-hover:text-blue-600 transition-colors">
                                            {post.title}
                                        </h3>
                                        <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                                            <div className="flex gap-2">
                                                <button className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all text-[10px] font-black group/btn shadow-sm">
                                                    <Edit3 size={14} className="group-hover/btn:rotate-12" />
                                                    تعديل
                                                </button>
                                                <button className="p-2.5 bg-red-50 text-red-400 rounded-xl hover:bg-red-500 hover:text-white transition-all border border-red-100/50 shadow-sm">
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                            <button className="text-[10px] font-black text-slate-400 hover:text-blue-600 flex items-center gap-1 hover:gap-2 transition-all">
                                                التفاصيل 
                                                <ChevronLeft size={14} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <button className="w-full mt-10 py-5 border-2 border-dashed border-slate-100 rounded-[30px] text-sm font-black text-slate-400 hover:border-blue-200 hover:text-blue-600 hover:bg-blue-50/30 transition-all">
                            تحميل المزيد من المنشورات
                        </button>
                    </div>
                )}

                {/* --- Followers Section --- */}
                {activeTab === 'followers' && (
                    <div className="animate-fadeIn">
                        <div className="flex items-center justify-between mb-10 pb-6 border-b border-slate-50">
                            <div>
                                <h2 className="text-xl font-black text-slate-900">المتابعون</h2>
                                <p className="text-xs text-slate-400 font-bold mt-1">لديك 3,586 متابع نشط على المنصة</p>
                            </div>
                            <div className="flex gap-2">
                                <div className="relative group">
                                     <button className="p-3 bg-slate-50 text-slate-400 rounded-xl hover:bg-blue-600 hover:text-white transition-all">
                                        <Plus size={20} />
                                     </button>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                            {FOLLOWERS.map((follower) => (
                                <div key={follower.id} className="p-5 bg-slate-50 border border-slate-100 rounded-3xl hover:bg-white hover:border-blue-100 hover:shadow-xl hover:shadow-blue-900/5 transition-all group flex items-center gap-4 cursor-pointer">
                                    <div className="relative">
                                        <img src={follower.avatar} alt={follower.name} className="w-14 h-14 rounded-2xl border-2 border-white shadow-sm object-cover" />
                                        {follower.online && <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full"></div>}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="text-sm font-black text-slate-900 truncate group-hover:text-blue-600 transition-colors">{follower.name}</h4>
                                        <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-wider">{follower.role}</p>
                                    </div>
                                    <button className="p-2.5 bg-white text-slate-400 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm">
                                        <MessageSquare size={16} />
                                    </button>
                                </div>
                            ))}
                        </div>

                        <button className="w-full mt-10 py-4 border-2 border-dashed border-slate-100 rounded-3xl text-sm font-black text-slate-400 hover:border-blue-200 hover:text-blue-600 hover:bg-blue-50/30 transition-all">
                            عرض المزيد من المتابعين
                        </button>
                    </div>
                )}

                {/* --- Social Section --- */}
                {activeTab === 'social' && (
                    <div className="animate-fadeIn">
                        <div className="flex items-center justify-between mb-10 pb-6 border-b border-slate-50">
                            <div>
                                <h2 className="text-xl font-black text-slate-900">التواصل الاجتماعي</h2>
                                <p className="text-xs text-slate-400 font-bold mt-1">اربط حساباتك لسهولة الوصول لمنشوراتك</p>
                            </div>
                             <button 
                                onClick={() => setIsEditing(isEditing === 'social' ? null : 'social')}
                                className="flex items-center gap-2 px-6 py-3 bg-blue-50 text-blue-600 rounded-xl font-black text-xs hover:bg-blue-100 transition-all"
                            >
                                {isEditing === 'social' ? 'إلغاء' : 'تعديل الروابط'}
                                <Edit3 size={16} />
                            </button>
                        </div>

                        <div className="space-y-6">
                            <div className="flex items-center gap-6 p-6 bg-slate-50 rounded-3xl border border-slate-100 group hover:bg-white hover:border-blue-200 transition-all">
                                <div className="w-14 h-14 rounded-2xl bg-[#0077b5] flex items-center justify-center text-white shrink-0 group-hover:scale-110 transition-transform shadow-lg shadow-blue-600/10">
                                    <Linkedin size={28} />
                                </div>
                                <div className="flex-1">
                                    <FormLabel>LinkedIn Profile</FormLabel>
                                    <input 
                                        type="text" 
                                        disabled={isEditing !== 'social'}
                                        className="w-full bg-transparent border-none p-0 text-sm font-bold text-slate-700 focus:ring-0 outline-none placeholder:text-slate-300"
                                        placeholder="linkedin.com/in/username"
                                        value={formData.social.linkedin}
                                        onChange={(e) => setFormData({...formData, social: {...formData.social, linkedin: e.target.value}})}
                                    />
                                </div>
                                <ExternalLink size={18} className="text-slate-300 group-hover:text-blue-500 cursor-pointer" />
                            </div>

                            <div className="flex items-center gap-6 p-6 bg-slate-50 rounded-3xl border border-slate-100 group hover:bg-white hover:border-sky-200 transition-all">
                                <div className="w-14 h-14 rounded-2xl bg-[#1da1f2] flex items-center justify-center text-white shrink-0 group-hover:scale-110 transition-transform shadow-lg shadow-sky-600/10">
                                    <Twitter size={28} />
                                </div>
                                <div className="flex-1">
                                    <FormLabel>Twitter (X) Profile</FormLabel>
                                    <input 
                                        type="text" 
                                        disabled={isEditing !== 'social'}
                                        className="w-full bg-transparent border-none p-0 text-sm font-bold text-slate-700 focus:ring-0 outline-none placeholder:text-slate-300"
                                        placeholder="twitter.com/username"
                                        value={formData.social.twitter}
                                        onChange={(e) => setFormData({...formData, social: {...formData.social, twitter: e.target.value}})}
                                    />
                                </div>
                                <ExternalLink size={18} className="text-slate-300 group-hover:text-sky-500 cursor-pointer" />
                            </div>

                            <div className="flex items-center gap-6 p-6 bg-slate-50 rounded-3xl border border-slate-100 group hover:bg-white hover:border-pink-200 transition-all">
                                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-yellow-500 via-red-500 to-purple-500 flex items-center justify-center text-white shrink-0 group-hover:scale-110 transition-transform shadow-lg">
                                    <Instagram size={28} />
                                </div>
                                <div className="flex-1">
                                    <FormLabel>Instagram Account</FormLabel>
                                    <input 
                                        type="text" 
                                        disabled={isEditing !== 'social'}
                                        className="w-full bg-transparent border-none p-0 text-sm font-bold text-slate-700 focus:ring-0 outline-none placeholder:text-slate-300"
                                        placeholder="instagram.com/username"
                                        value={formData.social.instagram}
                                        onChange={(e) => setFormData({...formData, social: {...formData.social, instagram: e.target.value}})}
                                    />
                                </div>
                                <ExternalLink size={18} className="text-slate-300 group-hover:text-pink-500 cursor-pointer" />
                            </div>
                        </div>

                        {isEditing === 'social' && (
                            <button 
                                onClick={() => handleSave('social')}
                                className="mt-10 w-full py-5 rounded-[22px] bg-blue-600 text-white font-black text-sm hover:bg-blue-700 shadow-2xl shadow-blue-600/20 active:scale-95 transition-all flex items-center justify-center gap-3"
                            >
                                <Save size={20} />
                                حفظ روابط التوصل
                            </button>
                        )}
                    </div>
                )}

                {/* --- Settings Section --- */}
                {activeTab === 'settings' && (
                    <div className="animate-fadeIn">
                        <div className="flex items-center justify-between mb-10 pb-6 border-b border-slate-50">
                            <div>
                                <h2 className="text-xl font-black text-slate-900">إعدادات الحساب</h2>
                                <p className="text-xs text-slate-400 font-bold mt-1">تحكم في الأمان والتنبيهات والخصوصية</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-6 bg-slate-50 rounded-[28px] border border-slate-100">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center"><Bell size={22}/></div>
                                    <div>
                                        <h4 className="font-black text-sm text-slate-900">إشعارات البريد</h4>
                                        <p className="text-[10px] text-slate-400 font-bold">استلام تحديثات السوق الأسبوعية</p>
                                    </div>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" checked={formData.notifications} onChange={() => setFormData({...formData, notifications: !formData.notifications})} className="sr-only peer" />
                                    <div className="w-12 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:right-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                                </label>
                            </div>

                            <div className="flex items-center justify-between p-6 bg-slate-50 rounded-[28px] border border-slate-100">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center"><ShieldCheck size={22}/></div>
                                    <div>
                                        <h4 className="font-black text-sm text-slate-900">التحقق بخطوتين (2FA)</h4>
                                        <p className="text-[10px] text-slate-400 font-bold">زيادة أمان حسابك عبر الجوال</p>
                                    </div>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" checked={formData.twoFactor} onChange={() => setFormData({...formData, twoFactor: !formData.twoFactor})} className="sr-only peer" />
                                    <div className="w-12 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:right-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500"></div>
                                </label>
                            </div>

                            <div className="flex items-center justify-between p-6 bg-red-50/30 rounded-[28px] border border-red-100/50 mt-10">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center"><Lock size={22}/></div>
                                    <div>
                                        <h4 className="font-black text-sm text-slate-900">تغيير كلمة المرور</h4>
                                        <p className="text-[10px] text-red-400 font-bold">تحديث مفاتيح الأمان الخاصة بك</p>
                                    </div>
                                </div>
                                <button className="px-6 py-3 bg-white text-red-600 border border-red-100 text-xs font-black rounded-xl hover:bg-red-600 hover:text-white transition-all shadow-sm">تغيير الآن</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
