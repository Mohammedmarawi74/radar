import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
    ChevronLeft,
    Info,
    Database,
    Share2,
    Download
} from 'lucide-react';
import { DATA_ANGLES } from '../constants/dataAngles';
import Hero from './panel/Hero';
import DatasetTabs from './panel/DatasetTabs';
import PanelSidebar from './panel/Sidebar';
import DatasetContent from './panel/DatasetContent';
import DashboardEmbed from './panel/DashboardEmbed';
import CommentsSection from './panel/CommentsSection';
import ReviewsSection from './panel/ReviewsSection';

const DatasetExplorerPage: React.FC = () => {
    const { angleId } = useParams();
    const navigate = useNavigate();
    const [activePanelTab, setActivePanelTab] = useState('dataset');

    const angle = useMemo(() => {
        return DATA_ANGLES.find(a => a.id === angleId);
    }, [angleId]);

    if (!angle) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="text-center p-8 bg-white rounded-3xl shadow-xl border border-slate-100 max-w-md">
                    <div className="w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Info size={40} className="text-rose-500" />
                    </div>
                    <h2 className="text-2xl font-black text-slate-900 mb-2">زاوية بيانات غير موجودة</h2>
                    <p className="text-slate-500 font-bold mb-8">عذراً، لم نتمكن من العثور على زاوية البيانات المطلوبة.</p>
                    <button 
                        onClick={() => navigate('/dashboards')}
                        className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
                    >
                        <ChevronLeft size={18} />
                        العودة إلى كل اللوحات
                    </button>
                </div>
            </div>
        );
    }

    const isFullWidthTab = activePanelTab === 'dashboard';

    return (
        <div className="min-h-screen bg-transparent font-sans text-right animate-fadeIn" dir="rtl">
            {/* Top Toolbar */}
            <div className="bg-white border-b border-gray-100 sticky top-0 z-[60] py-4 px-6 shadow-sm flex items-center justify-between">
                <button 
                    onClick={() => navigate('/dashboards')}
                    className="flex items-center gap-2 text-gov-blue font-black hover:bg-gray-50 px-4 py-2 rounded-xl transition-all"
                >
                    <ChevronLeft size={20} />
                    العودة إلى كل اللوحات
                </button>

                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-black text-slate-600 hover:bg-slate-100 transition-all">
                        <Share2 size={14} />
                        مشاركة
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-gov-blue text-white rounded-xl text-xs font-black shadow-lg shadow-blue-900/10 hover:bg-gov-light transition-all">
                        <Download size={14} />
                        تنزيل التقرير
                    </button>
                </div>
            </div>

            <main>
                <Hero 
                    title={angle.title} 
                    categoryLabel="نظام زوايا البيانات الذكي" 
                />
                
                <DatasetTabs 
                    activeTab={activePanelTab} 
                    onTabChange={setActivePanelTab} 
                />

                <div className="container mx-auto px-4 py-8">
                    <div className={`flex flex-col ${isFullWidthTab ? '' : 'lg:flex-row'} gap-8`}>
                        
                        {/* Main Content Area */}
                        <div className={`w-full ${isFullWidthTab ? '' : 'lg:w-2/3'} order-2 lg:order-1`}>
                           {activePanelTab === 'dataset' ? (
                             <DatasetContent 
                                description={angle.explanation}
                                sources={angle.sources}
                                fields={angle.fields}
                                datasets={angle.datasets}
                             />
                           ) : activePanelTab === 'dashboard' ? (
                             <DashboardEmbed />
                           ) : activePanelTab === 'comments' ? (
                             <CommentsSection />
                           ) : activePanelTab === 'reviews' ? (
                             <ReviewsSection />
                           ) : (
                             <div className="p-12 text-center text-gray-400 bg-white rounded-xl border border-gray-200">
                                <p className="text-lg">المحتوى قيد التطوير لهذا التبويب</p>
                             </div>
                           )}
                        </div>

                        {/* Sidebar (Only shown if NOT full width tab) */}
                        {!isFullWidthTab && (
                            <aside className="w-full lg:w-1/3 order-1 lg:order-2">
                                <PanelSidebar />
                            </aside>
                        )}

                    </div>
                </div>
            </main>
        </div>
    );
};

export default DatasetExplorerPage;
