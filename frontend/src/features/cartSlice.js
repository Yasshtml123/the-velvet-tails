import { createSlice } from '@reduxjs/toolkit';

// Load cart from localStorage
const loadCartFromStorage = () => {
    try {
        const saved = localStorage.getItem('velvet_tails_cart');
        if (saved) {
            const parsed = JSON.parse(saved);
            return {
                items: parsed.items || [],
                discountCode: parsed.discountCode || '',
                shippingAddress: parsed.shippingAddress || null
            };
        }
    } catch (error) {
        console.error('Error loading cart from localStorage:', error);
    }
    return {
        items: [],
        discountCode: '',
        shippingAddress: null
    };
};

// Save cart to localStorage
const saveCartToStorage = (state) => {
    try {
        localStorage.setItem('velvet_tails_cart', JSON.stringify({
            items: state.items,
            discountCode: state.discountCode,
            shippingAddress: state.shippingAddress
        }));
    } catch (error) {
        console.error('Error saving cart to localStorage:', error);
    }
};

const cartSlice = createSlice({
    name: 'cart',
    initialState: loadCartFromStorage(),
    reducers: {
        addToCart: (state, action) => {
            const { product, quantity = 1 } = action.payload;
            const existingItem = state.items.find(item => item.product._id === product._id);

            if (existingItem) {
                existingItem.quantity += quantity;
            } else {
                state.items.push({ product, quantity });
            }
            saveCartToStorage(state);
        },
        removeFromCart: (state, action) => {
            const productId = action.payload;
            state.items = state.items.filter(item => item.product._id !== productId);
            saveCartToStorage(state);
        },
        updateQuantity: (state, action) => {
            const { productId, quantity } = action.payload;
            const item = state.items.find(item => item.product._id === productId);

            if (item) {
                if (quantity <= 0) {
                    state.items = state.items.filter(item => item.product._id !== productId);
                } else {
                    item.quantity = quantity;
                }
            }
            saveCartToStorage(state);
        },
        setDiscountCode: (state, action) => {
            state.discountCode = action.payload;
            saveCartToStorage(state);
        },
        setShippingAddress: (state, action) => {
            state.shippingAddress = action.payload;
            saveCartToStorage(state);
        },
        clearCart: (state) => {
            state.items = [];
            state.discountCode = '';
            state.shippingAddress = null;
            saveCartToStorage(state);
        }
    }
});

export const {
    addToCart,
    removeFromCart,
    updateQuantity,
    setDiscountCode,
    setShippingAddress,
    clearCart
} = cartSlice.actions;

// Selectors
export const selectCartItems = (state) => state.cart.items;
export const selectCartItemCount = (state) =>
    state.cart.items.reduce((total, item) => total + item.quantity, 0);
export const selectCartSubtotal = (state) =>
    state.cart.items.reduce((total, item) => total + (item.product.price * item.quantity), 0);

export default cartSlice.reducer;
