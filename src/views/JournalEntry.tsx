import React from 'react';
import { Plus, Trash2, Save, RotateCcw, AlertCircle, CheckCircle2, History } from 'lucide-react';
import { Account, JournalEntry as JournalEntryType, JournalItem } from '../types';

interface JournalEntryProps {
  accounts: Account[];
  onSave: (entry: Partial<JournalEntryType>) => void;
  journals: JournalEntryType[];
  onDelete: (id: string) => void;
}

export const JournalEntry = ({ accounts, onSave, journals, onDelete }: JournalEntryProps) => {
  const [date, setDate] = React.useState(new Date().toISOString().split('T')[0]);
  const [description, setDescription] = React.useState('');
  const [reference, setReference] = React.useState('');
  const [items, setItems] = React.useState<JournalItem[]>([
    { accountId: '', debit: 0, credit: 0 },
    { accountId: '', debit: 0, credit: 0 },
  ]);

  const totalDebit = items.reduce((sum, item) => sum + (item.debit || 0), 0);
  const totalCredit = items.reduce((sum, item) => sum + (item.credit || 0), 0);
  const isBalanced = totalDebit === totalCredit && totalDebit > 0;

  const getAccountName = (id: string) => accounts.find(a => a.id === id)?.name || 'Unknown';

  const addItem = () => {
    setItems([...items, { accountId: '', debit: 0, credit: 0 }]);
  };

  const removeItem = (index: number) => {
    if (items.length > 2) {
      setItems(items.filter((_, i) => i !== index));
    }
  };

  const updateItem = (index: number, field: keyof JournalItem, value: any) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    
    // Clear opposite if value is > 0
    if (field === 'debit' && value > 0) newItems[index].credit = 0;
    if (field === 'credit' && value > 0) newItems[index].debit = 0;
    
    setItems(newItems);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isBalanced) return;
    
    onSave({
      date,
      description,
      reference,
      items: items.filter(item => item.accountId !== '')
    });

    // Reset form
    setDescription('');
    setReference('');
    setItems([
      { accountId: '', debit: 0, credit: 0 },
      { accountId: '', debit: 0, credit: 0 },
    ]);
  };

  const formatNumber = (num: number) => 
    new Intl.NumberFormat('id-ID', { maximumFractionDigits: 0 }).format(num);

  return (
    <div className="max-w-6xl mx-auto space-y-12">
      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* ... form content remains same ... */}
        <div className="lg:col-span-2 bg-white p-8 rounded-xl border border-slate-200 shadow-sm space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[12px] font-bold text-slate-500 uppercase tracking-wider">Tanggal Transaksi</label>
              <input 
                type="date" 
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full input-minimal focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[12px] font-bold text-slate-500 uppercase tracking-wider">Jenis Akad / Ref</label>
              <input 
                type="text" 
                placeholder="Misal: MRB-001"
                value={reference}
                onChange={(e) => setReference(e.target.value)}
                className="w-full input-minimal focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[12px] font-bold text-slate-500 uppercase tracking-wider">Keterangan Transaksi</label>
            <input 
              type="text" 
              required
              placeholder="Contoh: Pembelian inventaris kantor mudharabah"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full input-minimal focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
          </div>

          <div className="overflow-hidden border border-slate-100 rounded-lg">
             <table className="w-full text-left border-collapse entry-table">
               <thead>
                 <tr className="bg-slate-50">
                    <th className="px-4 py-3">AKUN</th>
                    <th className="px-4 py-3 w-40">DEBET (IDR)</th>
                    <th className="px-4 py-3 w-40">KREDIT (IDR)</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-slate-50 text-[14px]">
                  {items.map((item, idx) => (
                    <tr key={idx} className="group">
                      <td className="px-2 py-3">
                         <select 
                           required
                           value={item.accountId}
                           onChange={(e) => updateItem(idx, 'accountId', e.target.value)}
                           className="w-full bg-transparent border-none focus:ring-0 text-slate-900 font-medium"
                         >
                            <option value="">Pilih Akun...</option>
                            {accounts.map(acc => (
                              <option key={acc.id} value={acc.id}>{acc.code} - {acc.name}</option>
                            ))}
                         </select>
                      </td>
                      <td className="px-2 py-3">
                        <input 
                          type="number"
                          placeholder="-"
                          value={item.debit || ''}
                          onChange={(e) => updateItem(idx, 'debit', parseFloat(e.target.value) || 0)}
                          className="w-full bg-transparent border-none focus:ring-0 font-mono text-right" 
                        />
                      </td>
                      <td className="px-2 py-3">
                        <input 
                          type="number"
                          placeholder="-"
                          value={item.credit || ''}
                          onChange={(e) => updateItem(idx, 'credit', parseFloat(e.target.value) || 0)}
                          className="w-full bg-transparent border-none focus:ring-0 font-mono text-right"
                        />
                      </td>
                      <td className="px-2 py-3 text-center">
                        {items.length > 2 && (
                          <button 
                            type="button" 
                            onClick={() => removeItem(idx)}
                            className="p-1.5 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-md transition-all"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
               </tbody>
             </table>
          </div>

          <button 
            type="button" 
            onClick={addItem}
            className="text-[12px] font-bold text-emerald-600 hover:text-emerald-700 p-2 uppercase tracking-widest flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Tambah Baris Transaksi
          </button>
        </div>

        <div className="space-y-6">
           <div className="bg-[#ecfdf5] border border-[#d1fae5] p-6 rounded-xl space-y-4 shadow-sm">
              <div>
                 <p className="text-[11px] font-bold text-emerald-800 uppercase tracking-widest mb-2">Total Debet</p>
                 <p className="text-xl font-mono font-bold text-[#064e3b]">{formatNumber(totalDebit)}</p>
              </div>
              <div className="pt-4 border-t border-emerald-200">
                 <p className="text-[11px] font-bold text-emerald-800 uppercase tracking-widest mb-2">Total Kredit</p>
                 <p className="text-xl font-mono font-bold text-[#064e3b]">{formatNumber(totalCredit)}</p>
              </div>
           </div>

           <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                 <span className="text-[12px] font-bold text-slate-500 uppercase tracking-wider">Keseimbangan Jurnal</span>
                 {isBalanced ? (
                    <span className="sharia-badge">Balanced</span>
                 ) : (
                    <span className="text-[10px] font-bold text-rose-600 bg-rose-50 px-2 py-1 rounded-full uppercase">Imbalanced</span>
                 )}
              </div>
              
              <button 
                type="submit"
                disabled={!isBalanced}
                className="w-full bg-[#059669] hover:bg-[#047857] text-white py-4 rounded-lg font-bold text-[14px] disabled:opacity-50 disabled:cursor-not-allowed shadow-md transition-all flex items-center justify-center gap-2"
              >
                <Save className="w-4 h-4" /> SIMPAN TRANSAKSI SYARIAH
              </button>
           </div>
        </div>
      </form>

      {/* Transaction History Section */}
      <div className="space-y-6">
        <div className="flex items-center gap-3">
           <History className="w-5 h-5 text-emerald-600" />
           <h3 className="font-bold text-[#064e3b] text-lg uppercase tracking-tight">Historis Transaksi Terakhir</h3>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <table className="w-full text-left border-collapse entry-table">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-6 py-4 uppercase tracking-widest font-bold">Tanggal</th>
                <th className="px-6 py-4 uppercase tracking-widest font-bold">Keterangan</th>
                <th className="px-6 py-4 uppercase tracking-widest font-bold">Detail Akun</th>
                <th className="px-6 py-4 uppercase tracking-widest font-bold text-right">Debit</th>
                <th className="px-6 py-4 uppercase tracking-widest font-bold text-right">Kredit</th>
                <th className="px-6 py-4 w-10"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {journals.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-400 italic">Belum ada transaksi tercatat.</td>
                </tr>
              ) : (
                [...journals].reverse().map((journal) => (
                  <tr key={journal.id} className="hover:bg-slate-50/30 group">
                    <td className="px-6 py-4 text-[13px] font-medium text-slate-500 whitespace-nowrap">
                       {new Date(journal.date).toLocaleDateString('id-ID')}
                       {journal.reference && <div className="text-[10px] text-emerald-600 font-bold mt-0.5">{journal.reference}</div>}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-[14px] font-semibold text-slate-700">{journal.description}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        {journal.items.map((item, idx) => (
                          <div key={idx} className={`text-[12px] flex items-center gap-2 ${item.credit > 0 ? 'pl-4 text-slate-400' : 'text-slate-600 font-medium'}`}>
                            {item.credit > 0 && <span className="text-[10px]">└</span>}
                            {getAccountName(item.accountId)}
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                       <div className="space-y-1">
                          {journal.items.map((item, idx) => (
                            <div key={idx} className="text-[12px] font-mono font-bold text-slate-700">
                              {item.debit > 0 ? formatNumber(item.debit) : '-'}
                            </div>
                          ))}
                       </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                       <div className="space-y-1">
                          {journal.items.map((item, idx) => (
                            <div key={idx} className="text-[12px] font-mono text-slate-400">
                              {item.credit > 0 ? formatNumber(item.credit) : '-'}
                            </div>
                          ))}
                       </div>
                    </td>
                    <td className="px-4 py-4">
                       <button 
                         onClick={() => {
                           if(confirm('Hapus transaksi ini? Saldo akun akan dikembalikan.')) {
                             onDelete(journal.id);
                           }
                         }}
                         className="p-2 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                         title="Hapus Transaksi"
                       >
                         <Trash2 className="w-4 h-4" />
                       </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

