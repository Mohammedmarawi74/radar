import React, { useState, useMemo } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender,
  createColumnHelper,
  FilterFn,
} from '@tanstack/react-table';
import { 
  Search, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, 
  ArrowUpDown, Filter, Download, MoreHorizontal, Calendar, 
  MapPin, Banknote, LayoutGrid, Tag, Activity
} from 'lucide-react';

// --- Types & Mock Data ---
interface Transaction {
  id: string;
  district: string;
  type: 'سكني' | 'تجاري' | 'أرض' | 'شقة';
  price: number;
  area: number;
  date: string;
  status: 'مكتمل' | 'معلق' | 'ملغي';
}

const MOCK_DATA: Transaction[] = [
  { id: '1', district: 'الملقا', type: 'شقة', price: 1200000, area: 180, date: '2024-03-15', status: 'مكتمل' },
  { id: '2', district: 'الياسمين', type: 'سكني', price: 3500000, area: 450, date: '2024-03-12', status: 'معلق' },
  { id: '3', district: 'النرجس', type: 'أرض', price: 2800000, area: 600, date: '2024-03-10', status: 'مكتمل' },
  { id: '4', district: 'المربع', type: 'تجاري', price: 8500000, area: 1200, date: '2024-03-08', status: 'مكتمل' },
  { id: '5', district: 'حطين', type: 'سكني', price: 5200000, area: 500, date: '2024-03-05', status: 'مكتمل' },
  { id: '6', district: 'العليا', type: 'تجاري', price: 12500000, area: 2400, date: '2024-03-02', status: 'ملغي' },
  { id: '7', district: 'السليمانية', type: 'شقة', price: 950000, area: 140, date: '2024-02-28', status: 'مكتمل' },
  { id: '8', district: 'قرطبة', type: 'أرض', price: 1900000, area: 550, date: '2024-02-25', status: 'معلق' },
  { id: '9', district: 'الملقا', type: 'سكني', price: 4200000, area: 400, date: '2024-02-20', status: 'مكتمل' },
  { id: '10', district: 'الياسمين', type: 'شقة', price: 1100000, area: 165, date: '2024-02-18', status: 'مكتمل' },
  { id: '11', district: 'الصحافة', type: 'تجاري', price: 15400000, area: 3000, date: '2024-02-15', status: 'مكتمل' },
  { id: '12', district: 'العارض', type: 'سكني', price: 2900000, area: 380, date: '2024-02-12', status: 'مكتمل' },
];

const columnHelper = createColumnHelper<Transaction>();

