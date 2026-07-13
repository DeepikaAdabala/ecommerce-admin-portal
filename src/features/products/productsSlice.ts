import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../../api/axiosInstance';
import type { Product } from '../../types/ecommerce';

interface ProductDraft extends Omit<Product, 'id' | 'status' | 'createdAt'> {}

interface ProductsState {
  items: Product[];
  loading: boolean;
  error: string | null;
}

const initialState: ProductsState = {
  items: [],
  loading: false,
  error: null,
};

export const fetchProducts = createAsyncThunk<Product[], void, { rejectValue: string }>('products/fetch', async () => {
  const response = await api.get('/products') as { products: Product[] };
  return response.products;
});

export const createProduct = createAsyncThunk<Product, ProductDraft, { rejectValue: string }>('products/create', async (payload) => {
  const response = await api.post('/products', payload) as { product: Product };
  return response.product;
});

export const updateProduct = createAsyncThunk<Product, { id: string; payload: ProductDraft }, { rejectValue: string }>('products/update', async ({ id, payload }) => {
  const response = await api.put(`/products/${id}`, payload) as { product: Product };
  return response.product;
});

export const deleteProduct = createAsyncThunk<string, string, { rejectValue: string }>('products/delete', async (id) => {
  await api.delete(`/products/${id}`);
  return id;
});

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? 'Unable to load products.';
      })
      .addCase(createProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.items.unshift(action.payload);
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? 'Unable to create product.';
      })
      .addCase(updateProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.items = state.items.map((item) =>
          item.id === action.payload.id ? action.payload : item,
        );
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? 'Unable to update product.';
      })
      .addCase(deleteProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.items = state.items.filter((item) => item.id !== action.payload);
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? 'Unable to delete product.';
      });
  },
});

export default productsSlice.reducer;
