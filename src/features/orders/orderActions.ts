import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axiosInstance';
import type { Order } from '../../types/ecommerce';

interface OrderInput extends Omit<Order, 'id' | 'productCategory' | 'customerTier'> {}

export const addOrder = createAsyncThunk<Order, OrderInput, { rejectValue: string }>('orders/add', async (order) => {
  const response = await api.post('/orders', order) as { order: Order };
  return response.order;
});

export const updateOrder = createAsyncThunk<Order, { orderId: string; order: OrderInput }, { rejectValue: string }>('orders/update', async ({ orderId, order }) => {
  const response = await api.put(`/orders/${orderId}`, order) as { order: Order };
  return response.order;
});

export const deleteOrder = createAsyncThunk<string, string, { rejectValue: string }>('orders/delete', async (orderId) => {
  await api.delete(`/orders/${orderId}`);
  return orderId;
});
