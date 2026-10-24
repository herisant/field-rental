import React, { useState } from 'react';
import { useBooking } from '../context/BookingContext';
import { COURTS } from '../data/courts';
import { Ticket, Calendar, Clock, MapPin, KeyRound, QrCode, Share2, Trash2 } from 'lucide-react';
import { Booking } from '../types';

interface UserTicketsViewProps {
  onOpenTicket: (booking: Booking) => void;
  onExploreClick: () => void;
}

export const UserTicketsView: React.FC<UserTicketsViewProps> = ({ onOpenTicket, onExploreClick }) => {
  const { userBookings, cancelBooking } = useBooking();
  const [cancelTargetId, setCancelTargetId] = useState<string | null>(null);

  const formatDisplayDate = (dateStr: string) => {
    try {
      const [year, month, day] = dateStr.split('-');
      const d = new Date(Number(year), Number(month) - 1, Number(day));
      return d.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  const handleCancel = (id: string) => {
    cancelBooking(id);
    setCancelTargetId(null);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-neutral-200 p-6 shadow-sm">
        <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 uppercase tracking-wider">
          <Ticket className="w-4 h-4 text-emerald-600" />
          <span>E-Tiket & Riwayat Pemesanan</span>
        </div>
        <h2 className="text-xl font-bold text-neutral-900 mt-1">
          Daftar Booking Lapangan Saya
        </h2>
        <p className="text-xs text-neutral-500 mt-1">
          Tunjukkan QR Code atau 6 Digit PIN Akses pada saat tiba di turnstile pintu masuk lapangan.
        </p>
      </div>

      {userBookings.length === 0 ? (
        <div className="bg-white rounded-xl border border-neutral-200 p-12 text-center shadow-sm">
          <div className="w-14 h-14 bg-neutral-100 rounded-full flex items-center justify-center mx-auto text-neutral-400 mb-3">
            <Ticket className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-neutral-900">Belum Ada Tiket Booking</h3>
          <p className="text-xs text-neutral-500 max-w-sm mx-auto mt-1 mb-6">
            Anda belum melakukan pemesanan lapangan. Pilih lapangan favorit Anda dan pesan slot waktu secara real-time.
          </p>
          <button
            onClick={onExploreClick}
            className="px-5 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold rounded-lg transition-colors inline-flex items-center gap-2"
          >
            <Calendar className="w-4 h-4" />
            <span>Pesan Lapangan Sekarang</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {userBookings.map((booking) => {
            const court = COURTS.find(c => c.id === booking.courtId);
            return (
              <div
                key={booking.id}
                className="bg-white rounded-xl border border-neutral-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                {/* Header */}
                <div className="bg-neutral-900 text-white p-4 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-emerald-400 font-mono tracking-wider uppercase block">
                      {booking.bookingCode}
                    </span>
                    <h4 className="text-sm font-bold text-white mt-0.5">
                      {court?.name || 'Lapangan'}
                    </h4>
                  </div>
                  <span className="text-[10px] font-bold bg-emerald-600/90 text-white px-2 py-0.5 rounded">
                    {booking.paymentStatus === 'paid' ? 'LUNAS' : 'DOWNPAYMENT'}
                  </span>
                </div>

                {/* Body info */}
                <div className="p-4 space-y-3">
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="text-neutral-500 block text-[11px]">Tanggal Main</span>
                      <span className="font-semibold text-neutral-900">{formatDisplayDate(booking.date)}</span>
                    </div>
                    <div>
                      <span className="text-neutral-500 block text-[11px]">Waktu Bermain</span>
                      <span className="font-mono font-bold text-neutral-900">{booking.timeSlots.join(', ')}</span>
                    </div>
                  </div>

                  <div className="p-3 bg-neutral-50 rounded-lg flex items-center justify-between border border-neutral-100 text-xs">
                    <div className="flex items-center gap-2">
                      <KeyRound className="w-4 h-4 text-emerald-600" />
                      <div>
                        <span className="text-[10px] text-neutral-500 block">PIN Turnstile</span>
                        <span className="font-mono font-bold text-sm text-neutral-900 tracking-wider">
                          {booking.pinCode}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-neutral-500 block">Total Biaya</span>
                      <span className="font-mono font-bold text-emerald-700">
                        Rp {booking.totalAmount.toLocaleString('id-ID')}
                      </span>
                    </div>
                  </div>

                  <div className="text-[11px] text-neutral-500 flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                    <span className="truncate">GeloraHub Sports Arena, Lantai 1</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="p-4 bg-neutral-50 border-t border-neutral-100 flex items-center justify-between gap-2">
                  <button
                    onClick={() => onOpenTicket(booking)}
                    className="flex-1 py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    <QrCode className="w-3.5 h-3.5" />
                    <span>Buka E-Tiket & QR</span>
                  </button>

                  <button
                    onClick={() => handleCancel(booking.id)}
                    className="p-2 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Batalkan Booking"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
