import React from 'react';
import { Court } from '../types';
import { useBooking } from '../context/BookingContext';
import { OPERATING_HOURS } from '../data/courts';
import { Calendar, CheckCircle, ArrowRight, ShieldCheck } from 'lucide-react';

interface CourtCardProps {
  court: Court;
  onSelectCourt: (courtId: string) => void;
}

export const CourtCard: React.FC<CourtCardProps> = ({ court, onSelectCourt }) => {
  const { selectedDate, isSlotBooked, isSlotHeld } = useBooking();

  // Calculate availability for this court on selected date
  const totalSlots = OPERATING_HOURS.length;
  const bookedCount = OPERATING_HOURS.filter(h => {
    const time = `${String(h.hour).padStart(2, '0')}:00`;
    return isSlotBooked(court.id, selectedDate, time) || isSlotHeld(court.id, selectedDate, time);
  }).length;
  const availableCount = totalSlots - bookedCount;

  return (
    <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col h-full">
      {/* Court Photo with resilient fallback */}
      <div className="relative aspect-[4/3] bg-neutral-100 overflow-hidden group">
        <img
          src={court.image}
          alt={court.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          referrerPolicy="no-referrer"
          onError={(e) => {
            // Stylized CSS fallback
            (e.target as HTMLImageElement).style.display = 'none';
          }}
        />
        {/* Subtle overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-900/60 via-transparent to-transparent opacity-80" />

        {/* Real-time slot availability badge */}
        <div className="absolute top-3 right-3 bg-neutral-900/90 backdrop-blur text-white text-[11px] font-medium px-2.5 py-1 rounded-md border border-neutral-700/60 shadow">
          <span className="font-mono tabular-nums text-emerald-400 font-bold">{availableCount}</span>
          <span className="text-neutral-300"> / {totalSlots} Slot Kosong</span>
        </div>

        {/* Surface tag (unboxed bottom text) */}
        <div className="absolute bottom-3 left-3 text-white text-xs font-medium drop-shadow">
          <span>{court.surfaceLabel}</span>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Metadata clean unboxed text */}
          <div className="flex items-center gap-2 text-xs text-neutral-500 font-medium">
            <span className="uppercase tracking-wider font-semibold text-emerald-700">
              {court.sport === 'futsal' ? 'Futsal Arena' : 'Badminton Hall'}
            </span>
            <span aria-hidden="true">·</span>
            <span>{court.dimensions}</span>
            <span aria-hidden="true">·</span>
            <span>{court.capacity}</span>
          </div>

          <h3 className="mt-2 text-base font-bold text-neutral-900">
            {court.name}
          </h3>

          <p className="mt-2 text-xs text-neutral-600 line-clamp-2 leading-relaxed">
            {court.description}
          </p>

          {/* Key Features */}
          <div className="mt-4 pt-3 border-t border-neutral-100 space-y-1.5">
            {court.features.slice(0, 2).map((feat, idx) => (
              <div key={idx} className="flex items-start gap-2 text-xs text-neutral-700">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                <span className="line-clamp-1">{feat}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Pricing and Action */}
        <div className="mt-5 pt-4 border-t border-neutral-100 flex items-center justify-between gap-3">
          <div>
            <span className="text-[11px] text-neutral-500 block">Tarif Mulai Dari</span>
            <div className="flex items-baseline gap-1">
              <span className="text-base font-extrabold text-neutral-900 font-mono tabular-nums">
                Rp {court.basePriceDay.toLocaleString('id-ID')}
              </span>
              <span className="text-xs text-neutral-500">/ jam</span>
            </div>
            <span className="text-[10px] text-neutral-400 block font-mono tabular-nums">
              Malam: Rp {court.basePriceNight.toLocaleString('id-ID')}
            </span>
          </div>

          <button
            onClick={() => onSelectCourt(court.id)}
            className="px-3.5 py-2 text-xs font-semibold text-white bg-neutral-900 hover:bg-neutral-800 rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap shadow-sm"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Pilih Jam</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
