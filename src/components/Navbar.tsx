import React from 'react';
import { useBooking } from '../context/BookingContext';
import { Calendar, Ticket, ShieldCheck, Users, Activity } from 'lucide-react';

interface NavbarProps {
  activeTab: 'explore' | 'schedule' | 'sparring' | 'my-tickets' | 'admin';
  setActiveTab: (tab: 'explore' | 'schedule' | 'sparring' | 'my-tickets' | 'admin') => void;
  onOpenBooking: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab, onOpenBooking }) => {
  const { selectedSlots, userBookings } = useBooking();

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-16">
          {/* Zone 1: Single text element wordmark */}
          <button
            onClick={() => setActiveTab('explore')}
            className="text-xl font-bold tracking-tight text-neutral-900 whitespace-nowrap shrink-0 hover:text-emerald-700 transition-colors text-left"
          >
            Gelora<span className="text-emerald-600">Hub</span>
          </button>

          {/* Zone 2: 4-5 clean single-line text navigation links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-neutral-600">
            <button
              onClick={() => setActiveTab('explore')}
              className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
                activeTab === 'explore'
                  ? 'text-emerald-700 font-semibold border-b-2 border-emerald-600'
                  : 'hover:text-neutral-900'
              }`}
            >
              Pilihan Lapangan
            </button>
            <button
              onClick={() => setActiveTab('schedule')}
              className={`whitespace-nowrap shrink-0 transition-colors py-1 flex items-center gap-1.5 ${
                activeTab === 'schedule'
                  ? 'text-emerald-700 font-semibold border-b-2 border-emerald-600'
                  : 'hover:text-neutral-900'
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span>Jadwal Slot Real-Time</span>
            </button>
            <button
              onClick={() => setActiveTab('sparring')}
              className={`whitespace-nowrap shrink-0 transition-colors py-1 flex items-center gap-1.5 ${
                activeTab === 'sparring'
                  ? 'text-emerald-700 font-semibold border-b-2 border-emerald-600'
                  : 'hover:text-neutral-900'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Cari Lawan / Mabar</span>
            </button>
            <button
              onClick={() => setActiveTab('my-tickets')}
              className={`whitespace-nowrap shrink-0 transition-colors py-1 flex items-center gap-1.5 ${
                activeTab === 'my-tickets'
                  ? 'text-emerald-700 font-semibold border-b-2 border-emerald-600'
                  : 'hover:text-neutral-900'
              }`}
            >
              <Ticket className="w-4 h-4" />
              <span>Tiket Saya {userBookings.length > 0 && `(${userBookings.length})`}</span>
            </button>
            <button
              onClick={() => setActiveTab('admin')}
              className={`whitespace-nowrap shrink-0 transition-colors py-1 flex items-center gap-1.5 text-neutral-500 hover:text-neutral-900 ${
                activeTab === 'admin'
                  ? 'text-neutral-900 font-semibold border-b-2 border-neutral-900'
                  : ''
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Kelola Lapangan</span>
            </button>
          </nav>

          {/* Zone 3: 1 primary action */}
          <div className="flex items-center gap-3 shrink-0">
            {selectedSlots.length > 0 ? (
              <button
                onClick={onOpenBooking}
                className="px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm transition-colors whitespace-nowrap shrink-0 flex items-center gap-2"
              >
                <Activity className="w-3.5 h-3.5 animate-spin" />
                <span>Checkout ({selectedSlots.length} Jam)</span>
              </button>
            ) : (
              <button
                onClick={() => setActiveTab('schedule')}
                className="px-4 py-2 text-xs font-semibold text-white bg-neutral-900 hover:bg-neutral-800 rounded-lg transition-colors whitespace-nowrap shrink-0"
              >
                Pesan Slot Sekarang
              </button>
            )}
          </div>
        </div>

        {/* Mobile secondary navigation strip */}
        <div className="md:hidden flex items-center justify-between border-t border-neutral-100 py-2.5 overflow-x-auto text-xs gap-3">
          <button
            onClick={() => setActiveTab('explore')}
            className={`whitespace-nowrap px-2 py-1 rounded ${activeTab === 'explore' ? 'bg-neutral-900 text-white font-medium' : 'text-neutral-600'}`}
          >
            Lapangan
          </button>
          <button
            onClick={() => setActiveTab('schedule')}
            className={`whitespace-nowrap px-2 py-1 rounded ${activeTab === 'schedule' ? 'bg-neutral-900 text-white font-medium' : 'text-neutral-600'}`}
          >
            Jadwal Slot
          </button>
          <button
            onClick={() => setActiveTab('sparring')}
            className={`whitespace-nowrap px-2 py-1 rounded ${activeTab === 'sparring' ? 'bg-neutral-900 text-white font-medium' : 'text-neutral-600'}`}
          >
            Mabar
          </button>
          <button
            onClick={() => setActiveTab('my-tickets')}
            className={`whitespace-nowrap px-2 py-1 rounded ${activeTab === 'my-tickets' ? 'bg-neutral-900 text-white font-medium' : 'text-neutral-600'}`}
          >
            Tiket ({userBookings.length})
          </button>
          <button
            onClick={() => setActiveTab('admin')}
            className={`whitespace-nowrap px-2 py-1 rounded ${activeTab === 'admin' ? 'bg-neutral-900 text-white font-medium' : 'text-neutral-600'}`}
          >
            Admin
          </button>
        </div>
      </div>
    </header>
  );
};
