import React from 'react';
import { 
  TrendingUp, 
  Wallet, 
  ArrowUpRight, 
  ArrowDownRight,
  PieChart as PieChartIcon,
  CircleDollarSign,
  HeartHandshake
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie
} from 'recharts';
import { Account, DashboardStats } from '../types';

interface DashboardProps {
  stats: DashboardStats;
}

const StatCard = ({ title, value, icon: Icon, color, subtitle }: { 
  title: string, 
  value: string, 
  icon: any, 
  color: string,
  subtitle?: string 
}) => (
  <div className={`p-6 rounded-xl border shadow-sm transition-all hover:shadow-md ${color}`}>
    <div className="flex items-start justify-between">
      <div>
        <p className="text-[11px] font-bold uppercase tracking-wider opacity-70 mb-1">{title}</p>
        <h3 className="text-2xl font-bold font-mono tracking-tight">{value}</h3>
        {subtitle && <p className="text-[10px] opacity-60 mt-1 font-medium italic">{subtitle}</p>}
      </div>
      <div className="p-2 rounded-lg bg-white/20 backdrop-blur-sm">
        <Icon className="w-5 h-5" />
      </div>
    </div>
  </div>
);

export const Dashboard = ({ stats }: DashboardProps) => {
  const chartData = [
    { name: 'Aktiva', value: stats.totalAssets },
    { name: 'Kewajiban', value: stats.totalLiabilities },
    { name: 'Ekuitas', value: stats.totalEquity },
  ];

  const shariaData = [
    { name: 'Zakat', value: stats.zakatFund, color: '#059669' },
    { name: 'Kebajikan', value: stats.qardhulHasanFund, color: '#0d9488' },
  ];

  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Saldo Kas" 
          value={formatCurrency(stats.totalAssets)} 
          icon={Wallet} 
          color="bg-[#ecfdf5] border-[#d1fae5] text-[#064e3b]" 
        />
        <StatCard 
          title="Kewajiban" 
          value={formatCurrency(stats.totalLiabilities)} 
          icon={ArrowDownRight} 
          color="bg-white border-slate-200 text-slate-700" 
        />
        <StatCard 
          title="Laba Bersih" 
          value={formatCurrency(stats.netIncome)} 
          icon={TrendingUp} 
          color="bg-white border-slate-200 text-slate-700" 
          subtitle="Syariah Compliant"
        />
        <StatCard 
          title="Estimasi Zakat" 
          value={formatCurrency(stats.zakatFund)} 
          icon={HeartHandshake} 
          color="bg-[#fefce8] border-[#fef08a] text-[#854d0e]" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-8 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-bold text-[#064e3b] text-lg">Komposisi Neraca</h3>
            <div className="flex gap-4">
               <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                 <div className="w-2 h-2 rounded-full bg-emerald-600"></div> Aktiva
               </div>
               <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                 <div className="w-2 h-2 rounded-full bg-slate-200"></div> Pasiva
               </div>
            </div>
          </div>
          <div className="h-[300px]">
             <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                   <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 'bold' }} dy={10} />
                   <YAxis hide />
                   <Tooltip 
                     cursor={{ fill: '#f8fafc' }} 
                     contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontSize: '12px' }}
                     formatter={(value: any) => [formatCurrency(value), '']}
                   />
                   <Bar dataKey="value" radius={[4, 4, 0, 0]} barSize={40}>
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={index === 0 ? '#059669' : '#e2e8f0'} />
                      ))}
                   </Bar>
                </BarChart>
             </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm flex flex-col">
          <h3 className="font-bold text-[#064e3b] text-lg mb-8 uppercase tracking-tight text-center">Kepatuhan Syariah</h3>
          
          <div className="flex-1 flex flex-col justify-center space-y-6">
             <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <span className="text-sm font-medium text-slate-600">Laporan Halal</span>
                <span className="sharia-badge">Verified</span>
             </div>
             <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <span className="text-sm font-medium text-slate-600">Pemisahan Dana</span>
                <span className="sharia-badge">Compliant</span>
             </div>
             <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <span className="text-sm font-medium text-slate-600">Margin Murabahah</span>
                <span className="sharia-badge">Within Limit</span>
             </div>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between">
             <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Total Dana Sosial</span>
             <span className="text-lg font-mono font-bold text-emerald-700">{formatCurrency(stats.zakatFund + stats.qardhulHasanFund)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
