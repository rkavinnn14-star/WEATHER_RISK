import { Bell, AlertTriangle, ShieldAlert, CheckCircle } from 'lucide-react';
import type { Alert } from '@/types';
import { ALERT_LEVEL_COLORS } from '@/lib/alertEngine';

interface AlertsProps {
  alerts: Alert[];
}

export function Alerts({ alerts }: AlertsProps) {
  if (alerts.length === 0) {
    return (
      <div className="rounded-xl bg-slate-800/30 border border-slate-700/50 p-8 text-center">
        <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
        <h2 className="text-lg font-semibold text-white mb-1">No Active Alerts</h2>
        <p className="text-slate-400 text-sm">
          Current weather conditions do not trigger any high-priority alerts.
          Alerts are generated automatically when risk thresholds are reached.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Bell className="w-5 h-5 text-red-400" />
        <h2 className="text-lg font-semibold text-white">Active Alerts</h2>
        <span className="px-2 py-0.5 rounded-full bg-red-500/20 text-red-300 text-xs font-semibold">
          {alerts.length}
        </span>
      </div>

      <div className="space-y-3">
        {alerts.map((alert) => {
          const Icon = alert.level === 'CRITICAL' ? ShieldAlert : AlertTriangle;
          return (
            <div key={alert.id} className={`rounded-xl border p-4 ${ALERT_LEVEL_COLORS[alert.level]}`}>
              <div className="flex items-start gap-3">
                <Icon className="w-5 h-5 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="text-xs font-bold uppercase tracking-wide">{alert.level}</span>
                    <span className="px-2 py-0.5 rounded bg-slate-700/50 text-xs text-slate-200 font-medium">
                      {alert.hazardType}
                    </span>
                    <span className="text-xs text-slate-400">{alert.gridId}</span>
                  </div>
                  <p className="text-sm text-slate-200 leading-relaxed">{alert.reason}</p>
                  <p className="text-[11px] text-slate-500 mt-2">
                    {new Date(alert.timestamp).toLocaleString('en-IN')}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
