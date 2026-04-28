import { Account } from './types';

export const INITIAL_ACCOUNTS: Account[] = [
  // Assets
  { id: '101', code: '1110', name: 'Kas', type: 'Asset', category: 'Cash & Bank', balance: 50000000 },
  { id: '102', code: '1120', name: 'Bank Syariah', type: 'Asset', category: 'Cash & Bank', balance: 250000000 },
  { id: '103', code: '1210', name: 'Piutang Murabahah', type: 'Asset', category: 'Receivables', balance: 120000000 },
  { id: '104', code: '1220', name: 'Piutang Istishna', type: 'Asset', category: 'Receivables', balance: 0 },
  { id: '105', code: '1310', name: 'Persediaan Barang (Murabahah)', type: 'Asset', category: 'Inventory', balance: 45000000 },
  { id: '106', code: '1410', name: 'Investasi Mudharabah', type: 'Asset', category: 'Investment', balance: 100000000 },
  { id: '107', code: '1420', name: 'Investasi Musyarakah', type: 'Asset', category: 'Investment', balance: 75000000 },

  // Liabilities
  { id: '201', code: '2110', name: 'Hutang Dagang', type: 'Liability', category: 'Current Liability', balance: 30000000 },
  { id: '202', code: '2120', name: 'Titipan Amanah (Wadiah)', type: 'Liability', category: 'Current Liability', balance: 15000000 },
  { id: '203', code: '2210', name: 'Dana Syirkah Temporer', type: 'Liability', category: 'Long-term Liability', balance: 200000000 },

  // Equity
  { id: '301', code: '3110', name: 'Modal Disetor', type: 'Equity', category: 'Equity', balance: 500000000 },
  { id: '302', code: '3210', name: 'Laba Ditahan', type: 'Equity', category: 'Equity', balance: 45000000 },

  // Special Sharia Funds (Restricted)
  { id: '401', code: '4110', name: 'Dana Zakat', type: 'Liability', category: 'Social Fund', balance: 5000000 },
  { id: '402', code: '4120', name: 'Dana Infak/Sedekah', type: 'Liability', category: 'Social Fund', balance: 2500000 },
  { id: '403', code: '4210', name: 'Dana Kebajikan (Qardh)', type: 'Liability', category: 'Social Fund', balance: 1000000 },

  // Income
  { id: '501', code: '5110', name: 'Pendapatan Margin Murabahah', type: 'Income', category: 'Operating Income', balance: 0 },
  { id: '502', code: '5120', name: 'Bagi Hasil Mudharabah', type: 'Income', category: 'Operating Income', balance: 0 },

  // Expense
  { id: '601', code: '6110', name: 'Beban Gaji', type: 'Expense', category: 'Operating Expense', balance: 0 },
  { id: '602', code: '6120', name: 'Beban Sewa (Ijarah)', type: 'Expense', category: 'Operating Expense', balance: 0 },
  { id: '603', code: '6210', name: 'Beban Penyaluran Zakat', type: 'Expense', category: 'Social Expense', balance: 0 },
];
