import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../utils/axios'

export const fetchProducts = createAsyncThunk('products/fetchAll', async (params, { rejectWithValue }) => {
  try {
    const { data } = await api.get('/products', { params })
    return data
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch products')
  }
})

export const fetchLowStockProducts = createAsyncThunk('products/fetchLowStock', async (_, { rejectWithValue }) => {
  try {
    const { data } = await api.get('/products/low-stock')
    return data
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch low stock products')
  }
})

export const createProduct = createAsyncThunk('products/create', async (productData, { rejectWithValue }) => {
  try {
    const { data } = await api.post('/products', productData)
    return data
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to create product')
  }
})

export const updateProduct = createAsyncThunk('products/update', async ({ id, ...productData }, { rejectWithValue }) => {
  try {
    const { data } = await api.patch(`/products/${id}`, productData)
    return data
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to update product')
  }
})

export const deleteProduct = createAsyncThunk('products/delete', async (id, { rejectWithValue }) => {
  try {
    await api.delete(`/products/${id}`)
    return id
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to delete product')
  }
})

const productSlice = createSlice({
  name: 'products',
  initialState: {
    products: [],
    lowStockProducts: [],
    product: null,
    total: 0,
    page: 1,
    limit: 10,
    loading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false
        state.products = action.payload.data.products
        state.total = action.payload.total
        state.page = action.payload.page
        state.limit = action.payload.limit
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(fetchLowStockProducts.fulfilled, (state, action) => {
        state.lowStockProducts = action.payload.data.products
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.products.unshift(action.payload.data.product)
        state.total += 1
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        const index = state.products.findIndex((p) => p.id === action.payload.data.product.id)
        if (index !== -1) state.products[index] = action.payload.data.product
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.products = state.products.filter((p) => p.id !== action.payload)
        state.total -= 1
      })
  },
})

export const { clearError } = productSlice.actions
export default productSlice.reducer