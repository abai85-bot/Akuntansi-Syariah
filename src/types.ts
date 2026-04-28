export interface Account {
  id: string;
  code: string;
  name: string;
  type: 'Asset' | 'Liability' | 'Equity' | 'Income' | 'Expense';
  category: string;
  balance: number;
}

export interface JournalEntry {
  id: string;
  date: string;
  description: string;
  reference?: string;
  items: JournalItem[];
}

export interface JournalItem {
  accountId: string;
  debit: number;
  credit: number;
}

export interface DashboardStats {
  totalAssets: number;
  totalLiabilities: number;
  totalEquity: number;
  netIncome: number;
  zakatFund: number;
  qardhulHasanFund: number;
}
