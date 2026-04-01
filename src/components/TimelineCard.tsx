import React, { useState } from 'react';
import { TimelineEvent, TimelineEventType } from '../types';
import { useToast } from './Toast';
import { 
  Database, 
  RefreshCw, 
  AlertTriangle, 
  TrendingUp, 
  Lightbulb, 
  PieChart, 
  ArrowUpRight, 
  ArrowDownRight,
  Clock,
  CheckCircle2,
  Bookmark,
  Share2,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  LayoutDashboard,
  Zap,
  Flame,
  Bell,
  FileText,
  Info
} from 'lucide-react';

interface TimelineCardProps {
  event: TimelineEvent;
  onClick?: () => void;
}

const TimelineCard: React.FC<TimelineCardProps> = ({ event, onClick }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const { showToast } = useToast();

  const handleFollowTag = (tag: string, e: React.MouseEvent) => {
    e.stopPropagation();
    showToast(`تم تفعيل التنبيهات للوسم #${tag} بنجاح!`, 'success');
  };

  // 1. Icon Mapping
  const getEventIcon = () => {
    switch (event.type) {
      case TimelineEventType.NEW_DATA: return <Database size={18} className="text-blue-600" />;
      case TimelineEventType.UPDATE: return <RefreshCw size={18} className="text-indigo-600" />;
      case TimelineEventType.REVISION: return <AlertTriangle size={18} className="text-amber-600" />;
      case TimelineEventType.SIGNAL: return <TrendingUp size={18} className="text-emerald-600" />;
      case TimelineEventType.INSIGHT: return <Lightbulb size={18} className="text-purple-600" />;
      case TimelineEventType.RADAR: return <PieChart size={18} className="text-slate-600" />;
      default: return <Clock size={18} className="text-gray-500" />;
    }
  };

  const getEventColor = () => {
    switch (event.type) {
      case TimelineEventType.NEW_DATA: return 'border-l-blue-500 bg-blue-50/10';
      case TimelineEventType.UPDATE: return 'border-l-indigo-500 bg-indigo-50/10';
      case TimelineEventType.REVISION: return 'border-l-amber-500 bg-amber-50/10';
      case TimelineEventType.SIGNAL: return 'border-l-emerald-500 bg-emerald-50/10';
      case TimelineEventType.INSIGHT: return 'border-l-purple-500 bg-purple-50/10';
      default: return 'border-l-slate-300';
    }
  };
  const getEventTextColor = () => {
    switch (event.type) {
      case TimelineEventType.NEW_DATA: return 'text-blue-600';
      case TimelineEventType.UPDATE: return 'text-indigo-600';
      case TimelineEventType.REVISION: return 'text-amber-600';
      case TimelineEventType.SIGNAL: return 'text-emerald-600';
      case TimelineEventType.INSIGHT: return 'text-purple-600';
      default: return 'text-slate-500';
    }
  };

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 3600) return `منذ ${Math.floor(diffInSeconds / 60)} دقيقة`;
    if (diffInSeconds < 86400) return `منذ ${Math.floor(diffInSeconds / 3600)} ساعة`;
    return date.toLocaleDateString('ar-SA');
  };

  // Determine Impact Semantic Color
  const getImpactStyles = () => {
    if (event.impactScore > 70) {
      // If combined with delta direction
      if (event.delta && !event.delta.isPositive) {
        return {
          bg: 'bg-red-50',
          text: 'text-red-700',
          border: 'border-red-100',
          icon: <AlertTriangle size={12} className="ml-1" />
        };
      }
      return {
        bg: 'bg-orange-50',
        text: 'text-orange-700',
        border: 'border-orange-200',
        icon: <Zap size={12} className="ml-1" />
      };
    }
    return null;
  };

  const impactStyles = getImpactStyles();


  return (
    <div 
      onClick={onClick}
      className={`group relative flex flex-col p-5 bg-white rounded-3xl border border-slate-100 shadow-sm transition-all cursor-pointer border-l-4 ${getEventColor()} overflow-hidden`}
    >
      {/* Action Buttons Top Left (Refined) */}
      <div className="absolute top-3 left-3 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all transform translate-y-1 group-hover:translate-y-0">
         <button 
           onClick={(e) => { e.stopPropagation(); setIsBookmarked(!isBookmarked); }}
           className={`p-2 rounded-xl border transition-all ${isBookmarked ? 'bg-blue-600 text-white border-blue-500 shadow-lg shadow-blue-500/20' : 'bg-white text-slate-400 hover:text-blue-600 border-slate-100'}`}
         >
           <Bookmark size={14} className={isBookmarked ? 'fill-current' : ''} />
         </button>
      </div>

      {/* Header - Balanced */}
      <div className="flex items-center gap-3 mb-3">
        <div className="p-2 mr-[-4px] rounded-xl bg-slate-50 border border-slate-100 group-hover:bg-white transition-colors shadow-inner">
          {getEventIcon()}
        </div>
        <div className="flex flex-col">
          <span className={`text-[11px] font-black ${getEventTextColor()} subtitle-arabic uppercase tracking-wider leading-none mb-1.5`}>
            {event.type === TimelineEventType.NEW_DATA && 'بيانات جديدة'}
            {event.type === TimelineEventType.UPDATE && 'تحديث دوري'}
            {event.type === TimelineEventType.REVISION && 'تعديل تاريخي'}
            {event.type === TimelineEventType.SIGNAL && 'إشارة سوق'}
            {event.type === TimelineEventType.INSIGHT && 'رؤية ذكية'}
          </span>
          <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400">
            <Clock size={12} className="text-blue-400/70" />
            {getTimeAgo(event.timestamp)}
          </div>
        </div>
      </div>

      {/* Title - Better breathing room */}
      <div className="mb-3">
        <h3 className="font-black text-slate-900 text-[16px] lg:text-[17px] leading-tight group-hover:text-blue-600 transition-colors mb-2">
          {event.title}
        </h3>
        
        <div className="flex flex-wrap items-center gap-2">
          {impactStyles && (
            <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-[10px] font-black ${impactStyles.bg} ${impactStyles.text} border ${impactStyles.border} whitespace-nowrap shadow-sm`}>
                {impactStyles.icon}
                تأثير مرتفع
            </span>
          )}
          {event.delta && (
             <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-black ${event.delta.isPositive ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-rose-50 text-rose-700 border-rose-100'} border shadow-sm`}>
                {event.delta.isPositive ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                <span dir="ltr">{event.delta.value}</span>
                <span className="opacity-60 font-bold mr-1">{event.delta.label}</span>
             </div>
          )}
        </div>
      </div>
      
      {/* Summary - Flexible Clamping */}
      <div className="mb-5">
        <p className={`text-[13px] text-slate-500 leading-relaxed font-medium ${isExpanded ? '' : 'line-clamp-2'}`}>
          {event.summary}
        </p>
        {!isExpanded && event.summary.length > 80 && (
          <button 
            onClick={(e) => { e.stopPropagation(); setIsExpanded(true); }}
            className="text-[11px] font-black text-blue-600 hover:text-blue-700 mt-2 flex items-center gap-1 transition-all"
          >
            <ChevronDown size={14} />
            قراءة المزيد
          </button>
        )}
      </div>

      {/* Footer Info - High-End Source Section */}
      <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-50">
        <div className="flex items-center gap-2.5 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100">
          <div className="w-5 h-5 rounded-lg bg-slate-900 flex items-center justify-center text-[10px] text-white font-black shadow-sm group-hover:bg-blue-600 transition-colors">
            {event.sourceName.substring(0,1)}
          </div>
          <span className="text-[11px] text-slate-700 font-black truncate max-w-[100px]">{event.sourceName}</span>
          <CheckCircle2 size={12} className="text-blue-500" />
        </div>

        <div className="flex items-center gap-1.5 overflow-hidden">
          {event.tags.slice(0, 2).map(tag => (
            <span key={tag} className="text-[10px] text-slate-400 font-bold bg-slate-50 px-2 py-0.5 rounded-md">#{tag}</span>
          ))}
        </div>
      </div>
    </div>
  );
};

