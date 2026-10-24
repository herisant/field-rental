import React from 'react';
import { useBooking, getTodayString } from '../context/BookingContext';
import { Calendar, CheckCircle2, Zap, Trophy, Clock } from 'lucide-react';
import { SportType } from '../types';

interface HeroProps {
  onQuickBookClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onQuickBookClick }) => {
  const { selectedSport, setSelectedSport, selectedDate, setSelectedDate } = useBooking();

  const dateOptions = [
    { label: 'Hari Ini', date: getTodayString(0) },
    { label: 'Besok', date: getTodayString(1) },
    { label: 'Lusa', date: getTodayString(2) },
    { label: '3 Hari Lagi', date: getTodayString(3) },
    { label: '4 Hari Lagi', date: getTodayString(4) },
  ];

  const formatDisplayDate = (dateStr: string) => {
    try {
      const [year, month, day] = dateStr.split('-');
      const d = new Date(Number(year), Number(month) - 1, Number(day));
      return d.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'short' });
    } catch {
      return dateStr;
    }
  };

  return (
    <section className="relative bg-neutral-900 text-white overflow-hidden border-b border-neutral-800">
      {/* Background with measured scrim */}
      <div className="absolute inset-0">
        <img
          src="/src/assets/images/hero_arena_sports_1792833965380.jpg"
          alt="Arena Olahraga Futsal dan Badminton GeloraHub"
          className="w-full h-full object-cover object-center opacity-30"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-900/80 to-transparent" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-20">
        <div className="max-w-3xl">
          {/* Natural human editorial kicker */}
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 mb-3 tracking-wide uppercase">
            <Zap className="w-3.5 h-3.5 text-emerald-400" />
            <span>Sistem Booking Olahraga Terintegrasi</span>
            <span aria-hidden="true">·</span>
            <span>Konfirmasi Slot Seketika</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-[1.15]" style={{ textWrap: 'balance' }}>
            Sewa Lapangan Futsal & Badminton, Kunci Slot Secara Real-Time.
          </h1>

          <p className="mt-4 text-base sm:text-lg text-neutral-300 leading-relaxed max-w-2xl">
            Lantai Vinyl Interlock FIFA, Rumput Sintetis halus, dan Karpet BWF resmi. Cek jadwal kosong detik ini juga tanpa perlu chat WhatsApp admin manual.
          </p>

          {/* Interactive filter & booking control bar */}
          <div className="mt-8 p-4 sm:p-5 bg-neutral-800/90 border border-neutral-700 rounded-xl shadow-xl backdrop-blur">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
              {/* Sport Selector */}
              <div className="md:col-span-5">
                <label className="block text-xs font-medium text-neutral-400 mb-1.5">
                  Pilih Cabang Olahraga
                </label>
                <div className="grid grid-cols-3 gap-1.5 p-1 bg-neutral-900 rounded-lg border border-neutral-700/60">
                  <button
                    onClick={() => setSelectedSport('all')}
                    className={`py-2 px-2 text-xs font-semibold rounded-md transition-colors whitespace-nowrap ${
                      selectedSport === 'all'
                        ? 'bg-emerald-600 text-white shadow'
                        : 'text-neutral-300 hover:text-white'
                    }`}
                  >
                    Semua
                  </button>
                  <button
                    onClick={() => setSelectedSport('futsal')}
                    className={`py-2 px-2 text-xs font-semibold rounded-md transition-colors whitespace-nowrap ${
                      selectedSport === 'futsal'
                        ? 'bg-emerald-600 text-white shadow'
                        : 'text-neutral-300 hover:text-white'
                    }`}
                  >
                    Futsal
                  </button>
                  <button
                    onClick={() => setSelectedSport('badminton')}
                    className={`py-2 px-2 text-xs font-semibold rounded-md transition-colors whitespace-nowrap ${
                      selectedSport === 'badminton'
                        ? 'bg-emerald-600 text-white shadow'
                        : 'text-neutral-300 hover:text-white'
                    }`}
                  >
                    Badminton
                  </button>
                </div>
              </div>

              {/* Date Quick Selector */}
              <div className="md:col-span-4">
                <label className="block text-xs font-medium text-neutral-400 mb-1.5">
                  Tanggal Main ({formatDisplayDate(selectedDate)})
                </label>
                <div className="relative">
                  <input
                    type="date"
                    value={selectedDate}
                    min={getTodayString(0)}
                    onChange={(e) => e.target.value && setSelectedDate(e.target.value)}
                    className="w-full bg-neutral-900 border border-neutral-700 text-white rounded-lg px-3 py-2 text-xs font-medium focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* CTA Action */}
              <div className="md:col-span-3 flex items-end">
                <button
                  onClick={onQuickBookClick}
                  className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/30 whitespace-nowrap"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Lihat Jadwal Slot</span>
                </button>
              </div>
            </div>

            {/* Quick date pills / tabs */}
            <div className="mt-3 pt-3 border-t border-neutral-700/60 flex items-center gap-2 overflow-x-auto text-xs">
              <span className="text-neutral-400 text-[11px] whitespace-nowrap shrink-0">Tanggal Cepat:</span>
              <div className="flex items-center gap-1.5">
                {dateOptions.map((opt) => (
                  <button
                    key={opt.date}
                    onClick={() => setSelectedDate(opt.date)}
                    className={`px-2.5 py-1 rounded text-xs transition-colors whitespace-nowrap ${
                      selectedDate === opt.date
                        ? 'bg-white text-neutral-900 font-semibold shadow-sm'
                        : 'text-neutral-300 hover:bg-neutral-700/60'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 4-column KPI strip adhering to spatial math */}
        <div className="mt-12 pt-8 border-t border-neutral-800 grid grid-cols-2 md:grid-cols-4 gap-6">
          <div>
            <div className="flex items-center gap-2 text-neutral-400 text-xs">
              <Trophy className="w-4 h-4 text-emerald-400" />
              <span>Standar Arena</span>
            </div>
            <p className="mt-1 text-lg font-bold text-white">5 Lapangan Resmi</p>
            <p className="text-xs text-neutral-400 mt-0.5">Vinyl FIFA & BWF Grade A</p>
          </div>

          <div>
            <div className="flex items-center gap-2 text-neutral-400 text-xs">
              <Clock className="w-4 h-4 text-emerald-400" />
              <span>Jam Operasional</span>
            </div>
            <p className="mt-1 text-lg font-bold text-white font-mono tabular-nums">07:00 - 24:00</p>
            <p className="text-xs text-neutral-400 mt-0.5">Buka 7 hari setiap minggu</p>
          </div>

          <div>
            <div className="flex items-center gap-2 text-neutral-400 text-xs">
              <Zap className="w-4 h-4 text-emerald-400" />
              <span>Sistem Real-Time</span>
            </div>
            <p className="mt-1 text-lg font-bold text-white">Auto Lock 10 Menit</p>
            <p className="text-xs text-neutral-400 mt-0.5">Bebas bentrok jadwal ganda</p>
          </div>

          <div>
            <div className="flex items-center gap-2 text-neutral-400 text-xs">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Fasilitas Lengkap</span>
            </div>
            <p className="mt-1 text-lg font-bold text-white">Shower & Parkir Luas</p>
            <p className="text-xs text-neutral-400 mt-0.5">Kantin, Musholla & Locker</p>
          </div>
        </div>
      </div>
    </section>
  );
};
