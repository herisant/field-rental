import React, { useState } from 'react';
import { useBooking } from '../context/BookingContext';
import { COURTS, ADDONS } from '../data/courts';
import confetti from 'canvas-confetti';
import {
  X, Check, Plus, Minus, CreditCard, QrCode, Building, Wallet,
  ShieldCheck, AlertCircle, ArrowLeft, ArrowRight, Activity
} from 'lucide-react';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (booking: any) => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const { selectedSlots, createBooking, holdTimeRemaining } = useBooking();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [teamName, setTeamName] = useState('');
  const [notes, setNotes] = useState('');
  const [addonQuantities, setAddonQuantities] = useState<Record<string, number>>({});
  const [paymentMethod, setPaymentMethod] = useState<'qris' | 'bca_va' | 'mandiri_va' | 'gopay' | 'cash'>('qris');
  const [isProcessing, setIsProcessing] = useState(false);
  const [formError, setFormError] = useState('');

  if (!isOpen || selectedSlots.length === 0) return null;

  const court = COURTS.find(c => c.id === selectedSlots[0].courtId);
  if (!court) return null;

  const targetDate = selectedSlots[0].date;
  const timeSlots = selectedSlots.map(s => s.time);
  const courtSubtotal = selectedSlots.reduce((acc, s) => acc + s.price, 0);

  // Filter relevant addons (e.g. racket only for badminton, vests only for futsal, water for both)
  const relevantAddons = ADDONS.filter(addon => {
    if (court.sport === 'badminton' && (addon.id === 'addon-vest-set' || addon.id === 'addon-ball-futsal')) return false;
    if (court.sport === 'futsal' && (addon.id === 'addon-racket-1' || addon.id === 'addon-shuttlecock-tube')) return false;
    return true;
  });

  const handleQuantityChange = (addonId: string, delta: number) => {
    setAddonQuantities(prev => {
      const current = prev[addonId] || 0;
      const next = Math.max(0, current + delta);
      return { ...prev, [addonId]: next };
    });
  };

  const selectedAddonsList = Object.entries(addonQuantities)
    .filter(([_, qty]) => qty > 0)
    .map(([id, qty]) => {
      const item = ADDONS.find(a => a.id === id)!;
      return {
        addonId: id,
        name: item.name,
        price: item.price,
        quantity: qty
      };
    });

  const addonsSubtotal = selectedAddonsList.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const totalAmount = courtSubtotal + addonsSubtotal;

  const handleNextStep1 = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim()) {
      setFormError('Nama lengkap pemesan wajib diisi.');
      return;
    }
    if (!customerPhone.trim() || customerPhone.length < 9) {
      setFormError('Nomor WhatsApp valid wajib diisi untuk pengiriman e-tiket.');
      return;
    }
    setFormError('');
    setStep(2);
  };

  const handleConfirmAndPay = () => {
    setIsProcessing(true);

    setTimeout(() => {
      const paymentMethodLabels: Record<string, string> = {
        qris: 'QRIS Real-Time',
        bca_va: 'BCA Virtual Account',
        mandiri_va: 'Mandiri Virtual Account',
        gopay: 'GoPay / GoTo Financial',
        cash: 'Bayar Tunai di Kasir'
      };

      const booking = createBooking({
        courtId: court.id,
        date: targetDate,
        timeSlots,
        totalHours: timeSlots.length,
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        teamName: teamName.trim() || undefined,
        notes: notes.trim() || undefined,
        addons: selectedAddonsList,
        courtSubtotal,
        addonsSubtotal,
        discount: 0,
        totalAmount,
        paymentMethod: paymentMethodLabels[paymentMethod] || 'QRIS Real-Time',
        paymentStatus: paymentMethod === 'cash' ? 'downpayment' : 'paid'
      });

      // Launch joyful celebratory confetti
      try {
        confetti({
          particleCount: 80,
          spread: 60,
          origin: { y: 0.6 }
        });
      } catch {}

      setIsProcessing(false);
      onSuccess(booking);
      onClose();
    }, 1200);
  };

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/70 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-neutral-200 overflow-hidden my-8">
        {/* Top Header */}
        <div className="p-4 sm:p-5 bg-neutral-900 text-white flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs text-neutral-400">
              <span className="font-semibold text-emerald-400">Pemesanan Slot</span>
              <span aria-hidden="true">·</span>
              <span>Langkah {step} dari 3</span>
            </div>
            <h3 className="text-base font-bold text-white mt-0.5">
              {court.name}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-white rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Hold Timer Alert */}
        <div className="bg-amber-50 border-b border-amber-200 px-4 py-2 flex items-center justify-between text-xs text-amber-900">
          <span>Kunci Slot Otomatis Aktif</span>
          <span className="font-mono tabular-nums font-bold text-amber-800">
            Sisa Waktu: {formatTimer(holdTimeRemaining)}
          </span>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 max-h-[70vh] overflow-y-auto">
          {/* Step 1: Data Pemesan */}
          {step === 1 && (
            <form onSubmit={handleNextStep1} className="space-y-4">
              <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200 flex items-center justify-between text-xs">
                <div>
                  <span className="text-neutral-500 block">Jadwal Terpilih</span>
                  <span className="font-bold text-neutral-900">{targetDate} · {timeSlots.join(', ')} ({timeSlots.length} Jam)</span>
                </div>
                <div className="text-right">
                  <span className="text-neutral-500 block">Biaya Lapangan</span>
                  <span className="font-mono font-bold text-neutral-900">Rp {courtSubtotal.toLocaleString('id-ID')}</span>
                </div>
              </div>

              {formError && (
                <div className="p-3 bg-red-50 text-red-700 text-xs rounded-lg border border-red-200 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Nama Lengkap Pemesan <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Dimas Aditya Pratama"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    No. WhatsApp Aktif <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="0812xxxxxxxx"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <span className="text-[10px] text-neutral-400 mt-1 block">Tiket QR & PIN masuk akan dikirim ke nomor ini</span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    Nama Tim / Komunitas (Opsional)
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: Garuda Futsal Club"
                    value={teamName}
                    onChange={(e) => setTeamName(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Catatan untuk Pengelola (Opsional)
                </label>
                <textarea
                  rows={2}
                  placeholder="Contoh: Tolong siapkan bola cadangan atau minta tolong AC dinyalakan sebelum kami tiba."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-neutral-100">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-medium text-neutral-600 hover:text-neutral-900"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-neutral-900 hover:bg-neutral-800 rounded-lg transition-colors flex items-center gap-1.5"
                >
                  <span>Lanjut Pilih Peralatan</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          )}

          {/* Step 2: Add-ons / Equipment */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-neutral-900">
                    Sewa Alat & Layanan Tambahan (Opsional)
                  </h4>
                  <p className="text-xs text-neutral-500">
                    Peralatan bersih dan disterilkan, siap pakai di venue saat jam main Anda.
                  </p>
                </div>
              </div>

              <div className="divide-y divide-neutral-100 border border-neutral-200 rounded-xl overflow-hidden">
                {relevantAddons.map((addon) => {
                  const qty = addonQuantities[addon.id] || 0;
                  return (
                    <div key={addon.id} className="p-3.5 flex items-center justify-between gap-3 hover:bg-neutral-50">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-neutral-900">{addon.name}</span>
                          <span className="text-[10px] font-mono font-medium text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                            Rp {addon.price.toLocaleString('id-ID')} / {addon.unit}
                          </span>
                        </div>
                        <p className="text-[11px] text-neutral-500 mt-0.5">{addon.description}</p>
                      </div>

                      {/* Quantity Stepper */}
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={() => handleQuantityChange(addon.id, -1)}
                          disabled={qty === 0}
                          className="w-7 h-7 rounded-lg border border-neutral-300 flex items-center justify-center text-neutral-700 hover:bg-neutral-100 disabled:opacity-30 disabled:hover:bg-transparent"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-6 text-center text-xs font-bold font-mono tabular-nums text-neutral-900">
                          {qty}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleQuantityChange(addon.id, 1)}
                          className="w-7 h-7 rounded-lg border border-neutral-300 flex items-center justify-center text-neutral-700 hover:bg-neutral-100"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Subtotal strip */}
              <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200 flex items-center justify-between text-xs">
                <span className="text-neutral-600 font-medium">Subtotal Add-on & Alat:</span>
                <span className="font-mono font-bold text-neutral-900">
                  Rp {addonsSubtotal.toLocaleString('id-ID')}
                </span>
              </div>

              <div className="pt-4 flex items-center justify-between gap-3 border-t border-neutral-100">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-4 py-2 text-xs font-medium text-neutral-600 hover:text-neutral-900 flex items-center gap-1"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Kembali</span>
                </button>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="px-5 py-2 text-xs font-bold text-white bg-neutral-900 hover:bg-neutral-800 rounded-lg transition-colors flex items-center gap-1.5"
                >
                  <span>Lanjut Pembayaran</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Payment Method & Final Summary */}
          {step === 3 && (
            <div className="space-y-5">
              {/* Invoice Summary */}
              <div className="bg-neutral-50 p-4 rounded-xl border border-neutral-200 space-y-2 text-xs">
                <div className="flex justify-between text-neutral-600">
                  <span>Sewa Lapangan ({court.code} · {timeSlots.length} Jam)</span>
                  <span className="font-mono tabular-nums font-semibold text-neutral-900">
                    Rp {courtSubtotal.toLocaleString('id-ID')}
                  </span>
                </div>

                {selectedAddonsList.length > 0 && (
                  <div className="flex justify-between text-neutral-600">
                    <span>Peralatan Tambahan ({selectedAddonsList.length} item)</span>
                    <span className="font-mono tabular-nums font-semibold text-neutral-900">
                      Rp {addonsSubtotal.toLocaleString('id-ID')}
                    </span>
                  </div>
                )}

                <div className="flex justify-between text-neutral-600">
                  <span>Biaya Layanan Platform</span>
                  <span className="text-emerald-700 font-semibold font-mono">GRATIS</span>
                </div>

                <div className="pt-2 border-t border-neutral-200 flex justify-between items-center text-sm">
                  <span className="font-bold text-neutral-900">Total Pembayaran</span>
                  <span className="text-base font-black text-emerald-700 font-mono tabular-nums">
                    Rp {totalAmount.toLocaleString('id-ID')}
                  </span>
                </div>
              </div>

              {/* Payment Methods */}
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-2">
                  Pilih Metode Pembayaran
                </label>
                <div className="space-y-2">
                  {/* QRIS */}
                  <label
                    className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-colors ${
                      paymentMethod === 'qris'
                        ? 'border-emerald-600 bg-emerald-50/50 ring-1 ring-emerald-500'
                        : 'border-neutral-200 hover:border-neutral-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="payment"
                        value="qris"
                        checked={paymentMethod === 'qris'}
                        onChange={() => setPaymentMethod('qris')}
                        className="text-emerald-600 focus:ring-emerald-500"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <QrCode className="w-4 h-4 text-emerald-700" />
                          <span className="text-xs font-bold text-neutral-900">QRIS Instan (Semua Bank & E-Wallet)</span>
                        </div>
                        <span className="text-[11px] text-neutral-500 block">BCA, Mandiri, GoPay, OVO, ShopeePay, DANA</span>
                      </div>
                    </div>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 rounded">
                      Rekomendasi
                    </span>
                  </label>

                  {/* BCA VA */}
                  <label
                    className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-colors ${
                      paymentMethod === 'bca_va'
                        ? 'border-emerald-600 bg-emerald-50/50 ring-1 ring-emerald-500'
                        : 'border-neutral-200 hover:border-neutral-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="payment"
                        value="bca_va"
                        checked={paymentMethod === 'bca_va'}
                        onChange={() => setPaymentMethod('bca_va')}
                        className="text-emerald-600 focus:ring-emerald-500"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <Building className="w-4 h-4 text-neutral-700" />
                          <span className="text-xs font-bold text-neutral-900">BCA Virtual Account</span>
                        </div>
                        <span className="text-[11px] text-neutral-500 block">Verifikasi otomatis 24 jam</span>
                      </div>
                    </div>
                  </label>

                  {/* Mandiri VA */}
                  <label
                    className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-colors ${
                      paymentMethod === 'mandiri_va'
                        ? 'border-emerald-600 bg-emerald-50/50 ring-1 ring-emerald-500'
                        : 'border-neutral-200 hover:border-neutral-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="payment"
                        value="mandiri_va"
                        checked={paymentMethod === 'mandiri_va'}
                        onChange={() => setPaymentMethod('mandiri_va')}
                        className="text-emerald-600 focus:ring-emerald-500"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <Building className="w-4 h-4 text-neutral-700" />
                          <span className="text-xs font-bold text-neutral-900">Mandiri Virtual Account</span>
                        </div>
                        <span className="text-[11px] text-neutral-500 block">Livin' by Mandiri & ATM</span>
                      </div>
                    </div>
                  </label>

                  {/* Cash di Kasir */}
                  <label
                    className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-colors ${
                      paymentMethod === 'cash'
                        ? 'border-emerald-600 bg-emerald-50/50 ring-1 ring-emerald-500'
                        : 'border-neutral-200 hover:border-neutral-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="payment"
                        value="cash"
                        checked={paymentMethod === 'cash'}
                        onChange={() => setPaymentMethod('cash')}
                        className="text-emerald-600 focus:ring-emerald-500"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <Wallet className="w-4 h-4 text-neutral-700" />
                          <span className="text-xs font-bold text-neutral-900">Bayar di Kasir Gelora</span>
                        </div>
                        <span className="text-[11px] text-neutral-500 block">Wajib hadir minimal 15 menit sebelum slot dimulai</span>
                      </div>
                    </div>
                  </label>
                </div>
              </div>

              {/* QRIS Interactive preview if selected */}
              {paymentMethod === 'qris' && (
                <div className="p-4 bg-neutral-900 text-white rounded-xl text-center space-y-3">
                  <div className="flex items-center justify-center gap-1.5 text-xs text-emerald-400 font-semibold">
                    <QrCode className="w-4 h-4" />
                    <span>Scan QRIS Menggunakan Aplikasi Mobile Banking / E-Wallet</span>
                  </div>
                  {/* Generated SVG QR Code Pattern */}
                  <div className="w-36 h-36 mx-auto bg-white p-2 rounded-lg shadow flex items-center justify-center">
                    <svg viewBox="0 0 100 100" className="w-full h-full text-neutral-900 fill-current">
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
                  <span className="text-[11px] text-neutral-300 block font-mono">
                    NMID: ID1020240982181 · GELORA SPORTS HUB
                  </span>
                </div>
              )}

              <div className="pt-4 flex items-center justify-between gap-3 border-t border-neutral-100">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-4 py-2 text-xs font-medium text-neutral-600 hover:text-neutral-900 flex items-center gap-1"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Kembali</span>
                </button>

                <button
                  type="button"
                  disabled={isProcessing}
                  onClick={handleConfirmAndPay}
                  className="px-6 py-2.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 rounded-lg shadow-md transition-colors flex items-center gap-2"
                >
                  {isProcessing ? (
                    <>
                      <Activity className="w-4 h-4 animate-spin" />
                      <span>Memproses Konfirmasi...</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-4 h-4" />
                      <span>Konfirmasi & Kunci Slot</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
