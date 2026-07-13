import { configureStore } from '@reduxjs/toolkit';
import productsReducer from '../features/products/productsSlice';
import customersReducer from '../features/customers/customersSlice';
import ordersReducer from '../features/orders/ordersSlice';
import layoutReducer from '../features/layout/layoutSlice';

const store = configureStore({
  reducer: {
    products: productsReducer,
    customers: customersReducer,
    orders: ordersReducer,
    layout: layoutReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
