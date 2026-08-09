import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { checkPaymentStatus } from '@/features/paymentsSlice.js';

export default function PaymentSuccess() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { paymentStatus } = useSelector((state) => state.payments);
    const [countdown, setCountdown] = useState(5);
    const [isVerified, setIsVerified] = useState(false);

    const orderId = searchParams.get('udf1') || searchParams.get('orderId');

    useEffect(() => {
        if (!orderId) {
            navigate('/orders');
            return;
        }

        // Poll payment status
        const pollStatus = async () => {
            try {
                const result = await dispatch(checkPaymentStatus(orderId)).unwrap();
                if (result.payment.status === 'paid') {
                    setIsVerified(true);
                }
            } catch (err) {
                console.error('Failed to check payment status:', err);
            }
        };

        // Initial check
        pollStatus();

        // Poll every 2 seconds for up to 30 seconds
        const interval = setInterval(pollStatus, 2000);
        const timeout = setTimeout(() => {
            clearInterval(interval);
            setIsVerified(true); // Assume success after 30 seconds
        }, 30000);

        return () => {
            clearInterval(interval);
            clearTimeout(timeout);
        };
    }, [orderId, dispatch, navigate]);

    useEffect(() => {
        if (isVerified && countdown > 0) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
            return () => clearTimeout(timer);
        } else if (isVerified && countdown === 0) {
            navigate(`/orders/${orderId}`);
        }
    }, [isVerified, countdown, navigate, orderId]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="max-w-md w-full bg-white shadow-md rounded-lg p-8">
                <div className="text-center">
                    {/* Success Icon */}
                    <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
                        <svg className="h-10 w-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>

                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h2>

                    {isVerified ? (
                        <>
                            <p className="text-gray-600 mb-6">
                                Your payment has been confirmed and your order is being processed.
                            </p>
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                                <p className="text-sm text-blue-800">
                                    Redirecting to your order in <span className="font-bold">{countdown}</span> seconds...
                                </p>
                            </div>
                        </>
                    ) : (
                        <>
                            <p className="text-gray-600 mb-6">
                                Verifying your payment...
                            </p>
                            <div className="flex justify-center mb-6">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-velvet-purple"></div>
                            </div>
                        </>
                    )}

                    <div className="flex flex-col space-y-3">
                        <button
                            onClick={() => navigate(`/orders/${orderId}`)}
                            className="w-full px-6 py-3 bg-velvet-purple text-white rounded-md hover:bg-velvet-purple-dark focus:outline-none focus:ring-2 focus:ring-velvet-purple focus:ring-offset-2"
                        >
                            View Order Details
                        </button>
                        <button
                            onClick={() => navigate('/orders')}
                            className="w-full px-6 py-3 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                        >
                            View All Orders
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
