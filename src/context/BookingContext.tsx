import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { BookedSlot, HeldSlot, Booking, SparringPost, SportType } from '../types';
import { COURTS } from '../data/courts';

interface SelectedSlot {
  courtId: string;
  date: string;
  time: string;
  price: number;
}

interface ActivityNotification {
  id: string;
  message: string;
  timestamp: string;
  type: 'booking' | 'hold' | 'sparring';
}

interface BookingContextType {
  selectedSport: SportType | 'all';
  setSelectedSport: (sport: SportType | 'all') => void;
  selectedDate: string;
  setSelectedDate: (date: string) => void;
  selectedCourtId: string | null;
  setSelectedCourtId: (courtId: string | null) => void;
  bookedSlots: BookedSlot[];
  heldSlots: HeldSlot[];
  selectedSlots: SelectedSlot[];
  userBookings: Booking[];
  sparringPosts: SparringPost[];
  activities: ActivityNotification[];
  toggleSlotSelection: (courtId: string, date: string, time: string, price: number) => void;
  isSlotSelected: (courtId: string, date: string, time: string) => boolean;
  isSlotBooked: (courtId: string, date: string, time: string) => boolean;
  isSlotHeld: (courtId: string, date: string, time: string) => boolean;
  getSlotBookingInfo: (courtId: string, date: string, time: string) => BookedSlot | undefined;
  createBooking: (bookingData: Omit<Booking, 'id' | 'bookingCode' | 'createdAt' | 'qrPayload' | 'pinCode'>) => Booking;
  cancelBooking: (bookingId: string) => void;
  clearSelection: () => void;
  activeTicketModal: Booking | null;
  setActiveTicketModal: (booking: Booking | null) => void;
  addSparringPost: (post: Omit<SparringPost, 'id' | 'joinedCount'>) => void;
  joinSparringPost: (postId: string) => void;
  blockSlotAdmin: (courtId: string, date: string, time: string, reason?: string) => void;
  unblockSlotAdmin: (courtId: string, date: string, time: string) => void;
  holdTimeRemaining: number; // in seconds
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

// Generate formatted current date string YYYY-MM-DD
export const getTodayString = (offsetDays: number = 0): string => {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const INITIAL_BOOKED_SLOTS: BookedSlot[] = [
  // Today's pre-booked popular slots
  {
    courtId: 'futsal-vinyl-1',
    date: getTodayString(0),
    time: '19:00',
    bookingId: 'GLR-INIT-01',
    customerName: 'Dimas Aditya',
    teamName: 'Garuda Muda FC'
  },
  {
    courtId: 'futsal-vinyl-1',
    date: getTodayString(0),
    time: '20:00',
    bookingId: 'GLR-INIT-02',
    customerName: 'Dimas Aditya',
    teamName: 'Garuda Muda FC'
  },
  {
    courtId: 'futsal-turf-2',
    date: getTodayString(0),
    time: '20:00',
    bookingId: 'GLR-INIT-03',
    customerName: 'Bagus Pratama',
    teamName: 'Bhayangkara Futsal'
  },
  {
    courtId: 'badminton-mat-1',
    date: getTodayString(0),
    time: '18:00',
    bookingId: 'GLR-INIT-04',
    customerName: 'Hendra Setiawan',
    teamName: 'PB Smash Ceria'
  },
  {
    courtId: 'badminton-mat-1',
    date: getTodayString(0),
    time: '19:00',
    bookingId: 'GLR-INIT-05',
    customerName: 'Hendra Setiawan',
    teamName: 'PB Smash Ceria'
  },
  {
    courtId: 'badminton-wood-3',
    date: getTodayString(0),
    time: '21:00',
    bookingId: 'GLR-INIT-06',
    customerName: 'Kevin Sanjaya',
    teamName: 'Ganda Putra Elite'
  },
  // Tomorrow's pre-booked slots
  {
    courtId: 'futsal-vinyl-1',
    date: getTodayString(1),
    time: '20:00',
    bookingId: 'GLR-INIT-07',
    customerName: 'Reza Rahardian',
    teamName: 'Artis FC'
  },
  {
    courtId: 'badminton-mat-2',
    date: getTodayString(1),
    time: '19:00',
    bookingId: 'GLR-INIT-08',
    customerName: 'Siti Fadia',
    teamName: 'PB Djarum Alumni'
  }
];

const INITIAL_SPARRING: SparringPost[] = [
  {
    id: 'sp-1',
    courtId: 'futsal-vinyl-1',
    courtName: 'Lapangan Futsal A (Vinyl Pro FIFA)',
    sport: 'futsal',
    date: getTodayString(0),
    timeSlot: '21:00 - 23:00',
    creatorName: 'Rian Firmansyah',
    teamName: 'Thunderbolt FC',
    level: 'Menengah',
    slotNeeded: 1,
    costPerPerson: 25000,
    contactWa: '081288992211',
    notes: 'Butuh 1 tim futsal lawan sparring friendly match 2 jam. Wasit patungan santai.',
    joinedCount: 0
  },
  {
    id: 'sp-2',
    courtId: 'badminton-mat-1',
    courtName: 'Lapangan Badminton 1 (BWF Mat)',
    sport: 'badminton',
    date: getTodayString(1),
    timeSlot: '19:00 - 21:00',
    creatorName: 'Andy Wijaya',
    teamName: 'Komunitas Mabar PB',
    level: 'Semua Level',
    slotNeeded: 2,
    costPerPerson: 35000,
    contactWa: '085712345678',
    notes: 'Kurang 2 orang untuk ganda putra/campuran. Shuttlecock sudah disediakan panitia!',
    joinedCount: 1
  }
];

const STORAGE_KEYS = {
  BOOKED: 'gelorahub_booked_slots_v1',
  USER_BOOKINGS: 'gelorahub_user_bookings_v1',
  SPARRING: 'gelorahub_sparring_v1',
  HELD: 'gelorahub_held_slots_v1'
};

const HOLD_DURATION_SECONDS = 600; // 10 minutes hold lock

export const BookingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedSport, setSelectedSport] = useState<SportType | 'all'>('all');
  const [selectedDate, setSelectedDate] = useState<string>(getTodayString(0));
  const [selectedCourtId, setSelectedCourtId] = useState<string | null>(null);
  const [selectedSlots, setSelectedSlots] = useState<SelectedSlot[]>([]);
  const [activeTicketModal, setActiveTicketModal] = useState<Booking | null>(null);

