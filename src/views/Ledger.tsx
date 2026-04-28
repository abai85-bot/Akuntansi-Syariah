import React from 'react';
import { Account, JournalEntry } from '../types';
import { Search, ArrowRightLeft } from 'lucide-react';

interface LedgerProps {
  accounts: Account[];
  journals: JournalEntry[];
}

export const Ledger = ({ accounts, journals }: LedgerProps) => {
  const [selectedAccountId, setSelectedAccountId] = React.useState<string>(accounts[0]?.id || '');
  
  const selectedAccount = accounts.find(a => a.id === selectedAccountId);

  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);

  // Filter journal items for the selected account
  const ledgerEntries = React.useMemo(() => {
    const entries: { date: string; description: string; ref: string; debit: number; credit: number; balance: number }[] = [];
    
    // Initial balance could be added here if needed
    let runningBalance = 0; // Simplified: starting from 0 for the sake of demo journals
    
    // In a real app, you'd start with the account's opening balance
    // For this prototype, we'll just show the transactional flow
    
    [...journals].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()).forEach(journal => {
      const item = journal.items.find(i => i.accountId === selectedAccountId);
      if (item) {
        if (selectedAccount?.type === 'Asset' || selectedAccount?.type === 'Expense') {
          runningBalance += (item.debit - item.credit);
        } else {
          runningBalance += (item.credit - item.debit);
        }
        
        entries.push({
          date: journal.date,
          description: journal.description,
          ref: journal.reference || '-',
          debit: item.debit,
          credit: item.credit,
          balance: runningBalance
        });
      }
    });
    
    return entries;
  }, [journals, selectedAccountId, selectedAccount]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <aside className="lg:col-span-1 space-y-4">
          <div className="card p-4">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 block">Pilih Akun</label>
            <div className="space-y-1 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
              {accounts.map(acc => (
                <button
                  key={acc.id}
                  onClick={() => setSelectedAccountId(acc.id)}
                  className={`w-full text-left p-3 rounded-lg text-[13px] transition-all ${
                    selectedAccountId === acc.id 
                      ? "bg-[#064e3b] text-white shadow-md font-bold" 
                      : "hover:bg-slate-50 text-slate-600 border border-transparent hover:border-slate-100"
                  }`}
                >
                  <div className="text-[10px] opacity-70 mb-0.5">{acc.code}</div>
                  {acc.name}
                </button>
              ))}
            </div>
          </div>
        </aside>

        <main className="lg:col-span-3 space-y-6">
          {selectedAccount ? (
            <>
              <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm flex justify-between items-end">
                <div>
                  <h3 className="text-2xl font-bold text-[#064e3b]">{selectedAccount.name}</h3>
                  <p className="text-[12px] text-slate-400 font-bold uppercase tracking-widest mt-1">Kode Akun: {selectedAccount.code}</p>
                </div>
                <div className="text-right">
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1">Saldo Akhir</p>
                  <p className="text-2xl font-mono font-bold text-[#064e3b]">{formatCurrency(selectedAccount.balance)}</p>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <table className="w-full text-left border-collapse entry-table">
                  <thead>
                    <tr className="bg-slate-50/50">
                      <th className="px-6 py-4 uppercase tracking-widest font-bold">Tanggal</th>
                      <th className="px-6 py-4 uppercase tracking-widest font-bold">Keterangan / Ref</th>
                      <th className="px-6 py-4 uppercase tracking-widest font-bold text-right">Debit</th>
                      <th className="px-6 py-4 uppercase tracking-widest font-bold text-right">Kredit</th>
                      <th className="px-6 py-4 uppercase tracking-widest font-bold text-right">Saldo</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {ledgerEntries.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-6 py-12 text-center text-slate-400 italic">Tidak ada mutasi transaksi untuk akun ini.</td>
                      </tr>
                    ) : (
                      ledgerEntries.map((entry, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/30">
                          <td className="px-6 py-4 text-[13px] text-slate-500 font-medium">
                            {new Date(entry.date).toLocaleDateString('id-ID')}
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-[14px] font-semibold text-slate-700">{entry.description}</div>
                            <div className="text-[10px] text-emerald-600 font-bold uppercase">{entry.ref}</div>
                          </td>
                          <td className="px-6 py-4 text-right text-[14px] font-mono font-medium text-slate-600">
                            {entry.debit > 0 ? formatCurrency(entry.debit) : '-'}
                          </td>
                          <td className="px-6 py-4 text-right text-[14px] font-mono font-medium text-slate-600">
                            {entry.credit > 0 ? formatCurrency(entry.credit) : '-'}
                          </td>
                          <td className="px-6 py-4 text-right text-[14px] font-mono font-bold text-[#064e3b]">
                            {formatCurrency(entry.balance)}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center p-20 bg-white rounded-xl border border-slate-200 text-slate-400">
               <ArrowRightLeft className="w-12 h-12 opacity-20 mb-4" />
               <p>Pilih akun di samping untuk melihat rincian mutasi buku besar.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
