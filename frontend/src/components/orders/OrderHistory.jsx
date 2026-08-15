import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { fetchOrders, clearError } from '@/features/ordersSlice.js';
import { formatDate } from '@/utils/formatters.js';

// ── Status badge config ──────────────────────────────────────────────────────
const STATUS_CONFIG = {
  pending:    { label: 'Pending',    bg: 'bg-amber-100',  text: 'text-amber-800',  dot: 'bg-amber-400'  },
  confirmed:  { label: 'Confirmed',  bg: 'bg-blue-100',   text: 'text-blue-800',   dot: 'bg-blue-400'   },
  processing: { label: 'Processing', bg: 'bg-indigo-100', text: 'text-indigo-800', dot: 'bg-indigo-400' },
  shipped:    { label: 'Shipped',    bg: 'bg-purple-100', text: 'text-purple-800', dot: 'bg-purple-400' },
  delivered:  { label: 'Delivered',  bg: 'bg-green-100',  text: 'text-green-800',  dot: 'bg-green-400'  },
  cancelled:  { label: 'Cancelled',  bg: 'bg-red-100',    text: 'text-red-700',    dot: 'bg-red-400'    },
};

function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status] || { label: status, bg: 'bg-gray-100', text: 'text-gray-700', dot: 'bg-gray-400' };
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${cfg.bg} ${cfg.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
}

// ── Skeleton loader ──────────────────────────────────────────────────────────
function OrderSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-blush/30 shadow-sm overflow-hidden animate-pulse">
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="space-y-2">
            <div className="h-4 w-36 bg-blush/60 rounded-full" />
            <div className="h-3 w-24 bg-blush/40 rounded-full" />
          </div>
          <div className="h-6 w-20 bg-blush/40 rounded-full" />
        </div>
        <div className="border-t border-blush/20 pt-4 flex justify-between items-center">
          <div className="space-y-2">
            <div className="h-3 w-16 bg-blush/40 rounded-full" />
            <div className="h-5 w-24 bg-blush/60 rounded-full" />
          </div>
          <div className="h-9 w-28 bg-blush/40 rounded-lg" />
        </div>
      </div>
    </div>
  );
}

// ── Not-logged-in prompt ─────────────────────────────────────────────────────
function LoginPrompt() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-blush to-purple-100 rounded-full flex items-center justify-center shadow-lg">
          <svg className="w-12 h-12 text-plum/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
        <h2 className="text-2xl font-serif font-bold text-charcoal mb-2">Sign in to view orders</h2>
        <p className="text-charcoal/60 font-sans text-sm mb-8">
          Log in to your account to see your full order history and track deliveries.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to="/login"
            state={{ from: { pathname: '/orders' } }}
            className="px-6 py-3 bg-plum text-white rounded-xl font-sans font-semibold hover:bg-plum/90 transition-all shadow-md hover:shadow-lg active:scale-[0.98]"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="px-6 py-3 border-2 border-plum text-plum rounded-xl font-sans font-semibold hover:bg-blush/30 transition-all"
          >
            Create Account
          </Link>
        </div>
      </div>
    </div>
  );
}

// ── Empty state ───────────────────────────────────────────────────────────────
function EmptyOrders() {
  return (
    <div className="text-center py-20 px-4">
      <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-blush to-cream rounded-full flex items-center justify-center shadow-inner">
        <svg className="w-12 h-12 text-plum/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
      </div>
      <h3 className="text-xl font-serif font-semibold text-charcoal mb-2">No orders yet</h3>
      <p className="text-charcoal/50 font-sans text-sm mb-8 max-w-xs mx-auto">
        You haven't placed any orders. Browse our collection and treat your furry friend!
      </p>
      <Link
        to="/products"
        className="inline-flex items-center gap-2 px-6 py-3 bg-plum text-white rounded-xl font-sans font-semibold hover:bg-plum/90 transition-all shadow-md hover:shadow-lg active:scale-[0.98]"
      >
        Start Shopping
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
        </svg>
      </Link>
    </div>
  );
}

