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
      className={`group relative flex flex-col p-5 bg-white rounded-[24px] border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-blue-500/5 transition-all cursor-pointer border-l-4 ${getEventColor()} overflow-hidden`}
    >
      {/* Action Buttons Top Right */}
      <div className="absolute top-4 left-4 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
         <button 
           onClick={(e) => { e.stopPropagation(); setIsBookmarked(!isBookmarked); }}
           className={`p-2 rounded-xl border transition-all ${isBookmarked ? 'bg-blue-600 text-white border-blue-500' : 'bg-white text-slate-400 hover:text-blue-600 border-slate-100'}`}
         >
           <Bookmark size={14} className={isBookmarked ? 'fill-current' : ''} />
         </button>
         <button 
           onClick={(e) => { e.stopPropagation(); }}
           className="p-2 rounded-xl bg-white text-slate-400 hover:text-blue-600 border border-slate-100 transition-all"
         >
           <Share2 size={14} />
         </button>
      </div>

      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 mr-[-4px] rounded-xl bg-slate-50 border border-slate-100 group-hover:bg-white group-hover:scale-110 transition-all duration-300">
          {getEventIcon()}
        </div>
        <div className="flex flex-col">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">
            {event.type === TimelineEventType.NEW_DATA && 'بيانات جديدة'}
            {event.type === TimelineEventType.UPDATE && 'تحديث دوري'}
            {event.type === TimelineEventType.REVISION && 'تعديل تاريخي'}
            {event.type === TimelineEventType.SIGNAL && 'إشارة سوق'}
            {event.type === TimelineEventType.INSIGHT && 'رؤية ذكية'}
            {event.type === TimelineEventType.RADAR && 'تحديث رادار'}
          </span>
          <div className="flex items-center gap-2 text-[11px] font-bold text-slate-400">
            <Clock size={11} />
            {getTimeAgo(event.timestamp)}
          </div>
        </div>
      </div>

      {/* Title & Impact */}
      <div className="flex flex-col mb-3">
        <div className="flex items-start justify-between min-h-[44px]">
          <h3 className="font-black text-slate-900 text-lg leading-tight group-hover:text-blue-600 transition-colors pl-8">
            {event.title}
          </h3>
        </div>
        <div className="flex items-center gap-2 mt-1">
          {impactStyles && (
            <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-[10px] font-black ${impactStyles.bg} ${impactStyles.text} border ${impactStyles.border} whitespace-nowrap shadow-sm`}>
                {impactStyles.icon}
                تأثير مرتفع
            </span>
          )}
          {event.delta && (
             <div className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-black ${event.delta.isPositive ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-rose-50 text-rose-700 border-rose-100'} border shadow-sm`}>
                {event.delta.isPositive ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                <span dir="ltr">{event.delta.value}</span>
                <span className="opacity-60 mr-1">{event.delta.label}</span>
             </div>
          )}
        </div>
      </div>
      
      {/* Summary with Expansion */}
      <div className="relative mb-6">
        <p className={`text-[13px] text-slate-600 leading-relaxed font-medium ${isExpanded ? '' : 'line-clamp-2'}`}>
          {event.summary}
        </p>
        {event.summary.length > 100 && (
          <button 
            onClick={(e) => { e.stopPropagation(); setIsExpanded(!isExpanded); }}
            className="text-[11px] font-black text-blue-600 hover:text-blue-700 mt-2 flex items-center gap-1 transition-all"
          >
            {isExpanded ? (
              <>
                <ChevronUp size={12} />
                عرض تفاصيل أقل
              </>
            ) : (
              <>
                <ChevronDown size={12} />
                قراءة المزيد
              </>
            )}
          </button>
        )}
      </div>

      {/* Footer Info */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-50 mt-auto">
        {/* Source */}
        <div className="flex items-center gap-2 px-2.5 py-1.5 bg-slate-50 rounded-xl border border-slate-100 group-hover:border-slate-200 transition-colors">
          <div className="w-5 h-5 rounded-lg bg-blue-600 flex items-center justify-center text-[10px] text-white font-black shadow-sm">
            {event.sourceName.substring(0,1)}
          </div>
          <span className="text-[11px] text-slate-700 font-black truncate max-w-[120px]">{event.sourceName}</span>
          <CheckCircle2 size={12} className="text-blue-500 fill-blue-50" />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar max-w-[50%]">
          {event.tags.map(tag => (
            <TagWithTooltip key={tag} tag={tag} onFollow={handleFollowTag} />
          ))}
        </div>
      </div>

      {/* CTA Section (Visible on Hover or Expanded) */}
      <div className={`mt-4 grid grid-cols-2 gap-2 transition-all duration-300 ${isExpanded ? 'opacity-100 max-h-20' : 'opacity-0 max-h-0 pointer-events-none group-hover:opacity-100 group-hover:max-h-20 group-hover:pointer-events-auto'}`}>
        <button 
          onClick={(e) => { e.stopPropagation(); }}
          className="flex items-center justify-center gap-2 px-3 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-[11px] font-black transition-all shadow-md shadow-blue-500/10"
        >
           <FileText size={14} />
           عرض التقرير التفصيلي
        </button>
        <button 
          onClick={(e) => { e.stopPropagation(); }}
          className="flex items-center justify-center gap-2 px-3 py-2.5 bg-slate-900 hover:bg-black text-white rounded-xl text-[11px] font-black transition-all shadow-md shadow-slate-900/10"
        >
           <LayoutDashboard size={14} />
           الذهاب للمؤشرات
        </button>
      </div>

      {/* So What? Section (Impact Explanation) */}
      {event.impactExplanation && (
        <div className={`mt-4 bg-blue-50/50 rounded-2xl border border-blue-100/50 p-4 transition-all duration-500 ${isExpanded ? 'opacity-100 max-h-[200px]' : 'opacity-0 max-h-0 overflow-hidden'}`}>
           <div className="flex items-center gap-2 mb-2 text-blue-700">
              <Zap size={14} className="fill-blue-600" />
              <span className="text-xs font-black uppercase tracking-wider">ماذا يعني هذا لي؟</span>
           </div>
           <p className="text-[12px] font-bold text-blue-900/80 leading-relaxed">
              {event.impactExplanation}
           </p>
        </div>
      )}
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