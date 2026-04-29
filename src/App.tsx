/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { Layout } from './components/Layout';
import { Dashboard } from './views/Dashboard';
import { ChartOfAccounts } from './views/ChartOfAccounts';
import { JournalEntry } from './views/JournalEntry';
import { Reports } from './views/Reports';
import { Ledger } from './views/Ledger';
import { INITIAL_ACCOUNTS } from './constants';
import { Account, JournalEntry as JournalEntryType, DashboardStats } from './types';

export default function App() {
  const [activeView, setActiveView] = useState('dashboard');
  const [accounts, setAccounts] = useState<Account[]>(INITIAL_ACCOUNTS);
  const [journals, setJournals] = useState<JournalEntryType[]>([]);

  // Calculate stats based on current accounts
  const stats: DashboardStats = useMemo(() => {
    const totalAssets = accounts
      .filter(a => a.type === 'Asset')
      .reduce((sum, a) => sum + a.balance, 0);
      
    const totalLiabilities = accounts
      .filter(a => a.type === 'Liability')
      .reduce((sum, a) => sum + a.balance, 0);
      
    const totalEquity = accounts
      .filter(a => a.type === 'Equity')
      .reduce((sum, a) => sum + a.balance, 0);

    const netIncome = accounts
      .filter(a => a.type === 'Income')
      .reduce((sum, a) => sum + a.balance, 0) - 
      accounts
      .filter(a => a.type === 'Expense')
      .reduce((sum, a) => sum + a.balance, 0);

    const zakatFund = accounts.find(a => a.code === '4110')?.balance || 0;
    const qardhulHasanFund = accounts.find(a => a.code === '4210')?.balance || 0;

    return {
      totalAssets,
      totalLiabilities,
      totalEquity,
      netIncome,
      zakatFund,
      qardhulHasanFund
    };
  }, [accounts]);

  const handleSaveJournal = (entryData: Partial<JournalEntryType>) => {
    const newEntry: JournalEntryType = {
      id: Math.random().toString(36).substr(2, 9),
      date: entryData.date || new Date().toISOString(),
      description: entryData.description || '',
      reference: entryData.reference,
      items: entryData.items || []
    };

    setJournals([...journals, newEntry]);

    // Update account balances
    const newAccounts = accounts.map(acc => {
      const item = newEntry.items.find(i => i.accountId === acc.id);
      if (!item) return acc;

      let balanceChange = 0;
      // Asset and Expense increase with Debit, decrease with Credit
      if (acc.type === 'Asset' || acc.type === 'Expense') {
        balanceChange = item.debit - item.credit;
      } 
      // Liability, Equity, and Income increase with Credit, decrease with Debit
      else {
        balanceChange = item.credit - item.debit;
      }

      return {
        ...acc,
        balance: acc.balance + balanceChange
      };
    });

    setAccounts(newAccounts);
    setActiveView('dashboard');
  };

  const handleDeleteJournal = (id: string) => {
    const journalToDelete = journals.find(j => j.id === id);
    if (!journalToDelete) return;

    // Reverse account balances
    const newAccounts = accounts.map(acc => {
      const item = journalToDelete.items.find(i => i.accountId === acc.id);
      if (!item) return acc;

      let balanceChange = 0;
      if (acc.type === 'Asset' || acc.type === 'Expense') {
        // Reverse increase (Debit) and decrease (Credit)
        balanceChange = item.credit - item.debit;
      } else {
        // Reverse increase (Credit) and decrease (Debit)
        balanceChange = item.debit - item.credit;
      }

      return {
        ...acc,
        balance: acc.balance + balanceChange
      };
    });

    setJournals(journals.filter(j => j.id !== id));
    setAccounts(newAccounts);
  };

  const renderView = () => {
    switch (activeView) {
      case 'dashboard':
        return <Dashboard stats={stats} />;
      case 'coa':
        return <ChartOfAccounts accounts={accounts} />;
      case 'journal':
        return (
          <JournalEntry 
            accounts={accounts} 
            onSave={handleSaveJournal} 
            journals={journals}
            onDelete={handleDeleteJournal}
          />
        );
      case 'reports':
        return <Reports accounts={accounts} stats={stats} />;
      case 'ledger':
        return <Ledger accounts={accounts} journals={journals} />;
      default:
        return <Dashboard stats={stats} />;
    }
  };

  return (
    <Layout activeView={activeView} setActiveView={setActiveView}>
      {renderView()}
    </Layout>
  );
}
