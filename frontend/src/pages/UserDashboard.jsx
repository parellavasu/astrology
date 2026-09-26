import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  User, Compass, HeartHandshake, MessageSquare, CreditCard, 
  Plus, Trash2, Calendar, Clock, MapPin, 
  ArrowRight, Wallet, Loader2 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import CityAutocomplete from '../components/common/CityAutocomplete';
import api from '../services/api';

export default function UserDashboard() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [activeSection, setActiveSection] = useState('profiles');
  const [profiles, setProfiles] = useState([]);
  const [kundlis, setKundlis] = useState([]);
  const [matches, setMatches] = useState([]);
  const [consultations, setConsultations] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // New Profile Form modal
  const [showAddProfile, setShowAddProfile] = useState(false);
  const [newProfile, setNewProfile] = useState({
    name: '',
    relation: 'Myself',
    gender: 'male',
    dob: '',
    tob: '',
    place: '',
    latitude: 28.6139,
    longitude: 77.2090,
    timezone: 5.5
  });
  const [savingProfile, setSavingProfile] = useState(false);

  // Wallet recharge amount
  const [rechargeAmount, setRechargeAmount] = useState(500);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        const [profRes, kundliRes, matchRes, consultRes, ordRes] = await Promise.all([
          api.get('/birth-profiles'),
          api.get('/kundli/my-kundlis'),
          api.get('/matching/my-matches'),
          api.get('/consultations'),
          api.get('/orders/my-orders')
        ]);

        if (profRes.data.success) setProfiles(profRes.data.profiles);
        if (kundliRes.data.success) setKundlis(kundliRes.data.kundlis);
        if (matchRes.data.success) setMatches(matchRes.data.matches);
        if (consultRes.data.success) setConsultations(consultRes.data.history);
        if (ordRes.data.success) setOrders(ordRes.data.orders);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [isAuthenticated, navigate]);

  const handleCreateProfile = async (e) => {
    e.preventDefault();
    if (!newProfile.name || !newProfile.dob || !newProfile.tob || !newProfile.place) return;

    setSavingProfile(true);
    try {
      const res = await api.post('/birth-profiles', newProfile);
      if (res.data.success) {
        setProfiles([res.data.profile, ...profiles]);
        setShowAddProfile(false);
        setNewProfile({
          name: '',
          relation: 'Custom Profile',
          gender: 'male',
          dob: '',
          tob: '',
          place: '',
          latitude: 28.6139,
          longitude: 77.2090,
          timezone: 5.5
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSavingProfile(false);
    }
  };

  const handleDeleteProfile = async (id) => {
    try {
      await api.delete(`/birth-profiles/${id}`);
      setProfiles(profiles.filter(p => p._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const handleGenerateFromProfile = async (p) => {
    try {
      const res = await api.post('/kundli/calculate', {
        name: p.name,
        gender: p.gender,
        dob: p.dob,
        tob: p.tob,
        place: p.place,
        latitude: p.latitude,
        longitude: p.longitude,
        timezone: p.timezone,
        saveToProfile: true
      });
      if (res.data.success) {
        sessionStorage.setItem('jyotirveda_active_kundli', JSON.stringify(res.data.data));
        navigate('/kundli/result', { state: { kundliData: res.data.data } });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleWalletRecharge = () => {
    navigate('/checkout', {
      state: {
        itemType: 'wallet_recharge',
        itemName: `Wallet Recharge (₹${rechargeAmount})`,
        amount: rechargeAmount
      }
    });
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center">
        <Loader2 className="w-8 h-8 text-orange-600 animate-spin mx-auto mb-3" />
        <p className="text-xs text-slate-500">Loading your astrology sanctuary...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Welcome Banner */}
      <div className="vedic-card p-6 sm:p-8 mb-8 bg-white shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-orange-700">Namaste & Welcome Back</span>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900">
              {user?.name}
            </h1>
            <p className="text-xs text-slate-500">
              Manage your saved birth profiles, Janam Kundlis, compatibility records, and consultations.
            </p>
          </div>

          <div className="flex items-center space-x-4">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center">
              <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-medium">Astrology Wallet</span>
              <span className="text-lg font-bold font-mono text-orange-600">₹{user?.walletBalance || 0}</span>
            </div>
            <button
              onClick={() => setActiveSection('wallet')}
              className="vedic-btn-primary text-xs py-2 px-3.5 cursor-pointer"
            >
              Add Funds
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Navigation Sidebar */}
        <div className="lg:col-span-3 space-y-1 bg-white border border-slate-200 rounded-2xl p-2.5 shadow-xs">
          {[
            { id: 'profiles', label: 'Saved Birth Profiles', icon: User, count: profiles.length },
            { id: 'kundlis', label: 'My Saved Kundlis', icon: Compass, count: kundlis.length },
            { id: 'matching', label: 'Matching Reports', icon: HeartHandshake, count: matches.length },
            { id: 'consultations', label: 'Consultations', icon: MessageSquare, count: consultations.length },
            { id: 'orders', label: 'Orders & Payments', icon: CreditCard, count: orders.length },
            { id: 'wallet', label: 'Astrology Wallet', icon: Wallet }
          ].map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-orange-50 text-orange-800 border border-orange-200 font-bold shadow-2xs'
                    : 'text-slate-600 hover:text-orange-950 hover:bg-orange-50/40'
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <Icon className="w-4 h-4 text-orange-600" />
                  <span>{item.label}</span>
                </div>
                {item.count !== undefined && (
                  <span className="text-[10px] font-mono text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200">
                    {item.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Main Content Area */}
        <div className="lg:col-span-9">
          {/* Section 1: Saved Birth Profiles */}
          {activeSection === 'profiles' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <div>
                  <h3 className="text-lg font-serif font-bold text-slate-900">Saved Family Birth Profiles</h3>
                  <p className="text-xs text-slate-500">Save profiles for yourself, partner, parents, or children for 1-click Kundli generation.</p>
                </div>
                <button
                  onClick={() => setShowAddProfile(true)}
                  className="vedic-btn-primary text-xs py-2 px-3.5 flex items-center space-x-1.5 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Profile</span>
                </button>
              </div>

              {profiles.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {profiles.map((p) => (
                    <div key={p._id} className="vedic-card p-5 space-y-3 flex flex-col justify-between bg-white shadow-xs">
                      <div className="space-y-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="text-[10px] font-bold text-orange-700 bg-orange-50 px-2 py-0.5 rounded-full border border-orange-200">
                              {p.relation}
                            </span>
                            <h4 className="text-base font-bold text-slate-900 mt-1">{p.name}</h4>
                          </div>
                          <button
                            onClick={() => handleDeleteProfile(p._id)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                            title="Delete Profile"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="space-y-1 text-xs text-slate-600">
                          <p className="flex items-center"><Calendar className="w-3.5 h-3.5 mr-1.5 text-orange-600" /> {p.dob}</p>
                          <p className="flex items-center"><Clock className="w-3.5 h-3.5 mr-1.5 text-orange-600" /> {p.tob}</p>
                          <p className="flex items-center"><MapPin className="w-3.5 h-3.5 mr-1.5 text-orange-600" /> {p.place}</p>
                        </div>
                      </div>

                      <div className="pt-3 border-t border-slate-100">
                        <button
                          onClick={() => handleGenerateFromProfile(p)}
                          className="w-full vedic-btn-secondary text-xs py-2 flex items-center justify-center space-x-1.5 cursor-pointer"
                        >
                          <Compass className="w-3.5 h-3.5" />
                          <span>Generate Kundli</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="vedic-card p-8 text-center text-slate-500 space-y-2 bg-white shadow-xs">
                  <p>You haven't saved any birth profiles yet.</p>
                  <button onClick={() => setShowAddProfile(true)} className="text-xs text-orange-600 font-semibold underline cursor-pointer">Add your first profile now</button>
                </div>
              )}
            </div>
          )}

          {/* Section 2: Saved Kundlis */}
          {activeSection === 'kundlis' && (
            <div className="space-y-6">
              <div className="pb-3 border-b border-slate-200">
                <h3 className="text-lg font-serif font-bold text-slate-900">My Saved Kundlis</h3>
                <p className="text-xs text-slate-500">View and review your previously calculated Vedic horoscopes.</p>
              </div>

              {kundlis.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {kundlis.map((k) => (
                    <div key={k._id} className="vedic-card p-5 space-y-3 bg-white shadow-xs">
                      <div>
                        <h4 className="text-base font-bold text-slate-900">{k.name}’s Chart</h4>
                        <p className="text-xs text-slate-500">{k.place} • {k.dob} at {k.tob}</p>
                      </div>

                      <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <span className="text-[10px] text-slate-500 block">Lagna:</span>
                          <strong className="text-orange-700">{k.basicInfo?.ascendant}</strong>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-500 block">Rashi:</span>
                          <strong className="text-orange-700">{k.basicInfo?.moonSign}</strong>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-500 block">Nakshatra:</span>
                          <strong className="text-slate-800">{k.basicInfo?.nakshatra}</strong>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-500 block">Dasha:</span>
                          <strong className="text-emerald-700">{k.basicInfo?.currentMahadasha}</strong>
                        </div>
                      </div>

                      <div className="pt-2">
                        <Link
                          to={`/kundli/${k._id}`}
                          className="w-full vedic-btn-primary text-xs py-2 flex items-center justify-center space-x-1.5"
                        >
                          <span>Open Full Kundli</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="vedic-card p-8 text-center text-slate-500 space-y-2 bg-white shadow-xs">
                  <p>No saved Kundlis found.</p>
                  <Link to="/kundli" className="text-xs text-orange-600 font-semibold underline">Generate a new Kundli</Link>
                </div>
              )}
            </div>
          )}

          {/* Section 3: Matching Reports */}
          {activeSection === 'matching' && (
            <div className="space-y-6">
              <div className="pb-3 border-b border-slate-200">
                <h3 className="text-lg font-serif font-bold text-slate-900">Saved Matching Reports</h3>
                <p className="text-xs text-slate-500">History of your 36-point Ashtakoota compatibility evaluations.</p>
              </div>

              {matches.length > 0 ? (
                <div className="space-y-3">
                  {matches.map((m) => (
                    <div key={m._id} className="vedic-card p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white shadow-xs">
                      <div>
                        <h4 className="text-base font-serif font-bold text-slate-900">
                          {m.person1.name} & {m.person2.name}
                        </h4>
                        <p className="text-xs text-slate-500 mt-0.5">
                          {m.person1.moonSign} Rashi ({m.person1.nakshatra}) + {m.person2.moonSign} Rashi ({m.person2.nakshatra})
                        </p>
                      </div>

                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <span className="text-xl font-bold font-serif text-orange-600">{m.totalScore}/36</span>
                          <span className="text-[11px] block text-slate-500 font-medium">{m.verdict}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="vedic-card p-8 text-center text-slate-500 space-y-2 bg-white shadow-xs">
                  <p>No compatibility reports saved yet.</p>
                  <Link to="/matching" className="text-xs text-orange-600 font-semibold underline">Check compatibility now</Link>
                </div>
              )}
            </div>
          )}

          {/* Section 4: Consultations */}
          {activeSection === 'consultations' && (
            <div className="space-y-6">
              <div className="pb-3 border-b border-slate-200">
                <h3 className="text-lg font-serif font-bold text-slate-900">Consultation History</h3>
                <p className="text-xs text-slate-500">Review your past conversations with verified astrologers.</p>
              </div>

              {consultations.length > 0 ? (
                <div className="space-y-3">
                  {consultations.map((c) => (
                    <div key={c._id} className="vedic-card p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white shadow-xs">
                      <div className="flex items-center space-x-3">
                        <img
                          src={c.astrologer?.avatar}
                          alt={c.astrologer?.displayName}
                          className="w-10 h-10 rounded-full object-cover border border-orange-200"
                        />
                        <div>
                          <p className="text-sm font-bold text-slate-900">{c.astrologer?.displayName}</p>
                          <p className="text-xs text-slate-500 font-mono">
                            {new Date(c.startedAt).toLocaleDateString()} • {c.durationMinutes} mins • ₹{c.totalCost}
                          </p>
                        </div>
                      </div>

                      <Link
                        to={`/consultation/${c._id}`}
                        className="vedic-btn-secondary text-xs py-1.5 px-3"
                      >
                        Open Chat Log
                      </Link>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="vedic-card p-8 text-center text-slate-500 space-y-2 bg-white shadow-xs">
                  <p>No consultations booked yet.</p>
                  <Link to="/astrologers" className="text-xs text-orange-600 font-semibold underline">Browse verified astrologers</Link>
                </div>
              )}
            </div>
          )}

          {/* Section 5: Orders & Payments */}
          {activeSection === 'orders' && (
            <div className="space-y-6">
              <div className="pb-3 border-b border-slate-200">
                <h3 className="text-lg font-serif font-bold text-slate-900">Order & Payment Receipts</h3>
                <p className="text-xs text-slate-500">All transactions authenticated via backend payment verification.</p>
              </div>

              {orders.length > 0 ? (
                <div className="vedic-card overflow-hidden bg-white shadow-xs">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
                      <tr>
                        <th className="py-3 px-4">Order ID</th>
                        <th className="py-3 px-4">Service</th>
                        <th className="py-3 px-4">Amount</th>
                        <th className="py-3 px-4">Date</th>
                        <th className="py-3 px-4">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {orders.map((o) => (
                        <tr key={o._id} className="hover:bg-slate-50/50">
                          <td className="py-3 px-4 font-mono text-orange-700 font-semibold">{o.orderId}</td>
                          <td className="py-3 px-4 text-slate-800 font-medium">{o.itemName}</td>
                          <td className="py-3 px-4 font-bold text-slate-900">₹{o.amount}</td>
                          <td className="py-3 px-4 text-slate-500">{new Date(o.createdAt).toLocaleDateString()}</td>
                          <td className="py-3 px-4">
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${
                              o.status === 'paid' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-rose-50 text-rose-800 border border-rose-200'
                            }`}>
                              {o.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="vedic-card p-8 text-center text-slate-500 bg-white shadow-xs">
                  No payment orders found.
                </div>
              )}
            </div>
          )}

          {/* Section 6: Wallet Recharge */}
          {activeSection === 'wallet' && (
            <div className="vedic-card p-6 sm:p-8 space-y-6 bg-white shadow-sm">
              <div>
                <h3 className="text-lg font-serif font-bold text-slate-900">Astrology Wallet</h3>
                <p className="text-xs text-slate-500">Add funds for seamless, uninterrupted astrologer consultations.</p>
              </div>

              <div className="p-6 bg-orange-50/60 rounded-2xl border border-orange-200 flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-600 block font-medium">Available Balance</span>
                  <span className="text-3xl font-bold font-mono text-orange-700">₹{user?.walletBalance || 0}</span>
                </div>
                <div className="w-12 h-12 rounded-xl bg-orange-100 border border-orange-200 flex items-center justify-center text-orange-600">
                  <Wallet className="w-6 h-6" />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-xs font-semibold text-slate-700 block">Select Recharge Amount</label>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                  {[200, 500, 1000, 2500].map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => setRechargeAmount(amt)}
                      className={`py-3 rounded-xl text-sm font-bold transition-all cursor-pointer ${
                        rechargeAmount === amt
                          ? 'bg-orange-600 text-white shadow-xs'
                          : 'bg-white text-slate-700 border border-slate-200 hover:border-orange-300 hover:bg-orange-50/40 shadow-2xs'
                      }`}
                    >
                      ₹{amt}
                    </button>
                  ))}
                </div>

                <div className="pt-4">
                  <button
                    onClick={handleWalletRecharge}
                    className="vedic-btn-primary w-full py-3 text-sm flex items-center justify-center space-x-2 cursor-pointer"
                  >
                    <span>Proceed to Pay ₹{rechargeAmount} via Razorpay</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add Profile Modal */}
      {showAddProfile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl">
            <h3 className="text-lg font-serif font-bold text-slate-900 mb-4">Add Family Birth Profile</h3>
            <form onSubmit={handleCreateProfile} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Relation</label>
                <select
                  value={newProfile.relation}
                  onChange={(e) => setNewProfile({ ...newProfile, relation: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                >
                  {['Myself', 'Partner', 'Mother', 'Father', 'Child', 'Custom Profile'].map(r => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Sharma"
                  value={newProfile.name}
                  onChange={(e) => setNewProfile({ ...newProfile, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Birth Date</label>
                  <input
                    type="date"
                    required
                    value={newProfile.dob}
                    onChange={(e) => setNewProfile({ ...newProfile, dob: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Birth Time</label>
                  <input
                    type="time"
                    required
                    value={newProfile.tob}
                    onChange={(e) => setNewProfile({ ...newProfile, tob: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Birth City</label>
                <CityAutocomplete
                  value={newProfile.place}
                  onChange={(val) => setNewProfile(prev => ({ ...prev, place: val }))}
                  onSelectCity={(c) => {
                    setNewProfile(prev => ({
                      ...prev,
                      place: `${c.name}, ${c.country}`,
                      latitude: c.lat,
                      longitude: c.lng,
                      timezone: c.tz
                    }));
                  }}
                />
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddProfile(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 text-xs font-medium cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingProfile}
                  className="vedic-btn-primary px-4 py-2 text-xs cursor-pointer"
                >
                  {savingProfile ? 'Saving...' : 'Save Profile'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
