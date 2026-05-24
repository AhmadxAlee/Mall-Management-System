import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../utils/axios'

export const fetchBrands = createAsyncThunk('brands/fetchAll', async (params, { rejectWithValue }) => {
  try {
    const { data } = await api.get('/brands', { params })
    return data
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch brands')
  }
})

export const fetchBrand = createAsyncThunk('brands/fetchOne', async (id, { rejectWithValue }) => {
  try {
    const { data } = await api.get(`/brands/${id}`)
    return data
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch brand')
  }
})

export const createBrand = createAsyncThunk('brands/create', async (brandData, { rejectWithValue }) => {
  try {
    const { data } = await api.post('/brands', brandData)
    return data
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to create brand')
  }
})

export const updateBrand = createAsyncThunk('brands/update', async ({ id, ...brandData }, { rejectWithValue }) => {
  try {
    const { data } = await api.patch(`/brands/${id}`, brandData)
    return data
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to update brand')
  }
})

export const deleteBrand = createAsyncThunk('brands/delete', async (id, { rejectWithValue }) => {
  try {
    await api.delete(`/brands/${id}`)
    return id
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to delete brand')
  }
})

const brandSlice = createSlice({
  name: 'brands',
  initialState: {
    brands: [],
    brand: null,
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
      .addCase(fetchBrands.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchBrands.fulfilled, (state, action) => {
        state.loading = false
        state.brands = action.payload.data.brands
        state.total = action.payload.total
        state.page = action.payload.page
        state.limit = action.payload.limit
      })
      .addCase(fetchBrands.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(createBrand.fulfilled, (state, action) => {
        state.brands.unshift(action.payload.data.brand)
        state.total += 1
      })
      .addCase(updateBrand.fulfilled, (state, action) => {
        const index = state.brands.findIndex((b) => b.id === action.payload.data.brand.id)
        if (index !== -1) state.brands[index] = action.payload.data.brand
      })
      .addCase(deleteBrand.fulfilled, (state, action) => {
        state.brands = state.brands.filter((b) => b.id !== action.payload)
        state.total -= 1
      })
  },
})

export const { clearError } = brandSlice.actions
export default brandSlice.reducer