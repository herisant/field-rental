import React from 'react';
import { useBooking } from '../context/BookingContext';
import { Activity } from 'lucide-react';

export const LiveActivityTicker: React.FC = () => {
  const { activities } = useBooking();
  const latest = activities[0];

  if (!latest) return null;

  return (
    <div className="bg-neutral-900 text-neutral-300 text-xs py-2 px-4 border-b border-neutral-800">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-2.5 overflow-hidden">
          <Activity className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <span className="text-neutral-400 font-medium shrink-0">Live Update:</span>
          <p className="truncate text-neutral-200">
            {latest.message}
          </p>
        </div>
        <div className="hidden sm:flex items-center gap-3 shrink-0 text-neutral-400">
          <span className="font-mono text-[11px]">{latest.timestamp}</span>
          <span aria-hidden="true" className="text-neutral-600">·</span>
          <span className="text-emerald-400 font-medium">Sinkronisasi Multi-Tab Real-time</span>
        </div>
      </div>
    </div>
  );
};
