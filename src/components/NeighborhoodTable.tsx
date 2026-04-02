import React, { useState, useMemo } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFacetedMinMaxValues,
  flexRender,
  createColumnHelper,
  FilterFn,
  ColumnFiltersState,
} from '@tanstack/react-table';
import { 
  Search, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, 
  ArrowUpDown, Filter, Download, Calendar, 
  MapPin, Banknote, LayoutGrid, Tag, Activity,
  SlidersHorizontal, X, ArrowUp, ArrowDown, ChevronDown,
  Package, CheckCircle2, TrendingUp, BarChart3
} from 'lucide-react';

// --- Types ---
interface DistrictMetric {
  name: string;
  value: number; // Current primary metric (liquidity or txns)
  detailedStats: {
    total_price_M: number;
    txn_count: number;
    avg_price_M: number;
    avg_area: number;
  };
}

interface NeighborhoodTableProps {
  cityName: string;
  data: DistrictMetric[];
  isLoading?: boolean;
}

const fuzzyFilter: FilterFn<any> = (row, columnId, value) => {
  const rowValue = row.getValue(columnId);
  if (!rowValue) return false;
  return rowValue.toString().toLowerCase().includes(value.toString().toLowerCase());
};

const columnHelper = createColumnHelper<DistrictMetric>();

