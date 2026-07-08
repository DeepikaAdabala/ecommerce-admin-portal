import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axiosInstance';

export const addOrder = createAsyncThunk('orders/add', async (order) => {
  const response = await api.post('/orders', order);
  return response.order;
});

export const updateOrder = createAsyncThunk('orders/update', async ({ orderId, order }) => {
  const response = await api.put(`/orders/${orderId}`, order);
  return response.order;
});

export const deleteOrder = createAsyncThunk('orders/delete', async (orderId) => {
  await api.delete(`/orders/${orderId}`);
  return orderId;
});
