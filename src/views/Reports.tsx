import React from 'react';
import { FileText, Download, Printer, ChevronRight, HeartHandshake } from 'lucide-react';
import { Account, DashboardStats } from '../types';

interface ReportsProps {
  accounts: Account[];
  stats: DashboardStats;
}

export const Reports = ({ accounts, stats }: ReportsProps) => {
  const [activeTab, setActiveTab] = React.useState('balance-sheet');

  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);

  const reportTypes = [
    { id: 'balance-sheet', name: 'Posisi Keuangan (Neraca)', description: 'Ringkasan aset, kewajiban, dan ekuitas sesuai PSAK Syariah.' },
    { id: 'income-statement', name: 'Laporan Laba Rugi', description: 'Ringkasan pendapatan operasional dan margin.' },
    { id: 'zakat-report', name: 'Laporan Dana Zakat', description: 'Sumber dan penyaluran dana zakat mal.' },
    { id: 'qardh-report', name: 'Laporan Dana Kebajikan', description: 'Sumber dan penggunaan dana Qardhul Hasan.' },
  ];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1 space-y-2">
           {reportTypes.map(report => (
             <button
               key={report.id}
               onClick={() => setActiveTab(report.id)}
               className={`w-full text-left p-5 rounded-xl border transition-all duration-200 group ${
                 activeTab === report.id 
                  ? "bg-[#064e3b] border-[#064e3b] text-white shadow-lg" 
                  : "bg-white border-slate-200 hover:border-emerald-500 hover:shadow-sm"
               }`}
             >
               <h4 className="text-[13px] font-bold tracking-tight mb-1 uppercase">{report.name}</h4>
               <p className={`text-[11px] leading-relaxed font-medium ${activeTab === report.id ? "text-emerald-200/70" : "text-slate-400"}`}>
                 {report.description}
               </p>
             </button>
           ))}
        </div>

        <div className="lg:col-span-3">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden min-h-[600px] flex flex-col">
            <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
              <div>
                <h3 className="font-bold text-[#064e3b] text-lg">{reportTypes.find(r => r.id === activeTab)?.name}</h3>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] mt-1">Laporan Akuntansi Syariah Periode 2024</p>
              </div>
              <div className="flex gap-2">
                <button className="p-2.5 border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-400 hover:text-slate-600 transition-colors shadow-sm">
                   <Printer className="w-4 h-4" />
                </button>
                <button className="bg-white p-2.5 border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-400 hover:text-slate-600 transition-colors shadow-sm">
                   <Download className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="flex-1 p-10">
               {activeTab === 'balance-sheet' && (
                 <div className="space-y-10 max-w-3xl mx-auto">
                    <div className="space-y-6">
                       <h4 className="flex items-center gap-2 text-[12px] font-bold text-emerald-800 uppercase tracking-widest pb-3 border-b border-emerald-100 w-full">
                         I. ASET (AKTIVA)
                       </h4>
                       <div className="space-y-3 px-2">
                          {accounts.filter(a => a.type === 'Asset').map(a => (
                             <div key={a.id} className="flex justify-between items-center text-[14px]">
                                <span className="text-slate-600 font-medium">{a.name}</span>
                                <span className="font-mono font-bold text-slate-900">{formatCurrency(a.balance)}</span>
                             </div>
                          ))}
                          <div className="pt-6 flex justify-between items-center text-[15px] font-bold border-t border-slate-100">
                             <span className="text-slate-900 uppercase tracking-tight">TOTAL ASET</span>
                             <span className="text-[#064e3b] bg-emerald-50 px-3 py-1 rounded-lg">{formatCurrency(stats.totalAssets)}</span>
                          </div>
                       </div>
                    </div>

                    <div className="space-y-6 pt-6">
                       <h4 className="flex items-center gap-2 text-[12px] font-bold text-slate-500 uppercase tracking-widest pb-3 border-b border-slate-100 w-full">
                         II. KEWAJIBAN & EKUITAS
                       </h4>
                       <div className="space-y-8 px-2">
                          <div className="space-y-3">
                             <p className="text-[10px] font-bold text-slate-400 tracking-[0.2em] uppercase">Kewajiban</p>
                             {accounts.filter(a => a.type === 'Liability').map(a => (
                                <div key={a.id} className="flex justify-between items-center text-[14px]">
                                   <span className="text-slate-600 font-medium">{a.name}</span>
                                   <span className="font-mono font-bold text-slate-900">{formatCurrency(a.balance)}</span>
                                </div>
                             ))}
                          </div>
                          <div className="space-y-3">
                             <p className="text-[10px] font-bold text-slate-400 tracking-[0.2em] uppercase">Ekuitas</p>
                             {accounts.filter(a => a.type === 'Equity').map(a => (
                                <div key={a.id} className="flex justify-between items-center text-[14px]">
                                   <span className="text-slate-600 font-medium">{a.name}</span>
                                   <span className="font-mono font-bold text-slate-900">{formatCurrency(a.balance)}</span>
                                </div>
                             ))}
                          </div>
                          <div className="pt-6 flex justify-between items-center text-[15px] font-bold border-t border-slate-100">
                             <span className="text-slate-900 uppercase tracking-tight">TOTAL PASIVA</span>
                             <span className="text-slate-900 bg-slate-50 px-3 py-1 rounded-lg">{formatCurrency(stats.totalLiabilities + stats.totalEquity)}</span>
                          </div>
                       </div>
                    </div>
                 </div>
               )}

               {activeTab === 'zakat-report' && (
                   <div className="space-y-8 max-w-3xl mx-auto">
                     <div className="bg-[#ecfdf5] p-8 rounded-xl border border-[#d1fae5] shadow-sm flex items-center justify-between">
                        <div>
                           <p className="text-[11px] text-emerald-800 font-bold tracking-widest uppercase">Saldo Dana Zakat Siap Salur</p>
                           <h2 className="text-4xl font-bold font-mono text-[#064e3b] tracking-tighter mt-2">{formatCurrency(stats.zakatFund)}</h2>
                        </div>
                        <HeartHandshake className="w-16 h-16 text-emerald-200" />
                     </div>
                     
                     <div className="space-y-6">
                        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">Rincian Penyaluran Terakhir</p>
                        <div className="bg-white rounded-lg overflow-hidden divide-y divide-slate-50 border border-slate-50">
                           <div className="py-4 flex justify-between items-center">
                              <div>
                                 <p className="text-[14px] font-bold text-slate-800">Mustahik Fakir & Miskin</p>
                                 <p className="text-[12px] text-slate-400 font-medium">12 Ramadhan 1445 H</p>
                              </div>
                              <span className="text-[14px] font-mono font-bold text-emerald-600">-{formatCurrency(2500000)}</span>
                           </div>
                           <div className="py-4 flex justify-between items-center">
                              <div>
                                 <p className="text-[14px] font-bold text-slate-800">Bantuan Pendidikan Syariah</p>
                                 <p className="text-[12px] text-slate-400 font-medium">05 Ramadhan 1445 H</p>
                              </div>
                              <span className="text-[14px] font-mono font-bold text-emerald-600">-{formatCurrency(5000000)}</span>
                           </div>
                        </div>
                     </div>
                  </div>
               )}

               {activeTab === 'income-statement' && (
                 <div className="space-y-10 max-w-3xl mx-auto">
                    <div className="space-y-6">
                       <h4 className="flex items-center gap-2 text-[12px] font-bold text-emerald-800 uppercase tracking-widest pb-3 border-b border-emerald-100 w-full">
                         I. PENDAPATAN (PENERIMAAN)
                       </h4>
                       <div className="space-y-3 px-2">
                          {accounts.filter(a => a.type === 'Income').map(a => (
                             <div key={a.id} className="flex justify-between items-center text-[14px]">
                                <span className="text-slate-600 font-medium">{a.name}</span>
                                <span className="font-mono font-bold text-slate-900">{formatCurrency(a.balance)}</span>
                             </div>
                          ))}
                          <div className="pt-6 flex justify-between items-center text-[15px] font-bold border-t border-slate-100">
                             <span className="text-slate-900 uppercase tracking-tight">TOTAL PENDAPATAN</span>
                             <span className="text-[#064e3b] font-bold">{formatCurrency(accounts.filter(a => a.type === 'Income').reduce((sum, a) => sum + a.balance, 0))}</span>
                          </div>
                       </div>
                    </div>

                    <div className="space-y-6">
                       <h4 className="flex items-center gap-2 text-[12px] font-bold text-rose-800 uppercase tracking-widest pb-3 border-b border-rose-100 w-full">
                         II. BEBAN (PENGELUARAN)
                       </h4>
                       <div className="space-y-3 px-2">
                          {accounts.filter(a => a.type === 'Expense').map(a => (
                             <div key={a.id} className="flex justify-between items-center text-[14px]">
                                <span className="text-slate-600 font-medium">{a.name}</span>
                                <span className="font-mono font-bold text-slate-900">{formatCurrency(a.balance)}</span>
                             </div>
                          ))}
                          <div className="pt-6 flex justify-between items-center text-[15px] font-bold border-t border-slate-100">
                             <span className="text-slate-900 uppercase tracking-tight">TOTAL BEBAN</span>
                             <span className="text-rose-600 font-bold">{formatCurrency(accounts.filter(a => a.type === 'Expense').reduce((sum, a) => sum + a.balance, 0))}</span>
                          </div>
                       </div>
                    </div>

                    <div className="mt-12 bg-[#ecfdf5] p-8 rounded-xl border border-[#d1fae5] flex justify-between items-center">
                       <span className="text-lg font-bold text-[#064e3b] uppercase tracking-tight">LABA RUGI BERSIH</span>
                       <span className="text-2xl font-mono font-bold text-[#064e3b]">{formatCurrency(stats.netIncome)}</span>
                    </div>
                 </div>
               )}

               {activeTab === 'qardh-report' && (
                 <div className="space-y-10 max-w-3xl mx-auto">
                    <div className="bg-cyan-50 p-8 rounded-xl border border-cyan-100 shadow-sm flex items-center justify-between">
                        <div>
                           <p className="text-[11px] text-cyan-800 font-bold tracking-widest uppercase">Dana Kebajikan (Qardhul Hasan)</p>
                           <h2 className="text-4xl font-bold font-mono text-cyan-900 tracking-tighter mt-2">{formatCurrency(stats.qardhulHasanFund)}</h2>
                        </div>
                        <FileText className="w-16 h-16 text-cyan-200" />
                    </div>
                    
                    <div className="space-y-6 px-2">
                       <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">Status Pinjaman Kebajikan</p>
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="p-4 bg-white border border-slate-100 rounded-lg">
                             <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Bebas Tunggakan</p>
                             <p className="font-bold text-emerald-600">100% Aman</p>
                          </div>
                          <div className="p-4 bg-white border border-slate-100 rounded-lg">
                             <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Limit Pinjaman Tersedia</p>
                             <p className="font-bold text-slate-700">{formatCurrency(stats.qardhulHasanFund * 0.8)}</p>
                          </div>
                       </div>
                    </div>
                 </div>
               )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