// Term definitions for tooltips
const TERM_DEFINITIONS: { [key: string]: string } = {
  'GDP': 'الناتج المحلي الإجمالي: هو القيمة الإجمالية لكل ما تنتجه الدولة، ارتفاعه يدل على قوة الاقتصاد.',
  'FDI': 'الاستثمار الأجنبي المباشر: هو الأموال التي يضخها مستثمرون من الخارج في الشركات أو المشاريع المحلية.',
  'Economy': 'الاقتصاد: هو النظام الذي يحدد كيفية توزيع الموارد والإنتاج والاستهلاك في منطقة معينة.',
  'Investment': 'الاستثمار: هو تخصيص أموال أو موارد حالية للحصول على فوائد مستقبيلة.',
  'Real Estate': 'العقارات: تشمل الأراضي والمباني والمنشآت التجارية والسكنية.',
  'Finance': 'التمويل: هو إدارة الأموال وتوفير رأس المال للمشاريع أو الأفراد.',
  'Labor': 'سوق العمل: يمثل التوازن بين الباحثين عن عمل والوظائف المتاحة في الاقتصاد.',
  'Unemployment': 'البطالة: هي نسبة الأفراد القادرين على العمل والباحثين عنه ولكن لا يجدونه.',
  'Trade': 'التجارة: هي عملية تبادل السلع والخدمات بين الأطراف المختلفة.',
  'Exports': 'الصادرات: هي السلع والخدمات التي تنتجها الدولة وتباع للدول الأخرى.'
};

const TagWithTooltip = ({ tag, onFollow }: { tag: string, onFollow: (tag: string, e: any) => void, key?: React.Key }) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const definition = TERM_DEFINITIONS[tag];

  return (
    <div className="relative group/tag-root">
      <button 
        key={tag} 
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        onClick={(e) => onFollow(tag, e)}
        className="group/tag relative flex items-center px-2 py-1 rounded-lg bg-slate-50 hover:bg-white text-[10px] text-slate-500 font-bold border border-transparent hover:border-blue-100 hover:text-blue-600 transition-all whitespace-nowrap"
        title={definition ? '' : `تتبع الوسم #${tag}`}
      >
        #{tag}
        <Bell size={10} className="mr-1 opacity-0 group-hover/tag:opacity-100 transition-all scale-0 group-hover/tag:scale-100" />
      </button>

      {/* Tooltip Card */}
      {definition && showTooltip && (
        <div className="absolute bottom-full mb-3 right-0 w-64 p-4 bg-[#09090b] text-white rounded-2xl shadow-2xl border border-white/10 z-[100] animate-scaleIn origin-bottom-right">
           <div className="flex items-center gap-2 mb-2 text-blue-400">
              <Info size={14} />
              <span className="text-[10px] font-black uppercase tracking-wider">شرح المصطلح</span>
           </div>
           <p className="text-[11px] font-bold leading-relaxed text-slate-300">
              {definition}
           </p>
           <div className="absolute -bottom-1 right-6 w-3 h-3 bg-[#09090b] border-r border-b border-white/10 rotate-45"></div>
        </div>
      )}
    </div>
  );
};

export default TimelineCard;