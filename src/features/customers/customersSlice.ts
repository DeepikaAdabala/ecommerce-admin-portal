import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../../api/axiosInstance';
import type { Customer } from '../../types/ecommerce';

interface CustomersState {
  items: Customer[];
  loading: boolean;
  error: string | null;
}

const initialState: CustomersState = {
  items: [],
  loading: false,
  error: null,
};

export const fetchCustomers = createAsyncThunk<Customer[], void, { rejectValue: string }>('customers/fetch', async () => {
  const response = await api.get('/customers') as { customers: Customer[] };
  return response.customers;
});

export const createCustomer = createAsyncThunk<Customer, Partial<Customer>, { rejectValue: string }>('customers/create', async (payload) => {
  const response = await api.post('/customers', payload) as { customer: Customer };
  return response.customer;
});

export const updateCustomer = createAsyncThunk<Customer, { id: string; payload: Partial<Customer> }, { rejectValue: string }>('customers/update', async ({ id, payload }) => {
  const response = await api.put(`/customers/${id}`, payload) as { customer: Customer };
  return response.customer;
});

export const deleteCustomer = createAsyncThunk<string, string, { rejectValue: string }>('customers/delete', async (id) => {
  await api.delete(`/customers/${id}`);
  return id;
});

const customersSlice = createSlice({
  name: 'customers',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCustomers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCustomers.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchCustomers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? 'Unable to load customers.';
      })
      .addCase(createCustomer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createCustomer.fulfilled, (state, action) => {
        state.loading = false;
        state.items.unshift(action.payload);
      })
      .addCase(createCustomer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? 'Unable to create customer.';
      })
      .addCase(updateCustomer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCustomer.fulfilled, (state, action) => {
        state.loading = false;
        state.items = state.items.map((item) =>
          item.id === action.payload.id ? action.payload : item,
        );
      })
      .addCase(updateCustomer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? 'Unable to update customer.';
      })
      .addCase(deleteCustomer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteCustomer.fulfilled, (state, action) => {
        state.loading = false;
        state.items = state.items.filter((item) => item.id !== action.payload);
      })
      .addCase(deleteCustomer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? 'Unable to delete customer.';
      });
  },
});

export default customersSlice.reducer;
