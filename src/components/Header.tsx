import React from 'react';
import { 
  Sprout, 
  Home, 
  LayoutDashboard, 
  Award, 
  ShieldCheck, 
  FileText, 
  ClipboardCheck, 
  UserCheck, 
  Layers 
} from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  userRole: string;
  setUserRole: (role: string) => void;
  draftCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  userRole,
  setUserRole,
  draftCount,
}) => {
  const navItems = [
    { id: 'portal', label: '多功能主頁', icon: Home },
    { id: 'grading', label: '供應商資料查詢', icon: Award },
    { id: 'field', label: '重點品項回報', icon: ClipboardCheck },
    { id: 'forms', label: '行政表單', icon: FileText, badge: draftCount },
    { id: 'risk', label: '資料查詢 (五維度)', icon: ShieldCheck },
    { id: 'meeting', label: '會議資料', icon: Layers },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Brand */}
          <div 
            onClick={() => setActiveTab('portal')}
            className="flex items-center gap-2.5 shrink-0 cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-lg bg-emerald-700 flex items-center justify-center text-white shadow-xs group-hover:bg-emerald-800 transition-colors">
              <Sprout className="w-4 h-4" />
            </div>
            <div>
              <span className="text-base font-extrabold tracking-tight text-slate-900 whitespace-nowrap block">
                多功能webapp介面
              </span>
              <span className="text-[10px] text-slate-400 font-mono hidden sm:block">
                AgriChain 農產供應鏈
              </span>
            </div>
          </div>

          {/* Clean Navigation Links matching user layout */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap transition-colors ${
                    isActive
                      ? 'bg-amber-100 text-slate-900 border border-amber-300'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-amber-800' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className="ml-0.5 px-1.5 py-0.2 text-[10px] font-mono font-bold rounded-full bg-amber-200 text-amber-900">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* User Role */}
          <div className="flex items-center gap-2 shrink-0">
            <div className="flex items-center gap-1.5 text-xs text-slate-700 bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-200">
              <UserCheck className="w-3.5 h-3.5 text-emerald-700" />
              <select
                aria-label="切換使用者角色"
                value={userRole}
                onChange={(e) => setUserRole(e.target.value)}
                className="bg-transparent text-xs font-medium text-slate-700 focus:outline-hidden cursor-pointer"
              >
                <option value="林志明 (產銷專員)">專員：林志明</option>
                <option value="陳建國 (採購主管)">主管：陳建國</option>
                <option value="張美琪 (食安稽核)">稽核：張美琪</option>
              </select>
            </div>
          </div>

        </div>

        {/* Mobile Navigation Row */}
        <div className="lg:hidden flex items-center justify-between border-t border-slate-100 py-2 overflow-x-auto gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-1 py-1 px-2 text-xs font-medium whitespace-nowrap rounded ${
                  isActive ? 'text-slate-900 font-bold bg-amber-100' : 'text-slate-600'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