// ── Order card ────────────────────────────────────────────────────────────────
function OrderCard({ order, onViewDetails }) {
  const canCancel = order.status === 'pending' || order.status === 'confirmed';

  return (
    <div className="bg-white rounded-2xl border border-blush/30 shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden">
      {/* Card header */}
      <div className="px-6 py-4 bg-gradient-to-r from-cream/60 to-blush/20 border-b border-blush/20 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <p className="text-xs font-sans font-semibold text-charcoal/50 uppercase tracking-wider mb-0.5">
            Order #{order.orderNumber || order._id.slice(-8).toUpperCase()}
          </p>
          <p className="text-xs text-charcoal/40 font-sans">
            Placed {formatDate(order.createdAt)}
          </p>
        </div>
        <StatusBadge status={order.status} />
      </div>

      {/* Card body */}
      <div className="px-6 py-5">
        {/* Items preview */}
        <div className="mb-4">
          <p className="text-sm text-charcoal/60 font-sans">
            {order.items.length} item{order.items.length !== 1 ? 's' : ''}
            {order.items.length > 0 && (
              <span className="text-charcoal/40">
                {' '}— {order.items.slice(0, 2).map(i => i.title).join(', ')}
                {order.items.length > 2 && ` +${order.items.length - 2} more`}
              </span>
            )}
          </p>
        </div>

        {/* Footer row */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-4 border-t border-blush/20">
          <div className="flex items-baseline gap-3">
            <span className="text-xl font-serif font-bold text-charcoal">
              ₹{(order.amount / 100).toFixed(2)}
            </span>
            <span className={`text-xs font-sans px-2 py-0.5 rounded-full ${
              order.payment.status === 'paid'
                ? 'bg-green-50 text-green-700'
                : order.payment.status === 'refunded'
                ? 'bg-blue-50 text-blue-700'
                : 'bg-amber-50 text-amber-700'
            }`}>
              {order.payment.status.charAt(0).toUpperCase() + order.payment.status.slice(1)}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {canCancel && (
              <button
                onClick={() => onViewDetails(order._id)}
                className="px-3 py-2 text-xs font-sans font-medium text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
              >
                Cancel Order
              </button>
            )}
            <button
              onClick={() => onViewDetails(order._id)}
              className="px-4 py-2 text-xs font-sans font-semibold text-plum bg-blush/30 border border-blush/50 rounded-lg hover:bg-blush/60 transition-colors flex items-center gap-1.5"
            >
              View Details
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function OrderHistory() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { orders, isLoading, error } = useSelector((state) => state.orders);
  const { isAuthenticated, isInitialized } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isInitialized && isAuthenticated) {
      dispatch(fetchOrders());
    }
  }, [dispatch, isAuthenticated, isInitialized]);

  // If auth isn't initialised yet, show skeleton (avoids flash)
  if (!isInitialized) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 space-y-4">
        <div className="h-8 w-40 bg-blush/60 rounded-full animate-pulse mb-8" />
        {[1, 2, 3].map(n => <OrderSkeleton key={n} />)}
      </div>
    );
  }

  // Not logged in
  if (!isAuthenticated) {
    return <LoginPrompt />;
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Page header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-serif font-bold text-charcoal">My Orders</h1>
          <p className="text-charcoal/50 font-sans text-sm mt-1">
            Track and manage your purchases
          </p>
        </div>
        {!isLoading && orders.length > 0 && (
          <span className="text-sm font-sans text-charcoal/40">
            {orders.length} order{orders.length !== 1 ? 's' : ''}
          </span>
        )}
      </div>

      {/* Error banner */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-red-500 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <div>
              <p className="text-sm font-semibold text-red-800">Couldn't load orders</p>
              <p className="text-xs text-red-600 mt-0.5">{error}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => dispatch(fetchOrders())}
              className="text-xs font-semibold text-red-700 hover:text-red-900 underline"
            >
              Retry
            </button>
            <button
              onClick={() => dispatch(clearError())}
              className="text-red-400 hover:text-red-600 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Loading skeletons */}
      {isLoading && (
        <div className="space-y-4">
          {[1, 2, 3].map(n => <OrderSkeleton key={n} />)}
        </div>
      )}

      {/* Orders list */}
      {!isLoading && !error && (
        Array.isArray(orders) && orders.length > 0 ? (
          <div className="space-y-4">
            {orders.map((order) => (
              <OrderCard
                key={order._id}
                order={order}
                onViewDetails={(id) => navigate(`/orders/${id}`)}
              />
            ))}
          </div>
        ) : (
          <EmptyOrders />
        )
      )}
    </div>
  );
}
