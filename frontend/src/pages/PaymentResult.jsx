import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { CheckCircle2, XCircle, ArrowRight, ShieldCheck } from 'lucide-react';

export default function PaymentResult() {
  const location = useLocation();
  const isSuccess = location.state?.success ?? true;
  const order = location.state?.order;
  const message = location.state?.message;

  return (
    <div className="max-w-md mx-auto px-4 py-20">
      <div className="vedic-card p-6 sm:p-10 text-center space-y-6 shadow-xl">
        {isSuccess ? (
          <>
            <div className="w-16 h-16 rounded-full bg-emerald-50 border-2 border-emerald-200 flex items-center justify-center text-emerald-600 mx-auto shadow-sm">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <h1 className="text-2xl font-serif font-bold text-slate-900">Payment Successful</h1>
              <p className="text-xs text-slate-600">Your transaction has been securely confirmed and recorded.</p>
            </div>

            {order && (
              <div className="p-4.5 bg-orange-50/50 rounded-2xl border border-orange-100 text-xs space-y-2.5 text-left">
                <div className="flex justify-between">
                  <span className="text-slate-600">Order ID:</span>
                  <span className="font-mono text-orange-600 font-bold">{order.orderId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Item:</span>
                  <span className="text-slate-900 font-medium">{order.itemName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Amount Paid:</span>
                  <span className="font-mono text-emerald-700 font-bold">₹{order.amount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Payment Ref:</span>
                  <span className="font-mono text-slate-500 text-[10px]">{order.paymentId}</span>
                </div>
              </div>
            )}

            <div className="pt-2 flex flex-col sm:flex-row gap-3">
              <Link to="/dashboard" className="flex-1 vedic-btn-primary py-2.5 text-xs">
                Go to Dashboard
              </Link>
              <Link to="/astrologers" className="flex-1 vedic-btn-secondary py-2.5 text-xs">
                Consult Astrologer
              </Link>
            </div>
          </>
        ) : (
          <>
            <div className="w-16 h-16 rounded-full bg-rose-50 border-2 border-rose-200 flex items-center justify-center text-rose-600 mx-auto shadow-sm">
              <XCircle className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <h1 className="text-2xl font-serif font-bold text-slate-900">Payment Unsuccessful</h1>
              <p className="text-xs text-slate-600">{message || 'Your transaction could not be verified by the gateway.'}</p>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row gap-3">
              <Link to="/dashboard" className="flex-1 vedic-btn-secondary py-2.5 text-xs">
                Return to Dashboard
              </Link>
              <Link to="/astrologers" className="flex-1 vedic-btn-primary py-2.5 text-xs">
                Try Again
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
