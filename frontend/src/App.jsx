import { useEffect, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { getCurrentUser } from '@/features/authSlice.js';

// Always load Navbar (needed immediately)
import Navbar from '@/components/layout/Navbar.jsx';
import Footer from '@/components/layout/Footer.jsx';
import PawBackground from '@/components/common/PawBackground.jsx';

// Lazy load all route components
const Login = lazy(() => import('@/components/auth/Login.jsx'));
const Register = lazy(() => import('@/components/auth/Register.jsx'));
const ProtectedRoute = lazy(() => import('@/components/auth/ProtectedRoute.jsx'));
const AdminRoute = lazy(() => import('@/components/auth/AdminRoute.jsx'));
const ProductList = lazy(() => import('@/components/products/ProductList.jsx'));
const ProductDetails = lazy(() => import('@/components/products/ProductDetails.jsx'));
const ProductsTable = lazy(() => import('@/components/admin/ProductsTable.jsx'));
const ProductForm = lazy(() => import('@/components/admin/ProductForm.jsx'));
const DiscountsTable = lazy(() => import('@/components/admin/DiscountsTable.jsx'));
const DiscountForm = lazy(() => import('@/components/admin/DiscountForm.jsx'));
const TaxConfig = lazy(() => import('@/components/admin/TaxConfig.jsx'));
const AdminOrdersTable = lazy(() => import('@/components/admin/AdminOrdersTable.jsx'));
const AdminOrderDetails = lazy(() => import('@/components/admin/AdminOrderDetails.jsx'));
const AdminRefunds = lazy(() => import('@/components/admin/AdminRefunds.jsx'));
const AdminReturns = lazy(() => import('@/components/admin/AdminReturns.jsx'));
const Cart = lazy(() => import('@/components/cart/Cart.jsx'));
const Checkout = lazy(() => import('@/components/checkout/Checkout.jsx'));
const OrderHistory = lazy(() => import('@/components/orders/OrderHistory.jsx'));
const OrderDetails = lazy(() => import('@/components/orders/OrderDetails.jsx'));
const PaymentPage = lazy(() => import('@/components/payment/PaymentPage.jsx'));
const PaymentSuccess = lazy(() => import('@/components/payment/PaymentSuccess.jsx'));
const PaymentFailure = lazy(() => import('@/components/payment/PaymentFailure.jsx'));
const VerifyEmail = lazy(() => import('@/components/auth/VerifyEmail.jsx'));

// Policy Pages
const RefundPolicy = lazy(() => import('@/components/policies/RefundPolicy.jsx'));
const PolicyPages = lazy(() => import('@/components/policies/PolicyPages.jsx').then(m => ({ default: m.PrivacyPolicy })));
const TermsConditions = lazy(() => import('@/components/policies/TermsConditions.jsx'));

// Static Pages
const About = lazy(() => import('@/components/pages/About.jsx'));
const Contact = lazy(() => import('@/components/pages/Contact.jsx'));

// Loading component
const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-velvet-purple"></div>
  </div>
);

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getCurrentUser());
  }, [dispatch]);

  return (
    <Router>
      <div className="min-h-screen bg-gray-50 relative">
        <PawBackground opacity={0.015} count={4} />
        <Navbar />

        {/* Spacer for fixed navbar */}
        <div className="h-16"></div>

        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Navigate to="/products" replace />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/verify-email" element={<VerifyEmail />} />

            {/* Policy Routes */}
            <Route path="/return-policy" element={<RefundPolicy />} />
            <Route path="/privacy-policy" element={<PolicyPages />} />
            <Route path="/terms" element={<TermsConditions />} />

            {/* Static Routes */}
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />

            {/* Product Routes */}
            <Route path="/products" element={<ProductList />} />
            <Route path="/products/:id" element={<ProductDetails />} />

            {/* Admin Routes */}
            <Route
              path="/admin/products"
              element={
                <AdminRoute>
                  <ProductsTable />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/products/new"
              element={
                <AdminRoute>
                  <ProductForm />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/products/edit/:id"
              element={
                <AdminRoute>
                  <ProductForm />
                </AdminRoute>
              }
            />

            {/* Discount Routes */}
            <Route
              path="/admin/discounts"
              element={
                <AdminRoute>
                  <DiscountsTable />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/discounts/new"
              element={
                <AdminRoute>
                  <DiscountForm />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/discounts/:id/edit"
              element={
                <AdminRoute>
                  <DiscountForm />
                </AdminRoute>
              }
            />

            {/* Tax Route */}
            <Route
              path="/admin/tax"
              element={
                <AdminRoute>
                  <TaxConfig />
                </AdminRoute>
              }
            />

            {/* Admin Order Routes */}
            <Route
              path="/admin/orders"
              element={
                <AdminRoute>
                  <AdminOrdersTable />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/orders/:id"
              element={
                <AdminRoute>
                  <AdminOrderDetails />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/refunds"
              element={
                <AdminRoute>
                  <AdminRefunds />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/returns"
              element={
                <AdminRoute>
                  <AdminReturns />
                </AdminRoute>
              }
            />

            {/* Cart & Checkout Routes */}
            <Route path="/cart" element={<Cart />} />
            <Route
              path="/checkout"
              element={
                <ProtectedRoute>
                  <Checkout />
                </ProtectedRoute>
              }
            />

            {/* Order Routes */}
            <Route
              path="/orders"
              element={
                <ProtectedRoute>
                  <OrderHistory />
                </ProtectedRoute>
              }
            />
            <Route
              path="/orders/:id"
              element={
                <ProtectedRoute>
                  <OrderDetails />
                </ProtectedRoute>
              }
            />

            {/* Payment Routes */}
            <Route
              path="/payment/:orderId"
              element={
                <ProtectedRoute>
                  <PaymentPage />
                </ProtectedRoute>
              }
            />
            <Route path="/payment/success" element={<PaymentSuccess />} />
            <Route path="/payment/failure" element={<PaymentFailure />} />

            {/* Catch all */}
            <Route path="*" element={<Navigate to="/products" replace />} />
          </Routes>
        </Suspense>

        <Footer />
      </div>
    </Router>
  );
}

export default App;
