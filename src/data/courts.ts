import { Court, AddonItem } from '../types';

export const COURTS: Court[] = [
  {
    id: 'futsal-vinyl-1',
    name: 'Lapangan Futsal A (Vinyl Pro FIFA)',
    code: 'FTS-A',
    sport: 'futsal',
    surface: 'vinyl',
    surfaceLabel: 'Vinyl Interlock FIFA Standard 7mm',
    dimensions: '26m × 16m',
    lighting: '800 Lux Anti-Glare LED System',
    capacity: '10–14 Pemain',
    description: 'Lapangan vinyl berstandar kompetisi nasional dengan daya cengkeram optimal, meminimalkan resiko cedera lutut. Cocok untuk turnamen dan permainan cepat.',
    image: '/src/assets/images/futsal_court_vinyl_1792833965374.jpg',
    basePriceDay: 150000,
    basePriceNight: 220000,
    features: [
      'Gawang Besi Pipa 3 inch dengan Jaring Polyethylene tebal',
      'Papan Skor Digital Elektronik dengan remote kontrol',
      'Tribun Penonton 60 kursi dengan AC & Exhaust Fan',
      'Ruang ganti bersekat & shower air panas'
    ],
    rules: [
      'Wajib mengenakan sepatu sol karet (non-marking)',
      'Dilarang merokok dan membawa minuman manis ke dalam karpet vinyl',
      'Toleransi keterlambatan 10 menit sebelum slot dimulai'
    ]
  },
  {
    id: 'futsal-turf-2',
    name: 'Lapangan Futsal B (Rumput Sintetis)',
    code: 'FTS-B',
    sport: 'futsal',
    surface: 'rumput_sintetis',
    surfaceLabel: 'Monofilament Turf 50mm + Rubber Granules',
    dimensions: '25m × 15m',
    lighting: '700 Lux LED High-Bay Sportlights',
    capacity: '10–12 Pemain',
    description: 'Rumput sintetis halus dengan bantalan pasir silika dan butiran karet elastis. Memberikan sensasi rumput alami yang nyaman untuk lari dan tackling.',
    image: '/src/assets/images/futsal_court_turf_1792833967520.jpg',
    basePriceDay: 140000,
    basePriceNight: 195000,
    features: [
      'Jaring Pengaman Keliling Tinggi 8 meter',
      'Free Bola Futsal Standar 1 pcs saat main',
      'Bench cadangan beratap 8 seater per tim',
      'Dekat area kantin dan musholla'
    ],
    rules: [
      'Boleh memakai sepatu sol karet atau sepatu futsal TF (Turf)',
      'Dilarang keras memakai sepatu bola bermpul besi/SG',
      'Gunakan rompi tim agar mudah membedakan kawan & lawan'
    ]
  },
  {
    id: 'badminton-mat-1',
    name: 'Lapangan Badminton 1 (BWF Mat Tournament)',
    code: 'BDM-1',
    sport: 'badminton',
    surface: 'karpet_bwf',
    surfaceLabel: 'Karpet Karet Vinyl Hijau BWF Grade A',
    dimensions: '13.4m × 6.1m',
    lighting: '650 Lux Diffused Side Illumination (Bebas Silau)',
    capacity: '2–4 Pemain',
    description: 'Karpet standar resmi BWF warna hijau botol dengan grip prima dan pantulan stabil. Pencahayaan dipasang di sisi samping sehingga tidak menyilaukan saat smash & lob tinggi.',
    image: '/src/assets/images/badminton_court_mat_1792833967564.jpg',
    basePriceDay: 75000,
    basePriceNight: 110000,
    features: [
      'Tiang & Jaring Net Yonex Tournament Tensioner',
      'Plafon Tinggi 11 Meter tanpa hambatan tiang',
      'Sirkulasi Udara Tenang tanpa hembusan angin langsung',
      'Tempat duduk wasit & scoreboard manual'
    ],
    rules: [
      'Wajib menggunakan sepatu khusus badminton non-marking',
      'Dilarang menginjak karpet dengan sandal jepit atau sepatu kasual',
      'Sampah shuttlecock rusak harap dibuang ke tempat yang tersedia'
    ]
  },
  {
    id: 'badminton-mat-2',
    name: 'Lapangan Badminton 2 (BWF Mat Tournament)',
    code: 'BDM-2',
    sport: 'badminton',
    surface: 'karpet_bwf',
    surfaceLabel: 'Karpet Karet Vinyl Hijau BWF Grade A',
    dimensions: '13.4m × 6.1m',
    lighting: '650 Lux Diffused Side Illumination',
    capacity: '2–4 Pemain',
    description: 'Kembaran Lapangan 1 dengan spesifikasi karpet BWF identik. Sangat direkomendasikan untuk latihan ganda intensif maupun laga turnamen.',
    image: '/src/assets/images/badminton_court_mat_1792833967564.jpg',
    basePriceDay: 75000,
    basePriceNight: 110000,
    features: [
      'Tiang & Jaring Net Yonex Tournament Tensioner',
      'Plafon Tinggi 11 Meter',
      'Area tunggu pemain luas dengan stopkontak charger',
      'Sistem ventilasi pendingin udara exhaust ganda'
    ],
    rules: [
      'Wajib menggunakan sepatu khusus badminton non-marking',
      'Gunakan handuk pribadi di bangku istirahat'
    ]
  },
  {
    id: 'badminton-wood-3',
    name: 'Lapangan Badminton 3 (Kayu Parquet Canadian Maple)',
    code: 'BDM-3',
    sport: 'badminton',
    surface: 'kayu_parquet',
    surfaceLabel: 'Sprung Canadian Maple Parquet Flooring',
    dimensions: '13.4m × 6.1m',
    lighting: '600 Lux Warm-Neutral Sports LED',
    capacity: '2–4 Pemain',
    description: 'Lantai kayu parket Canadian Maple dengan subfloor bersuspensi ganda yang meredam kejutan tumpuan sendi. Nuansa klasik premium dengan akustik khas pukulan raket.',
    image: '/src/assets/images/badminton_court_wood_1792833967772.jpg',
    basePriceDay: 85000,
    basePriceNight: 125000,
    features: [
      'Suspension Spring Floor (Sangat empuk bagi lutut & tumit)',
      'Net Tournament Heavy Duty',
      'Lantai dirawat dengan coating anti-slip berkala',
      'Spot foto estetik dengan pencahayaan warm athletic'
    ],
    rules: [
      'Wajib sepatu badminton non-marking berdaya cengkeram bersih',
      'Dilarang menyeret tas atau benda tajam di atas lantai kayu',
      'Keringkan tetesan keringat segera bila membasahi lantai'
    ]
  }
];

