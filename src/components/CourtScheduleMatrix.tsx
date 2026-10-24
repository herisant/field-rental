import React, { useState } from 'react';
import { COURTS, OPERATING_HOURS } from '../data/courts';
import { useBooking, getTodayString } from '../context/BookingContext';
import { Calendar, Clock, AlertCircle, Check, ArrowRight, Lock, RotateCcw, Sparkles } from 'lucide-react';

interface CourtScheduleMatrixProps {
  onProceedToBooking: () => void;
}

export const CourtScheduleMatrix: React.FC<CourtScheduleMatrixProps> = ({ onProceedToBooking }) => {
  const {
    selectedSport,
    setSelectedSport,
    selectedDate,
    setSelectedDate,
    selectedCourtId,
    setSelectedCourtId,
    selectedSlots,
    toggleSlotSelection,
    isSlotSelected,
    isSlotBooked,
    isSlotHeld,
    getSlotBookingInfo,
    clearSelection,
    holdTimeRemaining
  } = useBooking();

  const [activeViewMode, setActiveViewMode] = useState<'single' | 'all'>('single');

  // Filter courts by sport
  const filteredCourts = COURTS.filter(c => selectedSport === 'all' || c.sport === selectedSport);

  // Active court for single view
  const currentCourt = COURTS.find(c => c.id === selectedCourtId) || filteredCourts[0] || COURTS[0];

  const dateOptions = [
    { label: 'Hari Ini', date: getTodayString(0) },
    { label: 'Besok', date: getTodayString(1) },
    { label: 'Lusa', date: getTodayString(2) },
    { label: '3 Hari Lagi', date: getTodayString(3) },
    { label: '4 Hari Lagi', date: getTodayString(4) },
    { label: '5 Hari Lagi', date: getTodayString(5) },
  ];

  const formatDisplayDate = (dateStr: string) => {
    try {
      const [year, month, day] = dateStr.split('-');
      const d = new Date(Number(year), Number(month) - 1, Number(day));
      return d.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  // Calculate subtotal of selected slots
  const selectedSubtotal = selectedSlots.reduce((acc, s) => acc + s.price, 0);

  return (
    <div className="bg-white rounded-xl border border-neutral-200 shadow-sm overflow-hidden">
      {/* Header Controls */}
      <div className="p-4 sm:p-6 border-b border-neutral-200 bg-neutral-50/50">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-neutral-900">
              Jadwal Ketersediaan Lapangan Real-Time
            </h2>
            <p className="text-xs text-neutral-500 mt-0.5">
              Klik pada slot jam yang masih tersedia untuk mengunci slot selama 10 menit.
            </p>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-neutral-500 font-medium">Tampilan:</span>
            <div className="p-1 bg-neutral-200/80 rounded-lg flex items-center gap-1">
              <button
                onClick={() => setActiveViewMode('single')}
                className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
                  activeViewMode === 'single'
                    ? 'bg-white text-neutral-900 shadow-sm'
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                Fokus Lapangan
              </button>
              <button
                onClick={() => setActiveViewMode('all')}
                className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
                  activeViewMode === 'all'
                    ? 'bg-white text-neutral-900 shadow-sm'
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                Matriks Semua Lapangan
              </button>
            </div>
          </div>
        </div>

        {/* Date Selector Row */}
        <div className="mt-5 flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-neutral-700 flex items-center gap-1 mr-1">
            <Calendar className="w-3.5 h-3.5 text-neutral-500" />
            <span>Tanggal:</span>
          </span>
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
            {dateOptions.map((opt) => (
              <button
                key={opt.date}
                onClick={() => setSelectedDate(opt.date)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${
                  selectedDate === opt.date
                    ? 'bg-neutral-900 text-white shadow-sm'
                    : 'bg-white border border-neutral-200 text-neutral-700 hover:bg-neutral-100'
                }`}
              >
                {opt.label}
              </button>
            ))}
            <input
              type="date"
              value={selectedDate}
              min={getTodayString(0)}
              onChange={(e) => e.target.value && setSelectedDate(e.target.value)}
              className="px-2.5 py-1 text-xs border border-neutral-300 rounded-lg text-neutral-700 bg-white focus:outline-none focus:ring-1 focus:ring-neutral-900"
            />
          </div>
        </div>

        {/* Sport and Court Filter Buttons */}
        <div className="mt-4 pt-3 border-t border-neutral-200 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 overflow-x-auto">
            <span className="text-xs font-semibold text-neutral-700">Pilih Lapangan:</span>
            {filteredCourts.map((court) => (
              <button
                key={court.id}
                onClick={() => setSelectedCourtId(court.id)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap border ${
                  currentCourt.id === court.id
                    ? 'bg-emerald-50 border-emerald-500 text-emerald-800 font-bold'
                    : 'bg-white border-neutral-200 text-neutral-600 hover:border-neutral-300'
                }`}
              >
                {court.code} · {court.name.split(' (')[0]}
              </button>
            ))}
          </div>

          {/* Status Legend */}
          <div className="flex items-center gap-4 text-[11px] text-neutral-600">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-emerald-50 border border-emerald-300" />
              <span>Tersedia</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-emerald-600 text-white flex items-center justify-center text-[9px] font-bold">✓</span>
              <span>Dipilih</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-amber-200 border border-amber-400" />
              <span>Ditahan (Checkout)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-neutral-200 border border-neutral-300" />
              <span>Terisi</span>
            </div>
          </div>
        </div>
      </div>

      {/* Real-time Hold Notice (Shown when user has selected slots) */}
      {selectedSlots.length > 0 && (
        <div className="bg-emerald-900 text-emerald-100 px-4 sm:px-6 py-2.5 flex items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-emerald-300 animate-pulse shrink-0" />
            <span>
              <strong>{selectedSlots.length} slot terpilih</strong> sedang dikunci untuk Anda selama checkout.
            </span>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <span className="font-mono tabular-nums text-sm font-bold bg-emerald-950 px-2.5 py-0.5 rounded border border-emerald-700 text-emerald-300">
              {formatTimer(holdTimeRemaining)}
            </span>
            <button
              onClick={clearSelection}
              className="text-emerald-200 hover:text-white underline text-xs"
            >
              Lepas Pilihan
            </button>
          </div>
        </div>
      )}

      {/* Main Schedule Display */}
      <div className="p-4 sm:p-6">
        {activeViewMode === 'single' ? (
          /* Single Court Detailed Slot Grid */
          <div>
            {/* Court Profile Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-6 border-b border-neutral-100">
              <div>
                <div className="flex items-center gap-2 text-xs text-neutral-500 font-medium">
                  <span className="uppercase tracking-wider font-semibold text-emerald-700">
                    {currentCourt.sport === 'futsal' ? 'Futsal' : 'Badminton'}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span>{currentCourt.surfaceLabel}</span>
                  <span aria-hidden="true">·</span>
                  <span>{formatDisplayDate(selectedDate)}</span>
                </div>
                <h3 className="text-lg font-bold text-neutral-900 mt-1">
                  {currentCourt.name}
                </h3>
              </div>

              <div className="text-left sm:text-right">
                <span className="text-xs text-neutral-500 block">Tarif per Jam</span>
                <span className="text-xs text-neutral-700 font-mono tabular-nums font-semibold">
                  Siang: Rp {currentCourt.basePriceDay.toLocaleString('id-ID')} · Malam (17:00+): Rp {currentCourt.basePriceNight.toLocaleString('id-ID')}
                </span>
              </div>
            </div>

            {/* Time Slot Matrix (Morning / Afternoon / Night Sections) */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {OPERATING_HOURS.map((slot) => {
                const timeStr = `${String(slot.hour).padStart(2, '0')}:00`;
                const price = slot.isPeak ? currentCourt.basePriceNight : currentCourt.basePriceDay;
                const isBooked = isSlotBooked(currentCourt.id, selectedDate, timeStr);
                const isHeld = isSlotHeld(currentCourt.id, selectedDate, timeStr);
                const isSelected = isSlotSelected(currentCourt.id, selectedDate, timeStr);
                const bookingInfo = isBooked ? getSlotBookingInfo(currentCourt.id, selectedDate, timeStr) : undefined;

                return (
                  <button
                    key={timeStr}
                    type="button"
                    disabled={isBooked || isHeld}
                    onClick={() => toggleSlotSelection(currentCourt.id, selectedDate, timeStr, price)}
                    className={`relative p-3.5 rounded-xl border text-left transition-all flex flex-col justify-between min-h-[92px] ${
                      isSelected
                        ? 'bg-emerald-600 border-emerald-700 text-white ring-2 ring-emerald-500 ring-offset-1 shadow-md'
                        : isBooked
                        ? 'bg-neutral-100 border-neutral-200 text-neutral-400 cursor-not-allowed opacity-80'
                        : isHeld
                        ? 'bg-amber-50 border-amber-300 text-amber-800 cursor-not-allowed'
                        : 'bg-white border-neutral-200 hover:border-emerald-500 hover:bg-emerald-50/40 text-neutral-800 shadow-sm'
                    }`}
                  >
                    {/* Top Row: Time & Badge */}
                    <div className="flex items-center justify-between gap-1">
                      <span className={`text-xs font-bold font-mono tabular-nums ${isSelected ? 'text-white' : isBooked ? 'text-neutral-500 line-through' : 'text-neutral-900'}`}>
                        {timeStr}
                      </span>
                      {isSelected && (
                        <span className="w-4 h-4 rounded-full bg-white text-emerald-700 flex items-center justify-center text-[10px] font-extrabold">
                          ✓
                        </span>
                      )}
                      {isBooked && (
                        <Lock className="w-3.5 h-3.5 text-neutral-400" />
                      )}
                      {isHeld && (
                        <span className="text-[10px] font-semibold text-amber-700 bg-amber-100 px-1 py-0.2 rounded font-mono">
                          HOLD
                        </span>
                      )}
                      {!isBooked && !isHeld && !isSelected && slot.isPeak && (
                        <span className="text-[10px] text-neutral-500 font-medium">
                          Peak
                        </span>
                      )}
                    </div>

                    {/* Bottom Row: Status / Price */}
                    <div className="mt-2">
                      {isBooked ? (
                        <div>
                          <span className="text-[10px] text-neutral-500 block truncate font-medium">
                            {bookingInfo?.teamName || bookingInfo?.customerName || 'Terisi'}
                          </span>
                          <span className="text-[9px] text-neutral-400 block font-mono">Sudah Dipesan</span>
                        </div>
                      ) : isHeld ? (
                        <div>
                          <span className="text-[10px] text-amber-800 font-medium block">
                            Sedang Dipesan
                          </span>
                          <span className="text-[9px] text-amber-600 block">Menunggu bayar</span>
                        </div>
                      ) : isSelected ? (
                        <div>
                          <span className="text-xs font-bold font-mono tabular-nums text-white block">
                            Rp {price.toLocaleString('id-ID')}
                          </span>
                          <span className="text-[10px] text-emerald-100 block">Slot Terpilih</span>
                        </div>
                      ) : (
                        <div>
                          <span className="text-xs font-bold font-mono tabular-nums text-neutral-900 block">
                            Rp {price.toLocaleString('id-ID')}
                          </span>
                          <span className="text-[10px] text-emerald-700 font-semibold block">Tersedia</span>
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          /* All Courts Master Matrix Grid */
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-xs">
              <thead>
                <tr className="border-b border-neutral-200 bg-neutral-50">
                  <th className="p-3 font-semibold text-neutral-700 min-w-[120px]">Jam</th>
                  {filteredCourts.map(c => (
                    <th key={c.id} className="p-3 font-semibold text-neutral-900 min-w-[150px]">
                      <div>{c.code}</div>
                      <div className="text-[10px] text-neutral-500 font-normal">{c.name.split(' (')[0]}</div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {OPERATING_HOURS.map((slot) => {
                  const timeStr = `${String(slot.hour).padStart(2, '0')}:00`;
                  return (
                    <tr key={timeStr} className="hover:bg-neutral-50/50 transition-colors">
                      <td className="p-3 font-mono font-bold text-neutral-800 tabular-nums">
                        {slot.label}
                        {slot.isPeak && <span className="block text-[10px] text-amber-700 font-sans font-medium">Jam Ramai</span>}
                      </td>
                      {filteredCourts.map(court => {
                        const price = slot.isPeak ? court.basePriceNight : court.basePriceDay;
                        const isBooked = isSlotBooked(court.id, selectedDate, timeStr);
                        const isHeld = isSlotHeld(court.id, selectedDate, timeStr);
                        const isSelected = isSlotSelected(court.id, selectedDate, timeStr);
                        const bookingInfo = isBooked ? getSlotBookingInfo(court.id, selectedDate, timeStr) : undefined;

                        return (
                          <td key={court.id} className="p-2">
                            <button
                              type="button"
                              disabled={isBooked || isHeld}
                              onClick={() => toggleSlotSelection(court.id, selectedDate, timeStr, price)}
                              className={`w-full py-2 px-2.5 rounded-lg border text-left transition-all ${
                                isSelected
                                  ? 'bg-emerald-600 border-emerald-700 text-white font-semibold shadow'
                                  : isBooked
                                  ? 'bg-neutral-100 border-neutral-200 text-neutral-400 cursor-not-allowed'
                                  : isHeld
                                  ? 'bg-amber-50 border-amber-300 text-amber-800 cursor-not-allowed'
                                  : 'bg-white border-neutral-200 hover:border-emerald-500 hover:bg-emerald-50/50 text-neutral-800'
                              }`}
                            >
                              <div className="flex items-center justify-between text-[11px]">
                                <span className="font-mono tabular-nums font-semibold">
                                  {isBooked ? 'Booked' : isHeld ? 'Hold' : `Rp ${(price / 1000).toFixed(0)}k`}
                                </span>
                                {isSelected && <span>✓</span>}
                              </div>
                              <span className="text-[10px] text-neutral-500 block truncate mt-0.5">
                                {isBooked ? (bookingInfo?.teamName || 'Terisi') : isHeld ? 'Diproses' : 'Kosong'}
                              </span>
                            </button>
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Sticky Bottom Booking Bar when slots selected */}
      {selectedSlots.length > 0 && (
        <div className="border-t border-neutral-200 bg-white p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 sticky bottom-0 z-30 shadow-2xl">
          <div>
            <div className="flex items-center gap-2 text-xs text-neutral-500">
              <span className="font-semibold text-neutral-900">
                {COURTS.find(c => c.id === selectedSlots[0].courtId)?.name}
              </span>
              <span aria-hidden="true">·</span>
              <span>{formatDisplayDate(selectedSlots[0].date)}</span>
            </div>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs font-semibold text-neutral-700">Slot Terpilih:</span>
              <div className="flex items-center gap-1">
                {selectedSlots.map(s => (
                  <span key={s.time} className="text-xs font-mono font-bold bg-neutral-100 text-neutral-800 px-2 py-0.5 rounded border border-neutral-300">
                    {s.time}
                  </span>
                ))}
              </div>
              <span className="text-xs text-neutral-500 font-mono">({selectedSlots.length} Jam)</span>
            </div>
          </div>

          <div className="flex items-center gap-4 justify-between sm:justify-end">
            <div>
              <span className="text-[11px] text-neutral-500 block">Total Biaya Lapangan</span>
              <span className="text-lg font-black text-emerald-700 font-mono tabular-nums">
                Rp {selectedSubtotal.toLocaleString('id-ID')}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={clearSelection}
                className="p-2.5 text-neutral-500 hover:text-neutral-800 hover:bg-neutral-100 rounded-lg transition-colors"
                title="Batalkan Pilihan"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={onProceedToBooking}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow-md transition-colors flex items-center gap-2 whitespace-nowrap"
              >
                <span>Lanjut ke Data Pemesan</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
