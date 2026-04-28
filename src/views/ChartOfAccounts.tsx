import React from 'react';
import { Search, Plus, Filter, ArrowUpDown } from 'lucide-react';
import { Account } from '../types';

interface COAProps {
  accounts: Account[];
}

export const ChartOfAccounts = ({ accounts }: COAProps) => {
  const [searchTerm, setSearchTerm] = React.useState('');

  const filteredAccounts = accounts.filter(acc => 
    acc.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    acc.code.includes(searchTerm)
  );

  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row gap-4 items-center bg-slate-50/30">
          <div className="relative flex-1 w-full text-[14px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Cari akun atau kode..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
          </div>
          <button className="bg-[#059669] hover:bg-[#047857] text-white px-6 py-2 rounded-lg text-[13px] font-bold flex items-center gap-2 transition-all shadow-sm">
            <Plus className="w-4 h-4" /> TAMBAH AKUN
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse entry-table">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-6 py-4 uppercase tracking-widest font-bold">KODE</th>
                <th className="px-6 py-4 uppercase tracking-widest font-bold">NAMA AKUN</th>
                <th className="px-6 py-4 uppercase tracking-widest font-bold">KATEGORI</th>
                <th className="px-6 py-4 uppercase tracking-widest font-bold">TIPE</th>
                <th className="px-6 py-4 uppercase tracking-widest font-bold text-right">SALDO AKHIR</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredAccounts.map((acc) => (
                <tr key={acc.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-4 text-xs font-mono font-medium text-slate-400">{acc.code}</td>
                  <td className="px-6 py-4">
                    <div className="text-[14px] font-semibold text-slate-700">{acc.name}</div>
                  </td>
                  <td className="px-6 py-4">
                     <span className="text-[11px] font-medium text-slate-500">
                       {acc.category}
                     </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                      acc.type === 'Asset' ? 'bg-blue-50 text-blue-700' :
                      acc.type === 'Liability' ? 'bg-orange-50 text-orange-700' :
                      acc.type === 'Equity' ? 'bg-purple-50 text-purple-700' :
                      acc.type === 'Income' ? 'bg-emerald-50 text-emerald-700' :
                      'bg-rose-50 text-rose-700'
                    }`}>
                      {acc.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right text-[14px] font-mono font-bold text-slate-900">
                    {formatCurrency(acc.balance)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
