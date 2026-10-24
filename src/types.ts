export type SportType = 'futsal' | 'badminton';

export type SurfaceType = 'vinyl' | 'rumput_sintetis' | 'karpet_bwf' | 'kayu_parquet';

export interface TimeSlot {
  time: string; // e.g. "07:00", "08:00"
  endTime: string; // e.g. "08:00", "09:00"
  price: number; // in IDR
  isPeak: boolean;
}

export interface Court {
  id: string;
  name: string;
  code: string;
  sport: SportType;
  surface: SurfaceType;
  surfaceLabel: string;
  dimensions: string;
  lighting: string;
  capacity: string;
  description: string;
  image: string;
  basePriceDay: number;
  basePriceNight: number;
  features: string[];
  rules: string[];
}

export interface AddonItem {
  id: string;
  name: string;
  category: 'gear' | 'service' | 'beverage';
  price: number;
  unit: string;
  description: string;
  iconName: string;
}

export interface BookingAddon {
  addonId: string;
  quantity: number;
}

export type SlotStatus = 'available' | 'held' | 'booked';

export interface BookedSlot {
  courtId: string;
  date: string; // YYYY-MM-DD
  time: string; // "19:00"
  bookingId: string;
  customerName: string;
  teamName?: string;
  isMaintenance?: boolean;
}

export interface HeldSlot {
  courtId: string;
  date: string;
  time: string;
  heldBy: string; // session id
  expiresAt: number; // timestamp
}

export interface Booking {
  id: string;
  bookingCode: string;
  courtId: string;
  date: string;
  timeSlots: string[];
  totalHours: number;
  customerName: string;
  customerPhone: string;
  teamName?: string;
  notes?: string;
  addons: {
    addonId: string;
    name: string;
    price: number;
    quantity: number;
  }[];
  courtSubtotal: number;
  addonsSubtotal: number;
  discount: number;
  totalAmount: number;
  paymentMethod: string;
  paymentStatus: 'paid' | 'pending' | 'downpayment';
  createdAt: string;
  qrPayload: string;
  pinCode: string;
}

export interface SparringPost {
  id: string;
  courtId: string;
  courtName: string;
  sport: SportType;
  date: string;
  timeSlot: string;
  creatorName: string;
  teamName: string;
  level: 'Pemula' | 'Menengah' | 'Kompetitif' | 'Semua Level';
  slotNeeded: number;
  costPerPerson: number;
  contactWa: string;
  notes: string;
  joinedCount: number;
}
