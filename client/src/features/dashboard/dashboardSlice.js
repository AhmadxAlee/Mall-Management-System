import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../utils/axios'

export const fetchStats = createAsyncThunk('dashboard/fetchStats', async (_, { rejectWithValue }) => {
  try {
    const { data } = await api.get('/dashboard/stats')
    return data
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch stats')
  }
})

export const fetchRecentActivity = createAsyncThunk('dashboard/fetchRecentActivity', async (_, { rejectWithValue }) => {
  try {
    const { data } = await api.get('/dashboard/recent-activity')
    return data
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch recent activity')
  }
})

export const fetchInventoryOverview = createAsyncThunk('dashboard/fetchInventoryOverview', async (_, { rejectWithValue }) => {
  try {
    const { data } = await api.get('/dashboard/inventory-overview')
    return data
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch inventory overview')
  }
})

export const fetchAISummary = createAsyncThunk('dashboard/fetchAISummary', async (_, { rejectWithValue }) => {
  try {
    const { data } = await api.get('/dashboard/ai-summary')
    return data
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch AI summary')
  }
})

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState: {
    stats: null,
    recentActivity: null,
    inventoryOverview: null,
    aiSummary: null,
    aiLoading: false,
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
      .addCase(fetchStats.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchStats.fulfilled, (state, action) => {
        state.loading = false
        state.stats = action.payload.data.stats
      })
      .addCase(fetchStats.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(fetchRecentActivity.fulfilled, (state, action) => {
        state.recentActivity = action.payload.data
      })
      .addCase(fetchInventoryOverview.fulfilled, (state, action) => {
        state.inventoryOverview = action.payload.data.inventory
      })
      .addCase(fetchAISummary.pending, (state) => {
        state.aiLoading = true
      })
      .addCase(fetchAISummary.fulfilled, (state, action) => {
        state.aiLoading = false
        state.aiSummary = action.payload.data.summary
      })
      .addCase(fetchAISummary.rejected, (state) => {
        state.aiLoading = false
      })
  },
})

export const { clearError } = dashboardSlice.actions
export default dashboardSlice.reducer