import { configureStore } from '@reduxjs/toolkit';
import authReducer from '@/features/authSlice.js';
import productsReducer from '@/features/productsSlice.js';
import discountsReducer from '@/features/discountsSlice.js';
import taxReducer from '@/features/taxSlice.js';
import cartReducer from '@/features/cartSlice.js';
import ordersReducer from '@/features/ordersSlice.js';
import adminOrdersReducer from '@/features/adminOrdersSlice.js';
import paymentsReducer from '@/features/paymentsSlice.js';
import refundsReducer from '@/features/refundsSlice.js';
import returnsReducer from '@/features/returnsSlice.js';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    products: productsReducer,
    discounts: discountsReducer,
    tax: taxReducer,
    cart: cartReducer,
    orders: ordersReducer,
    adminOrders: adminOrdersReducer,
    payments: paymentsReducer,
    refunds: refundsReducer,
    returns: returnsReducer
  },
  devTools: process.env.NODE_ENV !== 'production'
});

export default store;