const NeighborhoodTable: React.FC = () => {
  const [globalFilter, setGlobalFilter] = useState('');
  const [sorting, setSorting] = useState([]);

  const columns = useMemo(() => [
    columnHelper.accessor('district', {
      header: 'الحي',
      cell: info => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600"><MapPin size={14}/></div>
          <span className="font-black text-slate-900">{info.getValue()}</span>
        </div>
      ),
    }),
    columnHelper.accessor('type', {
      header: 'النوع',
      cell: info => (
        <span className={`px-3 py-1 rounded-full text-[10px] font-black ${
          info.getValue() === 'تجاري' ? 'bg-orange-50 text-orange-600' :
          info.getValue() === 'أرض' ? 'bg-indigo-50 text-indigo-600' : 'bg-blue-50 text-blue-600'
        }`}>
          {info.getValue()}
        </span>
      ),
    }),
    columnHelper.accessor('price', {
      header: 'القيمة (ريال)',
      cell: info => (
        <div className="font-bold text-slate-900 tabular-nums">
          {info.getValue().toLocaleString()} <span className="text-[10px] text-slate-400">ريال</span>
        </div>
      ),
    }),
    columnHelper.accessor('area', {
      header: 'المساحة',
      cell: info => (
        <div className="flex items-center gap-2 text-slate-500 font-bold">
          <LayoutGrid size={12}/>
          <span>{info.getValue()} <span className="text-[10px]">م²</span></span>
        </div>
      ),
    }),
    columnHelper.accessor('date', {
      header: 'التاريخ',
      cell: info => (
        <div className="flex items-center gap-2 text-slate-400 text-[11px] font-bold">
          <Calendar size={12}/>
          <span>{info.getValue()}</span>
        </div>
      ),
    }),
    columnHelper.accessor('status', {
      header: 'الحالة',
      cell: info => (
        <div className="flex items-center gap-2">
          <div className={`w-1.5 h-1.5 rounded-full ${
            info.getValue() === 'مكتمل' ? 'bg-emerald-500 animate-pulse' :
            info.getValue() === 'معلق' ? 'bg-amber-500' : 'bg-rose-500'
          }`}></div>
          <span className="text-[11px] font-black text-slate-600">{info.getValue()}</span>
        </div>
      ),
    }),
  ], []);

  const table = useReactTable({
    data: MOCK_DATA,
    columns,
    state: { globalFilter, sorting },
    onGlobalFilterChange: setGlobalFilter,
    onSortingChange: setSorting as any,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 5 } },
  });

  return (
    <div className="w-full bg-white rounded-[40px] border border-slate-100 shadow-2xl p-8 animate-fadeIn mt-12 font-['IBM_Plex_Sans_Arabic'] overflow-hidden">
      
      {/* --- Table Header & Filters --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
        <div>
          <h3 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-3">
             عينة الصفقات <span className="px-3 py-1 bg-blue-600 text-white text-[10px] rounded-full">حي الرياض</span>
          </h3>
          <p className="text-slate-400 text-sm font-bold mt-1">تتبع آخر حركة لأسعار المتر والسيولة في أحياء الرياض</p>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input
              value={globalFilter ?? ''}
              onChange={e => setGlobalFilter(e.target.value)}
              placeholder="البحث في الصفقات (حي، سعر، نوع)..."
              className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3 pr-10 pl-4 text-xs font-bold focus:ring-2 focus:ring-blue-500/20 outline-none transition-all shadow-sm"
            />
          </div>
          <button className="p-3 bg-white border border-slate-100 rounded-2xl text-slate-400 hover:text-blue-600 transition-all shadow-sm"><Filter size={20}/></button>
          <button className="bg-slate-900 text-white px-5 py-3 rounded-2xl text-xs font-black flex items-center gap-2 hover:bg-blue-600 transition-all shadow-xl shadow-slate-900/10">
            تصدير البيانات <Download size={16}/>
          </button>
        </div>
      </div>

      {/* --- Actual Table --- */}
      <div className="overflow-x-auto custom-scrollbar rounded-3xl border border-slate-50">
        <table className="w-full text-right border-collapse">
          <thead>
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id} className="bg-slate-50 border-b border-slate-100">
                {headerGroup.headers.map(header => (
                  <th key={header.id} className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">
                    <div 
                      className={`flex items-center gap-2 ${header.column.getCanSort() ? 'cursor-pointer select-none group' : ''}`}
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      {flexRender(header.column.columnDef.header, header.getContext())}
                      {header.column.getCanSort() && <ArrowUpDown size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />}
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row, idx) => (
              <tr 
                key={row.id} 
                className={`group transition-all hover:bg-blue-50/40 border-b border-slate-50 ${idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/10'}`}
              >
                {row.getVisibleCells().map(cell => (
                  <td key={cell.id} className="px-6 py-6 text-sm">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* --- Pagination --- */}
      <div className="mt-8 flex flex-col md:flex-row items-center justify-between gap-6 px-4">
        <p className="text-xs font-black text-slate-400">
          عرض الصفحة <span className="text-slate-900">{table.getState().pagination.pageIndex + 1}</span> من <span className="text-slate-900">{table.getPageCount()}</span>
        </p>

        <div className="flex items-center gap-2">
           <PaginationButton onClick={() => table.setPageIndex(0)} disabled={!table.getCanPreviousPage()}><ChevronsRight size={16}/></PaginationButton>
           <PaginationButton onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}><ChevronRight size={16}/></PaginationButton>
           
           <div className="flex items-center gap-1 mx-2">
              {[...Array(table.getPageCount())].map((_, i) => (
                <button 
                  key={i} 
                  onClick={() => table.setPageIndex(i)}
                  className={`w-8 h-8 rounded-lg text-[10px] font-black transition-all ${
                    table.getState().pagination.pageIndex === i ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
           </div>

           <PaginationButton onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}><ChevronLeft size={16}/></PaginationButton>
           <PaginationButton onClick={() => table.setPageIndex(table.getPageCount() - 1)} disabled={!table.getCanNextPage()}><ChevronsLeft size={16}/></PaginationButton>
        </div>

        <select 
          value={table.getState().pagination.pageSize}
          onChange={e => table.setPageSize(Number(e.target.value))}
          className="bg-slate-50 border border-slate-100 rounded-xl px-4 py-2 text-[10px] font-black text-slate-600 outline-none focus:ring-2 focus:ring-blue-500/20"
        >
          {[5, 10, 20].map(size => <option key={size} value={size}>إظهار {size}</option>)}
        </select>
      </div>
    </div>
  );
};

const PaginationButton = ({ children, onClick, disabled }: any) => (
  <button 
    onClick={onClick} 
    disabled={disabled}
    className={`p-2.5 rounded-xl border border-slate-100 transition-all ${
      disabled ? 'bg-slate-50 text-slate-200 cursor-not-allowed' : 'bg-white text-slate-400 hover:text-blue-600 hover:border-blue-200'
    }`}
  >
    {children}
  </button>
);

export default NeighborhoodTable;
