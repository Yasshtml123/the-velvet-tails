import { useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { initiatePayment, clearError } from '@/features/paymentsSlice.js';

export default function PaymentPage() {
    const { orderId } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { paymentData, isLoading, error } = useSelector((state) => state.payments);
    const formRef = useRef(null);

    useEffect(() => {
        // Initiate payment when component mounts
        dispatch(initiatePayment(orderId));
    }, [dispatch, orderId]);

    useEffect(() => {
        // Auto-submit form when payment data is ready
        if (paymentData && formRef.current) {
            console.log('Submitting PayU form...', paymentData);
            formRef.current.submit();
        }
    }, [paymentData]);

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
                <div className="max-w-md w-full bg-white shadow-md rounded-lg p-8">
                    <div className="text-center">
                        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                            <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Initiation Failed</h2>
                        <p className="text-gray-600 mb-6">{error}</p>
                        <div className="flex flex-col space-y-3">
                            <button
                                onClick={() => {
                                    dispatch(clearError());
                                    dispatch(initiatePayment(orderId));
                                }}
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
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="max-w-md w-full bg-white shadow-md rounded-lg p-8">
                <div className="text-center">
                    {/* Loading Spinner */}
                    <div className="mx-auto flex items-center justify-center h-12 w-12 mb-4">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-velvet-purple"></div>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Initiating Payment</h2>
                    <p className="text-gray-600 mb-4">
                        Please wait while we redirect you to the payment gateway...
                    </p>
                    <p className="text-sm text-gray-500">
                        Do not close this window or press the back button
                    </p>
                </div>

                {/* Hidden PayU Form */}
                {paymentData && (
                    <form
                        ref={formRef}
                        method="POST"
                        action={paymentData.payuUrl}
                        style={{ display: 'none' }}
                    >
                        <input type="hidden" name="key" value={paymentData.key} />
                        <input type="hidden" name="txnid" value={paymentData.txnid} />
                        <input type="hidden" name="amount" value={paymentData.amount} />
                        <input type="hidden" name="productinfo" value={paymentData.productinfo} />
                        <input type="hidden" name="firstname" value={paymentData.firstname} />
                        <input type="hidden" name="email" value={paymentData.email} />
                        <input type="hidden" name="phone" value={paymentData.phone} />
                        <input type="hidden" name="surl" value={paymentData.surl} />
                        <input type="hidden" name="furl" value={paymentData.furl} />
                        <input type="hidden" name="hash" value={paymentData.hash} />
                        <input type="hidden" name="udf1" value={paymentData.udf1} />
                        <input type="hidden" name="udf2" value={paymentData.udf2} />
                        <input type="hidden" name="udf3" value={paymentData.udf3} />
                        <input type="hidden" name="udf4" value={paymentData.udf4 || ''} />
                        <input type="hidden" name="udf5" value={paymentData.udf5 || ''} />
                    </form>
                )}
            </div>
        </div>
    );
}