export const ADDONS: AddonItem[] = [
  {
    id: 'addon-racket-1',
    name: 'Sewa Raket Badminton Yonex',
    category: 'gear',
    price: 20000,
    unit: 'pcs / sesi',
    description: 'Tarikan senar 26 lbs, grip nyaman anti-slip, cocok untuk all-round & smash.',
    iconName: 'Activity'
  },
  {
    id: 'addon-shuttlecock-tube',
    name: '1 Slop Shuttlecock (Isi 12 pcs)',
    category: 'gear',
    price: 95000,
    unit: 'slop',
    description: 'Bulu angsa asli Speed 77, rotasi stabil dan tahan dipakai rally panjang.',
    iconName: 'Disc'
  },
  {
    id: 'addon-ball-futsal',
    name: 'Bola Futsal Extra Pro Size 4',
    category: 'gear',
    price: 15000,
    unit: 'pcs / sesi',
    description: 'Bola jahit mesin low-bounce pantulan rendah standar resmi PSSI/FIFA.',
    iconName: 'Circle'
  },
  {
    id: 'addon-vest-set',
    name: 'Set Rompi Tim Futsal (5 pcs)',
    category: 'gear',
    price: 25000,
    unit: 'set / sesi',
    description: 'Bahan jaring dry-fit sejuk bernomor punggung (pilihan neon hijau atau oranye).',
    iconName: 'Shirt'
  },
  {
    id: 'addon-referee',
    name: 'Wasit Berlisensi Resmi',
    category: 'service',
    price: 75000,
    unit: 'jam',
    description: 'Wasit bersertifikat PSSI / PBSI untuk memimpin laga turnamen atau persahabatan.',
    iconName: 'Award'
  },
  {
    id: 'addon-water-gallon',
    name: 'Air Mineral Galon Dingin + Dispenser',
    category: 'beverage',
    price: 30000,
    unit: 'galon 19L',
    description: 'Galon air mineral higienis dingin tanpa batas lengkap dengan cup kertas tim.',
    iconName: 'Droplet'
  }
];

export const OPERATING_HOURS = [
  { hour: 7, label: '07:00 - 08:00', isPeak: false },
  { hour: 8, label: '08:00 - 09:00', isPeak: false },
  { hour: 9, label: '09:00 - 10:00', isPeak: false },
  { hour: 10, label: '10:00 - 11:00', isPeak: false },
  { hour: 11, label: '11:00 - 12:00', isPeak: false },
  { hour: 12, label: '12:00 - 13:00', isPeak: false },
  { hour: 13, label: '13:00 - 14:00', isPeak: false },
  { hour: 14, label: '14:00 - 15:00', isPeak: false },
  { hour: 15, label: '15:00 - 16:00', isPeak: false },
  { hour: 16, label: '16:00 - 17:00', isPeak: false },
  { hour: 17, label: '17:00 - 18:00', isPeak: true },
  { hour: 18, label: '18:00 - 19:00', isPeak: true },
  { hour: 19, label: '19:00 - 20:00', isPeak: true },
  { hour: 20, label: '20:00 - 21:00', isPeak: true },
  { hour: 21, label: '21:00 - 22:00', isPeak: true },
  { hour: 22, label: '22:00 - 23:00', isPeak: true },
  { hour: 23, label: '23:00 - 24:00', isPeak: false }
];
