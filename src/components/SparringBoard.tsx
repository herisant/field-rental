import React, { useState } from 'react';
import { useBooking, getTodayString } from '../context/BookingContext';
import { COURTS } from '../data/courts';
import { Users, Plus, MessageCircle, Calendar, ShieldCheck, MapPin, X, Check } from 'lucide-react';
import { SportType } from '../types';

export const SparringBoard: React.FC = () => {
  const { sparringPosts, addSparringPost, joinSparringPost } = useBooking();
  const [sportFilter, setSportFilter] = useState<SportType | 'all'>('all');
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  // Form State
  const [courtId, setCourtId] = useState(COURTS[0].id);
  const [date, setDate] = useState(getTodayString(0));
  const [timeSlot, setTimeSlot] = useState('20:00 - 22:00');
  const [creatorName, setCreatorName] = useState('');
  const [teamName, setTeamName] = useState('');
  const [level, setLevel] = useState<'Pemula' | 'Menengah' | 'Kompetitif' | 'Semua Level'>('Semua Level');
  const [slotNeeded, setSlotNeeded] = useState(2);
  const [costPerPerson, setCostPerPerson] = useState(30000);
  const [contactWa, setContactWa] = useState('');
  const [notes, setNotes] = useState('');
  const [joinedSuccessId, setJoinedSuccessId] = useState<string | null>(null);

  const filteredPosts = sparringPosts.filter(
    p => sportFilter === 'all' || p.sport === sportFilter
  );

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    const court = COURTS.find(c => c.id === courtId);
    if (!court || !creatorName.trim() || !contactWa.trim()) return;

    addSparringPost({
      courtId: court.id,
      courtName: court.name,
      sport: court.sport,
      date,
      timeSlot,
      creatorName: creatorName.trim(),
      teamName: teamName.trim() || 'Komunitas Mabar',
      level,
      slotNeeded,
      costPerPerson,
      contactWa: contactWa.trim(),
      notes: notes.trim() || 'Ayo main bareng, sportivitas nomor satu!'
    });

    setIsCreateOpen(false);
    // Reset form
    setCreatorName('');
    setTeamName('');
    setNotes('');
  };

  const handleJoin = (postId: string) => {
    joinSparringPost(postId);
    setJoinedSuccessId(postId);
    setTimeout(() => setJoinedSuccessId(null), 3000);
  };

  const handleChatWA = (wa: string, postTitle: string) => {
    const text = encodeURIComponent(`Halo, saya tertarik bergabung mabar/sparring: ${postTitle} dari GeloraHub. Apakah slot masih tersedia?`);
    window.open(`https://api.whatsapp.com/send?phone=${wa}&text=${text}`, '_blank');
  };

  return (
    <div className="space-y-6">
      {/* Board Header */}
      <div className="bg-white rounded-xl border border-neutral-200 p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 uppercase tracking-wider">
            <Users className="w-4 h-4 text-emerald-600" />
            <span>Papan Komunitas Olahraga</span>
          </div>
          <h2 className="text-xl font-bold text-neutral-900 mt-1">
            Cari Lawan Sparring & Teman Mabar
          </h2>
          <p className="text-xs text-neutral-500 mt-1">
            Kurang pemain untuk ganda badminton atau tim futsal Anda butuh lawan tanding selevel? Temukan di sini!
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Sport Filter */}
          <div className="p-1 bg-neutral-100 rounded-lg flex items-center gap-1 text-xs">
            <button
              onClick={() => setSportFilter('all')}
              className={`px-3 py-1.5 rounded-md font-semibold transition-colors ${
                sportFilter === 'all' ? 'bg-white text-neutral-900 shadow-sm' : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              Semua
            </button>
            <button
              onClick={() => setSportFilter('futsal')}
              className={`px-3 py-1.5 rounded-md font-semibold transition-colors ${
                sportFilter === 'futsal' ? 'bg-white text-neutral-900 shadow-sm' : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              Futsal
            </button>
            <button
              onClick={() => setSportFilter('badminton')}
              className={`px-3 py-1.5 rounded-md font-semibold transition-colors ${
                sportFilter === 'badminton' ? 'bg-white text-neutral-900 shadow-sm' : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              Badminton
            </button>
          </div>

          <button
            onClick={() => setIsCreateOpen(true)}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 shadow-sm whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            <span>Buat Jadwal Mabar</span>
          </button>
        </div>
      </div>

      {/* Posts List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredPosts.map((post) => {
          const isFull = post.joinedCount >= post.slotNeeded;
          return (
            <div
              key={post.id}
              className="bg-white rounded-xl border border-neutral-200 p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 text-xs text-neutral-500 font-medium">
                      <span className="uppercase font-bold text-emerald-700">
                        {post.sport === 'futsal' ? 'Futsal Sparring' : 'Badminton Mabar'}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span className="text-neutral-700 font-semibold">{post.level}</span>
                    </div>
                    <h3 className="text-base font-bold text-neutral-900 mt-1">
                      {post.teamName}
                    </h3>
                    <p className="text-xs text-neutral-500">
                      Oleh {post.creatorName}
                    </p>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] text-neutral-500 block">Patungan</span>
                    <span className="text-sm font-extrabold text-neutral-900 font-mono tabular-nums">
                      Rp {post.costPerPerson.toLocaleString('id-ID')}
                    </span>
                    <span className="text-[10px] text-neutral-400 block">/ orang</span>
                  </div>
                </div>

                {/* Details strip */}
                <div className="mt-3.5 p-3 bg-neutral-50 rounded-lg text-xs space-y-1.5 border border-neutral-100">
                  <div className="flex items-center gap-2 text-neutral-700">
                    <Calendar className="w-3.5 h-3.5 text-neutral-500 shrink-0" />
                    <span>{post.date} · <strong>{post.timeSlot}</strong></span>
                  </div>
                  <div className="flex items-center gap-2 text-neutral-700">
                    <MapPin className="w-3.5 h-3.5 text-neutral-500 shrink-0" />
                    <span className="truncate">{post.courtName}</span>
                  </div>
                </div>

                <p className="mt-3 text-xs text-neutral-600 italic">
                  "{post.notes}"
                </p>
              </div>

              {/* Action buttons */}
              <div className="mt-5 pt-3 border-t border-neutral-100 flex items-center justify-between gap-3">
                <div className="text-xs text-neutral-600">
                  <span className="font-semibold text-neutral-900 font-mono tabular-nums">
                    {post.joinedCount} / {post.slotNeeded}
                  </span> slot terisi
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleChatWA(post.contactWa, `${post.teamName} (${post.date})`)}
                    className="p-2 text-emerald-700 hover:bg-emerald-50 border border-emerald-300 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors"
                    title="Hubungi via WhatsApp"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>WhatsApp</span>
                  </button>

                  <button
                    disabled={isFull}
                    onClick={() => handleJoin(post.id)}
                    className={`px-3.5 py-2 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 ${
                      isFull
                        ? 'bg-neutral-200 text-neutral-500 cursor-not-allowed'
                        : joinedSuccessId === post.id
                        ? 'bg-emerald-600 text-white'
                        : 'bg-neutral-900 hover:bg-neutral-800 text-white'
                    }`}
                  >
                    {joinedSuccessId === post.id ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Tergabung!</span>
                      </>
                    ) : isFull ? (
                      <span>Slot Penuh</span>
                    ) : (
                      <span>Ikut Mabar (+1)</span>
                    )}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal Buat Jadwal Mabar */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/70 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-neutral-200 overflow-hidden my-8">
            <div className="p-4 bg-neutral-900 text-white flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white">Buat Jadwal Mabar / Cari Lawan Baru</h3>
                <p className="text-xs text-neutral-400">Postingan Anda akan tampil secara real-time ke seluruh komunitas</p>
              </div>
              <button
                onClick={() => setIsCreateOpen(false)}
                className="text-neutral-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreatePost} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Pilih Lapangan Venue
                </label>
                <select
                  value={courtId}
                  onChange={(e) => setCourtId(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                >
                  {COURTS.map(c => (
                    <option key={c.id} value={c.id}>
                      [{c.sport.toUpperCase()}] {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    Tanggal Main
                  </label>
                  <input
                    type="date"
                    required
                    value={date}
                    min={getTodayString(0)}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    Jam Main
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: 19:00 - 21:00"
                    value={timeSlot}
                    onChange={(e) => setTimeSlot(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    Nama Penyelenggara / Kontak
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Nama Anda"
                    value={creatorName}
                    onChange={(e) => setCreatorName(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    Nama Tim / Komunitas
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: Smashers Club"
                    value={teamName}
                    onChange={(e) => setTeamName(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    Level Main
                  </label>
                  <select
                    value={level}
                    onChange={(e) => setLevel(e.target.value as any)}
                    className="w-full px-2 py-2 text-xs border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                  >
                    <option value="Semua Level">Semua Level</option>
                    <option value="Pemula">Pemula</option>
                    <option value="Menengah">Menengah</option>
                    <option value="Kompetitif">Kompetitif</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    Slot Dicari
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="20"
                    value={slotNeeded}
                    onChange={(e) => setSlotNeeded(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    Biaya / Orang (Rp)
                  </label>
                  <input
                    type="number"
                    step="5000"
                    value={costPerPerson}
                    onChange={(e) => setCostPerPerson(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Nomor WhatsApp Pembuat
                </label>
                <input
                  type="tel"
                  required
                  placeholder="0812xxxxxxxx"
                  value={contactWa}
                  onChange={(e) => setContactWa(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Catatan / Syarat Khusus
                </label>
                <textarea
                  rows={2}
                  placeholder="Contoh: Kok sudah disiapkan panitia, wajib bawa sepatu non-marking."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="pt-3 border-t border-neutral-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-neutral-600 hover:text-neutral-900"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm"
                >
                  Publikasikan Jadwal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