const NeighborhoodTable: React.FC<NeighborhoodTableProps> = ({ cityName, data, isLoading }) => {
  const [globalFilter, setGlobalFilter] = useState('');
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = useState([{ id: 'liquidity', desc: true }]);
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);

  // --- Column Definitions ---
  const columns = useMemo(() => [
    columnHelper.accessor('name', {
      header: 'اسم الحي',
      cell: info => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 shadow-sm border border-blue-100/50"><MapPin size={16}/></div>
          <span className="font-extrabold text-slate-900 tracking-tight">{info.getValue().startsWith('حي') ? info.getValue() : `حي ${info.getValue()}`}</span>
        </div>
      ),
      filterFn: 'includesString',
    }),
    columnHelper.accessor('detailedStats.total_price_M', {
      id: 'liquidity',
      header: 'إجمالي السيولة',
      cell: info => (
        <div className="flex flex-col text-right">
          <span className="font-black text-slate-900 text-sm tabular-nums tracking-tight">
            {info.getValue().toFixed(2)} <span className="text-[10px] text-slate-400 font-bold">مليون</span>
          </span>
          <div className="flex items-center gap-1 mt-1">
             <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
             <span className="text-[9px] text-blue-500 font-black uppercase tracking-widest">Active Pulse</span>
          </div>
        </div>
      ),
      filterFn: 'inNumberRange',
    }),
    columnHelper.accessor('detailedStats.txn_count', {
      header: 'عدد الصفقات',
      cell: info => (
        <div className="flex items-center gap-2 group/tx">
          <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600 border border-emerald-100 group-hover/tx:scale-110 transition-transform"><Activity size={14}/></div>
          <span className="font-bold text-slate-700 tabular-nums lowercase">{info.getValue().toLocaleString()} <span className="text-[10px] font-black opacity-60">صفقة</span></span>
        </div>
      ),
      filterFn: 'inNumberRange',
    }),
    columnHelper.accessor('detailedStats.avg_price_M', {
      header: 'متوسط السعر',
      cell: info => (
        <div className="font-black text-slate-900 text-sm tabular-nums">
          {info.getValue().toFixed(2)} <span className="text-[10px] text-slate-400 font-bold uppercase">M SAR</span>
        </div>
      ),
      filterFn: 'inNumberRange',
    }),
    columnHelper.accessor('detailedStats.avg_area', {
      header: 'متوسط المساحة',
      cell: info => (
        <div className="flex items-center gap-2 text-slate-500 font-bold">
          <LayoutGrid size={14} className="text-slate-300"/>
          <span>{info.getValue().toFixed(0)} <span className="text-[10px] font-black opacity-60">م²</span></span>
        </div>
      ),
      filterFn: 'inNumberRange',
    }),
    columnHelper.display({
      id: 'growth',
      header: 'تصنيف الأداء',
      cell: info => {
        const row = info.row.original;
        const isHigh = row.detailedStats.total_price_M > 50;
        return (
          <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black border tracking-wide shadow-sm flex items-center gap-1.5 w-fit ${
            isHigh ? 'bg-indigo-50 text-indigo-600 border-indigo-100 shadow-indigo-500/5' : 'bg-slate-50 text-slate-500 border-slate-100'
          }`}>
            <TrendingUp size={10}/> {isHigh ? 'حي مؤسسي' : 'حي صاعد'}
          </span>
        );
      }
    }),
  ], []);

  // --- Table Instance ---
  const table = useReactTable({
    data: data || [],
    columns,
    state: { globalFilter, columnFilters, sorting },
    onGlobalFilterChange: setGlobalFilter,
    onColumnFiltersChange: setColumnFilters,
    onSortingChange: setSorting as any,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFacetedMinMaxValues: getFacetedMinMaxValues(),
    globalFilterFn: fuzzyFilter,
    initialState: { pagination: { pageSize: 8 } },
  });

  const handleExport = () => {
    const csvContent = 
      "Neighborhood,Liquidity (M),Transactions,Avg Price (M),Avg Area\n" +
      table.getFilteredRowModel().rows.map(row => {
        const d = row.original;
        return `${d.name},${d.detailedStats.total_price_M},${d.detailedStats.txn_count},${d.detailedStats.avg_price_M},${d.detailedStats.avg_area}`;
      }).join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", `Transactions_${cityName}_${new Date().toLocaleDateString()}.csv`);
    link.click();
  };

  if (isLoading) {
    return (
      <div className="w-full bg-white rounded-[40px] border border-slate-100 shadow-2xl p-20 flex flex-col items-center justify-center gap-6 animate-pulse mt-12">
        <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sm font-black text-slate-400 uppercase tracking-widest">جاري معالجة بيانات {cityName}...</p>
      </div>
    );
  }

  return (
    <div className="w-full bg-white rounded-[40px] border border-slate-100 shadow-[0_48px_120px_-30px_rgba(0,0,0,0.12)] p-10 animate-fadeIn mt-12 font-['IBM_Plex_Sans_Arabic'] overflow-hidden relative">
      
      {/* ── HEADER ── */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 mb-12">
        <div className="space-y-2">
          <div className="flex items-center gap-4">
             <div className="w-14 h-14 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-2xl shadow-blue-500/40 border border-blue-400/20"><BarChart3 size={28}/></div>
             <div>
                <h3 className="text-3xl font-black text-slate-900 tracking-tighter">محلل أحياء {cityName}</h3>
                <p className="text-slate-400 text-xs font-black uppercase tracking-[0.2em] leading-none mt-1.5 opacity-80">Localized District Performance - {cityName}</p>
             </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4 w-full lg:w-auto">
          <div className="relative flex-1 lg:w-[450px]">
            <Search className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              value={globalFilter ?? ''}
              onChange={e => setGlobalFilter(e.target.value)}
              placeholder={`ابحث عن أي حي في ${cityName}...`}
              className="w-full bg-slate-50 border border-slate-100 rounded-[28px] py-4.5 pr-14 pl-6 text-sm font-bold focus:ring-8 focus:ring-blue-500/5 focus:border-blue-500 focus:bg-white outline-none transition-all duration-500 shadow-inner"
            />
          </div>
          
          <button 
            onClick={() => setIsFilterPanelOpen(!isFilterPanelOpen)}
            className={`flex items-center gap-2 px-8 py-4.5 rounded-[28px] text-xs font-black transition-all border shadow-lg transform active:scale-95 ${
              isFilterPanelOpen 
              ? 'bg-blue-600 text-white border-blue-500 shadow-blue-500/30' 
              : 'bg-white text-slate-600 border-slate-100 hover:bg-slate-50'
            }`}
          >
            <SlidersHorizontal size={18}/> {isFilterPanelOpen ? 'إغلاق المحلل' : 'تصفية ذكية'}
          </button>

          <button 
            onClick={handleExport}
            className="bg-slate-900 text-white px-8 py-4.5 rounded-[28px] text-xs font-black flex items-center gap-2 hover:bg-blue-600 transition-all shadow-2xl shadow-slate-900/30 active:scale-95"
          >
             تحميل البيانات <div className="w-px h-3 bg-white/20 mx-1"></div> <Download size={18}/>
          </button>
        </div>
      </div>

      {/* ── SMART FILTER PANEL ── */}
      {isFilterPanelOpen && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12 p-10 bg-slate-50/50 rounded-[40px] border border-slate-100 animate-slideDown shadow-inner">
           <FilterField 
             label="البحث عن حي محدد" 
             icon={MapPin} 
             value={table.getColumn('name')?.getFilterValue() as string}
             onChange={v => table.getColumn('name')?.setFilterValue(v)}
           />
           <RangeFilterField 
             label="نطاق السيولة (مليون)" 
             icon={Banknote} 
             values={table.getColumn('liquidity')?.getFilterValue() as [number, number]}
             onChange={v => table.getColumn('liquidity')?.setFilterValue(v)}
           />
           <RangeFilterField 
             label="نطاق عدد الصفقات" 
             icon={Activity} 
             values={table.getColumn('detailedStats.txn_count')?.getFilterValue() as [number, number]}
             onChange={v => table.getColumn('detailedStats.txn_count')?.setFilterValue(v)}
           />
        </div>
      )}

      {/* ── DATAGRID ── */}
      <div className="overflow-x-auto custom-scrollbar rounded-[40px] border border-slate-100 bg-white/50 backdrop-blur-md shadow-2xl relative">
        <table className="w-full text-right border-collapse">
          <thead>
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id} className="bg-slate-50/80 border-b border-slate-100">
                {headerGroup.headers.map(header => (
                  <th key={header.id} className="px-10 py-7 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">
                    <div 
                      className={`flex items-center gap-3 ${header.column.getCanSort() ? 'cursor-pointer select-none group/h' : ''}`}
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      {flexRender(header.column.columnDef.header, header.getContext())}
                      
                      {header.column.getCanSort() && (
                        <div className="flex flex-col scale-75 opacity-10 group-hover/h:opacity-100 transition-opacity">
                           <ArrowUp size={10} className={header.column.getIsSorted() === 'asc' ? 'text-blue-500 opacity-100' : ''}/>
                           <ArrowDown size={10} className={header.column.getIsSorted() === 'desc' ? 'text-blue-500 opacity-100' : ''}/>
                        </div>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="divide-y divide-slate-100/50">
            {table.getRowModel().rows.length > 0 ? table.getRowModel().rows.map((row, idx) => (
              <tr 
                key={row.id} 
                className={`group transition-all hover:bg-blue-50/50 relative overflow-hidden ${idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/10'}`}
              >
                {row.getVisibleCells().map(cell => (
                  <td key={cell.id} className="px-10 py-7">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            )) : (
              <tr>
                <td colSpan={6} className="py-40 text-center">
                   <div className="flex flex-col items-center gap-8 opacity-50">
                      <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center border border-slate-100"><Search size={48} className="text-slate-300"/></div>
                      <div>
                        <p className="text-2xl font-black text-slate-900 mb-2 tracking-tight">لم يتم العثور على أحياء مطابقة</p>
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">الرجاء تعديل خيارات التصفية الذكية</p>
                      </div>
                      <button 
                        onClick={() => { setGlobalFilter(''); setColumnFilters([]); }}
                        className="bg-slate-900 text-white px-6 py-3 rounded-2xl text-[10px] font-black uppercase hover:bg-blue-600 transition-all shadow-xl"
                      >إعادة تعيين كافة الفلاتر</button>
                   </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ── PAGINATION ── */}
      <div className="mt-12 flex flex-col lg:flex-row items-center justify-between gap-10 px-6 border-t border-slate-50 pt-10">
        <div className="flex items-center gap-12">
           <div className="flex flex-col">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 shadow-sm">الحالة حالياً</span>
              <p className="text-2xl font-black text-slate-900 tracking-tight">
                 الصفحة {table.getState().pagination.pageIndex + 1} <span className="text-slate-200 text-lg font-light mx-1">|</span> {table.getPageCount()}
              </p>
           </div>
           
           <div className="h-12 w-px bg-slate-100 opacity-60"></div>

           <div className="flex flex-col">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">إجمالي الأحياء</span>
              <p className="text-xl font-black text-slate-900 tracking-tight">{table.getFilteredRowModel().rows.length} <span className="text-slate-400 text-[10px] font-bold uppercase">District</span></p>
           </div>
        </div>

        <div className="flex items-center gap-4">
           <PaginationButton onClick={() => table.setPageIndex(0)} disabled={!table.getCanPreviousPage()}><ChevronsRight size={22}/></PaginationButton>
           <PaginationButton onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}><ChevronRight size={22}/></PaginationButton>
           
           <div className="flex items-center gap-2 mx-6">
              {[...Array(table.getPageCount())].map((_, i) => (
                <button 
                  key={i} 
                  onClick={() => table.setPageIndex(i)}
                  className={`w-12 h-12 rounded-2xl text-xs font-black transition-all duration-500 transform active:scale-90 ${
                    table.getState().pagination.pageIndex === i ? 'bg-blue-600 text-white shadow-2xl shadow-blue-500/50 scale-110' : 'bg-white border border-slate-100 text-slate-400 hover:border-blue-200'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
           </div>

           <PaginationButton onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}><ChevronLeft size={22}/></PaginationButton>
           <PaginationButton onClick={() => table.setPageIndex(table.getPageCount() - 1)} disabled={!table.getCanNextPage()}><ChevronsLeft size={22}/></PaginationButton>
        </div>

        <div className="bg-slate-50 p-2 rounded-[24px] border border-slate-100 flex items-center gap-2 shadow-inner">
           {[8, 16, 32].map(size => (
             <button 
               key={size}
               onClick={() => table.setPageSize(size)}
               className={`px-6 py-2.5 rounded-[18px] text-[10px] font-black transition-all duration-300 ${
                 table.getState().pagination.pageSize === size ? 'bg-white text-slate-900 shadow-lg' : 'text-slate-400 hover:text-slate-600'
               }`}
             >إظهار {size}</button>
           ))}
        </div>
      </div>
    </div>
  );
};

// ── HELPER COMPONENTS ──

const FilterField = ({ label, icon: Icon, value, onChange }: any) => (
  <div className="space-y-3">
    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
       <Icon size={12}/> {label}
    </label>
    <div className="relative">
      <input 
        value={value ?? ''}
        onChange={e => onChange(e.target.value)}
        className="w-full bg-white border border-slate-200 rounded-2xl py-4 px-5 text-[11px] font-bold focus:ring-8 focus:ring-blue-500/5 focus:border-blue-500 outline-none transition-all shadow-sm"
        placeholder="بدء البحث..."
      />
      {value && <button onClick={() => onChange('')} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-600"><X size={16}/></button>}
    </div>
  </div>
);

const RangeFilterField = ({ label, icon: Icon, values = [0, 2000000], onChange }: any) => (
  <div className="space-y-3">
    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
       <Icon size={12}/> {label}
    </label>
    <div className="flex items-center gap-3">
       <input 
         type="number"
         value={values[0] || 0}
         onChange={e => onChange([Number(e.target.value), values[1] || 1000000000])}
         className="w-full bg-white border border-slate-200 rounded-2xl py-3 px-4 text-[11px] font-bold focus:border-blue-500 outline-none shadow-sm"
         placeholder="من"
       />
       <div className="w-4 h-px bg-slate-200"></div>
       <input 
         type="number"
         value={values[1] || 1000000000}
         onChange={e => onChange([values[0] || 0, Number(e.target.value)])}
         className="w-full bg-white border border-slate-200 rounded-2xl py-3 px-4 text-[11px] font-bold focus:border-blue-500 outline-none shadow-sm"
         placeholder="إلى"
       />
    </div>
  </div>
);

const PaginationButton = ({ children, onClick, disabled }: any) => (
  <button 
    onClick={onClick} 
    disabled={disabled}
    className={`w-14 h-14 rounded-2xl border transition-all flex items-center justify-center shadow-md transform active:scale-95 ${
      disabled ? 'bg-slate-50 border-transparent text-slate-200 cursor-not-allowed opacity-50' : 'bg-white border-slate-100 text-slate-400 hover:text-blue-600 hover:border-blue-400 hover:shadow-blue-500/10'
    }`}
  >
    {children}
  </button>
);

export default NeighborhoodTable;
