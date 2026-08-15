import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

export default function PaymentFailure() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const orderId = searchParams.get('udf1') || searchParams.get('orderId');
    const errorMessage = searchParams.get('error_Message') || 'Payment was unsuccessful';

    useEffect(() => {
        if (!orderId) {
            navigate('/orders');
        }
    }, [orderId, navigate]);

    const handleRetry = () => {
        if (orderId) {
            navigate(`/payment/${orderId}`);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="max-w-md w-full bg-white shadow-md rounded-lg p-8">
                <div className="text-center">
                    {/* Error Icon */}
                    <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-4">
                        <svg className="h-10 w-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </div>

                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Failed</h2>
                    <p className="text-gray-600 mb-6">
                        {errorMessage}
                    </p>

                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                        <p className="text-sm text-yellow-800">
                            Don't worry! Your order has been saved. You can retry the payment or contact support if you continue to face issues.
                        </p>
                    </div>

                    <div className="flex flex-col space-y-3">
                        <button
                            onClick={handleRetry}
                            className="w-full px-6 py-3 bg-velvet-purple text-white rounded-md hover:bg-velvet-purple-dark focus:outline-none focus:ring-2 focus:ring-velvet-purple focus:ring-offset-2"
                        >
                            Retry Payment
                        </button>
                        <button
                            onClick={() => navigate('/orders')}
                            className="w-full px-6 py-3 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                        >
                            View Orders
                        </button>
                        <button
                            onClick={() => navigate('/products')}
                            className="w-full px-6 py-3 text-gray-600 hover:text-gray-800"
                        >
                            Continue Shopping
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
