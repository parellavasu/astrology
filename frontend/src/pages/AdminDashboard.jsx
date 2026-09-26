import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Loader2, Send 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

export default function AdminDashboard() {
  const { user, isAdmin, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [stats, setStats] = useState(null);
  const [usersList, setUsersList] = useState([]);
  const [astrologersList, setAstrologersList] = useState([]);
  const [ordersList, setOrdersList] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);

  // Article creation form state
  const [articleForm, setArticleForm] = useState({
    title: '',
    category: 'Vedic Astrology',
    shortDescription: '',
    content: '',
    coverImage: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80',
    tags: 'Vedic Astrology, Kundli'
  });
  const [publishing, setPublishing] = useState(false);
  const [publishSuccess, setPublishSuccess] = useState('');

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    if (!isAdmin) {
      navigate('/dashboard');
      return;
    }

    const fetchAdminData = async () => {
      setLoading(true);
      try {
        const [statsRes, usersRes, astroRes, ordersRes] = await Promise.all([
          api.get('/admin/stats'),
          api.get('/admin/users'),
          api.get('/admin/astrologers'),
          api.get('/admin/orders')
        ]);

        if (statsRes.data.success) setStats(statsRes.data.stats);
        if (usersRes.data.success) setUsersList(usersRes.data.users);
        if (astroRes.data.success) setAstrologersList(astroRes.data.astrologers);
        if (ordersRes.data.success) setOrdersList(ordersRes.data.orders);
      } catch (err) {
        console.error('Failed to load admin data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAdminData();
  }, [isAuthenticated, isAdmin, navigate]);

  const handleToggleUserStatus = async (userId) => {
    try {
      const res = await api.patch(`/admin/users/${userId}/status`);
      if (res.data.success) {
        setUsersList(usersList.map(u => u._id === userId ? { ...u, isVerified: res.data.user.isVerified } : u));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleAstroVerify = async (astroId) => {
    try {
      const res = await api.patch(`/admin/astrologers/${astroId}/verify`);
      if (res.data.success) {
        setAstrologersList(astrologersList.map(a => a._id === astroId ? { ...a, isVerified: res.data.astrologer.isVerified } : a));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdatePrice = async (astroId, newPrice) => {
    try {
      const res = await api.patch(`/admin/astrologers/${astroId}/pricing`, { perMinuteRate: newPrice });
      if (res.data.success) {
        setAstrologersList(astrologersList.map(a => a._id === astroId ? { ...a, perMinuteRate: newPrice } : a));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateArticle = async (e) => {
    e.preventDefault();
    setPublishing(true);
    setPublishSuccess('');
    try {
      const res = await api.post('/admin/articles', {
        ...articleForm,
        tags: articleForm.tags.split(',').map(t => t.trim())
      });
      if (res.data.success) {
        setPublishSuccess('Article published successfully into Vedic magazine!');
        setArticleForm({
          title: '',
          category: 'Vedic Astrology',
          shortDescription: '',
          content: '',
          coverImage: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80',
          tags: 'Vedic Astrology, Kundli'
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setPublishing(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center">
        <Loader2 className="w-8 h-8 text-orange-600 animate-spin mx-auto mb-3" />
        <p className="text-xs text-slate-500">Loading JyotirVeda Administrator Console...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Top Banner */}
      <div className="vedic-card p-6 sm:p-8 bg-white shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold text-orange-700 uppercase tracking-wider block">Admin Management Console</span>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900">Platform Governance</h1>
            <p className="text-xs text-slate-500">Control users, verify astrologers, audit consultations, and manage Vedic magazine content.</p>
          </div>
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 font-mono">
            Admin: {user?.email}
          </span>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="vedic-card p-5 bg-white shadow-xs">
          <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Total Users</span>
          <span className="text-2xl font-bold font-mono text-slate-900">{stats?.totalUsers || 1420}</span>
        </div>
        <div className="vedic-card p-5 bg-white shadow-xs">
          <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Verified Astrologers</span>
          <span className="text-2xl font-bold font-mono text-orange-700">{stats?.totalAstrologers || 24}</span>
        </div>
        <div className="vedic-card p-5 bg-white shadow-xs">
          <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Consultations</span>
          <span className="text-2xl font-bold font-mono text-sky-700">{stats?.totalConsultations || 3640}</span>
        </div>
        <div className="vedic-card p-5 bg-white shadow-xs">
          <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Kundlis Generated</span>
          <span className="text-2xl font-bold font-mono text-emerald-700">{stats?.totalReports || 8920}</span>
        </div>
        <div className="vedic-card p-5 col-span-2 md:col-span-1 bg-white shadow-xs">
          <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Total Revenue</span>
          <span className="text-2xl font-bold font-mono text-orange-600">₹{(stats?.totalRevenue || 485200).toLocaleString()}</span>
        </div>
      </div>

      {/* Admin Tabs */}
      <div className="flex items-center space-x-2 border-b border-slate-200 pb-1 overflow-x-auto no-scrollbar">
        {[
          { id: 'overview', label: 'Overview' },
          { id: 'users', label: `Users (${usersList.length})` },
          { id: 'astrologers', label: `Astrologers (${astrologersList.length})` },
          { id: 'orders', label: `Orders (${ordersList.length})` },
          { id: 'articles', label: 'Publish Article' }
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={`px-4 py-2 rounded-t-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === t.id
                ? 'bg-orange-50 text-orange-800 border-b-2 border-orange-600 font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab: Users Management */}
      {activeTab === 'users' && (
        <div className="vedic-card overflow-hidden bg-white shadow-sm">
          <div className="p-4 border-b border-slate-200 flex justify-between items-center">
            <h3 className="text-base font-serif font-bold text-slate-900">Registered Users</h3>
            <span className="text-xs text-slate-500 font-mono">Total {usersList.length} accounts</span>
          </div>

          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Name</th>
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">Wallet</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {usersList.map((u) => (
                <tr key={u._id} className="hover:bg-slate-50/50">
                  <td className="py-3 px-4 font-bold text-slate-900">{u.name}</td>
                  <td className="py-3 px-4 text-slate-500 font-mono">{u.email}</td>
                  <td className="py-3 px-4 uppercase text-[10px] font-bold text-orange-700">{u.role}</td>
                  <td className="py-3 px-4 font-mono font-bold text-slate-800">₹{u.walletBalance || 0}</td>
                  <td className="py-3 px-4">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      u.isVerified ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-rose-50 text-rose-800 border border-rose-200'
                    }`}>
                      {u.isVerified ? 'Active' : 'Suspended'}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => handleToggleUserStatus(u._id)}
                      className="text-xs text-orange-600 hover:text-orange-700 underline cursor-pointer font-medium"
                    >
                      {u.isVerified ? 'Suspend' : 'Activate'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Tab: Astrologers Management */}
      {activeTab === 'astrologers' && (
        <div className="vedic-card overflow-hidden bg-white shadow-sm">
          <div className="p-4 border-b border-slate-200 flex justify-between items-center">
            <h3 className="text-base font-serif font-bold text-slate-900">Astrologers Directory</h3>
            <span className="text-xs text-slate-500 font-mono">Manage rates and verified status</span>
          </div>

          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Astrologer</th>
                <th className="py-3 px-4">Title</th>
                <th className="py-3 px-4">Experience</th>
                <th className="py-3 px-4">Rate (₹/min)</th>
                <th className="py-3 px-4">Verified</th>
                <th className="py-3 px-4">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {astrologersList.map((a) => (
                <tr key={a._id} className="hover:bg-slate-50/50">
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-2.5">
                      <img src={a.avatar} alt={a.displayName} className="w-8 h-8 rounded-full object-cover border border-slate-200" />
                      <span className="font-bold text-slate-900">{a.displayName}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-slate-500">{a.title}</td>
                  <td className="py-3 px-4 text-slate-700">{a.experienceYears} Years</td>
                  <td className="py-3 px-4 font-bold text-orange-700">
                    <input
                      type="number"
                      defaultValue={a.perMinuteRate}
                      onBlur={(e) => handleUpdatePrice(a._id, e.target.value)}
                      className="w-16 px-2 py-1 bg-white border border-slate-300 rounded text-center text-xs font-mono text-slate-900 focus:border-orange-500"
                    />
                  </td>
                  <td className="py-3 px-4">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      a.isVerified ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-amber-50 text-amber-800 border border-amber-200'
                    }`}>
                      {a.isVerified ? 'Verified' : 'Pending'}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => handleToggleAstroVerify(a._id)}
                      className="text-xs text-orange-600 hover:text-orange-700 underline cursor-pointer font-medium"
                    >
                      {a.isVerified ? 'Revoke Badge' : 'Verify'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Tab: Orders & Payments */}
      {activeTab === 'orders' && (
        <div className="vedic-card overflow-hidden bg-white shadow-sm">
          <div className="p-4 border-b border-slate-200">
            <h3 className="text-base font-serif font-bold text-slate-900">All Transactions & Payments</h3>
          </div>

          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Order Ref</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Service</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {ordersList.map((o) => (
                <tr key={o._id} className="hover:bg-slate-50/50">
                  <td className="py-3 px-4 font-mono text-orange-700 font-semibold">{o.orderId}</td>
                  <td className="py-3 px-4 text-slate-700">{o.user?.name || 'Customer'}</td>
                  <td className="py-3 px-4 text-slate-800 font-medium">{o.itemName}</td>
                  <td className="py-3 px-4 font-bold text-slate-900">₹{o.amount}</td>
                  <td className="py-3 px-4">
                    <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full capitalize">
                      {o.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-500">{new Date(o.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Tab: Publish Article */}
      {activeTab === 'articles' && (
        <div className="vedic-card p-6 sm:p-10 space-y-6 max-w-3xl mx-auto bg-white shadow-sm">
          <div className="pb-3 border-b border-slate-200">
            <h3 className="text-lg font-serif font-bold text-slate-900">Publish New Astrology Article</h3>
            <p className="text-xs text-slate-500">Content will immediately be published into the public Vedic editorial section.</p>
          </div>

          {publishSuccess && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl font-medium">
              {publishSuccess}
            </div>
          )}

          <form onSubmit={handleCreateArticle} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Article Title</label>
              <input
                type="text"
                required
                placeholder="e.g. Navamsha Chart Secrets for Marriage"
                value={articleForm.title}
                onChange={(e) => setArticleForm({ ...articleForm, title: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Category</label>
                <select
                  value={articleForm.category}
                  onChange={(e) => setArticleForm({ ...articleForm, category: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                >
                  {['Vedic Astrology', 'Kundli', 'Marriage', 'Career', 'Planets', 'Houses', 'Panchang', 'Remedies'].map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Tags (Comma Separated)</label>
                <input
                  type="text"
                  value={articleForm.tags}
                  onChange={(e) => setArticleForm({ ...articleForm, tags: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Short Description / Excerpt</label>
              <textarea
                rows="2"
                required
                value={articleForm.shortDescription}
                onChange={(e) => setArticleForm({ ...articleForm, shortDescription: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Full Article Content (Markdown format supported)</label>
              <textarea
                rows="8"
                required
                value={articleForm.content}
                onChange={(e) => setArticleForm({ ...articleForm, content: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
              />
            </div>

            <button
              type="submit"
              disabled={publishing}
              className="vedic-btn-primary w-full py-3 text-xs flex items-center justify-center space-x-2 cursor-pointer"
            >
              <span>{publishing ? 'Publishing...' : 'Publish Article'}</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      )}

      {/* Tab: Overview (Default) */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="vedic-card p-6 space-y-4 bg-white shadow-xs">
            <h3 className="text-base font-serif font-bold text-slate-900">Recent Consultations</h3>
            <div className="divide-y divide-slate-100 text-xs">
              {stats?.recentConsultations?.map((c, i) => (
                <div key={i} className="py-2.5 flex justify-between items-center">
                  <span className="text-slate-800">{c.user?.name} with {c.astrologer?.displayName}</span>
                  <span className="text-orange-700 font-mono font-bold">₹{c.totalCost}</span>
                </div>
              )) || <p className="text-slate-500">No recent consultations</p>}
            </div>
          </div>

          <div className="vedic-card p-6 space-y-4 bg-white shadow-xs">
            <h3 className="text-base font-serif font-bold text-slate-900">Recent Financial Transactions</h3>
            <div className="divide-y divide-slate-100 text-xs">
              {stats?.recentOrders?.map((o, i) => (
                <div key={i} className="py-2.5 flex justify-between items-center">
                  <span className="text-slate-800">{o.itemName} ({o.user?.name})</span>
                  <span className="text-emerald-700 font-bold font-mono">₹{o.amount}</span>
                </div>
              )) || <p className="text-slate-500">No recent transactions</p>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
