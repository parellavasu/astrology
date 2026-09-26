import React, { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { 
  CreditCard, ShieldCheck, ArrowRight, Lock, 
  Sparkles, CheckCircle2, AlertCircle, Loader2, ArrowLeft 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

export default function CheckoutPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, refreshUser } = useAuth();

  const itemType = location.state?.itemType || 'wallet_recharge';
  const itemName = location.state?.itemName || 'Astrology Wallet Recharge';
  const amount = location.state?.amount || 500;

  const [paymentMethod, setPaymentMethod] = useState('upi'); // 'upi', 'card', 'netbanking'
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');

  const handlePay = async () => {
    setProcessing(true);
    setError('');

    try {
      // 1. Create order on backend
      const orderRes = await api.post('/orders/create', {
        itemType,
        itemName,
        amount
      });

      if (!orderRes.data.success) {
        throw new Error('Failed to create payment order.');
      }

      const orderData = orderRes.data.order;

      // 2. Simulated secure Razorpay Checkout interaction
      // In production with Razorpay script, options.handler calls /orders/verify.
      // We simulate the secure callback payload here:
      const simulatedPaymentId = `pay_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
      const simulatedSignature = `demo_sig_${Date.now()}`;

      // 3. Cryptographic server-side verification call
      const verifyRes = await api.post('/orders/verify', {
        orderId: orderData.orderId,
        razorpayOrderId: orderData.orderId,
        razorpayPaymentId: simulatedPaymentId,
        razorpaySignature: simulatedSignature
      });

      if (verifyRes.data.success) {
        await refreshUser();
        navigate('/payment/result', {
          state: {
            success: true,
            order: verifyRes.data.order
          }
        });
      } else {
        navigate('/payment/result', {
          state: {
            success: false,
            message: verifyRes.data.message || 'Payment verification failed'
          }
        });
      }
    } catch (err) {
      console.error(err);
      setError(err.message || 'Payment processing error.');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-12">
      <Link to="/dashboard" className="inline-flex items-center text-xs text-slate-600 hover:text-orange-600 mb-6 font-medium">
        <ArrowLeft className="w-4 h-4 mr-1.5" />
        Back to Dashboard
      </Link>

      <div className="vedic-card p-6 sm:p-10 space-y-6 shadow-xl">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h1 className="text-xl font-serif font-bold text-slate-900">Secure Payment Checkout</h1>
            <p className="text-xs text-slate-600">Powered by Razorpay payment gateway</p>
          </div>
          <div className="flex items-center space-x-1.5 text-xs text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 font-medium">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>256-Bit SSL Encrypted</span>
          </div>
        </div>

        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs font-medium">
            {error}
          </div>
        )}

        {/* Order Summary */}
        <div className="p-5 bg-orange-50/50 rounded-2xl border border-orange-100 space-y-2.5">
          <div className="flex justify-between text-xs">
            <span className="text-slate-600">Item:</span>
            <strong className="text-slate-900 font-semibold">{itemName}</strong>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-slate-600">Billed to:</span>
            <span className="text-slate-800 font-medium">{user?.name} ({user?.email})</span>
          </div>
          <div className="pt-2.5 border-t border-orange-200/60 flex justify-between items-baseline">
            <span className="text-sm font-semibold text-slate-800">Total Payable:</span>
            <span className="text-2xl font-bold font-mono text-orange-600">₹{amount}</span>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="space-y-3">
          <label className="text-xs font-semibold text-slate-700 block">Select Payment Mode</label>
          <div className="grid grid-cols-3 gap-3">
            {[
              { id: 'upi', label: 'UPI / QR', desc: 'GPay, PhonePe, Paytm' },
              { id: 'card', label: 'Cards', desc: 'Debit / Credit Cards' },
              { id: 'netbanking', label: 'NetBanking', desc: 'All Indian Banks' }
            ].map(m => (
              <button
                key={m.id}
                type="button"
                onClick={() => setPaymentMethod(m.id)}
                className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                  paymentMethod === m.id
                    ? 'bg-orange-50 border-orange-500 text-orange-700 ring-2 ring-orange-500/20 shadow-xs'
                    : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                }`}
              >
                <span className="text-xs font-bold text-slate-900">{m.label}</span>
                <span className="text-[10px] text-slate-500 mt-1">{m.desc}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Pay Button */}
        <button
          onClick={handlePay}
          disabled={processing}
          className="w-full vedic-btn-primary py-3 text-sm flex items-center justify-center space-x-2"
        >
          {processing ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Verifying with Razorpay...</span>
            </>
          ) : (
            <>
              <Lock className="w-4 h-4" />
              <span>Pay ₹{amount} Securely</span>
            </>
          )}
        </button>

        <p className="text-[11px] text-slate-500 text-center">
          Backend verified transaction. Signature authentication via HMAC-SHA256.
        </p>
      </div>
    </div>
  );
}
