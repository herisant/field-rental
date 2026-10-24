import React from 'react';
import { Booking } from '../types';
import { COURTS } from '../data/courts';
import { X, CheckCircle, Share2, Printer, MapPin, KeyRound, Clock, ShieldCheck } from 'lucide-react';

interface TicketModalProps {
  booking: Booking | null;
  onClose: () => void;
}

export const TicketModal: React.FC<TicketModalProps> = ({ booking, onClose }) => {
  if (!booking) return null;

  const court = COURTS.find(c => c.id === booking.courtId);

  const formatDisplayDate = (dateStr: string) => {
    try {
      const [year, month, day] = dateStr.split('-');
      const d = new Date(Number(year), Number(month) - 1, Number(day));
      return d.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  const shareToWhatsApp = () => {
    const text = encodeURIComponent(
      `*TIKET BOOKING LAPANGAN GELORAHUB*\n\n` +
      `Kode Booking: *${booking.bookingCode}*\n` +
      `Lapangan: *${court?.name || 'Lapangan'}*\n` +
      `Tanggal: *${formatDisplayDate(booking.date)}*\n` +
      `Jam Main: *${booking.timeSlots.join(', ')}* (${booking.totalHours} Jam)\n` +
      `PIN Akses Pintu Gate: *${booking.pinCode}*\n` +
      `Pemesan: *${booking.customerName}* ${booking.teamName ? `(${booking.teamName})` : ''}\n` +
      `Total: Rp ${booking.totalAmount.toLocaleString('id-ID')} (${booking.paymentStatus === 'paid' ? 'LUNAS' : 'DP'})\n\n` +
      `📍 *Lokasi Venue*: GeloraHub Arena Sport Center, Jl. Olahraga Utama No. 88\n` +
      `_Tunjukkan QR Code ini ke petugas atau masukkan 6 digit PIN di gerbang masuk lapangan._`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-neutral-200 overflow-hidden my-8">
        {/* Pass Header */}
        <div className="bg-emerald-700 text-white p-5 text-center relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 text-emerald-200 hover:text-white rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-800/80 rounded-full text-emerald-200 text-xs font-semibold mb-2">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-300" />
            <span>Pemesanan Berhasil & Terkonfirmasi</span>
          </div>

          <h3 className="text-xl font-black tracking-tight text-white">
            E-Tiket Resmi GeloraHub
          </h3>
          <p className="text-xs text-emerald-100 font-mono mt-0.5">
            Kode: {booking.bookingCode}
          </p>
        </div>

        {/* Printable Ticket Area */}
        <div className="p-6 space-y-5" id="printable-ticket">
          {/* Court & Time Section */}
          <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-200 text-center">
            <span className="text-xs font-semibold text-emerald-700 uppercase tracking-wider block">
              {court?.sport === 'futsal' ? 'FUTSAL ARENA' : 'BADMINTON ARENA'}
            </span>
            <h4 className="text-lg font-extrabold text-neutral-900 mt-0.5">
              {court?.name}
            </h4>
            <div className="mt-2 flex items-center justify-center gap-2 text-xs text-neutral-600 font-medium">
              <span>{formatDisplayDate(booking.date)}</span>
              <span aria-hidden="true">·</span>
              <span className="font-mono font-bold text-neutral-900">{booking.timeSlots.join(', ')}</span>
            </div>
          </div>

          {/* Gate Access PIN & QR Code */}
          <div className="grid grid-cols-2 gap-4 items-center p-4 bg-neutral-900 text-white rounded-xl">
            {/* Left: PIN Code */}
            <div className="text-center border-r border-neutral-700 pr-3">
              <div className="flex items-center justify-center gap-1 text-xs text-neutral-400 font-medium">
                <KeyRound className="w-3.5 h-3.5 text-emerald-400" />
                <span>PIN Pintu Gate</span>
              </div>
              <div className="mt-1 text-2xl font-black font-mono tracking-widest text-emerald-400">
                {booking.pinCode}
              </div>
              <span className="text-[10px] text-neutral-400 block mt-1">
                Ketik PIN ini pada keypad gerbang lapangan
              </span>
            </div>

            {/* Right: QR Code */}
            <div className="flex flex-col items-center">
              <div className="bg-white p-2 rounded-lg shadow">
                <svg viewBox="0 0 100 100" className="w-20 h-20 text-neutral-900 fill-current">
                  <rect x="0" y="0" width="30" height="30" />
                  <rect x="5" y="5" width="20" height="20" fill="white" />
                  <rect x="9" y="9" width="12" height="12" />

                  <rect x="70" y="0" width="30" height="30" />
                  <rect x="75" y="5" width="20" height="20" fill="white" />
                  <rect x="79" y="9" width="12" height="12" />

                  <rect x="0" y="70" width="30" height="30" />
                  <rect x="5" y="75" width="20" height="20" fill="white" />
                  <rect x="9" y="79" width="12" height="12" />

                  <rect x="36" y="8" width="6" height="24" />
                  <rect x="48" y="14" width="12" height="6" />
                  <rect x="12" y="40" width="20" height="8" />
                  <rect x="42" y="38" width="18" height="18" />
                  <rect x="68" y="44" width="24" height="6" />
                  <rect x="38" y="66" width="10" height="24" />
                  <rect x="58" y="74" width="32" height="10" />
                </svg>
              </div>
              <span className="text-[10px] text-neutral-400 mt-1">Scan di Turnstile</span>
            </div>
          </div>

          {/* Booking Details Breakdown */}
          <div className="text-xs space-y-2 divide-y divide-neutral-100">
            <div className="flex justify-between py-1.5 text-neutral-600">
              <span>Nama Pemesan</span>
              <span className="font-semibold text-neutral-900">{booking.customerName}</span>
            </div>
            {booking.teamName && (
              <div className="flex justify-between py-1.5 text-neutral-600">
                <span>Nama Tim / Komunitas</span>
                <span className="font-semibold text-neutral-900">{booking.teamName}</span>
              </div>
            )}
            <div className="flex justify-between py-1.5 text-neutral-600">
              <span>Nomor WhatsApp</span>
              <span className="font-mono text-neutral-900">{booking.customerPhone}</span>
            </div>
            <div className="flex justify-between py-1.5 text-neutral-600">
              <span>Metode Pembayaran</span>
              <span className="font-semibold text-neutral-900">{booking.paymentMethod}</span>
            </div>
            {booking.addons && booking.addons.length > 0 && (
              <div className="py-1.5 text-neutral-600">
                <span className="block mb-1">Peralatan Tambahan:</span>
                <div className="space-y-1">
                  {booking.addons.map(addon => (
                    <div key={addon.addonId} className="flex justify-between text-neutral-800 text-[11px]">
                      <span>{addon.quantity}x {addon.name}</span>
                      <span className="font-mono font-medium">Rp {(addon.price * addon.quantity).toLocaleString('id-ID')}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <div className="flex justify-between py-2 text-sm font-bold text-neutral-900">
              <span>Total Biaya</span>
              <span className="font-mono text-emerald-700">Rp {booking.totalAmount.toLocaleString('id-ID')}</span>
            </div>
          </div>

          {/* Venue Location Notice */}
          <div className="p-3 bg-neutral-100 rounded-lg text-[11px] text-neutral-600 flex items-start gap-2">
            <MapPin className="w-4 h-4 text-neutral-500 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-neutral-900 block">GeloraHub Sports Arena</span>
              <span>Jl. Stadion Olahraga No. 88, Jakarta Selatan (Parkir Luas, Musholla & Kantin 24 Jam)</span>
            </div>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="p-4 bg-neutral-50 border-t border-neutral-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            type="button"
            onClick={shareToWhatsApp}
            className="w-full sm:w-auto px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Bagikan ke WA Tim</span>
          </button>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={handlePrint}
              className="flex-1 sm:flex-initial px-3.5 py-2 border border-neutral-300 text-neutral-700 hover:bg-neutral-100 text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Cetak / PDF</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 sm:flex-initial px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold rounded-lg transition-colors"
            >
              Selesai
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