  // Initialize or restore booked slots
  const [bookedSlots, setBookedSlots] = useState<BookedSlot[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.BOOKED);
      return saved ? JSON.parse(saved) : INITIAL_BOOKED_SLOTS;
    } catch {
      return INITIAL_BOOKED_SLOTS;
    }
  });

  // User booking tickets history
  const [userBookings, setUserBookings] = useState<Booking[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.USER_BOOKINGS);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Held slots (multiplayer/real-time lock)
  const [heldSlots, setHeldSlots] = useState<HeldSlot[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.HELD);
      if (!saved) return [];
      const parsed: HeldSlot[] = JSON.parse(saved);
      const now = Date.now();
      return parsed.filter(h => h.expiresAt > now);
    } catch {
      return [];
    }
  });

  // Sparring community posts
  const [sparringPosts, setSparringPosts] = useState<SparringPost[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SPARRING);
      return saved ? JSON.parse(saved) : INITIAL_SPARRING;
    } catch {
      return INITIAL_SPARRING;
    }
  });

  // Real-time activity notifications stream
  const [activities, setActivities] = useState<ActivityNotification[]>([
    {
      id: 'act-1',
      message: 'Dimas Aditya baru saja mengonfirmasi booking Lapangan Futsal A pk 19:00',
      timestamp: 'Baru saja',
      type: 'booking'
    },
    {
      id: 'act-2',
      message: 'Hendra Setiawan memesan Lapangan Badminton 1 pk 18:00',
      timestamp: '5 menit lalu',
      type: 'booking'
    }
  ]);

  // Session ID for current browser tab
  const sessionId = useMemo(() => {
    return 'sess_' + Math.random().toString(36).substring(2, 9);
  }, []);

  // Broadcast channel for multi-tab real-time sync
  useEffect(() => {
    let channel: BroadcastChannel | null = null;
    try {
      channel = new BroadcastChannel('gelorahub_court_sync');
      channel.onmessage = (event) => {
        const { type, payload } = event.data;
        if (type === 'SYNC_BOOKED_SLOTS') {
          setBookedSlots(payload);
        } else if (type === 'SYNC_HELD_SLOTS') {
          setHeldSlots(payload);
        } else if (type === 'NEW_ACTIVITY') {
          setActivities(prev => [payload, ...prev.slice(0, 15)]);
        } else if (type === 'SYNC_SPARRING') {
          setSparringPosts(payload);
        }
      };
    } catch (e) {
      console.warn('BroadcastChannel not supported', e);
    }

    return () => {
      if (channel) channel.close();
    };
  }, []);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.BOOKED, JSON.stringify(bookedSlots));
  }, [bookedSlots]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.USER_BOOKINGS, JSON.stringify(userBookings));
  }, [userBookings]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SPARRING, JSON.stringify(sparringPosts));
  }, [sparringPosts]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.HELD, JSON.stringify(heldSlots));
  }, [heldSlots]);

  // Periodic cleanup of expired held slots & hold countdown
  const [holdTimeRemaining, setHoldTimeRemaining] = useState<number>(HOLD_DURATION_SECONDS);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      setHeldSlots(prev => {
        const valid = prev.filter(h => h.expiresAt > now);
        if (valid.length !== prev.length) {
          try {
            const ch = new BroadcastChannel('gelorahub_court_sync');
            ch.postMessage({ type: 'SYNC_HELD_SLOTS', payload: valid });
            ch.close();
          } catch {}
        }
        return valid;
      });

      // Update timer if current user has active selections
      if (selectedSlots.length > 0) {
        setHoldTimeRemaining(prev => (prev > 0 ? prev - 1 : 0));
      } else {
        setHoldTimeRemaining(HOLD_DURATION_SECONDS);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [selectedSlots.length]);

  // Release user held slots if timer runs out
  useEffect(() => {
    if (selectedSlots.length > 0 && holdTimeRemaining === 0) {
      setSelectedSlots([]);
      setHeldSlots(prev => prev.filter(h => h.heldBy !== sessionId));
    }
  }, [holdTimeRemaining, selectedSlots.length, sessionId]);

  // Simulated live real-time booking stream (occasional simulated user activities)
  useEffect(() => {
    const timer = setInterval(() => {
      const randomNames = ['Arif Rahman', 'Bayu Saputra', 'Gilang Pratama', 'Irfan Maulana', 'Chandra Wijaya', 'Rizky Fadilah'];
      const randomName = randomNames[Math.floor(Math.random() * randomNames.length)];
      const randomCourt = COURTS[Math.floor(Math.random() * COURTS.length)];
      const hours = ['16:00', '17:00', '18:00', '21:00', '22:00'];
      const randomHour = hours[Math.floor(Math.random() * hours.length)];
      const targetDate = Math.random() > 0.5 ? getTodayString(0) : getTodayString(1);

      // Check if slot is free before simulating a hold or check
      const isAlreadyOccupied = bookedSlots.some(b => b.courtId === randomCourt.id && b.date === targetDate && b.time === randomHour);

      if (!isAlreadyOccupied) {
        const newAct: ActivityNotification = {
          id: 'act-' + Date.now(),
          message: `${randomName} sedang mengecek ketersediaan ${randomCourt.name} (${randomHour})`,
          timestamp: 'Baru saja',
          type: 'hold'
        };
        setActivities(prev => [newAct, ...prev.slice(0, 12)]);
      }
    }, 45000);

    return () => clearInterval(timer);
  }, [bookedSlots]);

  const broadcastActivity = (act: ActivityNotification) => {
    setActivities(prev => [act, ...prev.slice(0, 15)]);
    try {
      const ch = new BroadcastChannel('gelorahub_court_sync');
      ch.postMessage({ type: 'NEW_ACTIVITY', payload: act });
      ch.close();
    } catch {}
  };

  const isSlotBooked = useCallback(
    (courtId: string, date: string, time: string) => {
      return bookedSlots.some(b => b.courtId === courtId && b.date === date && b.time === time);
    },
    [bookedSlots]
  );

  const isSlotHeld = useCallback(
    (courtId: string, date: string, time: string) => {
      const now = Date.now();
      return heldSlots.some(
        h => h.courtId === courtId && h.date === date && h.time === time && h.heldBy !== sessionId && h.expiresAt > now
      );
    },
    [heldSlots, sessionId]
  );

  const isSlotSelected = useCallback(
    (courtId: string, date: string, time: string) => {
      return selectedSlots.some(s => s.courtId === courtId && s.date === date && s.time === time);
    },
    [selectedSlots]
  );

  const getSlotBookingInfo = useCallback(
    (courtId: string, date: string, time: string) => {
      return bookedSlots.find(b => b.courtId === courtId && b.date === date && b.time === time);
    },
    [bookedSlots]
  );

  const toggleSlotSelection = useCallback(
    (courtId: string, date: string, time: string, price: number) => {
      // Cannot select if booked or held by another user
      if (isSlotBooked(courtId, date, time) || isSlotHeld(courtId, date, time)) {
        return;
      }

      const exists = selectedSlots.some(s => s.courtId === courtId && s.date === date && s.time === time);

      if (exists) {
        // Deselect
        const next = selectedSlots.filter(s => !(s.courtId === courtId && s.date === date && s.time === time));
        setSelectedSlots(next);
        // Release hold
        setHeldSlots(prev => prev.filter(h => !(h.courtId === courtId && h.date === date && h.time === time && h.heldBy === sessionId)));
      } else {
        // Must be on the same court and same date for a continuous booking flow
        const hasDifferentCourt = selectedSlots.some(s => s.courtId !== courtId || s.date !== date);
        const baseSlots = hasDifferentCourt ? [] : selectedSlots;

        const newSlot = { courtId, date, time, price };
        const next = [...baseSlots, newSlot].sort((a, b) => a.time.localeCompare(b.time));
        setSelectedSlots(next);

        // Put a hold lock
        const newHeld: HeldSlot = {
          courtId,
          date,
          time,
          heldBy: sessionId,
          expiresAt: Date.now() + HOLD_DURATION_SECONDS * 1000
        };

        const updatedHeld = [...heldSlots.filter(h => !(h.courtId === courtId && h.date === date && h.time === time)), newHeld];
        setHeldSlots(updatedHeld);
        setHoldTimeRemaining(HOLD_DURATION_SECONDS);

        try {
          const ch = new BroadcastChannel('gelorahub_court_sync');
          ch.postMessage({ type: 'SYNC_HELD_SLOTS', payload: updatedHeld });
          ch.close();
        } catch {}
      }
    },
    [isSlotBooked, isSlotHeld, selectedSlots, sessionId, heldSlots]
  );

  const clearSelection = useCallback(() => {
    setSelectedSlots([]);
    setHeldSlots(prev => {
      const filtered = prev.filter(h => h.heldBy !== sessionId);
      try {
        const ch = new BroadcastChannel('gelorahub_court_sync');
        ch.postMessage({ type: 'SYNC_HELD_SLOTS', payload: filtered });
        ch.close();
      } catch {}
      return filtered;
    });
  }, [sessionId]);

  const createBooking = useCallback(
    (bookingData: Omit<Booking, 'id' | 'bookingCode' | 'createdAt' | 'qrPayload' | 'pinCode'>): Booking => {
      const id = 'bkg_' + Date.now();
      const randomSuffix = Math.floor(1000 + Math.random() * 9000);
      const courtCode = COURTS.find(c => c.id === bookingData.courtId)?.code || 'GLR';
      const bookingCode = `${courtCode}-${bookingData.date.replace(/-/g, '').slice(2)}-${randomSuffix}`;
      const pinCode = String(Math.floor(100000 + Math.random() * 900000));
      const qrPayload = `GELORAHUB:${bookingCode}:${bookingData.courtId}:${bookingData.date}:${bookingData.timeSlots.join(',')}:${pinCode}`;

      const newBooking: Booking = {
        ...bookingData,
        id,
        bookingCode,
        createdAt: new Date().toISOString(),
        qrPayload,
        pinCode
      };

      // Create new booked slots
      const newBookedSlots: BookedSlot[] = bookingData.timeSlots.map(time => ({
        courtId: bookingData.courtId,
        date: bookingData.date,
        time,
        bookingId: id,
        customerName: bookingData.customerName,
        teamName: bookingData.teamName
      }));

      const updatedBooked = [...bookedSlots, ...newBookedSlots];
      setBookedSlots(updatedBooked);

      // Save user booking
      setUserBookings(prev => [newBooking, ...prev]);

      // Clear hold locks and selection
      clearSelection();

      // Broadcast booked slots update
      try {
        const ch = new BroadcastChannel('gelorahub_court_sync');
        ch.postMessage({ type: 'SYNC_BOOKED_SLOTS', payload: updatedBooked });
        ch.close();
      } catch {}

      const courtName = COURTS.find(c => c.id === bookingData.courtId)?.name || 'Lapangan';
      broadcastActivity({
        id: 'act-' + Date.now(),
        message: `${bookingData.customerName} berhasil memesan ${courtName} (${bookingData.timeSlots.join(', ')})`,
        timestamp: 'Baru saja',
        type: 'booking'
      });

      return newBooking;
    },
    [bookedSlots, clearSelection]
  );

  const cancelBooking = useCallback(
    (bookingId: string) => {
      const updatedBooked = bookedSlots.filter(b => b.bookingId !== bookingId);
      setBookedSlots(updatedBooked);
      setUserBookings(prev => prev.filter(b => b.id !== bookingId));

      try {
        const ch = new BroadcastChannel('gelorahub_court_sync');
        ch.postMessage({ type: 'SYNC_BOOKED_SLOTS', payload: updatedBooked });
        ch.close();
      } catch {}
    },
    [bookedSlots]
  );

  const addSparringPost = useCallback((post: Omit<SparringPost, 'id' | 'joinedCount'>) => {
    const newPost: SparringPost = {
      ...post,
      id: 'sp-' + Date.now(),
      joinedCount: 0
    };
    setSparringPosts(prev => {
      const updated = [newPost, ...prev];
      try {
        const ch = new BroadcastChannel('gelorahub_court_sync');
        ch.postMessage({ type: 'SYNC_SPARRING', payload: updated });
        ch.close();
      } catch {}
      return updated;
    });

    broadcastActivity({
      id: 'act-' + Date.now(),
      message: `${post.creatorName} membuat jadwal mabar/sparring baru di ${post.courtName}`,
      timestamp: 'Baru saja',
      type: 'sparring'
    });
  }, []);

  const joinSparringPost = useCallback((postId: string) => {
    setSparringPosts(prev => {
      const updated = prev.map(p => {
        if (p.id === postId) {
          return { ...p, joinedCount: p.joinedCount + 1 };
        }
        return p;
      });
      try {
        const ch = new BroadcastChannel('gelorahub_court_sync');
        ch.postMessage({ type: 'SYNC_SPARRING', payload: updated });
        ch.close();
      } catch {}
      return updated;
    });
  }, []);

  const blockSlotAdmin = useCallback((courtId: string, date: string, time: string, reason: string = 'Pemeliharaan Rutin') => {
    const maintenanceSlot: BookedSlot = {
      courtId,
      date,
      time,
      bookingId: 'MTN-' + Date.now(),
      customerName: 'OPERATOR GELORA',
      teamName: reason,
      isMaintenance: true
    };
    setBookedSlots(prev => {
      const updated = [...prev, maintenanceSlot];
      try {
        const ch = new BroadcastChannel('gelorahub_court_sync');
        ch.postMessage({ type: 'SYNC_BOOKED_SLOTS', payload: updated });
        ch.close();
      } catch {}
      return updated;
    });
  }, []);

  const unblockSlotAdmin = useCallback((courtId: string, date: string, time: string) => {
    setBookedSlots(prev => {
      const updated = prev.filter(b => !(b.courtId === courtId && b.date === date && b.time === time));
      try {
        const ch = new BroadcastChannel('gelorahub_court_sync');
        ch.postMessage({ type: 'SYNC_BOOKED_SLOTS', payload: updated });
        ch.close();
      } catch {}
      return updated;
    });
  }, []);

  return (
    <BookingContext.Provider
      value={{
        selectedSport,
        setSelectedSport,
        selectedDate,
        setSelectedDate,
        selectedCourtId,
        setSelectedCourtId,
        bookedSlots,
        heldSlots,
        selectedSlots,
        userBookings,
        sparringPosts,
        activities,
        toggleSlotSelection,
        isSlotSelected,
        isSlotBooked,
        isSlotHeld,
        getSlotBookingInfo,
        createBooking,
        cancelBooking,
        clearSelection,
        activeTicketModal,
        setActiveTicketModal,
        addSparringPost,
        joinSparringPost,
        blockSlotAdmin,
        unblockSlotAdmin,
        holdTimeRemaining
      }}
    >
      {children}
    </BookingContext.Provider>
  );
};

export const useBooking = (): BookingContextType => {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
};
