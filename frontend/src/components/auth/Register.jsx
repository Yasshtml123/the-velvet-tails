import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { register, clearError, clearRegistrationState, resendVerification } from '@/features/authSlice.js';

export default function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [validationError, setValidationError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, error, isAuthenticated, registrationSuccess, registrationMessage } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    return () => {
      dispatch(clearError());
      dispatch(clearRegistrationState());
    };
  }, [dispatch]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setValidationError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setValidationError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setValidationError('Password must be at least 6 characters');
      return;
    }

    const { confirmPassword, ...registerData } = formData;
    dispatch(register(registerData));
  };

  const handleResendVerification = () => {
    dispatch(resendVerification(formData.email));
  };

  // Show verification success message
  if (registrationSuccess) {
    return (
      <div className="min-h-[calc(100vh-64px)] bg-gray-100 flex items-center justify-center p-4">
        <div className="flex w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Left Side - Success Message */}
          <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-10">
            <div className="w-full max-w-md text-center">
              {/* Success Icon */}
              <div className="mx-auto mb-6 w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 19v-8.93a2 2 0 01.89-1.664l7-4.666a2 2 0 012.22 0l7 4.666A2 2 0 0121 10.07V19M3 19a2 2 0 002 2h14a2 2 0 002-2M3 19l6.75-4.5M21 19l-6.75-4.5M3 10l6.75 4.5M21 10l-6.75 4.5m0 0l-1.14.76a2 2 0 01-2.22 0l-1.14-.76" />
                </svg>
              </div>

              <h2 className="text-2xl font-bold text-gray-900 mb-3">Check Your Email!</h2>
              <p className="text-gray-600 mb-6">{registrationMessage}</p>

              <div className="bg-purple-50 rounded-lg p-4 mb-6">
                <p className="text-sm text-purple-800">
                  We sent a verification link to <strong>{formData.email}</strong>
                </p>
              </div>

              <p className="text-sm text-gray-500 mb-4">
                Didn't receive the email? Check your spam folder or
              </p>

              <button
                onClick={handleResendVerification}
                disabled={isLoading}
                className="w-full py-3 px-4 bg-velvet-purple text-white rounded-lg font-medium hover:bg-velvet-purple/90 transition-colors disabled:opacity-50"
              >
                {isLoading ? 'Sending...' : 'Resend Verification Email'}
              </button>

              <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                <p className="text-xs text-amber-800">
                  <strong>Note:</strong> After verifying, you'll be logged in on the browser where you opened the email link.
                </p>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <Link to="/login" className="text-velvet-purple hover:text-velvet-purple/80 font-medium">
                  Already verified? Go to Login
                </Link>
              </div>
            </div>
          </div>

          {/* Right Side - Logo */}
          <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-purple-100 via-purple-50 to-amber-50 items-center justify-center p-8">
            <div className="text-center">
              <img
                src="/logo/Color logo - no background.svg"
                alt="The Velvet Tails"
                className="w-56 h-auto mx-auto drop-shadow-lg"
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gray-100 flex items-center justify-center p-4">
      <div className="flex w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Left Side - Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-10 overflow-y-auto">
          <div className="w-full max-w-md">
            {/* Header */}
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Create account</h1>
              <p className="text-gray-600">Sign up to get started</p>
            </div>

            {/* Error Message */}
            {(error || validationError) && (
              <div className="mb-6 rounded-lg bg-red-50 border border-red-200 p-4 flex items-start">
                <svg className="h-5 w-5 text-red-400 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <span className="text-sm text-red-800">{error || validationError}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name Field */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-velvet-purple focus:border-transparent transition-all"
                  placeholder="John Doe"
                />
              </div>

              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-velvet-purple focus:border-transparent transition-all"
                  placeholder="you@example.com"
                />
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="block w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-velvet-purple focus:border-transparent transition-all"
                    placeholder="Minimum 6 characters"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? (
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    ) : (
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Confirm Password Field */}
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="block w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-velvet-purple focus:border-transparent transition-all"
                    placeholder="Confirm your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? (
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    ) : (
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 bg-velvet-purple hover:bg-velvet-purple/90 text-white font-medium rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl mt-2"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating account...
                  </span>
                ) : (
                  'Sign Up'
                )}
              </button>
            </form>

            {/* Login Link */}
            <p className="mt-6 text-center text-sm text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="text-velvet-purple hover:text-velvet-purple/80 font-medium">
                Sign in
              </Link>
            </p>

            {/* Footer */}
            <p className="mt-6 text-center text-xs text-gray-500">
              By clicking continue, you agree to our{' '}
              <Link to="/terms" className="text-gray-700 hover:underline">Terms of Services</Link>
              {' '}and{' '}
              <Link to="/privacy-policy" className="text-gray-700 hover:underline">Privacy Policy</Link>
            </p>
          </div>
        </div>

        {/* Right Side - Logo/Brand */}
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-purple-100 via-purple-50 to-amber-50 items-center justify-center p-8">
          <div className="text-center">
            <img
              src="/logo/Color logo - no background.svg"
              alt="The Velvet Tails"
              className="w-56 h-auto mx-auto drop-shadow-lg"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
