import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../utils/axios'

export const fetchOutlets = createAsyncThunk('outlets/fetchAll', async (params, { rejectWithValue }) => {
  try {
    const { data } = await api.get('/outlets', { params })
    return data
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch outlets')
  }
})

export const fetchOutlet = createAsyncThunk('outlets/fetchOne', async (id, { rejectWithValue }) => {
  try {
    const { data } = await api.get(`/outlets/${id}`)
    return data
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch outlet')
  }
})

export const createOutlet = createAsyncThunk('outlets/create', async (outletData, { rejectWithValue }) => {
  try {
    const { data } = await api.post('/outlets', outletData)
    return data
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to create outlet')
  }
})

export const updateOutlet = createAsyncThunk('outlets/update', async ({ id, ...outletData }, { rejectWithValue }) => {
  try {
    const { data } = await api.patch(`/outlets/${id}`, outletData)
    return data
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to update outlet')
  }
})

export const deleteOutlet = createAsyncThunk('outlets/delete', async (id, { rejectWithValue }) => {
  try {
    await api.delete(`/outlets/${id}`)
    return id
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to delete outlet')
  }
})

const outletSlice = createSlice({
  name: 'outlets',
  initialState: {
    outlets: [],
    outlet: null,
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
      .addCase(fetchOutlets.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchOutlets.fulfilled, (state, action) => {
        state.loading = false
        state.outlets = action.payload.data.outlets
        state.total = action.payload.total
        state.page = action.payload.page
        state.limit = action.payload.limit
      })
      .addCase(fetchOutlets.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(createOutlet.fulfilled, (state, action) => {
        state.outlets.unshift(action.payload.data.outlet)
        state.total += 1
      })
      .addCase(updateOutlet.fulfilled, (state, action) => {
        const index = state.outlets.findIndex((o) => o.id === action.payload.data.outlet.id)
        if (index !== -1) state.outlets[index] = action.payload.data.outlet
      })
      .addCase(deleteOutlet.fulfilled, (state, action) => {
        state.outlets = state.outlets.filter((o) => o.id !== action.payload)
        state.total -= 1
      })
  },
})

export const { clearError } = outletSlice.actions
export default outletSlice.reducer