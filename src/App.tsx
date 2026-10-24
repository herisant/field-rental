import React, { useState } from 'react';
import { BookingProvider, useBooking } from './context/BookingContext';
import { Navbar } from './components/Navbar';
import { LiveActivityTicker } from './components/LiveActivityTicker';
import { Hero } from './components/Hero';
import { CourtCard } from './components/CourtCard';
import { CourtScheduleMatrix } from './components/CourtScheduleMatrix';
import { BookingModal } from './components/BookingModal';
import { TicketModal } from './components/TicketModal';
import { SparringBoard } from './components/SparringBoard';
import { UserTicketsView } from './components/UserTicketsView';
import { AdminScheduleView } from './components/AdminScheduleView';
import { COURTS } from './data/courts';
import { Booking } from './types';
import {
  MapPin, Phone, Mail, Clock, ShieldCheck, CheckCircle2,
  Calendar, Users, Trophy, Sparkles
} from 'lucide-react';

function MainApp() {
  const [activeTab, setActiveTab] = useState<'explore' | 'schedule' | 'sparring' | 'my-tickets' | 'admin'>('explore');
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [activeTicket, setActiveTicket] = useState<Booking | null>(null);

  const {
    selectedSport,
    setSelectedSport,
    setSelectedCourtId,
    selectedSlots
  } = useBooking();

  const handleSelectCourtFromCard = (courtId: string) => {
    setSelectedCourtId(courtId);
    setActiveTab('schedule');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleProceedToBooking = () => {
    setIsBookingModalOpen(true);
  };

  const handleBookingSuccess = (newBooking: Booking) => {
    setActiveTicket(newBooking);
  };

  const filteredCourts = COURTS.filter(
    c => selectedSport === 'all' || c.sport === selectedSport
  );

  return (
    <div className="min-h-screen flex flex-col bg-neutral-50 text-neutral-900 font-sans">
      {/* Real-time Activity Ticker */}
      <LiveActivityTicker />

      {/* Top Navbar adhering to Top Bar Contract */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenBooking={() => setIsBookingModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {activeTab === 'explore' && (
          <div>
            {/* Hero Section */}
            <Hero onQuickBookClick={() => setActiveTab('schedule')} />

            {/* Featured Courts Grid Section */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
                <div>
                  <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 uppercase tracking-wider">
                    <Trophy className="w-4 h-4 text-emerald-600" />
                    <span>Fasilitas Lapangan Unggulan</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 mt-1">
                    Pilihan Lapangan Futsal & Badminton
                  </h2>
                  <p className="text-sm text-neutral-600 mt-1 max-w-xl">
                    Dilengkapi permukaan bersertifikasi standar internasional untuk kenyamanan maksimal dan perlindungan sendi lutut.
                  </p>
                </div>

                {/* Filter Tabs */}
                <div className="p-1 bg-neutral-100 rounded-lg flex items-center gap-1 shrink-0 self-start sm:self-auto">
                  <button
                    onClick={() => setSelectedSport('all')}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                      selectedSport === 'all'
                        ? 'bg-white text-neutral-900 shadow-sm'
                        : 'text-neutral-600 hover:text-neutral-900'
                    }`}
                  >
                    Semua ({COURTS.length})
                  </button>
                  <button
                    onClick={() => setSelectedSport('futsal')}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                      selectedSport === 'futsal'
                        ? 'bg-white text-neutral-900 shadow-sm'
                        : 'text-neutral-600 hover:text-neutral-900'
                    }`}
                  >
                    Futsal (2)
                  </button>
                  <button
                    onClick={() => setSelectedSport('badminton')}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                      selectedSport === 'badminton'
                        ? 'bg-white text-neutral-900 shadow-sm'
                        : 'text-neutral-600 hover:text-neutral-900'
                    }`}
                  >
                    Badminton (3)
                  </button>
                </div>
              </div>

              {/* Courts Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCourts.map((court) => (
                  <CourtCard
                    key={court.id}
                    court={court}
                    onSelectCourt={handleSelectCourtFromCard}
                  />
                ))}
              </div>

              {/* Facility & Trust Rest Section */}
              <div className="mt-16 p-8 bg-white rounded-2xl border border-neutral-200 shadow-sm">
                <div className="max-w-2xl">
                  <span className="text-xs font-semibold text-emerald-700 uppercase tracking-wider">
                    Kenyamanan & Fasilitas Venue
                  </span>
                  <h3 className="text-xl font-bold text-neutral-900 mt-1">
                    Semua yang Anda Butuhkan untuk Permainan Terbaik
                  </h3>
                  <p className="text-xs text-neutral-600 mt-1">
                    Kami merawat venue setiap hari dengan standar sanitasi ketat dan penerangan optimal bebas silau.
                  </p>
                </div>

                <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-100">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 mb-2" />
                    <h4 className="text-sm font-bold text-neutral-900">Pencahayaan LED 800 Lux</h4>
                    <p className="text-xs text-neutral-600 mt-1">
                      Penerangan merata bebas silau pandang bola atau shuttlecock di udara.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-100">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 mb-2" />
                    <h4 className="text-sm font-bold text-neutral-900">Ruang Ganti & Hot Shower</h4>
                    <p className="text-xs text-neutral-600 mt-1">
                      Kamar mandi bersih dengan shower air hangat bertekanan stabil dan locker aman.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-100">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 mb-2" />
                    <h4 className="text-sm font-bold text-neutral-900">Kantin & Pro Shop</h4>
                    <p className="text-xs text-neutral-600 mt-1">
                      Minuman dingin isotonik, shuttlecock resmi, tarikan senar raket, dan camilan.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-100">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 mb-2" />
                    <h4 className="text-sm font-bold text-neutral-900">Parkir Mobil & Motor Luas</h4>
                    <p className="text-xs text-neutral-600 mt-1">
                      Area parkir beraspal tertutup dengan pengawasan CCTV 24 jam dan petugas ramah.
                    </p>
                  </div>
                </div>
              </div>
            </section>
          </div>
        )}

        {activeTab === 'schedule' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
            <CourtScheduleMatrix onProceedToBooking={handleProceedToBooking} />
          </div>
        )}

        {activeTab === 'sparring' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
            <SparringBoard />
          </div>
        )}

        {activeTab === 'my-tickets' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
            <UserTicketsView
              onOpenTicket={(booking) => setActiveTicket(booking)}
              onExploreClick={() => setActiveTab('explore')}
            />
          </div>
        )}

        {activeTab === 'admin' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
            <AdminScheduleView />
          </div>
        )}
      </main>

      {/* Booking Checkout Modal */}
      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        onSuccess={handleBookingSuccess}
      />

      {/* Digital Pass / E-Ticket Modal */}
      <TicketModal
        booking={activeTicket}
        onClose={() => setActiveTicket(null)}
      />

      {/* Quiet, clean site footer */}
      <footer className="bg-neutral-900 text-neutral-400 text-xs border-t border-neutral-800 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <span className="text-base font-bold text-white tracking-tight">
                Gelora<span className="text-emerald-500">Hub</span>
              </span>
              <p className="mt-2 text-xs text-neutral-400 leading-relaxed">
                Pusat penyewaan lapangan futsal dan badminton modern dengan sistem booking slot real-time, konfirmasi otomatis, dan e-tiket turnstile digital.
              </p>
            </div>

            <div>
              <span className="text-xs font-semibold text-white uppercase tracking-wider block mb-3">
                Operasional Venue
              </span>
              <ul className="space-y-1.5 text-xs text-neutral-400">
                <li>Senin – Minggu: 07:00 – 24:00 WIB</li>
                <li>Pemesanan online aktif 24 jam nonstop</li>
                <li>Turnstile gate buka 15 menit sebelum slot</li>
              </ul>
            </div>

            <div>
              <span className="text-xs font-semibold text-white uppercase tracking-wider block mb-3">
                Lokasi & Kontak
              </span>
              <ul className="space-y-1.5 text-xs text-neutral-400">
                <li className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Jl. Gelora Utama No. 88, Jakarta Selatan</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>0812-9988-7766 (Admin WhatsApp)</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>halo@gelorahub.id</span>
                </li>
              </ul>
            </div>

            <div>
              <span className="text-xs font-semibold text-white uppercase tracking-wider block mb-3">
                Standar Lapangan
              </span>
              <div className="space-y-1.5 text-xs text-neutral-400">
                <p>• Vinyl Interlock FIFA Standard 7mm</p>
                <p>• Monofilament Turf + Silika Sand Rubber</p>
                <p>• Karpet BWF Tournament Grade A</p>
                <p>• Canadian Maple Sprung Wood Flooring</p>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-neutral-500 text-[11px]">
            <p>© {new Date().getFullYear()} GeloraHub Sports Arena. Hak cipta dilindungi undang-undang.</p>
            <div className="flex items-center gap-4">
              <span>Syarat & Ketentuan Sewa</span>
              <span aria-hidden="true">·</span>
              <span>Kebijakan Privasi</span>
              <span aria-hidden="true">·</span>
              <span>Tata Tertib Pemain</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <BookingProvider>
      <MainApp />
    </BookingProvider>
  );
}
