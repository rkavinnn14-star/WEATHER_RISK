import { LayoutDashboard, MapIcon, TrendingUp, Bell, Database, CloudRain } from 'lucide-react';
import type { ViewType } from '@/types';

interface SidebarProps {
  currentView: ViewType;
  onNavigate: (view: ViewType) => void;
}

const NAV_ITEMS: { id: ViewType; label: string; icon: typeof LayoutDashboard }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'riskmap', label: 'Risk Map', icon: MapIcon },
  { id: 'forecast', label: 'Forecast', icon: TrendingUp },
  { id: 'alerts', label: 'Alerts', icon: Bell },
  { id: 'datasources', label: 'Data Sources', icon: Database },
];

export function Sidebar({ currentView, onNavigate }: SidebarProps) {
  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-slate-900 border-r border-slate-800 min-h-screen sticky top-0">
        <div className="p-5 border-b border-slate-800">
          <div className="flex items-center gap-2 mb-1">
            <CloudRain className="w-7 h-7 text-cyan-400" />
            <h1 className="text-xl font-bold text-white tracking-tight">VARSHAA</h1>
          </div>
          <p className="text-[11px] text-slate-400 leading-snug">
            Hyperlocal Weather Risk Intelligence & Early Warning System
          </p>
          <p className="text-[10px] text-cyan-400/70 mt-1.5 font-medium">Coimbatore, Tamil Nadu</p>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const active = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                  active
                    ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200 border border-transparent'
                }`}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {item.label}
              </button>
            );
          })}
        </nav>
        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center gap-2 text-[11px] text-slate-500">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            System Operational
          </div>
        </div>
      </aside>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-slate-900 border-t border-slate-800 z-50 flex justify-around py-2 px-1">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const active = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex flex-col items-center gap-1 px-2 py-1.5 rounded-lg transition-colors ${
                active ? 'text-cyan-300' : 'text-slate-500'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </>
  );
}
