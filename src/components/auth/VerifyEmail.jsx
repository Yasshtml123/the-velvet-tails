import { useEffect, useState, useRef } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setCredentials } from '@/features/authSlice.js';
import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function VerifyEmail() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [status, setStatus] = useState('verifying'); // verifying, success, error
    const [message, setMessage] = useState('');
    const [user, setUser] = useState(null);

    // Prevent double execution in React 18 Strict Mode
    const hasVerified = useRef(false);

    useEffect(() => {
        const verifyEmail = async () => {
            // Guard against double execution
            if (hasVerified.current) return;
            hasVerified.current = true;

            const token = searchParams.get('token');

            if (!token) {
                setStatus('error');
                setMessage('Invalid verification link. No token provided.');
                return;
            }

            try {
                const response = await axios.get(`${API_BASE}/auth/verify-email/${token}`, {
                    withCredentials: true
                });

                console.log('Verification response:', response.data);

                setStatus('success');
                setMessage(response.data.message || 'Email verified successfully!');
                setUser(response.data.user);

                // Auto-login if token provided
                if (response.data.accessToken && response.data.user) {
                    localStorage.setItem('accessToken', response.data.accessToken);
                    dispatch(setCredentials({
                        user: response.data.user,
                        accessToken: response.data.accessToken
                    }));

                    // Redirect to home after 2 seconds
                    setTimeout(() => {
                        navigate('/products');
                    }, 2000);
                }
            } catch (error) {
                console.error('Verification error:', error.response?.data || error.message);
                setStatus('error');
                setMessage(error.response?.data?.error || 'Verification failed. Please try again.');
            }
        };

        verifyEmail();
    }, [searchParams, dispatch, navigate]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4">
            <div className="max-w-md w-full">
                <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
                    {status === 'verifying' && (
                        <>
                            <div className="mb-6">
                                <div className="w-16 h-16 mx-auto border-4 border-velvet-purple border-t-transparent rounded-full animate-spin" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">Verifying Your Email</h2>
                            <p className="text-gray-600">Please wait while we verify your email address...</p>
                        </>
                    )}

                    {status === 'success' && (
                        <>
                            <div className="mb-6">
                                <div className="w-20 h-20 mx-auto bg-green-100 rounded-full flex items-center justify-center">
                                    <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">Email Verified! 🎉</h2>
                            <p className="text-gray-600 mb-6">{message}</p>
                            {user && (
                                <p className="text-sm text-gray-500 mb-4">Welcome, {user.name}!</p>
                            )}
                            <p className="text-sm text-gray-500">Redirecting to home page...</p>
                        </>
                    )}

                    {status === 'error' && (
                        <>
                            <div className="mb-6">
                                <div className="w-20 h-20 mx-auto bg-red-100 rounded-full flex items-center justify-center">
                                    <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </div>
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">Verification Failed</h2>
                            <p className="text-gray-600 mb-6">{message}</p>
                            <div className="space-y-3">
                                <Link
                                    to="/register"
                                    className="block w-full py-3 px-4 bg-velvet-purple text-white rounded-lg font-medium hover:bg-velvet-purple/90 transition-colors"
                                >
                                    Register Again
                                </Link>
                                <Link
                                    to="/login"
                                    className="block w-full py-3 px-4 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                                >
                                    Go to Login
                                </Link>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
