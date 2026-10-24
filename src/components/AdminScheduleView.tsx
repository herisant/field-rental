import React, { useState } from 'react';
import { useBooking, getTodayString } from '../context/BookingContext';
import { COURTS, OPERATING_HOURS } from '../data/courts';
import { ShieldCheck, Calendar, Lock, Unlock, AlertTriangle, DollarSign, Activity, Users } from 'lucide-react';

export const AdminScheduleView: React.FC = () => {
  const {
    bookedSlots,
    selectedDate,
    setSelectedDate,
    blockSlotAdmin,
    unblockSlotAdmin
  } = useBooking();

  const [selectedCourtFilter, setSelectedCourtFilter] = useState<string>('all');
  const [maintenanceReason, setMaintenanceReason] = useState('Pemeliharaan Rutin / Cuci Karpet');

  const courtsToDisplay = COURTS.filter(c => selectedCourtFilter === 'all' || c.id === selectedCourtFilter);

  // Statistics for selected date
  const slotsToday = bookedSlots.filter(b => b.date === selectedDate);
  const totalVenueSlots = COURTS.length * OPERATING_HOURS.length;
  const occupancyRate = Math.round((slotsToday.length / totalVenueSlots) * 100);

  // Estimated gross revenue
  const estimatedRevenue = slotsToday.reduce((acc, slot) => {
    const court = COURTS.find(c => c.id === slot.courtId);
    if (!court || slot.isMaintenance) return acc;
    const hourNum = parseInt(slot.time.split(':')[0], 10);
    const isPeak = hourNum >= 17;
    return acc + (isPeak ? court.basePriceNight : court.basePriceDay);
  }, 0);

  return (
    <div className="space-y-6">
      {/* Admin Header */}
      <div className="bg-neutral-900 text-white rounded-xl p-6 shadow-sm border border-neutral-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Panel Manajemen Operator & Kasir GeloraHub</span>
            </div>
            <h2 className="text-xl font-bold text-white mt-1">
              Manajemen Ketersediaan & Pemblokiran Slot
            </h2>
            <p className="text-xs text-neutral-400 mt-1">
              Kunci slot untuk turnamen resmi, pembersihan berkala, atau cek rincian pemesan per jam.
            </p>
          </div>

          {/* Quick Date Switcher */}
          <div className="flex items-center gap-3">
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => e.target.value && setSelectedDate(e.target.value)}
              className="px-3 py-1.5 bg-neutral-800 border border-neutral-700 text-white rounded-lg text-xs font-medium focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>

        {/* Operational KPI Strip */}
        <div className="mt-6 pt-5 border-t border-neutral-800 grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
          <div>
            <span className="text-neutral-400 block">Slot Terisi Hari Ini</span>
            <span className="text-lg font-bold font-mono text-white mt-0.5 block tabular-nums">
              {slotsToday.length} / {totalVenueSlots} Slot
            </span>
          </div>

          <div>
            <span className="text-neutral-400 block">Tingkat Okupansi</span>
            <span className="text-lg font-bold font-mono text-emerald-400 mt-0.5 block tabular-nums">
              {occupancyRate}% Terisi
            </span>
          </div>

          <div>
            <span className="text-neutral-400 block">Estimasi Omzet Sewa</span>
            <span className="text-lg font-bold font-mono text-white mt-0.5 block tabular-nums">
              Rp {estimatedRevenue.toLocaleString('id-ID')}
            </span>
          </div>

          <div>
            <span className="text-neutral-400 block">Status Sistem</span>
            <span className="text-sm font-semibold text-emerald-400 mt-1 block">
              Multiplayer Sync Aktif
            </span>
          </div>
        </div>
      </div>

      {/* Filter and Control Bar */}
      <div className="bg-white rounded-xl border border-neutral-200 p-4 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-2 overflow-x-auto">
          <span className="font-semibold text-neutral-700">Filter Lapangan:</span>
          <button
            onClick={() => setSelectedCourtFilter('all')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              selectedCourtFilter === 'all'
                ? 'bg-neutral-900 text-white'
                : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
            }`}
          >
            Semua (5 Lapangan)
          </button>
          {COURTS.map(c => (
            <button
              key={c.id}
              onClick={() => setSelectedCourtFilter(c.id)}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                selectedCourtFilter === c.id
                  ? 'bg-neutral-900 text-white'
                  : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
              }`}
            >
              {c.code}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <span className="font-semibold text-neutral-700">Alasan Blokir:</span>
          <select
            value={maintenanceReason}
            onChange={(e) => setMaintenanceReason(e.target.value)}
            className="px-2.5 py-1.5 border border-neutral-300 rounded-lg text-xs bg-white text-neutral-800"
          >
            <option value="Pemeliharaan Rutin / Cuci Karpet">Pemeliharaan Rutin</option>
            <option value="Turnamen Resmi Venue">Turnamen Resmi</option>
            <option value="Booking Khusus Langsung di Kasir">Booking Manual Kasir</option>
            <option value="Perbaikan Lampu / Fasilitas">Perbaikan Fasilitas</option>
          </select>
        </div>
      </div>

      {/* Admin Matrix Table */}
      <div className="bg-white rounded-xl border border-neutral-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-neutral-200 bg-neutral-50 flex items-center justify-between">
          <h3 className="text-sm font-bold text-neutral-900">
            Jadwal Operasional Tanggal {selectedDate}
          </h3>
          <span className="text-[11px] text-neutral-500">
            Klik tombol gembok untuk mengunci/membuka slot manual
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="border-b border-neutral-200 bg-neutral-50/80">
                <th className="p-3 font-semibold text-neutral-600 min-w-[120px]">Jam</th>
                {courtsToDisplay.map(c => (
                  <th key={c.id} className="p-3 font-semibold text-neutral-900 min-w-[160px]">
                    <div>{c.code} · {c.name.split(' (')[0]}</div>
                    <div className="text-[10px] text-neutral-400 font-normal">{c.surfaceLabel}</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {OPERATING_HOURS.map(slot => {
                const timeStr = `${String(slot.hour).padStart(2, '0')}:00`;
                return (
                  <tr key={timeStr} className="hover:bg-neutral-50/60 transition-colors">
                    <td className="p-3 font-mono font-bold text-neutral-700 tabular-nums">
                      {slot.label}
                    </td>

                    {courtsToDisplay.map(court => {
                      const bookedInfo = bookedSlots.find(
                        b => b.courtId === court.id && b.date === selectedDate && b.time === timeStr
                      );
                      const isBooked = !!bookedInfo;
                      const isMaintenance = bookedInfo?.isMaintenance;

                      return (
                        <td key={court.id} className="p-2">
                          {isBooked ? (
                            <div className={`p-2.5 rounded-lg border flex items-center justify-between gap-2 ${
                              isMaintenance
                                ? 'bg-amber-50 border-amber-200 text-amber-900'
                                : 'bg-neutral-100 border-neutral-300 text-neutral-800'
                            }`}>
                              <div className="overflow-hidden">
                                <span className="font-bold text-[11px] block truncate">
                                  {bookedInfo.customerName}
                                </span>
                                <span className="text-[10px] text-neutral-500 block truncate">
                                  {bookedInfo.teamName || 'Customer Web'}
                                </span>
                              </div>
                              <button
                                onClick={() => unblockSlotAdmin(court.id, selectedDate, timeStr)}
                                className="p-1 text-neutral-500 hover:text-red-700 hover:bg-neutral-200 rounded transition-colors shrink-0"
                                title="Buka Kunci Slot Ini"
                              >
                                <Unlock className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ) : (
                            <div className="p-2 rounded-lg border border-dashed border-neutral-200 hover:border-neutral-300 flex items-center justify-between gap-1 text-neutral-400">
                              <span className="text-[11px] font-medium text-emerald-700">Tersedia</span>
                              <button
                                onClick={() => blockSlotAdmin(court.id, selectedDate, timeStr, maintenanceReason)}
                                className="p-1 text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 rounded transition-colors"
                                title="Kunci Slot untuk Maintenance / Turnamen"
                              >
                                <Lock className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
