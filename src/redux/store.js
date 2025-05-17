import { configureStore } from '@reduxjs/toolkit';
import cartReducer, { saveCartMiddleware } from './features/cartSlice';
import dataReducer from './features/dataSlice';
import orderReducer from './features/orderSlice';

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    data: dataReducer,
    orders: orderReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // useEffect ve useState içeren objelerin serialization hatalarını önlemek için
        ignoredActions: ['cart/addToCart'],
        ignoredPaths: ['cart.items'],
      },
    }).concat(saveCartMiddleware),
});

export default store; 