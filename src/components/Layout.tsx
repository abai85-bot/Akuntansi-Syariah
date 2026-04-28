import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LayoutDashboard, 
  BookOpen, 
  PlusCircle, 
  FileText, 
  ListTree, 
  Settings,
  ChevronRight,
  Menu,
  X
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface SidebarItemProps {
  icon: React.ElementType;
  label: string;
  active?: boolean;
  onClick: () => void;
  isCollapsed: boolean;
  key?: string;
}

const SidebarItem = ({ icon: Icon, label, active, onClick, isCollapsed }: SidebarItemProps) => (
  <button
    onClick={onClick}
    className={cn(
      "flex items-center w-full p-3 rounded-lg transition-all duration-200 group text-[14px] font-medium mb-1",
      active 
        ? "bg-[#065f46] text-white" 
        : "text-[#a7f3d0] hover:bg-[#065f46]/50"
    )}
  >
    <Icon className={cn("w-5 h-5 transition-colors", active ? "text-white" : "text-[#a7f3d0] group-hover:text-white")} />
    {!isCollapsed && <span className="ml-3 truncate">{label}</span>}
  </button>
);

interface LayoutProps {
  children: React.ReactNode;
  activeView: string;
  setActiveView: (view: string) => void;
}

export const Layout = ({ children, activeView, setActiveView }: LayoutProps) => {
  const [isCollapsed, setIsCollapsed] = React.useState(false);
  const [isMobileOpen, setIsMobileOpen] = React.useState(false);

  const menuItems = [
    { id: 'dashboard', label: 'Ringkasan', icon: LayoutDashboard },
    { id: 'journal', label: 'Jurnal Umum', icon: PlusCircle },
    { id: 'ledger', label: 'Buku Besar', icon: BookOpen },
    { id: 'reports', label: 'Laporan Keuangan', icon: FileText },
    { id: 'coa', label: 'Daftar Akun (COA)', icon: ListTree },
  ];

  return (
    <div className="flex h-screen bg-[#f8fafc] text-[#1e293b] overflow-hidden">
      {/* Sidebar - Desktop */}
      <aside 
        className={cn(
          "hidden md:flex flex-col bg-[#064e3b] text-white transition-all duration-300 ease-in-out z-20 shadow-xl",
          isCollapsed ? "w-20" : "w-[240px]"
        )}
      >
        <div className="p-8 flex flex-col gap-1 mb-4">
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center text-white font-bold text-lg">
                M
             </div>
             {!isCollapsed && (
               <motion.span 
                 initial={{ opacity: 0 }}
                 animate={{ opacity: 1 }}
                 className="font-bold text-xl tracking-tight text-[#f0fdf4]"
               >
                 Al-Mizan
               </motion.span>
             )}
          </div>
          {!isCollapsed && (
             <span className="text-[10px] font-light text-emerald-200/60 uppercase tracking-[0.2em] mt-1 ml-11">
                Akuntansi Syariah
             </span>
          )}
        </div>

        <nav className="flex-1 px-4 space-y-1">
          {menuItems.map((item) => (
            <SidebarItem
              key={item.id}
              icon={item.icon}
              label={item.label}
              active={activeView === item.id}
              onClick={() => setActiveView(item.id)}
              isCollapsed={isCollapsed}
            />
          ))}
        </nav>

        <div className="p-6 mt-auto">
           {!isCollapsed && (
             <div className="text-[10px] text-emerald-300/40 uppercase tracking-widest font-medium mb-6">
                Standard PSAK Syariah v2.1
             </div>
           )}
           <button 
             onClick={() => setIsCollapsed(!isCollapsed)}
             className="flex items-center w-full p-2 text-emerald-200 hover:text-white transition-colors"
           >
             {isCollapsed ? <Menu className="w-5 h-5 mx-auto" /> : <X className="w-5 h-5 ml-auto" />}
           </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full overflow-hidden">
        <header className="h-20 border-b border-slate-200 bg-white/50 backdrop-blur-sm flex items-center justify-between px-8 z-10">
          <div className="md:hidden">
            <button onClick={() => setIsMobileOpen(true)}>
              <Menu className="w-6 h-6 text-slate-600" />
            </button>
          </div>
          
          <div>
            <h2 className="text-[24px] font-semibold text-[#064e3b] tracking-tight capitalize">
               {menuItems.find(m => m.id === activeView)?.label || activeView}
            </h2>
          </div>

          <div className="flex items-center gap-4">
             <div className="bg-white rounded-full px-4 py-2 border border-slate-200 text-[12px] flex items-center gap-2 shadow-sm">
                <span className="text-slate-500">User:</span> 
                <span className="font-semibold text-slate-800">Ahmad Bendahara</span>
                <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                <span className="font-bold text-emerald-700">24 Sya'ban 1445 H</span>
             </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto bg-[#f8fafc]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeView}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
              className="p-8 max-w-7xl mx-auto w-full"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isMobileOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileOpen(false)}
              className="fixed inset-0 bg-black/50 z-40 md:hidden"
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              className="fixed inset-y-0 left-0 w-64 bg-white z-50 p-6 md:hidden"
            >
               <div className="flex items-center justify-between mb-8">
                  <span className="font-bold text-xl">AL-MIZAN</span>
                  <button onClick={() => setIsMobileOpen(false)}>
                    <X className="w-6 h-6" />
                  </button>
               </div>
               <nav className="space-y-4">
                  {menuItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveView(item.id);
                        setIsMobileOpen(false);
                      }}
                      className={cn(
                        "flex items-center gap-3 w-full p-2 rounded-md font-medium",
                        activeView === item.id ? "text-teal-600 bg-teal-50" : "text-slate-600"
                      )}
                    >
                      <item.icon className="w-5 h-5" />
                      {item.label}
                    </button>
                  ))}
               </nav>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};
